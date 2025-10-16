namespace UserMgmt.Api.Models;

public class PasswordResetToken
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public string Token { get; set; } = default!;
    public DateTime ExpiresAt { get; set; }
    public DateTime? UsedAt { get; set; }

    public User? User { get; set; }   // navegação
}
