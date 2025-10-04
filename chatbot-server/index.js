import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("❌ Missing Gemini API key. Add GEMINI_API_KEY to .env file.");
    process.exit(1);
}

// In-memory session store
const sessions = new Map();

// Simple route to check server
app.get("/", (req, res) => {
    res.send("HCM Tutor Bot running!");
});

// Chat route
app.post("/chat", async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const sid = sessionId || crypto.randomUUID();

        // Simple greeting detection first
        const lowerMessage = message.toLowerCase().trim();
        if (["hi", "hello", "chào", "xin chào", "hey"].some(word => lowerMessage.includes(word))) {
            return res.json({
                reply: "Xin chào! Tôi là trợ giảng môn Tư tưởng Hồ Chí Minh. Tôi có thể giúp bạn tìm hiểu về: độc lập dân tộc, chủ nghĩa xã hội, và tư tưởng Hồ Chí Minh. Bạn có câu hỏi gì không?",
                sessionId: sid
            });
        }

        if (!sessions.has(sid)) {
            sessions.set(sid, [
                {
                    role: "user",
                    parts: [{
                        text: `Bạn là trợ giảng chuyên về Tư tưởng Hồ Chí Minh và chủ đề Độc lập dân tộc, Chủ nghĩa xã hội. 
Hãy dựa vào NỘI DUNG BÀI HỌC bên dưới để trả lời câu hỏi của học sinh.

QUY TẮC:
1. Trả lời nhiệt tình, chính xác, ngắn gọn và đúng trọng tâm.
2. Nếu câu hỏi nằm trong NỘI DUNG BÀI HỌC, chỉ trả lời dựa trên nội dung đó.
3. Nếu liên quan nhưng không có sẵn trong NỘI DUNG BÀI HỌC, hãy tự trả lời theo ý bạn và ghi rõ (Quan điểm của tôi).
4. Nếu không liên quan, hãy nhẹ nhàng hướng dẫn quay lại chủ đề bài học.

=================
NỘI DUNG BÀI HỌC:
3.1. Tư tưởng Hồ Chí Minh về Độc lập dân tộc

Hồ Chí Minh khẳng định độc lập dân tộc là quyền thiêng liêng, bất khả xâm phạm của mọi dân tộc, gắn liền với tự do, hạnh phúc của nhân dân. Độc lập phải là độc lập thực sự, toàn diện, được thể hiện bằng quyền làm chủ của nhân dân trên chính trị, kinh tế, văn hóa, xã hội.

3.1.1. Vấn đề Độc lập dân tộc

Độc lập, tự do là quyền thiêng liêng, bất khả xâm phạm của mọi dân tộc; là khát vọng cháy bỏng của nhân dân Việt Nam. “Không có gì quý hơn độc lập, tự do”.

Nền tảng hình thành: truyền thống yêu nước; tiếp cận quyền dân tộc từ quyền con người (trích Tuyên ngôn 1776 Hoa Kỳ; Tuyên ngôn Nhân quyền và Dân quyền 1791).

Quá trình phát triển tư tưởng: Yêu sách 1919; Cương lĩnh 1930 (độc lập, tự do); 1941 đặt quyền lợi dân tộc “cao hơn hết thảy”; Tuyên ngôn độc lập 2/9/1945; kháng chiến chống Pháp, Mỹ.

Độc lập phải là độc lập thực sự, toàn diện và triệt để (chính trị, kinh tế, quân sự, ngoại giao), gắn với thống nhất và toàn vẹn lãnh thổ.

Độc lập gắn với tự do, cơm no, áo ấm, hạnh phúc của nhân dân: “Nước độc lập mà dân không hưởng hạnh phúc, tự do, thì độc lập cũng chẳng có nghĩa lý gì”。

Trích dẫn: HCM Toàn tập, t.3 tr.555; t.4 tr.4, 480, 496; t.12. (Tài liệu lớp)

3.1.2. Về Cách mạng giải phóng dân tộc

Đường lối: cách mạng giải phóng dân tộc phải đi theo con đường cách mạng vô sản; do Đảng Cộng sản lãnh đạo; đặt lợi ích dân tộc lên trên hết trong thời kỳ quyết định.

Lực lượng: dựa vào sức mạnh đại đoàn kết toàn dân tộc, nòng cốt là liên minh công – nông; cách mạng là sự nghiệp của quần chúng.

Quan hệ quốc tế: kết hợp sức mạnh dân tộc với sức mạnh thời đại; quan hệ bình đẳng với cách mạng vô sản chính quốc; thuộc địa có thể thắng trước và góp phần hỗ trợ chính quốc.

Phương pháp: bạo lực cách mạng của quần chúng, kết hợp đấu tranh chính trị và vũ trang; “dùng bạo lực cách mạng chống lại bạo lực phản cách mạng”.

Mục tiêu chiến lược: độc lập dân tộc gắn liền với chủ nghĩa xã hội.

Trích dẫn: HCM Toàn tập t.2, t.3, t.10–12; Đường Cách mệnh; Lênin về vấn đề dân tộc và thuộc địa. (Tài liệu lớp)

3.2. Tư tưởng về CNXH và xây dựng CNXH ở Việt Nam

CNXH theo Hồ Chí Minh: xã hội do nhân dân làm chủ; kinh tế phát triển cao dựa trên lực lượng sản xuất hiện đại và công hữu chủ yếu; phân phối theo lao động; nhà nước của dân, do dân, vì dân; văn hóa – đạo đức tiến bộ; con người được giải phóng toàn diện, ấm no, hạnh phúc.

3.2.1. Tư tưởng về Chủ nghĩa xã hội

Bản chất và mục tiêu: vì con người, do nhân dân làm chủ; làm cho “ai cũng có ăn, có mặc, được học hành”, nâng cao đời sống vật chất và tinh thần.

Kinh tế: lực lượng sản xuất hiện đại; công hữu tư liệu sản xuất chủ yếu; nhấn mạnh phát triển sản xuất là “mặt trận chính”.

Phân phối: theo lao động; “ai làm nhiều hưởng nhiều, ai không làm thì không hưởng” (trừ các trường hợp chính sách).

Chính trị: nhà nước của dân, do dân, vì dân; dân chủ gắn pháp luật và kỷ cương.

Văn hóa – con người: phát triển khoa học – kỹ thuật, văn hóa; xây dựng con người XHCN có đạo đức, năng lực, tác phong.

Trích dẫn: HCM Toàn tập t.1, t.9–10; Lênin Toàn tập t.30. (Tài liệu lớp)

3.2.2. Xây dựng CNXH ở Việt Nam

Mục tiêu chính trị: chế độ dân chủ, nhân dân làm chủ; nhà nước pháp quyền XHCN dưới sự lãnh đạo của Đảng.

Mục tiêu kinh tế: công nghiệp hóa – hiện đại hóa; phát triển lực lượng sản xuất; nhiều thành phần trong quá độ, quốc doanh giữ vai trò nền tảng.

Quản trị: thực hiện chế độ khoán, gắn lợi ích cá nhân – tập thể; phát triển khoa học – công nghệ.

Văn hóa – xã hội: nền văn hóa dân tộc, khoa học, đại chúng; công bằng xã hội; chăm lo con người, giải phóng phụ nữ.

Động lực và trở lực: phát huy lợi ích chính đáng, dân chủ, đại đoàn kết; kiên quyết chống chủ nghĩa cá nhân, tham ô, lãng phí, quan liêu.

Trích dẫn: HCM Toàn tập t.9–10; Văn kiện Đảng toàn tập; quan điểm về kinh tế nhiều thành phần thời quá độ. (Tài liệu lớp)

3.2.3. Thời kỳ quá độ lên CNXH ở Việt Nam

Tính chất: biến đổi sâu sắc, lâu dài, phức tạp; “cơn đau đẻ kéo dài” (Lênin); khó nhất ở nước nông nghiệp lạc hậu tiến thẳng lên CNXH.

Đặc điểm: xuất phát điểm thấp; tàn dư phong kiến – thực dân; chiến tranh và chia cắt (sau 1954) → hai chiến lược đồng thời Bắc – Nam.

Nhiệm vụ: cải tạo cái cũ, xây dựng cái mới về chính trị, kinh tế, văn hóa, quan hệ xã hội; xây dựng nền tảng vật chất – kỹ thuật của CNXH.

Nguyên tắc: quán triệt CN Mác–Lênin nhưng chống giáo điều; giữ vững độc lập dân tộc; đoàn kết – học hỏi quốc tế; “xây đi đôi với chống”.

Trích dẫn: HCM Toàn tập; Lênin về thời kỳ quá độ. (Tài liệu lớp)

3.3. Quan hệ giữa Độc lập dân tộc và CNXH

Độc lập dân tộc là tiền đề để đi lên CNXH; nội dung độc lập bao hàm hòa bình, thống nhất, tự do, hạnh phúc cho nhân dân.

CNXH bảo đảm vững chắc độc lập dân tộc: dân chủ, pháp quyền, phát triển toàn diện tạo nền tảng bảo vệ độc lập.

Quan hệ biện chứng: độc lập càng vững, CNXH càng thuận lợi; CNXH thắng lợi càng củng cố độc lập.

Trích dẫn: Văn kiện, HCM Toàn tập t.4, t.12. (Tài liệu lớp)

3.4. Vận dụng trong sự nghiệp cách mạng hôm nay

Kiên định mục tiêu độc lập dân tộc gắn liền với CNXH; mục tiêu “dân giàu, nước mạnh, dân chủ, công bằng, văn minh”.

Phát huy dân chủ XHCN gắn với pháp chế, quyền con người; chống lợi dụng dân chủ.

Củng cố hệ thống chính trị: Đảng trong sạch, vững mạnh; nhà nước pháp quyền của dân, do dân, vì dân.

Đấu tranh chống suy thoái, “tự diễn biến”, “tự chuyển hóa”; phòng, chống tham nhũng, lãng phí.

Kết hợp sức mạnh dân tộc – thời đại; hội nhập quốc tế chủ động, hiệu quả.

Nguồn liên hệ: Đại hội IX và sau này về động lực phát triển – đại đoàn kết toàn dân. (Tài liệu lớp)
=================`
                    }]
                }
            ]);
        }

        const history = sessions.get(sid);
        const maxHistory = 4;
        const recentHistory = history.slice(-maxHistory);

        // Add user message
        history.push({ role: "user", parts: [{ text: message }] });

        console.log("Sending to Gemini:", JSON.stringify(recentHistory, null, 2));

        // Build request for Gemini API
        const reqBody = {
            contents: history,
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 2000,
            }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody)
            }
        );

        console.log("Gemini response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API error:", errorText);
            throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Gemini response data:", JSON.stringify(data, null, 2));

        let botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!botReply) {
            console.warn("Gemini returned empty response");
            // Fallback responses based on message content
            if (lowerMessage.includes("tư tưởng") || lowerMessage.includes("hồ chí minh")) {
                botReply = "Tư tưởng Hồ Chí Minh là hệ thống quan điểm toàn diện và sâu sắc về những vấn đề cơ bản của cách mạng Việt Nam, trong đó nổi bật là tư tưởng về độc lập dân tộc gắn liền với chủ nghĩa xã hội. Theo Người, CNXH là một xã hội do nhân dân làm chủ, kinh tế phát triển, văn hóa - đạo đức tiến bộ, con người được giải phóng và có cuộc sống ấm no, hạnh phúc.";
            } else if (lowerMessage.includes("độc lập") || lowerMessage.includes("dân tộc")) {
                botReply = "Độc lập dân tộc theo tư tưởng Hồ Chí Minh không chỉ là thoát khỏi ách thống trị ngoại bang mà còn bao hàm cả hòa bình, thống nhất, tự do và hạnh phúc cho nhân dân. Độc lập dân tộc là tiền đề để xây dựng chủ nghĩa xã hội, và ngược lại, CNXH bảo đảm vững chắc cho nền độc lập dân tộc.";
            } else if (lowerMessage.includes("cnxh") || lowerMessage.includes("chủ nghĩa xã hội")) {
                botReply = "Chủ nghĩa xã hội theo Hồ Chí Minh là một xã hội: do nhân dân làm chủ; có nền kinh tế phát triển cao dựa trên lực lượng sản xuất hiện đại; thực hiện phân phối theo lao động; có nhà nước của dân, do dân, vì dân; có nền văn hóa - đạo đức tiến bộ; và con người được giải phóng toàn diện, có cuộc sống ấm no, hạnh phúc.";
            } else {
                botReply = "Xin chào! Tôi là trợ giảng môn Tư tưởng Hồ Chí Minh. Tôi có thể giúp bạn tìm hiểu về: độc lập dân tộc, chủ nghĩa xã hội, tư tưởng Hồ Chí Minh về CNXH, xây dựng CNXH ở Việt Nam, và mối quan hệ giữa độc lập dân tộc với CNXH. Bạn có câu hỏi cụ thể nào về các chủ đề này không?";
            }
        }

        // Add bot reply to history
        history.push({ role: "model", parts: [{ text: botReply }] });

        // Keep only last 10 messages to avoid context overflow
        if (history.length > 10) {
            sessions.set(sid, history.slice(-10));
        }

        res.json({ reply: botReply, sessionId: sid });
    } catch (error) {
        console.error("Chat route error:", error);

        // Friendly error response
        const errorReply = "Xin lỗi, hiện tại hệ thống đang bận. Tôi có thể giúp bạn tìm hiểu về: Tư tưởng Hồ Chí Minh, độc lập dân tộc, chủ nghĩa xã hội, và xây dựng CNXH ở Việt Nam. Bạn muốn tìm hiểu về chủ đề nào?";

        res.json({
            reply: errorReply,
            sessionId: req.body.sessionId || crypto.randomUUID()
        });
    }
});

app.listen(PORT, () => {
    console.log(`HCM Tutor Bot running on http://localhost:${PORT}`);
});