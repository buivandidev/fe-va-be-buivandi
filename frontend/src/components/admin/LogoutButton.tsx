'use client'

export default function LogoutButton() {
  const handleLogout = async () => {
    // Clear localStorage
    localStorage.removeItem('auth_token')
    
    // Submit logout to server
    await fetch('/admin/logout', {
      method: 'POST',
    })
    
    // Redirect to login
    window.location.href = '/admin/login'
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      Đăng xuất
    </button>
  )
}
