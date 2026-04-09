'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { mediaApi, PhuongTien, AlbumPhuongTien } from '@/lib/api/admin';

type SectionType = 'banner' | 'video' | 'gallery';

export default function HomepageManagementPage() {
  const [activeTab, setActiveTab] = useState<SectionType>('banner');
  const [files, setFiles] = useState<PhuongTien[]>([]);
  const [albums, setAlbums] = useState<AlbumPhuongTien[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [altText, setAltText] = useState('');

  const fetchFiles = useCallback(async () => {
    try {
      // Use the global apiClient which automatically handles baseURL and interceptors (token)
      const { apiClient } = await import('@/lib/api/client');
      const res = await apiClient.get('/api/admin/media', {
        params: { trang: 1, kichThuocTrang: 100 } // Send params to backend
      });
      
      const payload = res.data;
      if (payload && payload.duLieu && payload.duLieu.danhSach) {
        const allFiles = payload.duLieu.danhSach;
        const filtered = allFiles.filter((file: PhuongTien) => {
          const alt = (file.vanBanThayThe || '').toLowerCase();
          if (activeTab === 'banner') return alt.includes('[banner]');
          if (activeTab === 'video') return alt.includes('[video]');
          if (activeTab === 'gallery') return alt.includes('[gallery]');
          return false;
        });
        setFiles(filtered);
        return filtered;
      } else if (payload && payload.danhSach) {
         // Fallback if structured differently
         const allFiles = payload.danhSach;
         const filtered = allFiles.filter((file: PhuongTien) => {
           const alt = (file.vanBanThayThe || '').toLowerCase();
           if (activeTab === 'banner') return alt.includes('[banner]');
           if (activeTab === 'video') return alt.includes('[video]');
           if (activeTab === 'gallery') return alt.includes('[gallery]');
           return false;
         });
         setFiles(filtered);
         return filtered;
      }
      return [];
    } catch (error) {
      console.error('Error fetching files:', error);
      return [];
    }
  }, [activeTab]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [albumsData] = await Promise.all([
        mediaApi.layDanhSachAlbum(),
        fetchFiles()
      ]);
      setAlbums(albumsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setToast('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [fetchFiles]);

  useEffect(() => {
    fetchData();
  }, [activeTab, fetchData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      if (!altText.trim()) {
        const fileName = e.target.files[0].name;
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        setAltText(nameWithoutExt);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setToast('Vui lòng chọn file để tải lên.');
      return;
    }
    setUploading(true);
    setToast(null);
    try {
      const taggedAltText = `[${activeTab}] ${altText || selectedFile.name}`;
      await mediaApi.taiLenAnh(selectedFile, selectedAlbum || undefined, taggedAltText);
      setToast('Tải lên thành công!');
      setSelectedFile(null);
      setAltText('');
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchData();
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
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) return;
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        setToast('Đã xóa ảnh thành công!');
        fetchData();
      } else {
        setToast('Xóa ảnh thất bại!');
      }
    } catch {
      setToast('Xóa ảnh thất bại!');
    }
  };

  const getSectionInfo = () => {
    switch (activeTab) {
      case 'banner':
        return {
          title: 'Banner Trang chủ',
          description: 'Ảnh hero lớn hiển thị đầu trang chủ (khuyến nghị: 1920x1080px)',
          accept: 'image/*',
          maxFiles: 1
        };
      case 'video':
        return {
          title: 'Video Giới thiệu',
          description: 'Video tiêu điểm giới thiệu về địa phương',
          accept: 'video/*,image/*',
          maxFiles: 4
        };
      case 'gallery':
        return {
          title: 'Hình ảnh Tiêu biểu Địa phương',
          description: 'Ảnh đẹp về địa phương hiển thị ở cuối trang chủ (khuyến nghị: 5 ảnh)',
          accept: 'image/*',
          maxFiles: 5
        };
    }
  };

  const sectionInfo = getSectionInfo();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Trang chủ</h1>
        <p className="text-gray-600 mt-2">
          Quản lý ảnh và video hiển thị trên trang chủ người dân
        </p>
      </div>

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadein">
          {toast}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('banner')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
              activeTab === 'banner'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            🎯 Banner Trang chủ
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
              activeTab === 'video'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            🎬 Video Giới thiệu
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
              activeTab === 'gallery'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            🖼️ Hình ảnh Tiêu biểu
          </button>
        </div>
      </div>

      {/* Section Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-1">{sectionInfo.title}</h3>
        <p className="text-sm text-blue-800">{sectionInfo.description}</p>
        <p className="text-xs text-blue-600 mt-2">
          Hiện có: {files.length} / {sectionInfo.maxFiles} {activeTab === 'video' ? 'video/ảnh' : 'ảnh'}
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Tải {activeTab === 'video' ? 'video/ảnh' : 'ảnh'} mới lên</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn {activeTab === 'video' ? 'video/ảnh' : 'ảnh'}
              </label>
              <input
                id="file-upload"
                type="file"
                accept={sectionInfo.accept}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Album (tùy chọn)
              </label>
              <select
                value={selectedAlbum || ''}
                onChange={e => setSelectedAlbum(e.target.value || null)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">-- Không chọn album --</option>
                {albums.map(album => (
                  <option key={album.id} value={album.id}>{album.ten}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề / Mô tả
            </label>
            <input
              type="text"
              value={altText}
              onChange={e => setAltText(e.target.value)}
              placeholder={`Nhập tiêu đề cho ${activeTab === 'video' ? 'video/ảnh' : 'ảnh'}...`}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tag [{activeTab}] sẽ được tự động thêm vào
            </p>
          </div>
          <button
            type="submit"
            disabled={uploading || !selectedFile || files.length >= sectionInfo.maxFiles}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? 'Đang tải lên...' : 'Tải lên'}
          </button>
          {files.length >= sectionInfo.maxFiles && (
            <p className="text-sm text-red-600">
              Đã đạt giới hạn {sectionInfo.maxFiles} {activeTab === 'video' ? 'video/ảnh' : 'ảnh'}. Vui lòng xóa bớt để tải lên mới.
            </p>
          )}
        </form>
      </div>

      {/* Files Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">
          Danh sách {sectionInfo.title} ({files.length})
        </h2>
        
        {files.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Chưa có {activeTab === 'video' ? 'video/ảnh' : 'ảnh'} nào. Hãy tải lên để bắt đầu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file, index) => (
              <div key={file.id} className="group relative border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold z-10">
                  #{index + 1}
                </div>
                <div className="aspect-video bg-gray-100">
                  {file.loai === 'HinhAnh' ? (
                    <img
                      src={file.urlTep}
                      alt={file.vanBanThayThe || file.tenTep}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={file.urlTep}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-900 truncate mb-1" title={file.tenTep}>
                    {file.tenTep}
                  </p>
                  {file.vanBanThayThe && (
                    <p className="text-xs text-gray-600 truncate mb-3" title={file.vanBanThayThe}>
                      {file.vanBanThayThe.replace(`[${activeTab}]`, '').trim()}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(file.urlTep, '_blank')}
                      className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 font-medium"
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">💡 Hướng dẫn:</h3>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li><strong>Banner:</strong> Ảnh lớn đầu trang chủ (1 ảnh, 1920x1080px)</li>
          <li><strong>Video:</strong> Video giới thiệu + ảnh thumbnail (tối đa 4)</li>
          <li><strong>Gallery:</strong> Ảnh đẹp địa phương cuối trang (5 ảnh)</li>
          <li>Ảnh được tự động phân loại bằng tag [banner], [video], [gallery]</li>
          <li>Xóa ảnh sẽ xóa khỏi trang chủ ngay lập tức</li>
        </ul>
      </div>
    </div>
  );
}
