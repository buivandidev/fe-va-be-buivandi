# 🚀 HƯỚNG DẪN DEPLOY LÊN AZURE

## ✅ Checklist Trước Khi Deploy

### 1. Kiểm tra cấu hình Next.js
- ✅ `frontend/next.config.mjs` có `output: 'standalone'`
- ✅ `frontend/nguoi-dan/next.config.ts` có `output: 'standalone'`

### 2. Kiểm tra biến môi trường
- Backend: `appsettings.Production.json` đã cấu hình đúng
- Frontend Admin: `.env` có `NEXT_PUBLIC_API_URL` trỏ đến Azure API
- Frontend Người Dân: `.env` có `NEXT_PUBLIC_API_URL` trỏ đến Azure API

---

## 📦 Bước 1: Đóng gói mã nguồn

Chạy script tự động:

```powershell
.\build-for-azure.ps1
```

Script sẽ tạo 3 file ZIP trong thư mục `deploy_out/`:
- `backend-api.zip` - .NET API
- `frontend-admin.zip` - Next.js Admin (standalone)
- `frontend-nguoidan.zip` - Next.js Người Dân (standalone)

---

## 🌐 Bước 2: Deploy lên Azure

### A. Deploy Backend API (.NET)

1. Vào Azure Portal → App Service của Backend
2. Vào **Development Tools** → **Advanced Tools (Kudu)**
3. Click **Go** để mở Kudu Console
4. Vào tab **Tools** → **Zip Push Deploy**
5. Kéo thả file `backend-api.zip` vào khung
6. Đợi deploy xong (màn hình sẽ hiện "Deployment successful")

**Cấu hình App Service:**
- Stack: .NET 8 hoặc .NET 9
- Platform: Linux (khuyến nghị) hoặc Windows
- Startup Command: (để trống, Azure tự detect)

### B. Deploy Frontend Admin (Next.js)

1. Vào Azure Portal → App Service của Frontend Admin
2. Vào **Development Tools** → **Advanced Tools (Kudu)**
3. Click **Go** để mở Kudu Console
4. Vào tab **Tools** → **Zip Push Deploy**
5. Kéo thả file `frontend-admin.zip` vào khung
6. Đợi deploy xong

**Cấu hình App Service:**
- Stack: Node.js 20 LTS
- Platform: Linux
- Startup Command: `node server.js`

**Application Settings (Environment Variables):**
```
NEXT_PUBLIC_API_URL=https://your-backend-api.azurewebsites.net
NODE_ENV=production
```

### C. Deploy Frontend Người Dân (Next.js)

1. Vào Azure Portal → App Service của Frontend Người Dân
2. Vào **Development Tools** → **Advanced Tools (Kudu)**
3. Click **Go** để mở Kudu Console
4. Vào tab **Tools** → **Zip Push Deploy**
5. Kéo thả file `frontend-nguoidan.zip` vào khung
6. Đợi deploy xong

**Cấu hình App Service:**
- Stack: Node.js 20 LTS
- Platform: Linux
- Startup Command: `node server.js`

**Application Settings (Environment Variables):**
```
NEXT_PUBLIC_API_URL=https://your-backend-api.azurewebsites.net
NODE_ENV=production
```

---

## 🔍 Bước 3: Kiểm tra sau Deploy

### Backend API
```bash
curl https://your-backend-api.azurewebsites.net/health
```

### Frontend Admin
```bash
curl https://your-admin.azurewebsites.net
```

### Frontend Người Dân
```bash
curl https://your-nguoidan.azurewebsites.net
```

---

## ⚠️ Xử lý lỗi thường gặp

### 1. Frontend bị 503 Service Unavailable

**Nguyên nhân:** Sharp binary Windows không tương thích với Linux

**Giải pháp:** Script đã tự động xóa sharp binary. Nếu vẫn lỗi:
1. Vào Kudu Console
2. Chạy: `rm -rf node_modules/sharp node_modules/@img`
3. Restart App Service

### 2. Frontend không tìm thấy server.js

**Nguyên nhân:** Cấu trúc thư mục sai

**Giải pháp:** Kiểm tra trong Kudu Console:
```bash
ls -la /home/site/wwwroot/
# Phải có: server.js, node_modules/, .next/, public/
```

### 3. Backend không kết nối Database

**Nguyên nhân:** Connection string chưa đúng

**Giải pháp:**
1. Vào App Service → Configuration → Connection strings
2. Thêm connection string với tên `DefaultConnection`
3. Restart App Service

### 4. CORS Error khi Frontend gọi Backend

**Giải pháp:** Kiểm tra `appsettings.Production.json`:
```json
{
  "AllowedOrigins": [
    "https://your-admin.azurewebsites.net",
    "https://your-nguoidan.azurewebsites.net"
  ]
}
```

---

## 📊 Monitoring

### Xem Logs
1. Vào App Service → **Monitoring** → **Log stream**
2. Hoặc dùng Kudu Console → **Debug console** → **CMD**
3. Xem file log: `cat /home/LogFiles/Application/console.log`

### Application Insights (khuyến nghị)
1. Enable Application Insights trong App Service
2. Xem metrics: Response time, Failed requests, Exceptions

---

## 🔄 Update Code

Khi có thay đổi code:
1. Chạy lại `.\build-for-azure.ps1`
2. Kéo thả file ZIP mới vào Kudu
3. Azure tự động restart app

---

## 💡 Tips

1. **Sử dụng Deployment Slots** cho staging/production
2. **Enable Auto-scaling** nếu traffic cao
3. **Cấu hình CDN** cho static assets
4. **Backup thường xuyên** database và app settings
5. **Monitor performance** với Application Insights

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs trong Kudu Console
2. Xem Application Insights
3. Test local trước khi deploy: `npm run start` (sau khi build)
