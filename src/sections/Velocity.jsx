import { ScrollVelocityRow } from '@/components/ui/scroll-based-velocity'

const BOLD = ['Branding', 'Web design', 'Photography', 'Motion', 'Marketing']
const SOFT = ['Logos', 'Menus', 'Packaging', 'Headshots', 'Websites', 'Social media']

const Spark = () => (
  <svg className="band-spark" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 0 L12.4 7.6 L20 10 L12.4 12.4 L10 20 L7.6 12.4 L0 10 L7.6 7.6 Z" fill="currentColor" />
  </svg>
)

/**
 * Two crossing bands (Magic UI scroll velocity), one bold and one soft, racing in
 * opposite directions and quickening as you scroll.
 */
export default function Velocity({ reducedMotion }) {
  const speed = reducedMotion ? 0 : 2
  return (
    <section className="bands" aria-label={[...BOLD, ...SOFT].join(', ')}>
      <div className="band band-bold">
        <ScrollVelocityRow baseVelocity={speed} direction={1} scrollReactivity={!reducedMotion}>
          {BOLD.map((w) => (
            <span className="band-word" key={w} aria-hidden="true">{w}<Spark /></span>
          ))}
        </ScrollVelocityRow>
      </div>
      <div className="band band-soft">
        <ScrollVelocityRow baseVelocity={speed} direction={-1} scrollReactivity={!reducedMotion}>
          {SOFT.map((w) => (
            <span className="band-word" key={w} aria-hidden="true">{w}<Spark /></span>
          ))}
        </ScrollVelocityRow>
      </div>
    </section>
  )
}
