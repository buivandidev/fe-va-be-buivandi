# ✅ ĐÃ FIX CÁC VẤN ĐỀ AZURE - FRONTEND NGƯỜI DÂN

## 🔧 Các vấn đề đã fix

### 1. ✅ CORS Backend
**Vấn đề:** `appsettings.Production.json` chỉ có 1 domain placeholder

**Đã fix:**
```json
"Cors": {
  "AllowedOrigins": [
    "https://project-admin-phuongxa-fqfqfqcqfqfqfqfq.southeastasia-01.azurewebsites.net",
    "https://project-nguoidan-phuongxa-fqfqfqcqfqfqfqfq.southeastasia-01.azurewebsites.net"
  ]
}
```

⚠️ **LƯU Ý:** Thay `fqfqfqcqfqfqfqfq` bằng tên thật của Azure App Service!

---

### 2. ✅ Image Remote Patterns
**Vấn đề:** `next.config.ts` chưa có Azure backend hostname

**Đã fix:**
```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "project-api-phuongxa-czdnbsdybfaabccv.southeastasia-01.azurewebsites.net",
    },
    // ... other patterns
  ],
}
```

---

### 3. ✅ Environment Variables
**Đã kiểm tra:** `.env` có URL Azure backend đúng
```
NEXT_PUBLIC_API_BASE_URL=https://project-api-phuongxa-czdnbsdybfaabccv.southeastasia-01.azurewebsites.net
```

---

## 📦 BƯỚC TIẾP THEO

### Bước 1: Cập nhật URL Azure thật (QUAN TRỌNG!)

Trong `appsettings.Production.json`, thay:
- `project-admin-phuongxa-fqfqfqcqfqfqfqfq` → Tên thật của Admin App Service
- `project-nguoidan-phuongxa-fqfqfqcqfqfqfqfq` → Tên thật của Người Dân App Service

Ví dụ:
```json
"AllowedOrigins": [
  "https://phuongxa-admin.azurewebsites.net",
  "https://phuongxa-nguoidan.azurewebsites.net"
]
```

### Bước 2: Rebuild tất cả

```powershell
.\build-for-azure.ps1
```

Sẽ tạo 3 file ZIP mới trong `deploy_out/`:
- `backend-api.zip` (có CORS fix)
- `frontend-admin.zip`
- `frontend-nguoidan.zip` (có image patterns fix)

### Bước 3: Deploy lên Azure

#### A. Deploy Backend (để apply CORS fix)
1. Azure Portal → Backend App Service
2. Advanced Tools (Kudu) → Go
3. Tools → Zip Push Deploy
4. Kéo thả `backend-api.zip`
5. Đợi deploy xong
6. **Restart App Service**

#### B. Deploy Frontend Người Dân
1. Azure Portal → Người Dân App Service
2. Advanced Tools (Kudu) → Go
3. Tools → Zip Push Deploy
4. Kéo thả `frontend-nguoidan.zip`
5. Đợi deploy xong

#### C. Cấu hình App Service Settings
1. Vào Configuration → Application Settings
2. Thêm/verify:
```
NEXT_PUBLIC_API_BASE_URL = https://project-api-phuongxa-czdnbsdybfaabccv.southeastasia-01.azurewebsites.net
NODE_ENV = production
```

3. Vào Configuration → General Settings
4. Verify:
   - Stack: Node 20 LTS
   - Startup Command: `node server.js`

5. **Save** và **Restart**

### Bước 4: Kiểm tra

#### Test Backend CORS
```bash
curl -I https://project-api-phuongxa-czdnbsdybfaabccv.southeastasia-01.azurewebsites.net/api/public/homepage \
  -H "Origin: https://your-nguoidan-app.azurewebsites.net"
```

Phải thấy header:
```
access-control-allow-origin: https://your-nguoidan-app.azurewebsites.net
```

#### Test Frontend
1. Mở frontend Azure trong browser
2. F12 → Console
3. Chạy:
```javascript
// Test API URL
console.log('API:', process.env.NEXT_PUBLIC_API_BASE_URL);

// Test fetch
fetch('https://project-api-phuongxa-czdnbsdybfaabccv.southeastasia-01.azurewebsites.net/api/public/homepage')
  .then(r => r.json())
  .then(d => console.log('OK:', d))
  .catch(e => console.error('Error:', e));
```

#### Test Images
1. Vào trang có ảnh (Thư viện, Tin tức)
2. Kiểm tra ảnh hiển thị
3. F12 → Network → Img
4. Không được có lỗi 403 hoặc CORS

---

## 🚨 Troubleshooting

### Vẫn bị CORS Error
**Nguyên nhân:** URL trong AllowedOrigins không khớp

**Fix:**
1. Mở browser console, xem request Origin header
2. Copy chính xác URL đó
3. Paste vào AllowedOrigins (không trailing slash!)
4. Deploy lại backend
5. Restart backend App Service

### Ảnh vẫn không load
**Nguyên nhân:** 
- Image hostname không khớp
- Backend không trả về ảnh

**Fix:**
1. F12 → Network → Img → Xem URL ảnh bị lỗi
2. Copy hostname
3. Thêm vào remotePatterns trong next.config.ts
4. Rebuild và deploy lại

### API trả về 404
**Nguyên nhân:** Endpoint không tồn tại hoặc route sai

**Fix:**
1. Kiểm tra backend có endpoint `/api/public/homepage` không
2. Test trực tiếp: `curl https://backend-url/api/public/homepage`
3. Nếu 404, kiểm tra backend routes

### 503 Service Unavailable
**Nguyên nhân:** Server crash

**Fix:**
1. Vào Kudu Console
2. Xem logs: `cat /home/LogFiles/Application/console.log`
3. Tìm lỗi cụ thể
4. Thường là:
   - Sharp binary Windows → Xóa: `rm -rf node_modules/sharp`
   - Missing package.json → Deploy lại
   - Port binding → Kiểm tra startup command

---

## ✅ Checklist Deploy

- [ ] Cập nhật URL Azure thật trong appsettings.Production.json
- [ ] Rebuild: `.\build-for-azure.ps1`
- [ ] Deploy backend-api.zip
- [ ] Restart Backend App Service
- [ ] Deploy frontend-nguoidan.zip
- [ ] Cấu hình Application Settings
- [ ] Cấu hình Startup Command: `node server.js`
- [ ] Restart Frontend App Service
- [ ] Test CORS: Không có lỗi trong console
- [ ] Test API: Fetch thành công
- [ ] Test Images: Ảnh hiển thị OK
- [ ] Test Login: Đăng nhập thành công
- [ ] Test Navigation: Các trang load OK

---

## 📞 Hỗ trợ

Nếu vẫn gặp vấn đề:
1. Chạy: `.\FIX_AZURE_NGUOIDAN_AUTO.ps1 -CheckOnly`
2. Xem Kudu logs
3. Kiểm tra Application Insights (nếu có)
4. Tham khảo: `FIX_AZURE_NGUOIDAN_PLAN.md`
