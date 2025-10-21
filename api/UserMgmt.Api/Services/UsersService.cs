using Microsoft.EntityFrameworkCore;
using UserMgmt.Api.Data;
using UserMgmt.Api.Dtos;
using UserMgmt.Api.Models;
using UserMgmt.Api.Security;

namespace UserMgmt.Api.Services;

public interface IUsersService
{
    Task<List<UserResponse>> ListAsync();
    Task<UserResponse> AddAsync(UserRequest req);
    Task<UserResponse?> EditAsync(int id, UserUpdateRequest req);
    Task<bool> RemoveAsync(int id);
}

public class UsersService : IUsersService
{
    private readonly AppDbContext _db;

    public UsersService(AppDbContext db) => _db = db;

    public async Task<List<UserResponse>> ListAsync()
    {
        return await _db.Users
            .OrderBy(u => u.Id)
            .Select(u => new UserResponse
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<UserResponse> AddAsync(UserRequest req)
    {
        // email único
        var exists = await _db.Users.AnyAsync(x => x.Email == req.Email);
        if (exists) throw new InvalidOperationException("Email já registrado.");

        var user = new User
        {
            Name = req.Name,
            Email = req.Email,
            PasswordHash = PasswordHasher.Hash(req.Password),
            Role = string.IsNullOrWhiteSpace(req.Role) ? "user" : req.Role,
            IsActive = req.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<UserResponse?> EditAsync(int id, UserUpdateRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return null;

        if (!string.Equals(user.Email, req.Email, StringComparison.OrdinalIgnoreCase))
        {
            var exists = await _db.Users.AnyAsync(x => x.Email == req.Email && x.Id != id);
            if (exists) throw new InvalidOperationException("Email já registrado.");
        }

        user.Name = req.Name;
        user.Email = req.Email;
        if (!string.IsNullOrWhiteSpace(req.Password))
            user.PasswordHash = PasswordHasher.Hash(req.Password);

        user.Role = string.IsNullOrWhiteSpace(req.Role) ? user.Role : req.Role;
        user.IsActive = req.IsActive;
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<bool> RemoveAsync(int id)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return false;

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return true;
    }
}
