using System.ComponentModel.DataAnnotations;

namespace UserMgmt.Api.Dtos;

public class UserUpdateRequest
{
    [Required, StringLength(120, MinimumLength = 2)]
    public string Name { get; set; } = default!;

    [Required, EmailAddress]
    public string Email { get; set; } = default!;

    public string? Password { get; set; }   // opcional
    public string? Role { get; set; } = "user";
    public bool IsActive { get; set; } = true;
}
