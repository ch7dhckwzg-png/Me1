import { Composition } from 'remotion'
import '@fontsource/saira-stencil-one/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import { CatalyzeIntro } from './CatalyzeIntro.jsx'
import { DURATION, FPS } from './timing.js'

// Remotion Studio entry (npm run intro:studio). The site itself plays the same
// composition through @remotion/player, sized to the visitor's viewport.
export const RemotionRoot = () => (
  <>
    <Composition
      id="CatalyzeIntro"
      component={CatalyzeIntro}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="CatalyzeIntroPhone"
      component={CatalyzeIntro}
      durationInFrames={DURATION}
      fps={FPS}
      width={500}
      height={1080}
    />
  </>
)
