using FluentValidation;
using PhuongXa.Application.DTOs.DonUng;

namespace PhuongXa.Application.KiemTra;

public class KiemTraNopDonUngDto : AbstractValidator<NopDonUngDto>
{
    public KiemTraNopDonUngDto()
    {
        RuleFor(x => x.DichVuId)
            .NotEmpty().WithMessage("Dịch vụ là bắt buộc");

        RuleFor(x => x.TenNguoiNop)
            .NotEmpty().WithMessage("Họ tên người nộp là bắt buộc")
            .MaximumLength(100).WithMessage("Họ tên không được vượt quá 100 ký tự");

        RuleFor(x => x.EmailNguoiNop)
            .NotEmpty().WithMessage("Email là bắt buộc")
            .EmailAddress().WithMessage("Email không hợp lệ")
            .MaximumLength(256).WithMessage("Email không được vượt quá 256 ký tự");

        RuleFor(x => x.DienThoaiNguoiNop)
            .NotEmpty().WithMessage("Số điện thoại là bắt buộc")
            .Matches(@"^[0-9+\-\s()]{7,20}$").WithMessage("Số điện thoại không hợp lệ");

        RuleFor(x => x.DiaChiNguoiNop)
            .MaximumLength(300).WithMessage("Địa chỉ không được vượt quá 300 ký tự")
            .When(x => !string.IsNullOrEmpty(x.DiaChiNguoiNop));

        RuleFor(x => x.GhiChu)
            .MaximumLength(1000).WithMessage("Ghi chú không được vượt quá 1000 ký tự")
            .When(x => !string.IsNullOrEmpty(x.GhiChu));
    }
}
