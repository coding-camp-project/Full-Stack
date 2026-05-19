import {
  SendHorizontal,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import logo from "../../../assets/logo/Logo 2.png";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import ListeningIndicator from "./ListeningIndicator";
import VoiceButton from "./VoiceButton";

function ChatInput({
  onSendMessage,
  onVoiceStart,
  loading = false,
  voiceDisabled = false,
}) {
  const [message, setMessage] = useState("");
  const {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    error,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (voiceDisabled && listening) {
      stopListening();
    }
  }, [voiceDisabled, listening, stopListening]);

  const handleVoiceToggle = () => {
    if (voiceDisabled) return;

    if (listening) {
      stopListening();
      return;
    }

    resetTranscript();
    onVoiceStart?.();
    startListening("id-ID");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || loading) return;

    stopListening();
    onSendMessage?.(trimmedMessage);
    setMessage("");
    resetTranscript();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="relative mx-auto mt-10 flex w-full max-w-325 items-center rounded-full border border-[#222]/30 bg-white px-5 py-3 shadow-sm transition-all duration-300 focus-within:border-[#49AE84]/50 focus-within:shadow-[0_14px_40px_rgba(73,174,132,0.14)]"
    >
      <AnimatePresence>
        {listening && <ListeningIndicator />}
      </AnimatePresence>

      
      {/* LEFT */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        
        <img
          src={logo}
          alt="logo"
          className="h-8.5 w-8.5 shrink-0 object-contain"
        />

        <input
          type="text"
          placeholder="ask anything!"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="w-full min-w-0 border-none bg-transparent text-[15px] text-[#333] outline-none placeholder:text-[#999]"
        />
      </div>

      {/* RIGHT */}
      <div className="ml-auto flex items-center gap-4">
        
        <VoiceButton
          listening={listening}
          error={error}
          disabled={voiceDisabled}
          onClick={handleVoiceToggle}
        />

        <motion.button
          type="submit"
          disabled={loading || !message.trim()}
          whileHover={!loading && message.trim() ? { scale: 1.06 } : undefined}
          whileTap={!loading && message.trim() ? { scale: 0.94 } : undefined}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:bg-black/30 disabled:hover:scale-100"
        >
          <SendHorizontal size={20} />
        </motion.button>
      </div>
    </motion.form>
  );
}

export default ChatInput;
