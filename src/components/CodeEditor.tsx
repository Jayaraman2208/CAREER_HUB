import { useRef } from "react";

export default function CodeEditor({
  value,
  onChange,
  height = "320px",
}: {
  value: string;
  onChange: (v: string) => void;
  height?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = ref.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const next = value.slice(0, start) + "    " + value.slice(end);
      onChange(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      });
    }
  }

  const lines = value.split("\n").length;

  return (
    <div
      className="flex overflow-hidden rounded-xl border border-white/10 bg-[#0a0c16]"
      style={{ height }}
    >
      <div
        aria-hidden
        className="select-none overflow-hidden bg-black/30 px-3 py-3 text-right font-mono text-xs leading-6 text-slate-600"
      >
        {Array.from({ length: lines }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        spellCheck={false}
        className="code-editor flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-6 text-slate-100 outline-none"
      />
    </div>
  );
}
