import { smsHref, telHref } from "@/lib/company";
import Link from "next/link";

export default function MobileBar() {
  return (
    <div className="mobile-bar on-dark" role="group" aria-label="Contact and booking">
      <a className="btn btn--secondary" href={telHref}>
        Call
      </a>
      <a className="btn btn--secondary" href={smsHref}>
        Text
      </a>
      <Link className="btn btn--primary" href="/plan">Prices</Link>
    </div>
  );
}
