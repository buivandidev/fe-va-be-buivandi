export default function ChinhSachBaoMat() {
  return (
    <main className="mx-auto flex max-w-5xl flex-grow flex-col px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 bg-slate-50/70 p-8 dark:border-slate-800 dark:bg-slate-800/50">
          <h1 className="gov-section-title text-center text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Chính sách bảo mật
          </h1>
          <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
            Quy định về thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của người sử dụng
          </p>
          <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">Cập nhật lần cuối: 06/04/2026</p>
        </div>

        <div className="space-y-8 p-8 leading-relaxed text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">1. Nguyên tắc chung về bảo vệ dữ liệu cá nhân</h2>
            <p>
              Cơ quan vận hành cổng thông tin cam kết bảo vệ dữ liệu cá nhân theo đúng quy định của pháp luật Việt Nam hiện hành về bảo
              vệ bí mật đời sống riêng tư, bí mật cá nhân và an toàn thông tin mạng. Việc xử lý dữ liệu chỉ được thực hiện khi có căn cứ
              pháp lý, đúng mục đích, đúng phạm vi cần thiết và bảo đảm minh bạch đối với chủ thể dữ liệu.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">2. Loại dữ liệu được thu thập</h2>
            <p className="mb-3">Tùy theo dịch vụ sử dụng, hệ thống có thể thu thập các nhóm thông tin sau:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Thông tin định danh: họ tên, ngày sinh, số định danh cá nhân/CCCD, địa chỉ liên hệ.</li>
              <li>Thông tin liên lạc: số điện thoại, địa chỉ thư điện tử (email).</li>
              <li>Thông tin hồ sơ, tệp đính kèm và trạng thái xử lý thủ tục hành chính.</li>
              <li>Dữ liệu kỹ thuật: nhật ký truy cập, địa chỉ IP, loại trình duyệt, thời điểm truy cập nhằm bảo đảm an toàn hệ thống.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">3. Mục đích xử lý dữ liệu</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Tiếp nhận, xác minh, xử lý và trả kết quả hồ sơ thủ tục hành chính theo thẩm quyền.</li>
              <li>Liên hệ, thông báo tiến độ, yêu cầu bổ sung hồ sơ và hướng dẫn nghĩa vụ tài chính (nếu có).</li>
              <li>Thống kê, tổng hợp, giám sát chất lượng dịch vụ công và cải thiện trải nghiệm người dân.</li>
              <li>Phòng ngừa, phát hiện và xử lý hành vi vi phạm pháp luật, gian lận, tấn công hệ thống.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">4. Cơ sở pháp lý và phạm vi sử dụng</h2>
            <p>
              Dữ liệu cá nhân được xử lý trên cơ sở sự đồng ý của người sử dụng, yêu cầu thực hiện nhiệm vụ công vụ và các căn cứ pháp lý
              khác theo quy định. Cơ quan vận hành không sử dụng dữ liệu cho mục đích thương mại trái quy định và không vượt quá phạm vi
              đã thông báo cho người sử dụng.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">5. Chia sẻ dữ liệu với bên thứ ba</h2>
            <p className="mb-3">
              Dữ liệu chỉ được chia sẻ trong các trường hợp cần thiết, phục vụ giải quyết thủ tục hành chính hoặc theo yêu cầu của cơ
              quan nhà nước có thẩm quyền.
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Chia sẻ nội bộ giữa các đơn vị chuyên môn để phối hợp xử lý hồ sơ liên thông.</li>
              <li>Cung cấp cho cơ quan tiến hành tố tụng hoặc cơ quan nhà nước có thẩm quyền theo quy định pháp luật.</li>
              <li>Không mua bán, trao đổi dữ liệu cá nhân cho mục đích quảng cáo, tiếp thị thương mại trái phép.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">6. Thời gian lưu trữ dữ liệu</h2>
            <p>
              Dữ liệu được lưu trữ trong thời hạn cần thiết để hoàn thành mục đích xử lý hoặc theo thời hạn lưu trữ hồ sơ, tài liệu hành
              chính theo quy định của pháp luật lưu trữ. Hết thời hạn lưu trữ, dữ liệu được xóa, hủy hoặc ẩn danh theo quy trình quản lý
              dữ liệu của cơ quan vận hành.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">7. Biện pháp bảo mật thông tin</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Áp dụng cơ chế xác thực, phân quyền truy cập theo vai trò và nhiệm vụ.</li>
              <li>Mã hóa đường truyền dữ liệu và triển khai các biện pháp giám sát an toàn thông tin.</li>
              <li>Kiểm soát nhật ký truy cập, sao lưu dữ liệu định kỳ và phương án khôi phục khi xảy ra sự cố.</li>
              <li>Đào tạo cán bộ, công chức về trách nhiệm bảo mật thông tin trong quá trình xử lý hồ sơ điện tử.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">8. Quyền của chủ thể dữ liệu</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Được biết, được đồng ý hoặc không đồng ý đối với việc xử lý dữ liệu cá nhân theo quy định.</li>
              <li>Được truy cập, chỉnh sửa, cập nhật thông tin cá nhân trên hệ thống trong phạm vi được pháp luật cho phép.</li>
              <li>Được yêu cầu hạn chế xử lý hoặc xóa dữ liệu trong các trường hợp đủ điều kiện pháp lý.</li>
              <li>Được khiếu nại, phản ánh khi phát hiện dữ liệu bị sử dụng sai mục đích hoặc vượt quá phạm vi công bố.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">9. Trách nhiệm của người sử dụng</h2>
            <p>
              Người sử dụng có trách nhiệm bảo mật thông tin đăng nhập, kiểm tra tính chính xác của dữ liệu đã cung cấp và chủ động thông
              báo cho cơ quan vận hành khi phát hiện nguy cơ lộ lọt thông tin hoặc giao dịch bất thường trên tài khoản.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/60">
            <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-white">10. Cập nhật chính sách và liên hệ</h2>
            <p>
              Chính sách bảo mật có thể được cập nhật định kỳ để phù hợp với quy định pháp luật và yêu cầu quản lý nhà nước. Mọi thay đổi
              được công bố công khai trên cổng thông tin. Khi cần hỗ trợ hoặc gửi yêu cầu liên quan đến dữ liệu cá nhân, người sử dụng có
              thể liên hệ qua mục <strong>Liên hệ</strong> để được hướng dẫn.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
