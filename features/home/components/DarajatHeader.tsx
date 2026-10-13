"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { contactDetails } from "@/features/contact/constants/contact-data";
import { useLang } from "@/lib/i18n";
import { darajatCopy } from "../constants/darajat-copy";

export function DarajatWordmark() {
  return (
    <Link className="dp-wordmark" href="/" aria-label="Hotel Darajat Pass - Beranda">
      <Image src="/images/darajat-pass-logo.png" alt="Hotel Darajat Pass" width={1448} height={1086} sizes="(max-width: 620px) 88px, 104px" />
    </Link>
  );
}

export function DarajatHeader({ interior = false, solid = false, bookingHref }: { interior?: boolean; solid?: boolean; bookingHref?: string }) {
  const [lang] = useLang();
  const copy = darajatCopy[lang];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const links = ["/", "/rooms", "/facilities", "/contact", "/gallery"];
  const bookingLink = bookingHref ?? (interior ? "/#booking" : "#booking");

  useEffect(() => {
    if (solid) return;
    const update = () => setScrolled(window.scrollY > 36);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [solid]);

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        menuButton.current?.focus();
        setOpen(false);
      }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);

  return <header className={`dp-header${solid || scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`} ref={header}>
    <div className="dp-header-inner">
      <div className="dp-header-top">
        <div className="dp-header-language"><LanguageSwitcher /></div>
        <DarajatWordmark />
        <div className="dp-header-actions">
          <a className="dp-reservation-link" href="/reservation-check">{copy.reservation}</a>
          <a className="dp-button dp-gold dp-header-book" href={bookingLink}>{copy.book}</a>
          <button className="dp-menu-toggle" ref={menuButton} type="button" aria-expanded={open} aria-controls="darajat-mobile-nav" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />} {open ? copy.close : copy.menu}
          </button>
        </div>
      </div>
      <nav className="dp-desktop-nav" aria-label={lang === "id" ? "Navigasi utama" : "Main navigation"}>
        {copy.nav.map((label, i) => <Link key={label} href={links[i]}>{label}</Link>)}
      </nav>
    </div>
    {open && <nav className="dp-mobile-nav" id="darajat-mobile-nav" aria-label={lang === "id" ? "Navigasi seluler" : "Mobile navigation"}>
      {copy.nav.map((label, i) => <Link key={label} href={links[i]} onClick={() => setOpen(false)}>{label}</Link>)}
      <a href="/reservation-check">{copy.reservation}</a>
      <a className="dp-button dp-gold" href={bookingLink} onClick={() => setOpen(false)}>{copy.book}</a>
    </nav>}
  </header>;
}

export function DarajatFooter() {
  const [lang] = useLang();
  const copy = darajatCopy[lang];

  return <footer className="dp-footer"><div className="dp-container">
    <div className="dp-footer-grid">
      <div className="dp-footer-about"><DarajatWordmark /><p>{copy.footerBody}</p><strong><span />{copy.footerHours}</strong></div>
      <nav aria-label={copy.footerNavTitle}><h2>{copy.footerNavTitle}</h2><Link href="/">{copy.nav[0]}</Link><Link href="/rooms">{copy.nav[1]}</Link><Link href="/facilities">{copy.nav[2]}</Link><Link href="/gallery">{copy.nav[4]}</Link><Link href="/contact">Contact Us</Link><Link href="/reservation-check">{copy.reservation}</Link></nav>
      <nav aria-label={copy.footerExperienceTitle}><h2>{copy.footerExperienceTitle}</h2>{copy.footerExperiences.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
      <div className="dp-footer-contact"><h2>{copy.footerContactTitle}</h2><span><MapPin size={17} />{copy.address}</span><a href={contactDetails.phoneHref}><Phone size={17} />{contactDetails.phone}</a><a href={`mailto:${contactDetails.email}`}><Mail size={17} />{contactDetails.email}</a><a href="https://darajatpass.com/" target="_blank" rel="noreferrer">{copy.official} →</a></div>
    </div>
    <div className="dp-footer-bottom"><span>{copy.copyright}</span><span>{copy.demo}</span></div>
  </div></footer>;
}
