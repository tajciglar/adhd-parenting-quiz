import { useState, useRef, useCallback, type KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  childName?: string;
}

export default function ChatInput({
  onSend,
  disabled,
  childName,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, []);

  const placeholder = childName
    ? `Ask Harbor anything about ${childName}...`
    : "Ask Harbor anything...";

  return (
    <div className="border-t border-harbor-text/10 bg-white px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleInput();
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-harbor-text/15 px-4 py-3 text-harbor-text placeholder:text-harbor-text/30 focus:outline-none focus:border-harbor-accent transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="shrink-0 w-11 h-11 rounded-xl bg-harbor-accent text-white flex items-center justify-center transition-all hover:bg-harbor-accent-light disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
