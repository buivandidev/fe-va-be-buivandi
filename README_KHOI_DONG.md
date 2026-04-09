# Hướng Dẫn Khởi Động Server

## Cách 1: Tự Động (Khuyến Nghị)

### Khởi động tất cả
```powershell
.\START_ALL_SERVERS.ps1
```

Script sẽ tự động:
1. Kiểm tra process đang chạy
2. Khởi động Backend (port 5000)
3. Khởi động Frontend Admin (port 3000)
4. Khởi động Frontend Người Dân (port 3001)
5. Kiểm tra trạng thái

### Dừng tất cả
```powershell
.\STOP_ALL_SERVERS.ps1
```

## Cách 2: Thủ Công

### Khởi động Backend
```powershell
cd backend/phuongxa-api
$env:ASPNETCORE_ENVIRONMENT="Development"
dotnet run --project src/PhuongXa.API
```

### Khởi động Frontend Admin
```powershell
cd frontend
npm run dev
```

### Khởi động Frontend Người Dân
```powershell
cd frontend/nguoi-dan
npm run dev -- --port 3001
```

## Các URL

| Service | URL | Mô tả |
|---------|-----|-------|
| Backend API | http://localhost:5000 | REST API |
| Swagger UI | http://localhost:5000/swagger | API Documentation |
| Frontend Admin | http://localhost:3000 | Trang quản trị |
| Frontend Người Dân | http://localhost:3001 | Trang người dùng |

## Thông Tin Đăng Nhập

### Admin
- Email: `admin@phuongxa.vn`
- Password: `Admin@123456!Secure`

### Người Dùng Test
- Tự đăng ký tại: http://localhost:3001/dang-ky

## Kiểm Tra Trạng Thái

### Test nhanh
```powershell
# Backend
Invoke-WebRequest -Uri "http://localhost:5000/api/categories"

# Frontend Admin
Invoke-WebRequest -Uri "http://localhost:3000/admin/login"

# Frontend Người Dân
Invoke-WebRequest -Uri "http://localhost:3001/"
```

### Test đầy đủ
```powershell
.\test-full-integration.ps1
```

## Xử Lý Lỗi

### Port đã được sử dụng
```powershell
# Tìm process đang chiếm port
netstat -ano | findstr ":5000"
netstat -ano | findstr ":3000"
netstat -ano | findstr ":3001"

# Kill process theo PID
taskkill /PID <PID> /F
```

### Backend không khởi động
1. Kiểm tra PostgreSQL đang chạy
2. Kiểm tra connection string trong `appsettings.Development.json`
3. Chạy migrations: `dotnet ef database update`

### Frontend không khởi động
1. Xóa cache: `Remove-Item -Recurse -Force .next`
2. Cài lại dependencies: `npm install`
3. Kiểm tra file `.env`

## Database

### Connection String
```
Host=localhost;Port=5432;Database=phuongxa_db;Username=postgres;Password=Buivandi0023414259
```

### Seed Data
Backend tự động seed data khi khởi động lần đầu:
- 1 Admin user
- 3 Dịch vụ công
- Danh mục mẫu

## Logs

### Backend
Logs hiển thị trực tiếp trong terminal

### Frontend
- Browser console (F12)
- Terminal output

## Tips

1. **Luôn khởi động Backend trước** để Frontend có API để kết nối
2. **Đợi Backend khởi động xong** (thấy "Now listening on: http://localhost:5000")
3. **Kiểm tra CORS** nếu Frontend không kết nối được Backend
4. **Clear cache** nếu thấy lỗi lạ: `.next`, `node_modules`, `bin`, `obj`

## Troubleshooting

### Lỗi: "Cannot find module"
```powershell
cd frontend
npm install

cd ../frontend/nguoi-dan
npm install
```

### Lỗi: "Database connection failed"
1. Kiểm tra PostgreSQL đang chạy
2. Kiểm tra username/password
3. Tạo database: `CREATE DATABASE phuongxa_db;`

### Lỗi: "Port already in use"
```powershell
.\STOP_ALL_SERVERS.ps1
.\START_ALL_SERVERS.ps1
```
