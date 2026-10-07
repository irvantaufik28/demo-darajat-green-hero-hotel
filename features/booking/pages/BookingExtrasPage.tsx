"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Cake,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coffee,
  Heart,
  MapPin,
  Plus,
  ShieldCheck,
  Trash2,
  UsersRound,
  UtensilsCrossed,
} from "lucide-react";
import { SiteHeader, interiorLinks } from "@/components/SiteHeader";
import { Brand } from "@/components/Brand";
import { BOOKING_DRAFT_KEY, bookingExtraPrices, bookingExtraLabels, normalizeExtraCounts, type PaidExtraId, type BookingDraft, getExtraCost, getNights } from "@/features/booking/constants/booking-data";
import { foodCategories, type FoodCategory } from "@/features/booking/constants/food-packages-data";
import FoodPackageModal from "../components/FoodPackageModal";
import CelebrationPackageModal from "../components/CelebrationPackageModal";
import { celebrationCategories, type CelebrationCategory } from "@/features/booking/constants/celebration-packages-data";
import { formatRoomPrice, getRoom } from "@/features/rooms/constants/rooms-data";
import "../styles/booking.css";
import { countSelectedRooms, getRoomSelectionTotal, serializeRoomSelection, type RoomSelection } from "@/features/rooms/constants/room-selection-data";
import { BookingRoomSelection } from "@/components/BookingRoomSelection";
import { useTranslations } from "@/lib/i18n";
import en from "../locales/en.json";
import id from "../locales/id.json";

type Props = {
  roomId: string;
  roomSelection: RoomSelection;
  initialCheckIn: string;
  initialCheckOut: string;
  initialGuests: string;
};

type Extra = {
  id: string;
  itemKey: string;
  price?: number;
  hasUnit?: boolean;
  hasNote?: boolean;
};

const roomExtras: Extra[] = [
  { id: "extra-bed", itemKey: "extraBed", price: bookingExtraPrices["extra-bed"], hasUnit: true },
  { id: "extra-person", itemKey: "extraPerson", hasNote: true, hasUnit: true },
  { id: "breakfast", itemKey: "breakfast", hasUnit: true },
  { id: "baby-cot", itemKey: "babyCot", hasNote: true },
];

const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const shortMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function stayDate(value: string, short = false) {
  const [year, month, day] = value.split("-").map(Number);
  return `${day} ${(short ? shortMonths : months)[month - 1]} ${year}`;
}

function validStay(checkIn: string, checkOut: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) return false;
  return Date.parse(`${checkOut}T00:00:00Z`) > Date.parse(`${checkIn}T00:00:00Z`);
}

export default function BookingExtrasPage({ roomId, roomSelection, initialCheckIn, initialCheckOut, initialGuests }: Props) {
  const { t } = useTranslations({ en, id });
  const room = getRoom(roomId);
  const selectionQuery = serializeRoomSelection(roomSelection);
  const totalRooms = countSelectedRooms(roomSelection);
  const hasStay = validStay(initialCheckIn, initialCheckOut);
  const checkIn = hasStay ? initialCheckIn : "2026-10-18";
  const checkOut = hasStay ? initialCheckOut : "2026-10-20";
  const nights = getNights(checkIn, checkOut);
  const guests = initialGuests || "2 Dewasa, 1 Anak";
  const [counts, setCounts] = useState<Record<string, number>>({ "extra-bed": 1 });
  const [activeCelebrationCategory, setActiveCelebrationCategory] = useState<CelebrationCategory | null>(null);
  const [activeFoodCategory, setActiveFoodCategory] = useState<FoodCategory | null>(null);
  const [requests, setRequests] = useState<Record<string, boolean>>({});
  const [specialNote, setSpecialNote] = useState("");

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(BOOKING_DRAFT_KEY);
      if (!saved) return;
      const draft = JSON.parse(saved) as BookingDraft;
      if (serializeRoomSelection(draft.roomSelection ?? [{ roomId: draft.roomId, quantity: 1 }]) === selectionQuery && draft.checkIn === checkIn && draft.checkOut === checkOut && draft.guests === guests) {
        setCounts(normalizeExtraCounts(draft.counts ?? {}));
        setRequests(Object.fromEntries(Object.entries(draft.requests ?? {}).filter(([id]) => !["cake", "birthday", "anniversary"].includes(id))));
        setSpecialNote(draft.specialNote ?? "");
      }
    } catch {
      // Ignore saved demo choices when browser storage is unavailable.
    }
  }, [selectionQuery, checkIn, checkOut, guests]);

  if (!room) return null;

  const roomTotal = getRoomSelectionTotal(roomSelection, nights);
  const paidExtras = (Object.keys(bookingExtraPrices) as PaidExtraId[]).filter((id) => counts[id] > 0);
  const extrasTotal = paidExtras.reduce((total, id) => total + getExtraCost(id, counts[id], nights), 0);
  const roomHref = `/rooms?${new URLSearchParams({ rooms: selectionQuery, checkIn, checkOut, guests })}`;

  function changeCount(id: string, delta: number) {
    setCounts((previous) => ({ ...previous, [id]: Math.max(0, Math.min(1, (previous[id] ?? 0) + delta)) }));
  }

  function toggleRequest(id: string) {
    setRequests((previous) => ({ ...previous, [id]: !previous[id] }));
  }

  function goToGuest(skipExtras: boolean) {
    const selectedCounts: Record<string, number> = skipExtras ? {} : normalizeExtraCounts(counts);
    const draft: BookingDraft = {
      roomId, roomSelection, checkIn, checkOut, guests,
      counts: selectedCounts,
      requests: skipExtras ? {} : requests,
      specialNote: skipExtras ? "" : specialNote,
    };
    try { sessionStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(draft)); } catch { /* The URL still carries priced extras. */ }
    const params = new URLSearchParams({ room: roomId, rooms: selectionQuery, checkIn, checkOut, guests });
    for (const id of Object.keys(bookingExtraPrices) as (keyof typeof bookingExtraPrices)[]) {
      if (selectedCounts[id] > 0) params.set(id, String(selectedCounts[id]));
    }
    window.location.assign(`/booking/guest-details?${params}`);
  }

  function extraCard(extra: Extra, icon?: ReactNode) {
    const count = counts[extra.id] ?? 0;
    const requested = requests[extra.id] ?? false;
    const active = extra.price ? count > 0 : requested;
    const isCompact = true;
    const base = `extras.roomAddons.items.${extra.itemKey}`;
    const name = t(`${base}.name`);
    const unit = extra.hasUnit ? t(`${base}.unit`) : undefined;
    const price = <div className="booking-extra-price">{extra.price ? formatRoomPrice(extra.price) : extra.id === "baby-cot" ? t(`${base}.priceLabel`) : "Rp —"}<span>{unit}</span></div>;
    const note = extra.id === "extra-person" && room?.id === "vip" ? t(`${base}.vipNote`) : extra.hasNote ? t(`${base}.note`) : undefined;
    const description = extra.id === "extra-bed" && room?.id === "vip"
      ? t(`${base}.vipDescription`)
      : t(`${base}.description`);
    return (
      <article className={`booking-extra-card${active ? " is-selected" : ""}`} key={extra.id}>
        <div className="booking-extra-copy">
          <div className="booking-extra-name">{icon}<h3>{name}</h3>{note && <span className="booking-extra-note">{note}</span>}{active && <span className="booking-selected"><CheckCircle2 size={15} /> {extra.price ? t("extras.roomAddons.added") : t("extras.roomAddons.requested")}</span>}</div>
          <p>{description}</p>
          {!isCompact && price}
        </div>
        <div className="booking-extra-actions">
          {isCompact && price}
          {extra.price ? count > 0 ? (
            <div className="booking-quantity">
              {extra.id === "extra-bed" ? <span className="booking-single-selected">{t("extras.roomAddons.singleUnitAdded")}</span> : null}
              <button type="button" className="booking-remove" onClick={() => setCounts((previous) => ({ ...previous, [extra.id]: 0 }))} aria-label={t("extras.roomAddons.removeAriaLabel", { name })}><Trash2 size={17} /></button>
            </div>
          ) : <button type="button" className="booking-add-button" onClick={() => changeCount(extra.id, 1)}><Plus size={17} /> {t("extras.roomAddons.add")}</button> : <button type="button" className="booking-add-button" aria-pressed={requested} onClick={() => toggleRequest(extra.id)}>{requested ? <><Check size={17} /> {t("extras.roomAddons.requested")}</> : extra.id === "baby-cot" ? t("extras.roomAddons.submit") : <><Plus size={17} /> {t("extras.roomAddons.add")}</>}</button>}
        </div>
      </article>
    );
  }

  return (
    <div className="booking-page booking-extras-page">
      <SiteHeader links={interiorLinks} activeHref="/rooms" homeHref="/" bookingHref="#booking-summary" contactHref="/contact" />
      <main className="container booking-main">
        <nav className="booking-progress" aria-label={t("progress.ariaLabel")}>
          {["progress.selectRoom", "progress.addOns", "progress.guestDetails", "progress.payment"].map((label, index) => <div className={`booking-step${index === 1 ? " is-current" : ""}${index === 0 ? " is-complete" : ""}`} key={label}><span className="booking-step-circle">{index === 0 ? <Check size={18} /> : index + 1}</span><span>{t(label)}</span></div>)}
        </nav>

        <div className="booking-intro"><span className="booking-eyebrow">{t("extras.intro.eyebrow")}</span><h1>{t("extras.intro.title")}</h1><p>{t("extras.intro.description")}</p></div>

        <div className="booking-layout">
          <div className="booking-options">
            <div className="booking-stay-banner"><div><strong><BedDouble size={20} /> {t("extras.stayBanner.roomSelection")} <span>{t("extras.stayBanner.roomCount", { count: totalRooms })}</span></strong><p><CalendarDays size={16} /> {t("extras.stayBanner.stayRange", { checkIn: stayDate(checkIn), checkOut: stayDate(checkOut), nights })}</p><p><UsersRound size={16} /> {guests}</p><BookingRoomSelection selection={roomSelection} nights={nights} /><small>{t("extras.stayBanner.roomSubtotal")} <b>{formatRoomPrice(roomTotal)}</b></small></div><a href={roomHref}>{t("extras.stayBanner.changeRoom")} <ArrowRight size={16} /></a></div>

            <section className="booking-section"><div className="booking-food-hero"><Image src="/images/outdoor-dining.webp" alt={t("extras.food.heroAlt")} fill sizes="(max-width: 840px) 100vw, 60vw" /><div><span>{t("extras.food.badge")}</span><h2>{t("extras.food.title")}</h2><p>{t("extras.food.description")}</p></div></div><div className="booking-card-list">{foodCategories.map((category) => {
              const selectedPackages = category.packages.filter((item) => counts[item.id] > 0);
              const startingPrice = Math.min(...category.packages.map((item) => item.price));
              return <button type="button" key={category.id} className={`booking-extra-card booking-food-choice${selectedPackages.length ? " is-selected" : ""}`} onClick={() => setActiveFoodCategory(category)} aria-haspopup="dialog">
                <span className="booking-extra-copy"><span className="booking-extra-name"><span className="booking-food-name">{category.name}</span>{selectedPackages.length > 0 && <span className="booking-selected"><CheckCircle2 size={15} /> {t("extras.food.added")}</span>}</span><span className="booking-food-description">{category.description}</span><span className="booking-extra-price"><small>{t("extras.food.priceFrom")}</small> {formatRoomPrice(startingPrice)}<span>{t("extras.food.perPackage")}</span></span>{selectedPackages.length > 0 && <span className="booking-food-selection">{selectedPackages.map((item) => `${item.name} × ${counts[item.id]}`).join(" · ")}</span>}</span>
                <span className="booking-add-button">{selectedPackages.length ? t("extras.food.changePackage") : t("extras.food.selectPackage")}<ChevronRight size={17} /></span>
              </button>;
            })}</div><p className="booking-section-note"><UtensilsCrossed size={17} /> {t("extras.food.note")}</p></section>

            <section className="booking-section"><div className="booking-section-title"><span>{t("extras.roomAddons.badge")}</span><h2>{t("extras.roomAddons.title")}</h2></div><div className="booking-room-grid">{roomExtras.map((extra) => extraCard(extra, extra.id === "breakfast" ? <Coffee size={21} /> : <BedDouble size={21} />))}</div></section>

            <section className="booking-section"><div className="booking-section-title is-clay"><span>{t("extras.moments.badge")}</span><h2>{t("extras.moments.title")}</h2></div><div className="booking-moment-grid">{celebrationCategories.map((category) => {
              const selectedPackage = category.packages.find((item) => counts[item.id] > 0);
              const price = selectedPackage?.price ?? Math.min(...category.packages.map((item) => item.price));
              return <button type="button" key={category.id} className={`booking-extra-card booking-moment-choice${selectedPackage ? " is-selected" : ""}`} onClick={() => setActiveCelebrationCategory(category)} aria-haspopup="dialog">
                <span className="booking-moment-top">{category.id === "birthday" ? <Cake size={22} /> : <Heart size={22} />}{selectedPackage && <span className="booking-selected"><CheckCircle2 size={15} /> {t("extras.moments.selected")}</span>}</span>
                <span className="booking-extra-copy"><span className="booking-food-name">{category.name}</span><span className="booking-food-description">{category.description}</span>{selectedPackage && <span className="booking-food-selection">{selectedPackage.name}</span>}</span>
                <span className="booking-extra-actions"><span className="booking-extra-price"><small>{selectedPackage ? t("extras.moments.priceLabel") : t("extras.moments.priceFrom")}</small> {formatRoomPrice(price)}<span>{t("extras.moments.perPackage")}</span></span><span className="booking-add-button">{selectedPackage ? t("extras.moments.changePackage") : t("extras.moments.selectPackage")}<ChevronRight size={17} /></span></span>
              </button>;
            })}</div></section>

            <section className="booking-request-section"><div className="booking-section-title"><span>{t("extras.requests.badge")}</span><h2>{t("extras.requests.title")}</h2><p>{t("extras.requests.description")}</p></div><div className="booking-request-grid">{[{ id: "early", labelKey: "extras.requests.earlyCheckIn", icon: <Clock3 size={23} /> }, { id: "late", labelKey: "extras.requests.lateCheckOut", icon: <Clock3 size={23} /> }].map((item) => <div className="booking-request-card" key={item.id}><div>{item.icon}<span><strong>{t(item.labelKey)}</strong><small>{requests[item.id] ? t("extras.requests.requestSubmitted") : t("extras.requests.statusByRequest")}</small></span></div><button type="button" aria-pressed={!!requests[item.id]} onClick={() => toggleRequest(item.id)}>{requests[item.id] ? t("extras.requests.cancel") : t("extras.requests.submitRequest")}</button></div>)}</div><label className="booking-note-label" htmlFor="booking-special-note">{t("extras.requests.noteLabel")}</label><textarea id="booking-special-note" rows={3} value={specialNote} onChange={(event) => setSpecialNote(event.target.value)} placeholder={t("extras.requests.notePlaceholder")} /></section>
          </div>

          <aside className="booking-summary" id="booking-summary"><div className="booking-summary-header"><h2>{t("extras.summary.title")}</h2><span>{t("extras.summary.step")}</span></div><div className="booking-summary-stay"><strong>{t("extras.summary.stayLine", { count: totalRooms, nights })}</strong><span><CalendarDays size={16} /> {stayDate(checkIn, true)} – {stayDate(checkOut, true)}</span><span><UsersRound size={16} /> {guests}</span></div><div className="booking-summary-cost"><h3>{t("extras.summary.costTitle")}</h3><BookingRoomSelection selection={roomSelection} nights={nights} /><div className="booking-summary-row"><span>{t("extras.summary.roomSubtotal", { count: totalRooms, nights })}</span><strong>{formatRoomPrice(roomTotal)}</strong></div><div className="booking-summary-addons"><h4>{t("extras.summary.addonsTitle")}</h4>{paidExtras.length ? paidExtras.map((id) => <div className="booking-summary-row" key={id}><span>{bookingExtraLabels[id]} {id === "extra-bed" ? t("extras.summary.extraBedUnit", { nights }) : t("extras.summary.countUnit", { count: counts[id] })}</span><strong>{formatRoomPrice(getExtraCost(id, counts[id], nights))}</strong></div>) : <p>{t("extras.summary.noPaidOptions")}</p>}{Object.values(requests).some(Boolean) && <p>{t("extras.summary.otherRequests")}</p>}</div><div className="booking-summary-total"><span><strong>{t("extras.summary.estimatedTotal")}</strong><small>{t("extras.summary.taxIncluded")}</small></span><strong>{formatRoomPrice(roomTotal + extrasTotal)}</strong></div></div><div className="booking-summary-actions"><button type="button" className="button button-primary" onClick={() => goToGuest(false)}>{t("extras.summary.continue")} <ArrowRight size={18} /></button><button type="button" onClick={() => goToGuest(true)}>{t("extras.summary.skip")}</button></div><div className="booking-trust"><ShieldCheck size={19} /><span>{t("extras.summary.trust")}</span></div></aside>
        </div>
      </main>
      {activeCelebrationCategory && <CelebrationPackageModal key={activeCelebrationCategory.id} category={activeCelebrationCategory} counts={counts} onClose={() => setActiveCelebrationCategory(null)} onSave={(selection) => { setCounts((previous) => normalizeExtraCounts({ ...previous, ...selection })); setActiveCelebrationCategory(null); }} />}
      {activeFoodCategory && <FoodPackageModal key={activeFoodCategory.id} category={activeFoodCategory} counts={counts} onClose={() => setActiveFoodCategory(null)} onSave={(selection) => { setCounts((previous) => ({ ...previous, ...selection })); setActiveFoodCategory(null); }} />}
      <footer className="booking-footer theme-footer"><div className="container booking-footer-inner"><div className="booking-footer-grid"><div className="booking-footer-about"><Brand href="/" /><p>{t("footer.about")}</p><span><MapPin size={17} /> {t("footer.address")}</span></div><div><strong>{t("footer.navTitle")}</strong><a href="/">{t("footer.navAbout")}</a><a href="/rooms">{t("footer.navRooms")}</a><a href="/#location">{t("footer.navRouteGuide")}</a><a href="/rooms">{t("footer.navReservationPolicy")}</a></div><div><strong>{t("footer.helpTitle")}</strong><a href="/contact">{t("footer.helpContact")}</a><a href="/contact">{t("footer.helpPrivacy")}</a><a href="/contact">{t("footer.helpFaq")}</a></div></div><div className="booking-footer-bottom"><span>{t("footer.copyright")}</span><a href="/rooms">{t("footer.backToRooms")} <ChevronRight size={15} /></a></div></div></footer>
    </div>
  );
}
