import { useCallback, useEffect, useRef, useState } from "react";

const getSpeechRecognition = () => {
  if (typeof window === "undefined") return null;

  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

const getPermissionErrorMessage = (permissionError) => {
  if (permissionError?.name === "NotAllowedError") {
    return "Microphone permission was denied.";
  }

  if (permissionError?.name === "NotFoundError") {
    return "No microphone device was found.";
  }

  return "Unable to access the microphone.";
};

function useSpeechRecognition({ onTranscriptChange } = {}) {
  const recognitionRef = useRef(null);
  const restartTimerRef = useRef(null);
  const shouldListenRef = useRef(false);
  const finalTranscriptRef = useRef("");
  const mediaStreamRef = useRef(null);
  const transcriptRef = useRef("");
  const onTranscriptChangeRef = useRef(onTranscriptChange);

  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange;
  }, [onTranscriptChange]);

  const updateTranscript = useCallback((nextTranscript) => {
    if (transcriptRef.current === nextTranscript) return;

    transcriptRef.current = nextTranscript;
    setTranscript(nextTranscript);
    onTranscriptChangeRef.current?.(nextTranscript);
  }, []);

  const stopMicrophoneStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = "";
    updateTranscript("");
  }, [updateTranscript]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    window.clearTimeout(restartTimerRef.current);
    restartTimerRef.current = null;
    setListening(false);
    stopMicrophoneStream();

    try {
      recognitionRef.current?.stop();
    } catch {
      recognitionRef.current?.abort();
    }
  }, [stopMicrophoneStream]);

  const startListening = useCallback(
    async (language = "id-ID") => {
      const SpeechRecognition = getSpeechRecognition();

      if (!SpeechRecognition) {
        setError("Speech recognition is not supported in this browser.");
        return;
      }

      setError("");
      shouldListenRef.current = true;

      try {
        if (navigator.mediaDevices?.getUserMedia) {
          mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
        }
      } catch (permissionError) {
        shouldListenRef.current = false;
        setListening(false);
        setError(getPermissionErrorMessage(permissionError));
        return;
      }

      const recognition = recognitionRef.current || new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === "en-US" ? "en-US" : "id-ID";

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onresult = (event) => {
        let interimTranscript = "";

        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const spokenText = event.results[index][0].transcript;

          if (event.results[index].isFinal) {
            finalTranscriptRef.current = `${finalTranscriptRef.current} ${spokenText}`.trim();
          } else {
            interimTranscript += spokenText;
          }
        }

        updateTranscript(`${finalTranscriptRef.current} ${interimTranscript}`.trim());
      };

      recognition.onerror = (event) => {
        if (event.error === "no-speech") return;

        shouldListenRef.current = false;
        setListening(false);
        setError(`Speech recognition error: ${event.error}`);
        stopMicrophoneStream();
      };

      recognition.onend = () => {
        setListening(false);

        if (!shouldListenRef.current) {
          stopMicrophoneStream();
          return;
        }

        restartTimerRef.current = window.setTimeout(() => {
          try {
            recognition.start();
          } catch {
            setListening(false);
          }
        }, 220);
      };

      try {
        recognition.start();
      } catch {
        setListening(true);
      }
    },
    [stopMicrophoneStream, updateTranscript],
  );

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
}

export default useSpeechRecognition;
