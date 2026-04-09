# Sửa Lỗi: Đồng Bộ Trang Tiến Độ và Ẩn Nút Đăng Nhập

## Vấn Đề Đã Sửa

### 1. Trang Tra Cứu và Quản Lý Không Khớp Giao Diện ✅

**Vấn đề:** 
- Trang tra cứu tiến độ (người dân) và trang quản lý hồ sơ (admin) hiển thị trạng thái không đồng nhất
- STATUS_LABELS khác nhau giữa các trang

**Giải pháp:**
- Đồng bộ STATUS_LABELS với cấu trúc đầy đủ (label, color, bgColor)
- Cập nhật 3 file:
  - `frontend/nguoi-dan/src/app/tra-cuu/page.tsx`
  - `frontend/nguoi-dan/src/app/ca-nhan/page.tsx`
  - `frontend/src/app/admin/(protected)/applications/page.tsx` (đã có sẵn)

**Trạng thái chuẩn:**
```typescript
const STATUS_LABELS = {
  ChoXuLy: { label: 'Chờ xử lý', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  DangXuLy: { label: 'Đang xử lý', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  HoanThanh: { label: 'Hoàn thành', color: 'text-green-700', bgColor: 'bg-green-100' },
  TuChoi: { label: 'Từ chối', color: 'text-red-700', bgColor: 'bg-red-100' }
}
```

### 2. Nút Đăng Nhập Vẫn Hiện Khi Đã Authenticated ✅

**Vấn đề:**
- Header không cập nhật kịp thời khi user đăng nhập/đăng xuất
- Không có loading state khi check authentication
- Không lắng nghe thay đổi localStorage từ tab khác

**Giải pháp:**
- Thêm `isLoading` state để hiển thị skeleton khi đang check auth
- Validate token bằng cách gọi API `/api/public/profile`
- Xóa token nếu API trả về lỗi (token invalid)
- Lắng nghe `storage` event để đồng bộ giữa các tab
- Hiển thị loading placeholder thay vì nút đăng nhập khi đang check

**File đã sửa:** `frontend/nguoi-dan/src/components/portal/Header.tsx`

### 3. Cải Thiện Giao Diện Trang Tra Cứu ✅

**Thay đổi:**
- Layout kết quả tra cứu rõ ràng hơn với grid 2 cột
- Badge trạng thái có màu sắc đồng nhất với admin
- Hiển thị thông tin theo format chuẩn (label + value)
- Border và spacing tốt hơn

## Files Đã Thay Đổi

1. **frontend/nguoi-dan/src/components/portal/Header.tsx**
   - Thêm `isLoading` state
   - Validate token với API
   - Listen storage events
   - Hiển thị loading state

2. **frontend/nguoi-dan/src/app/tra-cuu/page.tsx**
   - Đồng bộ STATUS_LABELS
   - Cải thiện layout kết quả tra cứu
   - Badge màu sắc đồng nhất

3. **frontend/nguoi-dan/src/app/ca-nhan/page.tsx**
   - Đồng bộ STATUS_LABELS
   - Cải thiện logic map trạng thái
   - Badge màu sắc đồng nhất

## Kiểm Tra

### Test Case 1: Nút Đăng Nhập/Đăng Xuất
- [ ] Khi chưa đăng nhập: Hiển thị nút "Đăng nhập"
- [ ] Khi đang check auth: Hiển thị skeleton loading
- [ ] Khi đã đăng nhập: Hiển thị tên user + nút "Đăng xuất"
- [ ] Sau khi đăng xuất: Nút "Đăng nhập" xuất hiện ngay lập tức
- [ ] Đăng nhập ở tab khác: Tab hiện tại tự động cập nhật

### Test Case 2: Trạng Thái Hồ Sơ
- [ ] Trang tra cứu hiển thị đúng màu badge theo trạng thái
- [ ] Trang cá nhân hiển thị đúng màu badge theo trạng thái
- [ ] Trang admin hiển thị đúng màu badge theo trạng thái
- [ ] Tất cả 3 trang có màu sắc đồng nhất cho cùng trạng thái

### Test Case 3: Giao Diện Tra Cứu
- [ ] Layout kết quả rõ ràng, dễ đọc
- [ ] Badge trạng thái nổi bật
- [ ] Thông tin hiển thị đầy đủ (mã, người nộp, dịch vụ, ngày)

## Lưu Ý Kỹ Thuật

1. **Token Validation:** Header giờ validate token bằng API thay vì chỉ check localStorage
2. **Cross-Tab Sync:** Sử dụng `storage` event để đồng bộ auth state giữa các tab
3. **Loading State:** Tránh flash content bằng cách hiển thị skeleton khi đang load
4. **Consistent Colors:** Tất cả trang dùng chung STATUS_LABELS để đảm bảo màu sắc đồng nhất

## Chạy Thử Nghiệm

```bash
# Khởi động frontend người dân
cd frontend/nguoi-dan
npm run dev

# Khởi động frontend admin
cd frontend
npm run dev
```

Kiểm tra:
1. Mở trang chủ → Kiểm tra nút đăng nhập
2. Đăng nhập → Kiểm tra nút đăng xuất xuất hiện
3. Mở tab mới → Kiểm tra đã đăng nhập tự động
4. Tra cứu hồ sơ → Kiểm tra màu badge
5. Vào trang cá nhân → Kiểm tra màu badge
6. Vào admin → Kiểm tra màu badge khớp với người dân
