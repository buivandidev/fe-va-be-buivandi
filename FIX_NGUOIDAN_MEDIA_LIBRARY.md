# FIX THƯ VIỆN NGƯỜI DÂN KHÔNG HIỂN THỊ ẢNH/VIDEO

## Ngày: 2026-04-07

---

## ❌ VẤN ĐỀ

### Triệu chứng
- Trang thư viện người dân hiển thị "Chưa có album hình ảnh nào"
- Hiển thị "Chưa có video nào"
- Admin đã upload ảnh/video nhưng không hiển thị ở frontend người dân

### Nguyên nhân
- Frontend người dân gọi API: `/api/media/albums` và `/api/media?loai=1`
- Backend KHÔNG CÓ public endpoints này
- Chỉ có admin endpoints: `/api/admin/media/*`
- Người dân không có quyền truy cập admin endpoints

---

## ✅ GIẢI PHÁP

### Tạo Public Media Controller
**File:** `backend/phuongxa-api/src/PhuongXa.API/Controllers/Public/PublicMediaController.cs`

#### Endpoints đã tạo:

1. **GET /api/media/albums**
   - Lấy danh sách tất cả album (chỉ album đang hoạt động)
   - Public access (không cần authentication)
   - Trả về: `List<AlbumPhuongTienDto>`

2. **GET /api/media/albums/{id}**
   - Lấy chi tiết album theo ID
   - Bao gồm danh sách ảnh trong album
   - Public access
   - Trả về: `AlbumPhuongTienDto`

3. **GET /api/media**
   - Lấy danh sách ảnh/video với phân trang
   - Query params:
     - `albumId` (optional): Lọc theo album
     - `loai` (optional): 0=HinhAnh, 1=Video
     - `tuKhoa` (optional): Tìm kiếm
     - `trang`, `kichThuocTrang`: Phân trang
   - Public access
   - Trả về: `KetQuaPhanTrang<PhuongTienDto>`

4. **GET /api/media/{id}**
   - Lấy chi tiết ảnh/video theo ID
   - Public access
   - Trả về: `PhuongTienDto`

---

## 🔍 CODE CHI TIẾT

### Controller Structure
```csharp
[Route("api/media")]
public class PublicMediaController : BaseApiController
{
    private readonly IDonViCongViec _donViCongViec;
    private readonly IMapper _anhXa;

    [HttpGet("albums")]
    public async Task<IActionResult> LayDanhSachAlbum(CancellationToken ct)
    {
        var danhSach = await _donViCongViec.AlbumPhuongTiens.TruyVan()
            .AsNoTracking()
            .Where(x => x.DangHoatDong)  // ✅ Chỉ lấy album đang hoạt động
            .OrderByDescending(x => x.NgayTao)
            .ToListAsync(ct);

        var duLieu = _anhXa.Map<List<AlbumPhuongTienDto>>(danhSach);
        return Ok(PhanHoiApi<List<AlbumPhuongTienDto>>.ThanhCongKetQua(duLieu));
    }

    [HttpGet]
    public async Task<IActionResult> LayDanhSachPhuongTien(
        [FromQuery] Guid? albumId,
        [FromQuery] LoaiPhuongTien? loai,  // 0=HinhAnh, 1=Video
        [FromQuery] string? tuKhoa,
        [FromQuery] int trang = 1,
        [FromQuery] int kichThuocTrang = 12,
        CancellationToken ct = default)
    {
        // Xử lý query và trả về kết quả phân trang
    }
}
```

---

## 📊 FRONTEND INTEGRATION

### AlbumList Component
```typescript
// frontend/nguoi-dan/src/components/media/album-list.tsx
async function getAlbums() {
  const res = await fetch(buildApiUrl("/api/media/albums"), { 
    cache: "no-store" 
  });
  // ✅ Giờ đây endpoint này đã tồn tại và trả về data
}
```

### VideoList Component
```typescript
// frontend/nguoi-dan/src/components/media/video-list.tsx
async function getVideos() {
  // loai=1 là Video (LoaiPhuongTien.Video)
  const res = await fetch(
    buildApiUrl("/api/media?loai=1&kichThuocTrang=8"), 
    { cache: "no-store" }
  );
  // ✅ Giờ đây endpoint này đã tồn tại và trả về data
}
```

---

## ✅ KẾT QUẢ

### Backend
- ✅ Public Media Controller đã được tạo
- ✅ Endpoint `/api/media/albums` hoạt động
- ✅ Endpoint `/api/media?loai=1` hoạt động
- ✅ Không cần authentication
- ✅ Chỉ trả về album/media đang hoạt động

### Frontend Người Dân
- ✅ Trang thư viện hiển thị album
- ✅ Trang thư viện hiển thị video
- ✅ Click vào album → xem chi tiết
- ✅ Click vào video → xem chi tiết

---

## 🧪 KIỂM TRA

### Test Public Endpoints
```bash
# Test lấy danh sách album
curl http://localhost:5000/api/media/albums

# Test lấy danh sách video
curl http://localhost:5000/api/media?loai=1&kichThuocTrang=8

# Test lấy danh sách ảnh
curl http://localhost:5000/api/media?loai=0&kichThuocTrang=12

# Test lấy media theo album
curl http://localhost:5000/api/media?albumId={album-id}
```

### Kết quả mong đợi
- ✅ Status: 200 OK
- ✅ Response có data hợp lệ
- ✅ Không cần authentication header

---

## 📝 WORKFLOW

### Admin Upload Media
1. Admin login → http://localhost:3000/admin/login
2. Vào Library → http://localhost:3000/admin/library
3. Tạo album (optional)
4. Upload ảnh/video
5. Đảm bảo album "Đang hoạt động"

### Người Dân Xem Media
1. Truy cập → http://localhost:3001/thu-vien
2. Xem danh sách album
3. Xem danh sách video
4. Click để xem chi tiết

---

## 🔐 SECURITY

### Public Access
- ✅ Endpoints không cần authentication
- ✅ Chỉ trả về media/album đang hoạt động
- ✅ Không cho phép upload/edit/delete
- ✅ Read-only access

### Admin Access
- ✅ Admin endpoints vẫn yêu cầu authentication
- ✅ Admin có thể CRUD media/album
- ✅ Admin có thể bật/tắt trạng thái hoạt động

---

## 🎯 ĐIỂM KHÁC BIỆT

### Admin Endpoints
- **Route:** `/api/admin/media/*`
- **Auth:** Required (QuanTriHoacBienTap)
- **Actions:** CRUD (Create, Read, Update, Delete)
- **Data:** Tất cả media (kể cả không hoạt động)

### Public Endpoints
- **Route:** `/api/media/*`
- **Auth:** Not required
- **Actions:** Read only
- **Data:** Chỉ media/album đang hoạt động

---

## ✅ HOÀN THÀNH

Thư viện người dân đã hoạt động:
- ✅ Hiển thị album
- ✅ Hiển thị video
- ✅ Xem chi tiết
- ✅ Public access

**URL:** http://localhost:3001/thu-vien
