import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(1);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const TELEGRAM_LINK = "https://t.me/+-fHV5Ev0oTc5ODFk";

  const openChat = () => {
    setOpen(true);
    setUnread(0);
  };

  const goToTelegram = () => {
    window.open(TELEGRAM_LINK, "_blank");
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    let botResponse = "Hi, how can I help you?";
    if (
      input.toLowerCase().includes("hi") ||
      input.toLowerCase().includes("hello")
    ) {
      botResponse = "Hi, how can I help you?";
    } else {
      botResponse =
        "Thanks for your message! You can reach out to us on Telegram for further help.";
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={openChat}
        className="fixed right-4 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-[9999] w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition"
      >
        <MessageCircle size={26} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed right-2 sm:right-6 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-[9999] max-w-full sm:w-80 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-green-500 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">Support Bot</span>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div
            className="flex-1 p-4 overflow-y-auto space-y-2"
            style={{ maxHeight: "300px" }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${
                  msg.sender === "bot"
                    ? "bg-gray-200 text-gray-800 self-start"
                    : "bg-green-500 text-white self-end"
                } px-3 py-2 rounded-xl max-w-[70%]`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={sendMessage}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
            >
              Send
            </button>
          </div>

          {/* Telegram Button */}
          {messages.some(
            (msg) => msg.sender === "bot" && msg.text.includes("Telegram")
          ) && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={goToTelegram}
                className="w-full bg-green-500 text-white rounded-full py-2 hover:bg-green-600 transition"
              >
                Chat on Telegram
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}