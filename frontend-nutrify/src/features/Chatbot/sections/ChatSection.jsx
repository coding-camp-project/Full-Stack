import WelcomeCard from "../components/WelcomeCard";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
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

      {/* INPUT */}
      <ChatInput onSendMessage={sendMessage} loading={loading} />
    </div>
  );
}

export default ChatSection;
