import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import WelcomeCard from "../components/WelcomeCard";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import QuickActionBar from "../components/QuickActionBar";
import SpeakingIndicator from "../components/SpeakingIndicator";
import TypingIndicator from "../components/TypingIndicator";
import useChat from "../hooks/useChat";

function ChatSection() {
  const {
    messages,
    loading,
    typing,
    sendMessage,
    messagesEndRef,
  } = useChat();

  const hasMessages = messages.length > 0;
  const latestMessage = messages[messages.length - 1];
  const aiIsResponding = Boolean(
    typing || (latestMessage?.sender === "bot" && latestMessage.streaming)
  );

  const handleSendMessage = (message) => {
    sendMessage(message);
  };

  return (
    <div className="flex h-full min-h-0 w-full max-w-full flex-1 flex-col">
      
      {/* CENTER */}
      <div className="relative flex min-h-0 flex-1 items-stretch overflow-hidden">
        <AnimatePresence mode="wait">
          {hasMessages ? (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
              className="flex w-full min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 py-3 pr-2 sm:gap-5 sm:px-2 sm:py-4 sm:pr-3"
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
            <motion.div
              key="welcome-wrapper"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex w-full min-h-0 flex-1 items-start sm:items-center justify-center overflow-y-auto px-1 py-4"
            >
              <WelcomeCard onPromptSelect={handleSendMessage} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {hasMessages && (
        <QuickActionBar
          onSelectPrompt={handleSendMessage}
          disabled={loading}
        />
      )}

      {/* INPUT – sticky at bottom */}
      <div className="sticky bottom-0 z-10 shrink-0 bg-gray-100/95 pb-1 pt-3 backdrop-blur-sm sm:pb-2 sm:pt-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          loading={loading}
          voiceDisabled={aiIsResponding}
        />
      </div>
    </div>
  );
}

export default ChatSection;
