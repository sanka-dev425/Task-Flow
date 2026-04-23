using FirebaseAdmin.Auth;

namespace TaskFlow.Api.Middleware;

/// <summary>
/// Verifies the incoming Firebase ID token (Authorization: Bearer &lt;token&gt;)
/// and attaches the resulting UID to HttpContext.Items["UserId"].
/// </summary>
public class FirebaseAuthMiddleware
{
    public const string UserIdKey = "UserId";
    private readonly RequestDelegate _next;
    private readonly ILogger<FirebaseAuthMiddleware> _logger;

    public FirebaseAuthMiddleware(RequestDelegate next, ILogger<FirebaseAuthMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Let un-authed paths through (swagger, health, etc.)
        var path = context.Request.Path.Value ?? string.Empty;
        if (path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase) ||
            path.Equals("/api/health", StringComparison.OrdinalIgnoreCase) ||
            path.Equals("/", StringComparison.OrdinalIgnoreCase))
        {
            await _next(context);
            return;
        }

        if (!path.StartsWith("/api/", StringComparison.OrdinalIgnoreCase))
        {
            await _next(context);
            return;
        }

        var authHeader = context.Request.Headers.Authorization.ToString();
        if (string.IsNullOrWhiteSpace(authHeader) ||
            !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            await WriteUnauthorized(context, "Missing or malformed Authorization header.");
            return;
        }

        var idToken = authHeader["Bearer ".Length..].Trim();
        if (string.IsNullOrWhiteSpace(idToken))
        {
            await WriteUnauthorized(context, "Empty bearer token.");
            return;
        }

        if (FirebaseAdmin.FirebaseApp.DefaultInstance is null)
        {
            _logger.LogError("Firebase Admin SDK is not initialized. Cannot verify tokens.");
            await WriteUnauthorized(context, "Server authentication not configured.");
            return;
        }

        try
        {
            var decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
            context.Items[UserIdKey] = decoded.Uid;
        }
        catch (FirebaseAuthException ex)
        {
            _logger.LogWarning("Firebase token verification failed: {Message}", ex.Message);
            await WriteUnauthorized(context, "Invalid or expired token.");
            return;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during Firebase token verification.");
            await WriteUnauthorized(context, "Authentication failed.");
            return;
        }

        await _next(context);
    }

    private static async Task WriteUnauthorized(HttpContext ctx, string message)
    {
        ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
        ctx.Response.ContentType = "application/json";
        await ctx.Response.WriteAsJsonAsync(new { error = message });
    }
}

public static class FirebaseAuthMiddlewareExtensions
{
    public static IApplicationBuilder UseFirebaseAuth(this IApplicationBuilder app)
        => app.UseMiddleware<FirebaseAuthMiddleware>();
}
