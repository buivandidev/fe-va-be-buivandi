# FIX LỖI TRANG ADMIN SETTINGS

## Ngày: 2026-04-07

---

## ❌ LỖI BAN ĐẦU

### Error Message
```
Module not found: Can't resolve '@/lib/api/public'
./src/app/admin/(protected)/settings/page.tsx:5:1
```

### Nguyên nhân
1. File `frontend/src/app/admin/(protected)/settings/page.tsx` import `publicApi` từ `@/lib/api/public`
2. File `@/lib/api/public` không tồn tại trong frontend admin
3. Backend thiếu endpoint GET `/api/admin/settings` để lấy danh sách cài đặt

---

## ✅ CÁCH SỬA

### 1. Thêm endpoint GET vào Backend
**File:** `backend/phuongxa-api/src/PhuongXa.API/Controllers/Admin/SettingsController.cs`

```csharp
[HttpGet]
[Authorize(Roles = HangSoPhanQuyen.QuanTriHeThong)]
public async Task<IActionResult> LayDanhSach(CancellationToken ct)
{
    var danhSach = await _donViCongViec.CaiDats.TruyVan()
        .AsNoTracking()
        .OrderBy(x => x.Khoa)
        .ToListAsync(ct);
    var duLieu = _anhXa.Map<List<CaiDatTrangWebDto>>(danhSach);
    return Ok(PhanHoiApi<List<CaiDatTrangWebDto>>.ThanhCongKetQua(duLieu));
}
```

### 2. Thêm method vào Frontend API
**File:** `frontend/src/lib/api/admin-settings.ts`

```typescript
export const settingsApi = {
  async layDanhSach(): Promise<CaiDatTrangWeb[]> {
    const res = await apiClient.get('/api/admin/settings')
    return unwrapApi<CaiDatTrangWeb[]>(res)
  },
  // ... các method khác
}
```

### 3. Fix Settings Page
**File:** `frontend/src/app/admin/(protected)/settings/page.tsx`

**Trước:**
```typescript
import { publicApi } from '@/lib/api/public'  // ❌ File không tồn tại

const loadSettings = async () => {
  const data = await publicApi.layDanhSachCaiDat()  // ❌ Sai API
  setSettings(data)
}
```

**Sau:**
```typescript
import { settingsApi, CaiDatTrangWeb } from '@/lib/api/admin-settings'  // ✅ Đúng

const loadSettings = async () => {
  const data = await settingsApi.layDanhSach()  // ✅ Đúng API
  setSettings(data)
}
```

---

## ✅ KẾT QUẢ

### Backend
- ✅ Thêm endpoint GET `/api/admin/settings`
- ✅ Trả về danh sách cài đặt
- ✅ Yêu cầu role QuanTriHeThong

### Frontend
- ✅ Xóa import `@/lib/api/public` không tồn tại
- ✅ Sử dụng `settingsApi.layDanhSach()` từ `admin-settings.ts`
- ✅ Type-safe với `CaiDatTrangWeb[]`

### Servers
- ✅ Backend API: http://localhost:5000 - Running
- ✅ Frontend Admin: http://localhost:3000 - Running
- ✅ Frontend Người Dân: http://localhost:3001 - Running

---

## 📝 API ENDPOINTS SETTINGS

### GET /api/admin/settings
Lấy danh sách tất cả cài đặt
- **Auth:** Required (QuanTriHeThong)
- **Response:** `List<CaiDatTrangWeb>`

### PUT /api/admin/settings/{khoa}
Cập nhật cài đặt theo khóa
- **Auth:** Required (QuanTriHeThong)
- **Body:** `{ giaTri: string }`

### POST /api/admin/settings
Tạo cài đặt mới
- **Auth:** Required (QuanTriHeThong)
- **Body:** `{ khoa: string, giaTri: string, loai: string }`

### DELETE /api/admin/settings/{khoa}
Xóa cài đặt theo khóa
- **Auth:** Required (QuanTriHeThong)

---

## ✅ HOÀN THÀNH

Trang Settings đã hoạt động bình thường:
- ✅ Hiển thị danh sách cài đặt
- ✅ Thêm cài đặt mới
- ✅ Sửa cài đặt
- ✅ Xóa cài đặt

**URL:** http://localhost:3000/admin/settings
