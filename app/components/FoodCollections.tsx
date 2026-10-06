"use client";
import { FOOD_CATEGORIES } from "@/content/restaurants";
import type { Stop } from "@/app/lib/live-status";
import { inCategory } from "@/app/lib/discovery";
import { useDiscovery } from "./DiscoveryContext";

export function FoodCollections({ stops }: { stops: Stop[] }) {
  const { filters, updateFilters } = useDiscovery();
  const categories = FOOD_CATEGORIES.filter(category => stops.some(stop => inCategory(stop, category.key)));
  return <section className="site-container craving-section" aria-labelledby="collections-heading">
    <h2 id="collections-heading">Follow your craving.</h2>
    <div className="craving-pills" role="group" aria-label="Filter restaurants by food category">
      <button type="button" aria-pressed={filters.foods.length === 0} onClick={() => updateFilters({ foods: [] }, true)}>All food</button>
      {categories.map(category => <button type="button" key={category.key} aria-pressed={filters.foods.includes(category.key)} onClick={() => updateFilters({ foods: filters.foods.includes(category.key) ? [] : [category.key] }, true)}>{category.label}</button>)}
    </div>
  </section>;
}
