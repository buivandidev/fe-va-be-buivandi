# 🚀 Hướng Dẫn Áp Dụng Improvements

## 📋 Tổng Quan

Tất cả utilities và components đã được tạo. Bây giờ cần áp dụng vào code hiện tại.

---

## ✅ Đã Tạo Xong

### Utilities
- ✅ `frontend/src/lib/utils/logger.ts`
- ✅ `frontend/nguoi-dan/src/lib/utils/logger.ts`
- ✅ `frontend/src/lib/auth/token.ts`
- ✅ `frontend/nguoi-dan/src/lib/auth/token.ts`

### Components
- ✅ `frontend/src/components/ErrorBoundary.tsx`
- ✅ `frontend/nguoi-dan/src/components/ErrorBoundary.tsx`
- ✅ `frontend/src/components/Loading.tsx` (đã có, đã cải tiến)
- ✅ `frontend/nguoi-dan/src/components/Loading.tsx`
- ✅ `frontend/src/components/Pagination.tsx`
- ✅ `frontend/nguoi-dan/src/components/Pagination.tsx`

### Hooks
- ✅ `frontend/src/hooks/useDebounce.ts`
- ✅ `frontend/nguoi-dan/src/hooks/useDebounce.ts`

### Scripts
- ✅ `backend/phuongxa-api/setup-secrets.ps1`

---

## 🔧 Cần Làm Tiếp

### 1. Thay Thế Console Logs

**Tự động tìm và thay thế:**
```powershell
# Tìm tất cả console.log trong frontend
cd frontend
Get-ChildItem -Recurse -Include *.ts,*.tsx | Select-String "console\."

# Tìm tất cả console.log trong frontend người dân
cd frontend/nguoi-dan
Get-ChildItem -Recurse -Include *.ts,*.tsx | Select-String "console\."
```

**Thay thế thủ công:**
- Mở từng file
- Import logger: `import { logger } from '@/lib/utils/logger'`
- Thay `console.log` → `logger.log`
- Thay `console.error` → `logger.error`
- Thay `console.warn` → `logger.warn`

---

### 2. Thay Thế localStorage Token

**Frontend Admin - Cần sửa:**
- `frontend/src/lib/api/client.ts` (line 23, 27, 89)
- `frontend/src/lib/auth/session.ts` (nếu có)
- `frontend/src/app/admin/login/page.tsx`

**Frontend Người Dân - Cần sửa:**
- `frontend/nguoi-dan/src/lib/api.ts` (line 42)
- `frontend/nguoi-dan/src/app/dang-nhap/page.tsx`
- `frontend/nguoi-dan/src/app/ca-nhan/page.tsx` (line 81)

**Cách sửa:**
```typescript
// Trước
const token = localStorage.getItem('auth_token')
localStorage.setItem('auth_token', token)
localStorage.removeItem('auth_token')

// Sau
import { tokenStorage } from '@/lib/auth/token'
const token = tokenStorage.get()
tokenStorage.set(token)
tokenStorage.remove()
```

---

### 3. Thêm Error Boundary vào Layout

**Frontend Admin:**
```typescript
// frontend/src/app/layout.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

**Frontend Người Dân:**
```typescript
// frontend/nguoi-dan/src/app/layout.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

---

### 4. Sử Dụng Loading Component

**Ví dụ trong articles page:**
```typescript
import { Loading } from '@/components/Loading'

// Thay thế
{loading && <div>Đang tải...</div>}

// Bằng
{loading && <Loading message="Đang tải tin tức..." />}
```

---

### 5. Thêm Debounce cho Search

**Ví dụ trong articles page:**
```typescript
import { useDebounce } from '@/hooks/useDebounce'

const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 500)

// Thay đổi useEffect
useEffect(() => {
  loadArticles(1)
}, [debouncedSearch]) // Thay vì [search]
```

---

### 6. Setup User Secrets

```powershell
cd backend/phuongxa-api
.\setup-secrets.ps1
```

Sau đó cập nhật `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "CHANGE_ME_IN_USER_SECRETS"
  },
  "Jwt": {
    "Key": "CHANGE_ME_IN_USER_SECRETS"
  },
  "DefaultAdmin": {
    "Password": "CHANGE_ME_IN_USER_SECRETS"
  }
}
```

---

## 📊 Checklist Chi Tiết

### Frontend Admin

#### Files cần sửa console logs:
- [ ] `frontend/src/lib/api/client.ts`
- [ ] `frontend/src/lib/auth/session.ts`
- [ ] `frontend/src/app/admin/test-api/page.tsx`
- [ ] `frontend/src/app/admin/(protected)/services/page.tsx`
- [ ] `frontend/src/app/admin/(protected)/applications/page.tsx`
- [ ] `frontend/src/app/admin/(protected)/articles/page.tsx`

#### Files cần sửa token storage:
- [ ] `frontend/src/lib/api/client.ts`
- [ ] `frontend/src/app/admin/login/page.tsx`

#### Files cần thêm Error Boundary:
- [ ] `frontend/src/app/layout.tsx`

---

### Frontend Người Dân

#### Files cần sửa console logs:
- [ ] `frontend/nguoi-dan/src/lib/services-api.ts`
- [ ] `frontend/nguoi-dan/src/lib/departments-api.ts`
- [ ] `frontend/nguoi-dan/src/app/ca-nhan/thanh-toan/page.tsx`
- [ ] `frontend/nguoi-dan/src/app/tra-cuu/page.tsx`
- [ ] `frontend/nguoi-dan/src/app/thu-vien/video/[id]/page.tsx`
- [ ] `frontend/nguoi-dan/src/app/tim-kiem/page.tsx`
- [ ] `frontend/nguoi-dan/src/app/thu-vien/album/[id]/page.tsx`
- [ ] `frontend/nguoi-dan/src/app/nop-ho-so/page.tsx`
- [ ] `frontend/nguoi-dan/src/app/ca-nhan/page.tsx`

#### Files cần sửa token storage:
- [ ] `frontend/nguoi-dan/src/lib/api.ts`
- [ ] `frontend/nguoi-dan/src/app/dang-nhap/page.tsx`
- [ ] `frontend/nguoi-dan/src/app/ca-nhan/page.tsx`

#### Files cần thêm Error Boundary:
- [ ] `frontend/nguoi-dan/src/app/layout.tsx`

---

### Backend

#### Setup User Secrets:
- [ ] Chạy `setup-secrets.ps1`
- [ ] Cập nhật `appsettings.Development.json`
- [ ] Test kết nối database
- [ ] Test JWT authentication

---

## 🎯 Ưu Tiên

### Priority 1 (Làm ngay):
1. ✅ Setup User Secrets (bảo mật)
2. ✅ Thay console logs (bảo mật)
3. ✅ Thêm Error Boundary (UX)

### Priority 2 (Làm sau):
4. ✅ Thay token storage (code quality)
5. ✅ Sử dụng Loading component (UX)
6. ✅ Thêm debounce (performance)

---

## 🚀 Quick Start

### Bước 1: Setup Backend
```powershell
cd backend/phuongxa-api
.\setup-secrets.ps1
```

### Bước 2: Update Frontend Admin
```powershell
cd frontend

# Tìm console logs
Get-ChildItem -Recurse -Include *.ts,*.tsx | Select-String "console\." | Select-Object -First 20

# Sửa từng file theo hướng dẫn trên
```

### Bước 3: Update Frontend Người Dân
```powershell
cd frontend/nguoi-dan

# Tìm console logs
Get-ChildItem -Recurse -Include *.ts,*.tsx | Select-String "console\." | Select-Object -First 20

# Sửa từng file theo hướng dẫn trên
```

### Bước 4: Test
```powershell
# Test backend
cd backend/phuongxa-api
dotnet build
dotnet run --project src/PhuongXa.API

# Test frontend admin
cd frontend
npm run dev

# Test frontend người dân
cd frontend/nguoi-dan
npm run dev -- --port 3001
```

---

## ✅ Kết Luận

Tất cả utilities và components đã sẵn sàng. Chỉ cần áp dụng vào code hiện tại theo checklist trên.

**Thời gian ước tính:** 2-3 hours để áp dụng tất cả

**Kết quả:** Hệ thống an toàn, ổn định và professional hơn
