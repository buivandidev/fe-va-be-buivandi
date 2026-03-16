using FluentValidation;
using PhuongXa.Application.DTOs.XacThuc;

namespace PhuongXa.Application.KiemTra;

public class KiemTraDangKyDto : AbstractValidator<DangKyDto>
{
    public KiemTraDangKyDto()
    {
        RuleFor(x => x.HoTen)
            .NotEmpty().WithMessage("Họ tên là bắt buộc")
            .MaximumLength(100).WithMessage("Họ tên không được vượt quá 100 ký tự");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email là bắt buộc")
            .EmailAddress().WithMessage("Email không hợp lệ")
            .MaximumLength(256).WithMessage("Email không được vượt quá 256 ký tự");

        RuleFor(x => x.MatKhau)
            .NotEmpty().WithMessage("Mật khẩu là bắt buộc")
            .MinimumLength(8).WithMessage("Mật khẩu phải có ít nhất 8 ký tự")
            .MaximumLength(128).WithMessage("Mật khẩu không được vượt quá 128 ký tự")
            .Matches("[A-Z]").WithMessage("Mật khẩu phải có ít nhất 1 chữ hoa")
            .Matches("[0-9]").WithMessage("Mật khẩu phải có ít nhất 1 chữ số")
            .Matches("[^a-zA-Z0-9]").WithMessage("Mật khẩu phải có ít nhất 1 ký tự đặc biệt");

        RuleFor(x => x.XacNhanMatKhau)
            .NotEmpty().WithMessage("Xác nhận mật khẩu là bắt buộc")
            .Equal(x => x.MatKhau).WithMessage("Xác nhận mật khẩu không khớp");

        RuleFor(x => x.SoDienThoai)
            .Matches(@"^[0-9+\-\s()]{7,20}$").WithMessage("Số điện thoại không hợp lệ")
            .When(x => !string.IsNullOrEmpty(x.SoDienThoai));
    }
}
