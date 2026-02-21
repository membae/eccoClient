import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(1);

  const TELEGRAM_LINK = "https://t.me/@PMemba"; // replace with yours

  const openChat = () => {
    setOpen(true);
    setUnread(0);
  };

  const goToTelegram = () => {
    window.open(TELEGRAM_LINK, "_blank");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={openChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition"
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
        <div className="fixed bottom-24 right-6 w-72 bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-green-500 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">Support Bot</span>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            <p className="text-sm text-gray-600 text-center">
              For instant help, continue on Telegram
            </p>

            <button
              onClick={goToTelegram}
              className="w-full bg-green-500 text-white rounded-full py-2 hover:bg-green-600 transition"
            >
              Chat on Telegram
            </button>
          </div>
        </div>
      )}
    </>
  );
}