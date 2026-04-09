# 🚨 GIẢI PHÁP HOÀN CHỈNH - Node.js Process Leak

## Tình Huống

Hệ thống bị **process leak nghiêm trọng**:
- Lần 1: 600+ processes, >16GB RAM
- Lần 2: 982 processes, 14GB RAM (sau khi fix lần 1)

## Nguyên Nhân Gốc Rễ

Next.js 15/16 có bug với worker management:
1. `workerThreads: false` KHÔNG ĐỦ
2. Webpack vẫn tạo worker pool
3. Thread-loader vẫn spawn processes
4. HMR tạo thêm processes không được cleanup

## Giải Pháp 3 Lớp

### Lớp 1: Next.js Config
```javascript
experimental: {
  workerThreads: false,  // Tắt worker threads
  cpus: 1,               // Giới hạn 1 CPU
}
```

### Lớp 2: Webpack Config
```javascript
webpack: (config) => {
  config.parallelism = 1;  // Chỉ 1 process
  // Remove thread-loader
  return config;
}
```

### Lớp 3: Environment Variables
```bash
NODE_OPTIONS=--max-old-space-size=1024
NEXT_TELEMETRY_DISABLED=1
```

## Cách Sử Dụng ĐÚNG

### ❌ KHÔNG BAO GIỜ làm thế này:
```powershell
# Chỉ start mà không kill trước
npm run dev
```

### ✅ LUÔN LUÔN làm thế này:
```powershell
# Sử dụng script an toàn
.\START_SAFE_MODE.ps1
```

Script này sẽ:
1. ✅ Kill tất cả Node.js processes
2. ✅ Xóa cache .next
3. ✅ Kiểm tra config
4. ✅ Khởi động từng service
5. ✅ Kiểm tra số processes

## Monitoring Bắt Buộc

### Option 1: Monitor thủ công
```powershell
# Terminal riêng
.\MONITOR_NODE_PROCESSES.ps1
```

### Option 2: Auto-kill
```powershell
# Terminal riêng - tự động kill nếu >20 processes
.\AUTO_KILL_IF_TOO_MANY.ps1
```

### Option 3: Kiểm tra nhanh
```powershell
# Chạy bất cứ lúc nào
.\CHECK_NODE_RAM.ps1
```

## Quy Trình Hàng Ngày

### Sáng - Khởi động
```powershell
# 1. Kiểm tra không có process cũ
Get-Process node -ErrorAction SilentlyContinue

# 2. Nếu có, kill hết
.\KILL_ALL_NODE.ps1

# 3. Khởi động an toàn
.\START_SAFE_MODE.ps1

# 4. Mở terminal mới, monitor
.\MONITOR_NODE_PROCESSES.ps1
```

### Trong ngày - Kiểm tra
```powershell
# Mỗi 1-2 giờ
.\CHECK_NODE_RAM.ps1

# Nếu thấy >20 processes
.\KILL_ALL_NODE.ps1
.\START_SAFE_MODE.ps1
```

### Tối - Dừng
```powershell
# Trước khi tắt máy
.\KILL_ALL_NODE.ps1
```

## Dấu Hiệu Cảnh Báo

### 🟢 Bình thường (OK)
- Processes: 1-5
- RAM: <2GB
- Hành động: Không cần làm gì

### 🟡 Cảnh báo (Warning)
- Processes: 6-20
- RAM: 2-5GB
- Hành động: Theo dõi chặt, chuẩn bị restart

### 🔴 Nguy hiểm (Critical)
- Processes: >20
- RAM: >5GB
- Hành động: KILL NGAY và restart

## Troubleshooting

### Vẫn bị leak sau khi fix

**Option 1: Downgrade Next.js**
```bash
cd frontend
npm install next@14.2.0

cd ../frontend/nguoi-dan
npm install next@14.2.0
```

**Option 2: Dùng Turbopack**
```bash
# Trong package.json
"dev": "next dev --turbo"
```

**Option 3: Production mode**
```bash
npm run build
npm run start
```

### Không thể kill processes

```powershell
# Force kill với taskkill
taskkill /F /IM node.exe

# Hoặc restart máy
```

### Config không có hiệu lực

```powershell
# Xóa node_modules và reinstall
Remove-Item -Recurse -Force frontend/node_modules
Remove-Item -Recurse -Force frontend/nguoi-dan/node_modules

cd frontend
npm install

cd ../frontend/nguoi-dan
npm install
```

## Scripts Tham Khảo

### 1. START_SAFE_MODE.ps1
Khởi động an toàn với đầy đủ kiểm tra

### 2. KILL_ALL_NODE.ps1
Dừng tất cả Node.js processes

### 3. MONITOR_NODE_PROCESSES.ps1
Giám sát liên tục

### 4. AUTO_KILL_IF_TOO_MANY.ps1
Tự động kill nếu quá ngưỡng

### 5. CHECK_NODE_RAM.ps1
Kiểm tra nhanh

## Automation

### Windows Task Scheduler

Tạo task chạy mỗi 5 phút:

```powershell
# Script: auto-monitor.ps1
$count = (Get-Process node -ErrorAction SilentlyContinue | Measure-Object).Count

if ($count -gt 50) {
    # Emergency kill
    Stop-Process -Name node -Force
    
    # Log
    $log = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'): Emergency killed $count processes"
    Add-Content "C:\logs\node-emergency.log" $log
    
    # Send email (optional)
    # Send-MailMessage ...
}
```

## Best Practices

1. ✅ **LUÔN** dùng START_SAFE_MODE.ps1
2. ✅ **LUÔN** monitor processes
3. ✅ **LUÔN** kill trước khi tắt máy
4. ✅ **KHÔNG BAO GIỜ** start trực tiếp npm run dev
5. ✅ **KHÔNG BAO GIỜ** để quá 20 processes

## Kết Luận

Đây là bug nghiêm trọng của Next.js 15/16. Giải pháp:

1. ✅ Config 3 lớp (Next.js + Webpack + ENV)
2. ✅ Luôn dùng START_SAFE_MODE.ps1
3. ✅ Monitor liên tục
4. ✅ Auto-kill nếu cần
5. ⚠️ Cân nhắc downgrade nếu vẫn leak

**Với giải pháp này, hệ thống NÊN chỉ có 1-5 processes thay vì 600-900.**

---

**Trạng thái**: ✅ Đã áp dụng giải pháp hoàn chỉnh  
**Ngày**: 2026-04-08  
**Cần**: Giám sát chặt chẽ trong 24-48h đầu
