using FluentValidation;
using PhuongXa.Application.DTOs.DichVu;

namespace PhuongXa.Application.KiemTra;

public class KiemTraCapNhatDichVuDto : AbstractValidator<CapNhatDichVuDto>
{
    public KiemTraCapNhatDichVuDto()
    {
        RuleFor(x => x.Ten)
            .NotEmpty().WithMessage("Tên dịch vụ là bắt buộc")
            .MaximumLength(200).WithMessage("Tên dịch vụ không được vượt quá 200 ký tự");

        RuleFor(x => x.MaDichVu)
            .NotEmpty().WithMessage("Mã dịch vụ là bắt buộc")
            .MaximumLength(50).WithMessage("Mã dịch vụ không được vượt quá 50 ký tự");

        RuleFor(x => x.SoNgayXuLy)
            .GreaterThanOrEqualTo(0).WithMessage("Số ngày xử lý không được âm");

        RuleFor(x => x.LePhi)
            .GreaterThanOrEqualTo(0).When(x => x.LePhi.HasValue)
            .WithMessage("Lệ phí dịch vụ không được âm");
    }
}
