"use client";
import type { Meal } from "@/content/restaurants";
import { MEAL_LABELS } from "@/app/lib/meal-time";
import { useDiscovery } from "./DiscoveryContext";

const MEALS: Meal[] = ["breakfast", "lunch", "dinner"];
const ICONS: Record<Meal, string> = { breakfast: "☀︎", lunch: "◐", dinner: "☾" };

/** See all / Breakfast / Lunch / Dinner buttons. The current meal carries a
 *  "Now" tag; choosing a meal filters the list, "See all" shows every kitchen. */
export function MealSwitch({ scroll = false, className = "" }: { scroll?: boolean; className?: string }) {
  const { filters, updateFilters, moment } = useDiscovery();
  return <div className={`meal-switch ${className}`} role="group" aria-label="Show kitchens for a meal">
    <button type="button" aria-pressed={!filters.meal} onClick={() => updateFilters({ meal: "" }, scroll)}>See all</button>
    {MEALS.map(meal => <button key={meal} type="button" aria-pressed={filters.meal === meal}
      onClick={() => updateFilters({ meal: filters.meal === meal ? "" : meal, open: false }, scroll)}>
      <span className="meal-icon" aria-hidden="true">{ICONS[meal]}</span>{MEAL_LABELS[meal]}
      {moment?.meal === meal && <span className="meal-now">{moment.lateNight ? "Late" : "Now"}</span>}
    </button>)}
  </div>;
}

/** The strip at the top of the page: a greeting for the time of day and the meal buttons. */
export function MealBar() {
  const { moment } = useDiscovery();
  return <section className={`meal-bar meal-bar-${moment?.lateNight ? "late" : moment?.meal ?? "day"}`} aria-labelledby="meal-bar-heading">
    <div className="site-container meal-bar-inner">
      <div className="meal-bar-copy">
        <h2 id="meal-bar-heading">{moment?.greeting ?? "Welcome to Bellwood."}</h2>
        <p>{moment?.line ?? "What are you hungry for?"}</p>
      </div>
      <MealSwitch scroll />
    </div>
  </section>;
}
