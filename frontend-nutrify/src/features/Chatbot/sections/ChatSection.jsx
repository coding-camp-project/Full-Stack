import { useEffect, useRef } from "react";

import WelcomeCard from "../components/WelcomeCard";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import SpeakingIndicator from "../components/SpeakingIndicator";
import TypingIndicator from "../components/TypingIndicator";
import useChat from "../hooks/useChat";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";

function ChatSection() {
  const {
    messages,
    loading,
    typing,
    sendMessage,
    messagesEndRef,
  } = useChat();
  const {
    speaking,
    speak,
    stopSpeaking,
  } = useSpeechSynthesis("id-ID");
  const lastSpokenMessageIdRef = useRef(null);

  const hasMessages = messages.length > 0;
  const latestMessage = messages[messages.length - 1];

  useEffect(() => {
    if (!latestMessage || latestMessage.sender !== "bot") return;
    if (latestMessage.id === lastSpokenMessageIdRef.current) return;

    lastSpokenMessageIdRef.current = latestMessage.id;
    speak(latestMessage.message);
  }, [latestMessage, speak]);

  const handleSendMessage = (message) => {
    stopSpeaking();
    sendMessage(message);
  };

  return (
    <div className="flex min-h-[82vh] flex-col justify-between">
      
      {/* CENTER */}
      <div className={`flex flex-1 ${hasMessages ? "min-h-0 items-stretch" : "items-center justify-center"}`}>
        {hasMessages ? (
          <div className="flex max-h-[62vh] w-full flex-col gap-5 overflow-y-auto px-2 py-4 pr-3">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                sender={message.sender}
                message={message.message}
              />
            ))}

            {typing && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <WelcomeCard />
        )}
      </div>

      {speaking && <SpeakingIndicator onStop={stopSpeaking} />}

      {/* INPUT */}
      <ChatInput
        onSendMessage={handleSendMessage}
        loading={loading}
        voiceDisabled={speaking}
      />
    </div>
  );
}

export default ChatSection;
