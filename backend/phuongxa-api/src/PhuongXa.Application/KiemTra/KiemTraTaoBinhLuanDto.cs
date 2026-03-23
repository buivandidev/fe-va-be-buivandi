using FluentValidation;
using PhuongXa.Application.DTOs.BinhLuan;

namespace PhuongXa.Application.KiemTra;

public class KiemTraTaoBinhLuanDto : AbstractValidator<TaoBinhLuanDto>
{
    public KiemTraTaoBinhLuanDto()
    {
        RuleFor(x => x.BaiVietId)
            .NotEmpty().WithMessage("Bài viết là bắt buộc");

        RuleFor(x => x.NoiDung)
            .NotEmpty().WithMessage("Nội dung bình luận là bắt buộc")
            .MinimumLength(2).WithMessage("Bình luận phải có ít nhất 2 ký tự")
            .MaximumLength(1000).WithMessage("Bình luận không được vượt quá 1000 ký tự");

        RuleFor(x => x.TenKhach)
            .MaximumLength(100).WithMessage("Tên không được vượt quá 100 ký tự")
            .When(x => !string.IsNullOrEmpty(x.TenKhach));

        RuleFor(x => x.EmailKhach)
            .EmailAddress().WithMessage("Email không hợp lệ")
            .MaximumLength(256).WithMessage("Email không được vượt quá 256 ký tự")
            .When(x => !string.IsNullOrEmpty(x.EmailKhach));
    }
}
