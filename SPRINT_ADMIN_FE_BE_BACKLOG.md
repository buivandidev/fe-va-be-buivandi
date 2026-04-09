# Sprint Backlog Admin FE-BE (1-2 Sprint)

Tai lieu nay chuyen danh sach khoang trong Admin FE-BE thanh backlog co uu tien, estimate, acceptance criteria va goi y phan cong.

## 1. Muc tieu theo sprint

### Sprint 1 (2 tuan) - P0/P1
- Dong cac lo hong van hanh chinh: ho so, phan quyen UI, dashboard chart, contract comment.
- Dat nguong quality toi thieu: smoke test FE/BE.

### Sprint 2 (2 tuan) - P1/P2
- Mo rong module quan tri con thieu: media, settings, categories, audit logs.
- Tang do on dinh: regression test va hardening.

## 2. Uoc luong nang luc

- Team 3-4 nguoi (2 FE, 1 BE, 1 QA kiem nhiem) co the hoan thanh trong 2 sprint.
- Tong uoc luong:
  - Sprint 1: 24-30 point
  - Sprint 2: 28-36 point

## 3. Backlog chi tiet

## Sprint 1

### ADM-001 - Ho so: bo sung phan cong nguoi xu ly
- Priority: P0
- Estimate: 3 point
- Scope:
  - FE: them input chon nguoi xu ly trong modal phan cong.
  - BE: xac nhan endpoint assign nhan nguoiXuLyId dung contract.
- Owner:
  - FE1: UI + state + request payload
  - BE: contract review + validation
  - QA: test role va data
- Acceptance Criteria:
  1. Admin/Bien tap co the chon nguoi xu ly khi phan cong ho so.
  2. nguoiXuLyId duoc gui len API assign.
  3. Lich su phan cong luu dung nguoi xu ly.
  4. UI hien thong bao loi ro rang neu nguoi xu ly khong hop le.
- Test checklist:
  - Assign khong chon nguoi xu ly (hop le neu optional theo business).
  - Assign co nguoi xu ly hop le.
  - Assign voi user khong du quyen -> bi chan.

### ADM-002 - Ho so: upload nhieu tep
- Priority: P0
- Estimate: 5 point
- Scope:
  - FE: cho phep chon multiple file, validate tong dung luong/client-side.
  - FE: goi endpoint upload-files.
  - BE: xac nhan response schema cho danh sach tep.
- Owner:
  - FE1: UI multiple upload
  - BE: endpoint consistency
  - QA: test file matrix
- Acceptance Criteria:
  1. Co the upload 1 hoac nhieu tep trong 1 lan thao tac.
  2. Ket qua tra ve hien dung danh sach tep da tai len.
  3. File khong hop le (duoi tep/kich thuoc) hien loi than thien.
  4. Sau upload, chi tiet ho so cap nhat danh sach tep ngay.
- Test checklist:
  - 2-3 file hop le.
  - tron file hop le + khong hop le.
  - file vuot nguong kich thuoc.

### ADM-003 - FE guard theo role cho admin
- Priority: P0
- Estimate: 5 point
- Scope:
  - FE: role guard cho admin route theo chuc nang.
  - FE: them trang/khung 403.
- Owner:
  - FE2: session role guard
  - QA: verify matrix role
- Acceptance Criteria:
  1. User chi co token nhung khong du role khong vao duoc trang admin can role cao.
  2. UI chuyen huong hoac hien 403 ro rang.
  3. Khong xay ra flash noi dung nhay cam truoc khi redirect.
- Test checklist:
  - Viewer vao /admin/users.
  - BienTap vao /admin/settings.
  - Admin vao full route.

### ADM-004 - Dashboard chart du lieu that
- Priority: P1
- Estimate: 5 point
- Scope:
  - FE: su dung layBieuDoBaiViet va layBieuDoTrangThaiHoSo de render chart.
  - FE: loading, empty, retry cho tung chart.
- Owner:
  - FE2: chart components
  - QA: snapshot/UI test
- Acceptance Criteria:
  1. Dashboard hien 2 chart tu API backend.
  2. Neu API loi thi hien fallback va nut thu lai.
  3. Khong lam cham tai trang qua nguong chap nhan.
- Test checklist:
  - API co du lieu.
  - API tra rong.
  - API timeout/500.

### ADM-005 - Dong bo contract comments
- Priority: P1
- Estimate: 2 point
- Scope (chon 1):
  - Cach A: BE bo sung baiVietId filter.
  - Cach B: FE bo param baiVietId chua duoc ho tro.
- Owner:
  - BE (neu cach A) hoac FE (neu cach B)
  - QA: verify query params
- Acceptance Criteria:
  1. Contract comments FE-BE dong nhat 100%.
  2. Khong con param thua gay nham lan.
- Test checklist:
  - goi API comments voi filter supported.
  - verify ket qua phu hop.

### ADM-006 - Smoke test toi thieu FE-BE
- Priority: P1
- Estimate: 4 point
- Scope:
  - FE: smoke flow login -> dashboard -> applications list.
  - BE: integration test users/applications/comments endpoint chinh.
- Owner:
  - FE1 + BE + QA
- Acceptance Criteria:
  1. Co bo test chay duoc local va CI.
  2. Merge request bi chan neu smoke fail.
- Test checklist:
  - script test pass tren nhanh main.

## Sprint 2

### ADM-007 - Media Management page (admin)
- Priority: P1
- Estimate: 8 point
- Scope:
  - BE: bo sung endpoint GET cho admin media/album (neu chua co).
  - FE: trang /admin/media voi list, upload, edit metadata, xoa.
- Owner:
  - BE: endpoint list admin
  - FE1: media UI
  - QA: media regression
- Acceptance Criteria:
  1. Quan tri vien xem duoc danh sach media va album.
  2. Upload/chinh sua/xoa media thanh cong.
  3. Co filter co ban theo loai/album.
- Test checklist:
  - anh/video/doc matrix.
  - xoa media co file cleanup best-effort.

### ADM-008 - Settings Management page
- Priority: P1
- Estimate: 5 point
- Scope:
  - BE: them API GET settings list/detail.
  - FE: trang /admin/settings CRUD key-value.
- Owner:
  - BE + FE2 + QA
- Acceptance Criteria:
  1. Admin he thong xem duoc danh sach settings.
  2. Tao/sua/xoa setting hoat dong dung role.
  3. Validate khoa trung, gia tri null/empty dung rule.
- Test checklist:
  - role Admin vs BienTap.
  - duplicate key.

### ADM-009 - Categories Management page (admin)
- Priority: P1
- Estimate: 6 point
- Scope:
  - BE: them API GET categories cho admin (bao gom item inactive neu can).
  - FE: trang /admin/categories CRUD.
- Owner:
  - BE + FE1 + QA
- Acceptance Criteria:
  1. Admin/BienTap quan ly danh muc day du.
  2. Khong phu thuoc endpoint public-only-active cho man hinh admin.
  3. Rule xoa danh muc duoc enforce dung nhu backend.
- Test checklist:
  - danh muc co con.
  - danh muc dang gan bai viet/dich vu.

### ADM-010 - Audit Logs page
- Priority: P2
- Estimate: 4 point
- Scope:
  - FE: trang /admin/audit-logs list + filter + pagination.
- Owner:
  - FE2 + QA
- Acceptance Criteria:
  1. Hien duoc log theo trang.
  2. Filter theo tenThucThe va nguoiDungId.
- Test checklist:
  - log rong.
  - log nhieu trang.

### ADM-011 - Regression va hardening
- Priority: P2
- Estimate: 5 point
- Scope:
  - Them e2e cho cac module moi sprint 2.
  - Chuan hoa handling loi API tren admin pages.
- Owner:
  - QA lead + FE + BE
- Acceptance Criteria:
  1. Co regression suite cho route admin chinh.
  2. Cac loi API 401/403/500 duoc hien thi nhat quan.

## 4. Ke hoach phan cong goi y

### Nhom de xuat
- FE1: Applications + Media + Categories
- FE2: Role guard + Dashboard chart + Settings + Audit logs
- BE: Contract fix + endpoint bo sung + permission hardening
- QA: test plan, test case, smoke/regression automation

### Mapping theo sprint
- Sprint 1:
  - FE1: ADM-001, ADM-002
  - FE2: ADM-003, ADM-004
  - BE: ADM-001 support, ADM-002 support, ADM-005
  - QA: ADM-006 + verify ADM-001..005
- Sprint 2:
  - FE1: ADM-007, ADM-009
  - FE2: ADM-008, ADM-010
  - BE: ADM-007 API, ADM-008 API, ADM-009 API
  - QA: ADM-011 + verify ADM-007..010

## 5. Dependency va thu tu triem khai

1. Chot contract BE truoc (ADM-005, phan API bo sung sprint 2).
2. Lam role guard som (ADM-003) de tranh bug quyen truy cap khi mo rong module.
3. Uu tien ADM-001 + ADM-002 truoc chart va module moi.
4. Sprint 2: xong API GET (settings/categories/media list) roi moi build UI.

## 6. Definition of Done (Dung chung)

1. Co unit/integration test cho phan logic moi (neu ap dung).
2. Co smoke test hoac testcase manual cho luong chinh.
3. Khong co loi lint/build.
4. Co tai lieu cap nhat route/API moi.
5. QA sign-off tren moi ticket P0/P1.

## 7. Mau issue de copy len GitHub

Su dung mau sau cho tung ticket:

Title: [ADM-XXX] <Ten ticket>

Body:
- Background:
- Scope:
- Out of scope:
- Acceptance Criteria:
  1.
  2.
  3.
- Technical Notes:
- Test Cases:
  1.
  2.
- Estimate: <x point>
- Priority: <P0/P1/P2>
- Owner: <FE/BE/QA>
- Dependencies:
- Labels: admin, fe-be, sprint-1|sprint-2
