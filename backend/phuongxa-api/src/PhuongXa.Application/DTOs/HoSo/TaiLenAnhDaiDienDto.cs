using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;using Microsoft.AspNetCore.Http;
namespace PhuongXa.Application.DTOs.HoSo;

public class TaiLenAnhDaiDienDto
{
    /// <summary>
    /// Tệp ảnh đại diện cần tải lên.
    /// Chỉ chấp nhận các định dạng ảnh phổ biến (jpg, png, webp, gif).
    /// Kích thước tối đa 5MB.
    /// </summary>
    [Required(ErrorMessage = "Vui lòng chọn một tệp ảnh.")]
    public IFormFile Tep { get; set; } = null!;
}
