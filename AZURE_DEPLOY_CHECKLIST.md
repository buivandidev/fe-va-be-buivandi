# ✅ AZURE DEPLOY CHECKLIST

## Trước khi chạy build-for-azure.ps1

### Backend
- [ ] `appsettings.Production.json` đã cấu hình:
  - [ ] Connection string đúng
  - [ ] JWT Key production
  - [ ] AllowedOrigins có URL frontend Azure
  - [ ] Logging level phù hợp

### Frontend Admin
- [ ] `frontend/.env` có:
  - [ ] `NEXT_PUBLIC_API_URL` trỏ đến Azure API URL
  - [ ] Các biến môi trường khác cần thiết
- [ ] `frontend/next.config.mjs` có `output: 'standalone'` ✅

### Frontend Người Dân
- [ ] `frontend/nguoi-dan/.env` có:
  - [ ] `NEXT_PUBLIC_API_URL` trỏ đến Azure API URL
  - [ ] Các biến môi trường khác cần thiết
- [ ] `frontend/nguoi-dan/next.config.ts` có `output: 'standalone'` ✅

---

## Chạy Build Script

```powershell
.\build-for-azure.ps1
```

Kiểm tra output:
- [ ] `deploy_out/backend-api.zip` được tạo
- [ ] `deploy_out/frontend-admin.zip` được tạo
- [ ] `deploy_out/frontend-nguoidan.zip` được tạo
- [ ] Không có lỗi build

---

## Test Local (Optional nhưng khuyến nghị)

```powershell
# Test Admin
.\TEST_STANDALONE_LOCAL.ps1 -Target admin

# Test Người Dân
.\TEST_STANDALONE_LOCAL.ps1 -Target nguoidan
```

Kiểm tra:
- [ ] Server khởi động không lỗi
- [ ] Truy cập http://localhost:3000 hoặc 3001 thành công
- [ ] Không có lỗi 404 cho static files
- [ ] API calls hoạt động (nếu backend đang chạy)

---

## Deploy lên Azure

### 1. Backend API
- [ ] Vào Azure Portal → Backend App Service
- [ ] Mở Kudu Console
- [ ] Kéo thả `backend-api.zip` vào Zip Push Deploy
- [ ] Đợi "Deployment successful"
- [ ] Test: `curl https://your-api.azurewebsites.net/health`

### 2. Frontend Admin
- [ ] Vào Azure Portal → Admin App Service
- [ ] Kiểm tra Configuration → Application Settings:
  - [ ] `NEXT_PUBLIC_API_URL` đúng
  - [ ] `NODE_ENV=production`
- [ ] Kiểm tra Configuration → General Settings:
  - [ ] Stack: Node 20 LTS
  - [ ] Startup Command: `node server.js`
- [ ] Mở Kudu Console
- [ ] Kéo thả `frontend-admin.zip` vào Zip Push Deploy
- [ ] Đợi deploy xong
- [ ] Restart App Service
- [ ] Test: Mở URL trong browser

### 3. Frontend Người Dân
- [ ] Vào Azure Portal → Người Dân App Service
- [ ] Kiểm tra Configuration → Application Settings:
  - [ ] `NEXT_PUBLIC_API_URL` đúng
  - [ ] `NODE_ENV=production`
- [ ] Kiểm tra Configuration → General Settings:
  - [ ] Stack: Node 20 LTS
  - [ ] Startup Command: `node server.js`
- [ ] Mở Kudu Console
- [ ] Kéo thả `frontend-nguoidan.zip` vào Zip Push Deploy
- [ ] Đợi deploy xong
- [ ] Restart App Service
- [ ] Test: Mở URL trong browser

---

## Kiểm tra sau Deploy

### Backend
- [ ] Health check endpoint hoạt động
- [ ] Swagger UI accessible (nếu enable)
- [ ] Database connection OK
- [ ] Logs không có lỗi critical

### Frontend Admin
- [ ] Trang chủ load thành công
- [ ] Login hoạt động
- [ ] API calls thành công
- [ ] Static assets (images, CSS) load OK
- [ ] Console không có lỗi 404

### Frontend Người Dân
- [ ] Trang chủ load thành công
- [ ] Login hoạt động
- [ ] API calls thành công
- [ ] Static assets load OK
- [ ] Console không có lỗi 404

---

## Troubleshooting

### Nếu Frontend bị 503
1. Vào Kudu Console → Debug Console
2. Chạy: `ls -la /home/site/wwwroot/`
3. Kiểm tra có `server.js`, `node_modules/`, `.next/`, `public/`
4. Xem logs: `cat /home/LogFiles/Application/console.log`
5. Nếu thấy lỗi sharp: `rm -rf node_modules/sharp node_modules/@img`

### Nếu CORS Error
1. Kiểm tra `appsettings.Production.json` → AllowedOrigins
2. Phải có đầy đủ URL frontend (không trailing slash)
3. Restart Backend App Service

### Nếu 404 cho Static Files
1. Kiểm tra trong Kudu: `ls -la /home/site/wwwroot/public/`
2. Kiểm tra: `ls -la /home/site/wwwroot/.next/static/`
3. Nếu thiếu, build lại và deploy lại

---

## Performance Tuning (sau khi deploy thành công)

- [ ] Enable Application Insights
- [ ] Configure Auto-scaling rules
- [ ] Setup CDN cho static assets
- [ ] Enable compression
- [ ] Configure caching headers
- [ ] Setup monitoring alerts

---

## Backup & Rollback

- [ ] Backup database trước khi deploy
- [ ] Lưu file ZIP cũ để rollback
- [ ] Document version đang deploy
- [ ] Test rollback procedure

---

## 🎉 Deploy thành công!

Ghi chú:
- Backend URL: ___________________________
- Admin URL: ___________________________
- Người Dân URL: ___________________________
- Deploy date: ___________________________
- Version: ___________________________
