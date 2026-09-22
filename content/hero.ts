export interface HeroContent { image: string; imageAlt: string }
/* Mickey's marquee at 635 Mannheim Road — a real Bellwood storefront, and a
 * stop on the trail. The source photograph is portrait, so it is baked into a
 * 16:9 frame against a blurred backdrop taken from the same image: the hero
 * slot is object-fit cover, and cropping a portrait into it would cut the sign
 * in half. Replace from /admin with any wider Bellwood photograph. */
export const DEFAULT_HERO: HeroContent = {
  image: "/images/brand/mickeys-sign-hero.jpg",
  imageAlt: "Mickey's illuminated marquee on Mannheim Road against a clear sky, lettered Famous Italian Beef, Sausage and Meat Balls, Hot Dogs, Polish Sausage, Est. 1959",
};
