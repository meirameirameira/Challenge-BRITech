using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserMgmt.Api.Dtos;
using UserMgmt.Api.Services;

namespace UserMgmt.Api.Controllers;

[ApiController]
[Route("users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUsersService _svc;

    public UsersController(IUsersService svc) => _svc = svc;

    [HttpGet("ListUsers")]
    public async Task<IActionResult> ListUsers()
    {
        var list = await _svc.ListAsync();
        return Ok(list);
    }

    [HttpPost("AddUser")]
    public async Task<IActionResult> AddUser([FromBody] UserRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        try
        {
            var created = await _svc.AddAsync(req);
            return CreatedAtAction(nameof(AddUser), created);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("EditUsers/{id:int}")]
    public async Task<IActionResult> EditUsers([FromRoute] int id, [FromBody] UserUpdateRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        try
        {
            var updated = await _svc.EditAsync(id, req);
            if (updated == null) return NotFound(new { message = "Usuário não encontrado." });
            return Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("RemoveUser/{id:int}")]
    public async Task<IActionResult> RemoveUser([FromRoute] int id)
    {
        var ok = await _svc.RemoveAsync(id);
        if (!ok) return NotFound(new { message = "Usuário não encontrado." });
        return NoContent();
    }
}
