# Kiểm tra hồ sơ trong Database

## Vấn đề xác nhận
API trả về: `danhSach: Array(0), tongSo: 0`

Điều này có nghĩa là **KHÔNG CÓ** hồ sơ nào trong database cho user `buivandii@gmail.com`.

## Các khả năng

### 1. Hồ sơ chưa được lưu vào DB
Khi nộp hồ sơ, có thể có lỗi và hồ sơ không được lưu.

**Kiểm tra:**
- Có thông báo lỗi khi nộp không?
- Có redirect về trang thành công không?
- Có nhận được mã theo dõi không?

### 2. Hồ sơ được lưu với email khác
Backend có thể lưu hồ sơ với email khác với email đăng nhập.

**Kiểm tra trong code nộp hồ sơ:**
```typescript
// Khi nộp hồ sơ, email nào được gửi?
const formData = {
  email: "???" // Email gì?
}
```

### 3. Hồ sơ thuộc về user khác
Nếu bạn nộp hồ sơ khi chưa đăng nhập, hồ sơ có thể không gắn với userId.

## Cách kiểm tra

### Option 1: Kiểm tra qua Admin Panel
```
1. Đăng nhập admin: http://localhost:3000/admin/dang-nhap
   Email: admin@phuongxa.vn
   Password: Admin@123

2. Vào quản lý hồ sơ

3. Tìm kiếm theo:
   - Email: buivandii@gmail.com
   - Hoặc tên người nộp

4. Kiểm tra:
   - Có hồ sơ nào không?
   - Email trong hồ sơ là gì?
   - UserId có giá trị không?
```

### Option 2: Kiểm tra qua Tra cứu
```
1. Mở: http://localhost:3001/tra-cuu

2. Nhập:
   - Mã theo dõi: (mã bạn nhận được khi nộp)
   - Email: buivandii@gmail.com

3. Nếu tìm thấy:
   - Hồ sơ TỒN TẠI trong DB
   - Nhưng không gắn với userId đúng
   
4. Nếu không tìm thấy:
   - Hồ sơ KHÔNG TỒN TẠI trong DB
   - Có lỗi khi nộp
```

### Option 3: Nộp hồ sơ mới và kiểm tra
```
1. Đăng nhập: http://localhost:3001/dang-nhap
   Email: buivandii@gmail.com

2. Vào: http://localhost:3001/dich-vu-cong

3. Chọn dịch vụ bất kỳ

4. Điền form (chú ý email phải là buivandii@gmail.com)

5. Nộp hồ sơ

6. Kiểm tra:
   - Có thông báo thành công?
   - Có mã theo dõi?
   - Có redirect về trang nào?

7. Mở Console (F12) và kiểm tra:
   - Có lỗi API nào không?
   - Request POST /api/public/applications/submit có thành công không?

8. Quay lại trang cá nhân và refresh (F5)

9. Kiểm tra Console:
   - tongSo: 0 hay 1?
   - danhSach: Array(0) hay Array(1)?
```

## Backend Filter Logic

File: `PublicApplicationsController.cs` line 188-227

```csharp
[HttpGet]
[Authorize]
public async Task<IActionResult> LayDanhSach(...)
{
    var truyVan = _donViCongViec.DonUngs.TruyVan()...;
    
    // Filter theo user
    if (!VaiTroTienIch.LaQuanTriHoacBienTap(User))
    {
        var idNguoiDung = IdNguoiDungHienTai;
        var emailNguoiDung = await _quanLyNguoiDung.Users
            .Where(x => x.Id == idNguoiDung)
            .Select(x => x.Email)
            .FirstOrDefaultAsync(ct);

        if (!string.IsNullOrWhiteSpace(emailNguoiDung))
        {
            var emailDaChuanHoa = emailNguoiDung.Trim().ToLower();
            truyVan = truyVan.Where(x =>
                x.NguoiDungId == idNguoiDung  // Hồ sơ có userId
                || (x.NguoiDungId == null && x.EmailNguoiNop != null 
                    && x.EmailNguoiNop.ToLower() == emailDaChuanHoa)); // Hoặc email khớp
        }
    }
    
    return Ok(...);
}
```

**Logic:**
1. Lấy userId và email của user hiện tại
2. Tìm hồ sơ có:
   - `NguoiDungId == userId` HOẶC
   - `NguoiDungId == null` VÀ `EmailNguoiNop == email`

**Vấn đề có thể:**
- Hồ sơ có `NguoiDungId` khác
- Hồ sơ có `EmailNguoiNop` khác
- Hồ sơ có `NguoiDungId != null` và `NguoiDungId != userId hiện tại`

## Giải pháp tạm thời

### Tạo hồ sơ test từ Admin
```
1. Đăng nhập admin

2. Vào quản lý hồ sơ → Tạo mới

3. Điền:
   - Email người nộp: buivandii@gmail.com
   - Tên: Bùi Văn Dii
   - Dịch vụ: Bất kỳ
   - Trạng thái: Đang xử lý

4. Lưu

5. Quay lại trang cá nhân người dân và refresh
```

## Debug nâng cao

Nếu vẫn không hiển thị sau khi tạo từ admin, có thể:

1. **UserId không khớp**
   - Kiểm tra userId trong token
   - Kiểm tra userId trong database

2. **Email không khớp**
   - Email trong DB: `buivandii@gmail.com`
   - Email trong token: `buivandii@gmail.com`
   - Case sensitive? Spaces?

3. **Database connection issue**
   - Backend đọc từ DB khác?
   - Cache issue?

## Next Steps

1. Kiểm tra admin panel xem có hồ sơ nào không
2. Nếu không có → Nộp hồ sơ mới và check console
3. Nếu có nhưng không hiển thị → Check userId và email
4. Gửi screenshot admin panel cho tôi để debug tiếp
