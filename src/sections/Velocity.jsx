import { ScrollVelocityContainer, ScrollVelocityRow } from '@/components/ui/scroll-based-velocity'

const WORDS = ['Branding', 'Web design', 'Photography', 'Motion', 'Menus', 'Logos', 'Packaging', 'Social media']

const Spark = () => (
  <svg className="velocity-spark" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 0 L12.4 7.6 L20 10 L12.4 12.4 L10 20 L7.6 12.4 L0 10 L7.6 7.6 Z" fill="currentColor" />
  </svg>
)

/** Magic UI scroll-velocity strip: what we make, drifting slowly, quicker as you scroll. */
export default function Velocity({ reducedMotion }) {
  const speed = reducedMotion ? 0 : 1.4
  return (
    <section className="velocity" aria-label={WORDS.join(', ')}>
      <ScrollVelocityContainer>
        <ScrollVelocityRow baseVelocity={speed} direction={1} scrollReactivity={!reducedMotion}>
          {WORDS.map((w) => (
            <span className="velocity-word" key={w} aria-hidden="true">{w}<Spark /></span>
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </section>
  )
}
