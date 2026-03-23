using FluentValidation;
using PhuongXa.Application.DTOs.DonUng;

namespace PhuongXa.Application.KiemTra;

public class KiemTraCapNhatTrangThaiDonUngDto : AbstractValidator<CapNhatTrangThaiDonUngDto>
{
    public KiemTraCapNhatTrangThaiDonUngDto()
    {
        RuleFor(x => x.TrangThai)
            .IsInEnum().WithMessage("Trạng thái không hợp lệ");

        RuleFor(x => x.GhiChuNguoiXuLy)
            .MaximumLength(2000).WithMessage("Ghi chú không được vượt quá 2000 ký tự")
            .When(x => x.GhiChuNguoiXuLy != null);
    }
}
