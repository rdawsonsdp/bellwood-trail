import type { Meal } from "@/content/restaurants";
import { chicagoNow } from "@/app/lib/hours";

export type MealMoment = { meal: Meal; lateNight: boolean; greeting: string; line: string };

/** Which meal it is in Bellwood right now: breakfast 5–11, lunch 11–4,
 *  dinner from 4, and "late night" (still dinner) from 10 PM to 5 AM. */
export function mealMoment(minutes = chicagoNow().minutes): MealMoment {
  if (minutes >= 5 * 60 && minutes < 11 * 60) return { meal: "breakfast", lateNight: false, greeting: "Good morning, Bellwood.", line: "Breakfast is on. Eggs, tacos and coffee, close to home." };
  if (minutes >= 11 * 60 && minutes < 16 * 60) return { meal: "lunch", lateNight: false, greeting: "Good afternoon, Bellwood.", line: "It’s lunchtime. Here’s who’s cooking right now." };
  if (minutes >= 16 * 60 && minutes < 22 * 60) return { meal: "dinner", lateNight: false, greeting: "Good evening, Bellwood.", line: "Dinner time. Pull up a chair or take it home." };
  return { meal: "dinner", lateNight: true, greeting: "Up late, Bellwood?", line: "These kitchens are still cooking." };
}

export const MEAL_LABELS: Record<Meal, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };
