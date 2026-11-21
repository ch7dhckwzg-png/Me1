import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  EquirectangularReflectionMapping,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import logoUrl from '@/assets/logo.svg'

/*
 * The opening scene: a laptop in brushed aluminium with a real keyboard, trackpad,
 * hinge and glass screen. It exposes the moving parts (laptop, lid hinge, camera,
 * screen power, beam) so the intro's GSAP timelines can choreograph them.
 */

const W = 3.2 // laptop width
const D = 2.2 // base depth
const H = 0.11 // base thickness
const LID_H = 2.1
const LID_T = 0.06

export const LID_CLOSED = Math.PI / 2
export const LID_OPEN = -0.3
export const LID_FLAT = -Math.PI / 2

const canvas = (w, h, draw) => {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 4
  return t
}

const roundRect = (g, x, y, w, h, r) => {
  g.beginPath()
  g.roundRect(x, y, w, h, r)
}

/** A painted studio for reflections: dark, a soft cream key light, a warm orange rim. */
function studio() {
  const t = canvas(512, 256, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#1a1714')
    sky.addColorStop(0.5, '#2c2622')
    sky.addColorStop(0.78, '#4a3a30')
    sky.addColorStop(1, '#16110e')
    g.fillStyle = sky
    g.fillRect(0, 0, w, h)
    const spot = (x, y, r, col) => {
      const gr = g.createRadialGradient(x, y, 2, x, y, r)
      gr.addColorStop(0, col)
      gr.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = gr
      g.fillRect(0, 0, w, h)
    }
    spot(150, 70, 110, 'rgba(255, 248, 236, 0.95)') // softbox
    spot(390, 120, 90, 'rgba(226, 110, 52, 0.9)') // orange rim
    spot(260, 30, 160, 'rgba(255, 255, 255, 0.25)')
  })
  t.mapping = EquirectangularReflectionMapping
  return t
}

function keyboardTexture() {
  return canvas(1536, 1024, (g, w) => {
    g.clearRect(0, 0, w, 1024)
    // Keyboard well
    g.fillStyle = 'rgba(0, 0, 0, 0.16)'
    roundRect(g, 96, 70, w - 192, 520, 18)
    g.fill()
    // Keys
    const rows = [
      { y: 86, h: 52, keys: Array(14).fill(1) },
      { y: 150, h: 76, keys: [1, ...Array(12).fill(1), 1.5] },
      { y: 236, h: 76, keys: [1.5, ...Array(12).fill(1), 1] },
      { y: 322, h: 76, keys: [1.8, ...Array(11).fill(1), 1.8] },
      { y: 408, h: 76, keys: [2.3, ...Array(10).fill(1), 2.3] },
      { y: 494, h: 76, keys: [1, 1, 1.2, 1.3, 5.6, 1.3, 1.2, 1, 1, 1] },
    ]
    const left = 112
    const right = w - 112
    for (const row of rows) {
      const gap = 10
      const total = row.keys.reduce((a, b) => a + b, 0)
      const unit = (right - left - gap * (row.keys.length - 1)) / total
      let x = left
      for (const k of row.keys) {
        const kw = k * unit
        g.fillStyle = '#18181a'
        roundRect(g, x, row.y, kw, row.h, 9)
        g.fill()
        g.fillStyle = 'rgba(255, 255, 255, 0.05)'
        roundRect(g, x + 2, row.y + 2, kw - 4, row.h * 0.45, 7)
        g.fill()
        x += kw + gap
      }
    }
    // Trackpad
    g.fillStyle = 'rgba(0, 0, 0, 0.07)'
    roundRect(g, w / 2 - 300, 640, 600, 330, 26)
    g.fill()
    g.strokeStyle = 'rgba(0, 0, 0, 0.22)'
    g.lineWidth = 3
    g.stroke()
  })
}

function shadowTexture() {
  return canvas(512, 512, (g) => {
    const gr = g.createRadialGradient(256, 256, 10, 256, 256, 250)
    gr.addColorStop(0, 'rgba(0, 0, 0, 0.75)')
    gr.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)')
    gr.addColorStop(1, 'rgba(0, 0, 0, 0)')
    g.fillStyle = gr
    g.fillRect(0, 0, 512, 512)
  })
}

function glowTexture() {
  const t = canvas(256, 256, (g) => {
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128)
    gr.addColorStop(0, 'rgba(255, 246, 232, 1)')
    gr.addColorStop(0.25, 'rgba(246, 170, 110, 0.6)')
    gr.addColorStop(1, 'rgba(210, 100, 44, 0)')
    g.fillStyle = gr
    g.fillRect(0, 0, 256, 256)
  })
  return t
}

function starTexture() {
  return canvas(256, 256, (g) => {
    g.translate(128, 128)
    g.fillStyle = 'rgba(255, 255, 255, 0.5)'
    g.beginPath()
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 - Math.PI / 2
      const r = i % 2 === 0 ? 70 : 18
      g.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    g.closePath()
    g.fill()
  })
}

/** The screen: warm dark glass with the Catalyze logo. Redrawn once the logo has loaded. */
function screenTexture() {
  const c = document.createElement('canvas')
  c.width = 1600
  c.height = 1000
  const g = c.getContext('2d')
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  const paint = (img) => {
    const bg = g.createRadialGradient(800, 470, 40, 800, 500, 900)
    bg.addColorStop(0, '#3a2116')
    bg.addColorStop(0.45, '#1a110c')
    bg.addColorStop(1, '#0b0908')
    g.fillStyle = bg
    g.fillRect(0, 0, 1600, 1000)
    const glow = g.createRadialGradient(800, 470, 0, 800, 470, 420)
    glow.addColorStop(0, 'rgba(226, 110, 52, 0.35)')
    glow.addColorStop(1, 'rgba(226, 110, 52, 0)')
    g.fillStyle = glow
    g.fillRect(0, 0, 1600, 1000)
    if (img) {
      const lw = 760
      const lh = (lw * 477) / 1275
      g.drawImage(img, 800 - lw / 2, 470 - lh / 2, lw, lh)
    }
    t.needsUpdate = true
  }
  paint(null)
  const img = new Image()
  img.onload = () => paint(img)
  img.src = logoUrl
  return t
}

const beamVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const beamFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float along = pow(1.0 - vUv.y, 1.35);
    float body = pow(abs(dot(vN, vV)), 1.4);
    vec3 col = mix(uColor, vec3(1.0, 0.97, 0.9), (1.0 - vUv.y) * 0.7);
    gl_FragColor = vec4(col * along * body * uIntensity, 1.0);
  }
`

export function createLaptopScene(host) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  // 1.75x is visually indistinguishable from 2x here and saves a quarter of the pixels.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  host.appendChild(renderer.domElement)

  const scene = new Scene()
  const camera = new PerspectiveCamera(32, 1, 0.1, 100)
  const target = new Vector3(0, 0.75, 0)
  camera.position.set(0, 1.3, 8.2)

  const pmrem = new PMREMGenerator(renderer)
  const studioTex = studio()
  const env = pmrem.fromEquirectangular(studioTex).texture
  studioTex.dispose()
  scene.environment = env

  const aluminium = new MeshStandardMaterial({ color: new Color('#a19e99'), metalness: 0.9, roughness: 0.34 })
  const dark = new MeshStandardMaterial({ color: new Color('#1d1d1f'), metalness: 0.6, roughness: 0.4 })

  // ----- Laptop -----
  const laptop = new Group()
  scene.add(laptop)

  const base = new Mesh(new RoundedBoxGeometry(W, H, D, 4, 0.05), aluminium)
  laptop.add(base)

  const deckTex = keyboardTexture()
  const deck = new Mesh(
    new PlaneGeometry(W - 0.12, D - 0.12),
    new MeshStandardMaterial({ map: deckTex, transparent: true, metalness: 0.2, roughness: 0.65 }),
  )
  deck.rotation.x = -Math.PI / 2
  deck.position.y = H / 2 + 0.002
  laptop.add(deck)

  const hinge = new Mesh(new CylinderGeometry(0.05, 0.05, W * 0.82, 24), dark)
  hinge.rotation.z = Math.PI / 2
  hinge.position.set(0, H / 2, -D / 2 + 0.03)
  laptop.add(hinge)

  // The lid turns about the hinge; at rotation 0 it stands upright, screen facing +z.
  const lidPivot = new Group()
  lidPivot.position.set(0, H / 2 + LID_T / 2 + 0.004, -D / 2 + 0.03)
  lidPivot.rotation.x = LID_CLOSED
  laptop.add(lidPivot)

  const lid = new Mesh(new RoundedBoxGeometry(W, LID_H, LID_T, 4, 0.03), aluminium)
  lid.position.y = LID_H / 2
  lidPivot.add(lid)

  const glass = new Mesh(
    new PlaneGeometry(W - 0.08, LID_H - 0.08),
    new MeshStandardMaterial({ color: new Color('#050505'), metalness: 0, roughness: 0.12 }),
  )
  glass.position.set(0, LID_H / 2, LID_T / 2 + 0.002)
  lidPivot.add(glass)

  const screenTex = screenTexture()
  const screenMat = new MeshBasicMaterial({ map: screenTex, color: new Color(0, 0, 0), toneMapped: false })
  const screen = new Mesh(new PlaneGeometry(W - 0.3, (W - 0.3) * 0.625), screenMat)
  screen.position.set(0, LID_H / 2 - 0.03, LID_T / 2 + 0.004)
  lidPivot.add(screen)

  // A white-hot layer over the screen for the moment the light breaks out.
  const hotMat = new MeshBasicMaterial({ color: new Color('#fff4e6'), transparent: true, opacity: 0, toneMapped: false })
  const hot = new Mesh(screen.geometry, hotMat)
  hot.position.copy(screen.position).setZ(LID_T / 2 + 0.006)
  lidPivot.add(hot)

  // A faint diagonal reflection across the glass.
  const reflection = new Mesh(
    new PlaneGeometry(W - 0.08, LID_H - 0.08),
    new MeshBasicMaterial({
      map: canvas(512, 340, (g) => {
        const gr = g.createLinearGradient(0, 0, 512, 340)
        gr.addColorStop(0.2, 'rgba(255,255,255,0)')
        gr.addColorStop(0.42, 'rgba(255,255,255,0.07)')
        gr.addColorStop(0.5, 'rgba(255,255,255,0)')
        g.fillStyle = gr
        g.fillRect(0, 0, 512, 340)
      }),
      transparent: true,
      depthWrite: false,
    }),
  )
  reflection.position.set(0, LID_H / 2, LID_T / 2 + 0.008)
  lidPivot.add(reflection)

  const emblem = new Mesh(
    new PlaneGeometry(0.42, 0.42),
    new MeshBasicMaterial({ map: starTexture(), transparent: true, depthWrite: false, color: new Color('#d8d4ce') }),
  )
  emblem.rotation.y = Math.PI
  emblem.position.set(0, LID_H / 2, -LID_T / 2 - 0.002)
  lidPivot.add(emblem)

  // ----- The beam, which leaves the screen along its normal -----
  const beamGeo = new CylinderGeometry(1, 0.86, 1, 64, 1, true)
  beamGeo.translate(0, 0.5, 0)
  const beamMat = new ShaderMaterial({
    vertexShader: beamVertex,
    fragmentShader: beamFragment,
    uniforms: { uColor: { value: new Color('#e2763a') }, uIntensity: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
  })
  const beam = new Mesh(beamGeo, beamMat)
  beam.rotation.x = Math.PI / 2
  beam.position.set(0, LID_H / 2 - 0.03, LID_T / 2 + 0.01)
  beam.scale.set(1.42, 0.001, 0.88)
  lidPivot.add(beam)

  const core = new Mesh(beamGeo, beamMat.clone())
  core.material.uniforms = { uColor: { value: new Color('#fff1dc') }, uIntensity: { value: 0 } }
  core.rotation.x = Math.PI / 2
  core.position.copy(beam.position)
  core.scale.set(0.7, 0.001, 0.42)
  lidPivot.add(core)

  const glow = new Mesh(
    new PlaneGeometry(1, 1),
    new MeshBasicMaterial({ map: glowTexture(), transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0 }),
  )
  glow.scale.setScalar(0.001)
  scene.add(glow)

  // ----- Floor shadow and lights -----
  const shadow = new Mesh(
    new PlaneGeometry(6.4, 4.8),
    new MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = -H / 2 - 0.01
  laptop.add(shadow)

  const key = new DirectionalLight('#fff3e2', 1.25)
  key.position.set(-3, 5, 4)
  const rim = new PointLight('#e2763a', 26, 14)
  rim.position.set(2.6, 2.4, -3)
  const fill = new PointLight('#ffb27a', 0, 10) // the beam's light on the laptop
  scene.add(key, rim, fill)

  // ----- Sizing and the render loop -----
  const view = { aspect: 1 }
  const resize = () => {
    const w = host.clientWidth
    const h = host.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    view.aspect = w / h
    // Narrow screens: pull the camera back so the whole laptop stays in frame.
    camera.zoom = Math.min(1, (w / h) * 0.95)
    camera.updateProjectionMatrix()
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(host)

  const glowPos = new Vector3()
  const render = () => {
    camera.lookAt(target)
    // The glow card sits on the screen and always faces the camera.
    screen.getWorldPosition(glowPos)
    glow.position.copy(glowPos)
    glow.quaternion.copy(camera.quaternion)
    renderer.render(scene, camera)
  }

  renderer.compile(scene, camera)
  render()

  return {
    camera,
    target,
    laptop,
    lidPivot,
    screenMat,
    hotMat,
    beam,
    core,
    beamMat,
    glow,
    fill,
    render,
    isNarrow: () => view.aspect < 1,
    setPower: (v) => screenMat.color.setScalar(v),
    dispose: () => {
      ro.disconnect()
      scene.traverse((o) => {
        o.geometry?.dispose()
        const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []
        mats.forEach((m) => {
          m.map?.dispose()
          m.dispose()
        })
      })
      env.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
