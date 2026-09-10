import type { DayHours } from "@/content/restaurants";

export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** 690 -> "11:30 AM", 1500 -> "1 AM" (a close past midnight). */
export function formatTime(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const suffix = h24 < 12 ? "AM" : "PM";
  const h12 = ((h24 + 11) % 12) + 1;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${suffix}` : `${h12} ${suffix}`;
}

export function formatRange(d: DayHours): string {
  return d ? `${formatTime(d[0])} – ${formatTime(d[1])}` : "Closed";
}

/** Current weekday and minutes past midnight, in the trail's own timezone. */
export function chicagoNow(): { day: number; minutes: number } {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  const day = DAY_SHORT.indexOf(g("weekday") as (typeof DAY_SHORT)[number]);
  return { day: day < 0 ? 0 : day, minutes: parseInt(g("hour") || "0", 10) * 60 + parseInt(g("minute") || "0", 10) };
}

export interface OpenState { open: boolean; label: string; short: string }

/**
 * "Open now · until 9 PM" / "Closed · opens Fri 9 AM". Understands closes past
 * midnight (Harold's runs to 1 AM): a close > 1440 counts, and the previous
 * day's late spillover keeps a kitchen "open" at 12:30 AM.
 */
export function openState(schedule: DayHours[]): OpenState {
  const { day, minutes } = chicagoNow();
  const today = schedule[day];
  if (today && minutes >= today[0] && minutes < today[1])
    return { open: true, label: `Open now · until ${formatTime(today[1])}`, short: `until ${formatTime(today[1])}` };
  const prev = schedule[(day + 6) % 7];
  if (prev && prev[1] > 1440 && minutes < prev[1] - 1440)
    return { open: true, label: `Open now · until ${formatTime(prev[1])}`, short: `until ${formatTime(prev[1])}` };
  for (let i = 0; i < 7; i++) {
    const idx = (day + i) % 7; const s = schedule[idx];
    if (!s) continue;
    if (i === 0 && minutes >= s[0]) continue;
    const when = idx === day ? "" : idx === (day + 1) % 7 ? "tomorrow " : `${DAY_SHORT[idx]} `;
    return { open: false, label: `Closed · opens ${when}${formatTime(s[0])}`, short: `opens ${when}${formatTime(s[0])}` };
  }
  return { open: false, label: "Closed", short: "closed" };
}
