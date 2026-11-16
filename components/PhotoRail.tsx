import type { PhotoSlot } from "@/lib/media";
import Photo from "./Photo";

// Swipeable, keyboard-scrollable photo strip. Native scrolling, no script.
export default function PhotoRail({ photos, label }: { photos: PhotoSlot[]; label: string }) {
  return (
    <ul className="rail" aria-label={label} tabIndex={0}>
      {photos.map((photo, index) => (
        <li key={"needed" in photo ? `slot-${index}` : photo.src}>
          <Photo photo={photo} shape="portrait" sizes="320px" />
        </li>
      ))}
    </ul>
  );
}
