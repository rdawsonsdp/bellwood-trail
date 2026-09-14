"use client";
import { useEffect, useState } from "react";
import type { RestaurantReviews as ReviewData } from "@/app/lib/google-reviews";

export function RestaurantReviews({ slug, name, address }: { slug: string; name: string; address: string }) {
  const [result, setResult] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const fallback = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`;
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setResult(null);
    fetch(`/api/restaurants/${encodeURIComponent(slug)}/reviews`, { signal: controller.signal, cache: "no-store" })
      .then(response => { if (!response.ok) throw new Error("Unavailable"); return response.json() as Promise<ReviewData>; })
      .then(data => { if (!controller.signal.aborted) setResult(data); })
      .catch(() => {})
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [slug]);
  return <section className="restaurant-reviews" aria-label={`Google reviews for ${name}`}>
    <div className="reviews-heading"><h3>Google reviews</h3><span className="google-attribution" translate="no">Google Maps</span></div>
    {loading ? <p role="status">Loading reviews…</p> : <>
      {result?.available && result.rating !== undefined && <p className="reviews-rating"><span aria-hidden="true">★</span> <strong>{result.rating.toFixed(1)}</strong> / 5{result.count !== undefined && <span> · {result.count.toLocaleString()} Google reviews</span>}</p>}
      {!!result?.reviews.length && <p className="reviews-order">Up to 3 written reviews, ordered by Google relevance.</p>}
      <div className="restaurant-review-list">{result?.reviews.map(review => <article className="restaurant-review" key={review.id}>
        <div className="review-author">{review.avatar && <img src={review.avatar} alt="" width={32} height={32} loading="lazy" referrerPolicy="no-referrer" />}<div>{review.authorUrl ? <a href={review.authorUrl} target="_blank" rel="noopener noreferrer">{review.author}<span className="sr-only"> — Google profile, opens in a new tab</span></a> : <strong>{review.author}</strong>}<span>{review.date}</span></div></div>
        <p className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(Math.round(review.rating))}<span aria-hidden="true">{"☆".repeat(5 - Math.round(review.rating))}</span></p>
        <ReviewText text={review.text} />
        <a className="review-source" href={review.url} target="_blank" rel="noopener noreferrer">Read on Google<span className="sr-only"> — opens in a new tab</span> ↗</a>
      </article>)}</div>
      {!result?.reviews.length && <p className="reviews-unavailable">{result?.available ? "No written reviews available here yet." : "Reviews aren’t available here right now."}</p>}
    </>}
    <div className="reviews-links"><a href={result?.url ?? fallback} target="_blank" rel="noopener noreferrer">See all reviews on Google ↗</a><a href="/review-information" target="_blank" rel="noopener noreferrer">About these reviews<span className="sr-only"> — opens in a new tab</span></a></div>
  </section>;
}
function ReviewText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const long = text.length > 220;
  return <><blockquote className={!expanded && long ? "review-collapsed" : ""}>{text}</blockquote>{long && <button className="review-expand" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "Show less" : "Read more"}</button>}</>;
}
