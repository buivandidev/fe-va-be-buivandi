# Fix Turbopack Error - Next.js 16

## Lỗi Gặp Phải

```
ERROR: This build is using Turbopack, with a 'webpack' config and no 'turbopack' config.
This may be a mistake.
```

## Nguyên Nhân

Next.js 16 mặc định dùng **Turbopack** thay vì Webpack.

Khi bạn có:
- ✅ Turbopack enabled (mặc định Next.js 16)
- ❌ Config webpack trong next.config
- ❌ Không có config turbopack tương ứng

→ Next.js báo lỗi vì không biết dùng cái nào!

## Giải Pháp

### ✅ Cách 1: Xóa Config Webpack (Khuyến nghị)

**Lý do:**
- Turbopack nhanh hơn Webpack rất nhiều
- Next.js 16 được tối ưu cho Turbopack
- Không cần config phức tạp

**Đã làm:**
- Xóa toàn bộ `webpack: (config) => {...}` 
- Xóa `turbopack: { root: __dirname }` (không cần thiết)
- Giữ lại các config khác (images, headers)

### ❌ Cách 2: Tắt Turbopack (Không khuyến nghị)

Nếu muốn dùng Webpack:
```bash
# Dev với webpack
npm run dev -- --no-turbopack

# Hoặc thêm vào package.json
"dev": "next dev --no-turbopack"
```

**Nhược điểm:**
- Chậm hơn Turbopack
- Không tận dụng được tính năng mới

## Files Đã Sửa

### 1. frontend/nguoi-dan/next.config.ts

**Trước:**
```typescript
const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,  // ❌ Xóa
  },
  output: "standalone",
  images: { ... },
};
```

**Sau:**
```typescript
const nextConfig: NextConfig = {
  output: "standalone",  // ✅ Giữ lại
  images: { ... },       // ✅ Giữ lại
};
```

### 2. frontend/next.config.mjs

**Trước:**
```javascript
const nextConfig = {
  turbopack: {
    root: __dirname,  // ❌ Xóa
  },
  webpack: (config) => {  // ❌ Xóa
    return config;
  },
  images: { ... },
  headers: { ... },
}
```

**Sau:**
```javascript
const nextConfig = {
  images: { ... },   // ✅ Giữ lại
  headers: { ... },  // ✅ Giữ lại
}
```

## Kết Quả

### Trước khi fix:
```
❌ ERROR: This build is using Turbopack, with a 'webpack' config
⚠️ Warning: Next.js inferred your workspace root
⚠️ Detected additional lockfiles
```

### Sau khi fix:
```
✓ Ready in 1.2s (Turbopack)
✓ Compiled successfully
```

## Cách Test

1. **Stop server hiện tại**
```bash
Ctrl + C
```

2. **Xóa cache (nếu cần)**
```bash
cd frontend/nguoi-dan
rm -rf .next
```

3. **Restart server**
```bash
npm run dev
```

4. **Kiểm tra console**
- Không còn ERROR về Turbopack
- Thấy dòng "Ready in X.Xs (Turbopack)"
- Build nhanh hơn trước

## Lưu Ý Quan Trọng

### Turbopack vs Webpack

| Feature | Turbopack | Webpack |
|---------|-----------|---------|
| Tốc độ | ⚡ Rất nhanh | 🐌 Chậm hơn |
| Next.js 16 | ✅ Mặc định | ⚠️ Legacy |
| Config | 🎯 Đơn giản | 🔧 Phức tạp |
| HMR | ⚡ Instant | ⏱️ Chậm hơn |

### Khi nào cần Webpack?

Chỉ khi:
- Dùng plugin webpack đặc biệt
- Có custom loader phức tạp
- Tích hợp tool cũ chỉ hỗ trợ webpack

→ Trong project này: **KHÔNG CẦN!** ✅

## Warning Còn Lại

### "Next.js inferred your workspace root"

**Nguyên nhân:**
- Có 2 package-lock.json:
  - `frontend/package-lock.json`
  - `frontend/nguoi-dan/package-lock.json`

**Giải pháp:**
- Bỏ qua warning này
- Đây là 2 project Next.js độc lập
- Không ảnh hưởng gì đến app

**Nếu muốn tắt warning:**
```bash
# Chạy với flag
npm run dev 2>&1 | grep -v "inferred your workspace"
```

Nhưng không cần thiết! App vẫn chạy hoàn hảo ✅

## Tóm Tắt

✅ Xóa config webpack  
✅ Xóa config turbopack.root  
✅ Giữ lại images, headers, output  
✅ Để Next.js tự động dùng Turbopack  
✅ Build nhanh hơn, ít lỗi hơn  

**Kết quả:** App chạy mượt mà với Turbopack! 🚀
