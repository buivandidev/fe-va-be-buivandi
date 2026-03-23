using FluentValidation;
using PhuongXa.Application.DTOs.LienHe;

namespace PhuongXa.Application.KiemTra;

public class KiemTraTaoTinNhanLienHeDto : AbstractValidator<TaoTinNhanLienHeDto>
{
    public KiemTraTaoTinNhanLienHeDto()
    {
        RuleFor(x => x.HoTen)
            .NotEmpty().WithMessage("Họ tên là bắt buộc")
            .MaximumLength(100).WithMessage("Họ tên không được vượt quá 100 ký tự");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email là bắt buộc")
            .EmailAddress().WithMessage("Email không hợp lệ")
            .MaximumLength(256).WithMessage("Email không được vượt quá 256 ký tự");

        RuleFor(x => x.DienThoai)
            .Matches(@"^[0-9+\-\s()]{7,20}$").WithMessage("Số điện thoại không hợp lệ")
            .When(x => !string.IsNullOrEmpty(x.DienThoai));

        RuleFor(x => x.ChuDe)
            .NotEmpty().WithMessage("Chủ đề là bắt buộc")
            .MaximumLength(200).WithMessage("Chủ đề không được vượt quá 200 ký tự");

        RuleFor(x => x.NoiDung)
            .NotEmpty().WithMessage("Nội dung là bắt buộc")
            .MinimumLength(10).WithMessage("Nội dung phải có ít nhất 10 ký tự")
            .MaximumLength(2000).WithMessage("Nội dung không được vượt quá 2000 ký tự");
    }
}
