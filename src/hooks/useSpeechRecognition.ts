import { useEffect, useRef, useState } from "react";

import { getSpeechRecognitionConstructor } from "@/services/speechRecognition";
import type { BrowserSpeechRecognition } from "@/services/speechRecognition";
import { getSpeechLocale } from "@/utils/language";
import type { LanguageCode } from "@/types/translation";

type UseSpeechRecognitionOptions = {
  sourceLang: LanguageCode;
  onTranscript: (value: string) => void;
  onStateChange?: (value: string) => void;
};

export function useSpeechRecognition({ sourceLang, onTranscript, onStateChange }: UseSpeechRecognitionOptions) {
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionCtor) {
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = getSpeechLocale(sourceLang);
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = () => {
      setIsListening(true);
      onStateChange?.("Listening");
    };
    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
      onStateChange?.("Idle");
    };
    recognition.onerror = (event) => {
      setError(event.error);
      onStateChange?.("Mic error");
    };
    recognition.onresult = (event) => {
      let finalTranscript = "";
      let nextInterimTranscript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += text;
        } else {
          nextInterimTranscript += text;
        }
      }

      setInterimTranscript(nextInterimTranscript);

      if (finalTranscript.trim()) {
        setError(null);
        onTranscript(finalTranscript.trim());
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onStateChange, onTranscript, sourceLang]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = getSpeechLocale(sourceLang);
    }
  }, [sourceLang]);

  function startListening() {
    if (!recognitionRef.current || isListening) {
      return;
    }

    setError(null);
    recognitionRef.current.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
  }

  return {
    error,
    interimTranscript,
    isListening,
    startListening,
    stopListening,
  };
}
