import { getContent } from "@/app/lib/content-store";
import { fetchRestaurantReviews } from "@/app/lib/google-reviews";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { restaurants } = await getContent();
  const restaurant = restaurants.find(stop => stop.slug === slug && !stop.hidden);
  if (!restaurant) return Response.json({ error: "Restaurant not found" }, { status: 404, headers });
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return Response.json({ error: "Reviews unavailable" }, { status: 503, headers });
  try {
    return Response.json(await fetchRestaurantReviews(restaurant, key), { headers });
  } catch {
    // Do not expose API keys, upstream response bodies, or infrastructure errors.
    return Response.json({ error: "Reviews unavailable" }, { status: 503, headers });
  }
}
