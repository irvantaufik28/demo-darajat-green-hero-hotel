"use client";

import Image from "next/image";
import { ArrowRight, BedDouble, Cake, CalendarDays, Camera, CheckCircle2, ClipboardCheck, Clock3, Crown, Flower2, Heart, Info, Lamp, Mail, Moon, Palette, PenLine, Sparkles, UtensilsCrossed, Wine } from "lucide-react";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { ExperienceFooter } from "@/components/ExperienceFooter";
import { celebrationCategories } from "@/features/booking/constants/celebration-packages-data";
import { formatRoomPrice } from "@/features/rooms/constants/rooms-data";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";
import styles from "../styles/anniversary-setup.module.css";

const anniversary = celebrationCategories[1];
const highlights = [
  { key: "forTwo" },
  { key: "intimate" },
  { key: "reservation" },
];
const diningDetails = [
  { icon: Lamp, key: "lighting" },
  { icon: UtensilsCrossed, key: "tableware" },
  { icon: BedDouble, key: "setup" },
];
const stylingDetails = [
  { icon: Lamp, key: "candlelight" },
  { icon: Flower2, key: "flowers" },
  { icon: BedDouble, key: "linen" },
  { icon: Heart, key: "petals" },
];
const personalDetails = [
  { icon: PenLine, key: "name" },
  { icon: Mail, key: "message" },
  { icon: CalendarDays, key: "date" },
  { icon: Clock3, key: "time" },
  { icon: Cake, key: "cake" },
  { icon: Palette, key: "palette" },
];
const addons = [
  { icon: Cake, key: "cake" },
  { icon: Flower2, key: "floral" },
  { icon: UtensilsCrossed, key: "dinner" },
  { icon: Wine, key: "welcomeDrinks" },
  { icon: BedDouble, key: "roomDecoration" },
  { icon: Camera, key: "photoCorner" },
];
const steps = [
  { icon: ClipboardCheck, key: "selectPackage" },
  { icon: CalendarDays, key: "detail" },
  { icon: CheckCircle2, key: "addToReservation" },
];

export default function AnniversarySetupPage() {
  const { t } = useTranslations({ en, id });
  return (
    <div className={styles.page}>
      <SiteHeader links={interiorLinks} activeHref="/experiences/anniversary-setup" homeHref="/" bookingHref="/rooms" />
      <main>
        <section className={styles.hero} aria-labelledby="anniversary-title">
          <Image src="/images/anniversary-dinner-night.webp" alt={t("anniversarySetup.hero.imageAlt")} fill preload sizes="100vw" className={styles.cover} />
          <div className={styles.shade} />
          <div className={`${styles.container} ${styles.heroContent}`}>
            <span className={styles.badge}><Sparkles size={15} /> {t("anniversarySetup.badge")}</span>
            <h1 id="anniversary-title">{t("anniversarySetup.hero.title")}</h1>
            <p>{t("anniversarySetup.hero.description")}</p>
            <div className={styles.actions}>
              <a className={styles.whiteButton} href="#packages">{t("anniversarySetup.hero.selectPackage")}</a>
              <a className={styles.outlineButton} href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer">{t("anniversarySetup.hero.askAvailability")} <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="anniversary-intro-title">
          <div className={`${styles.container} ${styles.split}`}>
            <div className={styles.editorialPhoto}>
              <Image src="/images/anniversary-room-decor.webp" alt={t("anniversarySetup.intro.photoAlt")} fill sizes="(max-width: 840px) 100vw, 50vw" className={styles.cover} />
              <span className={styles.photoCaption}><Heart size={15} /> {t("anniversarySetup.intro.photoCaption")}</span>
            </div>
            <div>
              <span className={styles.eyebrow}>{t("anniversarySetup.intro.eyebrow")}</span>
              <h2 id="anniversary-intro-title">{t("anniversarySetup.intro.title")}</h2>
              <p>{anniversary.description}</p>
              <div className={styles.highlights}>{highlights.map((item, index) => <div key={item.key}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{t(`anniversarySetup.intro.highlights.${item.key}.title`)}</h3><p>{t(`anniversarySetup.intro.highlights.${item.key}.description`)}</p></div></div>)}</div>
              <a className={styles.textLink} href="#packages">{t("anniversarySetup.intro.link")} <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.tinted}`} id="packages" aria-labelledby="anniversary-packages-title">
          <div className={styles.container}>
            <div className={styles.centerHeading}><span className={styles.eyebrow}>{t("anniversarySetup.packages.eyebrow")}</span><h2 id="anniversary-packages-title">{t("anniversarySetup.packages.title")}</h2><p>{t("anniversarySetup.packages.description")}</p></div>
            <div className={styles.packages}>{anniversary.packages.map((item) => <article key={item.id} className={`${styles.packageCard}${item.popular ? ` ${styles.popular}` : ""}`}>
              {item.popular && <span className={styles.popularBadge}><Crown size={14} /> {t("anniversarySetup.packages.popularBadge")}</span>}
              <span className={styles.capacity}><Heart size={14} /> {item.capacity}</span>
              <h3>{item.name}</h3><p>{item.description}</p>
              <div className={styles.price}><strong>{formatRoomPrice(item.price)}</strong><span>{t("anniversarySetup.packages.pricePerPackage")}</span></div>
              <ul>{item.inclusions.map((inclusion) => <li key={inclusion}><CheckCircle2 size={17} /><span>{inclusion}</span></li>)}</ul>
            </article>)}</div>
            <p className={styles.note}><Info size={18} /><span>{t("anniversarySetup.packages.note")}</span></p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="anniversary-dining-title">
          <div className={`${styles.container} ${styles.split}`}>
            <div><span className={styles.eyebrow}>{t("anniversarySetup.dining.eyebrow")}</span><h2 id="anniversary-dining-title">{t("anniversarySetup.dining.title")}</h2><p>{t("anniversarySetup.dining.description")}</p>
              <div className={styles.diningDetails}>{diningDetails.map(({ icon: Icon, key }) => <div className={styles.detail} key={key}><span className={styles.icon}><Icon size={20} /></span><div><h3>{t(`anniversarySetup.dining.items.${key}.title`)}</h3><p>{t(`anniversarySetup.dining.items.${key}.description`)}</p></div></div>)}</div>
            </div>
            <div className={styles.diningPhoto}><Image src="/images/anniversary-dining.webp" alt={t("anniversarySetup.dining.photoAlt")} fill sizes="(max-width: 840px) 100vw, 50vw" className={styles.cover} /></div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="anniversary-style-title">
          <div className={styles.container}><span className={styles.eyebrow}>{t("anniversarySetup.style.eyebrow")}</span><h2 id="anniversary-style-title">{t("anniversarySetup.style.title")}</h2><p className={styles.lead}>{t("anniversarySetup.style.description")}</p>
            <div className={styles.styleGrid}>{stylingDetails.map(({ icon: Icon, key }) => <div className={styles.styleCard} key={key}><span className={styles.icon}><Icon size={22} /></span><h3>{t(`anniversarySetup.style.items.${key}.title`)}</h3><p>{t(`anniversarySetup.style.items.${key}.description`)}</p></div>)}</div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="anniversary-personal-title">
          <div className={styles.container}><div className={styles.personalPanel}><span className={styles.eyebrow}>{t("anniversarySetup.personal.eyebrow")}</span><h2 id="anniversary-personal-title">{t("anniversarySetup.personal.title")}</h2><p>{t("anniversarySetup.personal.description")}</p><div className={styles.personalGrid}>{personalDetails.map(({ icon: Icon, key }) => <div className={styles.detail} key={key}><Icon size={20} /><div><h3>{t(`anniversarySetup.personal.items.${key}.title`)}</h3><p>{t(`anniversarySetup.personal.items.${key}.description`)}</p></div></div>)}</div></div></div>
        </section>

        <section className={`${styles.section} ${styles.tinted}`} aria-labelledby="anniversary-addons-title">
          <div className={styles.container}><div className={styles.centerHeading}><h2 id="anniversary-addons-title">{t("anniversarySetup.addons.title")}</h2><p>{t("anniversarySetup.addons.description")}</p></div><div className={styles.addonGrid}>{addons.map(({ icon: Icon, key }) => <div key={key}><Icon size={24} /><h3>{t(`anniversarySetup.addons.${key}`)}</h3><p>{t("anniversarySetup.addons.subLabel")}</p></div>)}</div></div>
        </section>

        <section className={styles.quiet} aria-labelledby="anniversary-quiet-title">
          <Image src="/images/anniversary-quiet.webp" alt={t("anniversarySetup.quiet.imageAlt")} fill sizes="100vw" className={styles.cover} /><div className={styles.shade} /><div className={`${styles.container} ${styles.quietContent}`}><Moon size={28} /><h2 id="anniversary-quiet-title">{t("anniversarySetup.quiet.title")}</h2><p>{t("anniversarySetup.quiet.description")}</p></div>
        </section>

        <section className={styles.section} aria-labelledby="anniversary-order-title">
          <div className={styles.container}><div className={styles.centerHeading}><span className={styles.eyebrow}>{t("anniversarySetup.order.eyebrow")}</span><h2 id="anniversary-order-title">{t("anniversarySetup.order.title")}</h2><p>{t("anniversarySetup.order.description")}</p></div><div className={styles.steps}>{steps.map(({ icon: Icon, key }, index) => <article key={key}><div><span className={styles.icon}><Icon size={23} /></span><span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span></div><h3>{t(`anniversarySetup.order.steps.${key}.title`)}</h3><p>{t(`anniversarySetup.order.steps.${key}.description`)}</p></article>)}</div><p className={styles.orderNote}>{t("anniversarySetup.order.note")}</p></div>
        </section>

        <section className={styles.ctaSection} aria-labelledby="anniversary-cta-title"><div className={styles.container}><div className={styles.ctaPanel}><Heart size={28} /><h2 id="anniversary-cta-title">{t("anniversarySetup.cta.title")}</h2><p>{t("anniversarySetup.cta.description")}</p><div className={styles.actions}><a href="/rooms" className={styles.whiteButton}>{t("anniversarySetup.cta.bookRoom")}</a><a href="/#experiences" className={styles.outlineButton}>{t("anniversarySetup.cta.viewOther")}</a></div></div></div></section>
      </main>
      <ExperienceFooter activeHref="/experiences/anniversary-setup" />
    </div>
  );
}
