using Microsoft.EntityFrameworkCore;
using UserMgmt.Api.Data;
using UserMgmt.Api.Dtos;
using UserMgmt.Api.Models;
using UserMgmt.Api.Security;

namespace UserMgmt.Api.Services;

public interface IAuthService
{
    Task<User> SignupAsync(SignupRequest req);
    Task<(User user, string token, DateTime expiresAt)> LoginAsync(LoginRequest req);
    Task<string?> ForgotAsync(ForgotRequest req);
    Task<bool> ResetpwdAsync(ResetpwdRequest req);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IJwtToken _jwt;

    public AuthService(AppDbContext db, IJwtToken jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task<User> SignupAsync(SignupRequest req)
    {
        var exists = await _db.Users.AnyAsync(u => u.Email == req.Email);
        if (exists) throw new InvalidOperationException("Email já registrado.");

        var user = new User
        {
            Name = req.Name,
            Email = req.Email,
            PasswordHash = PasswordHasher.Hash(req.Password),
            Role = "user",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return user;
    }

    public async Task<(User user, string token, DateTime expiresAt)> LoginAsync(LoginRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null || !PasswordHasher.Verify(req.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Email ou senha inválido.");

        if (!user.IsActive) throw new UnauthorizedAccessException("Usuário desativado.");

        var (token, exp) = _jwt.Create(user);
        return (user, token, exp);
    }

    public async Task<string?> ForgotAsync(ForgotRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null) return null;

        var token = Guid.NewGuid().ToString("N");
        var prt = new PasswordResetToken
        {
            UserId = user.Id,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(1)
        };
        _db.PasswordResetTokens.Add(prt);
        await _db.SaveChangesAsync();
        Console.WriteLine($"[DEV] Password reset token for {user.Email}: {token}");
        return token;
    }

    public async Task<bool> ResetpwdAsync(ResetpwdRequest req)
{
    var prt = await _db.PasswordResetTokens
        .Include(x => x.User)
        .FirstOrDefaultAsync(x => x.Token == req.Token);

    if (prt == null) return false;
    if (prt.UsedAt != null) return false;
    if (prt.ExpiresAt < DateTime.UtcNow) return false;
    if (prt.User == null) return false;

    prt.User.PasswordHash = PasswordHasher.Hash(req.NewPassword);
    prt.UsedAt = DateTime.UtcNow;

    await _db.SaveChangesAsync();
    return true;
}
}
