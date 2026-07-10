'use client';

import { useEffect, useState } from 'react';
import { BookmarkButton } from './BookmarkButton';

/**
 * Detail-page user features: Read Online, Download PDF (branded APA
 * publication template), Print, Share, Bookmark, Save to Collection,
 * star Rating, professional Comments and reading-history tracking.
 * Locally persisted; backend-ready.
 */
export function ResourceActions({
  slug,
  title,
  hasPdf,
  fileSizeKb,
  locale = 'en',
  downloadDocUrl,
  downloadDocLabel,
}: {
  slug: string;
  title: string;
  hasPdf: boolean;
  fileSizeKb?: number;
  locale?: string;
  downloadDocUrl?: string;
  downloadDocLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<{ author: string; text: string; at: string }[]>([]);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [collections, setCollections] = useState<Record<string, string[]>>({});
  const [newCollection, setNewCollection] = useState('');

  const publicationHref = `/${locale}/resources/${slug}/publication`;

  useEffect(() => {
    // Record reading history (Resume Reading / View History).
    try {
      const key = 'apa.resources.history';
      const hist = JSON.parse(localStorage.getItem(key) || '[]').filter((h: { slug: string }) => h.slug !== slug);
      hist.unshift({ slug, title, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(hist.slice(0, 30)));
      setRating(JSON.parse(localStorage.getItem('apa.resources.ratings') || '{}')[slug] || 0);
      setComments(JSON.parse(localStorage.getItem(`apa.resources.comments.${slug}`) || '[]'));
      setCollections(JSON.parse(localStorage.getItem('apa.resources.collections') || '{}'));
    } catch { /* ignore */ }
  }, [slug, title]);

  function saveCollections(next: Record<string, string[]>) {
    setCollections(next);
    try { localStorage.setItem('apa.resources.collections', JSON.stringify(next)); } catch { /* ignore */ }
  }
  function toggleInCollection(name: string) {
    const list = collections[name] ?? [];
    const next = { ...collections, [name]: list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug] };
    saveCollections(next);
  }
  function createCollection(e: React.FormEvent) {
    e.preventDefault();
    const name = newCollection.trim();
    if (!name || collections[name]) return;
    saveCollections({ ...collections, [name]: [slug] });
    setNewCollection('');
  }

  function share() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) { navigator.share({ title, url }).catch(() => {}); return; }
    navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  }

  function rate(n: number) {
    setRating(n);
    try {
      const map = JSON.parse(localStorage.getItem('apa.resources.ratings') || '{}');
      map[slug] = n;
      localStorage.setItem('apa.resources.ratings', JSON.stringify(map));
    } catch { /* ignore */ }
  }

  function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    const next = [{ author: 'You', text: comment.trim(), at: new Date().toISOString() }, ...comments];
    setComments(next);
    setComment('');
    try { localStorage.setItem(`apa.resources.comments.${slug}`, JSON.stringify(next)); } catch { /* ignore */ }
  }

  const btn = 'flex items-center gap-1.5 rounded-md border border-apa-line px-3 py-2 text-sm font-semibold text-apa-navy transition-colors hover:border-apa-green hover:text-apa-green';

  return (
    <div>
      {/* Action bar: Read Online → Download PDF → Print → Share → Bookmark → Collection */}
      <div className="flex flex-wrap items-center gap-2">
        {hasPdf ? (
          <>
            <a href={publicationHref} className="flex items-center gap-1.5 rounded-md border border-apa-green px-4 py-2 text-sm font-bold text-apa-green transition-colors hover:bg-apa-green hover:text-white">
              📖 Read Online
            </a>
            <a
              href={`${publicationHref}?print=1`}
              className="flex items-center gap-1.5 rounded-md bg-apa-green px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-apa-green-mid"
              title="Opens the official APA publication and the Save-as-PDF dialog"
            >
              ⬇ Download PDF{fileSizeKb ? ` · ${(fileSizeKb / 1024).toFixed(1)} MB` : ''}
            </a>
          </>
        ) : null}
        {downloadDocUrl ? (
          <a href={downloadDocUrl} download className="flex items-center gap-1.5 rounded-md bg-apa-navy px-4 py-2 text-sm font-bold text-white transition-colors hover:opacity-90">
            ⬇ {downloadDocLabel ?? 'Download document'}
          </a>
        ) : null}
        <button type="button" onClick={() => window.print()} className={btn}>🖨 Print</button>
        <button type="button" onClick={share} className={btn}>🔗 {copied ? 'Copied!' : 'Share'}</button>
        <BookmarkButton slug={slug} label />
        <div className="relative">
          <button type="button" onClick={() => setCollectionsOpen((o) => !o)} className={btn} aria-expanded={collectionsOpen}>
            🗂 Save to Collection
          </button>
          {collectionsOpen ? (
            <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-apa-lg border border-apa-line bg-white p-3 shadow-xl">
              <div className="text-xs font-bold uppercase text-apa-grey">My collections</div>
              <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto">
                {Object.keys(collections).length === 0 ? (
                  <li className="text-xs text-apa-grey">No collections yet — create one below.</li>
                ) : Object.entries(collections).map(([name, list]) => (
                  <li key={name}>
                    <label className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-apa-soft">
                      <input type="checkbox" checked={list.includes(slug)} onChange={() => toggleInCollection(name)} />
                      <span className="min-w-0 flex-1 truncate">{name}</span>
                      <span className="text-[10px] text-apa-grey">{list.length}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <form onSubmit={createCollection} className="mt-2 flex gap-1.5">
                <input
                  value={newCollection}
                  onChange={(e) => setNewCollection(e.target.value)}
                  placeholder="New collection…"
                  className="min-w-0 flex-1 rounded-md border border-apa-line px-2 py-1.5 text-xs outline-none focus:border-apa-green"
                />
                <button type="submit" className="rounded-md bg-apa-green px-2.5 text-xs font-bold text-white">＋</button>
              </form>
            </div>
          ) : null}
        </div>
      </div>

      {/* Rating */}
      <div className="mt-6 rounded-apa-lg border border-apa-line p-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-apa-navy">Rate this resource</span>
          <div className="flex" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onClick={() => rate(n)}
                aria-label={`Rate ${n} stars`}
                className={`text-2xl leading-none ${(hover || rating) >= n ? 'text-apa-gold-bright' : 'text-apa-line'}`}
              >
                ★
              </button>
            ))}
          </div>
          {rating ? <span className="text-xs text-apa-grey">You rated {rating}/5</span> : null}
        </div>
      </div>

      {/* Professional comments */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-apa-navy">Professional discussion</h3>
        <div className="apa-rule my-3" />
        <form onSubmit={postComment} className="flex flex-col gap-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share an insight or how you applied this resource…"
            className="min-h-20 w-full rounded-md border border-apa-line px-3 py-2 text-sm outline-none focus:border-apa-green"
          />
          <button type="submit" className="self-start rounded-md bg-apa-green px-4 py-2 text-sm font-bold text-white hover:bg-apa-green-mid">Post comment</button>
        </form>
        <ul className="mt-4 space-y-3">
          {comments.length === 0 ? (
            <li className="text-sm text-apa-grey">No comments yet — be the first to contribute.</li>
          ) : comments.map((c, i) => (
            <li key={i} className="rounded-apa border border-apa-line p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-apa-navy">{c.author}</span>
                <span className="text-apa-grey">{new Date(c.at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <p className="mt-1 text-sm text-apa-ink">{c.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
