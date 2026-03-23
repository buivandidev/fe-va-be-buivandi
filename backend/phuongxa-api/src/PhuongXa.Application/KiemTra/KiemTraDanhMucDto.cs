using FluentValidation;
using PhuongXa.Application.DTOs.DanhMuc;

namespace PhuongXa.Application.KiemTra;

public class KiemTraTaoDanhMucDto : AbstractValidator<TaoDanhMucDto>
{
    public KiemTraTaoDanhMucDto()
    {
        RuleFor(x => x.Ten)
            .NotEmpty().WithMessage("Tên danh mục là bắt buộc")
            .MaximumLength(200).WithMessage("Tên danh mục không được vượt quá 200 ký tự");

        RuleFor(x => x.Loai)
            .IsInEnum().WithMessage("Loại danh mục không hợp lệ");

        RuleFor(x => x.ThuTuSapXep)
            .GreaterThanOrEqualTo(0).WithMessage("Thứ tự sắp xếp không được âm");
    }
}

public class KiemTraCapNhatDanhMucDto : AbstractValidator<CapNhatDanhMucDto>
{
    public KiemTraCapNhatDanhMucDto()
    {
        RuleFor(x => x.Ten)
            .NotEmpty().WithMessage("Tên danh mục là bắt buộc")
            .MaximumLength(200).WithMessage("Tên danh mục không được vượt quá 200 ký tự");

        RuleFor(x => x.Loai)
            .IsInEnum().WithMessage("Loại danh mục không hợp lệ");

        RuleFor(x => x.ThuTuSapXep)
            .GreaterThanOrEqualTo(0).WithMessage("Thứ tự sắp xếp không được âm");
    }
}
