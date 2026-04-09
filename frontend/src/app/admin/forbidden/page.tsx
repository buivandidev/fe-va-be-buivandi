import Link from 'next/link'

export default function AdminForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">Loi 403</p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Ban khong co quyen truy cap</h1>
          <p className="mt-3 text-sm text-slate-600">
            Tai khoan hien tai khong thuoc nhom quan tri hoac bien tap vien.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/admin/login"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Dang nhap tai khoan khac
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Ve trang chu
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
