import WelcomeCard from "../components/WelcomeCard";
import ChatInput from "../components/ChatInput";

function ChatSection() {
  return (
    <div className="flex min-h-[82vh] flex-col justify-between">
      
      {/* CENTER */}
      <div className="flex flex-1 items-center justify-center">
        <WelcomeCard />
      </div>

      {/* INPUT */}
      <ChatInput />
    </div>
  );
}

export default ChatSection;