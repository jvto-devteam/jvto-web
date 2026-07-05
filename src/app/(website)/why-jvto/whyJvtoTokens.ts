// src/app/(website)/why-jvto/whyJvtoTokens.ts
// Cluster-local design tokens for the WHY-JVTO cluster, ported from
// docs/design-reference/jvto-system.css (W3 design-reference spec, PR #66).
//
// Per the parallel-build token strategy: values are expressed LOCALLY here
// (scoped under the `.jw-` prefix) rather than added to any global
// stylesheet/token file, so this cluster can restyle independently of
// W3a's chrome work and sibling clusters (policy, travel-guide, tours).
// Post-merge, these values should reconcile with a real global token file
// if/when one lands — see PR body for the note.
//
// Source values (unchanged from jvto-system.css):
//   navy #0D1B2A · navy-mid #1C2E40 · orange #E8650A · orange-hover #C4520A
//   gold #F5A623 · lime #8CC63F · off #F6F5F2 · muted #6B7280 · border #E3E0DA
//   radii r-xs 8 / r-sm 12 / r-md 18 / r-lg 28 / r-xl 40 / r-pill 999
//   shadow-soft / shadow-card-hover
export const WHY_JVTO_STYLES = `
  .jw-root {
    --jw-navy: #0D1B2A;
    --jw-navy-mid: #1C2E40;
    --jw-orange: #E8650A;
    --jw-orange-hover: #C4520A;
    --jw-gold: #F5A623;
    --jw-lime: #8CC63F;
    --jw-off: #F6F5F2;
    --jw-muted: #6B7280;
    --jw-border: #E3E0DA;
    --jw-white: #FFFFFF;
    --jw-font-display: 'Raleway', 'Segoe UI', system-ui, sans-serif;
    --jw-font-mono: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', monospace;
    --jw-r-xs: 8px;
    --jw-r-sm: 12px;
    --jw-r-md: 18px;
    --jw-r-lg: 28px;
    --jw-r-xl: 40px;
    --jw-r-pill: 999px;
    --jw-shadow-soft: 0 12px 32px -16px rgba(13,27,42,0.12), 0 2px 6px -2px rgba(13,27,42,0.04);
    --jw-shadow-hover: 0 30px 60px -25px rgba(13,27,42,0.22), 0 4px 12px -4px rgba(13,27,42,0.06);
    color: var(--jw-navy);
  }

  .jw-micro {
    font-family: var(--jw-font-mono);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--jw-muted);
  }
  .jw-accent-orange { color: var(--jw-orange); }
  .jw-accent-lime { color: var(--jw-lime); }

  /* ── Crumbs ── */
  .jw-crumbs {
    display: flex; flex-wrap: wrap; align-items: center; gap: .5rem;
    font-family: var(--jw-font-mono); font-size: 11px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--jw-muted); margin: 1.75rem 0 1.5rem;
  }
  .jw-crumbs a { color: var(--jw-muted); text-decoration: none; transition: color .2s; }
  .jw-crumbs a:hover { color: var(--jw-orange); }
  .jw-crumbs .jw-sep { opacity: .45; }
  .jw-crumbs .jw-here { color: var(--jw-navy); font-weight: 700; }

  /* ── Interior hero (navy band under the real navbar) ── */
  .jw-hero {
    position: relative;
    background: var(--jw-navy);
    color: #fff;
    border-radius: var(--jw-r-xl);
    overflow: hidden;
    padding: 3rem 2.25rem 2.5rem;
  }
  .jw-hero::before {
    content: "";
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse at 80% 15%, rgba(232,101,10,0.20) 0%, transparent 55%),
      linear-gradient(160deg, rgba(28,46,64,0.4) 0%, rgba(13,27,42,0.92) 100%);
  }
  .jw-hero-inner { position: relative; z-index: 2; }
  .jw-hero-eyebrow-row { display: inline-flex; align-items: center; gap: .75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .jw-eyebrow-pill {
    display: inline-flex; align-items: center; gap: .5rem;
    border: 1px solid rgba(140,198,63,0.35); background: rgba(140,198,63,0.1);
    color: var(--jw-lime); padding: 7px 14px; border-radius: var(--jw-r-pill);
    font-family: var(--jw-font-mono); font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
  }
  .jw-eyebrow-pill::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--jw-lime); box-shadow: 0 0 0 4px rgba(140,198,63,0.18); }
  .jw-eyebrow-meta { font-family: var(--jw-font-mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
  .jw-hero-h1 {
    font-family: var(--jw-font-display);
    font-size: clamp(1.9rem, 4.4vw, 3.4rem);
    font-weight: 800; letter-spacing: -0.03em; line-height: 1.05;
    margin: 0 0 1.1rem; color: #fff; max-width: 20ch;
  }
  .jw-hero-lede { font-size: 1rem; max-width: 56ch; color: rgba(255,255,255,0.78); font-weight: 300; line-height: 1.65; margin: 0; }
  .jw-hero-meta { display: grid; gap: .65rem; margin-top: 1.75rem; max-width: 460px; }
  .jw-meta-row {
    display: flex; justify-content: space-between; gap: 1rem;
    padding: .7rem .9rem; border-radius: var(--jw-r-md);
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    font-family: var(--jw-font-mono); font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(255,255,255,0.6);
  }
  .jw-meta-row strong { color: #fff; font-weight: 700; letter-spacing: 0.02em; }

  /* ── Section head ── */
  .jw-section-head { margin-bottom: 2rem; }
  .jw-section-eyebrow { display: flex; align-items: center; gap: .4rem; margin-bottom: .6rem; }
  .jw-section-h2 {
    font-family: var(--jw-font-display); font-size: clamp(1.35rem, 2.6vw, 1.9rem);
    font-weight: 800; letter-spacing: -0.02em; line-height: 1.15; color: var(--jw-navy); margin: 0;
  }
  .jw-section-sub { color: var(--jw-muted); font-size: .92rem; font-weight: 400; line-height: 1.65; max-width: 62ch; margin: .6rem 0 0; }

  /* ── Data / credential box ── */
  .jw-data-box {
    border: 1px solid var(--jw-border); border-radius: var(--jw-r-lg);
    background: var(--jw-off); padding: 1.5rem 1.75rem; margin: 1.5rem 0;
    display: grid; gap: 1rem;
  }
  .jw-data-box.jw-dark { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); color: #fff; }
  .jw-data-box .jw-k { font-family: var(--jw-font-mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--jw-muted); margin-bottom: .3rem; }
  .jw-data-box.jw-dark .jw-k { color: rgba(255,255,255,0.55); }
  .jw-data-box .jw-v { font-weight: 600; font-size: .92rem; }

  /* ── Timeline ── */
  .jw-timeline { list-style: none; padding: 0; margin: 0; position: relative; }
  .jw-timeline::before { content: ""; position: absolute; left: 26px; top: 0; bottom: 0; width: 1px; background: var(--jw-border); }
  .jw-timeline.jw-dark::before { background: rgba(255,255,255,0.1); }
  .jw-timeline > li { display: grid; grid-template-columns: 54px 1fr; gap: 1.5rem; padding: .9rem 0 1.9rem; position: relative; }
  .jw-timeline > li .jw-year {
    position: relative; z-index: 2; width: 52px; height: 52px; background: #fff; border: 1px solid var(--jw-border);
    border-radius: 50%; display: grid; place-items: center; font-family: var(--jw-font-mono); font-size: 11px; font-weight: 700; color: var(--jw-navy);
  }
  .jw-timeline.jw-dark > li .jw-year { background: var(--jw-navy); border-color: rgba(255,255,255,0.18); color: var(--jw-lime); }
  .jw-timeline > li h4 { font-family: var(--jw-font-display); font-size: 1.15rem; font-weight: 700; margin: 0 0 .3rem; letter-spacing: -0.01em; }
  .jw-timeline.jw-dark > li h4 { color: #fff; }
  .jw-timeline > li p { color: var(--jw-muted); font-size: .88rem; font-weight: 400; line-height: 1.6; margin: 0; }
  .jw-timeline.jw-dark > li p { color: rgba(255,255,255,0.68); }

  /* ── Proof / cred callout ── */
  .jw-cred {
    margin-top: 1rem; background: var(--jw-off); border: 1px solid var(--jw-border);
    border-left: 3px solid var(--jw-lime); border-radius: var(--jw-r-md);
    padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: .35rem;
  }
  .jw-cred .jw-cred-label { font-family: var(--jw-font-mono); font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--jw-lime); }
  .jw-cred .jw-cred-text { font-family: var(--jw-font-mono); font-size: 11.5px; line-height: 1.7; color: var(--jw-navy); word-break: break-word; }
  .jw-cred a { color: var(--jw-orange); border-bottom: 1px solid currentColor; text-decoration: none; }

  /* ── Diff item (the-jvto-difference numbered rows) ── */
  .jw-diff-item { display: grid; grid-template-columns: 64px 1fr; gap: 1.5rem; padding: 2rem 0; border-top: 1px solid var(--jw-border); }
  .jw-diff-item:first-child { border-top: 0; padding-top: .5rem; }
  .jw-diff-num { font-family: var(--jw-font-display); font-size: clamp(2.4rem, 5vw, 3.4rem); font-weight: 800; line-height: .8; letter-spacing: -0.04em; color: var(--jw-off); -webkit-text-stroke: 1px var(--jw-border); }
  @media (max-width: 640px) { .jw-diff-item { grid-template-columns: 1fr; gap: .75rem; } }

  /* ── Article layout ── */
  .jw-article-layout { display: grid; grid-template-columns: 220px 1fr; gap: 3rem; align-items: start; }
  @media (max-width: 900px) { .jw-article-layout { grid-template-columns: 1fr; gap: 1.5rem; } }
  .jw-article-side { position: sticky; top: 7.5rem; font-family: var(--jw-font-mono); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; }
  .jw-article-side .jw-side-label { color: var(--jw-muted); margin-bottom: .6rem; }
  .jw-article-side ul { list-style: none; padding: 0; margin: 0 0 1.5rem; display: flex; flex-direction: column; gap: .25rem; }
  .jw-article-side a { color: var(--jw-navy); padding: .5rem .75rem; display: block; border-radius: var(--jw-r-sm); text-decoration: none; transition: background .2s, color .2s; }
  .jw-article-side a:hover { background: rgba(232,101,10,0.07); color: var(--jw-orange); }
  .jw-article-side a.jw-active { background: var(--jw-navy); color: #fff; }
  .jw-inline-link {
    display: inline-flex; align-items: center; gap: .6rem;
    font-family: var(--jw-font-mono); font-size: 10.5px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--jw-navy); padding-bottom: 5px; border-bottom: 1px solid var(--jw-navy);
    text-decoration: none;
  }
  .jw-inline-link:hover { color: var(--jw-orange); border-color: var(--jw-orange); }
  .jw-inline-link.jw-light { color: #fff; border-color: rgba(255,255,255,0.4); }
  .jw-inline-link.jw-light:hover { color: var(--jw-lime); border-color: var(--jw-lime); }

  /* ── CTA block ── */
  .jw-cta-block { background: var(--jw-navy); color: #fff; border-radius: var(--jw-r-xl); padding: 3.5rem 2rem; text-align: center; margin-top: 3rem; }
  .jw-cta-block h2 { font-family: var(--jw-font-display); font-size: clamp(1.6rem, 4vw, 2.6rem); letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 1.75rem; }
  .jw-cta-ctas { display: flex; justify-content: center; flex-wrap: wrap; gap: .75rem; }
  .jw-cta-ctas a {
    padding: 14px 26px; font-family: var(--jw-font-mono); font-size: 10.5px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; border-radius: var(--jw-r-pill);
    display: inline-flex; align-items: center; gap: .6rem; transition: all .2s; text-decoration: none;
  }
  .jw-cta-ctas a.jw-primary { background: var(--jw-orange); color: #fff; }
  .jw-cta-ctas a.jw-primary:hover { background: var(--jw-orange-hover); }
  .jw-cta-ctas a.jw-ghost { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.22); }
  .jw-cta-ctas a.jw-ghost:hover { background: rgba(255,255,255,0.08); }

  /* ── Card grid shells (used by hub) ── */
  .jw-media-frame {
    position: relative; margin: 0; aspect-ratio: 5/4; border-radius: var(--jw-r-xl);
    overflow: hidden; background: var(--jw-navy); box-shadow: var(--jw-shadow-hover);
  }
  .jw-media-frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .jw-media-frame::after {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(150deg, rgba(13,27,42,0) 40%, rgba(13,27,42,0.55) 100%);
  }
  .jw-media-tag {
    position: absolute; left: 16px; bottom: 16px; z-index: 2;
    font-family: var(--jw-font-mono); font-size: 9.5px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(255,255,255,0.85); border: 1px solid rgba(255,255,255,0.25); padding: 6px 10px; border-radius: var(--jw-r-pill);
    backdrop-filter: blur(6px); background: rgba(0,0,0,0.22);
  }
  .jw-floating-badge {
    position: absolute; background: #fff; color: var(--jw-navy); padding: .85rem 1.1rem;
    border-radius: var(--jw-r-md); box-shadow: 0 18px 40px -16px rgba(13,27,42,0.35);
    display: flex; align-items: flex-start; gap: .7rem; max-width: 230px; z-index: 3;
  }
  .jw-floating-badge svg { width: 22px; height: 22px; flex-shrink: 0; color: var(--jw-navy); }
  .jw-floating-badge .jw-fb-title { font-family: var(--jw-font-mono); font-size: 9.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: .2rem; }
  .jw-floating-badge .jw-fb-sub { font-size: 11.5px; color: var(--jw-muted); font-weight: 400; line-height: 1.4; }

  /* ── Score / aggregate cards (reviews page) ── */
  .jw-agg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  @media (max-width: 720px) { .jw-agg-grid { grid-template-columns: 1fr; } }
  .jw-agg {
    background: #fff; border: 1px solid var(--jw-border); border-radius: var(--jw-r-lg);
    padding: 1.5rem 1.5rem 1.3rem; box-shadow: var(--jw-shadow-soft); display: flex; flex-direction: column; gap: .4rem;
  }
  .jw-agg .jw-agg-plat { font-family: var(--jw-font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--jw-muted); }
  .jw-agg .jw-agg-score { font-family: var(--jw-font-display); font-size: 2.4rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1; color: var(--jw-navy); }
  .jw-agg .jw-agg-score small { font-size: 1rem; font-weight: 500; color: var(--jw-muted); }
  .jw-agg .jw-agg-meta { font-family: var(--jw-font-mono); font-size: 10px; letter-spacing: 0.1em; color: var(--jw-muted); margin-top: auto; padding-top: .75rem; border-top: 1px solid var(--jw-border); display: flex; justify-content: space-between; gap: .5rem; }
  .jw-stars { color: var(--jw-gold); display: inline-flex; gap: 2px; }
  .jw-stars svg { width: 13px; height: 13px; }

  /* ── Verify / quick-access card ── */
  .jw-verify-card {
    margin-top: 1.5rem; padding: 1.1rem 1.25rem; border-radius: var(--jw-r-lg);
    background: var(--jw-off); border: 1px solid var(--jw-border); text-decoration: none; display: block;
    transition: border-color .2s, box-shadow .2s;
  }
  .jw-verify-card:hover { border-color: rgba(232,101,10,0.4); box-shadow: var(--jw-shadow-soft); }
  .jw-verify-card .jw-vc-label { font-family: var(--jw-font-mono); font-size: 9.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--jw-orange); display: block; margin-bottom: .35rem; }
  .jw-verify-card .jw-vc-title { font-size: .9rem; font-weight: 700; color: var(--jw-navy); display: block; }
  .jw-verify-card .jw-vc-sub { font-size: .78rem; color: var(--jw-muted); display: block; margin-top: .2rem; line-height: 1.4; }
`;
