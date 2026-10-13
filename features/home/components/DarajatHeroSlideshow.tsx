"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { darajatMedia } from "../constants/darajat-media";

const slideDuration = 5500;

export function DarajatHeroSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;

    const updateTimer = () => {
      window.clearInterval(timer);
      timer = undefined;
      if (!reducedMotion.matches && document.visibilityState === "visible") {
        timer = window.setInterval(() => {
          setActiveIndex((current) => (current + 1) % darajatMedia.hero.length);
        }, slideDuration);
      }
    };

    updateTimer();
    reducedMotion.addEventListener("change", updateTimer);
    document.addEventListener("visibilitychange", updateTimer);
    return () => {
      window.clearInterval(timer);
      reducedMotion.removeEventListener("change", updateTimer);
      document.removeEventListener("visibilitychange", updateTimer);
    };
  }, []);

  return (
    <div className="dp-hero-slideshow" aria-hidden="true">
      {darajatMedia.hero.map((src, index) => (
        <Image
          key={src}
          className={`dp-hero-slide${index === activeIndex ? " is-active" : ""}`}
          src={src}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
        />
      ))}
    </div>
  );
}
