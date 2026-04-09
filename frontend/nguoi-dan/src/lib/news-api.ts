import { buildApiUrl, isGuid as isGuidValue, resolveMediaUrl } from "@/lib/api";

type RawObject = Record<string, unknown>;

type ApiEnvelope<T> = {
  thanhCong?: boolean;
  ThanhCong?: boolean;
  thongDiep?: string;
  ThongDiep?: string;
  duLieu?: T;
  DuLieu?: T;
};

type RawPagedResult<T> = {
  danhSach?: T[];
  DanhSach?: T[];
  tongSo?: number;
  TongSo?: number;
  trang?: number;
  Trang?: number;
  kichThuocTrang?: number;
  KichThuocTrang?: number;
  tongTrang?: number;
  TongTrang?: number;
  coTrangTruoc?: boolean;
  CoTrangTruoc?: boolean;
  coTrangSau?: boolean;
  CoTrangSau?: boolean;
};

type RawListItem = {
  id?: string;
  Id?: string;
  tieuDe?: string;
  TieuDe?: string;
  duongDan?: string;
  DuongDan?: string;
  tomTat?: string;
  TomTat?: string;
  anhDaiDien?: string;
  AnhDaiDien?: string;
  tenTacGia?: string;
  TenTacGia?: string;
  tenDanhMuc?: string;
  TenDanhMuc?: string;
  ngayXuatBan?: string;
  NgayXuatBan?: string;
  ngayTao?: string;
  NgayTao?: string;
  soLuotXem?: number;
  SoLuotXem?: number;
  danhMucId?: string;
  DanhMucId?: string;
};

type RawDetailItem = RawListItem & {
  noiDung?: string;
  NoiDung?: string;
  tieuDeMeta?: string;
  TieuDeMeta?: string;
  moTaMeta?: string;
  MoTaMeta?: string;
  theTag?: string;
  TheTag?: string;
};

type RawCategoryItem = {
  id?: string;
  Id?: string;
  ten?: string;
  Ten?: string;
  tenDanhMuc?: string;
  TenDanhMuc?: string;
  name?: string;
  Name?: string;
  duongDan?: string;
  DuongDan?: string;
  dangHoatDong?: boolean;
  DangHoatDong?: boolean;
};

type RawCategoryTotalItem = {
  danhMucId?: string;
  DanhMucId?: string;
  categoryId?: string;
  CategoryId?: string;
  tongSo?: number;
  TongSo?: number;
  count?: number;
  Count?: number;
};

type RawCommentItem = {
  id?: string;
  Id?: string;
  baiVietId?: string;
  BaiVietId?: string;
  tenTacGia?: string;
  TenTacGia?: string;
  emailTacGia?: string;
  EmailTacGia?: string;
  anhDaiDienTacGia?: string;
  AnhDaiDienTacGia?: string;
  noiDung?: string;
  NoiDung?: string;
  ngayTao?: string;
  NgayTao?: string;
  danhSachTraLoi?: RawCommentItem[];
  DanhSachTraLoi?: RawCommentItem[];
};

export type NewsListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  categoryId?: string;
  author: string;
  publishedAt?: string;
  createdAt?: string;
  views: number;
};

export type NewsDetail = NewsListItem & {
  contentHtml: string;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
};

export type NewsCategory = {
  id: string;
  name: string;
  slug: string;
};

export type NewsComment = {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  content: string;
  createdAt?: string;
  replies: NewsComment[];
};

export type PaginationInfo = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export type NewsListPayload = {
  items: NewsListItem[];
  pagination: PaginationInfo;
  source: "api" | "fallback";
  warning?: string;
};

export type NewsDetailPayload = {
  article: NewsDetail;
  source: "api" | "fallback";
  warning?: string;
};

export type NewsCategoryPayload = {
  categories: NewsCategory[];
  source: "api" | "fallback";
  warning?: string;
};

export type NewsCommentsPayload = {
  comments: NewsComment[];
  pagination: PaginationInfo;
  source: "api" | "fallback";
  warning?: string;
};

const DEFAULT_NEWS_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBj9IsEHvDTJ1JUKAjlW1EEZgXzfCxIhRwonzYkh2y5SHnifyI8cMnrFXEb7sEyOA_bgfkllWZ-DuPXNjXDHq8pAhujmSg7wnZSRRFfBuOcknx3bNh5Wq6x3stRdGvwGX6r5iDJ3s5Uy0I0f69SCI2yMoMpT2vDqVCQkV1CF_6ZznioutemEZZL-sF18lcq0S1-wpljwdbzwOLQ1jAYq8qxdOqenUF7_Zdrq3vHXsSIVpekUswqdlRr1ZHfUNk2zOp_64mKLBXbAu8";

const fallbackArticles: NewsDetail[] = [
  {
    id: "fallback-1",
    title: "Thúc đẩy tăng trưởng kinh tế địa phương trong quý II năm 2024",
    slug: "thuc-day-tang-truong-kinh-te-dia-phuong-trong-quy-ii-nam-2024",
    excerpt:
      "Ủy ban nhân dân thành phố vừa phê duyệt kế hoạch hành động mới nhằm hỗ trợ doanh nghiệp nhỏ và vừa, đồng thời thu hút đầu tư vào các khu công nghệ cao.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBj9IsEHvDTJ1JUKAjlW1EEZgXzfCxIhRwonzYkh2y5SHnifyI8cMnrFXEb7sEyOA_bgfkllWZ-DuPXNjXDHq8pAhujmSg7wnZSRRFfBuOcknx3bNh5Wq6x3stRdGvwGX6r5iDJ3s5Uy0I0f69SCI2yMoMpT2vDqVCQkV1CF_6ZznioutemEZZL-sF18lcq0S1-wpljwdbzwOLQ1jAYq8qxdOqenUF7_Zdrq3vHXsSIVpekUswqdlRr1ZHfUNk2zOp_64mKLBXbAu8",
    category: "Kinh tế",
    author: "Nguyễn Văn A",
    publishedAt: "2024-05-14T08:30:00Z",
    createdAt: "2024-05-14T08:30:00Z",
    views: 1245,
    contentHtml: `
      <p><strong>Sáng nay, tại Trung tâm Hội nghị Thành phố, UBND đã chính thức khai mạc Hội nghị Thúc đẩy Phát triển Kinh tế Số với sự tham gia của các chuyên gia hàng đầu và đại diện các doanh nghiệp công nghệ lớn.</strong></p>
      <p>Phát biểu tại buổi lễ, lãnh đạo thành phố nhấn mạnh vai trò then chốt của chuyển đổi số trong việc nâng cao năng lực cạnh tranh và tạo ra các giá trị mới cho nền kinh tế địa phương. Theo báo cáo mới nhất, mục tiêu đến năm 2025, kinh tế số sẽ đóng góp khoảng 20% GRDP của địa phương.</p>
      <h3>Các nhiệm vụ trọng tâm được thảo luận</h3>
      <ul>
        <li>Phát triển hạ tầng số đồng bộ và hiện đại.</li>
        <li>Nâng cao kỹ năng số cho người dân và người lao động.</li>
        <li>Hỗ trợ doanh nghiệp nhỏ và vừa chuyển đổi mô hình kinh doanh lên môi trường số.</li>
        <li>Hoàn thiện khung pháp lý và cơ chế hỗ trợ đổi mới sáng tạo.</li>
      </ul>
      <blockquote>Chuyển đổi số không chỉ là vấn đề công nghệ mà còn là đổi mới mô hình quản trị.</blockquote>
      <p>Ban tổ chức cũng ký kết biên bản ghi nhớ với các tập đoàn công nghệ để triển khai những dự án đô thị thông minh, thanh toán không tiền mặt và cải cách dịch vụ công trực tuyến.</p>
    `,
    seoTitle: "Thúc đẩy tăng trưởng kinh tế địa phương trong quý II năm 2024",
    seoDescription:
      "Hội nghị kinh tế số với nhiều giải pháp trọng tâm để tăng trưởng bền vững và nâng cao năng lực cạnh tranh.",
    tags: ["Chuyển đổi số", "Kinh tế địa phương", "Dịch vụ công"],
  },
  {
    id: "fallback-2",
    title: "Triển khai hệ thống bệnh viện điện tử và số hóa hồ sơ bệnh án",
    slug: "trien-khai-he-thong-benh-vien-dien-tu-va-so-hoa-ho-so-benh-an",
    excerpt:
      "Số hóa toàn diện hồ sơ bệnh án giúp người dân theo dõi lịch sử khám chữa bệnh và giảm thời gian chờ tại tuyến cơ sở.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfI3jk9Ge2VX_cetM4lVqXskSMv3lZASch0iSoAW4rXE0Wl8DRg3XjcUbgIsR4F9oZgDMsiX282yrw26hnrj9yxlWI8vbHNcS3qcNv_i65tKJqrtIRbITH866DWn3TNwC1CX6liZ65-MjhZdus6Wk8NoA4imDJBF9jUSRW8UKwgFZRpnMv8BBjcJQEFgnfzOI4NU5VR3Py2q225lWhjqt2aruue-4R2xpQzHtDAq-MJuYMynkSgfEzrqBT3nsc5jS7JoHGmhulL38",
    category: "Y tế",
    author: "Ban Biên Tập",
    publishedAt: "2024-05-12T08:30:00Z",
    createdAt: "2024-05-12T08:30:00Z",
    views: 835,
    contentHtml: "<p>Nội dung chi tiết đang được cập nhật.</p>",
    tags: ["Y tế", "Số hóa"],
  },
  {
    id: "fallback-3",
    title: "Trao học bổng Thắp sáng tương lai cho học sinh nghèo vượt khó",
    slug: "trao-hoc-bong-thap-sang-tuong-lai-cho-hoc-sinh-ngheo-vuot-kho",
    excerpt:
      "Hơn 500 suất học bổng đã được trao nhằm động viên học sinh có thành tích xuất sắc trước thềm năm học mới.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCojFaQqO1XCWdZghqCTyo8xu8mXFXurwT3j3fEhOaREE5_NDK2ik7xeMz8CM_csVHjRk9w4sPgEpmdjM2s2xIIOuS9Y4U2_uWYj_12zX6ZeN_1KSVOPc3-tpQ2gV36uhHr2utyo_ql_YZVJ8kbfkFpyQcqYZshuI7XEVHEAZv7C7TWYHIf3VyQU0VnHIKCXAeG4mSkbr67ja30iS5Kvg4Di_HKiUbCj5PYtaU5K3-26bma2VdZbYX3M1Tsb8_PT-_zLHGIBOY-zKY",
    category: "Giáo dục",
    author: "Ban Biên Tập",
    publishedAt: "2024-05-10T08:30:00Z",
    createdAt: "2024-05-10T08:30:00Z",
    views: 604,
    contentHtml: "<p>Nội dung chi tiết đang được cập nhật.</p>",
    tags: ["Giáo dục", "An sinh xã hội"],
  },
  {
    id: "fallback-4",
    title: "Lấy ý kiến nhân dân về quy hoạch phân khu trung tâm đô thị mở rộng",
    slug: "lay-y-kien-nhan-dan-ve-quy-hoach-phan-khu-trung-tam-do-thi-mo-rong",
    excerpt:
      "Các buổi tham vấn cộng đồng tập trung vào dự án công viên xanh và nâng cấp hạ tầng giao thông công cộng.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvZBO7mrR7oRJpF7Wa_Ue6sxlWDFWghtNjoTPRpKckGgt9l2AvRZQF4NRjA-VnDTUuwNNwpRWlERMw5RGYjNGIqSU1l32Aw-UuX6QthPDXUW6WBEMBPqoDSKQiI4ZHdNv5D2Zjt2Py5S-lNjxKTKsGe-YUJmTWdwiXjdgkMMjJ-ETSt0JLjStYNfodJCDc3J5U1HKY1ZkHfRQpKS0qng01quuai2q8ypqdO_IZuowuUhSbsSm39DEjXGv2VAce3lTtdwuJHXpS6Hw",
    category: "Quy hoạch",
    author: "Ban Biên Tập",
    publishedAt: "2024-05-08T08:30:00Z",
    createdAt: "2024-05-08T08:30:00Z",
    views: 512,
    contentHtml: "<p>Nội dung chi tiết đang được cập nhật.</p>",
    tags: ["Quy hoạch", "Đô thị"],
  },
];

const fallbackCategories: NewsCategory[] = [
  { id: "fallback-cat-kinh-te", name: "Kinh tế", slug: "kinh-te" },
  { id: "fallback-cat-van-hoa", name: "Văn hóa", slug: "van-hoa" },
  { id: "fallback-cat-quy-hoach", name: "Quy hoạch", slug: "quy-hoach" },
  { id: "fallback-cat-y-te", name: "Y tế", slug: "y-te" },
  { id: "fallback-cat-giao-duc", name: "Giáo dục", slug: "giao-duc" },
];

function asObject(value: unknown): RawObject | null {
  return typeof value === "object" && value !== null ? (value as RawObject) : null;
}

function unwrapEnvelope<T>(payload: unknown): { success: boolean; message?: string; data?: T } {
  const envelope = asObject(payload) as ApiEnvelope<T> | null;
  if (!envelope) {
    return { success: false, message: "Phản hồi API không hợp lệ." };
  }

  const success = envelope.thanhCong ?? envelope.ThanhCong ?? false;
  const message = envelope.thongDiep ?? envelope.ThongDiep;
  const data = envelope.duLieu ?? envelope.DuLieu;
  return { success, message, data };
}

function formatSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function normalizeListItem(raw: RawListItem): NewsListItem {
  const title = raw.tieuDe ?? raw.TieuDe ?? "Bài viết";
  const slug = raw.duongDan ?? raw.DuongDan ?? formatSlug(title);

  return {
    id: raw.id ?? raw.Id ?? slug,
    title,
    slug,
    excerpt: raw.tomTat ?? raw.TomTat ?? "Nội dung đang được cập nhật.",
    imageUrl: resolveMediaUrl((raw.anhDaiDien ?? raw.AnhDaiDien) as string, DEFAULT_NEWS_IMAGE),
    category: raw.tenDanhMuc ?? raw.TenDanhMuc ?? "Tin tức",
    categoryId: raw.danhMucId ?? raw.DanhMucId,
    author: raw.tenTacGia ?? raw.TenTacGia ?? "Ban Biên Tập",
    publishedAt: raw.ngayXuatBan ?? raw.NgayXuatBan,
    createdAt: raw.ngayTao ?? raw.NgayTao,
    views: raw.soLuotXem ?? raw.SoLuotXem ?? 0,
  };
}

function normalizeDetailItem(raw: RawDetailItem): NewsDetail {
  const base = normalizeListItem(raw);
  const html = raw.noiDung ?? raw.NoiDung ?? "<p>Nội dung đang được cập nhật.</p>";
  const rawTags = raw.theTag ?? raw.TheTag ?? "";

  return {
    ...base,
    contentHtml: html,
    seoTitle: raw.tieuDeMeta ?? raw.TieuDeMeta,
    seoDescription: raw.moTaMeta ?? raw.MoTaMeta,
    tags: rawTags
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x.length > 0),
  };
}

function normalizeCategoryItem(raw: RawCategoryItem): NewsCategory {
  const name = raw.ten ?? raw.Ten ?? raw.tenDanhMuc ?? raw.TenDanhMuc ?? raw.name ?? raw.Name ?? "Tin tức";
  const slug = raw.duongDan ?? raw.DuongDan ?? formatSlug(name);
  return {
    id: raw.id ?? raw.Id ?? slug,
    name,
    slug,
  };
}

function normalizeCommentItem(raw: RawCommentItem): NewsComment {
  const replies = raw.danhSachTraLoi ?? raw.DanhSachTraLoi ?? [];

  return {
    id: raw.id ?? raw.Id ?? crypto.randomUUID(),
    articleId: raw.baiVietId ?? raw.BaiVietId ?? "",
    authorName: raw.tenTacGia ?? raw.TenTacGia ?? "Khách",
    authorEmail: raw.emailTacGia ?? raw.EmailTacGia,
    authorAvatar: raw.anhDaiDienTacGia ?? raw.AnhDaiDienTacGia,
    content: raw.noiDung ?? raw.NoiDung ?? "",
    createdAt: raw.ngayTao ?? raw.NgayTao,
    replies: Array.isArray(replies) ? replies.map((item) => normalizeCommentItem(item)) : [],
  };
}

function toFallbackList(
  page: number,
  pageSize: number,
  keyword: string,
  fallbackCategoryName?: string,
): NewsListPayload {
  const filtered = fallbackArticles.filter((item) => {
    if (fallbackCategoryName && item.category !== fallbackCategoryName) return false;

    if (!keyword) return true;
    const lowerKeyword = keyword.toLowerCase();
    return (
      item.title.toLowerCase().includes(lowerKeyword)
      || item.excerpt.toLowerCase().includes(lowerKeyword)
      || item.category.toLowerCase().includes(lowerKeyword)
    );
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize).map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    imageUrl: item.imageUrl,
    category: item.category,
    author: item.author,
    publishedAt: item.publishedAt,
    createdAt: item.createdAt,
    views: item.views,
  }));

  return {
    items,
    pagination: {
      page: safePage,
      pageSize,
      total,
      totalPages,
      hasPrev: safePage > 1,
      hasNext: safePage < totalPages,
    },
    source: "fallback",
    warning: "Không kết nối được API, đang hiển thị dữ liệu mẫu.",
  };
}

function toFallbackComments(articleId: string): NewsCommentsPayload {
  return {
    comments: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 1,
      hasPrev: false,
      hasNext: false,
    },
    source: "fallback",
    warning: articleId
      ? "Không kết nối được API bình luận, đang tạm ẩn danh sách bình luận."
      : "Không thể tải bình luận do thiếu mã bài viết.",
  };
}

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(buildApiUrl(path), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

function parsePagination<T>(data: RawPagedResult<T>, fallbackPage: number, fallbackSize: number, itemCount: number) {
  const total = data.tongSo ?? data.TongSo ?? itemCount;
  const page = data.trang ?? data.Trang ?? fallbackPage;
  const pageSize = data.kichThuocTrang ?? data.KichThuocTrang ?? fallbackSize;
  const totalPages = data.tongTrang ?? data.TongTrang ?? Math.max(1, Math.ceil(total / pageSize));
  const hasPrev = data.coTrangTruoc ?? data.CoTrangTruoc ?? page > 1;
  const hasNext = data.coTrangSau ?? data.CoTrangSau ?? page < totalPages;

  return { page, pageSize, total, totalPages, hasPrev, hasNext };
}

export function isGuid(value: string): boolean {
  return isGuidValue(value);
}

export async function getNewsList(options?: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: string;
  fallbackCategoryName?: string;
}): Promise<NewsListPayload> {
  const page = Math.max(options?.page ?? 1, 1);
  const pageSize = Math.max(options?.pageSize ?? 6, 1);
  const keyword = options?.keyword?.trim() ?? "";
  const categoryId = options?.categoryId?.trim() ?? "";

  const query = new URLSearchParams({
    trang: String(page),
    kichThuocTrang: String(pageSize),
  });

  if (keyword) query.set("tuKhoa", keyword);
  if (categoryId) query.set("danhMucId", categoryId);

  try {
    const payload = await fetchJson(`/api/articles?${query.toString()}`);
    const unwrapped = unwrapEnvelope<RawPagedResult<RawListItem>>(payload);

    if (!unwrapped.success || !unwrapped.data) {
      throw new Error(unwrapped.message ?? "Không lấy được danh sách bài viết.");
    }

    const data = unwrapped.data;
    const items = (data.danhSach ?? data.DanhSach ?? []).map((item) => normalizeListItem(item));

    return {
      items,
      pagination: parsePagination(data, page, pageSize, items.length),
      source: "api",
    };
  } catch {
    return toFallbackList(page, pageSize, keyword, options?.fallbackCategoryName);
  }
}

export async function getNewsDetailBySlug(slug: string): Promise<NewsDetailPayload | null> {
  const cleanSlug = slug.trim();
  if (!cleanSlug) return null;

  try {
    const payload = await fetchJson(`/api/articles/${encodeURIComponent(cleanSlug)}`);
    const unwrapped = unwrapEnvelope<RawDetailItem>(payload);

    if (!unwrapped.success || !unwrapped.data) {
      throw new Error(unwrapped.message ?? "Không tìm thấy bài viết.");
    }

    return {
      article: normalizeDetailItem(unwrapped.data),
      source: "api",
    };
  } catch {
    const fallback = fallbackArticles.find((item) => item.slug === cleanSlug);
    if (!fallback) return null;

    return {
      article: fallback,
      source: "fallback",
      warning: "Không kết nối được API, đang hiển thị dữ liệu mẫu.",
    };
  }
}

export async function getNewsCategories(): Promise<NewsCategoryPayload> {
  const query = new URLSearchParams({
    loai: "0",
    chiLayDangHoatDong: "true",
    trang: "1",
    kichThuocTrang: "200",
  });

  try {
    const payload = await fetchJson(`/api/categories?${query.toString()}`);
    const unwrapped = unwrapEnvelope<RawPagedResult<RawCategoryItem>>(payload);

    if (!unwrapped.success || !unwrapped.data) {
      throw new Error(unwrapped.message ?? "Không lấy được danh mục tin tức.");
    }

    const categories = (unwrapped.data.danhSach ?? unwrapped.data.DanhSach ?? []).map((item) =>
      normalizeCategoryItem(item),
    );

    return { categories, source: "api" };
  } catch {
    return {
      categories: fallbackCategories,
      source: "fallback",
      warning: "Không kết nối được API danh mục, đang hiển thị danh mục mẫu.",
    };
  }
}

export async function getNewsCategoryTotals(categoryIds: string[]): Promise<Record<string, number>> {
  const uniqueCategoryIds = Array.from(new Set(categoryIds.map((item) => item.trim()).filter(Boolean)));
  if (uniqueCategoryIds.length === 0) return {};

  const query = new URLSearchParams({
    loai: "0",
    chiLayDangHoatDong: "true",
  });

  try {
    const payload = await fetchJson(`/api/categories/totals?${query.toString()}`);
    const unwrapped = unwrapEnvelope<RawCategoryTotalItem[]>(payload);

    if (!unwrapped.success || !Array.isArray(unwrapped.data)) {
      throw new Error(unwrapped.message ?? "Không lấy được thống kê danh mục.");
    }

    const mapTotals = new Map<string, number>();
    for (const item of unwrapped.data) {
      const categoryId = item.danhMucId ?? item.DanhMucId ?? item.categoryId ?? item.CategoryId;
      if (!categoryId) continue;

      const total = item.tongSo ?? item.TongSo ?? item.count ?? item.Count ?? 0;
      mapTotals.set(categoryId, total);
    }

    return Object.fromEntries(uniqueCategoryIds.map((item) => [item, mapTotals.get(item) ?? 0]));
  } catch {
    return Object.fromEntries(uniqueCategoryIds.map((item) => [item, 0]));
  }
}

export async function getNewsComments(
  articleId: string,
  options?: { page?: number; pageSize?: number },
): Promise<NewsCommentsPayload> {
  const cleanArticleId = articleId.trim();
  if (!cleanArticleId || !isGuid(cleanArticleId)) {
    return toFallbackComments(cleanArticleId);
  }

  const page = Math.max(options?.page ?? 1, 1);
  const pageSize = Math.max(options?.pageSize ?? 10, 1);

  const query = new URLSearchParams({
    baiVietId: cleanArticleId,
    trang: String(page),
    kichThuocTrang: String(pageSize),
  });

  try {
    const payload = await fetchJson(`/api/comments?${query.toString()}`);
    const unwrapped = unwrapEnvelope<RawPagedResult<RawCommentItem>>(payload);

    if (!unwrapped.success || !unwrapped.data) {
      throw new Error(unwrapped.message ?? "Không lấy được danh sách bình luận.");
    }

    const items = (unwrapped.data.danhSach ?? unwrapped.data.DanhSach ?? []).map((item) =>
      normalizeCommentItem(item),
    );

    return {
      comments: items,
      pagination: parsePagination(unwrapped.data, page, pageSize, items.length),
      source: "api",
    };
  } catch {
    return toFallbackComments(cleanArticleId);
  }
}

export function formatViDateTime(value?: string): string {
  if (!value) return "Đang cập nhật";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Đang cập nhật";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// --- Service (Dịch vụ công) API ---

export type PublicService = {
  id: string;
  code: string;
  name: string;
  description: string;
  requiredDocuments: string;
  itemsToUpload?: string;
  processingDays: number;
  fee: number;
  categoryName: string;
  isActive: boolean;
};

type RawServiceItem = {
  id?: string;
  Id?: string;
  maDichVu?: string;
  MaDichVu?: string;
  ten?: string;
  Ten?: string;
  moTa?: string;
  MoTa?: string;
  giayToCanThiet?: string;
  GiayToCanThiet?: string;
  soNgayXuLy?: number;
  SoNgayXuLy?: number;
  lePhi?: number;
  LePhi?: number;
  tenDanhMuc?: string;
  TenDanhMuc?: string;
  dangHoatDong?: boolean;
  DangHoatDong?: boolean;
};

function normalizeServiceItem(raw: RawServiceItem): PublicService {
  return {
    id: raw.id ?? raw.Id ?? "",
    code: raw.maDichVu ?? raw.MaDichVu ?? "DV-000",
    name: raw.ten ?? raw.Ten ?? "Dịch vụ công",
    description: raw.moTa ?? raw.MoTa ?? "Nội dung đang được cập nhật.",
    requiredDocuments: raw.giayToCanThiet ?? raw.GiayToCanThiet ?? "Tờ khai theo mẫu.",
    processingDays: raw.soNgayXuLy ?? raw.SoNgayXuLy ?? 1,
    fee: raw.lePhi ?? raw.LePhi ?? 0,
    categoryName: raw.tenDanhMuc ?? raw.TenDanhMuc ?? "Hành chính",
    isActive: raw.dangHoatDong ?? raw.DangHoatDong ?? true,
  };
}

export async function getServiceDetail(id: string): Promise<PublicService | null> {
  const cleanId = id.trim();
  if (!cleanId) return null;

  try {
    const payload = await fetchJson(`/api/services/${encodeURIComponent(cleanId)}`);
    const unwrapped = unwrapEnvelope<RawServiceItem>(payload);

    if (!unwrapped.success || !unwrapped.data) {
      throw new Error(unwrapped.message ?? "Không tìm thấy dịch vụ.");
    }

    return normalizeServiceItem(unwrapped.data);
  } catch {
    // Fallback if needed or return null
    return null;
  }
}

export async function getServiceCategories(): Promise<NewsCategoryPayload> {
  const query = new URLSearchParams({
    loai: "1", // LoaiDanhMuc.DichVu
    trang: "1",
    kichThuocTrang: "200",
  });

  try {
    const payload = await fetchJson(`/api/categories?${query.toString()}`);
    const unwrapped = unwrapEnvelope<RawCategoryItem[]>(payload);

    if (!unwrapped.success || !Array.isArray(unwrapped.data)) {
      throw new Error(unwrapped.message ?? "Không lấy được danh mục dịch vụ.");
    }

    const categories = unwrapped.data.map((item) => normalizeCategoryItem(item));

    return { categories, source: "api" };
  } catch {
    return {
      categories: [
        { id: "ho-tich", name: "Hộ tịch", slug: "ho-tich" },
        { id: "dat-dai", name: "Đất đai", slug: "dat-dai" },
        { id: "xay-dung", name: "Xây dựng", slug: "xay-dung" },
      ],
      source: "fallback",
      warning: "Không kết nối được API danh mục dịch vụ, đang hiển thị dữ liệu mẫu.",
    };
  }
}
