import { bookingUrl, smsHref, telHref } from "@/lib/company";

export default function MobileBar() {
  return (
    <div className="mobile-bar on-dark" role="group" aria-label="Contact and booking">
      <a className="btn btn--secondary" href={telHref}>
        Call
      </a>
      <a className="btn btn--secondary" href={smsHref}>
        Text
      </a>
      <a className="btn btn--primary" href={bookingUrl()}>
        Book
      </a>
    </div>
  );
}
