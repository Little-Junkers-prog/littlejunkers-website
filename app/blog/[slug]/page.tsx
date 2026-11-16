import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { bookingUrl, company, siteUrl } from "@/lib/company";
import { indexable } from "@/lib/indexing";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: indexable && post.index ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function BlogPost({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const url = `${siteUrl}/blog/${post.slug}`;

  return (
    <>
      <Breadcrumbs
        trail={[
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <article>
        <header className="page-hero">
          <div className="container" style={{ maxWidth: 800 }}>
            <p className="post-meta">
              {formatDate(post.date)} · {post.author}
            </p>
            <h1 style={{ marginTop: 8 }}>{post.title}</h1>
            {post.excerpt ? <p className="lead">{post.excerpt}</p> : null}
          </div>
        </header>

        <div className="section">
          <div className="container" style={{ maxWidth: 800 }}>
            {post.hero ? (
              <div className="photo photo--landscape" style={{ marginBottom: 28 }}>
                <Image src={post.hero.src} alt={post.hero.alt} width={1600} height={1200} sizes="(min-width: 800px) 768px, 100vw" priority />
              </div>
            ) : null}
            {/* Post bodies are first-party Markdown from this repository. */}
            <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

            <ul className="chips" aria-label="Share this article" style={{ marginTop: 32 }}>
              <li>
                <a className="chip" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} rel="noopener">
                  Share on Facebook
                </a>
              </li>
              <li>
                <a className="chip" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} rel="noopener">
                  Share on LinkedIn
                </a>
              </li>
              <li>
                <a className="chip" href={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${post.title} ${url}`)}`} rel="noopener">
                  Share on Bluesky
                </a>
              </li>
            </ul>

            <div className="callout" style={{ marginTop: 32 }}>
              <div>
                <h2 style={{ fontSize: "1.4rem" }}>Got a project coming up?</h2>
                <p className="muted" style={{ marginTop: 6 }}>
                  See today&apos;s prices for all three sizes, or call or text {company.phoneDisplay}.
                </p>
              </div>
              <div className="btn-row">
                <Link className="btn btn--secondary" href="/#sizes">
                  See Sizes &amp; Prices
                </Link>
                <a className="btn btn--primary" href={bookingUrl()}>
                  Book a Dumpster
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          datePublished: post.date,
          author: { "@type": "Person", name: post.author },
          publisher: { "@id": `${siteUrl}/#business` },
          mainEntityOfPage: url,
          ...(post.hero ? { image: `${siteUrl}${post.hero.src}` } : {}),
        }}
      />
    </>
  );
}
