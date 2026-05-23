import { useCallback, useEffect, useRef, useState } from "react";
import chatbotService from "../services/chatbotService";

const createMessage = (sender, message, extra = {}) => ({
  id: `${sender}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  sender,
  message,
  ...extra,
});

const splitReplyIntoChunks = (reply) => {
  const chunks = reply.match(/.{1,18}(\s|$)/g);

  return chunks?.map((chunk) => chunk.trimStart()).filter(Boolean) || [reply];
};

const wait = (duration) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const [conversationId, setConversationId] = useState("");
  const messagesEndRef = useRef(null);

  const lastScrollTimeRef = useRef(0);

  const scrollToLatest = useCallback((behavior = "smooth", force = false) => {
    const now = Date.now();
    // Throttle automatic scroll during streaming to once every 150ms to prevent layout thrashing on mobile
    if (!force && behavior === "auto" && now - lastScrollTimeRef.current < 150) {
      return;
    }
    lastScrollTimeRef.current = now;

    messagesEndRef.current?.scrollIntoView({
      behavior,
      block: "end",
    });
  }, []);

  useEffect(() => {
    const isStreaming = messages.some((msg) => msg.streaming);
    scrollToLatest(isStreaming ? "auto" : "smooth", !isStreaming);
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
        const data = await chatbotService.sendChatMessage({
          message: trimmedMessage,
          conversationId,
        });
        const reply = data?.reply || "Sorry, I could not read the response.";
        const botMessage = createMessage("bot", "", { streaming: true });

        if (data?.conversationId) {
          setConversationId(data.conversationId);
        }

        setTyping(false);
        setMessages((currentMessages) => [
          ...currentMessages,
          botMessage,
        ]);

        let renderedReply = "";

        for (const chunk of splitReplyIntoChunks(reply)) {
          renderedReply = `${renderedReply}${chunk}`;

          setMessages((currentMessages) =>
            currentMessages.map((currentMessage) =>
              currentMessage.id === botMessage.id
                ? { ...currentMessage, message: renderedReply }
                : currentMessage
            )
          );

          await wait(28);
        }

        setMessages((currentMessages) =>
          currentMessages.map((currentMessage) =>
            currentMessage.id === botMessage.id
              ? { ...currentMessage, message: reply, streaming: false }
              : currentMessage
          )
        );
      } catch (requestError) {
        const errorMessage =
          requestError?.response?.data?.message ||
          requestError?.message ||
          "Gagal terhubung ke Nutrify AI saat ini.";

        setError(errorMessage);
        setMessages((currentMessages) => [
          ...currentMessages,
          createMessage("bot", "Maaf, sistem Nutrify AI sedang mengalami gangguan. Tolong kirim ulang pesan Anda kembali."),
        ]);
      } finally {
        setLoading(false);
        setTyping(false);
      }
    },
    [conversationId, loading],
  );

  return {
    messages,
    loading,
    typing,
    error,
    conversationId,
    sendMessage,
    messagesEndRef,
    scrollToLatest,
  };
}

export default useChat;
