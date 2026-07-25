import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Mic, Paperclip, X } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string, monthlyRequests: number) => void;
  disabled?: boolean;
}

const DEFAULT_MONTHLY = 30_000;

const ACCEPTED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
  "text/plain",
]);

const ACCEPT_ATTR = ".png,.jpg,.jpeg,.webp,.pdf,.txt,image/png,image/jpeg,image/webp,application/pdf,text/plain";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionResultEventLike = {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function isAcceptedFile(file: File): boolean {
  if (ACCEPTED_TYPES.has(file.type)) return true;
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".webp") ||
    name.endsWith(".pdf") ||
    name.endsWith(".txt")
  );
}

export function PromptInput({ onSubmit, disabled }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [monthlyRequests, setMonthlyRequests] = useState(DEFAULT_MONTHLY);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechSupported] = useState(() => getSpeechRecognitionCtor() !== null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  // TODO(Checkpoint 2+): wire attachedFile into the analyze request payload once
  // the backend accepts file/context attachments. Do not change FinalReport or
  // App.tsx fetch signature until Member C defines the contract.
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachPreviewUrl, setAttachPreviewUrl] = useState<string | null>(null);
  const [attachError, setAttachError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!attachedFile || !attachedFile.type.startsWith("image/")) {
      setAttachPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(attachedFile);
    setAttachPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [attachedFile]);

  function handleSubmit(event?: FormEvent) {
    event?.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) {
      setValidationError("Paste a prompt before running the analysis.");
      return;
    }
    setValidationError(null);
    // attachedFile is held in local state only until API support lands (see TODO above).
    void attachedFile;
    onSubmit(trimmed, monthlyRequests);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }

  function toggleListening() {
    if (!speechSupported || disabled) return;

    if (listening) {
      stopListening();
      return;
    }

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    setSpeechError(null);
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalChunk += result[0].transcript;
        }
      }
      if (finalChunk) {
        setPrompt((prev) => {
          const needsSpace = prev.length > 0 && !/\s$/.test(prev);
          return prev + (needsSpace ? " " : "") + finalChunk.trim();
        });
        if (validationError) setValidationError(null);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setSpeechError("Microphone permission denied. Enable it in browser settings.");
      } else if (event.error !== "aborted") {
        setSpeechError("Voice input stopped unexpectedly. Try again.");
      }
      setListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
    } catch {
      setSpeechError("Could not start voice input. Try again.");
      setListening(false);
      recognitionRef.current = null;
    }
  }

  function applyFile(file: File | undefined) {
    if (!file) {
      setAttachError("No file selected.");
      return;
    }
    if (!isAcceptedFile(file)) {
      setAttachError("Unsupported file type. Use png, jpg, jpeg, webp, pdf, or txt.");
      return;
    }
    setAttachError(null);
    setAttachedFile(file);
  }

  function clearAttachment() {
    setAttachedFile(null);
    setAttachError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) setIsDragging(true);
  }

  function onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    applyFile(event.dataTransfer.files?.[0]);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-[720px] flex-col gap-5"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink-muted">Your prompt</span>

        {attachedFile ? (
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-paper-elevated px-3 py-2">
            {attachPreviewUrl ? (
              <img
                src={attachPreviewUrl}
                alt=""
                className="h-9 w-9 rounded-lg object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-xs font-semibold text-accent">
                {attachedFile.name.split(".").pop()?.slice(0, 3).toUpperCase()}
              </span>
            )}
            <span className="min-w-0 flex-1 truncate text-sm text-ink">
              {attachedFile.name}
            </span>
            <button
              type="button"
              onClick={clearAttachment}
              className="transition-ui flex h-7 w-7 items-center justify-center rounded-lg text-ink-muted hover:bg-white/[0.08] hover:text-ink"
              aria-label="Remove attachment"
              title="Remove attachment"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        ) : null}

        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`transition-ui relative rounded-2xl border bg-paper-elevated shadow-[var(--shadow-card)] focus-within:border-accent/40 focus-within:shadow-[var(--shadow-glow)] ${
            isDragging
              ? "border-accent/60 bg-accent-soft"
              : validationError
                ? "border-warn/40"
                : "border-white/[0.08]"
          }`}
        >
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (validationError) setValidationError(null);
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={8}
            placeholder="Paste the prompt you send to your LLM today…"
            className="w-full resize-y rounded-2xl border-0 bg-transparent px-4 pb-14 pt-4 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-muted/50 disabled:opacity-60"
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? "prompt-error" : undefined}
          />

          <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT_ATTR}
                className="hidden"
                onChange={(e) => applyFile(e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                title="Attach file"
                aria-label="Attach file"
                className="transition-ui flex h-9 w-9 items-center justify-center rounded-xl text-ink-muted hover:bg-white/[0.08] hover:text-accent disabled:opacity-40"
              >
                <Paperclip className="h-4 w-4" strokeWidth={2} />
              </button>

              <button
                type="button"
                onClick={toggleListening}
                disabled={disabled || !speechSupported}
                title={
                  speechSupported
                    ? listening
                      ? "Stop voice input"
                      : "Start voice input"
                    : "Voice input not supported in this browser"
                }
                aria-label={
                  speechSupported
                    ? listening
                      ? "Stop voice input"
                      : "Start voice input"
                    : "Voice input not supported in this browser"
                }
                aria-pressed={listening}
                className={`transition-ui flex h-9 w-9 items-center justify-center rounded-xl disabled:cursor-not-allowed disabled:opacity-40 ${
                  listening
                    ? "animate-mic-pulse bg-accent text-paper"
                    : "text-ink-muted hover:bg-white/[0.08] hover:text-accent"
                }`}
              >
                <Mic className="h-4 w-4" strokeWidth={2} />
              </button>

              {listening ? (
                <span className="flex items-center gap-1.5 pl-1 text-xs font-medium text-accent">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft"
                    aria-hidden
                  />
                  Listening…
                </span>
              ) : null}
            </div>

            <p className="hidden text-[11px] text-ink-muted/70 sm:block">
              Ctrl+Enter to submit
            </p>
          </div>
        </div>

        {attachError ? (
          <p className="text-xs text-warn" role="status">
            {attachError}
          </p>
        ) : null}
        {speechError ? (
          <p className="text-xs text-warn" role="status">
            {speechError}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-muted">
            Est. requests / month
          </span>
          <input
            type="number"
            min={1}
            step={1000}
            value={monthlyRequests}
            disabled={disabled}
            onChange={(e) =>
              setMonthlyRequests(Math.max(1, Number(e.target.value) || 1))
            }
            className="transition-ui w-40 rounded-xl border border-white/[0.08] bg-paper-elevated px-3.5 py-2.5 text-ink outline-none focus:border-accent/40 focus:shadow-[var(--shadow-glow)] disabled:opacity-60"
          />
        </label>

        <button
          type="submit"
          disabled={disabled}
          className="transition-ui min-w-[180px] rounded-xl bg-accent px-6 py-3 text-[15px] font-semibold text-paper hover:-translate-y-px hover:brightness-110 hover:shadow-[var(--shadow-glow)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          Analyze prompt
        </button>
      </div>

      {validationError ? (
        <p
          id="prompt-error"
          role="alert"
          className="text-sm font-medium text-warn"
        >
          {validationError}
        </p>
      ) : null}
    </form>
  );
}
