using System.ComponentModel.DataAnnotations;

namespace UserMgmt.Api.Dtos;

public class ResetpwdRequest
{
    [Required] public string Token { get; set; } = default!;
    [Required, MinLength(6)] public string NewPassword { get; set; } = default!;
}
