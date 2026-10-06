"use client";

import { useEffect, useRef, useState } from "react";
import type { RestaurantReviews } from "@/app/lib/google-reviews";

/** Fetch only for visible cards. Never substitute directory scores or sample quotes. */
export function CardGoogleReview({ slug, name, address }: { slug: string; name: string; address: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<RestaurantReviews | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      fetch(`/api/restaurants/${encodeURIComponent(slug)}/reviews`, { signal: controller.signal, cache: "no-store" })
        .then(response => { if (!response.ok) throw new Error("Unavailable"); return response.json() as Promise<RestaurantReviews>; })
        .then(data => { if (!controller.signal.aborted) setResult(data); })
        .catch(() => {});
    }, { rootMargin: "100px" });
    if (ref.current) observer.observe(ref.current);
    return () => { observer.disconnect(); controller.abort(); };
  }, [slug]);
  const url = result?.url ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`;
  const review = result?.available ? result.reviews[0] : undefined;
  const excerpt = review && (review.text.length > 180 ? `${review.text.slice(0, 180).replace(/\s+\S*$/, "")}…` : review.text);
  return <div ref={ref} className="card-google-review" aria-label={`Google reviews for ${name}`}>
    {result?.available && result.rating !== undefined ? <a className="card-google-rating" href={url} target="_blank" rel="noopener noreferrer" aria-label={`${name}: average ${result.rating.toFixed(1)} out of 5 on Google Maps${result.count !== undefined ? `, ${result.count} ratings` : ""}`}>
      <span className="card-star-meter" aria-hidden="true"><span>★★★★★</span><span className="card-star-fill" style={{ width: `${result.rating / 5 * 100}%` }}>★★★★★</span></span><strong>{result.rating.toFixed(1)}</strong><span className="google-attribution" translate="no">Google Maps</span>{result.count !== undefined && <small>({result.count.toLocaleString()})</small>}
    </a> : <a className="card-google-link" href={url} target="_blank" rel="noopener noreferrer">Google reviews ↗</a>}
    {review && <figure>
      <blockquote><a href={review.url} target="_blank" rel="noopener noreferrer" aria-label={`Read the full Google review by ${review.author}`} title="Excerpt from the first written review in Google relevance order">“{excerpt}”</a></blockquote>
      <figcaption>{review.avatar && <img src={review.avatar} alt="" width={24} height={24} loading="lazy" referrerPolicy="no-referrer" />}{review.authorUrl ? <a href={review.authorUrl} target="_blank" rel="noopener noreferrer">{review.author}</a> : review.author}</figcaption>
    </figure>}
  </div>;
}
