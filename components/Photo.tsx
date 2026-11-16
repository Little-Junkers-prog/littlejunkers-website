import Image from "next/image";
import type { PhotoSlot } from "@/lib/media";

type Props = {
  photo: PhotoSlot;
  shape?: "landscape" | "portrait";
  sizes?: string;
  priority?: boolean;
  caption?: boolean;
};

// Renders a real photo from the manifest, or a clearly labeled slot when the
// real photo doesn't exist yet. Never substitutes stock or generated imagery.
export default function Photo({ photo, shape = "landscape", sizes = "(min-width: 900px) 33vw, 90vw", priority, caption = true }: Props) {
  if ("needed" in photo) {
    return (
      <div className={`photo photo--${shape} photo-needed`} role="img" aria-label={`Photo needed: ${photo.needed}`}>
        <span>
          <strong>Photo needed</strong>
          {photo.needed}
        </span>
      </div>
    );
  }

  return (
    <figure className={`photo photo--${shape}`}>
      <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes={sizes} priority={priority} />
      {caption && photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
    </figure>
  );
}
