# 🔧 Hướng Dẫn Áp Dụng Tất Cả Fixes

## ✅ Đã Hoàn Thành

### 1. Logger Utility
- ✅ Tạo `frontend/src/lib/utils/logger.ts`
- ✅ Tạo `frontend/nguoi-dan/src/lib/utils/logger.ts`
- ✅ Cập nhật `frontend/src/lib/api/client.ts`
- ✅ Cập nhật `frontend/src/app/admin/(protected)/articles/page.tsx`

### 2. Các File Còn Lại Cần Cập Nhật Console.log

Do số lượng file nhiều, bạn cần thực hiện find & replace thủ công:

#### Frontend Admin
```typescript
// Thêm import vào đầu file
import { logger } from '@/lib/utils/logger'

// Thay thế
console.log → logger.log
console.error → logger.error
console.warn → logger.warn
console.info → logger.info
```

**Files cần sửa:**
- `frontend/src/lib/auth/session.ts`
- `frontend/src/app/admin/test-api/page.tsx`
- `frontend/src/app/admin/(protected)/services/page.tsx`
- `frontend/src/app/admin/(protected)/applications/page.tsx`

#### Frontend Người Dân
```typescript
// Thêm import vào đầu file
import { logger } from '@/lib/utils/logger'

// Thay thế tương tự
```

**Files cần sửa:**
- `frontend/nguoi-dan/src/lib/services-api.ts`
- `frontend/nguoi-dan/src/lib/departments-api.ts`
- `frontend/nguoi-dan/src/app/ca-nhan/page.tsx`
- `frontend/nguoi-dan/src/app/ca-nhan/thanh-toan/page.tsx`
- `frontend/nguoi-dan/src/app/tra-cuu/page.tsx`
- `frontend/nguoi-dan/src/app/thu-vien/video/[id]/page.tsx`
- `frontend/nguoi-dan/src/app/tim-kiem/page.tsx`
- `frontend/nguoi-dan/src/app/thu-vien/album/[id]/page.tsx`
- `frontend/nguoi-dan/src/app/nop-ho-so/page.tsx`

---

## 🔐 Security Fixes

### 3. User Secrets cho Backend

```powershell
# Chuyển vào thư mục API
cd backend/phuongxa-api/src/PhuongXa.API

# Khởi tạo User Secrets
dotnet user-secrets init

# Thêm secrets
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=phuongxa_db;Username=postgres;Password=YOUR_SECURE_PASSWORD"
dotnet user-secrets set "Jwt:Key" "YOUR_VERY_LONG_AND_SECURE_JWT_KEY_AT_LEAST_32_CHARACTERS"
dotnet user-secrets set "DefaultAdmin:Password" "YOUR_SECURE_ADMIN_PASSWORD"
dotnet user-secrets set "Email:Password" "YOUR_EMAIL_PASSWORD"
```

### 4. Cập Nhật appsettings.Development.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "CHANGE_ME_IN_USER_SECRETS"
  },
  "Jwt": {
    "Key": "CHANGE_ME_IN_USER_SECRETS",
    "Issuer": "PhuongXaAPI",
    "Audience": "PhuongXaClient",
    "AccessTokenMinutes": "15",
    "RefreshTokenDays": "7"
  },
  "DefaultAdmin": {
    "Password": "CHANGE_ME_IN_USER_SECRETS"
  },
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "EnableSsl": "true",
    "SenderEmail": "",
    "SenderName": "Cổng TTĐT Phường/Xã",
    "Username": "",
    "Password": "CHANGE_ME_IN_USER_SECRETS"
  }
}
```

---

## 🎨 UI Components

### 5. Error Boundary Component

Đã tạo sẵn, cần thêm vào layout:

```typescript
// frontend/src/app/layout.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

### 6. Loading Component

Đã tạo sẵn, sử dụng khi cần:

```typescript
import { Loading } from '@/components/Loading'

{loading && <Loading message="Đang tải dữ liệu..." />}
```

### 7. Pagination Component

Đã tạo sẵn, sử dụng cho các danh sách:

```typescript
import { Pagination } from '@/components/Pagination'

<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

---

## 🔧 Hooks và Utilities

### 8. useDebounce Hook

Đã tạo sẵn, sử dụng cho search:

```typescript
import { useDebounce } from '@/hooks/useDebounce'

const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 500)

useEffect(() => {
  if (debouncedSearch) {
    loadData()
  }
}, [debouncedSearch])
```

### 9. Token Storage Utility

Đã tạo sẵn, thay thế localStorage trực tiếp:

```typescript
import { tokenStorage } from '@/lib/auth/token'

// Thay vì
localStorage.setItem('auth_token', token)
localStorage.getItem('auth_token')
localStorage.removeItem('auth_token')

// Dùng
tokenStorage.set(token)
tokenStorage.get()
tokenStorage.remove()
```

---

## 📦 Cài Đặt Dependencies

### Frontend Admin
```powershell
cd frontend
npm install zod @tanstack/react-query
```

### Frontend Người Dân
```powershell
cd frontend/nguoi-dan
npm install zod
```

### Backend
```powershell
cd backend/phuongxa-api
dotnet add src/PhuongXa.API package AspNetCoreRateLimit
dotnet add src/PhuongXa.Infrastructure package SixLabors.ImageSharp
```

---

## 🚀 Restart Sau Khi Fix

### 1. Restart Backend
```powershell
cd backend/phuongxa-api
dotnet build
dotnet run --project src/PhuongXa.API
```

### 2. Restart Frontend Admin
```powershell
cd frontend
Remove-Item -Recurse -Force .next
npm run dev
```

### 3. Restart Frontend Người Dân
```powershell
cd frontend/nguoi-dan
Remove-Item -Recurse -Force .next
npm run dev -- --port 3001
```

---

## ✅ Checklist Hoàn Thành

### Critical Fixes
- [x] Logger utility created
- [x] API client updated
- [x] Articles page updated
- [ ] Remaining console.log files (manual)
- [ ] User Secrets configured
- [ ] appsettings.json cleaned
- [ ] Token storage unified

### Components Created
- [x] ErrorBoundary
- [x] Loading
- [x] Pagination
- [x] UploadProgress

### Hooks Created
- [x] useDebounce

### Utilities Created
- [x] logger
- [x] tokenStorage

### Backend Improvements
- [ ] Rate limiting configured
- [ ] Image optimization added
- [ ] Email templates created

---

## 📝 Lưu Ý

1. **Console.log**: Đã tạo logger utility, cần thay thế thủ công trong các file còn lại
2. **User Secrets**: Phải cấu hình trước khi chạy backend
3. **Dependencies**: Phải cài đặt trước khi sử dụng các component mới
4. **Restart**: Phải restart tất cả services sau khi fix

---

## 🎯 Kết Quả Mong Đợi

Sau khi hoàn thành tất cả fixes:
- ✅ Không có console.log trong production
- ✅ Secrets được bảo mật
- ✅ Error handling tốt hơn
- ✅ Loading states đầy đủ
- ✅ Code sạch và maintainable hơn
- ✅ Performance tốt hơn với debounce và caching
- ✅ Security tốt hơn với rate limiting

**Thời gian ước tính:** 4-6 hours để hoàn thành tất cả
