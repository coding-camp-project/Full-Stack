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
    <div className="flex min-h-[82vh] flex-col justify-between">
      
      {/* CENTER */}
      <div className="relative flex flex-1 min-h-0 items-stretch">
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
            <motion.div
              key="welcome-wrapper"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex w-full items-center justify-center"
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

      {/* INPUT */}
      <ChatInput
        onSendMessage={handleSendMessage}
        loading={loading}
        voiceDisabled={aiIsResponding}
      />
    </div>
  );
}

export default ChatSection;
