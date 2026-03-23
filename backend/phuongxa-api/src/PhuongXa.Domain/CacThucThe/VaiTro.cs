using Microsoft.AspNetCore.Identity;

namespace PhuongXa.Domain.CacThucThe;

public class VaiTro : IdentityRole<Guid>
{
    public string? MoTa { get; set; }
    public DateTime NgayTao { get; set; } = DateTime.UtcNow;
}
