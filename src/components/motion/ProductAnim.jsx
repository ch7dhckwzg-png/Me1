/** Lumen Serum 02: the bottle turns in the light, the dropper lifts and lets fall a single drop. */
export default function ProductAnim() {
  return (
    <div className="ap" aria-hidden="true">
      <div className="ap-arch" />
      <div className="ap-floor" />
      <div className="ap-shadow" />
      <div className="ap-ripple" />
      <div className="ap-drop" />
      <div className="ap-bottle">
        <div className="ap-dropper">
          <div className="ap-cap" />
          <div className="ap-collar" />
          <div className="ap-pipette" />
        </div>
        <div className="ap-glass">
          <div className="ap-sheen" />
          <div className="ap-label">
            <b>LUMEN</b>
            <span>Serum 02</span>
          </div>
        </div>
      </div>
    </div>
  )
}
