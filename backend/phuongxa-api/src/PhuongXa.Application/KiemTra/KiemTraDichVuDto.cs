using FluentValidation;
using PhuongXa.Application.DTOs.DichVu;

namespace PhuongXa.Application.KiemTra;

public class KiemTraTaoDichVuDto : AbstractValidator<TaoDichVuDto>
{
    public KiemTraTaoDichVuDto()
    {
        RuleFor(x => x.Ten)
            .NotEmpty().WithMessage("Tên dịch vụ là bắt buộc")
            .MaximumLength(300).WithMessage("Tên dịch vụ không được vượt quá 300 ký tự");

        RuleFor(x => x.MaDichVu)
            .NotEmpty().WithMessage("Mã dịch vụ là bắt buộc")
            .MaximumLength(50).WithMessage("Mã dịch vụ không được vượt quá 50 ký tự")
            .Matches(@"^[A-Za-z0-9_-]+$").WithMessage("Mã dịch vụ chỉ được chứa chữ cái, chữ số, gạch ngang và gạch dưới");

        RuleFor(x => x.SoNgayXuLy)
            .GreaterThan(0).WithMessage("Số ngày xử lý phải lớn hơn 0");

        RuleFor(x => x.LePhi)
            .GreaterThanOrEqualTo(0).When(x => x.LePhi.HasValue)
            .WithMessage("Lệ phí dịch vụ không được âm");

        RuleFor(x => x.ThuTuSapXep)
            .GreaterThanOrEqualTo(0).WithMessage("Thứ tự sắp xếp không được âm");
    }
}
