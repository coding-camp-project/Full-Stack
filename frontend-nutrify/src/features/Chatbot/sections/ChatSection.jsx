import { useState, useRef, useEffect } from "react";
import axios from "axios";
import WelcomeCard from "../components/WelcomeCard";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import logo from "../../../assets/logo/Logo 2.png";

function ChatSection() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (text) => {
    const userMessage = { sender: "user", message: text };
    
    // Add user message to history
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        { messages: updatedMessages },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const botReply = { sender: "bot", message: response.data.reply };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Gagal mengirim pesan ke chatbot:", error);
      const errorReply = { 
        sender: "bot", 
        message: error.response?.data?.message || "Maaf, terjadi masalah koneksi dengan asisten AI Nutrify. Silakan coba kembali." 
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[82vh] flex-col justify-between max-w-[950px] mx-auto">
      
      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <WelcomeCard onPromptClick={handleSendMessage} />
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <ChatMessage 
                key={index}
                sender={msg.sender}
                message={msg.message}
              />
            ))}
            
            {/* AI TYPING INDICATOR */}
            {loading && (
              <div className="flex w-full justify-start">
                <div className="flex max-w-[75%] items-end gap-3 flex-row">
                  <div className="flex h-10.5 w-10.5 items-center justify-center rounded-full bg-[#E8FFF4]">
                    <img
                      src={logo}
                      alt="bot"
                      className="h-6.5 w-6.5 object-contain"
                    />
                  </div>
                  <div className="rounded-[22px] px-5 py-4 bg-white text-gray-500 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1.5 py-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="px-4 pb-4 bg-transparent shrink-0">
        <ChatInput onSend={handleSendMessage} loading={loading} />
      </div>
    </div>
  );
}

export default ChatSection;