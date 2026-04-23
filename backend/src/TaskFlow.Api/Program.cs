using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Data;
using TaskFlow.Api.Middleware;
using TaskFlow.Api.Services;

try
{
    Console.WriteLine("[STARTUP] Starting TaskFlow API...");
    var builder = WebApplication.CreateBuilder(args);
    Console.WriteLine("[STARTUP] WebApplication builder created.");

// ---- Configuration ----
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrWhiteSpace(connectionString))
    {
        Console.WriteLine("[ERROR] Missing ConnectionStrings:DefaultConnection");
        throw new InvalidOperationException("Missing ConnectionStrings:DefaultConnection.");
    }
    Console.WriteLine("[STARTUP] Connection string loaded.");

var firebaseProjectId = builder.Configuration["Firebase:ProjectId"];
    var firebaseSaPath = builder.Configuration["Firebase:ServiceAccountPath"];
    var firebaseSaJson = builder.Configuration["GOOGLE_APPLICATION_CREDENTIALS_JSON"];
    var firebaseCredentialsBase64 = builder.Configuration["FIREBASE_CREDENTIALS_BASE64"];
    
    Console.WriteLine($"[STARTUP] Firebase ProjectId: {firebaseProjectId ?? "NOT SET"}");
    Console.WriteLine($"[STARTUP] FIREBASE_CREDENTIALS_BASE64: {(string.IsNullOrWhiteSpace(firebaseCredentialsBase64) ? "NOT SET" : "SET (length: " + firebaseCredentialsBase64.Length + ")")}");
    Console.WriteLine($"[STARTUP] GOOGLE_APPLICATION_CREDENTIALS_JSON: {(string.IsNullOrWhiteSpace(firebaseSaJson) ? "NOT SET" : "SET")}");
    Console.WriteLine($"[STARTUP] Firebase ServiceAccountPath: {firebaseSaPath ?? "NOT SET"}");

    // Create a temporary logger for startup errors
    using var loggerFactory = LoggerFactory.Create(logging => logging.AddConsole());
    var logger = loggerFactory.CreateLogger<Program>();

// Support both array and single value for CORS origins (Railway compatibility)
var allowedOriginsSection = builder.Configuration.GetSection("Cors:AllowedOrigins");
var allowedOrigins = allowedOriginsSection.Get<string[]>()
    ?? (string.IsNullOrWhiteSpace(allowedOriginsSection.Value)
        ? new[] { "http://localhost:3000" }
        : allowedOriginsSection.Value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries));

// ---- Services ----
// Use a pinned server version so app boot doesn't require an open MySQL connection.
// (AutoDetect would open a TCP socket at startup and crash the process if MySQL is down.)
var mysqlServerVersion = new MySqlServerVersion(new Version(8, 0, 36));
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, mysqlServerVersion));

builder.Services.AddScoped<ITaskService, TaskService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(opts =>
    {
        opts.SuppressModelStateInvalidFilter = true; // We handle validation explicitly.
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "TaskFlow API", Version = "v1" });
});

// ---- Firebase Admin SDK ----
    Console.WriteLine("[STARTUP] Initializing Firebase Admin SDK...");
    if (FirebaseApp.DefaultInstance is null)
    {
        try
        {
            GoogleCredential credential;
            if (!string.IsNullOrWhiteSpace(firebaseCredentialsBase64))
            {
                Console.WriteLine("[STARTUP] Decoding base64 credentials...");
                // Railway: Base64 encoded JSON from environment variable
                var bytes = Convert.FromBase64String(firebaseCredentialsBase64);
                var json = System.Text.Encoding.UTF8.GetString(bytes);
                Console.WriteLine("[STARTUP] Base64 decoded, parsing credentials...");
                credential = GoogleCredential.FromJson(json);
                logger.LogInformation("Using Firebase credentials from FIREBASE_CREDENTIALS_BASE64.");
            }
            else if (!string.IsNullOrWhiteSpace(firebaseSaJson))
            {
                // Fallback: Raw JSON string from environment variable
                credential = GoogleCredential.FromJson(firebaseSaJson);
                logger.LogInformation("Using Firebase credentials from GOOGLE_APPLICATION_CREDENTIALS_JSON.");
            }
            else if (!string.IsNullOrWhiteSpace(firebaseSaPath) && File.Exists(firebaseSaPath))
            {
                // Local: JSON file path
                credential = GoogleCredential.FromFile(firebaseSaPath);
            }
            else
            {
                // Falls back to GOOGLE_APPLICATION_CREDENTIALS env var or ADC.
                Console.WriteLine("[STARTUP] No explicit credentials, using Application Default Credentials...");
                credential = GoogleCredential.GetApplicationDefault();
            }

            Console.WriteLine("[STARTUP] Creating FirebaseApp...");
            FirebaseApp.Create(new AppOptions
            {
                Credential = credential,
                ProjectId = firebaseProjectId
            });
            Console.WriteLine("[STARTUP] Firebase Admin SDK initialized successfully.");
            logger.LogInformation("Firebase Admin SDK initialized successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERROR] Firebase initialization failed: {ex.Message}");
            Console.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
            logger.LogError(ex, "Failed to initialize Firebase Admin SDK. Authentication will not work.");
        }
    }

Console.WriteLine("[STARTUP] Building application...");
    var app = builder.Build();
    Console.WriteLine("[STARTUP] Application built successfully.");

// ---- Pipeline ----
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseFirebaseAuth();
app.MapControllers();

// Auto-create schema in dev (optional convenience). Tolerates MySQL being unreachable
// at startup so endpoints like /api/health remain inspectable; data endpoints will
// surface the connection error per-request.
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var startupLogger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        db.Database.EnsureCreated();
        startupLogger.LogInformation("Database schema ensured.");
    }
    catch (Exception ex)
    {
        startupLogger.LogWarning(ex,
            "Could not connect to MySQL at startup. The API will keep running; " +
            "data endpoints will fail until the database is reachable.");
    }
}

Console.WriteLine("[STARTUP] Starting server...");
    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"[FATAL ERROR] {ex.GetType().Name}: {ex.Message}");
    Console.WriteLine($"[FATAL ERROR] Stack trace:\n{ex.StackTrace}");
    if (ex.InnerException != null)
    {
        Console.WriteLine($"[FATAL ERROR] Inner exception: {ex.InnerException.Message}");
    }
    throw;
}
