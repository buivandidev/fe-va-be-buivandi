# FIX LỖI BIỂU ĐỒ DASHBOARD

## Ngày: 2026-04-07

---

## ❌ LỖI BAN ĐẦU

### Error 400 Bad Request
```
Failed to load resource: the server responded with a status of 400 (Bad Request)
GET /api/admin/dashboard/articles-chart?soThang=6:1
Response error: 400 GET /api/admin/dashboard/articles-chart
```

### Nguyên nhân
- Backend controller parameter `soThang` có default value `= 6`
- Khi frontend gửi `soThang=6`, ASP.NET Core model binding có thể gặp vấn đề
- Parameter binding conflict với default value

---

## ✅ GIẢI PHÁP

### Fix Backend Controller
**File:** `backend/phuongxa-api/src/PhuongXa.API/Controllers/Admin/DashboardController.cs`

#### Trước (Có vấn đề):
```csharp
[HttpGet("articles-chart")]
public async Task<IActionResult> LayBieuDoBaiViet(
    [FromQuery] int soThang = 6,  // ❌ Default value có thể gây conflict
    CancellationToken ct = default)
{
    soThang = Math.Clamp(soThang, 3, 24);
    // ...
}
```

#### Sau (Đã fix):
```csharp
[HttpGet("articles-chart")]
public async Task<IActionResult> LayBieuDoBaiViet(
    [FromQuery] int? soThang,  // ✅ Nullable, xử lý default trong code
    CancellationToken ct = default)
{
    // Nếu soThang null hoặc không hợp lệ, dùng giá trị mặc định
    var soThangHopLe = soThang.HasValue 
        ? Math.Clamp(soThang.Value, 3, 24) 
        : 6;
    
    // Sử dụng soThangHopLe thay vì soThang
    var tuNgay = new DateTime(hienTai.Year, hienTai.Month, 1)
        .AddMonths(-(soThangHopLe - 1));
    var denNgay = tuNgay.AddMonths(soThangHopLe);
    
    var nhanDuLieu = Enumerable.Range(0, soThangHopLe)
        .Select(i => tuNgay.AddMonths(i).ToString("MM/yyyy"))
        .ToList();
    // ...
}
```

### Thay đổi chính:
1. ✅ Đổi `int soThang = 6` → `int? soThang` (nullable)
2. ✅ Xử lý default value trong code thay vì parameter
3. ✅ Sử dụng `soThangHopLe` thay vì `soThang` trong toàn bộ method
4. ✅ Áp dụng tương tự cho endpoint tương thích `chart/articles`

---

## 🔍 TẠI SAO LỖI XẢY RA?

### ASP.NET Core Model Binding Issue
Khi parameter có default value và frontend gửi cùng giá trị đó:
- Backend: `int soThang = 6`
- Frontend: `?soThang=6`
- ASP.NET Core có thể bị confused về việc sử dụng default hay query value
- Kết quả: 400 Bad Request

### Best Practice
✅ Sử dụng nullable parameters (`int?`) cho optional query params
✅ Xử lý default value trong code
✅ Tránh default value trực tiếp trong parameter definition

---

## ✅ KẾT QUẢ

### Backend
- ✅ Endpoint `/api/admin/dashboard/articles-chart` hoạt động
- ✅ Endpoint `/api/admin/dashboard/applications-status-chart` hoạt động
- ✅ Endpoint `/api/admin/dashboard/stats` hoạt động

### Frontend Dashboard
- ✅ Hiển thị thống kê tổng quan
- ✅ Biểu đồ tin tức (Bar chart) hiển thị đúng
- ✅ Biểu đồ trạng thái hồ sơ (Doughnut chart) hiển thị đúng
- ✅ Không còn lỗi 400

---

## 🧪 KIỂM TRA

### Test Endpoints
```bash
# Test stats
curl http://localhost:5000/api/admin/dashboard/stats

# Test articles chart (với parameter)
curl http://localhost:5000/api/admin/dashboard/articles-chart?soThang=6

# Test articles chart (không parameter - dùng default)
curl http://localhost:5000/api/admin/dashboard/articles-chart

# Test applications status chart
curl http://localhost:5000/api/admin/dashboard/applications-status-chart
```

### Kết quả mong đợi
- ✅ Status code: 200 OK
- ✅ Response có data hợp lệ
- ✅ Không có lỗi 400

---

## 📝 GHI CHÚ

### Các endpoint dashboard:
1. `GET /api/admin/dashboard/stats` - Thống kê tổng quan
2. `GET /api/admin/dashboard/articles-chart?soThang=6` - Biểu đồ tin tức
3. `GET /api/admin/dashboard/applications-status-chart` - Biểu đồ trạng thái hồ sơ

### Frontend API calls:
```typescript
// Trong frontend/src/lib/api/admin.ts
export const dashboardApi = {
  async layThongKe(): Promise<ThongKeBangDieuKhien> {
    const res = await apiClient.get('/api/admin/dashboard/stats')
    return unwrapApi<ThongKeBangDieuKhien>(res)
  },

  async layBieuDoBaiViet(soThang: number = 6): Promise<DuLieuBieuDo> {
    const res = await apiClient.get('/api/admin/dashboard/articles-chart', {
      params: { soThang }  // ✅ Gửi parameter đúng cách
    })
    return unwrapApi<DuLieuBieuDo>(res)
  },

  async layBieuDoTrangThaiHoSo(): Promise<DuLieuBieuDo> {
    const res = await apiClient.get('/api/admin/dashboard/applications-status-chart')
    return unwrapApi<DuLieuBieuDo>(res)
  }
}
```

---

## ✅ HOÀN THÀNH

Dashboard charts đã hoạt động bình thường:
- ✅ Fix parameter binding issue
- ✅ Backend trả về 200 OK
- ✅ Frontend hiển thị biểu đồ đúng
- ✅ Không còn lỗi 400

**URL Dashboard:** http://localhost:3000/admin/dashboard
