#  Cổng Thông Tin Phường Xã

Dự án web về phường xã phục vụ hành chính công

##  Quick Start

### Chạy Project
```bash
# 1. Backend (Terminal 1)
.\run-backend.ps1

# 2. FE người dân (Terminal 2)
.\run-fe-nguoi-dan.ps1

# 3. FE admin (Terminal 3)
.\run-fe-admin.ps1

# 4. Kiểm tra kết nối
node test-connection.js
node test-admin-connection.js
```

### Truy Cập
- **Frontend Người dân:** http://localhost:3000
- **Frontend Admin:** http://localhost:3001
- **Backend API:** http://localhost:5187/api

---

##  Tài Liệu

- **[QUICK_START.md](./QUICK_START.md)** - Hướng dẫn chạy nhanh
- **[KET_NOI_FE_BE.md](./KET_NOI_FE_BE.md)** - Chi tiết kết nối Frontend-Backend
- **Azure Workflows**:
  - `.github/workflows/azure-backend-api.yml`
  - `.github/workflows/azure-frontend-admin.yml`
  - `.github/workflows/azure-frontend-citizen.yml`

### Azure Secrets cần cấu hình
- `AZURE_BACKEND_APP_NAME`
- `AZURE_BACKEND_PUBLISH_PROFILE`
- `AZURE_ADMIN_FE_APP_NAME`
- `AZURE_ADMIN_FE_PUBLISH_PROFILE`
- `AZURE_CITIZEN_FE_APP_NAME`
- `AZURE_CITIZEN_FE_PUBLISH_PROFILE`
- `ADMIN_FE_NEXT_PUBLIC_API_BASE_URL`
- `ADMIN_FE_API_BASE_URL`
- `CITIZEN_FE_NEXT_PUBLIC_API_BASE_URL`

---

##  Tech Stack

### Backend
- **Framework:** ASP.NET Core
- **Database:** PostgreSQL
- **Auth:** JWT
- **Architecture:** Clean Architecture (Domain, Application, Infrastructure, API)

### Frontend
- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **HTTP Client:** Axios

---

##  Cấu Hình Hoàn Tất

 Frontend-Backend connection đã được cấu hình  
 CORS đã được thiết lập  
 API routes đã được định nghĩa  
 Environment variables đã được cập nhật  

---

Made with  for Phường Xã
