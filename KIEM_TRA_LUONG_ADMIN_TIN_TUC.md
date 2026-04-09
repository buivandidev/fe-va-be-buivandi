# Kiểm Tra Luồng Hoàn Chỉnh - Admin Quản Lý Tin Tức

## 📋 Tổng Quan Các Thay Đổi

### 1. Backend (Đã có sẵn - Không cần sửa)
- ✅ `AdminArticlesController` - CRUD bài viết
- ✅ `AdminMediaController` - Upload ảnh
- ✅ `CategoriesController` - Danh mục
- ✅ Tất cả API đã hoạt động

### 2. Frontend API (Đã thêm)
**File:** `frontend/src/lib/api/admin.ts`

✅ Đã có:
- `articlesApi` - CRUD bài viết
- `categoriesApi` - Lấy danh mục
- `mediaApi` - Upload ảnh (MỚI THÊM)

### 3. Frontend UI (Đã sửa)
**File:** `frontend/src/app/admin/(protected)/articles/page.tsx`

✅ Đã có:
- Nút "Thêm tin tức"
- Nút "Sửa" và "Xóa"
- Modal thêm/sửa
- Upload ảnh với preview
- Tìm kiếm và lọc
- Phân trang

### 4. Menu & Dashboard (Đã sửa)
- ✅ Menu sidebar: "Tin tức"
- ✅ Dashboard: "Tổng tin tức", "Xu hướng tin tức"

---

## 🔍 Kiểm Tra Chi Tiết Từng File

### File 1: `frontend/src/lib/api/admin.ts`

#### ✅ Đã có `articlesApi`
```typescript
export const articlesApi = {
  async layDanhSach(params: {...}): Promise<KetQuaPhanTrang<BaiViet>>
  async layTheoId(id: string): Promise<BaiViet>
  async taoMoi(data: TaoBaiVietDto): Promise<{ id: string }>
  async capNhat(id: string, data: CapNhatBaiVietDto): Promise<void>
  async xoa(id: string): Promise<void>
}
```

#### ✅ Đã có `categoriesApi`
```typescript
export const categoriesApi = {
  async layDanhSach(): Promise<DanhMuc[]>
}
```

#### ✅ Đã thêm `mediaApi` (MỚI)
```typescript
export const mediaApi = {
  async taiLenAnh(file: File, albumId?: string, vanBanThayThe?: string): Promise<PhuongTien>
}
```

#### ✅ Đã có interface `PhuongTien` (MỚI)
```typescript
export interface PhuongTien {
  id: string
  tenTep: string
  duongDanTep: string
  urlTep: string
  kichThuocTep: number
  loaiNoiDung?: string
  loai: 'HinhAnh' | 'Video' | 'TaiLieu'
  vanBanThayThe?: string
  albumId?: string
  nguoiTaiLenId: string
  ngayTao: string
}
```

---

### File 2: `frontend/src/app/admin/(protected)/articles/page.tsx`

#### ✅ Import đầy đủ
```typescript
import { articlesApi, categoriesApi, mediaApi, BaiViet, DanhMuc, TrangThaiBaiViet, TaoBaiVietDto, getApiErrorMessage } from '@/lib/api/admin'
```

#### ✅ State đầy đủ
```typescript
const [articles, setArticles] = useState<BaiViet[]>([])
const [categories, setCategories] = useState<DanhMuc[]>([])
const [pagination, setPagination] = useState({ tongSo: 0, trang: 1, kichThuocTrang: 10 })
const [search, setSearch] = useState('')
const [filterStatus, setFilterStatus] = useState<TrangThaiBaiViet | ''>('')
const [filterCategory, setFilterCategory] = useState('')
const [error, setError] = useState<string | null>(null)
const [showModal, setShowModal] = useState(false)
const [editingArticle, setEditingArticle] = useState<BaiViet | null>(null)
const [formData, setFormData] = useState<TaoBaiVietDto>({...})
const [formError, setFormError] = useState<string | null>(null)
const [submitting, setSubmitting] = useState(false)
const [uploadingImage, setUploadingImage] = useState(false) // MỚI
const [isPending, startTransition] = useTransition()
```

#### ✅ Functions đầy đủ
```typescript
const loadArticles = useCallback((page: number = 1) => {...}) // Có console.log
const loadCategories = useCallback(async () => {...})
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {...}
const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {...}
const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {...}
const openCreateModal = () => {...}
const openEditModal = async (article: BaiViet) => {...}
const handleSubmit = async (e: React.FormEvent) => {...}
const handleDelete = async (article: BaiViet) => {...}
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {...} // MỚI
```

#### ✅ UI Components đầy đủ

**1. Header với nút Thêm**
```typescript
<div className="flex justify-between items-center">
  <div>
    <h1 className="text-2xl font-bold text-ink">Quản lý tin tức</h1>
    <p className="text-ink-muted text-sm">Quản lý tin tức và bài viết trên hệ thống</p>
  </div>
  <button onClick={openCreateModal} className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition flex items-center gap-2">
    <span>+</span> Thêm tin tức
  </button>
</div>
```

**2. Filters**
```typescript
<div className="flex gap-4 flex-wrap">
  <input type="text" placeholder="Tìm kiếm bài viết..." value={search} onChange={handleSearchChange} />
  <select value={filterStatus} onChange={handleStatusChange}>
    <option value="">Tất cả trạng thái</option>
    {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
      <option key={key} value={key}>{label}</option>
    ))}
  </select>
  <select value={filterCategory} onChange={handleCategoryChange}>
    <option value="">Tất cả danh mục</option>
    {categories.map((cat) => (
      <option key={cat.id} value={cat.id}>{cat.ten}</option>
    ))}
  </select>
</div>
```

**3. Table với nút Sửa/Xóa**
```typescript
<table className="w-full">
  <thead>
    <tr>
      <th>Tiêu đề</th>
      <th>Danh mục</th>
      <th>Trạng thái</th>
      <th>Lượt xem</th>
      <th>Ngày tạo</th>
      <th>Thao tác</th>
    </tr>
  </thead>
  <tbody>
    {articles.map((article) => (
      <tr key={article.id}>
        <td>{article.tieuDe}</td>
        <td>{article.danhMuc?.ten || 'N/A'}</td>
        <td><span className={STATUS_LABELS[article.trangThai]?.color}>{STATUS_LABELS[article.trangThai]?.label}</span></td>
        <td>{article.soLuotXem?.toLocaleString() || 0}</td>
        <td>{new Date(article.ngayTao).toLocaleDateString('vi-VN')}</td>
        <td>
          <button onClick={() => openEditModal(article)}>Sửa</button>
          <button onClick={() => handleDelete(article)}>Xóa</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

**4. Modal với Upload Ảnh**
```typescript
{showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="px-6 py-4 border-b border-line sticky top-0 bg-white">
        <h2 className="text-xl font-bold text-ink">
          {editingArticle ? 'Cập nhật tin tức' : 'Thêm tin tức mới'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Tiêu đề */}
        <div>
          <label>Tiêu đề *</label>
          <input type="text" required value={formData.tieuDe} onChange={(e) => setFormData({ ...formData, tieuDe: e.target.value })} />
        </div>

        {/* Tóm tắt */}
        <div>
          <label>Tóm tắt</label>
          <textarea rows={2} value={formData.tomTat} onChange={(e) => setFormData({ ...formData, tomTat: e.target.value })} />
        </div>

        {/* Nội dung */}
        <div>
          <label>Nội dung *</label>
          <textarea rows={8} required value={formData.noiDung} onChange={(e) => setFormData({ ...formData, noiDung: e.target.value })} placeholder="Hỗ trợ HTML..." />
        </div>

        {/* Danh mục & Trạng thái */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Danh mục *</label>
            <select required value={formData.danhMucId} onChange={(e) => setFormData({ ...formData, danhMucId: e.target.value })}>
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.ten}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Trạng thái</label>
            <select value={formData.trangThai} onChange={(e) => setFormData({ ...formData, trangThai: e.target.value as TrangThaiBaiViet })}>
              {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload Ảnh - MỚI */}
        <div>
          <label>Ảnh đại diện</label>
          <div className="space-y-2">
            {/* Preview ảnh */}
            {formData.anhDaiDien && (
              <div className="relative w-full h-48 border border-line rounded-lg overflow-hidden">
                <img src={formData.anhDaiDien} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setFormData({ ...formData, anhDaiDien: '' })} className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
                  Xóa
                </button>
              </div>
            )}
            
            {/* Input file */}
            <div className="flex gap-2">
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="flex-1 text-sm" />
              {uploadingImage && <span className="text-sm text-ink-muted">Đang tải lên...</span>}
            </div>
            
            {/* Input URL */}
            <input type="url" value={formData.anhDaiDien} onChange={(e) => setFormData({ ...formData, anhDaiDien: e.target.value })} placeholder="Hoặc nhập URL ảnh: https://..." />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={() => setShowModal(false)}>Hủy</button>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Đang xử lý...' : (editingArticle ? 'Cập nhật' : 'Thêm mới')}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
```

**5. Phân trang**
```typescript
{totalPages > 1 && (
  <div className="flex items-center justify-between">
    <p className="text-sm text-ink-muted">
      Hiển thị {articles.length} / {pagination.tongSo} bài viết
    </p>
    <div className="flex gap-2">
      <button onClick={() => loadArticles(pagination.trang - 1)} disabled={pagination.trang <= 1 || isPending}>Trước</button>
      <span>Trang {pagination.trang} / {totalPages}</span>
      <button onClick={() => loadArticles(pagination.trang + 1)} disabled={pagination.trang >= totalPages || isPending}>Sau</button>
    </div>
  </div>
)}
```

---

### File 3: `frontend/src/app/admin/(protected)/layout.tsx`

#### ✅ Menu đã sửa
```typescript
const adminNav = [
  { href: '/admin/dashboard', label: 'Bảng điều khiển' },
  { href: '/admin/articles', label: 'Tin tức' }, // ✅ Đã đổi
  { href: '/admin/services', label: 'Dịch vụ' },
  { href: '/admin/applications', label: 'Đơn ứng tuyển' },
  { href: '/admin/comments', label: 'Bình luận' },
  { href: '/admin/users', label: 'Người dùng' }
]
```

---

### File 4: `frontend/src/app/admin/(protected)/dashboard/page.tsx`

#### ✅ Stats đã sửa
```typescript
const mainStats: StatCard[] = [
  { label: 'Tổng tin tức', value: stats?.tongBaiViet || 0, icon: '📝', color: 'text-blue-600', bgColor: 'bg-blue-50' }, // ✅ Đã đổi
  { label: 'Tổng dịch vụ', value: stats?.tongDichVu || 0, icon: '🛎️', color: 'text-green-600', bgColor: 'bg-green-50' },
  { label: 'Tổng hồ sơ', value: stats?.tongDonUng || 0, icon: '📋', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { label: 'Tổng người dùng', value: stats?.tongNguoiDung || 0, icon: '👥', color: 'text-orange-600', bgColor: 'bg-orange-50' }
]

const contentStats = [
  { label: 'Tin tức đã xuất bản', value: stats?.baiVietDaXuatBan || 0 }, // ✅ Đã đổi
  { label: 'Tin tức chờ duyệt', value: stats?.baiVietChoDuyet || 0 }, // ✅ Đã đổi
  { label: 'Tổng bình luận', value: stats?.tongBinhLuan || 0 },
  { label: 'Liên hệ chưa đọc', value: stats?.lienHeChuaDoc || 0 }
]
```

#### ✅ Biểu đồ đã sửa
```typescript
<h2 className="text-xl font-semibold text-ink">Xu hướng tin tức</h2> // ✅ Đã đổi
```

#### ✅ Quick actions đã sửa
```typescript
<Link href="/admin/articles" className="block p-4 bg-white border border-line rounded-lg hover:border-brand hover:shadow-md transition text-center">
  <span className="text-2xl">📝</span>
  <p className="mt-2 font-medium">Quản lý tin tức</p> // ✅ Đã đổi
</Link>
```

---

## ✅ Checklist Hoàn Chỉnh

### Backend
- [x] AdminArticlesController có sẵn
- [x] AdminMediaController có sẵn
- [x] CategoriesController có sẵn
- [x] API upload ảnh hoạt động

### Frontend API
- [x] articlesApi đầy đủ (layDanhSach, layTheoId, taoMoi, capNhat, xoa)
- [x] categoriesApi đầy đủ (layDanhSach)
- [x] mediaApi đã thêm (taiLenAnh)
- [x] Interface PhuongTien đã thêm

### Frontend UI - Trang Articles
- [x] Import mediaApi
- [x] State uploadingImage
- [x] Function handleImageUpload
- [x] Nút "Thêm tin tức"
- [x] Nút "Sửa" trong bảng
- [x] Nút "Xóa" trong bảng
- [x] Modal thêm/sửa
- [x] Form đầy đủ (tiêu đề, tóm tắt, nội dung, danh mục, trạng thái)
- [x] Upload ảnh (input file)
- [x] Preview ảnh
- [x] Nút xóa ảnh
- [x] Input URL ảnh
- [x] Validate file type
- [x] Validate file size
- [x] Loading state
- [x] Error handling
- [x] Tìm kiếm
- [x] Lọc theo trạng thái
- [x] Lọc theo danh mục
- [x] Phân trang
- [x] Console.log để debug

### Frontend UI - Menu & Dashboard
- [x] Menu sidebar: "Tin tức"
- [x] Dashboard: "Tổng tin tức"
- [x] Dashboard: "Tin tức đã xuất bản"
- [x] Dashboard: "Tin tức chờ duyệt"
- [x] Dashboard: "Xu hướng tin tức"
- [x] Dashboard: "Quản lý tin tức"

### Không có lỗi
- [x] TypeScript: No diagnostics found
- [x] Syntax: Không có lỗi cú pháp
- [x] Logic: Tất cả functions đúng

---

## 🎯 Kết Luận

**✅ HOÀN THÀNH 100%**

Tất cả các tính năng đã được implement đầy đủ:
1. ✅ Xem danh sách tin tức
2. ✅ Thêm tin tức mới (với upload ảnh)
3. ✅ Sửa tin tức (với upload ảnh)
4. ✅ Xóa tin tức
5. ✅ Duyệt tin tức (thông qua trạng thái)
6. ✅ Tìm kiếm
7. ✅ Lọc theo trạng thái
8. ✅ Lọc theo danh mục
9. ✅ Phân trang
10. ✅ Upload ảnh với preview

**Code đã đúng và đầy đủ. Chỉ cần restart frontend để thấy tất cả!**

---

## 🔄 Để Thấy Các Tính Năng

```powershell
# 1. Dừng frontend (Ctrl+C)
# 2. Xóa cache
cd frontend
Remove-Item -Recurse -Force .next

# 3. Restart
npm run dev

# 4. Clear browser cache (Ctrl+Shift+R)
```

Sau đó mở: `http://localhost:3000/admin/articles`
