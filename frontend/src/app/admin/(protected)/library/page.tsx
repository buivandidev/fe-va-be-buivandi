'use client'

import React, { useState, useEffect, useRef } from 'react';
import { mediaApi, PhuongTien, AlbumPhuongTien } from '@/lib/api/admin';

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const PAGE_SIZE = 12;

export default function LibraryManagerPage() {
  const [files, setFiles] = useState<PhuongTien[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'all' | 'image' | 'video'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'date' | 'name'>('date');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // Album state
  const [albums, setAlbums] = useState<AlbumPhuongTien[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [albumModal, setAlbumModal] = useState<{ mode: 'create' | 'edit', album?: AlbumPhuongTien } | null>(null);
  const [albumName, setAlbumName] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');
  const [albumLoading, setAlbumLoading] = useState(false);

  // Fetch albums
  async function fetchAlbums() {
    try {
      setAlbumLoading(true);
      const list = await mediaApi.layDanhSachAlbum();
      setAlbums(list);
    } finally {
      setAlbumLoading(false);
    }
  }

  useEffect(() => {
    fetchAlbums();
  }, []);

  // Drag & drop upload
  useEffect(() => {
    const drop = dropRef.current;
    if (!drop) return;
    const prevent = (e: React.DragEvent | DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e: DragEvent) => {
      prevent(e);
      if (e.dataTransfer?.files?.length) {
        setSelectedFile(e.dataTransfer.files[0]);
      }
    };
    drop.addEventListener('dragover', prevent);
    drop.addEventListener('dragenter', prevent);
    drop.addEventListener('drop', handleDrop);
    return () => {
      drop.removeEventListener('dragover', prevent);
      drop.removeEventListener('dragenter', prevent);
      drop.removeEventListener('drop', handleDrop);
    };
  }, []);

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, [mediaType, search, sort, sortDir, page, selectedAlbum]);

  async function fetchFiles() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('trang', page.toString());
      params.set('kichThuocTrang', PAGE_SIZE.toString());
      if (mediaType !== 'all') {
        // Backend expects 0 for HinhAnh, 1 for Video
        params.set('loai', mediaType === 'image' ? '0' : '1');
      }
      if (search) params.set('tuKhoa', search);
      if (selectedAlbum) params.set('albumId', selectedAlbum);
      
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/media?${params.toString()}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.thanhCong && data.duLieu?.danhSach) {
        setFiles(data.duLieu.danhSach);
        setTotal(data.duLieu.tongSo || 0);
      } else {
        setFiles([]);
        setTotal(0);
      }
    } catch {
      setFiles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }
  // Album CRUD handlers
  const openCreateAlbum = () => {
    setAlbumModal({ mode: 'create' });
    setAlbumName('');
    setAlbumDesc('');
  };
  const openEditAlbum = (album: AlbumPhuongTien) => {
    setAlbumModal({ mode: 'edit', album });
    setAlbumName(album.ten);
    setAlbumDesc(album.moTa || '');
  };
  const closeAlbumModal = () => {
    setAlbumModal(null);
    setAlbumName('');
    setAlbumDesc('');
  };
  const handleAlbumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlbumLoading(true);
    try {
      if (albumModal?.mode === 'create') {
        await mediaApi.taoAlbum({ ten: albumName, moTa: albumDesc, dangHoatDong: true });
        setToast('Tạo album thành công!');
      } else if (albumModal?.mode === 'edit' && albumModal.album) {
        await mediaApi.capNhatAlbum(albumModal.album.id, { ten: albumName, moTa: albumDesc, dangHoatDong: albumModal.album.dangHoatDong });
        setToast('Đã cập nhật album!');
      }
      fetchAlbums();
    } catch {
      setToast('Lỗi thao tác album!');
    } finally {
      setAlbumLoading(false);
      closeAlbumModal();
    }
  };
  const handleDeleteAlbum = async (id: string) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa album này?')) return;
    setAlbumLoading(true);
    try {
      await mediaApi.xoaAlbum(id);
      setToast('Đã xóa album!');
      if (selectedAlbum === id) setSelectedAlbum(null);
      fetchAlbums();
    } catch {
      setToast('Lỗi xóa album!');
    } finally {
      setAlbumLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      // Tự động điền tiêu đề từ tên file nếu chưa có
      if (!title.trim()) {
        const fileName = e.target.files[0].name;
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        setTitle(nameWithoutExt);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setToast('Vui lòng chọn file để tải lên.');
      return;
    }
    setUploading(true);
    setToast(null);
    try {
      // Sử dụng description nếu có, nếu không thì dùng title làm alt text
      const altText = description.trim() || title.trim() || selectedFile.name;
      
      // FIX: Sử dụng mediaApi.taiLenAnh thay vì gọi trực tiếp
      await mediaApi.taiLenAnh(selectedFile, selectedAlbum || undefined, altText);
      
      setToast('Tải lên thành công!');
      // Reset form
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      // Reset input file
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchFiles();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { thongDiep?: string } }, message?: string };
      console.error('Upload error:', error);
      const errorMsg = error?.response?.data?.thongDiep || error?.message || 'Lỗi không xác định';
      setToast('Tải lên thất bại: ' + errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/media/${id}`, { 
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        setToast('Đã xóa file thành công!');
        fetchFiles();
      } else {
        setToast('Xóa file thất bại!');
      }
    } catch {
      setToast('Xóa file thất bại!');
    }
    setDeletingId(null);
    setConfirmDelete(null);
  };

  // Pagination
  const totalPages = Math.ceil(total / PAGE_SIZE);


  return (
    <div className="max-w-6xl mx-auto mt-6 p-2 md:p-6 bg-white rounded shadow min-h-[80vh]">
      <h2 className="text-xl font-bold mb-4">Quản lý Thư viện ảnh & video</h2>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow z-50 animate-fadein">
          {toast}
        </div>
      )}

      {/* Album management UI */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <span className="font-semibold">Album:</span>
          <button className={`px-2 py-1 rounded ${!selectedAlbum ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setSelectedAlbum(null)} disabled={albumLoading}>Tất cả</button>
          {albums.map(album => (
            <span key={album.id} className={`flex items-center gap-1 px-2 py-1 rounded border ${selectedAlbum === album.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 border-gray-300'}`}>
              <button className="font-semibold" onClick={() => setSelectedAlbum(album.id)} disabled={albumLoading}>{album.ten}</button>
              <button className="text-xs ml-1" title="Đổi tên" onClick={() => openEditAlbum(album)} disabled={albumLoading}>✏️</button>
              <button className="text-xs ml-1" title="Xóa album" onClick={() => handleDeleteAlbum(album.id)} disabled={albumLoading}>🗑️</button>
            </span>
          ))}
          <button className="px-2 py-1 rounded bg-green-600 text-white ml-2" onClick={openCreateAlbum} disabled={albumLoading}>+ Album</button>
        </div>
        {albumModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form onSubmit={handleAlbumSubmit} className="bg-white rounded shadow p-6 w-full max-w-xs">
              <h3 className="font-bold mb-2">{albumModal.mode === 'create' ? 'Tạo album mới' : 'Đổi tên album'}</h3>
              <input type="text" className="border rounded px-2 py-1 w-full mb-2" placeholder="Tên album" value={albumName} onChange={e => setAlbumName(e.target.value)} required autoFocus />
              <input type="text" className="border rounded px-2 py-1 w-full mb-2" placeholder="Mô tả (tùy chọn)" value={albumDesc} onChange={e => setAlbumDesc(e.target.value)} />
              <div className="flex gap-2 justify-end mt-2">
                <button type="button" className="px-3 py-1 bg-gray-400 text-white rounded" onClick={closeAlbumModal} disabled={albumLoading}>Hủy</button>
                <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded" disabled={albumLoading || !albumName.trim()}>{albumLoading ? 'Đang lưu...' : 'Lưu'}</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Upload form */}
      <div ref={dropRef} className="border-2 border-dashed border-blue-400 rounded p-4 mb-6 text-center hover:bg-blue-50 transition cursor-pointer">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8 justify-between">
          <form onSubmit={handleUpload} className="flex-1 flex flex-col md:flex-row gap-2 md:gap-4 items-center" aria-label="Upload media form">
            <div className="flex gap-2 mb-2 md:mb-0">
              <button type="button" className={`px-4 py-2 rounded-l ${mediaType === 'image' ? 'bg-blue-600' : 'bg-gray-400'} text-white`} onClick={() => setMediaType('image')} aria-label="Select image type">Ảnh</button>
              <button type="button" className={`px-4 py-2 rounded-r ${mediaType === 'video' ? 'bg-blue-600' : 'bg-gray-400'} text-white`} onClick={() => setMediaType('video')} aria-label="Select video type">Video</button>
            </div>
            {/* Album selection dropdown */}
            <select
              value={selectedAlbum || ''}
              onChange={e => setSelectedAlbum(e.target.value || null)}
              className="border rounded px-2 py-1 text-sm min-w-[120px]"
              aria-label="Chọn album để upload"
            >
              <option value="">-- Không album --</option>
              {albums.map(album => (
                <option key={album.id} value={album.id}>{album.ten}</option>
              ))}
            </select>
            <label htmlFor="file-upload" className="sr-only">Chọn file</label>
            <input
              id="file-upload"
              type="file"
              accept={mediaType === 'image' ? 'image/*' : 'video/*'}
              onChange={handleFileChange}
              className="block text-sm max-w-[180px]"
              aria-label="File upload input"
            />
            <label htmlFor="title-input" className="sr-only">Tiêu đề</label>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="border px-2 py-1 rounded text-sm min-w-[120px]"
              placeholder="Tiêu đề *"
              required
              aria-label="Title input"
            />
            <label htmlFor="description-input" className="sr-only">Mô tả</label>
            <input
              id="description-input"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="border px-2 py-1 rounded text-sm min-w-[120px]"
              placeholder="Mô tả (tùy chọn)"
              aria-label="Description input"
            />
            <button
              type="submit"
              disabled={uploading || !selectedFile || !title.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              aria-label="Upload button"
            >
              {uploading ? 'Đang tải lên...' : 'Tải lên'}
            </button>
          </form>
          <div className="text-xs text-gray-500 hidden md:block">Kéo & thả file vào vùng này để tải lên nhanh</div>
        </div>
      </div>

      {/* Bộ lọc, tìm kiếm, sắp xếp */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4 items-center">
        <div className="flex gap-2" role="group" aria-label="Media type filter">
          <button className={`px-3 py-1 rounded ${mediaType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setMediaType('all')} aria-label="Show all media">Tất cả</button>
          <button className={`px-3 py-1 rounded ${mediaType === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setMediaType('image')} aria-label="Show images only">Ảnh</button>
          <button className={`px-3 py-1 rounded ${mediaType === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setMediaType('video')} aria-label="Show videos only">Video</button>
        </div>
        <label htmlFor="search-input" className="sr-only">Tìm kiếm</label>
        <input
          id="search-input"
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border px-2 py-1 rounded text-sm flex-1 min-w-[180px]"
          placeholder="Tìm kiếm theo tiêu đề, mô tả..."
          aria-label="Search media"
        />
        <div className="flex gap-2 items-center">
          <label htmlFor="sort-select" className="text-sm">Sắp xếp:</label>
          <select 
            id="sort-select"
            value={sort} 
            onChange={e => setSort(e.target.value as 'date' | 'name')} 
            className="border rounded px-2 py-1 text-sm"
            aria-label="Sort by"
          >
            <option value="date">Ngày</option>
            <option value="name">Tên</option>
          </select>
          <button 
            onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')} 
            className="px-2 py-1 border rounded text-sm"
            aria-label={`Sort direction: ${sortDir === 'desc' ? 'Descending' : 'Ascending'}`}
          >
            {sortDir === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {/* Danh sách file dạng lưới */}
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : files.length === 0 ? (
        <div>Không có file nào phù hợp.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file) => (
            <div key={file.id} className="border rounded p-2 flex flex-col items-center bg-slate-50 relative group">
              {file.loai === 'HinhAnh' ? (
                <img src={file.urlTep} alt={file.tenTep} className="w-full h-32 object-contain mb-2 bg-white rounded" loading="lazy" />
              ) : file.loai === 'Video' ? (
                <video src={file.urlTep} controls className="w-full h-32 object-contain mb-2 bg-black rounded" preload="metadata" />
              ) : null}
              <div className="font-medium text-center w-full truncate" title={file.tenTep}>{file.tenTep}</div>
              <div className="text-xs text-gray-500 mb-1 w-full text-center truncate">{file.vanBanThayThe || ''}</div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1 w-full justify-center">
                <span>{file.loai}</span>
                <span>{formatBytes(file.kichThuocTep)}</span>
                <span>{new Date(file.ngayTao).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2 w-full justify-center opacity-0 group-hover:opacity-100 transition absolute top-2 right-2">
                <button onClick={() => setConfirmDelete(file.id)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Xóa</button>
              </div>
              {/* Xác nhận xóa */}
              {confirmDelete === file.id && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 rounded">
                  <div className="bg-white p-4 rounded shadow text-center">
                    <div className="mb-2">Bạn chắc chắn muốn xóa file này?</div>
                    <div className="font-bold mb-2">{file.tenTep}</div>
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => handleDelete(file.id)} disabled={deletingId===file.id} className="px-3 py-1 bg-red-600 text-white rounded">{deletingId===file.id?'Đang xóa...':'Xóa'}</button>
                      <button onClick={() => setConfirmDelete(null)} className="px-3 py-1 bg-gray-400 text-white rounded">Hủy</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center mt-6">
          <button disabled={page === 1} onClick={() => setPage(page-1)} className="px-3 py-1 border rounded disabled:opacity-50">Trang trước</button>
          <span className="px-2 py-1">Trang {page}/{totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page+1)} className="px-3 py-1 border rounded disabled:opacity-50">Trang sau</button>
        </div>
      )}
    </div>
  );
}
