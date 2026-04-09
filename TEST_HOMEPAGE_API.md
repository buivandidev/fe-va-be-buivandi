# ✅ API Homepage Sections - Hoàn thành!

## API Endpoint mới

**URL:** `GET /api/homepage/sections`

**Response:**
```json
{
  "thanhCong": true,
  "duLieu": {
    "banner": {
      "id": "...",
      "tenTep": "banner.jpg",
      "urlTep": "http://localhost:5000/uploads/images/...",
      "tieuDe": "Banner chính",
      "ngayTao": "2026-04-08T..."
    },
    "videos": [
      {
        "id": "...",
        "tenTep": "video1.mp4",
        "urlTep": "http://localhost:5000/uploads/videos/...",
        "tieuDe": "Video giới thiệu",
        "loai": 1,
        "ngayTao": "2026-04-08T..."
      }
    ],
    "gallery": [
      {
        "id": "...",
        "tenTep": "gallery1.jpg",
        "urlTep": "http://localhost:5000/uploads/images/...",
        "tieuDe": "Cảnh đẹp 1",
        "ngayTao": "2026-04-08T..."
      }
    ]
  }
}
```

## Test API

```powershell
curl http://localhost:5000/api/homepage/sections
```

## Kết quả hiện tại

✅ API hoạt động
✅ Banner: Có (1 ảnh)
✅ Videos: 1 video
✅ Gallery: 1 ảnh

## Cách sử dụng trong Frontend

### Cách 1: Fetch trực tiếp trong page.tsx
```typescript
const [homepageData, setHomepageData] = useState(null);

useEffect(() => {
  async function fetchHomepage() {
    const res = await fetch('http://localhost:5000/api/homepage/sections');
    const data = await res.json();
    if (data.thanhCong) {
      setHomepageData(data.duLieu);
    }
  }
  fetchHomepage();
}, []);

// Sử dụng
const heroImage = homepageData?.banner?.urlTep || defaultImage;
const videos = homepageData?.videos || [];
const gallery = homepageData?.gallery || [];
```

### Cách 2: Tạo API route trong Next.js
```typescript
// app/api/homepage/route.ts
export async function GET() {
  const res = await fetch('http://localhost:5000/api/homepage/sections');
  const data = await res.json();
  return Response.json(data);
}

// Trong page.tsx
const res = await fetch('/api/homepage');
```

## Luồng hoàn chỉnh

1. ✅ Admin upload ảnh với tag [banner], [video], [gallery]
2. ✅ Backend lưu vào database
3. ✅ API `/api/homepage/sections` trả về ảnh theo section
4. ⚠️ Frontend người dân fetch và hiển thị

## Để hoàn thành

Cập nhật file `frontend/nguoi-dan/src/app/page.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react';

export default function Home() {
  const [homepage, setHomepage] = useState<any>(null);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/homepage/sections')
      .then(res => res.json())
      .then(data => {
        if (data.thanhCong) {
          setHomepage(data.duLieu);
        }
      });
  }, []);

  const heroImage = homepage?.banner?.urlTep || 'default-image-url';
  const videos = homepage?.videos || [];
  const galleryImages = homepage?.gallery || [];

  // Rest of the component...
}
```

## Test

1. Upload ảnh từ admin:
   - Banner: 1 ảnh
   - Video: 4 video/ảnh
   - Gallery: 5 ảnh

2. Gọi API:
   ```powershell
   curl http://localhost:5000/api/homepage/sections
   ```

3. Kiểm tra response có đủ dữ liệu

4. Cập nhật frontend để sử dụng dữ liệu này

## Kết luận

✅ Backend API hoàn chỉnh
✅ Admin panel hoàn chỉnh
⚠️ Cần cập nhật frontend người dân để fetch từ API

**API đã sẵn sàng sử dụng!** 🚀
