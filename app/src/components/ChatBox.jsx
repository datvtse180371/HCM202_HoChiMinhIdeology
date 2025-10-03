import { useEffect, useRef, useState } from "react";

export default function ChatBox() {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Xin chào! Tôi trả lời các câu hỏi liên quan đến chương học: Độc lập dân tộc, CNXH, v.v." }
    ]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const listRef = useRef(null);

    useEffect(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages, collapsed]);

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
        <div className={`chatbox chatbox--${collapsed ? 'collapsed' : 'open'}`} role="region" aria-label="AI Chat" >
            <div className="chatbox__header">
                {!collapsed && <div className="chatbox__title">AI Chat</div>}
                <div className="chatbox__actions">
                    <button className="btn btn--ghost btn--inline" onClick={() => setCollapsed(c => !c)} aria-pressed={collapsed} title={collapsed ? 'Mở chat' : 'Thu gọn'}>
                        {collapsed ? 'AI Chat' : 'Thu gọn'}
                    </button>
                </div>
            </div>

            {!collapsed && (
                <>
                    <div className="chatbox__list" ref={listRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`chatbox__message ${m.sender === 'user' ? 'is-user' : 'is-bot'}`}>
                                <div className="chatbox__bubble">
                                    <div className="chatbox__sender">{m.sender === 'user' ? 'Bạn' : 'Bot'}</div>
                                    <div className="chatbox__text">{m.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="chatbox__composer">
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                            placeholder="Hỏi một câu về nội dung chương... (Shift+Enter xuống dòng)"
                            rows={2}
                            className="chatbox__input"
                        />
                        <div className="chatbox__controls">
                            <button className="btn btn--primary" onClick={send} disabled={sending || !input.trim()}>
                                {sending ? 'Đang gửi...' : 'Gửi'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
