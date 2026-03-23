using FluentValidation;
using PhuongXa.Application.DTOs.BaiViet;

namespace PhuongXa.Application.KiemTra;

public class KiemTraTaoBaiVietDto : AbstractValidator<TaoBaiVietDto>
{
    public KiemTraTaoBaiVietDto()
    {
        RuleFor(x => x.TieuDe)
            .NotEmpty().WithMessage("Tiêu đề là bắt buộc")
            .MinimumLength(5).WithMessage("Tiêu đề phải có ít nhất 5 ký tự")
            .MaximumLength(300).WithMessage("Tiêu đề không được vượt quá 300 ký tự");

        RuleFor(x => x.TomTat)
            .MaximumLength(500).WithMessage("Tóm tắt không được vượt quá 500 ký tự")
            .When(x => !string.IsNullOrEmpty(x.TomTat));

        RuleFor(x => x.NoiDung)
            .NotEmpty().WithMessage("Nội dung là bắt buộc")
            .MaximumLength(100_000).WithMessage("Nội dung không được vượt quá 100.000 ký tự");

        RuleFor(x => x.DanhMucId)
            .NotEmpty().WithMessage("Danh mục là bắt buộc");

        RuleFor(x => x.TieuDeMeta)
            .MaximumLength(200).WithMessage("Tiêu đề meta không được vượt quá 200 ký tự")
            .When(x => !string.IsNullOrEmpty(x.TieuDeMeta));

        RuleFor(x => x.MoTaMeta)
            .MaximumLength(500).WithMessage("Mô tả meta không được vượt quá 500 ký tự")
            .When(x => !string.IsNullOrEmpty(x.MoTaMeta));

        RuleFor(x => x.TheTag)
            .MaximumLength(500).WithMessage("Thẻ tag không được vượt quá 500 ký tự")
            .When(x => !string.IsNullOrEmpty(x.TheTag));

        RuleFor(x => x.AnhDaiDien)
            .MaximumLength(500).WithMessage("Đường dẫn ảnh đại diện không được vượt quá 500 ký tự")
            .When(x => !string.IsNullOrEmpty(x.AnhDaiDien));
    }
}

public class KiemTraCapNhatBaiVietDto : AbstractValidator<CapNhatBaiVietDto>
{
    public KiemTraCapNhatBaiVietDto()
    {
        RuleFor(x => x.TieuDe)
            .NotEmpty().WithMessage("Tiêu đề là bắt buộc")
            .MinimumLength(5).WithMessage("Tiêu đề phải có ít nhất 5 ký tự")
            .MaximumLength(300).WithMessage("Tiêu đề không được vượt quá 300 ký tự");

        RuleFor(x => x.TomTat)
            .MaximumLength(500).WithMessage("Tóm tắt không được vượt quá 500 ký tự")
            .When(x => !string.IsNullOrEmpty(x.TomTat));

        RuleFor(x => x.NoiDung)
            .NotEmpty().WithMessage("Nội dung là bắt buộc")
            .MaximumLength(100_000).WithMessage("Nội dung không được vượt quá 100.000 ký tự");

        RuleFor(x => x.DanhMucId)
            .NotEmpty().WithMessage("Danh mục là bắt buộc");

        RuleFor(x => x.TieuDeMeta)
            .MaximumLength(200).WithMessage("Tiêu đề meta không được vượt quá 200 ký tự")
            .When(x => !string.IsNullOrEmpty(x.TieuDeMeta));

        RuleFor(x => x.MoTaMeta)
            .MaximumLength(500).WithMessage("Mô tả meta không được vượt quá 500 ký tự")
            .When(x => !string.IsNullOrEmpty(x.MoTaMeta));

        RuleFor(x => x.TheTag)
            .MaximumLength(500).WithMessage("Thẻ tag không được vượt quá 500 ký tự")
            .When(x => !string.IsNullOrEmpty(x.TheTag));

        RuleFor(x => x.AnhDaiDien)
            .MaximumLength(500).WithMessage("Đường dẫn ảnh đại diện không được vượt quá 500 ký tự")
            .When(x => !string.IsNullOrEmpty(x.AnhDaiDien));
    }
}
