using FluentValidation;
using PhuongXa.Application.DTOs.PhuongTien;

namespace PhuongXa.Application.KiemTra;

public class KiemTraTaoAlbumPhuongTienDto : AbstractValidator<TaoAlbumPhuongTienDto>
{
    public KiemTraTaoAlbumPhuongTienDto()
    {
        RuleFor(x => x.Ten)
            .NotEmpty().WithMessage("Tên album là bắt buộc")
            .MaximumLength(200).WithMessage("Tên album không được vượt quá 200 ký tự");

        RuleFor(x => x.MoTa)
            .MaximumLength(2000).WithMessage("Mô tả không được vượt quá 2000 ký tự")
            .When(x => x.MoTa != null);
    }
}

public class KiemTraCapNhatAlbumPhuongTienDto : AbstractValidator<CapNhatAlbumPhuongTienDto>
{
    public KiemTraCapNhatAlbumPhuongTienDto()
    {
        RuleFor(x => x.Ten)
            .NotEmpty().WithMessage("Tên album là bắt buộc")
            .MaximumLength(200).WithMessage("Tên album không được vượt quá 200 ký tự");

        RuleFor(x => x.MoTa)
            .MaximumLength(2000).WithMessage("Mô tả không được vượt quá 2000 ký tự")
            .When(x => x.MoTa != null);
    }
}
