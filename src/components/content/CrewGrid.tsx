// components/content/CrewGrid.tsx
import Image from "next/image";
import { Instagram, Facebook } from "lucide-react";

export type CrewMember = {
  name: string;
  role: "Guide" | "Driver" | string;
  highlights: string[];
  languages: string;
  phone?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  about?: string | null;
  photo_url?: string | null;
};

// ─── Badge warna per role ─────────────────────────────────────────────────────

const ROLE_STYLE: Record<string, { bg: string; color: string }> = {
  Guide: { bg: "#eef5d8", color: "#3a5a18" },
  Driver: { bg: "#f0f4ff", color: "#2a3a70" },
};

function roleBadge(role: string) {
  const s = ROLE_STYLE[role] ?? { bg: "#f5f5f5", color: "#555" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.15rem 0.55rem",
        borderRadius: "999px",
        background: s.bg,
        color: s.color,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.6rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
      }}
    >
      {role}
    </span>
  );
}

// ─── Satu card crew ───────────────────────────────────────────────────────────

function CrewCard({ member }: { member: CrewMember }) {
  return (
    <>
      <div className="jvto-crew-card">
        {/* Foto */}
        <div className="jvto-crew-photo-wrap">
          {member.photo_url ? (
            member.photo_url.startsWith("/") ||
            member.photo_url.includes("javavolcano-touroperator.com") ? (
              <img
                src={member.photo_url}
                alt={`${member.name} – JVTO ${member.role}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
                className="jvto-crew-photo"
              />
            ) : (
              <Image
                src={member.photo_url}
                alt={`${member.name} – JVTO ${member.role}`}
                fill
                className="jvto-crew-photo"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )
          ) : (
            <div className="jvto-crew-photo-placeholder">
              {member.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          {/* Overlay sosmed muncul saat hover */}
          <div className="jvto-crew-overlay">
            <div className="jvto-crew-social">
              {member.instagram && (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="jvto-crew-social-btn"
                  aria-label={`Instagram ${member.name}`}
                  title="Instagram"
                >
                  <Instagram size={15} />
                </a>
              )}
              {member.facebook && (
                <a
                  href={member.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="jvto-crew-social-btn"
                  aria-label={`Facebook ${member.name}`}
                  title="Facebook"
                >
                  <Facebook size={15} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="jvto-crew-info">
          <div className="jvto-crew-name-row">
            <span className="jvto-crew-name">{member.name}</span>
            {roleBadge(member.role)}
          </div>

          {/* Highlights sebagai tag */}
          <div className="jvto-crew-tags">
            {member.highlights.map((h, i) => (
              <span key={i} className="jvto-crew-tag">
                {h}
              </span>
            ))}
          </div>

          {/* About (truncated) */}
          {member.about && <p className="jvto-crew-about">{member.about}</p>}
        </div>
      </div>
    </>
  );
}

// ─── Grid utama ───────────────────────────────────────────────────────────────

export function CrewGrid({ items }: { items: CrewMember[] }) {
  if (!items?.length) return null;

  return (
    <>
      <style>{`
        /* ── Grid ── */
        .jvto-crew-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.25rem;
        }

        /* ── Card ── */
        .jvto-crew-card {
          border-radius: 1rem;
          border: 1px solid #dde3d0;
          background: #ffffff;
          overflow: hidden;
          transition: box-shadow 0.25s, border-color 0.25s, transform 0.2s;
        }
        .jvto-crew-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          border-color: rgba(159,206,51,0.45);
          transform: translateY(-3px);
        }

        /* ── Photo wrap ── */
        .jvto-crew-photo-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4/5;
          overflow: hidden;
          background: #f0f2ea;
        }

        /* Foto grayscale by default, warna saat card di-hover */
        .jvto-crew-photo {
          object-fit: cover;
          object-position: top center;
          filter: grayscale(100%);
          transition: filter 0.4s ease, transform 0.4s ease;
        }
        .jvto-crew-card:hover .jvto-crew-photo {
          filter: grayscale(0%);
          transform: scale(1.04);
        }

        /* Placeholder jika tidak ada foto */
        .jvto-crew-photo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #9fce33;
          background: #f0f4e8;
        }

        /* ── Overlay sosmed ── */
        .jvto-crew-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(12,14,9,0.72) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 0.875rem;
        }
        .jvto-crew-card:hover .jvto-crew-overlay {
          opacity: 1;
        }

        .jvto-crew-social {
          display: flex;
          gap: 0.5rem;
        }
        .jvto-crew-social-btn {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .jvto-crew-social-btn:hover {
          background: #9fce33;
          color: #0c0e09;
          transform: scale(1.1);
        }

        /* ── Info section ── */
        .jvto-crew-info {
          padding: 0.875rem 1rem 1rem;
        }

        .jvto-crew-name-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }
        .jvto-crew-name {
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #0c0e09;
          line-height: 1.2;
        }

        /* ── Highlight tags ── */
        .jvto-crew-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          margin-bottom: 0.6rem;
        }
        .jvto-crew-tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          color: #5a7a30;
          background: #f4f8ea;
          border: 1px solid #dde8c0;
          border-radius: 999px;
          padding: 0.1rem 0.5rem;
          white-space: nowrap;
        }

        /* ── About ── */
        .jvto-crew-about {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          color: #6b7a55;
          line-height: 1.6;
          margin: 0;
          /* Clamp ke 3 baris */
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="jvto-crew-grid">
        {items.map((member) => (
          <CrewCard key={member.name} member={member} />
        ))}
      </div>
    </>
  );
}
