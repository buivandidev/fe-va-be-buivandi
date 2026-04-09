const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'nguoi-dan', 'src', 'app', 'nop-ho-so', 'page.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// Thay thế phần select để thêm thông báo lỗi khi không có dịch vụ
const oldCode = `           ) : (
             <select`;

const newCode = `           ) : services.length === 0 ? (
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 dark:bg-yellow-900/20 dark:border-yellow-800/30">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Hệ thống chưa có dịch vụ công khả dụng. Vui lòng liên hệ quản trị để cấu hình danh mục thủ tục.
              </p>
            </div>
           ) : (
             <select`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Đã thêm thông báo cảnh báo khi không có dịch vụ!');
} else {
  console.log('⚠️  Không tìm thấy đoạn code cần sửa. Có thể đã được sửa rồi.');
}
