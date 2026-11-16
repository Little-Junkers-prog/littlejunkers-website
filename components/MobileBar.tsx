import { smsHref, telHref } from "@/lib/company";
import { BookLink } from "./ZipContext";

export default function MobileBar() {
  return (
    <div className="mobile-bar on-dark" role="group" aria-label="Contact and booking">
      <a className="btn btn--secondary" href={telHref}>
        Call
      </a>
      <a className="btn btn--secondary" href={smsHref}>
        Text
      </a>
      <BookLink className="btn btn--primary">Book</BookLink>
    </div>
  );
}
