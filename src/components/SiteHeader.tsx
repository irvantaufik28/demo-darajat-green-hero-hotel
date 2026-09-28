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
            { label: "Kambing Guling", href: "/experiences/roast-goat" },
            { label: "BBQ & Grill", href: "/experiences/bbq-grill" },
            { label: "Ayam Bakar Family Set", href: "/experiences/grilled-chicken" },
          ],
        },
        {
          heading: "CELEBRATION",
          items: [
            { label: "Birthday Celebration", href: "/experiences/birthday-celebration" },
            { label: "Anniversary Setup", href: "/experiences/anniversary-setup" },
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

const resolveInteriorHref = (href: string) => href.startsWith("#") ? `/${href}` : href;

export const interiorLinks: NavLink[] = defaultLinks.map((link) => ({
  ...link,
  href: link.href === "#home" ? "/" : resolveInteriorHref(link.href),
  dropdown: link.dropdown && {
    ...link.dropdown,
    footerHref: resolveInteriorHref(link.dropdown.footerHref),
    columns: link.dropdown.columns.map((column) => ({
      ...column,
      items: column.items.map((item) => ({ ...item, href: resolveInteriorHref(item.href) })),
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
  const isNavActive = (href: string, dropdown?: NavLink["dropdown"]) =>
    activeHref === href || Boolean(dropdown?.columns.some((column) => column.items.some((item) => item.href === activeHref)));

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
              <button type="button" className={isNavActive(href, dropdown) ? "active" : undefined}>
                {label}<ChevronDown size={15} />
              </button>
              <div className="experiences-menu">
                <div className="experiences-menu-columns">
                  {dropdown.columns.map(({ heading, items }) => (
                    <div className="experiences-menu-column" key={heading}>
                      <span className="experiences-menu-heading">{heading}</span>
                      {items.map((item) => <a href={item.href} key={item.label} className={activeHref === item.href ? "active" : undefined} aria-current={activeHref === item.href ? "page" : undefined}>{item.label}</a>)}
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
          {links.map(({ label, href, dropdown }) => dropdown ? (
            <details className="mobile-experiences" key={href}>
              <summary className={isNavActive(href, dropdown) ? "active" : undefined}>{label}<ChevronDown size={16} /></summary>
              <div className="mobile-experiences-content">
                {dropdown.columns.map(({ heading, items }) => (
                  <div className="mobile-experiences-column" key={heading}>
                    <span>{heading}</span>
                    {items.map((item) => (
                      <a key={item.label} href={item.href} aria-current={activeHref === item.href ? "page" : undefined} onClick={() => setMobileMenuOpen(false)}>{item.label}</a>
                    ))}
                  </div>
                ))}
                <a className="mobile-experiences-all" href={dropdown.footerHref} onClick={() => setMobileMenuOpen(false)}>{dropdown.footerLabel}<ArrowRight size={15} /></a>
              </div>
            </details>
          ) : (
            <a key={href} href={href} aria-current={activeHref === href ? "page" : undefined} onClick={() => setMobileMenuOpen(false)}>{label}</a>
          ))}
          <a href={contactHref} aria-current={activeHref === contactHref ? "page" : undefined} onClick={() => setMobileMenuOpen(false)}>Hubungi Kami</a>
          <a href={reservationHref} aria-current={activeHref === reservationHref ? "page" : undefined} onClick={() => setMobileMenuOpen(false)}>Cek Reservasi</a>
          <a className="button button-primary" href={bookingHref} onClick={() => setMobileMenuOpen(false)}>Pesan Sekarang</a>
        </nav>
      )}
    </header>
  );
}
