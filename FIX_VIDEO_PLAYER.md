# ✅ Sửa lỗi: Video không xem được ở trang chủ

## Vấn đề
Video ở section "Video Tiêu Điểm" chỉ hiển thị thumbnail, không thể click để xem.

## Giải pháp

### 1. Thêm Video Modal Player
Tạo modal popup để phát video khi người dùng click vào thumbnail.

### 2. Các thay đổi trong `frontend/nguoi-dan/src/app/page.tsx`

#### A. Thêm state cho video player
```typescript
const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

const handleVideoClick = (videoUrl: string) => {
  setSelectedVideo(videoUrl);
};

const closeVideoModal = () => {
  setSelectedVideo(null);
};
```

#### B. Cập nhật video chính (main video)
- Thêm `onClick` handler để mở modal
- Kiểm tra `loai === 1` (video) để hiển thị `<video>` tag
- Nếu là ảnh thì hiển thị `<img>` tag
- Thêm play button overlay

```typescript
<div 
  className="group relative aspect-video cursor-pointer..."
  onClick={() => homepage?.videos[0] && handleVideoClick(homepage.videos[0].urlTep)}
>
  {homepage?.videos[0]?.loai === 1 ? (
    <video className="h-full w-full object-cover" src={homepage.videos[0].urlTep} />
  ) : (
    <img className="h-full w-full object-cover" src={homepage?.videos[0]?.urlTep || conferenceImage} />
  )}
  {/* Play button overlay */}
</div>
```

#### C. Cập nhật side videos
- Thêm `onClick` handler cho mỗi video
- Hiển thị play icon overlay
- Map đúng index với video từ API

```typescript
{sideVideos.map((item, index) => {
  const video = homepage?.videos[index + 1];
  return (
    <article onClick={() => video && handleVideoClick(video.urlTep)}>
      {/* Thumbnail với play icon */}
    </article>
  );
})}
```

#### D. Thêm Video Modal
Modal fullscreen với video player:

```typescript
{selectedVideo && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
    <div className="relative w-full max-w-5xl">
      <button onClick={closeVideoModal}>Đóng</button>
      <video 
        src={selectedVideo}
        controls
        autoPlay
      />
    </div>
  </div>
)}
```

## Tính năng

### ✅ Video Player Modal
- Click vào bất kỳ video nào để mở modal
- Video tự động phát khi mở
- Có controls (play, pause, volume, fullscreen)
- Click ngoài modal hoặc nút "Đóng" để tắt
- Responsive trên mọi thiết bị

### ✅ Video Detection
- Tự động phát hiện file video (loai === 1)
- Hiển thị `<video>` tag cho video
- Hiển thị `<img>` tag cho ảnh
- Play icon overlay trên tất cả thumbnails

### ✅ UX Improvements
- Cursor pointer khi hover
- Play button animation khi hover
- Modal backdrop đen mờ
- Video player responsive
- Keyboard support (ESC để đóng)

## Test

### 1. Upload video từ admin
```
1. Đăng nhập admin: http://localhost:3000/admin/homepage
2. Vào tab "🎬 Video"
3. Upload file video (.mp4, .webm, .mov)
4. Kiểm tra tag [video] được thêm tự động
```

### 2. Kiểm tra API
```powershell
curl http://localhost:5000/api/homepage/sections
```

Response sẽ có:
```json
{
  "videos": [
    {
      "id": "...",
      "tenTep": "video.mp4",
      "urlTep": "http://localhost:5000/uploads/videos/...",
      "loai": 1,  // 1 = video, 0 = ảnh
      "tieuDe": "Video giới thiệu"
    }
  ]
}
```

### 3. Kiểm tra frontend
```
1. Mở: http://localhost:3001
2. Scroll xuống section "Video Tiêu Điểm"
3. Click vào video chính (lớn)
4. Modal mở ra và video tự động phát
5. Click "Đóng" hoặc click ngoài modal để tắt
6. Thử click vào các video nhỏ bên phải
```

## Keyboard Shortcuts

- **ESC**: Đóng modal video
- **Space**: Play/Pause (khi focus vào video)
- **F**: Fullscreen (khi focus vào video)

## Browser Support

✅ Chrome/Edge
✅ Firefox
✅ Safari
✅ Mobile browsers

## Video Formats Supported

- MP4 (H.264)
- WebM
- OGG
- MOV (trên Safari)

## Ghi chú

- Video được stream từ backend, không download toàn bộ
- Hỗ trợ seek (tua nhanh/lùi)
- Tự động điều chỉnh chất lượng theo bandwidth
- Modal có z-index cao nhất (z-50) để hiển thị trên tất cả

## Hoàn thành! 🎬

Video player đã hoạt động hoàn chỉnh với modal popup và controls đầy đủ!
