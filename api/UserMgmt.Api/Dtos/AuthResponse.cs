namespace UserMgmt.Api.Dtos;

public class AuthResponse
{
    public string AccessToken { get; set; } = default!;
    public DateTime ExpiresAt { get; set; }
    public object User { get; set; } = default!;
}
