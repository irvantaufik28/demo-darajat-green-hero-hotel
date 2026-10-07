"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { Brand } from "./Brand";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations } from "@/lib/i18n";
import en from "./locales/en.json";
import id from "./locales/id.json";

export type NavLink = {
  /** i18n key under "nav" (e.g. "home") used to resolve the label. */
  labelKey: string;
  href: string;
  dropdown?: {
    columns: { headingKey: string; items: { labelKey: string; href: string }[] }[];
    footerKey: string;
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
  { labelKey: "nav.home", href: "#home" },
  { labelKey: "nav.rooms", href: "/rooms" },
  { labelKey: "nav.facilities", href: "/facilities" },
  {
    labelKey: "nav.experiences",
    href: "#experiences",
    dropdown: {
      columns: [
        {
          headingKey: "experiencesMenu.dining",
          items: [
            { labelKey: "experiencesMenu.roastGoat", href: "/experiences/roast-goat" },
            { labelKey: "experiencesMenu.bbqGrill", href: "/experiences/bbq-grill" },
            { labelKey: "experiencesMenu.grilledChicken", href: "/experiences/grilled-chicken" },
          ],
        },
        {
          headingKey: "experiencesMenu.celebration",
          items: [
            { labelKey: "experiencesMenu.birthdayCelebration", href: "/experiences/birthday-celebration" },
            { labelKey: "experiencesMenu.anniversarySetup", href: "/experiences/anniversary-setup" },
            { labelKey: "experiencesMenu.roomDecoration", href: "#experiences" },
          ],
        },
      ],
      footerKey: "experiencesMenu.viewAll",
      footerHref: "#experiences",
    },
  },
  { labelKey: "nav.gallery", href: "/gallery" },
];

const resolveInteriorHref = (href: string) => (href.startsWith("#") ? `/${href}` : href);

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
  const { t } = useTranslations({ en, id });
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
        <nav className="desktop-nav" aria-label={t("aria.mainNav")}>
          {links.map(({ labelKey, href, dropdown }) => dropdown ? (
            <div className="nav-dropdown" key={href}>
              <button type="button" className={isNavActive(href, dropdown) ? "active" : undefined}>
                {t(labelKey)}<ChevronDown size={15} />
              </button>
              <div className="experiences-menu">
                <div className="experiences-menu-columns">
                  {dropdown.columns.map(({ headingKey, items }) => (
                    <div className="experiences-menu-column" key={headingKey}>
                      <span className="experiences-menu-heading">{t(headingKey)}</span>
                      {items.map((item) => <a href={item.href} key={item.labelKey} className={activeHref === item.href ? "active" : undefined} aria-current={activeHref === item.href ? "page" : undefined}>{t(item.labelKey)}</a>)}
                    </div>
                  ))}
                </div>
                <a className="experiences-menu-footer" href={dropdown.footerHref}>
                  {t(dropdown.footerKey)}<ArrowRight size={16} />
                </a>
              </div>
            </div>
          ) : (
            <a key={href} className={activeHref === href ? "active" : undefined} href={href}>{t(labelKey)}</a>
          ))}
        </nav>
        <div className="header-actions">
          <a className={activeHref === contactHref ? "contact-link is-active" : "contact-link"} href={contactHref} aria-current={activeHref === contactHref ? "page" : undefined}>{t("actions.contact")}</a>
          <span className="language-switcher-slot"><LanguageSwitcher /></span>
          <a className="button button-quiet reservation-link" href={reservationHref} aria-current={activeHref === reservationHref ? "page" : undefined}>{t("actions.checkReservation")}</a>
          <a className="button button-primary reserve-link" href={bookingHref}>{t("actions.bookNow")}</a>
        </div>
        {!transparentHeader && <button
          className="menu-button"
          type="button"
          aria-label={mobileMenuOpen ? t("aria.closeMenu") : t("aria.openMenu")}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>}
      </div>
      {!transparentHeader && mobileMenuOpen && (
        <nav className="mobile-nav" id="site-mobile-nav" aria-label={t("aria.mobileNav")}>
          {links.map(({ labelKey, href, dropdown }) => dropdown ? (
            <details className="mobile-experiences" key={href}>
              <summary className={isNavActive(href, dropdown) ? "active" : undefined}>{t(labelKey)}<ChevronDown size={16} /></summary>
              <div className="mobile-experiences-content">
                {dropdown.columns.map(({ headingKey, items }) => (
                  <div className="mobile-experiences-column" key={headingKey}>
                    <span>{t(headingKey)}</span>
                    {items.map((item) => (
                      <a key={item.labelKey} href={item.href} aria-current={activeHref === item.href ? "page" : undefined} onClick={() => setMobileMenuOpen(false)}>{t(item.labelKey)}</a>
                    ))}
                  </div>
                ))}
                <a className="mobile-experiences-all" href={dropdown.footerHref} onClick={() => setMobileMenuOpen(false)}>{t(dropdown.footerKey)}<ArrowRight size={15} /></a>
              </div>
            </details>
          ) : (
            <a key={href} href={href} aria-current={activeHref === href ? "page" : undefined} onClick={() => setMobileMenuOpen(false)}>{t(labelKey)}</a>
          ))}
          <a href={contactHref} aria-current={activeHref === contactHref ? "page" : undefined} onClick={() => setMobileMenuOpen(false)}>{t("actions.contact")}</a>
          <a href={reservationHref} aria-current={activeHref === reservationHref ? "page" : undefined} onClick={() => setMobileMenuOpen(false)}>{t("actions.checkReservation")}</a>
          <a className="button button-primary" href={bookingHref} onClick={() => setMobileMenuOpen(false)}>{t("actions.bookNow")}</a>
        </nav>
      )}
    </header>
  );
}
