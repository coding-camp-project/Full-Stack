import { useCallback, useEffect, useMemo, useState } from "react";

const getSpeechSynthesis = () => {
  if (typeof window === "undefined") return null;

  return window.speechSynthesis || null;
};

const voiceMatchesLanguage = (voice, language) =>
  voice.lang?.toLowerCase().startsWith(language.toLowerCase().slice(0, 2));

function useSpeechSynthesis(defaultLanguage = "id-ID") {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [voicesLoading, setVoicesLoading] = useState(true);
  const [error, setError] = useState("");

  const supportedVoices = useMemo(
    () => voices.filter((voice) => voiceMatchesLanguage(voice, "id-ID") || voiceMatchesLanguage(voice, "en-US")),
    [voices],
  );

  const stopSpeaking = useCallback(() => {
    const synthesis = getSpeechSynthesis();

    if (!synthesis) return;

    synthesis.cancel();
    setSpeaking(false);
  }, []);

  const loadVoices = useCallback(() => {
    const synthesis = getSpeechSynthesis();

    if (!synthesis) {
      setVoicesLoading(false);
      setError("Speech synthesis is not supported in this browser.");
      return;
    }

    const availableVoices = synthesis.getVoices();
    setVoices(availableVoices);
    setVoicesLoading(availableVoices.length === 0);

    if (availableVoices.length > 0) {
      setSelectedVoice((currentVoice) => {
        if (currentVoice) return currentVoice;

        return (
          availableVoices.find((voice) => voice.lang === defaultLanguage) ||
          availableVoices.find((voice) => voiceMatchesLanguage(voice, defaultLanguage)) ||
          availableVoices.find((voice) => voiceMatchesLanguage(voice, "en-US")) ||
          availableVoices[0]
        );
      });
    }
  }, [defaultLanguage]);

  const speak = useCallback(
    (text, options = {}) => {
      const synthesis = getSpeechSynthesis();
      const cleanText = text?.trim();

      if (!synthesis || !cleanText) return;

      const language = options.language || defaultLanguage;
      const voice =
        options.voice ||
        selectedVoice ||
        voices.find((availableVoice) => availableVoice.lang === language) ||
        voices.find((availableVoice) => voiceMatchesLanguage(availableVoice, language)) ||
        voices.find((availableVoice) => voiceMatchesLanguage(availableVoice, "en-US"));

      synthesis.cancel();
      setError("");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = voice?.lang || language;
      utterance.voice = voice || null;
      utterance.rate = options.rate || 0.95;
      utterance.pitch = options.pitch || 1;

      utterance.onstart = () => {
        setSpeaking(true);
      };

      utterance.onend = () => {
        setSpeaking(false);
      };

      utterance.onerror = (event) => {
        setSpeaking(false);
        setError(`Speech synthesis error: ${event.error}`);
      };

      synthesis.speak(utterance);
    },
    [defaultLanguage, selectedVoice, voices],
  );

  useEffect(() => {
    const synthesis = getSpeechSynthesis();

    loadVoices();

    if (!synthesis) return undefined;

    synthesis.addEventListener?.("voiceschanged", loadVoices);
    synthesis.onvoiceschanged = loadVoices;

    return () => {
      synthesis.removeEventListener?.("voiceschanged", loadVoices);

      if (synthesis.onvoiceschanged === loadVoices) {
        synthesis.onvoiceschanged = null;
      }

      synthesis.cancel();
    };
  }, [loadVoices]);

  return {
    voices,
    supportedVoices,
    selectedVoice,
    setSelectedVoice,
    voicesLoading,
    speaking,
    speak,
    stopSpeaking,
    error,
  };
}

export default useSpeechSynthesis;
