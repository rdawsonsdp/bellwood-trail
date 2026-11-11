/* ===== Featured restaurants =====
 * Stops the trail leads with. A featured stop is listed first and its card
 * carries a "Featured" tag. Kept apart from the seed, like galleries.ts, so
 * an /admin save cannot drop it.
 *
 * `comingSoon` is for a restaurant that has been announced but whose opening
 * is not confirmed. Its card says "Opening soon" instead of showing open or
 * closed from hours nobody can vouch for yet, and it is never counted as open.
 * Delete the flag the day the doors open. */
export interface Featured {
  comingSoon?: boolean;
  /** One line shown on the card and in the sheet. */
  note?: string;
}

export const FEATURED: Record<string, Featured> = {
  // Announced for 2712 St. Charles Road; the opening date has not been confirmed.
  varis: { comingSoon: true, note: "Opening soon at 2712 St. Charles Road. The opening date has not been announced." },
};
