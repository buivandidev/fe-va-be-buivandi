const fs = require('fs');

function fixFile(file, map) {
  let txt = fs.readFileSync(file, 'utf8');
  for (let key in map) {
    txt = txt.split(key).join(map[key]);
  }
  fs.writeFileSync(file, txt, 'utf8');
  console.log('Fixed ' + file);
}

// 1. dich-vu-cong
const mapDvc = {
  'Äá»‹nh nghÄ©a cÆ¡ báº£n DTO tá»« BE': 'Định nghĩa cơ bản DTO từ BE',
  'Náº¿u BE cĂ³ tham sá»‘ lá»c theo lÄ©nh vá»±c, thĂªm vĂ o Ä‘Ă¢y': 'Nếu BE có tham số lọc theo lĩnh vực, thêm vào đây',
  'Lá»—i khi gá»i API dá»‹ch vá»¥:': 'Lỗi khi gọi API dịch vụ:',
  'Cá»•ng Dá»‹ch Vá»¥ CĂ´ng': 'Cổng Dịch Vụ Công',
  'Nhanh chĂ³ng, Minh báº¡ch & <span': 'Nhanh chóng, Minh bạch & <span',
  'Hiá»‡u quáº£': 'Hiệu quả',
  'Thá»±c hiá»‡n cĂ¡c thá»§ tá»¥c hĂnh chĂnh má»i lĂºc, má»i nÆ¡i. Há»‡ thá»‘ng cung cáº¥p hĂng trÄƒm dá»‹ch vá»¥ cĂ´ng trá»±c tuyáº¿n má»©c Ä‘á»™ cao, giĂºp tiáº¿t kiá»‡m thá»i gian vĂ chi phĂ cho ngÆ°á»i dĂ¢n vĂ doanh nghiá»‡p.': 'Thực hiện các thủ tục hành chính mọi lúc, mọi nơi. Hệ thống cung cấp hàng trăm dịch vụ công trực tuyến mức độ cao, giúp tiết kiệm thời gian và chi phí cho người dân và doanh nghiệp.',
  'Nháºp tĂªn thá»§ tá»¥c, tá»« khĂ³a... (VD: Khai sinh)': 'Nhập tên thủ tục, từ khóa... (VD: Khai sinh)',
  'TĂ¬m kiáº¿m': 'Tìm kiếm',
  'LÄ©nh vá»±c thá»§ tá»¥c': 'Lĩnh vực thủ tục',
  'Táº¥t cáº£ lÄ©nh vá»±c': 'Tất cả lĩnh vực',
  'Há»™ tá»‹ch': 'Hộ tịch',
  'Äáº¥t Ä‘ai, XĂ¢y dá»±ng': 'Đất đai, Xây dựng',
  'ÄÄƒng kĂ½ kinh doanh': 'Đăng ký kinh doanh',
  'Chá»©ng thá»±c': 'Chứng thực',
  'Káº¿t quáº£ tĂ¬m kiáº¿m cho': 'Kết quả tìm kiếm cho',
  'Danh sĂ¡ch Dá»‹ch vá»¥ cĂ´ng': 'Danh sách Dịch vụ công',
  'TĂ¬m tháº¥y': 'Tìm thấy',
  'thá»§ tá»¥c': 'thủ tục',
  'KhĂ´ng tĂ¬m tháº¥y thá»§ tá»¥c nĂo': 'Không tìm thấy thủ tục nào',
  'Vui lĂ²ng thá» láº¡i vá»›i tá»« khĂ³a khĂ¡c hoáº·c Ä‘iá»u chá»‰nh bá»™ lá»c.': 'Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc.',
  'Xem táº¥t cáº£ thá»§ tá»¥c': 'Xem tất cả thủ tục',
  'Trá»±c tuyáº¿n': 'Trực tuyến',
  'Táº¡m ngÆ°ng': 'Tạm ngưng',
  'ChÆ°a cĂ³ mĂ´ táº£ chi tiáº¿t cho thá»§ tá»¥c nĂy.': 'Chưa có mô tả chi tiết cho thủ tục này.',
  'ngĂy': 'ngày',
  'TĂ¹y há»“ sÆ¡': 'Tùy hồ sơ',
  'Miá»…n phĂ': 'Miễn phí',
  'Xem chi tiáº¿t': 'Xem chi tiết',
  'Ná»™p há»“ sÆ¡': 'Nộp hồ sơ',
  'Ä‘': 'đ'
};
fixFile('frontend/nguoi-dan/src/app/dich-vu-cong/page.tsx', mapDvc);

// 2. thu-vien/video/[id]
const mapVid = {
  'TĂ¡ÂºÂ¡m thĂ¡Â»Âi lĂ¡ÂºÂ¥y danh sÄ‚Â¡ch video vÄ‚Â lĂ¡Â»Âc ra video cÄ‚Â³ ID tĂ†Â°Ă†Â¡ng Ă¡Â»Â©ng': 'Tạm thời lấy danh sách video và lọc ra video có ID tương ứng',
  'vÄ‚Â¬ BE chĂ†Â°a cÄ‚Â³ endpoint GET /api/media/{id}': 'vì BE chưa có endpoint GET /api/media/{id}',
  'LĂ¡Â»â€”i lĂ¡ÂºÂ¥y video liÄ‚Âªn quan:': 'Lỗi lấy video liên quan:',
  'TrÄ‚Â¬nh duyĂ¡Â»â€¡t cĂ¡Â»Â§a bĂ¡ÂºÂ¡n khÄ‚Â´ng hĂ¡Â»â€” trĂ¡Â»Â£ thĂ¡ÂºÂ» video.': 'Trình duyệt của bạn không hỗ trợ thẻ video.',
  'Video khÄ‚Â´ng khĂ¡ÂºÂ£ dĂ¡Â»Â¥ng': 'Video không khả dụng',
  'Video khÄ‚Â´ng cÄ‚Â³ tiÄ‚Âªu Ă„â€˜Ă¡Â»Â': 'Video không có tiêu đề',
  'Video khÄ‚Â¡c': 'Video khác'
};
fixFile('frontend/nguoi-dan/src/app/thu-vien/video/[id]/page.tsx', mapVid);

// 3. to-chuc
const mapToc = {
  'CÆ¡ Cáº¥u Tá»• Chá»©c': 'Cơ Cấu Tổ Chức',
  'SÆ¡ Ä‘á»“ tá»• chá»©c vĂ  danh sĂ¡ch cĂ¡n bá»™': 'Sơ đồ tổ chức và danh sách cán bộ',
  'Äáº¡i diá»‡n LĂ£nh Ä‘áº¡o': 'Đại diện Lãnh đạo',
  'BĂ thÆ° Äáº£ng á»§y': 'Bí thư Đảng ủy',
  'PhĂ³ BĂ thÆ° ThÆ°á»ng trá»±c': 'Phó Bí thư Thường trực',
  'Chá»§ tá»‹ch UBND': 'Chủ tịch UBND',
  'PhĂ³ Chá»§ tá»‹ch UBND': 'Phó Chủ tịch UBND',
  'Chá»§ tá»‹ch HÄND': 'Chủ tịch HĐND',
  'CĂ¡c Bá»™ pháºn ChuyĂªn mĂ´n': 'Các Bộ phận Chuyên môn',
  'VÄƒn phĂ²ng - Thá»‘ng kĂª': 'Văn phòng - Thống kê',
  'Äá»‹a chĂnh - XĂ¢y dá»±ng': 'Địa chính - Xây dựng',
  'TĂ i chĂnh - Káº¿ toĂ¡n': 'Tài chính - Kế toán',
  'TÆ° phĂ¡p - Há»™ tá»‹ch': 'Tư pháp - Hộ tịch',
  'VÄƒn hĂ³a - XĂ£ há»™i': 'Văn hóa - Xã hội',
  'ÄoĂ n Thá»ƒ & CĂ¡c Tá»• Chá»©c': 'Đoàn Thể & Các Tổ Chức',
  'Máº·t tráºn Tá»• quá»‘c': 'Mặt trận Tổ quốc',
  'ÄoĂ n Thanh niĂªn': 'Đoàn Thanh niên',
  'Há»™i Phá»¥ ná»¯': 'Hội Phụ nữ',
  'Há»™i NĂ´ng dĂ¢n': 'Hội Nông dân',
  'Há»™i Cá»±u chiáº¿n binh': 'Hội Cựu chiến binh'
};
fixFile('frontend/nguoi-dan/src/app/to-chuc/page.tsx', mapToc);

console.log('Done script');