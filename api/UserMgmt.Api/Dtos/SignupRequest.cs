using System.ComponentModel.DataAnnotations;

namespace UserMgmt.Api.Dtos;

public class SignupRequest
{
    [Required, StringLength(120, MinimumLength = 2)]
    public string Name { get; set; } = default!;

    [Required, EmailAddress]
    public string Email { get; set; } = default!;

    [Required, MinLength(6)]
    public string Password { get; set; } = default!;
}
