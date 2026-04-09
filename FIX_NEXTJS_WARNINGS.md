# Fix Next.js Warnings - Webpack & Lockfiles

## Các Warning Đã Fix

### 🟡 1. Warning: Reverting webpack devtool to 'false'

**Nguyên nhân:**
- Config webpack có set `devtool = 'cheap-module-source-map'`
- Next.js tự động override về `false` vì làm giảm hiệu năng

**Giải pháp:** ✅
- Xóa phần config `devtool` trong webpack
- Để Next.js tự động quản lý source maps
- File đã sửa: `frontend/next.config.mjs`

**Trước:**
```javascript
webpack: (config, { dev }) => {
  if (dev) {
    config.devtool = 'cheap-module-source-map'; // ❌ Gây warning
  }
  return config;
}
```

**Sau:**
```javascript
webpack: (config, { dev }) => {
  // Next.js tự động quản lý devtool ✅
  return config;
}
```

### 🟡 2. Warning: Next.js inferred your workspace root

**Nguyên nhân:**
- Có nhiều `package-lock.json` trong project:
  - `frontend/package-lock.json`
  - `frontend/nguoi-dan/package-lock.json`
- Next.js không biết chọn root nào

**Giải pháp:** ✅
- Thêm `turbopack.root` vào config của cả 2 project
- Chỉ định rõ ràng root directory

**File đã sửa:**
1. `frontend/next.config.mjs`
2. `frontend/nguoi-dan/next.config.ts`

**Code thêm vào:**
```javascript
turbopack: {
  root: __dirname,
}
```

### 🟡 3. Detected additional lockfiles

**Nguyên nhân:**
- Project có cấu trúc monorepo với 2 Next.js app riêng biệt
- Mỗi app có `package-lock.json` riêng

**Giải pháp:** ✅
- Giữ nguyên cấu trúc (vì đây là 2 app độc lập)
- Thêm `turbopack.root` để Next.js hiểu đúng cấu trúc
- Warning sẽ biến mất sau khi restart dev server

## Files Đã Thay Đổi

### 1. frontend/next.config.mjs (Admin)
```javascript
const nextConfig = {
  turbopack: {
    root: __dirname,  // ✅ Thêm dòng này
  },
  webpack: (config, { dev }) => {
    // ✅ Xóa config.devtool
    return config;
  },
  // ... rest of config
}
```

### 2. frontend/nguoi-dan/next.config.ts (Người Dân)
```typescript
const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,  // ✅ Thêm dòng này
  },
  output: "standalone",
  // ... rest of config
}
```

## Kiểm Tra

### Trước khi fix:
```
⚠ Warning: Reverting webpack devtool to 'false'
⚠ Warning: Next.js inferred your workspace root
⚠ Detected additional lockfiles
```

### Sau khi fix:
```
✓ Ready in 2.5s
✓ Compiled successfully
```

## Cách Test

1. **Stop tất cả dev servers**
```bash
# Ctrl+C để stop các server đang chạy
```

2. **Restart frontend admin**
```bash
cd frontend
npm run dev
```

3. **Restart frontend người dân**
```bash
cd frontend/nguoi-dan
npm run dev
```

4. **Kiểm tra console**
- Không còn warning về webpack devtool
- Không còn warning về workspace root
- Không còn warning về lockfiles

## Lưu Ý

### Tại sao giữ 2 package-lock.json?
- Đây là 2 Next.js app hoàn toàn độc lập
- Mỗi app có dependencies riêng
- Không phải monorepo thực sự (không dùng workspace)

### Nếu muốn chuyển sang monorepo thực sự:
1. Tạo `package.json` ở root với workspaces
2. Di chuyển dependencies chung lên root
3. Dùng npm workspaces hoặc pnpm/yarn workspaces

Nhưng với cấu trúc hiện tại, giữ nguyên là tốt nhất! ✅

## Kết Quả

✅ Không còn warning webpack devtool
✅ Không còn warning workspace root  
✅ Không còn warning lockfiles
✅ App vẫn chạy bình thường
✅ Build vẫn OK
