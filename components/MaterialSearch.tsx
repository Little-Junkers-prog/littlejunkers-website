"use client";

import { useId, useState } from "react";
import { company, smsHref } from "@/lib/company";
import { materials, statusLabel, type Material } from "@/lib/materials";

const shortcuts = ["Couch", "Shingles", "Paint", "Concrete", "Batteries", "Mattress"];

function search(term: string): Material[] {
  const q = term.trim().toLowerCase();
  if (q.length < 2) return [];
  return materials.filter((m) => [m.name, ...(m.aliases ?? [])].some((word) => word.toLowerCase().includes(q) || q.includes(word.toLowerCase())));
}

// Item lookup over the dumpster material rules. The full lists are also in the
// page HTML below, so this is a shortcut, not the only way to find an answer.
export default function MaterialSearch() {
  const id = useId();
  const [term, setTerm] = useState("");
  const results = search(term);

  return (
    <div>
      <div className="search">
        <label className="zip__label" htmlFor={id}>
          What do you want to toss?
        </label>
        <input
          className="zip__input"
          id={id}
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="e.g. couch, shingles, paint"
          maxLength={40}
          autoComplete="off"
        />
        <ul className="chips" aria-label="Common items">
          {shortcuts.map((item) => (
            <li key={item}>
              <button className="chip" type="button" onClick={() => setTerm(item)}>
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div aria-live="polite">
        {results.map((item) => (
          <div className="result" key={item.name}>
            <span className={`status status--${item.status}`}>{statusLabel[item.status]}</span>
            <h3 style={{ marginTop: 8 }}>{item.name}</h3>
            {item.note ? <p className="muted">{item.note}</p> : null}
          </div>
        ))}
        {term.trim().length >= 2 && results.length === 0 ? (
          <div className="result">
            <h3>Not sure about that one</h3>
            <p className="muted">
              Text us what it is, or a photo, at <a href={smsHref}>{company.phoneDisplay}</a> and we&apos;ll tell you.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
