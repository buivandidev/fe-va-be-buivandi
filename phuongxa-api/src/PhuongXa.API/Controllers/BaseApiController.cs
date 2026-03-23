using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace PhuongXa.API.Controllers;

public class NguoiDungChuaXacThucException : Exception
{
    public NguoiDungChuaXacThucException()
        : base("Không xác định được người dùng hiện tại") { }

    public NguoiDungChuaXacThucException(string message)
        : base(message) { }

    public NguoiDungChuaXacThucException(string message, Exception innerException)
        : base(message, innerException) { }
}

[ApiController]
public abstract class BaseApiController : ControllerBase
{
    protected Guid IdNguoiDungHienTai
    {
        get
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(claim, out var id))
                throw new NguoiDungChuaXacThucException();
            return id;
        }
    }

    protected Guid? IdNguoiDungGuidHoacNull
    {
        get
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(claim, out var id) ? id : null;
        }
    }

    protected static (int page, int pageSize) ChuanHoaPhanTrang(
        int page, int pageSize, int maxPageSize = 100)
    {
        return (Math.Max(page, 1), Math.Clamp(pageSize, 1, maxPageSize));
    }
}
