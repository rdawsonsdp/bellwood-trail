import type { Metadata } from "next";
export const metadata: Metadata = { title: "Cookies and storage" };
export default function CookieInformation() {
  return <article className="site-container cookie-information">
    <h1>Cookies and storage</h1>
    <p>The Bellwood Culinary Path uses the following browser storage. You can change your choice using Cookie settings in the footer.</p>
    <h2>Necessary cookies</h2>
    <p>The bellwood_cookie_preferences cookie records your cookie choice for up to 180 days. It does not contain your name or a visitor identifier. Administrators who sign in receive a separate authentication cookie lasting up to 12 hours.</p>
    <h2>Optional favorites storage</h2>
    <p>If you allow “Remember favorites,” restaurant IDs are saved in this browser’s local storage under bellwood-saved-kitchens-v1. This list is not sent to our server. It remains until you clear it, clear browser data, or turn this option off. If you choose “Only necessary,” favorites work for the current visit and are lost when you reload or leave.</p>
    <h2>Analytics and advertising</h2>
    <p>This app does not install analytics or advertising cookies. Accepting all currently enables only the optional favorites storage described above.</p>
    <h2>External services</h2>
    <p>Map tiles are requested from OpenStreetMap. Restaurant reviews may include images served by Google. Those providers receive information needed to deliver their content, such as your IP address. Opening directions, restaurant websites, or other external links takes you to services with their own privacy and cookie practices.</p>
    <p><a href="/">Return to the trail</a></p>
  </article>;
}
