using FluentValidation;
using PhuongXa.Application.DTOs.XacThuc;

namespace PhuongXa.Application.KiemTra;

public class KiemTraDoiMatKhauDto : AbstractValidator<DoiMatKhauDto>
{
    public KiemTraDoiMatKhauDto()
    {
        RuleFor(x => x.MatKhauHienTai)
            .NotEmpty().WithMessage("Mật khẩu hiện tại là bắt buộc");

        RuleFor(x => x.MatKhauMoi)
            .NotEmpty().WithMessage("Mật khẩu mới là bắt buộc")
            .MinimumLength(8).WithMessage("Mật khẩu mới phải có ít nhất 8 ký tự")
            .MaximumLength(128).WithMessage("Mật khẩu không được vượt quá 128 ký tự")
            .Matches("[A-Z]").WithMessage("Mật khẩu phải có ít nhất 1 chữ hoa")
            .Matches("[0-9]").WithMessage("Mật khẩu phải có ít nhất 1 chữ số")
            .Matches("[^a-zA-Z0-9]").WithMessage("Mật khẩu phải có ít nhất 1 ký tự đặc biệt");

        RuleFor(x => x.XacNhanMatKhauMoi)
            .NotEmpty().WithMessage("Xác nhận mật khẩu là bắt buộc")
            .Equal(x => x.MatKhauMoi).WithMessage("Xác nhận mật khẩu không khớp");
    }
}
