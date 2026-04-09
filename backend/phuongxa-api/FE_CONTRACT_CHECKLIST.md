# FE Contract Checklist (PhuongXa API)

Generated: 2026-04-06
Base URL (dev): `http://127.0.0.1:5187`

## 1) Global response envelope

Most endpoints return:

```json
{
  "thanhCong": true,
  "thongDiep": "...",
  "duLieu": {},
  "loiDanhSach": null
}
```

Reference:
- `PhanHoiApi<T>`: `ThanhCong`, `ThongDiep`, `DuLieu`, `LoiDanhSach`

## 2) FE HTTP client setup (required)

- Send credentials on auth/session calls:
  - Axios: `withCredentials: true`
  - Fetch: `credentials: "include"`
- CORS preflight verified:
  - `Access-Control-Allow-Origin: http://localhost:3000`
  - `Access-Control-Allow-Credentials: true`
- Auth cookies set by login/register:
  - `refreshToken`
  - `auth_token`

## 3) AUTH module

Routes:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### 3.1 Request payloads

`POST /api/auth/register`

```json
{
  "hoTen": "Nguyen Van A",
  "email": "user@example.com",
  "matKhau": "Aa@12345",
  "xacNhanMatKhau": "Aa@12345",
  "soDienThoai": "0900000000"
}
```

Compatibility aliases accepted in DTO:
- `name` -> `hoTen`
- `password` -> `matKhau`
- `confirmPassword` -> `xacNhanMatKhau`
- `phoneNumber` -> `soDienThoai`

`POST /api/auth/login`

```json
{
  "email": "user@example.com",
  "matKhau": "Aa@12345"
}
```

Compatibility aliases accepted in DTO:
- `password` -> `matKhau`
- `rememberMe` -> `nhoDangNhap`

`POST /api/auth/refresh`

```json
{
  "maLamMoi": "..."
}
```

If body missing, server also tries cookie `refreshToken`.

### 3.2 Auth response shape (important)

`register`, `login`, `refresh` return compatibility shape:

```json
{
  "thanhCong": true,
  "thongDiep": "Dang nhap thanh cong",
  "duLieu": {
    "maTruyCap": "...",
    "tokenTruyCap": "...",
    "accessToken": "...",
    "token": "...",
    "maLamMoi": "...",
    "refreshToken": "...",
    "hetHanLuc": "...",
    "expiresAt": "...",
    "nguoiDung": {
      "id": "...",
      "hoTen": "...",
      "name": "...",
      "email": "...",
      "anhDaiDien": null,
      "danhSachVaiTro": ["Viewer"],
      "roles": ["Viewer"],
      "vaiTro": "Viewer",
      "role": "Viewer"
    },
    "user": { "...": "same as nguoiDung" }
  },
  "token": "...",
  "user": { "...": "same as duLieu.nguoiDung" },
  "loiDanhSach": null
}
```

`GET /api/auth/me` returns:

```json
{
  "thanhCong": true,
  "thongDiep": null,
  "duLieu": {
    "id": "...",
    "hoTen": "...",
    "name": "...",
    "email": "...",
    "anhDaiDien": null,
    "danhSachVaiTro": ["Viewer"],
    "roles": ["Viewer"],
    "vaiTro": "Viewer",
    "role": "Viewer"
  },
  "user": { "...": "same as duLieu" },
  "loiDanhSach": null
}
```

## 4) PROFILE module

Routes:
- `GET /api/profile`
- `PUT /api/profile`
- `POST /api/profile/avatar` (multipart form-data, key `tep`)
- `GET /api/profile/applications`

`GET /api/profile` -> `duLieu` is `HoSoDto`:
- `id`, `hoTen`, `email`, `soDienThoai`, `anhDaiDien`, `danhSachVaiTro`, `ngayTao`

`PUT /api/profile` body:

```json
{
  "hoTen": "New Name",
  "soDienThoai": "0900000000"
}
```

`GET /api/profile/applications` query:
- `trang` (default 1)
- `kichThuocTrang` (default 10)

## 5) CATEGORIES module

Routes:
- `GET /api/categories`
- `GET /api/categories/tree`
- `GET /api/categories/{id}`
- `POST /api/categories` (admin/editor)
- `PUT /api/categories/{id}` (admin/editor)
- `DELETE /api/categories/{id}` (admin/editor)

Main FE route already verified: `GET /api/categories/tree`

`DanhMucDto` fields:
- `id`, `ten`, `tenDanhMuc`, `name`
- `duongDan`
- `moTa`, `description`
- `chaId`, `tenCha`
- `loai`
- `thuTuSapXep`
- `dangHoatDong`
- `ngayTao`, `createdAt`
- `danhSachCon` (recursive)

`loai` enum:
- `0 = TinTuc`
- `1 = DichVu`

## 6) SERVICES module

Routes:
- `GET /api/services`
- `GET /api/services/{id}`
- `GET /api/services/code/{maDichVu}`
- `GET /api/services/by-code/{maDichVu}` (compat route for FE)
- `GET /api/services/admin` (admin/editor)
- `POST /api/services` (admin/editor)
- `PUT /api/services/{id}` (admin/editor)
- `DELETE /api/services/{id}` (admin/editor)

Main FE route verified: `GET /api/services/by-code/{maDichVu}`

`DichVuDto` fields:
- `id`, `ten`, `maDichVu`, `maThuTucHanhChinh`
- `moTa`, `giayToCanThiet`
- `soNgayXuLy`, `lePhi`, `urlBieuMau`
- `danhMucId`, `tenDanhMuc`
- `dangHoatDong`, `thuTuSapXep`
- `canCuPhapLy`, `quyTrinh`, `metadataBieuMauJson`
- `ngayTao`

Observed error shape when code not found:

```json
{
  "thanhCong": false,
  "thongDiep": "Khong tim thay dich vu",
  "loiDanhSach": null
}
```

## 7) APPLICATIONS module

Routes:
- `POST /api/applications/submit`
- `POST /api/applications/{id}/upload` (auth, multipart, key `tep`)
- `POST /api/applications/{id}/upload-files` (auth, multipart list)
- `GET /api/applications/track?maTheoDoi=...&email=...`
- `GET /api/applications/track/{maTheoDoi}?email=...` (compat route)
- `GET /api/applications` (auth)
- `GET /api/applications/{id}` (auth)
- `GET /api/applications/{id}/history` (admin/editor)
- `PATCH /api/applications/{id}/status` (admin/editor)
- `POST /api/applications/{id}/assign` (admin/editor)
- `POST /api/applications/{id}/payment-link` (auth)
- `GET /api/applications/{id}/receipt` (auth, file pdf)

### 7.1 Submit body

```json
{
  "dichVuId": "GUID",
  "tenNguoiNop": "Nguyen Van A",
  "emailNguoiNop": "user@example.com",
  "dienThoaiNguoiNop": "0900000000",
  "diaChiNguoiNop": "Ha Noi",
  "ghiChu": "...",
  "duLieuBieuMauJson": "{}"
}
```

If service invalid/inactive:

```json
{
  "thanhCong": false,
  "thongDiep": "Dich vu khong ton tai hoac da ngung hoat dong",
  "loiDanhSach": null
}
```

Track not found example:

```json
{
  "thanhCong": false,
  "thongDiep": "Khong tim thay ho so hoac thong tin khong khop",
  "loiDanhSach": null
}
```

### 7.2 Application status enum

`TrangThaiDonUng`:
- `0 = ChoXuLy`
- `1 = DangXuLy`
- `2 = HoanThanh`
- `3 = TuChoi`
- `4 = YeuCauBoSung`

## 8) Validation rules FE should mirror

Register (`KiemTraDangKyDto`):
- Email required, valid, <= 256 chars
- Password required, 8..128 chars, at least:
  - 1 uppercase
  - 1 digit
  - 1 special char
- Confirm password must equal password
- Phone optional, if present: regex `^[0-9+\-\s()]{7,20}$`

Application submit (`KiemTraNopDonUngDto`):
- `dichVuId` required
- `tenNguoiNop` required, <= 100
- `emailNguoiNop` required, valid, <= 256
- `dienThoaiNguoiNop` required, regex `^[0-9+\-\s()]{7,20}$`
- `diaChiNguoiNop` <= 300 (optional)
- `ghiChu` <= 1000 (optional)

## 9) Smoke verification snapshot (this session)

Verified success:
- `POST /api/auth/register` => 200
- `POST /api/auth/login` => 200
- `GET /api/auth/me` => 200
- `GET /api/profile` => 200
- `GET /api/profile/applications` => 200
- `GET /api/categories/tree` => 200
- CORS preflight on `/api/auth/me` from `http://localhost:3000` => 204, allow-origin + credentials ok

Verified error contracts:
- `GET /api/services/by-code/NOT_FOUND_CODE_123` => 404
- `POST /api/applications/submit` with invalid service => 400
- `GET /api/applications/track` with invalid data => 404

Not yet fully verified in this DB state:
- Happy-path `services/by-code/{maDichVu}` with existing data (DB currently has no service row)
- Happy-path `applications/submit` -> `track` with a real active service

## 10) FE integration quick checks

- [ ] HTTP client uses credentials include/withCredentials
- [ ] Auth state parser supports both wrapper and aliases:
  - `token` top-level
  - `duLieu.maTruyCap`
  - `duLieu.accessToken`
  - `duLieu.token`
- [ ] User parser supports:
  - `user` top-level
  - `duLieu.nguoiDung`
  - `duLieu.user`
- [ ] Role parser supports:
  - `danhSachVaiTro` / `roles`
  - single `vaiTro` / `role`
- [ ] Error UI reads `thongDiep` from envelope
- [ ] Enum mapping follows numeric values listed above
