import { ScrollVelocityContainer, ScrollVelocityRow } from '@/components/ui/scroll-based-velocity'
import { SERVICES } from '@/content'

const Spark = () => (
  <svg className="velocity-spark" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 0 L12.4 7.6 L20 10 L12.4 12.4 L10 20 L7.6 12.4 L0 10 L7.6 7.6 Z" fill="currentColor" />
  </svg>
)

/** Magic UI scroll-velocity strip: the four crafts race faster the faster you scroll. */
export default function Velocity({ reducedMotion }) {
  const words = SERVICES.map((s) => s.short)
  const speed = reducedMotion ? 0 : 3
  return (
    <section className="velocity" aria-label="Marketing, design, web and photography">
      <ScrollVelocityContainer>
        <ScrollVelocityRow baseVelocity={speed} direction={1} scrollReactivity={!reducedMotion}>
          {words.map((w) => (
            <span className="velocity-word" key={w}>{w}<Spark /></span>
          ))}
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={speed} direction={-1} scrollReactivity={!reducedMotion}>
          {words.map((w) => (
            <span className="velocity-word is-outline" key={w}>{w}<Spark /></span>
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </section>
  )
}
