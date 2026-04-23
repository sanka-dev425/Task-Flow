using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;
using TaskFlow.Api.Middleware;
using Xunit;

namespace TaskFlow.Api.Tests;

public class FirebaseAuthMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_Allows_Health_Endpoint_Without_Auth()
    {
        var nextCalled = false;
        var middleware = new FirebaseAuthMiddleware(
            _ =>
            {
                nextCalled = true;
                return Task.CompletedTask;
            },
            NullLogger<FirebaseAuthMiddleware>.Instance);

        var context = new DefaultHttpContext();
        context.Request.Path = "/api/health";

        await middleware.InvokeAsync(context);

        Assert.True(nextCalled);
    }

    [Fact]
    public async Task InvokeAsync_Returns_401_When_Authorization_Header_Missing()
    {
        var middleware = new FirebaseAuthMiddleware(
            _ => Task.CompletedTask,
            NullLogger<FirebaseAuthMiddleware>.Instance);

        var context = new DefaultHttpContext();
        context.Request.Path = "/api/tasks";
        context.Response.Body = new MemoryStream();

        await middleware.InvokeAsync(context);

        Assert.Equal(StatusCodes.Status401Unauthorized, context.Response.StatusCode);

        context.Response.Body.Position = 0;
        using var reader = new StreamReader(context.Response.Body, Encoding.UTF8);
        var response = await reader.ReadToEndAsync();

        Assert.Contains("Missing or malformed Authorization header", response);
    }
}
