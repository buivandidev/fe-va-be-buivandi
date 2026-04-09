const fs = require('fs');
const files = [
  'frontend/nguoi-dan/src/components/portal/DichVuCard.tsx',
  'frontend/nguoi-dan/src/components/portal/PortalFooter.tsx',
  'frontend/nguoi-dan/src/app/tim-kiem/page.tsx'
];
function fixString(str) {
  try {
    return Buffer.from(str, 'latin1').toString('utf8');
  } catch (e) {
    return str;
  }
}
files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    // Common mappings in these files
    const map = {
      'Tìm kiếm': 'T?m ki?m',
      'Tìm kiếm tin tức, thủ tục hành ch�nh, tài liệu...': 'T?m ki?m tin t?c, th? t?c h�nh ch�nh, t�i li?u...',
      'Tìm thấy': 'T?m th?y',
      'kút quả cho': 'k?t qu? cho',
      'kút quả': 'k?t qu?',
      'D�ch vụ công': 'D?ch v? c�ng',
      'Nộp qua mạng': 'N?p qua m?ng',
      'Tin tức': 'Tin t?c',
      'Mức độ': 'M?c �?',
      'Trực tuyến': 'Tr?c tuy?n',
      'Tạm ngưng': 'T?m ng�ng',
      'Chưa có mô tả chi tiết cho thủ tục này.': 'Ch�a c� m� t? chi ti?t cho th? t?c n�y.',
      'ngày': 'ng�y',
      'Tùy hồ sơ': 'T�y h? s�',
      'Lệ ph�': 'L? ph�',
      'Miễn ph�': 'Mi?n ph�',
      'Xem chi tiết': 'Xem chi ti?t',
      'Nộp hồ sơ': 'N?p h? s�',
      'Cổng Thông Tin': 'C?ng Th�ng Tin',
      'Cơ quan chủ quản: Ủy ban nhân dân Thành phố': 'C� quan ch? qu?n: ?y ban nh�n d�n Th�nh ph?',
      '�ịa chỉ: 01 Trần Phú, Phư�ng 1, TP. HCM': '�?a ch?: 01 Tr?n Ph�, Ph�?ng 1, TP. HCM',
      'Liên Kết': 'Li�n K?t',
      'Trang chủ': 'Trang ch?',
      'Giới thiệu': 'Gi?i thi?u',
      'Hỗ trợ': 'H? tr?',
      'Câu h�?i thư�ng gặp': 'C�u h?i th�?ng g?p',
      'Hướng dẫn s� dụng': 'H�?ng d?n s? d?ng',
      'Liên hệ': 'Li�n h?',
      'Bản quy�n': 'B?n quy?n',
      'Bảo mật': 'B?o m?t',
      'Cung cấp b�?i': 'Cung c?p b?i',
      'đ': '�',
      'Dịch vụ công': 'D?ch v? c�ng',
      'kêt quả': 'k?t qu?',
      'Tìm thấy ': 'T?m th?y ',
      ' kết quả cho "': ' k?t qu? cho "',
      'Rất tiếc! Không có nội dung nào phù hợp.': 'R?t ti?c! Kh�ng c� n?i dung n�o ph� h?p.',
      'Th�i gian x� lý': 'Th?i gian x? l?',
      'Lỗi tim kiếm toàn cục:': 'L?i t?m ki?m to�n c?c:',
      'tài liệu': 't�i li?u',
      'thủ tục hành ch�nh': 'th? t?c h�nh ch�nh'
    };
    for (let k in map) {
      content = content.replaceAll(k, map[k]);
    }
    // Also try a regex replacing the encoded strings
    // we won't strictly rely on regex to be safe
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed ' + f);
  }
});
