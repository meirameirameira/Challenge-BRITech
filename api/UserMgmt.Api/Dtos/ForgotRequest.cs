using System.ComponentModel.DataAnnotations;

namespace UserMgmt.Api.Dtos;

public class ForgotRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = default!;
}
