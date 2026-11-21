import { ScrollVelocityRow } from '@/components/ui/scroll-based-velocity'
import Spark from '@/components/kinetic/Spark'

const BOLD = ['Branding', 'Web design', 'Photography', 'Motion', 'Marketing']
const SOFT = ['Logos', 'Menus', 'Packaging', 'Headshots', 'Websites', 'Social media']


/**
 * Two crossing bands (Magic UI scroll velocity), one bold and one soft, drifting in
 * opposite directions at a steady pace (they do not react to scrolling).
 */
export default function Velocity({ reducedMotion }) {
  const speed = reducedMotion ? 0 : 1.6
  return (
    <section className="bands" aria-label={[...BOLD, ...SOFT].join(', ')}>
      <div className="band band-bold">
        <ScrollVelocityRow baseVelocity={speed} direction={1} scrollReactivity={false}>
          {BOLD.map((w) => (
            <span className="band-word" key={w} aria-hidden="true">{w}<Spark className="band-spark" /></span>
          ))}
        </ScrollVelocityRow>
      </div>
      <div className="band band-soft">
        <ScrollVelocityRow baseVelocity={speed} direction={-1} scrollReactivity={false}>
          {SOFT.map((w) => (
            <span className="band-word" key={w} aria-hidden="true">{w}<Spark className="band-spark" /></span>
          ))}
        </ScrollVelocityRow>
      </div>
    </section>
  )
}
