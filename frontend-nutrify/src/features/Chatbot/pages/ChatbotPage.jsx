import ChatSection from "../sections/ChatSection";

function ChatbotPage() {
  return (
    <div className="flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-6 lg:max-w-[1360px] lg:mx-auto">
      <ChatSection />
    </div>
  );
}

export default ChatbotPage;