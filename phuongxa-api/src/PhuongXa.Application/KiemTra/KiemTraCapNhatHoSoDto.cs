using FluentValidation;
using PhuongXa.Application.DTOs.HoSo;

namespace PhuongXa.Application.KiemTra;

public class KiemTraCapNhatHoSoDto : AbstractValidator<CapNhatHoSoDto>
{
    public KiemTraCapNhatHoSoDto()
    {
        RuleFor(x => x.HoTen)
            .MaximumLength(100).WithMessage("Họ tên không được vượt quá 100 ký tự")
            .When(x => !string.IsNullOrEmpty(x.HoTen));

        RuleFor(x => x.SoDienThoai)
            .Matches(@"^[0-9+\-\s()]{7,20}$").WithMessage("Số điện thoại không hợp lệ")
            .When(x => !string.IsNullOrEmpty(x.SoDienThoai));
    }
}
