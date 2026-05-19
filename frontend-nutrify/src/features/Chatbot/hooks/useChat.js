import { useCallback, useEffect, useRef, useState } from "react";

import { sendChatMessage } from "../services/chatbotService";

const createMessage = (sender, message) => ({
  id: `${sender}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  sender,
  message,
});

function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToLatest = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  useEffect(() => {
    scrollToLatest();
  }, [messages, typing, scrollToLatest]);

  const sendMessage = useCallback(
    async (rawMessage) => {
      const trimmedMessage = rawMessage.trim();

      if (!trimmedMessage || loading) return;

      setError("");
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("user", trimmedMessage),
      ]);
      setLoading(true);
      setTyping(true);

      try {
        const data = await sendChatMessage(trimmedMessage);
        const reply = data?.reply || "Sorry, I could not read the response.";

        setMessages((currentMessages) => [
          ...currentMessages,
          createMessage("bot", reply),
        ]);
      } catch (requestError) {
        const errorMessage =
          requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to reach Nutrify AI right now.";

        setError(errorMessage);
        setMessages((currentMessages) => [
          ...currentMessages,
          createMessage("bot", "Sorry, I could not connect to Nutrify AI. Please try again."),
        ]);
      } finally {
        setLoading(false);
        setTyping(false);
      }
    },
    [loading],
  );

  return {
    messages,
    loading,
    typing,
    error,
    sendMessage,
    messagesEndRef,
    scrollToLatest,
  };
}

export default useChat;
