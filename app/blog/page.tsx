import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatDate, getPosts, type Post, type PostCategory } from "@/lib/blog";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Junker Journal | Dumpster Tips and Jobs",
  description: "Practical dumpster rental and cleanup guides from Little Junkers in Peachtree City. Learn how to choose a size, load safely and plan a cleanout.",
  alternates: { canonical: "/blog" },
};

const sections: { category: PostCategory; title: string }[] = [
  { category: "real-jobs", title: "From Real Jobs" },
  { category: "guides", title: "Dumpster and cleanup guides" },
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
            Dumpster tips from the <span className="accent">Junkers.</span>
          </h1>
          <p className="lead">Planning a cleanout or renovation? Here are the questions we hear most about bins, weight limits and getting rid of debris.</p>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="section">
          <div className="container">
            <div className="notice">
              <h2 style={{ fontSize: "1.3rem" }}>Posts are being moved over</h2>
              <p style={{ marginTop: 6 }}>
                We’re updating our cleanup guides. In the meantime, you can compare dumpster sizes and check what can go in a bin.
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
              <h2>More from Little Junkers</h2>
              <p className="muted" style={{ marginTop: 6 }}>
                Photos from our jobs and tips for your next cleanup.
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
              <Link className="btn btn--primary" href="/plan">
                Start Online Booking
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
