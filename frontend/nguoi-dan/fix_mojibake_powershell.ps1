$Files = Get-ChildItem -Path "D:\febecuoiki\frontend\nguoi-dan\src\app\" -Recurse -Include *.tsx,*.ts -File

$Corrections = @{
    # A
    "An sinh" = "An sinh"
    # B
    "BĂ" = "bài"
    "báº¡n" = "bạn"
    "bĂ¬nh luáºn" = "bình luận"
    # C
    "CĂ¡c" = "Các"
    "Cáºp nháºt" = "Cập nhật"
    "Chi tiáº¿t" = "Chi tiết"
    "ChĂnh sĂ¡ch" = "Chính sách"
    "chĂnh" = "chính"
    "Chá»©c nÄƒng" = "Chức năng"
    # D
    "dĂ¹ng" = "dùng"
    "Danh má»¥c" = "Danh mục"
    # Đ
    "Ä‘Ă´ thá»‹" = "đô thị"
    "Ä‘Äƒng nháºp" = "đăng nhập"
    "ÄÄƒng xuáº¥t" = "Đăng xuất"
    "Ä‘á»ƒ" = "để"
    "Äá»•i máºt kháº©u" = "Đổi mật khẩu"
    "Ä‘Æ°á»£c" = "được"
    # G
    "gáº·p khĂ³ khÄƒn" = "gặp khó khăn"
    # H
    "há»— trá»£" = "hỗ trợ"
    "hĂ£y" = "hãy"
    # K
    "KhĂ´ng" = "Không"
    # L
    "liĂªn há»‡" = "liên hệ"
    "Lá»‹ch háº¹n" = "Lịch hẹn"
    # M
    "má»›i" = "mới"
    "MĂ´i trÆ°á»ng" = "Môi trường"
    # N
    "náº¿u" = "nếu"
    "ngĂ y" = "ngày"
    "ngÆ°á»i" = "người"
    "ná»•i báºt" = "nổi bật"
    # P
    "PhĂ¡t triá»ƒn" = "Phát triển"
    # Q
    "Quáº£n lĂ½" = "Quản lý"
    "trong quĂ¡ trĂ¬nh" = "trong quá trình"
    # S
    "Sá»‘ hĂ³a" = "Số hóa"
    "Sá»± kiá»‡n" = "Sự kiện"
    # T
    "táº£i" = "tải"
    "tĂ i khoáº£n" = "tài khoản"
    "TĂ¬m kiáº¿m" = "Tìm kiếm"
    "tĂ¬m tháº¥y" = "tìm thấy"
    "Tin tá»©c" = "Tin tức"
    "tá»•ng Ä‘Ă i" = "tổng đài"
    "Trang chá»§" = "Trang chủ"
    "Trá»£ giĂºp" = "Trợ giúp"
    "ThĂªm" = "Thêm"
    "ThĂ´ng tin" = "Thông tin"
    "thá»±c hiá»‡n" = "thực hiện"
    "thá»§ tá»¥c" = "thủ tục"
    # V
    "viáº¿t" = "viết"
    # X
    "xĂ£ há»»™i" = "xã hội"
}

foreach ($File in $Files) {
    if ($File.FullName -notmatch "ca-nhan|tin-tuc") { continue }
    $Text = Get-Content -Path $File.FullName -Raw -Encoding UTF8
    $Modified = $false

    foreach ($Key in $Corrections.Keys) {
        $EscapedKey = [regex]::Escape($Key)
        if ($Text -match $EscapedKey) {
            $Text = $Text -replace $EscapedKey, $Corrections[$Key]
            $Modified = $true
        }
    }

    if ($Modified) {
        Set-Content -Path $File.FullName -Value $Text -Encoding UTF8
        Write-Host "Fixed: $($File.FullName)"
    }
}
Write-Host "Done"
