import Image from "next/image";

// Original welcome copy drafted for the site; not a sourced quotation.
export function MayorWelcome() {
  return <section className="mayor-welcome" aria-labelledby="mayor-welcome-title">
    <div className="site-container mayor-welcome-inner">
      <Image className="mayor-welcome-photo" src="/images/brand/mayor-harvey.jpeg" alt="Mayor André F. Harvey" width={495} height={619} sizes="(max-width: 540px) 88px, 128px" />
      <div className="mayor-welcome-copy">
        <p className="mayor-welcome-eyebrow">A welcome from Mayor Harvey</p>
        <h2 id="mayor-welcome-title">A place at our table.</h2>
        <p className="mayor-welcome-message">Welcome to Bellwood. Our local restaurants bring flavor, warmth, and community to our village. I invite you to pull up a chair, discover a new favorite, and support the neighbors who make dining here special.</p>
        <p className="mayor-welcome-signature"><a href="https://www.vil.bellwood.il.us/government/mayor/">André F. Harvey</a><span>Mayor, Village of Bellwood</span></p>
      </div>
    </div>
  </section>;
}
