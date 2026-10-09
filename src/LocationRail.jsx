import { useEffect } from "react"
import { readConfig } from "./config.js"

export default function LocationRail({ spaces, selectedId, onSelect }) {
  useEffect(() => {
    if (!selectedId) return
    const scroller = document.getElementById("space-rail")
    const card = document.getElementById("space-" + selectedId)
    if (!scroller || !card) return
    const left = card.offsetLeft - (scroller.clientWidth - card.clientWidth) / 2
    scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" })
  }, [selectedId, spaces])

  const noun = spaces.length === 1 ? readConfig("listSingular") : readConfig("listPlural")

  return (
    <div className="rail">
      <p className="rail-count">{spaces.length + " " + noun}</p>
      {spaces.length === 0 ? (
        <p className="empty">{readConfig("emptyLabel")}</p>
      ) : (
        <div className="rail-scroller" id="space-rail">
          {spaces.map((space) => {
            const on = space.id === selectedId
            return (
              <button
                key={space.id}
                id={"space-" + space.id}
                type="button"
                className={on ? "place-card is-on" : "place-card"}
                aria-pressed={on}
                onClick={() => onSelect(space.id)}
              >
                <span className="place-kicker">{space.category + " · " + space.district}</span>
                <span className="place-name">{space.name}</span>
                <span className="place-address">{space.address}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
