using AutoMapper;
using PhuongXa.Application.DTOs.ThuVien;
using PhuongXa.Domain.CacThucThe;

namespace PhuongXa.Application.AnhXa;

public class ThuVienProfile : Profile
{
    public ThuVienProfile()
    {
        CreateMap<TepThuVien, TepThuVienDto>()
            .ForMember(dest => dest.TenNguoiDung, opt => opt.MapFrom(src => src.NguoiDung != null ? src.NguoiDung.HoTen : null));
    }
}
