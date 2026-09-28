"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

const desktopVideo = "https://res.cloudinary.com/dnvltueqb/video/upload/greenhero-desktop_cci3uk.mp4";
const mobileVideo = "https://res.cloudinary.com/dnvltueqb/video/upload/v1790602541/greenhero-mobile_jcxkam.mp4";
const fallbackImage = "/images/hero-video-fallback.png";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [media, setMedia] = useState<{ source: string; reducedMotion: boolean } | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 620px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMedia = () => {
      setMedia({ source: mobile.matches ? mobileVideo : desktopVideo, reducedMotion: motion.matches });
      setReady(false);
      setFailed(false);
      setPaused(true);
    };
    updateMedia();
    mobile.addEventListener("change", updateMedia);
    motion.addEventListener("change", updateMedia);
    return () => {
      mobile.removeEventListener("change", updateMedia);
      motion.removeEventListener("change", updateMedia);
    };
  }, []);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      video.pause();
      return;
    }
    try {
      await video.play();
    } catch {
      setPaused(true);
    }
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <>
      <Image
        className="hero-image is-active"
        src={fallbackImage}
        alt="Pemandangan Green Hero Darajat dan kolam air hangat saat senja"
        fill
        priority
        sizes="100vw"
      />
      {media && !failed && (
        <video
          key={`${media.source}-${media.reducedMotion}`}
          ref={videoRef}
          className={`hero-video${ready ? " is-ready" : ""}`}
          src={media.source}
          poster={fallbackImage}
          autoPlay={!media.reducedMotion}
          muted={muted}
          loop
          playsInline
          preload={media.reducedMotion ? "none" : "auto"}
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => { setReady(true); setPaused(false); }}
          onPause={() => setPaused(true)}
          onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
          onError={() => { setFailed(true); setReady(false); setPaused(true); }}
        />
      )}
      {media && !failed && (
        <div className="hero-controls hero-video-controls" aria-label="Kontrol video">
          <button type="button" onClick={togglePlayback} aria-label={paused ? "Putar video" : "Jeda video"} title={paused ? "Putar video" : "Jeda video"}>
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <button type="button" onClick={toggleSound} aria-label={muted ? "Aktifkan suara" : "Matikan suara"} title={muted ? "Aktifkan suara" : "Matikan suara"} aria-pressed={!muted}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      )}
    </>
  );
}
