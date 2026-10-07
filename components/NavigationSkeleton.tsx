"use client";

import { useEffect } from "react";
import PageSkeleton from "./PageSkeleton";

export function showNavigationSkeleton() {
  document.documentElement.classList.add("site-is-navigating");
  window.setTimeout(() => document.documentElement.classList.remove("site-is-navigating"), 15000);
}

export function navigateWithSkeleton(url: string, replace = false) {
  showNavigationSkeleton();
  window.setTimeout(() => {
    if (replace) window.location.replace(url);
    else window.location.assign(url);
  }, 50);
}

export default function NavigationSkeleton() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target && anchor.target !== "_self" || anchor.hasAttribute("download")) return;
      const target = new URL(anchor.href, window.location.href);
      if (target.origin !== window.location.origin || target.href === window.location.href) return;
      if (target.pathname === window.location.pathname && target.search === window.location.search) return;
      event.preventDefault();
      navigateWithSkeleton(target.href);
    }
    function onPageShow() { document.documentElement.classList.remove("site-is-navigating"); }
    document.addEventListener("click", onClick);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return <div className="site-navigation-skeleton" aria-hidden="true"><PageSkeleton /></div>;
}
