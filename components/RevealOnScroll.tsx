"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Progressive enhancement for supporting sections, not booking controls.
 * Content is visible in server-rendered HTML and without JavaScript.
 * Only sections BELOW the first viewport are briefly staged for reveal.
 * Reduced-motion preference and unsupported browsers show everything.
 */
export default function RevealOnScroll({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = element.current;
    if (!node || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (node.getBoundingClientRect().top <= window.innerHeight * 0.88) return;
    node.classList.add("experience-reveal--pending");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.classList.add("experience-reveal--visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px 60px 0px", threshold: 0.05 },
    );

    observer.observe(node);

    const revealOnFocus = () => {
      node.classList.add("experience-reveal--visible");
      observer.disconnect();
    };
    node.addEventListener("focusin", revealOnFocus);
    return () => {
      node.classList.add("experience-reveal--visible");
      node.removeEventListener("focusin", revealOnFocus);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={element} className={`experience-reveal ${className}`.trim()}>
      {children}
    </div>
  );
}
