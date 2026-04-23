using Microsoft.AspNetCore.Mvc;
using TaskFlow.Api.DTOs;
using TaskFlow.Api.Middleware;
using TaskFlow.Api.Services;

namespace TaskFlow.Api.Controllers;

[ApiController]
[Route("api/tasks")]
[Produces("application/json")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _service;

    public TasksController(ITaskService service)
    {
        _service = service;
    }

    private string CurrentUserId =>
        HttpContext.Items[FirebaseAuthMiddleware.UserIdKey] as string
        ?? throw new InvalidOperationException("UserId not found in context.");

    /// <summary>GET /api/tasks?status=all|pending|completed</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TaskResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAll([FromQuery] string? status, CancellationToken ct)
    {
        var tasks = await _service.GetUserTasksAsync(CurrentUserId, status, ct);
        return Ok(tasks);
    }

    /// <summary>POST /api/tasks</summary>
    [HttpPost]
    [ProducesResponseType(typeof(TaskResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody] CreateTaskDto dto, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(new ErrorResponse("Validation failed.", FlattenErrors()));

        var created = await _service.CreateTaskAsync(CurrentUserId, dto, ct);
        return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
    }

    /// <summary>PUT /api/tasks/{id}</summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(TaskResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTaskDto dto, CancellationToken ct)
    {
        if (!ModelState.IsValid)
            return BadRequest(new ErrorResponse("Validation failed.", FlattenErrors()));

        var updated = await _service.UpdateTaskAsync(CurrentUserId, id, dto, ct);
        if (updated is null)
            return NotFound(new ErrorResponse("Task not found."));

        return Ok(updated);
    }

    /// <summary>DELETE /api/tasks/{id}</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await _service.DeleteTaskAsync(CurrentUserId, id, ct);
        if (!deleted)
            return NotFound(new ErrorResponse("Task not found."));

        return NoContent();
    }

    private object FlattenErrors() =>
        ModelState
            .Where(e => e.Value!.Errors.Count > 0)
            .ToDictionary(
                e => e.Key,
                e => e.Value!.Errors.Select(err => err.ErrorMessage).ToArray()
            );
}

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new
    {
        status = "healthy",
        timestamp = DateTime.UtcNow,
        firebase = FirebaseAdmin.FirebaseApp.DefaultInstance is not null ? "initialized" : "NOT initialized"
    });
}
