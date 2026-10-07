"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  checkIn: string;
  checkOut: string;
  minDate: string;
  language: "id" | "en";
  label: string;
  checkInLabel: string;
  checkOutLabel: string;
  placeholder: string;
  onChange: (checkIn: string, checkOut: string) => void;
};

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(value: string, language: Props["language"]) {
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  }).format(parseDate(value));
}

export default function StayDateRangePicker({ checkIn, checkOut, minDate, language, label, checkInLabel, checkOutLabel, placeholder, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => parseDate(checkIn || minDate).getUTCMonth());
  const [year, setYear] = useState(() => parseDate(checkIn || minDate).getUTCFullYear());
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function changeMonth(delta: number) {
    const next = new Date(Date.UTC(year, month + delta, 1));
    setYear(next.getUTCFullYear());
    setMonth(next.getUTCMonth());
  }

  function chooseDate(value: string) {
    if (!checkIn || checkOut || value <= checkIn) {
      onChange(value, "");
    } else {
      onChange(checkIn, value);
      setOpen(false);
    }
  }

  const first = new Date(Date.UTC(year, month, 1));
  const startOffset = (first.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const weekdays = Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, index + 1))));
  const monthLabel = new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(first);
  const currentMonth = minDate.slice(0, 7);

  return (
    <div className="rooms-date-range" ref={root}>
      <span className="rooms-date-range-label"><CalendarDays size={16} /> {label}</span>
      <button type="button" className="rooms-date-range-trigger" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen((value) => !value)}>
        <span>{checkIn ? formatDate(checkIn, language) : checkInLabel}</span>
        <span className="rooms-date-range-divider">–</span>
        <span>{checkOut ? formatDate(checkOut, language) : checkOutLabel}</span>
      </button>
      {open && <div className="rooms-date-range-popover" role="dialog" aria-label={label}>
        <div className="rooms-date-range-heading">
          <button type="button" aria-label={language === "id" ? "Bulan sebelumnya" : "Previous month"} disabled={`${year}-${String(month + 1).padStart(2, "0")}` <= currentMonth} onClick={() => changeMonth(-1)}><ChevronLeft size={18} /></button>
          <strong>{monthLabel}</strong>
          <button type="button" aria-label={language === "id" ? "Bulan berikutnya" : "Next month"} onClick={() => changeMonth(1)}><ChevronRight size={18} /></button>
        </div>
        <p>{placeholder}</p>
        <div className="rooms-date-range-grid">
          {weekdays.map((day, index) => <span className="rooms-date-range-weekday" key={index}>{day}</span>)}
          {Array.from({ length: startOffset }, (_, index) => <span key={`blank-${index}`} />)}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const value = dateKey(new Date(Date.UTC(year, month, index + 1)));
            const selected = value === checkIn || value === checkOut;
            return <button type="button" key={value} className={`${selected ? "is-selected" : ""}${checkIn && checkOut && value > checkIn && value < checkOut ? " is-in-range" : ""}`} disabled={value < minDate} aria-pressed={selected} aria-label={formatDate(value, language)} onClick={() => chooseDate(value)}>{index + 1}</button>;
          })}
        </div>
      </div>}
    </div>
  );
}
