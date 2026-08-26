"use client";

import { Check, Copy, MessageCircle } from "lucide-react";
import { useState } from "react";

type WhatsAppCopyButtonProps = {
  message: string;
  phone?: string;
};

export function WhatsAppCopyButton({ message, phone }: WhatsAppCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyMessage() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const cleanPhone = phone ? phone.replace(/[^0-9]/g, "") : "";
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <div className="inline-flex items-center gap-1.5">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[8px] border border-emerald-300 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
      >
        <MessageCircle className="h-4 w-4 text-emerald-600" aria-hidden="true" />
        <span>WhatsApp</span>
      </a>
      <button
        type="button"
        onClick={copyMessage}
        title="Copy WhatsApp reminder message"
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[8px] border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span className="text-emerald-700">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}
