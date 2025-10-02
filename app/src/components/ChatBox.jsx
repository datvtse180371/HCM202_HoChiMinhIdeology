import { useState } from "react";

export default function ChatBox() {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Xin chào! Tôi trả lời các câu hỏi liên quan đến chương học: Độc lập dân tộc, CNXH, v.v." }
    ]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);

    async function send() {
        const text = input.trim();
        if (!text) return;
        setMessages(m => [...m, { sender: "user", text }]);
        setInput("");
        setSending(true);

        try {
            const resp = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });
            const data = await resp.json();
            setMessages(m => [...m, { sender: "bot", text: data.reply }]);
        } catch (err) {
            setMessages(m => [...m, { sender: "bot", text: "Lỗi kết nối tới server." }]);
        } finally {
            setSending(false);
        }
    }

    return (
        <div
            className="chatbox"
            style={{
                border: "1px solid #ddd",
                padding: 12,
                borderRadius: 8,
                width: 1200,            
                margin: "20px auto"    
            }}
        >
            <div
                style={{
                    height: 300,       
                    overflow: "auto",
                    marginBottom: 8
                }}
            >
                {messages.map((m, i) => (
                    <div key={i} style={{ margin: "6px 0" }}>
                        <strong style={{ color: m.sender === "user" ? "#0a66ff" : "#111" }}>
                            {m.sender === "user" ? "Bạn" : "Bot"}
                        </strong>
                        <div>{m.text}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && send()}
                    style={{ flex: 1 }}
                />
                <button onClick={send} disabled={sending || !input.trim()}>
                    {sending ? "..." : "Gửi"}
                </button>
            </div>
        </div>
    );
}
