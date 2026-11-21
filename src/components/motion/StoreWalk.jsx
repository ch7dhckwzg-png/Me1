const Shelf = ({ y }) => (
  <div className="sw-shelf" style={{ top: y }}>
    {Array.from({ length: 9 }, (_, i) => (
      <i key={i} className={i % 3 === 1 ? 'is-sage' : ''} />
    ))}
  </div>
)

/** Norde café: the camera walks in through the door, past the shelves, up to the counter. */
export default function StoreWalk() {
  return (
    <div className="sw" aria-hidden="true">
      <div className="sw-room">
        <div className="sw-plane sw-floor" />
        <div className="sw-plane sw-ceiling" />
        <div className="sw-plane sw-wall sw-left"><Shelf y="28%" /><Shelf y="50%" /></div>
        <div className="sw-plane sw-wall sw-right"><Shelf y="28%" /><Shelf y="50%" /></div>
        <div className="sw-plane sw-back">
          <div className="sw-sign">norde</div>
          <div className="sw-window" />
        </div>
        <div className="sw-plane sw-counter">
          <div className="sw-machine" />
        </div>
        <div className="sw-plane sw-door">
          <span className="sw-door-sign">norde · coffee</span>
        </div>
        <div className="sw-light" style={{ '--z': '-260px' }} />
        <div className="sw-light" style={{ '--z': '-520px' }} />
        <div className="sw-light" style={{ '--z': '-780px' }} />
      </div>
      <div className="sw-fade" />
    </div>
  )
}
