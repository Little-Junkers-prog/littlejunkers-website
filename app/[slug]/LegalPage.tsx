import Breadcrumbs from "@/components/Breadcrumbs";
import type { LegalDoc } from "@/lib/legal";

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <Breadcrumbs trail={[{ label: doc.title, href: `/${doc.slug}` }]} />
      <article className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <h1>{doc.title}</h1>
          {/* First-party legal copy from /content/legal. */}
          <div className="prose prose--legal" style={{ marginTop: 24 }} dangerouslySetInnerHTML={{ __html: doc.html }} />
        </div>
      </article>
    </>
  );
}
