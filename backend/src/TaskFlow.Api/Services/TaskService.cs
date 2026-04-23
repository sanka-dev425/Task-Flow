using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Data;
using TaskFlow.Api.DTOs;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Services;

public class TaskService : ITaskService
{
    private readonly AppDbContext _db;
    private readonly ILogger<TaskService> _logger;

    public TaskService(AppDbContext db, ILogger<TaskService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<IEnumerable<TaskResponseDto>> GetUserTasksAsync(string userId, string? status, CancellationToken ct)
    {
        var query = _db.Tasks.AsNoTracking().Where(t => t.UserId == userId);

        query = status?.ToLowerInvariant() switch
        {
            "pending"   => query.Where(t => !t.IsCompleted),
            "completed" => query.Where(t => t.IsCompleted),
            _           => query
        };

        var tasks = await query
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(ct);

        return tasks.Select(ToDto);
    }

    public async Task<TaskResponseDto> CreateTaskAsync(string userId, CreateTaskDto dto, CancellationToken ct)
    {
        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = dto.Title.Trim(),
            Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim(),
            IsCompleted = false,
            Priority = dto.Priority ?? "medium",
            DueDate = dto.DueDate?.ToUniversalTime(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync(ct);

        _logger.LogInformation("Task {TaskId} created for user {UserId}", task.Id, userId);
        return ToDto(task);
    }

    public async Task<TaskResponseDto?> UpdateTaskAsync(string userId, Guid id, UpdateTaskDto dto, CancellationToken ct)
    {
        var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId, ct);
        if (task is null) return null;

        if (dto.Title is not null) task.Title = dto.Title.Trim();
        if (dto.Description is not null) task.Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim();
        if (dto.IsCompleted.HasValue) task.IsCompleted = dto.IsCompleted.Value;
        if (dto.Priority is not null) task.Priority = dto.Priority;
        if (dto.DueDate.HasValue) task.DueDate = dto.DueDate.Value.ToUniversalTime();
        task.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return ToDto(task);
    }

    public async Task<bool> DeleteTaskAsync(string userId, Guid id, CancellationToken ct)
    {
        var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId, ct);
        if (task is null) return false;

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Task {TaskId} deleted by user {UserId}", id, userId);
        return true;
    }

    private static TaskResponseDto ToDto(TaskItem t) =>
        new(t.Id, t.Title, t.Description, t.IsCompleted, t.Priority, t.DueDate, t.UserId, t.CreatedAt, t.UpdatedAt);
}
