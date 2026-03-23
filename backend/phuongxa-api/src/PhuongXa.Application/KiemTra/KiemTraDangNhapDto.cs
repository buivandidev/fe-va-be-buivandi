using FluentValidation;
using PhuongXa.Application.DTOs.XacThuc;

namespace PhuongXa.Application.KiemTra;

public class KiemTraDangNhapDto : AbstractValidator<DangNhapDto>
{
    public KiemTraDangNhapDto()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email là bắt buộc")
            .EmailAddress().WithMessage("Email không hợp lệ")
            .MaximumLength(256).WithMessage("Email không được vượt quá 256 ký tự");

        RuleFor(x => x.MatKhau)
            .NotEmpty().WithMessage("Mật khẩu là bắt buộc")
            .MaximumLength(128).WithMessage("Mật khẩu không được vượt quá 128 ký tự");
    }
}
