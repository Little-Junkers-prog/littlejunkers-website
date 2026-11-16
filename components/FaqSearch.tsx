"use client";

import { useId, useState } from "react";

// Filters the FAQ accordions already in the page. Every answer stays in the
// HTML whether or not this runs.
export default function FaqSearch() {
  const id = useId();
  const [count, setCount] = useState<number | null>(null);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const q = event.target.value.trim().toLowerCase();
    const items = document.querySelectorAll<HTMLDetailsElement>("#faq-groups details[data-faq]");
    let shown = 0;
    items.forEach((item) => {
      const match = q.length < 2 || (item.dataset.faq ?? "").includes(q);
      item.hidden = !match;
      item.open = q.length >= 2 && match;
      if (match) shown += 1;
    });
    document.querySelectorAll<HTMLElement>("#faq-groups [data-faq-group]").forEach((group) => {
      group.hidden = group.querySelectorAll("details[data-faq]:not([hidden])").length === 0;
    });
    setCount(q.length < 2 ? null : shown);
  }

  return (
    <div className="search">
      <label className="zip__label" htmlFor={id}>
        Search the questions
      </label>
      <input className="zip__input" id={id} type="search" onChange={onChange} placeholder="e.g. weight, driveway, permit" maxLength={40} autoComplete="off" />
      <p className="fine" aria-live="polite">
        {count === null ? "" : count === 0 ? "No match. Call or text us and we'll answer it." : `${count} matching ${count === 1 ? "answer" : "answers"}`}
      </p>
    </div>
  );
}
