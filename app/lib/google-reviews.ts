export interface GoogleReview {
  id: string;
  text: string;
  rating: number;
  author: string;
  authorUrl?: string;
  avatar?: string;
  date: string;
  url: string;
}
export interface RestaurantReviews {
  reviews: GoogleReview[];
  url: string;
  rating?: number;
  count?: number;
  available: boolean;
}
type Place = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: Array<{
    name?: string;
    originalText?: { text?: string };
    text?: { text?: string };
    rating?: number;
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
    relativePublishTimeDescription?: string;
    googleMapsUri?: string;
  }>;
};
export function safeGoogleUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && /(^|\.)(google\.com|googleusercontent\.com|gstatic\.com)$/.test(url.hostname) ? url.href : undefined;
  } catch { return undefined; }
}
/* Street words Google spells out and the stops store abbreviated, collapsed to
 * one spelling before comparison. "saint" and "street" both fold to "st",
 * which is the convention both sides already use: Bellwood's own listings
 * write "St Charles Rd" while Google returns "Saint Charles Road". Without
 * road/saint here, every stop on St. Charles Road would fail to match. */
const STREET_WORDS: Record<string, string> = {
  street: "st", saint: "st", avenue: "ave", road: "rd", drive: "dr",
  boulevard: "blvd", court: "ct", lane: "ln", place: "pl", parkway: "pkwy",
  highway: "hwy", terrace: "ter",
  east: "e", west: "w", south: "s", north: "n",
};
const normalized = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9 ]/g, " ").replace(new RegExp(`\\b(${Object.keys(STREET_WORDS).join("|")})\\b`, "g"), word => STREET_WORDS[word]).replace(/\b(barbecue|barbeque|bar b q)\b/g, "bbq").replace(/\bcafes\b/g, "cafe").replace(/\s+/g, " ").trim();
/** A search result is not enough: require the same street and business name. */
export function matchesRestaurant(place: Place, restaurant: { name: string; address: string }) {
  const street = normalized(restaurant.address.split(",")[0]);
  const resultStreet = normalized((place.formattedAddress ?? "").split(",")[0]);
  const postcode = restaurant.address.match(/\b\d{5}\b/)?.[0];
  const expected = normalized(restaurant.name).split(" ").filter(word => word.length > 1 && !["the", "and"].includes(word));
  const found = normalized(place.displayName?.text ?? "").split(" ");
  return street === resultStreet && !!postcode && (place.formattedAddress ?? "").includes(postcode) && expected.length > 0 && expected.filter(word => found.includes(word)).length / expected.length >= 0.75;
}
export function reviewSelection(place: Place, fallbackUrl: string): RestaurantReviews {
  const reviews = (place.reviews ?? []).flatMap((review): GoogleReview[] => {
    const text = review.originalText?.text ?? review.text?.text;
    const author = review.authorAttribution?.displayName;
    const url = safeGoogleUrl(review.googleMapsUri);
    if (!text?.trim() || !author || !url || !review.rating || review.rating < 1 || review.rating > 5) return [];
    return [{ id: review.name ?? url, text, author, url, rating: review.rating,
      authorUrl: safeGoogleUrl(review.authorAttribution?.uri), avatar: safeGoogleUrl(review.authorAttribution?.photoUri),
      date: review.relativePublishTimeDescription ?? "" }];
  }).filter((review, index, all) => all.findIndex(other => other.id === review.id) === index).slice(0, 3);
  return { available: true, reviews, url: safeGoogleUrl(place.googleMapsUri) ?? fallbackUrl,
    rating: typeof place.rating === "number" && place.rating >= 1 && place.rating <= 5 ? place.rating : undefined,
    count: Number.isInteger(place.userRatingCount) && place.userRatingCount! >= 0 ? place.userRatingCount : undefined };
}

export async function fetchRestaurantReviews(restaurant: { name: string; address: string }, key: string): Promise<RestaurantReviews> {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name} ${restaurant.address}`)}`;
  // Fetch only when a visitor opens details. Never persist or cache review content.
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST", cache: "no-store", signal: AbortSignal.timeout(8000),
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.reviews" },
    body: JSON.stringify({ textQuery: `${restaurant.name}, ${restaurant.address}`, languageCode: "en", regionCode: "US", pageSize: 3 }),
  });
  if (!response.ok) throw new Error(`Google Places request failed (${response.status})`);
  const data = await response.json() as { places?: Place[] };
  const matches = (data.places ?? []).filter(place => matchesRestaurant(place, restaurant));
  // Ambiguous or moved locations need correction, never another branch's reviews.
  if (matches.length !== 1) return { available: false, reviews: [], url };
  return reviewSelection(matches[0], url);
}
