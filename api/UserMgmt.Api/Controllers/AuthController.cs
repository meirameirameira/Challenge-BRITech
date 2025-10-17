using Microsoft.AspNetCore.Mvc;
using UserMgmt.Api.Dtos;
using UserMgmt.Api.Services;
using Microsoft.AspNetCore.Authorization;

namespace UserMgmt.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _svc;

    public AuthController(IAuthService svc) => _svc = svc;

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        try
        {
            var user = await _svc.SignupAsync(req);
            var response = new
            {
                user = new { user.Id, user.Name, user.Email, user.Role, user.IsActive, user.CreatedAt }
            };
            return CreatedAtAction(nameof(Signup), response);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        try
        {
            var (user, token, exp) = await _svc.LoginAsync(req);
            return Ok(new AuthResponse
            {
                AccessToken = token,
                ExpiresAt = exp,
                User = new { user.Id, user.Name, user.Email, user.Role }
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("forgot")]
    public async Task<IActionResult> Forgot([FromBody] ForgotRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var token = await _svc.ForgotAsync(req);
        // Em produção devolver 202 sem token.
        return Accepted(new { message = "If the email exists, a reset token has been issued.", devToken = token });
    }

    [HttpPost("Resetpwd")]
    [AllowAnonymous]
    public async Task<IActionResult> Resetpwd([FromBody] ResetpwdRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var ok = await _svc.ResetpwdAsync(req);
        if (!ok) return BadRequest(new { message = "Invalid or expired token." });

        return Ok(new { message = "Password updated successfully." });
    }
}
