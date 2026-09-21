import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, Check, X, AlertCircle } from "lucide-react";

interface VoiceTranscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTranscription: (text: string) => void;
}

export const VoiceTranscribeModal: React.FC<VoiceTranscribeModalProps> = ({
  isOpen,
  onClose,
  onApplyTranscription,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      stopRecordingImmediate();
      setTranscribedText("");
      setErrorMessage(null);
      setRecordingDuration(0);
    }
  }, [isOpen]);

  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        clearInterval(timerIntervalRef.current);

        if (audioChunksRef.current.length === 0) {
          setErrorMessage("No audio was recorded.");
          setIsRecording(false);
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        await sendAudioToGemini(audioBlob);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Mic access failed:", err);
      setErrorMessage(
        "Microphone permission was denied or is unavailable. Please grant microphone access."
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const stopRecordingImmediate = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    clearInterval(timerIntervalRef.current);
    setIsRecording(false);
  };

  const sendAudioToGemini = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    setErrorMessage(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          const base64 = res.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(audioBlob);

      const base64Data = await base64Promise;

      const response = await fetch("/api/ai/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64: base64Data,
          mimeType: audioBlob.type || "audio/webm",
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || "Transcription failed");
      }

      setTranscribedText(json.transcription || "");
    } catch (err: any) {
      console.error("Transcription error:", err);
      setErrorMessage(
        err.message || "Failed to transcribe audio using gemini-3.5-transcribe."
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#181818] border border-zinc-800 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#ffed00]" />
            <h3 className="text-lg font-bold text-white font-serif italic">
              Voice Dictation &amp; Transcription
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Subtext */}
        <p className="text-xs sm:text-sm text-zinc-400">
          Speak your artist bio update, new project ideas, or thoughts. Audio will be
          transcribed with Google Gemini (<code className="text-[#8fff00]">gemini-3.5-transcribe</code>).
        </p>

        {/* Recording Visualizer Area */}
        <div className="flex flex-col items-center justify-center py-6 px-4 rounded-xl bg-[#121212] border border-zinc-800/80 space-y-4">
          {isRecording ? (
            <>
              <div className="relative flex items-center justify-center">
                <span className="absolute w-20 h-20 rounded-full bg-red-500/20 animate-ping" />
                <span className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg">
                  <Mic className="w-8 h-8 animate-pulse" />
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm font-mono text-red-400 font-bold uppercase tracking-wider">
                  Recording In Progress
                </p>
                <p className="text-2xl font-mono text-white font-semibold">
                  {formatSeconds(recordingDuration)}
                </p>
              </div>
              <button
                type="button"
                onClick={stopRecording}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 font-medium text-sm transition-all shadow cursor-pointer"
              >
                <Square className="w-4 h-4 text-red-500 fill-current" />
                <span>Stop &amp; Transcribe</span>
              </button>
            </>
          ) : isTranscribing ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#8fff00] animate-spin" />
              <p className="text-sm font-mono text-zinc-300">
                Transcribing audio via gemini-3.5-transcribe...
              </p>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#222] border border-[#ffed00]/40 flex items-center justify-center text-[#ffed00]">
                <Mic className="w-8 h-8" />
              </div>
              <button
                type="button"
                onClick={startRecording}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ffed00] text-black hover:bg-[#fff24d] font-bold text-sm transition-all shadow-[0_0_15px_rgba(255,237,0,0.35)] cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Start Microphone Recording</span>
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-start gap-2 p-3 text-xs rounded-lg bg-red-950/50 border border-red-800/80 text-red-300 w-full">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Transcribed text review box */}
        {transcribedText && (
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8fff00] block">
              Transcribed Text:
            </label>
            <textarea
              value={transcribedText}
              onChange={(e) => setTranscribedText(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-lg bg-[#141414] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#8fff00] transition-colors"
            />
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          {transcribedText && (
            <button
              type="button"
              onClick={() => {
                onApplyTranscription(transcribedText);
                onClose();
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold bg-[#8fff00] text-black hover:bg-[#a6ff2e] transition-colors shadow-lg"
            >
              <Check className="w-4 h-4" />
              <span>Apply to Bio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
