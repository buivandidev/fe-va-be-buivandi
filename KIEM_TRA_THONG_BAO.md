# ✅ Kiểm Tra Hệ Thống Thông Báo

## 📊 Tổng Quan

Hệ thống thông báo đã được implement đầy đủ:
- ✅ Backend tự động tạo thông báo khi admin cập nhật trạng thái hồ sơ
- ✅ Frontend người dân hiển thị thông báo
- ✅ API endpoints đầy đủ
- ✅ Đếm số thông báo chưa đọc
- ✅ Đánh dấu đã đọc

---

## 🔍 Chi Tiết Luồng Thông Báo

### 1. Backend - Tự Động Tạo Thông Báo

**File:** `backend/phuongxa-api/src/PhuongXa.API/Controllers/Admin/AdminApplicationsController.cs`

**Khi admin cập nhật trạng thái hồ sơ:**

```csharp
[HttpPatch("{id:guid}/status")]
public async Task<IActionResult> CapNhatTrangThai(Guid id, [FromBody] CapNhatTrangThaiDonUngDto yeuCau, CancellationToken ct)
{
    // ... cập nhật trạng thái hồ sơ ...
    
    // ✅ TỰ ĐỘNG TẠO THÔNG BÁO CHO NGƯỜI DÂN
    if (donUng.NguoiDungId.HasValue)
    {
        await _donViCongViec.ThongBaos.ThemAsync(new ThongBao { 
            NguoiDungId = donUng.NguoiDungId.Value, 
            TieuDe = $"Ho so {donUng.MaTheoDoi} da thay doi trang thai", 
            NoiDung = $"Trang thai moi: {donUng.TrangThai}", 
            LienKet = $"/ho-so/{donUng.Id}", 
            Loai = LoaiThongBao.TrangThaiDonUngThayDoi, 
            DaDoc = false 
        }, ct);
    }
    
    await _donViCongViec.LuuThayDoiAsync(ct);
    
    // ✅ GỬI EMAIL THÔNG BÁO
    _ = Task.Run(async () =>
    {
        try
        {
            await _dichVuEmail.GuiTrangThaiDonThayDoiAsync(
                donUng.EmailNguoiNop, 
                donUng.TenNguoiNop, 
                donUng.MaTheoDoi, 
                donUng.DichVu.Ten, 
                donUng.TrangThai.ToString(), 
                yeuCau.GhiChuNguoiXuLy
            );
        }
        catch { }
    }, CancellationToken.None);
    
    return Ok(PhanHoiApi.ThanhCongKetQua("Cap nhat trang thai ho so thanh cong"));
}
```

**Thông tin thông báo được tạo:**
- `TieuDe`: "Ho so {MaTheoDoi} da thay doi trang thai"
- `NoiDung`: "Trang thai moi: {TrangThai}"
- `LienKet`: "/ho-so/{Id}" - Link đến chi tiết hồ sơ
- `Loai`: TrangThaiDonUngThayDoi
- `DaDoc`: false (chưa đọc)

---

### 2. Backend - API Endpoints Thông Báo

**File:** `backend/phuongxa-api/src/PhuongXa.API/Controllers/Public/PublicNotificationsController.cs`

#### ✅ GET `/api/public/notifications`
Lấy danh sách thông báo của người dùng hiện tại

**Query Parameters:**
- `chiChuaDoc` (bool, optional) - Chỉ lấy thông báo chưa đọc
- `trang` (int, default: 1) - Trang hiện tại
- `kichThuocTrang` (int, default: 20) - Số thông báo mỗi trang

**Response:**
```json
{
  "success": true,
  "data": {
    "danhSach": [
      {
        "id": "guid",
        "tieuDe": "Ho so HS20260407123456 da thay doi trang thai",
        "noiDung": "Trang thai moi: HoanThanh",
        "lienKet": "/ho-so/guid",
        "daDoc": false,
        "ngayTao": "2026-04-07T10:00:00Z"
      }
    ],
    "tongSo": 10,
    "trang": 1,
    "kichThuocTrang": 20
  }
}
```

#### ✅ GET `/api/public/notifications/count`
Đếm số thông báo chưa đọc

**Response:**
```json
{
  "success": true,
  "data": {
    "soLuongChuaDoc": 5
  }
}
```

#### ✅ PATCH `/api/public/notifications/{id}/read`
Đánh dấu một thông báo đã đọc

**Response:**
```json
{
  "success": true,
  "message": "Đã đánh dấu đã đọc"
}
```

#### ✅ PATCH `/api/public/notifications/read-all`
Đánh dấu tất cả thông báo đã đọc

**Response:**
```json
{
  "success": true,
  "message": "Đã đánh dấu 5 thông báo đã đọc"
}
```

#### ✅ DELETE `/api/public/notifications/{id}`
Xóa một thông báo

**Response:**
```json
{
  "success": true,
  "message": "Xóa thông báo thành công"
}
```

---

### 3. Frontend - Trang Thông Báo Người Dân

**File:** `frontend/nguoi-dan/src/app/ca-nhan/thong-bao/page.tsx`

#### ✅ Tính Năng

**1. Hiển thị danh sách thông báo**
- Thông báo chưa đọc: Nền xanh nhạt, có chấm xanh
- Thông báo đã đọc: Nền trắng, không có chấm
- Hiển thị: Tiêu đề, Nội dung, Thời gian (tương đối)
- Link "Xem chi tiết" nếu có `lienKet`

**2. Đếm số thông báo chưa đọc**
- Badge đỏ hiển thị số lượng
- Hiển thị "99+" nếu > 99
- Cập nhật real-time

**3. Đánh dấu đã đọc tất cả**
- Nút "Đánh dấu đã đọc tất cả"
- Disable khi không có thông báo chưa đọc
- Hiển thị "Đang cập nhật..." khi đang xử lý

**4. Thời gian tương đối**
- "X phút trước" (< 60 phút)
- "X giờ trước" (< 24 giờ)
- "X ngày trước" (>= 24 giờ)

#### ✅ UI Components

```typescript
// Badge số thông báo chưa đọc
<span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
  {unreadBadge}
</span>

// Thông báo chưa đọc
<div className="p-4 sm:p-6 bg-blue-50/50">
  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full">
    <span className="material-symbols-outlined">notifications</span>
  </div>
  <h4 className="text-slate-900 font-bold">{tieuDe}</h4>
  <p className="text-slate-600">{noiDung}</p>
  <Link href={link}>Xem chi tiết</Link>
  <div className="w-2 h-2 rounded-full bg-blue-500"></div> {/* Chấm xanh */}
</div>

// Thông báo đã đọc
<div className="p-4 sm:p-6 bg-white">
  <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full">
    <span className="material-symbols-outlined">notifications</span>
  </div>
  <h4 className="text-slate-700 font-bold">{tieuDe}</h4>
  <p className="text-slate-600">{noiDung}</p>
</div>
```

---

### 4. Frontend - Trang Cá Nhân (Hiển thị Số Thông Báo)

**File:** `frontend/nguoi-dan/src/app/ca-nhan/page.tsx`

```typescript
// Gọi API đếm thông báo
const countRes = await fetch(`${API_BASE}/api/public/notifications/count`, {
  headers: { Authorization: `Bearer ${token}` },
  cache: 'no-store'
});

// Hiển thị badge
<div className="bg-white rounded-xl border border-slate-200 p-6">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
        <span className="material-symbols-outlined text-yellow-600">notifications</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{notificationCount}</p>
        <p className="text-sm text-slate-500">Thông báo mới</p>
      </div>
    </div>
    <Link href="/ca-nhan/thong-bao">
      <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
    </Link>
  </div>
</div>
```

---

## 🎯 Kịch Bản Kiểm Tra

### Kịch Bản 1: Admin Cập Nhật Trạng Thái Hồ Sơ

**Bước 1:** Admin đăng nhập vào trang admin
- URL: `http://localhost:3000/admin/login`

**Bước 2:** Vào trang "Quản lý hồ sơ"
- URL: `http://localhost:3000/admin/applications`

**Bước 3:** Click "Chi tiết" hoặc "Cập nhật" trên một hồ sơ

**Bước 4:** Thay đổi trạng thái
- Chọn trạng thái mới: "Chờ xử lý" → "Đang xử lý" → "Hoàn thành"
- Nhập ghi chú (optional)
- Click "Cập nhật"

**Kết quả mong đợi:**
- ✅ Hồ sơ được cập nhật trạng thái
- ✅ Thông báo được tạo tự động trong database
- ✅ Email được gửi cho người nộp hồ sơ (nếu có email)

---

### Kịch Bản 2: Người Dân Xem Thông Báo

**Bước 1:** Người dân đăng nhập
- URL: `http://localhost:3001/dang-nhap`

**Bước 2:** Vào trang "Cá nhân"
- URL: `http://localhost:3001/ca-nhan`
- Kiểm tra: Số thông báo mới hiển thị đúng

**Bước 3:** Click vào "Hộp thư thông báo"
- URL: `http://localhost:3001/ca-nhan/thong-bao`

**Kết quả mong đợi:**
- ✅ Hiển thị danh sách thông báo
- ✅ Thông báo mới có nền xanh nhạt + chấm xanh
- ✅ Thông báo đã đọc có nền trắng
- ✅ Badge đỏ hiển thị số thông báo chưa đọc
- ✅ Thời gian hiển thị tương đối (X phút/giờ/ngày trước)

**Bước 4:** Click "Xem chi tiết" trên thông báo
- Chuyển đến trang chi tiết hồ sơ
- URL: `http://localhost:3001/ho-so/{id}`

**Bước 5:** Click "Đánh dấu đã đọc tất cả"
- Tất cả thông báo chuyển sang trạng thái đã đọc
- Badge số thông báo chưa đọc = 0

---

## 🐛 Kiểm Tra Lỗi

### Lỗi 1: Không thấy thông báo mới

**Nguyên nhân có thể:**
1. Backend không tạo thông báo
2. Frontend gọi sai endpoint
3. Token không hợp lệ
4. Database không có dữ liệu

**Cách kiểm tra:**

```sql
-- Kiểm tra database
SELECT * FROM ThongBaos 
WHERE NguoiDungId = 'user-guid' 
ORDER BY NgayTao DESC;
```

```powershell
# Kiểm tra API
curl http://localhost:5000/api/public/notifications/count `
  -H "Authorization: Bearer YOUR_TOKEN"
```

```javascript
// Kiểm tra console log
// Mở DevTools (F12) → Console
// Xem có lỗi gì không
```

---

### Lỗi 2: Số thông báo không đúng

**Nguyên nhân có thể:**
1. API `/api/public/notifications/count` trả về sai
2. Frontend parse sai dữ liệu
3. Cache cũ

**Cách kiểm tra:**

```powershell
# Kiểm tra API count
curl http://localhost:5000/api/public/notifications/count `
  -H "Authorization: Bearer YOUR_TOKEN"
```

```javascript
// Kiểm tra response
// DevTools → Network → Tìm request "count"
// Xem response có đúng không
```

---

### Lỗi 3: Không đánh dấu được đã đọc

**Nguyên nhân có thể:**
1. API `/api/public/notifications/read-all` lỗi
2. Token hết hạn
3. Database connection lỗi

**Cách kiểm tra:**

```powershell
# Kiểm tra API read-all
curl -X PATCH http://localhost:5000/api/public/notifications/read-all `
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✅ Checklist Hoàn Chỉnh

### Backend
- [x] Tự động tạo thông báo khi cập nhật trạng thái hồ sơ
- [x] Gửi email thông báo (background task)
- [x] API GET `/api/public/notifications` - Lấy danh sách
- [x] API GET `/api/public/notifications/count` - Đếm chưa đọc
- [x] API PATCH `/api/public/notifications/{id}/read` - Đánh dấu đã đọc
- [x] API PATCH `/api/public/notifications/read-all` - Đánh dấu tất cả
- [x] API DELETE `/api/public/notifications/{id}` - Xóa thông báo
- [x] Authorization: Chỉ người dùng hiện tại xem được thông báo của mình

### Frontend - Trang Thông Báo
- [x] Hiển thị danh sách thông báo
- [x] Phân biệt đã đọc / chưa đọc (màu nền + chấm xanh)
- [x] Hiển thị thời gian tương đối
- [x] Link "Xem chi tiết" đến hồ sơ
- [x] Badge số thông báo chưa đọc
- [x] Nút "Đánh dấu đã đọc tất cả"
- [x] Loading state
- [x] Empty state (chưa có thông báo)
- [x] Responsive design

### Frontend - Trang Cá Nhân
- [x] Hiển thị số thông báo mới
- [x] Link đến trang thông báo
- [x] Icon thông báo

### Database
- [x] Bảng `ThongBaos` có đầy đủ fields
- [x] Index trên `NguoiDungId` và `DaDoc`
- [x] Soft delete (DaXoa)

---

## 🎯 Kết Luận

**✅ HỆ THỐNG THÔNG BÁO ĐÃ HOÀN CHỈNH**

Tất cả các tính năng đã được implement đầy đủ:

1. ✅ **Backend tự động tạo thông báo** khi admin cập nhật trạng thái hồ sơ
2. ✅ **Gửi email thông báo** cho người nộp hồ sơ
3. ✅ **API endpoints đầy đủ** (lấy danh sách, đếm, đánh dấu đã đọc, xóa)
4. ✅ **Frontend hiển thị thông báo** với UI đẹp và UX tốt
5. ✅ **Phân biệt đã đọc / chưa đọc** rõ ràng
6. ✅ **Badge số thông báo chưa đọc** real-time
7. ✅ **Link đến chi tiết hồ sơ** từ thông báo
8. ✅ **Thời gian tương đối** dễ đọc

**Hệ thống đã sẵn sàng sử dụng!**

---

## 📸 Screenshots Mong Đợi

### Trang Thông Báo (Có thông báo mới)
```
┌─────────────────────────────────────────────────────────┐
│ Hộp thư thông báo                    [Đánh dấu đã đọc] │
├─────────────────────────────────────────────────────────┤
│ 🔵 Ho so HS20260407123456 da thay doi trang thai  •    │
│    Trang thai moi: HoanThanh                            │
│    Xem chi tiết                          5 phút trước   │
├─────────────────────────────────────────────────────────┤
│ ⚪ Ho so HS20260407123455 da thay doi trang thai       │
│    Trang thai moi: DangXuLy                             │
│    Xem chi tiết                          2 giờ trước    │
└─────────────────────────────────────────────────────────┘
```

### Trang Cá Nhân (Badge thông báo)
```
┌─────────────────────────────────────────────────────────┐
│ 📊 Tổng quan                                            │
├─────────────────────────────────────────────────────────┤
│ 📋 Hồ sơ đang xử lý: 2                                 │
│ ✅ Hồ sơ đã hoàn thành: 5                              │
│ 🔔 Thông báo mới: 3  [99+]                             │
└─────────────────────────────────────────────────────────┘
```
