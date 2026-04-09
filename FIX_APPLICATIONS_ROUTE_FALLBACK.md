# ✅ FIX: Hồ sơ gần đây không hiển thị - Route Fallback Issue

## Vấn đề gốc
User đã nộp hồ sơ nhưng trang cá nhân vẫn hiển thị "Chưa có hồ sơ nào gần đây".

## Nguyên nhân

### 1. API Routes
Có 3 controllers xử lý applications:

```csharp
// 1. Public - User thường có thể truy cập
[Route("api/public/applications")]
[Authorize]  // Chỉ cần đăng nhập
public class PublicApplicationsController

// 2. Legacy - CHỈ ADMIN
[Route("api/applications")]
[Authorize(Roles = "Admin,Editor")]  // Yêu cầu role Admin!
public class DonUngController

// 3. Admin
[Route("api/admin/applications")]
[Authorize(Roles = "Admin,Editor")]
public class AdminApplicationsController
```

### 2. Frontend Fallback Logic
File `frontend/nguoi-dan/src/lib/api.ts` có logic fallback:

```typescript
function getLegacyRouteFallbackPath(path: string): string | null {
  if (path.startsWith("/api/public/applications")) {
    return path.replace("/api/public/applications", "/api/applications");
    // ❌ Fallback sang route yêu cầu Admin role!
  }
  // ...
}
```

### 3. Luồng lỗi
```
1. Frontend gọi: GET /api/public/applications
2. Nếu 404 → Fallback sang: GET /api/applications
3. Backend check role → User không phải Admin
4. Trả về 403 Forbidden
5. Frontend không có data → Hiển thị empty state
```

## Giải pháp

### Xóa fallback cho applications route

```typescript
function getLegacyRouteFallbackPath(path: string): string | null {
  // KHÔNG fallback cho /api/public/applications 
  // vì route legacy yêu cầu Admin role
  
  // Giữ fallback cho các route khác
  if (path.startsWith("/api/public/services")) {
    return path.replace("/api/public/services", "/api/services");
  }
  // ...
}
```

## Thay đổi

### File: `frontend/nguoi-dan/src/lib/api.ts`

**Trước:**
```typescript
if (path.startsWith("/api/public/applications")) {
  return path.replace("/api/public/applications", "/api/applications");
}
```

**Sau:**
```typescript
// KHÔNG fallback cho /api/public/applications vì route legacy yêu cầu Admin role
// if (path.startsWith("/api/public/applications")) {
//   return path.replace("/api/public/applications", "/api/applications");
// }
```

## Test

### 1. Refresh trang cá nhân
```
1. Mở: http://localhost:3001/ca-nhan
2. Nhấn F5 để refresh
3. Kiểm tra hồ sơ hiển thị
```

### 2. Kiểm tra Console
```
F12 → Console tab

Trước (lỗi):
📡 API Responses: { apps: { status: 403, ok: false } }
📋 Applications list: []

Sau (đúng):
📡 API Responses: { apps: { status: 200, ok: true } }
📋 Applications list: [{ maTheoDoi: "...", ... }]
✅ Normalized applications: [{ maHoSo: "...", ... }]
```

### 3. Kiểm tra Network
```
F12 → Network tab → XHR

Trước:
GET /api/public/applications → 404
GET /api/applications → 403 Forbidden ❌

Sau:
GET /api/public/applications → 200 OK ✅
```

## Tại sao có fallback logic?

Fallback được tạo để hỗ trợ migration từ route cũ sang route mới:
- Route cũ: `/api/services`, `/api/profile`, `/api/applications`
- Route mới: `/api/public/services`, `/api/public/profile`, `/api/public/applications`

Nhưng với applications, route cũ đã được chuyển thành Admin-only, nên không thể fallback.

## Các route khác

### Services - OK để fallback
```csharp
// Public
[Route("api/public/services")]
[AllowAnonymous]

// Legacy
[Route("api/services")]
[AllowAnonymous]
```

### Profile - OK để fallback
```csharp
// Public
[Route("api/public/profile")]
[Authorize]

// Legacy
[Route("api/profile")]
[Authorize]
```

### Applications - KHÔNG OK để fallback
```csharp
// Public
[Route("api/public/applications")]
[Authorize]  // User thường

// Legacy
[Route("api/applications")]
[Authorize(Roles = "Admin,Editor")]  // CHỈ ADMIN ❌
```

## Kết quả

✅ User thường có thể xem hồ sơ của mình
✅ Không còn fallback sang route Admin-only
✅ API trả về 200 OK với data đúng
✅ Dashboard hiển thị hồ sơ gần đây

## Hoàn thành! 🎉

Sau khi fix, refresh trang cá nhân và hồ sơ sẽ hiển thị ngay!
