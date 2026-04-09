import Link from "next/link";

type NavKey = string;

type PortalHeaderProps = {
  active?: NavKey;
  showProfileButton?: boolean;
};

const navItems: Array<{ key: NavKey; label: string; href: string }> = [
  { key: "gioi-thieu", label: "GIỚI THIỆU", href: "/" },
  { key: "tin-tuc", label: "TIN TỨC", href: "/tin-tuc" },
  { key: "dich-vu", label: "DỊCH VỤ CÔNG", href: "/dich-vu-cong" },
  { key: "thu-vien", label: "THƯ VIỆN", href: "/thu-vien" },
  { key: "lien-he", label: "LIÊN HỆ", href: "/lien-he" },
];

export function PortalHeader({ active = "tin-tuc", showProfileButton = false }: PortalHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-white shadow-sm">
      {/* Top Banner Tiêu Chuẩn Nhà Nước */}
      <div className="bg-primary text-white py-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-right text-xs sm:text-sm font-semibold tracking-wider uppercase">
          Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam | Độc lập - Tự do - Hạnh phúc
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="bg-primary p-2 text-secondary border-2 border-secondary">
              <span className="material-symbols-filled gov-icon text-3xl">star</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-extrabold leading-none tracking-tight text-primary uppercase">
                HỆ THỐNG THÔNG TIN
              </h1>
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => {
              const className =
                item.key === active
                  ? "gov-nav-link text-primary transition-colors"
                  : "gov-nav-link text-slate-900 transition-colors hover:text-primary dark:text-slate-100";

              if (item.href.startsWith("/")) {
                return (
                  <Link key={item.key} className={className} href={item.href}>
                    {item.label}
                  </Link>
                );
              }

              return (
                <a key={item.key} className={className} href={item.href}>
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex max-w-sm flex-1 items-center justify-end gap-4">
            <div className="relative hidden w-full sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                className="w-full rounded-full border-none bg-slate-100 py-2 pl-10 pr-4 text-sm placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 dark:bg-slate-800"
                placeholder="Tìm kiếm dịch vụ, tin tức..."
                type="text"
              />
            </div>

            <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" type="button">
              <span className="material-symbols-outlined gov-icon">menu</span>
            </button>

            {showProfileButton ? (
              <button
                className="rounded-lg bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                type="button"
              >
                <span className="material-symbols-outlined gov-icon">person</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
