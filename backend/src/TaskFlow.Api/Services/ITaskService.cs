using TaskFlow.Api.DTOs;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskResponseDto>> GetUserTasksAsync(string userId, string? status, CancellationToken ct);
    Task<TaskResponseDto> CreateTaskAsync(string userId, CreateTaskDto dto, CancellationToken ct);
    Task<TaskResponseDto?> UpdateTaskAsync(string userId, Guid id, UpdateTaskDto dto, CancellationToken ct);
    Task<bool> DeleteTaskAsync(string userId, Guid id, CancellationToken ct);
}
