"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

type WhatsAppCopyButtonProps = {
  message: string;
};

export function WhatsAppCopyButton({ message }: WhatsAppCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyMessage() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copyMessage}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      <Copy className="h-4 w-4" aria-hidden="true" />
      {copied ? "Copied" : "Copy WhatsApp Message"}
    </button>
  );
}
