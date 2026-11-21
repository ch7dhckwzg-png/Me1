import { useEffect, useRef } from 'react'

/** Full-size view of a piece of work, in a native <dialog> (Esc and the close button both work). */
export default function Lightbox({ item, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (item && !dlg.open) dlg.showModal()
    if (!item && dlg.open) dlg.close()
  }, [item])

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={item?.alt}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {item && (
        <figure>
          <img src={item.src} alt={item.alt} />
          <figcaption>
            <span>{item.caption}</span>
            <button type="button" className="btn btn-ghost" onClick={onClose} autoFocus>
              Close
            </button>
          </figcaption>
        </figure>
      )}
    </dialog>
  )
}
