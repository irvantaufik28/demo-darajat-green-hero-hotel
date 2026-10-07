"use client";

import { useEffect, useRef, useState } from "react";
import { Globe2, Check } from "lucide-react";
import { LANGUAGES, useLang, type Lang } from "@/lib/i18n";

export function LanguageSwitcher() {
  const [lang, setLang] = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const current = LANGUAGES.find((item) => item.code === lang) ?? LANGUAGES[0];

  function choose(code: Lang) {
    setLang(code);
    setOpen(false);
  }

  return (
    <div className="language-switcher" ref={ref}>
      <button
        type="button"
        className="language-pill"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.label}`}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe2 size={17} /> {current.short}
      </button>
      {open && (
        <div className="language-menu" role="listbox" aria-label="Select language">
          {LANGUAGES.map((item) => (
            <button
              key={item.code}
              type="button"
              role="option"
              aria-selected={item.code === lang}
              className={item.code === lang ? "language-menu__item is-active" : "language-menu__item"}
              onClick={() => choose(item.code)}
            >
              <span className="language-menu__badge">{item.short}</span>
              <span className="language-menu__label">{item.label}</span>
              {item.code === lang && <Check size={15} className="language-menu__check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
