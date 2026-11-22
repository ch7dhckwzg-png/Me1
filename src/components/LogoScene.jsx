import { useEffect, useRef } from 'react'
import {
  AdditiveBlending,
  Box3,
  BufferGeometry,
  CanvasTexture,
  EquirectangularReflectionMapping,
  SRGBColorSpace,
  Group,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  Scene,
  Shape,
  Vector3,
  WebGLRenderer,
} from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { gsap } from 'gsap'
import logoSvg from '@/assets/logo.svg?raw'

/*
 * The hero's WebGL scene: the Catalyze logo as a solid badge (orange outline, cream
 * letters, a dark plate behind them) and streaks of light rushing past it.
 *
 * When `go` turns true it warps in: the streaks race, the badge spins up and scales in,
 * then everything settles into a slow sway. It never follows the pointer or the scroll.
 * Rendering pauses when the hero is off screen or the tab is hidden.
 */

const STREAKS = 220

/**
 * A tiny painted studio for the gold to reflect: dark above, a cream softbox up and to
 * the left, warm gold light bouncing up from the floor. Far cheaper to prepare than a
 * rendered environment, and it gives the reflections exactly the brand's colours.
 */
function studioTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 128
  const g = c.getContext('2d')
  const sky = g.createLinearGradient(0, 0, 0, 128)
  sky.addColorStop(0, '#221a15')
  sky.addColorStop(0.45, '#5e3a24')
  sky.addColorStop(0.75, '#b0582a')
  sky.addColorStop(1, '#ffc79a')
  g.fillStyle = sky
  g.fillRect(0, 0, 256, 128)
  const box = g.createRadialGradient(70, 34, 4, 70, 34, 56)
  box.addColorStop(0, '#fffaf0')
  box.addColorStop(1, 'rgba(255, 250, 240, 0)')
  g.fillStyle = box
  g.fillRect(0, 0, 256, 128)
  const rim = g.createRadialGradient(196, 66, 4, 196, 66, 46)
  rim.addColorStop(0, '#ff9a5c')
  rim.addColorStop(1, 'rgba(255, 154, 92, 0)')
  g.fillStyle = rim
  g.fillRect(0, 0, 256, 128)
  const tex = new CanvasTexture(c)
  tex.mapping = EquirectangularReflectionMapping
  tex.colorSpace = SRGBColorSpace
  return tex
}
const FAR = -70

const ORANGE = '#FF6E00'
const CREAM = '#F1EBDD'
const LOGO_WIDTH = 3.15 // world units

/**
 * Builds the badge from the logo SVG, so it is always the real mark: the outline and the
 * letters are its two paths. The plate is the outline's outer edge, filled, set back.
 */
function logoGeometries() {
  const { paths } = new SVGLoader().parse(logoSvg)
  // The SVG draws the letters first, then the outline on top.
  const [letterPath, ringPath] = paths
  const ringShapes = SVGLoader.createShapes(ringPath)
  const letterShapes = SVGLoader.createShapes(letterPath)
  // The plate: the outer contour of the outline (its largest shape), with no holes.
  const outer = ringShapes.reduce((a, b) => (area(b) > area(a) ? b : a))
  const plateShape = new Shape(outer.getPoints(24))

  const extrude = (shapes, depth, bevel) =>
    new ExtrudeGeometry(shapes, {
      depth,
      curveSegments: 6,
      bevelEnabled: bevel > 0,
      bevelThickness: bevel,
      bevelSize: bevel * 0.7,
      bevelSegments: 2,
    })
  const ring = extrude(ringShapes, 70, 10)
  // A hairline bevel only: anything bigger fills in the small halftone dots.
  const letters = extrude(letterShapes, 46, 1.2)
  const plate = extrude([plateShape], 26, 0)

  // SVG units, y down -> world units, y up, centred.
  const box = new Box3().setFromBufferAttribute(ring.attributes.position)
  const c = box.getCenter(new Vector3())
  const k = LOGO_WIDTH / (box.max.x - box.min.x)
  for (const g of [ring, letters, plate]) {
    g.translate(-c.x, -c.y, 0)
    g.scale(k, -k, k)
    g.computeVertexNormals()
  }
  // Flipping y turns the faces inside out; put the winding back.
  for (const g of [ring, letters, plate]) flipWinding(g)
  ring.translate(0, 0, -70 * k * 0.5)
  letters.translate(0, 0, -46 * k * 0.5)
  plate.translate(0, 0, -70 * k * 0.5)
  return { ring, letters, plate }
}

function area(shape) {
  const pts = shape.getPoints(8)
  let a = 0
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) a += (pts[j].x + pts[i].x) * (pts[j].y - pts[i].y)
  return Math.abs(a / 2)
}

function flipWinding(g) {
  const idx = g.index
  if (idx) {
    for (let i = 0; i < idx.count; i += 3) {
      const t = idx.getX(i + 1)
      idx.setX(i + 1, idx.getX(i + 2))
      idx.setX(i + 2, t)
    }
    idx.needsUpdate = true
  } else {
    const pos = g.attributes.position
    const nor = g.attributes.normal
    const uv = g.attributes.uv
    for (let i = 0; i < pos.count; i += 3) {
      for (const a of [pos, nor, uv]) {
        if (!a) continue
        for (let c = 0; c < a.itemSize; c++) {
          const t = a.array[(i + 1) * a.itemSize + c]
          a.array[(i + 1) * a.itemSize + c] = a.array[(i + 2) * a.itemSize + c]
          a.array[(i + 2) * a.itemSize + c] = t
        }
      }
    }
    pos.needsUpdate = true
  }
  g.computeVertexNormals()
}

function spawn(arr, i, z) {
  // Streaks travel in a hollow tube around the camera's line of sight.
  const a = Math.random() * Math.PI * 2
  const r = 1.6 + Math.random() * 9
  arr.x[i] = Math.cos(a) * r
  arr.y[i] = Math.sin(a) * r * 0.75
  arr.z[i] = z
  arr.len[i] = 0.4 + Math.random() * 1.2
}

export default function LogoScene({ go = false, onFail, onReady }) {
  const host = useRef(null)
  const api = useRef(null)

  useEffect(() => {
    const el = host.current
    let renderer
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      onFail?.()
      return undefined
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(38, 1, 0.1, 120)
    camera.position.set(0, 0, 7)

    const pmrem = new PMREMGenerator(renderer)
    const studio = studioTexture()
    const env = pmrem.fromEquirectangular(studio).texture
    studio.dispose()
    scene.environment = env

    const geo = logoGeometries()
    // Standard (not physical) materials: much smaller shaders, so they compile quickly.
    const mats = {
      ring: new MeshStandardMaterial({ color: new Color(ORANGE), metalness: 0.45, roughness: 0.32, envMapIntensity: 1.2 }),
      // Matte, with a touch of its own light, so the warm studio doesn't turn it tan.
      letters: new MeshStandardMaterial({ color: new Color(CREAM), emissive: new Color(CREAM), emissiveIntensity: 0.38, metalness: 0, roughness: 0.6, envMapIntensity: 0.3 }),
      plate: new MeshStandardMaterial({ color: new Color('#15110E'), metalness: 0.6, roughness: 0.38, envMapIntensity: 0.8 }),
    }
    const star = new Group()
    star.add(new Mesh(geo.ring, mats.ring), new Mesh(geo.letters, mats.letters), new Mesh(geo.plate, mats.plate))
    star.scale.setScalar(0.001) // grown in by the warp
    // The group sizes the star to the viewport, separately from the warp's scale-in.
    const rig = new Group()
    rig.add(star)
    scene.add(rig)

    const key = new DirectionalLight('#FFF4E0', 1.6)
    key.position.set(-3, 4, 5)
    const rim = new PointLight('#FF7A1A', 40, 12)
    rim.position.set(2.5, -2.2, -1.5)
    scene.add(key, rim)

    // Light streaks: line segments whose length stretches with speed.
    const s = {
      x: new Float32Array(STREAKS),
      y: new Float32Array(STREAKS),
      z: new Float32Array(STREAKS),
      len: new Float32Array(STREAKS),
    }
    for (let i = 0; i < STREAKS; i++) spawn(s, i, FAR + Math.random() * (7 - FAR))
    const linePos = new Float32Array(STREAKS * 6)
    const lineCol = new Float32Array(STREAKS * 6)
    const gold = new Color('#FF6E00')
    const cream = new Color('#FFF8EA')
    for (let i = 0; i < STREAKS; i++) {
      const head = Math.random() < 0.3 ? cream : gold
      lineCol.set([head.r, head.g, head.b, 0, 0, 0], i * 6) // tail fades to black (additive)
    }
    const lineGeo = new BufferGeometry()
    lineGeo.setAttribute('position', new Float32BufferAttribute(linePos, 3))
    lineGeo.setAttribute('color', new Float32BufferAttribute(lineCol, 3))
    const lineMat = new LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: AdditiveBlending,
      depthWrite: false,
    })
    const streaks = new LineSegments(lineGeo, lineMat)
    scene.add(streaks)

    // State the timeline and input push around.
    const state = { warp: 0, spin: 0 }
    let visible = true
    let running = false // nothing is drawn until the warp starts
    let wide = true

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      wide = w / h > 1.15
      rig.scale.setScalar(Math.min(1, (w / h) * 1.12)) // narrow screens: keep the sway inside the frame
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)


    const tick = (_time, deltaMs) => {
      if (!running || !visible || document.hidden) return
      const dt = Math.min(deltaMs, 50) / 1000

      const speed = 0.7 + state.warp * 48
      for (let i = 0; i < STREAKS; i++) {
        s.z[i] += speed * dt
        if (s.z[i] > 7.5) spawn(s, i, FAR)
        const stretch = s.len[i] * (0.5 + state.warp * 7)
        linePos.set([s.x[i], s.y[i], s.z[i], s.x[i], s.y[i], s.z[i] - stretch], i * 6)
      }
      lineGeo.attributes.position.needsUpdate = true

      // The badge: a slow sway (never far enough to show its mirrored back), with the
      // warp's spin unwinding into it.
      star.rotation.y = Math.sin(_time * 0.45) * 0.42 - state.spin * Math.PI * 4
      star.rotation.x = -0.12 + Math.sin(_time * 0.6) * 0.06
      rig.position.x = wide ? 1.7 : 0
      rig.position.y = (wide ? 0.82 : 1.15) + Math.sin(_time * 0.9) * 0.05

      renderer.render(scene, camera)
    }
    gsap.ticker.add(tick)

    // Compile and draw once now (hidden under the intro's flash), then report ready.
    renderer.compile(scene, camera)
    renderer.render(scene, camera)
    const readyFrame = requestAnimationFrame(() => onReady?.())

    api.current = {
      warp: () => {
        running = true
        return gsap
          .timeline()
          .to(lineMat, { opacity: 0.7, duration: 0.35, ease: 'power1.out' }, 0)
          .fromTo(state, { warp: 1, spin: 1 }, { warp: 0, spin: 0, duration: 2.6, ease: 'expo.out' }, 0)
          .to(star.scale, { x: 1, y: 1, z: 1, duration: 1.4, ease: 'back.out(1.6)' }, 0.15)
          .to(lineMat, { opacity: 0.32, duration: 2.2, ease: 'power2.out' }, 0.9)
      },
    }

    return () => {
      cancelAnimationFrame(readyFrame)
      gsap.ticker.remove(tick)
      ro.disconnect()
      io.disconnect()
      gsap.killTweensOf([state, lineMat, star.scale])
      for (const g of Object.values(geo)) g.dispose()
      for (const m of Object.values(mats)) m.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      env.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      api.current = null
    }
  }, [onFail, onReady])

  // Declared after the setup effect, so on mount (even when the scene loads after the
  // hero was revealed) the API already exists when this runs.
  useEffect(() => {
    if (go) api.current?.warp()
  }, [go])

  return <div className="logo-scene" ref={host} aria-hidden="true" />
}
