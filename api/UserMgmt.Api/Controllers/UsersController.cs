using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserMgmt.Api.Dtos;
using UserMgmt.Api.Services;

namespace UserMgmt.Api.Controllers;

[ApiController]
[Route("users")]
[Authorize] // exige token para todos os endpoints abaixo
public class UsersController : ControllerBase
{
    private readonly IUsersService _svc;

    public UsersController(IUsersService svc) => _svc = svc;

    // GET /users/ListUsers
    [HttpGet("ListUsers")]
    public async Task<IActionResult> ListUsers()
    {
        var list = await _svc.ListAsync();
        return Ok(list);
    }

    // POST /users/AddUser
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

    // PUT /users/EditUsers/{id}
    [HttpPut("EditUsers/{id:int}")]
    public async Task<IActionResult> EditUsers([FromRoute] int id, [FromBody] UserUpdateRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        try
        {
            var updated = await _svc.EditAsync(id, req);
            if (updated == null) return NotFound(new { message = "User not found." });
            return Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    // DELETE /users/RemoveUser/{id}
    [HttpDelete("RemoveUser/{id:int}")]
    public async Task<IActionResult> RemoveUser([FromRoute] int id)
    {
        var ok = await _svc.RemoveAsync(id);
        if (!ok) return NotFound(new { message = "User not found." });
        return NoContent();
    }
}
