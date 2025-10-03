import { useEffect, useRef, useState } from "react";

export default function ChatBox() {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Xin chào! Tôi trả lời các câu hỏi liên quan đến chương học: Độc lập dân tộc, CNXH, v.v." }
    ]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const listRef = useRef(null);
    const textareaRef = useRef(null);

    // autoscroll when messages change
    useEffect(() => {
        if (!listRef.current) return
        // small timeout to allow DOM update
        const t = setTimeout(() => {
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
        }, 50)
        return () => clearTimeout(t)
    }, [messages])

    // auto-resize textarea
    const resizeTextarea = () => {
        const ta = textareaRef.current
        if (!ta) return
        ta.style.height = 'auto'
        const max = 160 // px
        ta.style.height = Math.min(ta.scrollHeight, max) + 'px'
    }

    useEffect(() => {
        resizeTextarea()
    }, [input])

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
        <>
            {collapsed ? (
                <div className="chatbox-toggle" role="button" tabIndex={0} onClick={() => setCollapsed(false)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setCollapsed(false) }} aria-label="Mở chat" title="Mở chat">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path d="M12 3C7.03 3 3 6.58 3 11C3 13.04 3.87 15 5.3 16.46L4 21L8.73 19.6C10.05 20.36 11.49 20.77 13 20.77C17.97 20.77 22 17.19 22 12.77C22 8.35 17.97 3 12 3Z" fill="currentColor"/>
                    </svg>
                </div>
            ) : (
                <div className={`chatbox chatbox--open`} role="region" aria-label="AI Chat" >
                    <div className="chatbox__header">
                        <div className="chatbox__title">AI Chat</div>
                        <div className="chatbox__actions">
                            <button
                                className="btn btn--ghost btn--inline"
                                onClick={() => setCollapsed(true)}
                                aria-label="Thu gọn chat"
                            >
                                Thu gọn
                            </button>
                        </div>
                    </div>

                    <div className="chatbox__list" ref={listRef} role="log" aria-live="polite">
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
                            ref={textareaRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                            placeholder="Hỏi một câu về nội dung chương... (Shift+Enter xuống dòng)"
                            rows={2}
                            className="chatbox__input"
                            aria-label="Nhập câu hỏi"
                        />
                        <div className="chatbox__controls">
                            <button className="btn btn--primary" onClick={send} disabled={sending || !input.trim()} aria-label="Gửi tin nhắn">
                                {sending ? 'Đang gửi...' : 'Gửi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
