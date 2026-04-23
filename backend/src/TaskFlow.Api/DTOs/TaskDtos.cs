using System.ComponentModel.DataAnnotations;

namespace TaskFlow.Api.DTOs;

public record TaskResponseDto(
    Guid Id,
    string Title,
    string? Description,
    bool IsCompleted,
    string? Priority,
    DateTime? DueDate,
    string UserId,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public class CreateTaskDto
{
    [Required(ErrorMessage = "Title is required.")]
    [MinLength(1, ErrorMessage = "Title cannot be empty.")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
    public string? Description { get; set; }

    [MaxLength(20, ErrorMessage = "Priority must be low, medium, or high.")]
    [RegularExpression("^(low|medium|high)$", ErrorMessage = "Priority must be low, medium, or high.")]
    public string? Priority { get; set; } = "medium";

    public DateTime? DueDate { get; set; }
}

public class UpdateTaskDto
{
    [MinLength(1, ErrorMessage = "Title cannot be empty.")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
    public string? Title { get; set; }

    [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
    public string? Description { get; set; }

    public bool? IsCompleted { get; set; }

    [MaxLength(20, ErrorMessage = "Priority must be low, medium, or high.")]
    [RegularExpression("^(low|medium|high)$", ErrorMessage = "Priority must be low, medium, or high.")]
    public string? Priority { get; set; }

    public DateTime? DueDate { get; set; }
}

public record ErrorResponse(string Error, object? Details = null);
