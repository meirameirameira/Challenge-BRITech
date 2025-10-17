using System.ComponentModel.DataAnnotations;

namespace UserMgmt.Api.Dtos;

public class LoginRequest
{
    [Required, EmailAddress] public string Email { get; set; } = default!;
    [Required] public string Password { get; set; } = default!;
}
