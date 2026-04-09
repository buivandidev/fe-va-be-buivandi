# ✅ Sửa lỗi: Video hiển thị màn hình trắng

## Vấn đề
Video ở section "Video Tiêu Điểm" hiển thị màn hình trắng/xám thay vì thumbnail.

## Nguyên nhân
- Sử dụng `<video>` tag để hiển thị preview
- Video tag không có `poster` attribute (thumbnail)
- Browser không tự động generate thumbnail từ video
- Video chưa load frame đầu tiên nên hiển thị trắng

## Giải pháp

### 1. Dùng ảnh thay vì video tag cho preview
Thay vì dùng `<video>` tag, dùng `<img>` tag với ảnh từ gallery hoặc banner làm thumbnail.

**Trước:**
```typescript
{homepage?.videos[0]?.loai === 1 ? (
  <video src={homepage.videos[0].urlTep} poster={...} />
) : (
  <img src={homepage?.videos[0]?.urlTep} />
)}
```

**Sau:**
```typescript
<img 
  src={homepage?.gallery?.[0]?.urlTep || homepage?.banner?.urlTep || conferenceImage} 
  className="h-full w-full object-cover" 
/>
```

### 2. Ưu tiên nguồn thumbnail
1. Ảnh từ gallery (nếu có)
2. Banner (nếu có)
3. Ảnh mặc định (fallback)

### 3. Video chỉ phát trong modal
- Preview: Dùng ảnh thumbnail
- Click: Mở modal với `<video>` tag
- Modal: Video tự động phát với controls

## Các thay đổi

### A. Video chính (main video)
```typescript
<div onClick={() => homepage?.videos[0] && handleVideoClick(homepage.videos[0].urlTep)}>
  {/* Thumbnail từ gallery hoặc banner */}
  <img src={homepage?.gallery?.[0]?.urlTep || homepage?.banner?.urlTep || conferenceImage} />
  
  {/* Play button overlay */}
  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
    <div className="rounded-full bg-primary">
      <span className="material-symbols-outlined">play_arrow</span>
    </div>
  </div>
</div>
```

### B. Side videos
```typescript
{sideVideos.map((item, index) => {
  const video = homepage?.videos[index + 1];
  const thumbnailSrc = homepage?.gallery?.[index + 1]?.urlTep || item.image;
  
  return (
    <article onClick={() => video && handleVideoClick(video.urlTep)}>
      <img src={thumbnailSrc} />
      {video && <span className="material-symbols-outlined">play_circle</span>}
    </article>
  );
})}
```

### C. Video modal với error handling
```typescript
<video 
  src={selectedVideo}
  controls
  autoPlay
  onError={(e) => console.error("Lỗi phát video:", e)}
>
  <source src={selectedVideo} type="video/mp4" />
  <source src={selectedVideo} type="video/webm" />
  Trình duyệt của bạn không hỗ trợ phát video.
</video>
```

## Hướng dẫn sử dụng

### 1. Upload ảnh thumbnail
Để video có thumbnail đẹp, cần upload ảnh vào gallery:

```
1. Đăng nhập admin: http://localhost:3000/admin/homepage
2. Tab "🖼️ Gallery" → Upload ảnh thumbnail cho video
3. Ảnh đầu tiên sẽ làm thumbnail cho video chính
4. Ảnh thứ 2, 3 sẽ làm thumbnail cho side videos
```

### 2. Upload video
```
1. Tab "🎬 Video" → Upload file video
2. Video sẽ tự động lấy thumbnail từ gallery
3. Nếu chưa có gallery, sẽ dùng banner
4. Nếu chưa có banner, sẽ dùng ảnh mặc định
```

### 3. Kiểm tra
```
1. Mở: http://localhost:3001
2. Scroll xuống "Video Tiêu Điểm"
3. Kiểm tra thumbnail hiển thị đúng (không trắng)
4. Click vào video → Modal mở → Video phát
```

## Ưu điểm của giải pháp

✅ Thumbnail hiển thị ngay lập tức (không cần load video)
✅ Tiết kiệm bandwidth (không load video cho preview)
✅ UX tốt hơn (ảnh đẹp thay vì màn hình trắng)
✅ Fallback nhiều cấp (gallery → banner → default)
✅ Video chỉ load khi cần (khi click)
✅ Hỗ trợ nhiều format video (mp4, webm)

## Lưu ý

### Thumbnail tốt nhất
- Kích thước: 1920x1080px (16:9)
- Format: JPG hoặc PNG
- Dung lượng: < 500KB
- Nội dung: Frame đại diện cho video

### Video format
- MP4 (H.264): Tương thích tốt nhất
- WebM: Dung lượng nhỏ hơn
- Bitrate: 2-5 Mbps
- Resolution: 1080p hoặc 720p

### Fallback chain
```
Video thumbnail priority:
1. Gallery image (homepage.gallery[0].urlTep)
2. Banner image (homepage.banner.urlTep)
3. Default image (conferenceImage)
```

## Test

### Test thumbnail hiển thị
```powershell
# 1. Kiểm tra API có gallery
curl http://localhost:5000/api/homepage/sections

# 2. Kiểm tra response có gallery
{
  "gallery": [
    { "urlTep": "http://localhost:5000/uploads/images/..." }
  ]
}

# 3. Mở frontend và kiểm tra thumbnail
# http://localhost:3001
```

### Test video phát
```
1. Click vào video thumbnail
2. Modal mở ra
3. Video tự động phát
4. Controls hoạt động (play, pause, seek, volume)
5. Fullscreen hoạt động
6. Đóng modal (ESC hoặc click ngoài)
```

## Kết quả

✅ Thumbnail hiển thị đẹp (không còn trắng)
✅ Video phát mượt trong modal
✅ UX tốt hơn nhiều
✅ Performance tốt hơn (không load video không cần thiết)

## Hoàn thành! 🎬

Video section giờ hiển thị thumbnail đẹp và video phát mượt mà!
