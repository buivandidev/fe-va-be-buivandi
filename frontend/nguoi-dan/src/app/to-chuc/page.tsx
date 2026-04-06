export const dynamic = "force-dynamic";


import Image from "next/image";
import { buildApiUrl, resolveMediaUrl } from "@/lib/api";

// Types corresponding to /api/departments
interface Department {
  id: string;
  tenPhongBan: string;
  soDienThoai: string;
  email: string;
  moTa: string;
  trangThai: boolean;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  chucVu: string;
  phongBanId: string;
  anhDaiDienUrl?: string; // Tên property này do API User quyết định
}

async function getDepartments() {
  try {
    const res = await fetch(buildApiUrl("/api/departments"), { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.thanhCong && data.duLieu ? (data.duLieu as Department[]) : [];
  } catch (error) {
    console.error("Lỗi khi lấy phòng ban:", error);
    return [];
  }
}

async function getUsersByDepartment(deptId: string) {
  try {
    // Sẽ gọi đến endpoint hoặc filter user theo phòng ban.
    // Tạm thời nếu BE chưa có API lấy nhân viên theo department public,
    // ta query list users chung (hoặc giả lập nếu rỗng).
    const res = await fetch(buildApiUrl(`/api/users?PhongBanId=${encodeURIComponent(deptId)}&kichThuocTrang=100`), {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!(data.thanhCong && data.duLieu)) return [];

    const danhSach = Array.isArray(data.duLieu.muc)
      ? data.duLieu.muc
      : Array.isArray(data.duLieu.danhSach)
        ? data.duLieu.danhSach
        : [];

    return danhSach as User[];
  } catch (error) {
    console.error("Lỗi khi lấy cán bộ:", error);
    return [];
  }
}


export default async function ToChucPage() {
  const departments = await getDepartments();
  const activeDepartments = departments.filter(d => d.trangThai !== false);

  // Load nhân viên cho từng phòng ban (để nhanh thì nên dùng Promise.all, nhưng hiện có thể map tuần tự)
  const departmentsWithStaff = await Promise.all(
    activeDepartments.map(async (dept) => {
      const staff = await getUsersByDepartment(dept.id);
      return { ...dept, staff };
    })
  );

  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white px-4 py-16 dark:bg-slate-900 md:px-10">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.svg')] bg-center opacity-5 dark:opacity-10"></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary dark:bg-primary/20">
            Giới thiệu chung
          </span>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">
            Sơ đồ tổ chức & <span className="text-secondary">Bộ máy hành chính</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Hệ thống cơ quan hành chính nhà nước cấp cơ sở, cam kết phục vụ nhân dân với tinh thần trách nhiệm, minh bạch và hiệu quả nhất.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-12 md:px-10">
        
          {/* Lãnh đạo UBND (Static / Highlights) */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">
            Lãnh đạo UBND phường/xã
          </h2>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
             {/* Thay bằng dữ liệu động nếu có role Lãnh đạo hoặc hardcode tạm */}
             <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                <div className="mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-slate-50 ring-4 ring-primary/20 dark:bg-slate-800">
                   <span className="material-symbols-outlined text-[80px] text-primary/50">person</span>
                </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Chủ tịch UBND</h3>
               <p className="mt-1 font-medium text-primary">Đang cập nhật</p>
                <div className="mt-4 flex flex-col items-center text-sm text-slate-500 dark:text-slate-400">
                 <a href="#" className="flex items-center hover:text-primary"><span className="material-symbols-outlined mr-1 text-[16px]">call</span> Liên hệ số điện thoại nội bộ</a>
                   <a href="#" className="mt-1 flex items-center hover:text-primary"><span className="material-symbols-outlined mr-1 text-[16px]">mail</span> chuttich@phuongxa.gov.vn</a>
                </div>
            </div>
             <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                <div className="mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-slate-50 ring-4 ring-primary/20 dark:bg-slate-800">
                   <span className="material-symbols-outlined text-[80px] text-primary/50">person</span>
                </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Phó Chủ tịch (KT-XH)</h3>
               <p className="mt-1 font-medium text-primary">Đang cập nhật</p>
                <div className="mt-4 flex flex-col items-center text-sm text-slate-500 dark:text-slate-400">
                 <a href="#" className="flex items-center hover:text-primary"><span className="material-symbols-outlined mr-1 text-[16px]">call</span> Liên hệ số điện thoại nội bộ</a>
                </div>
            </div>
             <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                <div className="mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-slate-50 ring-4 ring-primary/20 dark:bg-slate-800">
                   <span className="material-symbols-outlined text-[80px] text-primary/50">person</span>
                </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Phó Chủ tịch (VH-XH)</h3>
               <p className="mt-1 font-medium text-primary">Đang cập nhật</p>
                <div className="mt-4 flex flex-col items-center text-sm text-slate-500 dark:text-slate-400">
                 <a href="#" className="flex items-center hover:text-primary"><span className="material-symbols-outlined mr-1 text-[16px]">call</span> Liên hệ số điện thoại nội bộ</a>
                </div>
            </div>
          </div>
        </section>

          {/* Các Phòng Ban & Khối Đoàn thể */}
        <section>
          <div className="mb-10 flex items-end justify-between border-b pb-4 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Các Phòng Ban chuyên môn
            </h2>
          </div>

          {departmentsWithStaff.length === 0 ? (
            <p className="text-center py-10 text-slate-500">Đang cập nhật dữ liệu phòng ban...</p>
          ) : (
            <div className="space-y-8">
              {departmentsWithStaff.map((dept) => (
                <div key={dept.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
                    <div className="flex flex-col flex-wrap items-start justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <h3 className="text-xl font-bold text-primary dark:text-primary">{dept.tenPhongBan}</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                           {dept.moTa || "Chưa có mô tả chức năng, nhiệm vụ."}
                        </p>
                      </div>
                      <div className="flex gap-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 shadow-sm dark:bg-slate-800">
                          <span className="material-symbols-outlined text-[18px] text-slate-400">call</span>
                          {dept.soDienThoai || "N/A"}
                        </div>
                        <div className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 shadow-sm dark:bg-slate-800">
                          <span className="material-symbols-outlined text-[18px] text-slate-400">mail</span>
                          {dept.email || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Danh sách cán bộ */}
                  <div className="p-6">
                    <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                     Danh sách cán bộ / nhân viên ({dept.staff.length})
                    </h4>
                    
                    {dept.staff.length === 0 ? (
                     <p className="text-sm italic text-slate-500">Chưa có thông tin nhân sự.</p>
                    ) : (
                      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                         {dept.staff.map((user) => (
                           <div key={user.id} className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                 {user.anhDaiDienUrl ? (
                              <Image
                                src={resolveMediaUrl(user.anhDaiDienUrl, "https://placehold.co/96x96?text=User")}
                                alt={user.fullName}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                              />
                                 ) : (
                                    <span className="material-symbols-outlined text-slate-400">person</span>
                                 )}
                              </div>
                              <div>
                            <strong className="block text-sm font-semibold text-slate-900 dark:text-slate-100">{user.fullName || "Chưa có tên"}</strong>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{user.chucVu || "Chuyên viên"}</span>
                              </div>
                           </div>
                         ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </section>
      </main>

      
    </div>
  );
}