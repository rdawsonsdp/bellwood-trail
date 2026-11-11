import type { MenuItem } from "@/content/menus";

const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A dish name with the searched words marked. */
export function DishName({ name, words = [] }: { name: string; words?: string[] }) {
  if (!words.length) return <>{name}</>;
  const parts = name.split(new RegExp(`(${words.map(escape).join("|")})`, "ig"));
  return <>{parts.map((part, i) => i % 2 ? <mark key={i}>{part}</mark> : part)}</>;
}

/** Menu lines the way a carryout menu prints them: dish, dot leader, price. */
export function MenuRows({ items, words, descriptions = false, focus }: { items: MenuItem[]; words?: string[]; descriptions?: boolean; focus?: string }) {
  return <ul className="menu-rows">{items.map((item, i) => <li key={`${item.name}-${i}`} data-dish={item.name} className={focus === item.name ? "is-focus" : undefined}>
    <div className="menu-row">
      <span className="menu-dish"><DishName name={item.name} words={words} /></span>
      {item.price && <><span className="menu-leader" aria-hidden="true" /><span className="menu-price">{item.price}</span></>}
    </div>
    {descriptions && item.description && <p className="menu-desc"><DishName name={item.description} words={words} /></p>}
  </li>)}</ul>;
}
