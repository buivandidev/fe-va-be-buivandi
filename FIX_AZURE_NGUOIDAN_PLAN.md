# 🔧 KẾ HOẠCH FIX LỖI AZURE - FRONTEND NGƯỜI DÂN

## 📋 PHÂN TÍCH VẤN ĐỀ

### ✅ Những gì ĐÃ ĐÚNG
1. ✅ `.env` có `NEXT_PUBLIC_API_BASE_URL` trỏ đến Azure backend
2. ✅ `next.config.ts` có `output: "standalone"` 
3. ✅ API client có fallback mechanism
4. ✅ Build script đã xóa sharp binary Windows

### 🔴 CÁC VẤN ĐỀ TIỀM ẨN TRÊN AZURE

#### 1. **Biến môi trường không được inject vào build**
**Vấn đề:** Next.js build time sẽ hardcode `NEXT_PUBLIC_*` vào bundle. Nếu build local với localhost rồi deploy lên Azure, API URL sẽ SAI.

**Triệu chứng:**
- Frontend gọi API về localhost thay vì Azure backend
- Console error: "Failed to fetch" hoặc CORS error
- Network tab shows requests to localhost:5000

**Giải pháp:**
- Build lại với `.env` đúng TRƯỚC KHI deploy
- Hoặc dùng runtime config thay vì build-time

#### 2. **CORS chưa được cấu hình đúng trên Backend**
**Vấn đề:** Backend Azure chưa cho phép frontend Azure gọi API

**Triệu chứng:**
- Console error: "CORS policy blocked"
- Preflight OPTIONS request failed

**Giải pháp:**
- Thêm URL frontend vào `AllowedOrigins` trong `appsettings.Production.json`

#### 3. **Static assets (images) không load**
**Vấn đề:** Next.js Image component cần cấu hình remote patterns cho Azure backend

**Triệu chứng:**
- Ảnh không hiển thị
- Console error: "Invalid src prop"

**Giải pháp:**
- Thêm Azure backend domain vào `remotePatterns` trong `next.config.ts`

#### 4. **Server.js không start hoặc crash**
**Vấn đề:** 
- Thiếu `package.json` trong standalone
- Sharp binary Windows conflict
- Port binding issue

**Triệu chứng:**
- 503 Service Unavailable
- Application timeout (230s)
- Kudu logs show crash

**Giải pháp:**
- Đã fix trong build script (copy package.json, xóa sharp)
- Cần verify trong Kudu console

#### 5. **Environment variables không được set trên Azure App Service**
**Vấn đề:** Azure App Service cần config trong Application Settings

**Triệu chứng:**
- API calls fail
- Undefined environment variables

**Giải pháp:**
- Set trong Azure Portal → Configuration → Application Settings

---

## 🛠️ KẾ HOẠCH FIX (THEO THỨ TỰ ƯU TIÊN)

### BƯỚC 1: Kiểm tra Backend CORS ⭐⭐⭐
**Mức độ:** CRITICAL

**Hành động:**
1. Mở `backend/phuongxa-api/src/PhuongXa.API/appsettings.Production.json`
2. Kiểm tra `AllowedOrigins` có URL frontend Azure chưa
3. Nếu chưa, thêm vào:
```json
{
  "AllowedOrigins": [
    "https://your-nguoidan-app.azurewebsites.net",
    "https://your-admin-app.azurewebsites.net"
  ]
}
```
4. Deploy lại backend

**Cách verify:**
- Mở browser console trên frontend Azure
- Xem Network tab có CORS error không

---

### BƯỚC 2: Rebuild với .env đúng ⭐⭐⭐
**Mức độ:** CRITICAL

**Vấn đề hiện tại:**
- File `.env` đã đúng URL Azure backend
- NHƯNG nếu đã build trước đó với localhost, cần build lại

**Hành động:**
1. Xóa build cũ:
```powershell
Remove-Item -Recurse -Force frontend/nguoi-dan/.next
```

2. Verify `.env` đúng:
```powershell
Get-Content frontend/nguoi-dan/.env
# Phải thấy: NEXT_PUBLIC_API_BASE_URL=https://project-api-phuongxa-...azurewebsites.net
```

3. Build lại:
```powershell
.\build-for-azure.ps1
```

4. Deploy file ZIP mới

**Cách verify:**
- Sau khi deploy, mở browser console
- Chạy: `console.log(process.env.NEXT_PUBLIC_API_BASE_URL)`
- Phải thấy URL Azure, KHÔNG phải localhost

---

### BƯỚC 3: Cấu hình Azure App Service ⭐⭐
**Mức độ:** HIGH

**Hành động:**
1. Vào Azure Portal → Frontend Người Dân App Service
2. Vào **Configuration** → **Application Settings**
3. Thêm/verify các settings:

```
NEXT_PUBLIC_API_BASE_URL = https://project-api-phuongxa-czdnbsdybfaabccv.southeastasia-01.azurewebsites.net
NODE_ENV = production
WEBSITE_NODE_DEFAULT_VERSION = 20-lts
```

4. Vào **Configuration** → **General Settings**
5. Verify:
   - Stack: Node 20 LTS
   - Platform: Linux
   - Startup Command: `node server.js`

6. **Save** và **Restart** app

**Cách verify:**
- Vào Kudu Console
- Chạy: `env | grep NEXT_PUBLIC`
- Phải thấy biến môi trường đúng

---

### BƯỚC 4: Fix Image Remote Patterns ⭐
**Mức độ:** MEDIUM

**Vấn đề:** 
- `next.config.ts` chưa có Azure backend domain trong `remotePatterns`

**Hành động:**
Sửa `frontend/nguoi-dan/next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "project-api-phuongxa-czdnbsdybfaabccv.southeastasia-01.azurewebsites.net",
    },
    {
      protocol: "https",
      hostname: "lh3.googleusercontent.com",
    },
    {
      protocol: "https",
      hostname: "placehold.co",
    },
  ],
},
```

Sau đó build lại và deploy.

---

### BƯỚC 5: Kiểm tra Kudu Logs ⭐⭐
**Mức độ:** HIGH (để debug)

**Hành động:**
1. Vào Azure Portal → App Service → Advanced Tools (Kudu)
2. Click **Go**
3. Vào **Debug Console** → **CMD**
4. Chạy các lệnh kiểm tra:

```bash
# Kiểm tra cấu trúc file
ls -la /home/site/wwwroot/

# Phải có:
# - server.js
# - node_modules/
# - .next/
# - public/
# - package.json

# Xem logs
cat /home/LogFiles/Application/console.log

# Kiểm tra process
ps aux | grep node

# Test start server manually
cd /home/site/wwwroot
PORT=8080 node server.js
```

**Cách verify:**
- Nếu server start OK, sẽ thấy: "Ready on http://0.0.0.0:8080"
- Nếu crash, logs sẽ show lỗi cụ thể

---

### BƯỚC 6: Test API Connectivity từ Frontend ⭐
**Mức độ:** MEDIUM

**Hành động:**
1. Mở frontend Azure trong browser
2. Mở Developer Console (F12)
3. Chạy test:

```javascript
// Test 1: Kiểm tra env variable
console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

// Test 2: Test fetch API
fetch('https://project-api-phuongxa-czdnbsdybfaabccv.southeastasia-01.azurewebsites.net/api/public/homepage')
  .then(r => r.json())
  .then(d => console.log('API Response:', d))
  .catch(e => console.error('API Error:', e));

// Test 3: Kiểm tra CORS
fetch('https://project-api-phuongxa-czdnbsdybfaabccv.southeastasia-01.azurewebsites.net/api/public/homepage', {
  method: 'OPTIONS'
})
  .then(r => console.log('CORS OK:', r.headers.get('access-control-allow-origin')))
  .catch(e => console.error('CORS Error:', e));
```

**Kết quả mong đợi:**
- API URL phải là Azure URL (không phải localhost)
- API Response phải trả về data
- CORS phải có header `access-control-allow-origin`

---

## 🚨 TROUBLESHOOTING NHANH

### Lỗi: "Failed to fetch" hoặc "Network Error"
**Nguyên nhân:** API URL sai hoặc backend down
**Fix:**
1. Verify `.env` có URL đúng
2. Test backend: `curl https://project-api-phuongxa-...azurewebsites.net/health`
3. Rebuild với `.env` đúng

### Lỗi: "CORS policy blocked"
**Nguyên nhân:** Backend chưa allow frontend domain
**Fix:**
1. Sửa `appsettings.Production.json` → AllowedOrigins
2. Deploy lại backend
3. Restart backend App Service

### Lỗi: 503 Service Unavailable
**Nguyên nhân:** Server crash hoặc không start
**Fix:**
1. Vào Kudu logs xem lỗi cụ thể
2. Kiểm tra có sharp binary Windows không: `ls -la node_modules/sharp`
3. Nếu có, xóa: `rm -rf node_modules/sharp node_modules/@img`
4. Restart app

### Lỗi: Ảnh không hiển thị
**Nguyên nhân:** Image remote patterns chưa có Azure backend
**Fix:**
1. Sửa `next.config.ts` thêm Azure backend hostname
2. Rebuild và deploy

### Lỗi: API trả về 401 Unauthorized
**Nguyên nhân:** Token không được gửi hoặc hết hạn
**Fix:**
1. Kiểm tra localStorage có token không
2. Verify JWT secret giống nhau giữa backend và frontend
3. Login lại để lấy token mới

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Backend CORS đã cấu hình đúng
- [ ] `.env` có URL Azure backend đúng
- [ ] Build lại với `.env` đúng
- [ ] Deploy file ZIP mới
- [ ] Azure App Service settings đã cấu hình
- [ ] Startup command: `node server.js`
- [ ] Image remote patterns có Azure backend
- [ ] Kudu logs không có lỗi
- [ ] Frontend load thành công
- [ ] API calls hoạt động
- [ ] CORS không có lỗi
- [ ] Ảnh hiển thị OK
- [ ] Login/logout hoạt động

---

## 📞 NEXT STEPS

Sau khi hoàn thành checklist:
1. Test toàn bộ flow: Homepage → Login → Cá nhân → Thư viện
2. Kiểm tra performance với Application Insights
3. Setup monitoring và alerts
4. Document lại các settings cho lần deploy sau
