# Khắc phục lỗi đăng nhập và thư viện media

## Vấn đề phát hiện

### 1. Lỗi đăng nhập (cả 2 frontend)
- Backend trả về: `{ ThanhCong, ThongDiep, DuLieu: { MaTruyCap, ... }, Token, User }`
- Frontend Admin đang parse đúng
- Frontend Người Dân đang parse đúng
- **Nguyên nhân**: Có thể do CORS hoặc backend chưa chạy

### 2. Lỗi thư viện media (Failed to fetch)
- API endpoint: `/api/media/albums` - ✅ Đã có trong backend
- API endpoint: `/api/media?loai=1` - ✅ Đã có trong backend
- **Nguyên nhân**: Backend chưa chạy hoặc CORS chưa được cấu hình

## Giải pháp

### Bước 1: Kiểm tra CORS trong backend
Cần đảm bảo backend cho phép CORS từ cả 2 frontend (port 3000 và 3001)

### Bước 2: Kiểm tra backend đang chạy
- Backend phải chạy ở http://localhost:5000
- Swagger UI: http://localhost:5000/swagger

### Bước 3: Test API endpoints
```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@phuongxa.vn","matKhau":"Admin@123456!Secure"}'

# Test albums
curl http://localhost:5000/api/media/albums

# Test videos
curl http://localhost:5000/api/media?loai=1
```

## Cấu trúc API Response

### Login Response
```json
{
  "ThanhCong": true,
  "ThongDiep": "Dang nhap thanh cong",
  "DuLieu": {
    "MaTruyCap": "jwt-token-here",
    "MaLamMoi": "refresh-token",
    "HetHanLuc": "2024-01-01T00:00:00Z",
    "NguoiDung": {
      "Id": "guid",
      "HoTen": "Admin",
      "Email": "admin@phuongxa.vn",
      "DanhSachVaiTro": ["Admin"]
    }
  },
  "Token": "jwt-token-here",
  "User": { ... }
}
```

### Albums Response
```json
{
  "ThanhCong": true,
  "DuLieu": [
    {
      "Id": "guid",
      "Ten": "Album name",
      "DuongDanAnh": "/uploads/...",
      "SoPhuongTien": 10,
      "ThoiGianTao": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Phát hiện nguyên nhân

### ❌ BACKEND CHƯA CHẠY
- Port 5000: KHÔNG hoạt động
- Port 3000: KHÔNG hoạt động  
- Port 3001: KHÔNG hoạt động

**Đây là nguyên nhân chính của tất cả lỗi!**

## Giải pháp: Khởi động lại hệ thống

Chạy script khởi động:
```powershell
.\KHOI_DONG_HE_THONG.ps1
```

Hoặc chạy thủ công từng service:

### 1. Khởi động Backend (Terminal 1)
```powershell
cd backend/phuongxa-api
$env:ASPNETCORE_ENVIRONMENT='Development'
dotnet run --project src/PhuongXa.API
```

### 2. Khởi động Frontend Admin (Terminal 2)
```powershell
cd frontend
npm run dev
```

### 3. Khởi động Frontend Người Dân (Terminal 3)
```powershell
cd frontend/nguoi-dan
npm run dev -- --port 3001
```

## Kiểm tra sau khi khởi động

1. Backend API: http://localhost:5000/swagger
2. Frontend Admin: http://localhost:3000
3. Frontend Người Dân: http://localhost:3001

## Trạng thái
- ✅ Frontend Admin login code - OK
- ✅ Frontend Người Dân login code - OK  
- ✅ Backend login endpoint - OK
- ✅ Backend media endpoints - OK
- ✅ CORS configuration - OK (port 3000, 3001)
- ❌ **Servers chưa chạy - CẦN KHỞI ĐỘNG**
