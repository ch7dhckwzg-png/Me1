import Rings from '@/components/kinetic/Rings'

/** Why one studio: the statement, with activity rings that close once as they come into view. */
export default function Statement({ reducedMotion }) {
  return (
    <section className="section statement-wrap" id="about">
      <div className="wrap statement-grid">
        <p className="statement">
          Most businesses juggle a designer, a web developer, a photographer and someone for
          social media. We do all of it under one roof, so your logo, your website, your photos
          and your posts finally look like they belong to the same business.
        </p>
        <Rings reducedMotion={reducedMotion} />
      </div>
    </section>
  )
}
