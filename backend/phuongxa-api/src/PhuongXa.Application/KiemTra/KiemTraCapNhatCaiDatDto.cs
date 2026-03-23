using FluentValidation;
using PhuongXa.Application.DTOs.CaiDat;

namespace PhuongXa.Application.KiemTra;

public class KiemTraCapNhatCaiDatDto : AbstractValidator<CapNhatCaiDatTrangWebDto>
{
    public KiemTraCapNhatCaiDatDto()
    {
        RuleFor(x => x.GiaTri)
            .MaximumLength(5000).WithMessage("Giá trị không được vượt quá 5000 ký tự")
            .When(x => x.GiaTri != null);
    }
}
