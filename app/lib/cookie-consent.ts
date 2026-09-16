export const CONSENT_COOKIE = "gci_cookie_preferences";
export const CONSENT_EVENT = "gci-cookie-preferences-changed";
export type CookieConsent = { version: 1; favorites: boolean };

export function readConsent(cookie: string): CookieConsent | null {
  const value = cookie.split(";").map(part => part.trim()).find(part => part.startsWith(`${CONSENT_COOKIE}=`))?.slice(CONSENT_COOKIE.length + 1);
  if (!value) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    return parsed?.version === 1 && typeof parsed.favorites === "boolean" ? { version: 1, favorites: parsed.favorites } : null;
  } catch { return null; }
}

export function saveConsent(favorites: boolean) {
  const consent: CookieConsent = { version: 1, favorites };
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(consent))}; Path=/; Max-Age=15552000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
