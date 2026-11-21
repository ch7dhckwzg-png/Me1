import { useEffect, useRef } from 'react'
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  EquirectangularReflectionMapping,
  SRGBColorSpace,
  Group,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  Scene,
  WebGLRenderer,
} from 'three'
import { gsap } from 'gsap'

/*
 * The hero's WebGL scene: the four-point spark from the Catalyze logo as a faceted,
 * polished gold star, and streaks of light rushing past it.
 *
 * When `go` turns true it warps in: the streaks race, the star spins up and scales in,
 * then everything decelerates to a slow cruise. Scrolling fast boosts the streaks
 * again; scrolling through the hero pushes the camera in. Rendering pauses when the
 * hero is off screen or the tab is hidden.
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

/** A bevelled four-point star: eight outline points, a ridge apex on each side. */
function starGeometry() {
  const outline = []
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + Math.PI / 2
    const r = i % 2 === 0 ? 1.65 : 0.5
    outline.push([Math.cos(a) * r, Math.sin(a) * r])
  }
  const top = [0, 0, 0.46]
  const bottom = [0, 0, -0.46]
  const pos = []
  for (let i = 0; i < 8; i++) {
    const [x1, y1] = outline[i]
    const [x2, y2] = outline[(i + 1) % 8]
    pos.push(...top, x1, y1, 0, x2, y2, 0)
    pos.push(...bottom, x2, y2, 0, x1, y1, 0)
  }
  const g = new BufferGeometry()
  g.setAttribute('position', new Float32BufferAttribute(pos, 3))
  g.computeVertexNormals() // non-indexed, so every facet gets its own flat normal
  return g
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

export default function StarScene({ go = false, onFail, onReady }) {
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

    const star = new Mesh(
      starGeometry(),
      // Standard (not physical) material: a much smaller shader, so it compiles quickly.
      new MeshStandardMaterial({
        color: new Color('#DB7A42'),
        metalness: 1,
        roughness: 0.3,
        envMapIntensity: 1.35,
        flatShading: true,
      }),
    )
    star.scale.setScalar(0.001) // grown in by the warp
    // The group sizes the star to the viewport, separately from the warp's scale-in.
    const rig = new Group()
    rig.add(star)
    scene.add(rig)

    const key = new DirectionalLight('#FFF4E0', 1.6)
    key.position.set(-3, 4, 5)
    const rim = new PointLight('#FF8A4C', 40, 12)
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
    const gold = new Color('#E07A45')
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
    const state = { warp: 0, spin: 0, boost: 0, tiltX: 0, tiltY: 0, pointerX: 0, pointerY: 0 }
    let visible = true
    let running = false // nothing is drawn until the warp starts
    let lastScroll = window.scrollY
    let wide = true

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      wide = w / h > 1.15
      rig.scale.setScalar(Math.min(1, (w / h) * 1.3))
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)

    const onPointer = (e) => {
      state.pointerX = e.clientX / window.innerWidth - 0.5
      state.pointerY = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const tick = (_time, deltaMs) => {
      if (!running || !visible || document.hidden) return
      const dt = Math.min(deltaMs, 50) / 1000

      // Scroll speed adds a burst of speed; scroll position pushes the camera in.
      const sy = window.scrollY
      const v = Math.abs(sy - lastScroll) / Math.max(dt, 0.001)
      lastScroll = sy
      state.boost += (Math.min(1, v / 2400) - state.boost) * 0.08
      const progress = Math.min(1, sy / Math.max(1, el.clientHeight))

      const speed = 0.7 + state.warp * 48 + state.boost * 14
      for (let i = 0; i < STREAKS; i++) {
        s.z[i] += speed * dt
        if (s.z[i] > 7.5) spawn(s, i, FAR)
        const stretch = s.len[i] * (0.5 + state.warp * 7 + state.boost * 2.5)
        linePos.set([s.x[i], s.y[i], s.z[i], s.x[i], s.y[i], s.z[i] - stretch], i * 6)
      }
      lineGeo.attributes.position.needsUpdate = true

      // The star: spin that decays from the warp, plus a lean towards the pointer.
      state.tiltX += (state.pointerY * 0.5 - state.tiltX) * 0.06
      state.tiltY += (state.pointerX * 0.7 - state.tiltY) * 0.06
      star.rotation.y += dt * (0.32 + state.spin * 10 + state.boost * 1.5)
      star.rotation.x = state.tiltX + Math.sin(_time * 0.6) * 0.08
      star.rotation.z = progress * 0.9
      rig.position.x = wide ? 1.95 : 0
      rig.position.y = (wide ? 0.32 : 0.95) + Math.sin(_time * 0.9) * 0.06 + progress * 1.2
      camera.position.z = 7 - progress * 2.4
      camera.rotation.y = state.tiltY * -0.04

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
      window.removeEventListener('pointermove', onPointer)
      gsap.killTweensOf([state, lineMat, star.scale])
      star.geometry.dispose()
      star.material.dispose()
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

  return <div className="star-scene" ref={host} aria-hidden="true" />
}
