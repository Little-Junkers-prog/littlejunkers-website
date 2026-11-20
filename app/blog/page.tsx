import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatDate, getPosts, type Post, type PostCategory } from "@/lib/blog";
import { bookingUrl, company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Junker Journal | Dumpster Tips and Jobs",
  description: "Real jobs, loading tips and local news from Little Junkers, the pink-dumpster company in Peachtree City, Georgia.",
  alternates: { canonical: "/blog" },
};

const sections: { category: PostCategory; title: string }[] = [
  { category: "real-jobs", title: "From Real Jobs" },
  { category: "guides", title: "Helpful Guides" },
  { category: "events", title: "Events" },
  { category: "neighborhoods", title: "Around Our Neighborhoods" },
];

function PostCard({ post }: { post: Post }) {
  return (
    <Link className="card post-card" href={`/blog/${post.slug}`}>
      {post.hero ? (
        <div className="photo photo--landscape">
          <Image src={post.hero.src} alt={post.hero.alt} width={800} height={600} sizes="(min-width: 900px) 33vw, 100vw" />
        </div>
      ) : null}
      <p className="post-meta">{formatDate(post.date)}</p>
      <h3>{post.title}</h3>
      {post.excerpt ? <p className="muted">{post.excerpt}</p> : null}
    </Link>
  );
}

export default function BlogIndex() {
  const posts = getPosts();
  const featured = posts.find((post) => post.featured) ?? posts.find((post) => post.category === "story");
  const communityProfiles = company.social.filter((profile) => ["Facebook", "Instagram", "YouTube", "Nextdoor"].includes(profile.label));

  return (
    <>
      <Breadcrumbs trail={[{ label: "Blog", href: "/blog" }]} />

      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Junker Journal</p>
          <h1>
            Notes from the <span className="accent">job site.</span>
          </h1>
          <p className="lead">Real jobs, loading tips and what we&apos;re up to around town.</p>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="section">
          <div className="container">
            <div className="notice">
              <h2 style={{ fontSize: "1.3rem" }}>Posts are being moved over</h2>
              <p style={{ marginTop: 6 }}>
                Draft note: the existing blog articles have not been migrated into this build yet. The templates and URL
                redirects are ready for them.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {featured ? (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>Featured</h2>
            </div>
            <div className="grid grid--2">
              <PostCard post={featured} />
            </div>
          </div>
        </section>
      ) : null}

      {sections.map(({ category, title }, index) => {
        const group = posts.filter((post) => post.category === category && post !== featured);
        if (group.length === 0) return null;
        return (
          <section className={`section${index % 2 === 0 ? " section--surface" : ""}`} key={category} id={category}>
            <div className="container">
              <div className="section-head">
                <h2>{title}</h2>
              </div>
              <div className="grid grid--3">
                {group.map((post) => (
                  <PostCard post={post} key={post.slug} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="section">
        <div className="container">
          <div className="callout">
            <div>
              <h2>Follow the Junkers</h2>
              <p className="muted" style={{ marginTop: 6 }}>
                Real jobs, local events and project tips.
              </p>
              <ul className="chips" style={{ marginTop: 12 }}>
                {communityProfiles.map((profile) => (
                  <li key={profile.label}>
                    <a className="chip" href={profile.href} rel="noopener">
                      {profile.label}
                    </a>
                  </li>
                ))}
              </ul>
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
      </section>
    </>
  );
}
