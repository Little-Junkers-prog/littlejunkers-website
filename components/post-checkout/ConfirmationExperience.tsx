import Link from "next/link";
import styles from "./ConfirmationExperience.module.css";

export type VerifiedBookingSummary = {
  dumpster: string;
  rentalLength?: string;
  deliveryDate?: string;
  pickupDate?: string;
  bookingReference?: string;
};

type ConfirmationExperienceProps = {
  // A real booking must come from a server-verified paid/finalized record.
  // Never populate this from untrusted URL params or browser state.
  booking: VerifiedBookingSummary;
  isDesignPreview?: boolean;
};

function CheckIcon() {
  return (
    <svg width="31" height="31" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="m7 16 6 6L25 9" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReminderIcon({ kind }: { kind: "materials" | "level" | "space" }) {
  if (kind === "materials") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M18 18h28l-3 32H21l-3-32Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M15 18h34M25 13h14M29 25v18M36 25v18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="45" cy="18" r="13" fill="#FFF8EB" stroke="#C2587A" strokeWidth="3"/>
        <path d="M36 9 54 27" stroke="#C2587A" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    );
  }
  if (kind === "level") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M11 19h42l-5 27H16l-5-27Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M11 19h42M21 27v12M32 27v12M43 27v12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M8 12h48" stroke="#C2587A" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="5 5"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M12 23 32 11l20 12v30H12V23Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M24 53V32h16v21M19 27h5M40 27h5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M5 57h54" stroke="#C2587A" strokeWidth="3.5" strokeLinecap="round"/>
    </svg>
  );
}

function PinkDumpsterIllustration() {
  return (
    <svg className={styles.dumpsterArt} viewBox="0 0 520 330" fill="none" role="img" aria-label="Illustration of a pink roll-off dumpster filled below its top edge">
      <ellipse cx="267" cy="298" rx="222" ry="17" fill="#1E1C19" opacity=".09"/>
      <path d="M105 101 169 73 443 91 381 120 105 101Z" fill="#FFF5FB" stroke="#1E1C19" strokeWidth="6" strokeLinejoin="round"/>
      <path d="m104 104 43 156 239 16-5-158-277-14Z" fill="#FFCEE4" stroke="#1E1C19" strokeWidth="7" strokeLinejoin="round"/>
      <path d="m381 118 62-27-1 151-56 34-5-158Z" fill="#E7A9C5" stroke="#1E1C19" strokeWidth="7" strokeLinejoin="round"/>
      <path d="m153 119 28 132m28-129 18 135m31-134 10 137m38-136 3 139m44-140-6 143" stroke="#C2587A" strokeWidth="6" strokeLinecap="round"/>
      <path d="m114 120 262 16M159 266l220 15" stroke="#1E1C19" strokeWidth="5" opacity=".45"/>
      <path d="m107 103 29-10m27-12 18-4m50 6 42 2" stroke="#1E1C19" strokeWidth="4" strokeLinecap="round" opacity=".3"/>
      <path d="m147 263 3 17 54 3 2-20m130 8-2 18 36 3 7-17" fill="#1E1C19"/>
      <path d="m430 67 6-20m-22 25-15-14m53 21 18-11" stroke="#C2587A" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="93" cy="68" r="24" fill="#FFF5FB" stroke="#C2587A" strokeWidth="3"/>
      <path d="m83 68 7 7 14-16" stroke="#C2587A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const reminders = [
  {
    kind: "materials" as const,
    title: "Keep these out",
    copy: "No paint, fuels, batteries, propane tanks, or hazardous chemicals. Not sure about an item? Check with us first.",
  },
  {
    kind: "level" as const,
    title: "Keep it level",
    copy: "Nothing should stick above the top rim. Weight limits still apply, even if there's room left in the bin.",
  },
  {
    kind: "space" as const,
    title: "Clear the spot",
    copy: "Keep the delivery area accessible so our driver has room to place your dumpster with care.",
  },
];

export default function ConfirmationExperience({ booking, isDesignPreview = false }: ConfirmationExperienceProps) {
  return (
    <main className={styles.page}>
      {isDesignPreview && (
        <div className={styles.previewBanner} role="note">
          DESIGN PREVIEW — sample booking only. Not a payment or reservation confirmation.
        </div>
      )}
      <section className={styles.hero} aria-labelledby="confirmation-title">
        <div className={styles.heroBody}>
          <div className={styles.eyebrow}><span className={styles.eyebrowDot} /> BOOKING CONFIRMED</div>
          <div className={styles.heroHeadline}>
            <span className={styles.checkCircle}><CheckIcon /></span>
            <h1 id="confirmation-title">You're <span>booked.</span></h1>
          </div>
          <p className={styles.heroText}>
            Thanks for choosing Little Junkers. We've got your rental details.
            We'll keep you posted as delivery gets closer.
          </p>
        </div>
        <div className={styles.visual}>
          <div className={styles.visualCaption}>One less thing on your to-do list.</div>
          <PinkDumpsterIllustration />
        </div>
      </section>

      <div className={styles.content}>
        <section className={styles.reminderSection} aria-labelledby="reminders-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.kicker}>A few quick reminders</p>
              <h2 id="reminders-title">Before we roll up</h2>
            </div>
            <p>Three things that help your drop-off and pickup go smoothly.</p>
          </div>
          <div className={styles.reminders}>
            {reminders.map((reminder, index) => (
              <article className={styles.reminder} key={reminder.kind}>
                <span className={styles.reminderIcon}><ReminderIcon kind={reminder.kind} /></span>
                <div>
                  <p className={styles.reminderNumber}>0{index + 1} / THE BASICS</p>
                  <h3>{reminder.title}</h3>
                  <p>{reminder.copy}</p>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.materialNote}>
            Have a question about what can go in?{" "}
            <Link href="/what-can-i-put-in-a-dumpster">See the materials guide</Link>
            {" "}or <a href="sms:+14705484733">text our team</a>.
          </p>
        </section>

        <div className={styles.lowerGrid}>
          <section className={styles.nextCard} aria-labelledby="next-title">
            <p className={styles.darkKicker}>What happens next</p>
            <h2 id="next-title">We'll take it from here.</h2>
            <ol className={styles.steps}>
              <li><strong>Booking details</strong><span>Look for your confirmation message with your rental information.</span></li>
              <li><strong>Delivery timing</strong><span>We'll confirm the delivery window for your scheduled date.</span></li>
              <li><strong>On the way</strong><span>We'll send an update when your dumpster is headed your way.</span></li>
            </ol>
            <a className={styles.callLink} href="tel:+14705484733">Questions? Call or text 470-548-4733</a>
          </section>

          <section className={styles.recapCard} aria-labelledby="recap-title">
            <p className={styles.kicker}>For your records</p>
            <h2 id="recap-title">Your rental</h2>
            <dl className={styles.recap}>
              <div><dt>Dumpster</dt><dd>{booking.dumpster}</dd></div>
              {booking.rentalLength && <div><dt>Rental length</dt><dd>{booking.rentalLength}</dd></div>}
              {booking.deliveryDate && <div><dt>Delivery</dt><dd>{booking.deliveryDate}</dd></div>}
              {booking.pickupDate && <div><dt>Scheduled pickup</dt><dd>{booking.pickupDate}</dd></div>}
              {booking.bookingReference && <div><dt>Booking reference</dt><dd>{booking.bookingReference}</dd></div>}
            </dl>
            <p className={styles.recapFoot}>You'll find the complete rental details in your confirmation message.</p>
          </section>
        </div>
        <p className={styles.signoff}>See you soon. <span>— Your neighbors at Little Junkers</span></p>
      </div>
    </main>
  );
}
