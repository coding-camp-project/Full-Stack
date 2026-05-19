import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import WelcomeCard from "../components/WelcomeCard";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import QuickActionBar from "../components/QuickActionBar";
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
  const aiIsResponding = Boolean(
    typing || speaking || (latestMessage?.sender === "bot" && latestMessage.streaming)
  );

  useEffect(() => {
    if (!latestMessage || latestMessage.sender !== "bot") return;
    if (latestMessage.streaming) return;
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
        <AnimatePresence mode="wait">
          {hasMessages ? (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
              className="flex max-h-[62vh] w-full flex-col gap-5 overflow-y-auto scroll-smooth px-2 py-4 pr-3"
            >
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  sender={message.sender}
                  message={message.message}
                  streaming={message.streaming}
                />
              ))}

              <AnimatePresence>
                {typing && <TypingIndicator />}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </motion.div>
          ) : (
            <WelcomeCard key="welcome" onPromptSelect={handleSendMessage} />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {speaking && <SpeakingIndicator onStop={stopSpeaking} />}
      </AnimatePresence>

      {hasMessages && (
        <QuickActionBar
          onSelectPrompt={handleSendMessage}
          disabled={loading}
        />
      )}

      {/* INPUT */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onVoiceStart={stopSpeaking}
        loading={loading}
        voiceDisabled={aiIsResponding}
      />
    </div>
  );
}

export default ChatSection;
