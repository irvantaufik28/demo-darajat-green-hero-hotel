"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Globe2, Menu, X } from "lucide-react";
import { Brand } from "./Brand";

export type NavLink = {
  label: string;
  href: string;
  dropdown?: {
    columns: { heading: string; items: { label: string; href: string }[] }[];
    footerLabel: string;
    footerHref: string;
  };
};

type SiteHeaderProps = {
  revealOnScroll?: boolean;
  id?: string;
  links?: NavLink[];
  activeHref?: string;
  contactHref?: string;
  bookingHref?: string;
  reservationHref?: string;
  homeHref?: string;
};

export const defaultLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Kamar & Suite", href: "/rooms" },
  { label: "Fasilitas", href: "/facilities" },
  {
    label: "Experiences",
    href: "#experiences",
    dropdown: {
      columns: [
        {
          heading: "DINING",
          items: [
            { label: "Kambing Guling", href: "#experiences" },
            { label: "BBQ & Grill", href: "#experiences" },
            { label: "Ayam Bakar Family Set", href: "#experiences" },
          ],
        },
        {
          heading: "CELEBRATION",
          items: [
            { label: "Birthday Celebration", href: "#experiences" },
            { label: "Anniversary Setup", href: "#experiences" },
            { label: "Room Decoration", href: "#experiences" },
          ],
        },
      ],
      footerLabel: "Lihat Semua Experiences",
      footerHref: "#experiences",
    },
  },
  { label: "Galeri", href: "/gallery" },
];

export const interiorLinks: NavLink[] = defaultLinks.map((link) => ({
  ...link,
  href: link.href === "#home" ? "/" : link.href.startsWith("#") ? `/${link.href}` : link.href,
  dropdown: link.dropdown && {
    ...link.dropdown,
    footerHref: `/${link.dropdown.footerHref}`,
    columns: link.dropdown.columns.map((column) => ({
      ...column,
      items: column.items.map((item) => ({ ...item, href: `/${item.href}` })),
    })),
  },
}));

export function SiteHeader({
  revealOnScroll = false,
  id = "home",
  links = defaultLinks,
  activeHref = "#home",
  contactHref = "/contact",
  bookingHref = "#booking",
  reservationHref = "/reservation-check",
  homeHref = "#home",
}: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!revealOnScroll) return;
    const updateVisibility = () => {
      const visible = window.scrollY > 32;
      setScrolled(visible);
      if (!visible) setMobileMenuOpen(false);
    };
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, [revealOnScroll]);

  const transparentHeader = revealOnScroll && !scrolled;

  return (
    <header
      className={`site-header${revealOnScroll ? " site-header-reveal" : ""}${transparentHeader ? " is-transparent" : ""}`}
      id={id}
    >
      <div className="header-inner">
        <Brand href={homeHref} />
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {links.map(({ label, href, dropdown }) => dropdown ? (
            <div className="nav-dropdown" key={href}>
              <a className={activeHref === href ? "active" : undefined} href={href}>
                {label}<ChevronDown size={15} />
              </a>
              <div className="experiences-menu">
                <div className="experiences-menu-columns">
                  {dropdown.columns.map(({ heading, items }) => (
                    <div className="experiences-menu-column" key={heading}>
                      <span className="experiences-menu-heading">{heading}</span>
                      {items.map((item) => <a href={item.href} key={item.label}>{item.label}</a>)}
                    </div>
                  ))}
                </div>
                <a className="experiences-menu-footer" href={dropdown.footerHref}>
                  {dropdown.footerLabel}<ArrowRight size={16} />
                </a>
              </div>
            </div>
          ) : (
            <a key={href} className={activeHref === href ? "active" : undefined} href={href}>{label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <a className={activeHref === contactHref ? "contact-link is-active" : "contact-link"} href={contactHref} aria-current={activeHref === contactHref ? "page" : undefined}>Hubungi Kami</a>
          <span className="language-pill"><Globe2 size={17} /> ID</span>
          <a className="button button-quiet reservation-link" href={reservationHref} aria-current={activeHref === reservationHref ? "page" : undefined}>Cek Reservasi</a>
          <a className="button button-primary reserve-link" href={bookingHref}>Pesan Sekarang</a>
        </div>
        {!transparentHeader && <button
          className="menu-button"
          type="button"
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>}
      </div>
      {!transparentHeader && mobileMenuOpen && (
        <nav className="mobile-nav" id="site-mobile-nav" aria-label="Navigasi seluler">
          {links.map(({ label, href }) => (
            <a key={href} href={href} onClick={() => setMobileMenuOpen(false)}>{label}</a>
          ))}
          <a href={contactHref} aria-current={activeHref === contactHref ? "page" : undefined} onClick={() => setMobileMenuOpen(false)}>Hubungi Kami</a>
          <a href={reservationHref} aria-current={activeHref === reservationHref ? "page" : undefined} onClick={() => setMobileMenuOpen(false)}>Cek Reservasi</a>
          <a className="button button-primary" href={bookingHref} onClick={() => setMobileMenuOpen(false)}>Pesan Sekarang</a>
        </nav>
      )}
    </header>
  );
}
