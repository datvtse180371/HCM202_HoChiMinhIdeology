import './App.css'
import { motion, LazyMotion, domAnimation, useInView, useReducedMotion } from 'framer-motion'
import { useRef, useMemo } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import TOC from './components/TOC.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import ChatBox from './components/ChatBox.jsx';
import PdfModal from './components/PdfModal.jsx'

// Memoized Section component for better performance
const Section = ({ id, title, media, children, flip }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { 
    margin: '-20% 0px -20% 0px', 
    amount: 0.2,
    once: true // Only animate once for better performance
  })
  const reduceMotion = useReducedMotion()
  
  // Simplified animations for better performance
  const imageVariants = useMemo(() => ({
    hidden: { opacity: 0, x: flip ? 20 : -20 },
    visible: { opacity: 1, x: 0 }
  }), [flip])

  const textVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }), [])

  return (
    <motion.section 
      id={id} 
      className="card card--split snap-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.figure 
        className={`card__media ${flip ? 'order-2' : ''}`}
      >
        <motion.img
          ref={ref}
          src={media}
          alt=""
          loading="lazy"
          decoding="async"
          variants={reduceMotion ? {} : imageVariants}
          initial={reduceMotion ? { opacity: 1 } : "hidden"}
          /* animate to visible by default so images don't stay hidden if inView fails */
          animate={reduceMotion ? { opacity: 1 } : "visible"}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </motion.figure>
      <div className={`card__body ${flip ? 'order-1' : ''}`}>
        <motion.h2
          variants={reduceMotion ? {} : textVariants}
          initial={reduceMotion ? { opacity: 1 } : "hidden"}
          animate={reduceMotion ? { opacity: 1 } : (inView ? "visible" : "hidden")}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {title}
        </motion.h2>
        <motion.div
          variants={reduceMotion ? {} : textVariants}
          initial={reduceMotion ? { opacity: 1 } : "hidden"}
          animate={reduceMotion ? { opacity: 1 } : (inView ? "visible" : "hidden")}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  )
}

// Simplified StaggerList with reduced animation complexity
const StaggerList = ({ items }) => {
  const reduceMotion = useReducedMotion()
  
  if (reduceMotion) {
    return (
      <ul className="list--stagger">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    )
  }

  return (
    <motion.ul
      className="list--stagger"
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.3, once: true }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.1 } }
      }}
    >
      {items.map((t, i) => (
        <motion.li 
          key={i} 
          variants={{ 
            hidden: { opacity: 0, x: -10 }, 
            show: { opacity: 1, x: 0 } 
          }}
          transition={{ duration: 0.3 }}
        >
          {t}
        </motion.li>
      ))}
    </motion.ul>
  )
}

function App() {
  const reduceMotion = useReducedMotion()
  const heroRef = useRef(null)
  
  // Memoized sections array to prevent recreation on every render
  const sections = useMemo(() => [
    { id: 's31', title: '3.1. Độc lập dân tộc' },
    { id: 's311', title: '3.1.1. Vấn đề độc lập dân tộc' },
    { id: 's312', title: '3.1.2. Cách mạng giải phóng dân tộc' },
    { id: 's32', title: '3.2. CNXH & xây dựng CNXH' },
    { id: 's321', title: '3.2.1. Tư tưởng về CNXH' },
    { id: 's322', title: '3.2.2. Xây dựng CNXH' },
    { id: 's323', title: '3.2.3. Thời kỳ quá độ' },
    { id: 's33', title: '3.3. Quan hệ độc lập – CNXH' },
    { id: 's34', title: '3.4. Vận dụng hôm nay' },
    { id: 'discussion', title: 'Câu hỏi thảo luận' }
  ], [])

  return (
    <LazyMotion features={domAnimation}>
      <ProgressBar />
      <ScrollToTop />
      <Header />
      
      <motion.header 
        className="hero" 
        id="top"
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container hero__content">
          <img className="hero__icon" src="/assets/hcm-star.svg" alt="" />
          <h1>Chương 3: Độc lập dân tộc và Chủ nghĩa xã hội</h1>
          <p className="hero__subtitle">Tư tưởng Hồ Chí Minh</p>
          <div className="chips">
            <span className="chip">Độc lập dân tộc</span>
            <span className="chip">Chủ nghĩa xã hội</span>
            <span className="chip">Quan hệ biện chứng</span>
            <span className="chip">Vận dụng hôm nay</span>
          </div>
          <div className="cta-group">
            <a href="#s31" className="btn btn--primary">Bắt đầu</a>
            <a href="#discussion" className="btn btn--ghost">Thảo luận</a>
          </div>
        </div>
      </motion.header>

      <main className="container main snap">
        <div className="layout">
          <TOC sections={sections} />
          <div>
            <Section id="s31" title="3.1. Tư tưởng Hồ Chí Minh về độc lập dân tộc" media="/assets/sec_31_independence.jpg">
              <p>Hồ Chí Minh khẳng định độc lập dân tộc là quyền thiêng liêng, bất khả xâm phạm của mọi dân tộc, gắn liền với tự do, hạnh phúc của nhân dân. Độc lập phải là độc lập thực sự, toàn diện, được thể hiện bằng quyền làm chủ của nhân dân trên chính trị, kinh tế, văn hóa, xã hội.</p>
            </Section>

            <Section id="s311" title="3.1.1. Vấn đề độc lập dân tộc" media="/assets/sec_311_quote.jpg" flip>
              <StaggerList items={[
                'Độc lập, tự do là quyền thiêng liêng, bất khả xâm phạm của mọi dân tộc; là khát vọng cháy bỏng của nhân dân Việt Nam. "Không có gì quý hơn độc lập, tự do".',
                <>
                  Nền tảng hình thành: truyền thống yêu nước; tiếp cận quyền dân tộc từ quyền con người (trích Tuyên ngôn 1776 Hoa Kỳ; Tuyên ngôn Nhân quyền và Dân quyền 1791).
                  <span className="pdf-buttons" style={{ marginLeft: 8 }}>
                    <PdfModal pdfPath="/assets/In%20Congress.pdf" triggerText="Tuyên ngôn Hoa Kỳ" title="Tuyên ngôn độc lập Hoa Kì 1776" compact />
                    <PdfModal pdfPath="/assets/The%20representatives%20of%20the%20French%20People.pdf" triggerText="Tuyên ngôn Nhân quyền" title="Tuyên ngôn Nhân quyền và Dân quyền 1791" compact />
                  </span>
                </>,
                <>
                  Quá trình phát triển tư tưởng: Yêu sách 1919; Cương lĩnh 1930 (độc lập, tự do); 1941 đặt quyền lợi dân tộc "cao hơn hết thảy"; Tuyên ngôn độc lập 2/9/1945; kháng chiến chống Pháp, Mỹ.
                  <span className="pdf-buttons" style={{ marginLeft: 8 }}>
                    <PdfModal pdfPath="/assets/Vexay.pdf" triggerText="Yêu sách Véc-xây 1919" title="Yêu sách Véc-xây 1919" compact />
                    <PdfModal pdfPath="/assets/FirstProgression.pdf" triggerText="Cương lĩnh 1930" title="Cương lĩnh chính trị 1930" compact />
                    <PdfModal pdfPath="/assets/FirstDeclaration.pdf" triggerText="Tuyên ngôn 1945" title="Tuyên ngôn độc lập 1945" compact />
                  </span>
                </>,
                'Độc lập phải là độc lập thực sự, toàn diện và triệt để (chính trị, kinh tế, quân sự, ngoại giao), gắn với thống nhất và toàn vẹn lãnh thổ.',
                'Độc lập gắn với tự do, cơm no, áo ấm, hạnh phúc của nhân dân: "Nước độc lập mà dân không hưởng hạnh phúc, tự do, thì độc lập cũng chẳng có nghĩa lý gì".'
              ]} />
              <p className="callout">Trích dẫn: HCM Toàn tập, t.3 tr.555; t.4 tr.4, 480, 496; t.12. (Tài liệu lớp)</p>
            </Section>

            <Section id="s312" title="3.1.2. Về Cách mạng giải phóng dân tộc" media="/assets/sec_312_crowd.jpg">
              <StaggerList items={[
                'Đường lối: cách mạng giải phóng dân tộc phải đi theo con đường cách mạng vô sản; do Đảng Cộng sản lãnh đạo; đặt lợi ích dân tộc lên trên hết trong thời kỳ quyết định.',
                'Lực lượng: dựa vào sức mạnh đại đoàn kết toàn dân tộc, nòng cốt là liên minh công – nông; cách mạng là sự nghiệp của quần chúng.',
                'Quan hệ quốc tế: kết hợp sức mạnh dân tộc với sức mạnh thời đại; quan hệ bình đẳng với cách mạng vô sản chính quốc; thuộc địa có thể thắng trước và góp phần hỗ trợ chính quốc.',
                'Phương pháp: bạo lực cách mạng của quần chúng, kết hợp đấu tranh chính trị và vũ trang; "dùng bạo lực cách mạng chống lại bạo lực phản cách mạng".',
                'Mục tiêu chiến lược: độc lập dân tộc gắn liền với chủ nghĩa xã hội.'
              ]} />
              <p className="callout">Trích dẫn: HCM Toàn tập t.2, t.3, t.10–12; Đường Cách mệnh; Lênin về vấn đề dân tộc và thuộc địa. (Tài liệu lớp)
                <span className="pdf-buttons">
                  <PdfModal pdfPath="/assets/duong-kach-menh_992022132635.pdf" triggerText="Đường Cách mệnh" title="Đường Cách mệnh" compact />
                  {/* Local file path provided by user (not inside public/) — recommend copying this file into public/assets for proper serving */}
                  <PdfModal pdfPath="/assets/vandedantoc.pdf" triggerText="Vấn đề dân tộc" title="Vấn đề dân tộc và thuộc địa" compact />
                </span>
              </p>
            </Section>

            <Section id="s32" title="3.2. Tư tưởng về CNXH và xây dựng CNXH ở Việt Nam" media="/assets/sec_32_people.jpg" flip>
              <p>CNXH theo Hồ Chí Minh: xã hội do nhân dân làm chủ; kinh tế phát triển cao dựa trên lực lượng sản xuất hiện đại và công hữu chủ yếu; phân phối theo lao động; nhà nước của dân, do dân, vì dân; văn hóa – đạo đức tiến bộ; con người được giải phóng toàn diện, ấm no, hạnh phúc.</p>
            </Section>

            <Section id="s321" title="3.2.1. Tư tưởng về Chủ nghĩa xã hội" media="/assets/sec_321_flag_ideology.jpg">
              <StaggerList items={[
                'Bản chất và mục tiêu: vì con người, do nhân dân làm chủ; làm cho "ai cũng có ăn, có mặc, được học hành", nâng cao đời sống vật chất và tinh thần.',
                'Kinh tế: lực lượng sản xuất hiện đại; công hữu tư liệu sản xuất chủ yếu; nhấn mạnh phát triển sản xuất là "mặt trận chính".',
                'Phân phối: theo lao động; "ai làm nhiều hưởng nhiều, ai không làm thì không hưởng" (trừ các trường hợp chính sách).',
                'Chính trị: nhà nước của dân, do dân, vì dân; dân chủ gắn pháp luật và kỷ cương.',
                'Văn hóa – con người: phát triển khoa học – kỹ thuật, văn hóa; xây dựng con người XHCN có đạo đức, năng lực, tác phong.'
              ]} />
              <p className="callout">Trích dẫn: HCM Toàn tập t.1, t.9–10; Lênin Toàn tập t.30. (Tài liệu lớp)</p>
            </Section>

            <Section id="s322" title="3.2.2. Xây dựng CNXH ở Việt Nam" media="/assets/sec_322_congress.jpg" flip>
              <StaggerList items={[
                'Mục tiêu chính trị: chế độ dân chủ, nhân dân làm chủ; nhà nước pháp quyền XHCN dưới sự lãnh đạo của Đảng.',
                'Mục tiêu kinh tế: công nghiệp hóa – hiện đại hóa; phát triển lực lượng sản xuất; nhiều thành phần trong quá độ, quốc doanh giữ vai trò nền tảng.',
                'Quản trị: thực hiện chế độ khoán, gắn lợi ích cá nhân – tập thể; phát triển khoa học – công nghệ.',
                'Văn hóa – xã hội: nền văn hóa dân tộc, khoa học, đại chúng; công bằng xã hội; chăm lo con người, giải phóng phụ nữ.',
                'Động lực và trở lực: phát huy lợi ích chính đáng, dân chủ, đại đoàn kết; kiên quyết chống chủ nghĩa cá nhân, tham ô, lãng phí, quan liêu.'
              ]} />
              <p className="callout">Trích dẫn: HCM Toàn tập t.9–10; Văn kiện Đảng toàn tập; quan điểm về kinh tế nhiều thành phần thời quá độ. (Tài liệu lớp)</p>
            </Section>

            <Section id="s323" title="3.2.3. Thời kỳ quá độ lên CNXH ở Việt Nam" media="/assets/sec_323_transition.jpg">
              <StaggerList items={[
                'Tính chất: biến đổi sâu sắc, lâu dài, phức tạp; "cơn đau đẻ kéo dài" (Lênin); khó nhất ở nước nông nghiệp lạc hậu tiến thẳng lên CNXH.',
                'Đặc điểm: xuất phát điểm thấp; tàn dư phong kiến – thực dân; chiến tranh và chia cắt (sau 1954) → hai chiến lược đồng thời Bắc – Nam.',
                'Nhiệm vụ: cải tạo cái cũ, xây dựng cái mới về chính trị, kinh tế, văn hóa, quan hệ xã hội; xây dựng nền tảng vật chất – kỹ thuật của CNXH.',
                'Nguyên tắc: quán triệt CN Mác–Lênin nhưng chống giáo điều; giữ vững độc lập dân tộc; đoàn kết – học hỏi quốc tế; "xây đi đôi với chống".'
              ]} />
              <p className="callout">Trích dẫn: HCM Toàn tập; Lênin về thời kỳ quá độ. (Tài liệu lớp)</p>
            </Section>

            <Section id="s33" title="3.3. Quan hệ giữa độc lập dân tộc và CNXH" media="/assets/sec_33_ba_dinh.jpg" flip>
              <StaggerList items={[
                'Độc lập dân tộc là tiền đề để đi lên CNXH; nội dung độc lập bao hàm hòa bình, thống nhất, tự do, hạnh phúc cho nhân dân.',
                'CNXH bảo đảm vững chắc độc lập dân tộc: dân chủ, pháp quyền, phát triển toàn diện tạo nền tảng bảo vệ độc lập.',
                'Quan hệ biện chứng: độc lập càng vững, CNXH càng thuận lợi; CNXH thắng lợi càng củng cố độc lập.'
              ]} />
              <p className="callout">Trích dẫn: Văn kiện, HCM Toàn tập t.4, t.12. (Tài liệu lớp)</p>
            </Section>

            <Section id="s34" title="3.4. Vận dụng trong sự nghiệp cách mạng hôm nay" media="/assets/sec_34_industry4.jpg">
              <StaggerList items={[
                'Kiên định mục tiêu độc lập dân tộc gắn liền với CNXH; mục tiêu "dân giàu, nước mạnh, dân chủ, công bằng, văn minh".',
                'Phát huy dân chủ XHCN gắn với pháp chế, quyền con người; chống lợi dụng dân chủ.',
                'Củng cố hệ thống chính trị: Đảng trong sạch, vững mạnh; nhà nước pháp quyền của dân, do dân, vì dân.',
                'Đấu tranh chống suy thoái, "tự diễn biến", "tự chuyển hóa"; phòng, chống tham nhũng, lãng phí.',
                'Kết hợp sức mạnh dân tộc – thời đại; hội nhập quốc tế chủ động, hiệu quả.'
              ]} />
              <p className="callout">Nguồn liên hệ: Đại hội IX và sau này về động lực phát triển – đại đoàn kết toàn dân. (Tài liệu lớp)</p>
            </Section>

            <Section id="discussion" title="Câu hỏi thảo luận" media="/assets/hcm-star.svg" flip>
              <p><strong>Theo bạn, đối với Hồ Chí Minh, chủ nghĩa xã hội là mục tiêu cuối cùng, hay là công cụ để đạt một mục đích khác?</strong></p>
              <p className="muted">Gợi ý: Phân tích quan điểm "độc lập dân tộc gắn liền với chủ nghĩa xã hội"; mục tiêu giải phóng dân tộc, giải phóng giai cấp, giải phóng con người; hạnh phúc của nhân dân là thước đo.</p>
            </Section>
          </div>
        </div>
      </main>

          <ChatBox />

      <Footer />
    </LazyMotion>
  )
}

export default App