import { useMemo, useState } from "react"
import { readConfig, readList, readNumber } from "./config.js"
import { buildSlots } from "./slots.js"

function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    console.error("contact name missing")
    throw new Error("contact name missing")
  }
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
  return (first + last).toUpperCase()
}

function colorFor(id) {
  const colors = readList("avatarColors")
  if (!Number.isFinite(id)) {
    console.error("contact color is missing an id")
    throw new Error("contact color is missing an id")
  }
  return colors[Math.abs(id) % colors.length]
}

function routeUrl(address) {
  if (!address) {
    console.error("address missing for route")
    throw new Error("address missing for route")
  }
  return readConfig("mapsUrl") + encodeURIComponent(address)
}

export default function LocationSheet({ space, onClose }) {
  const slots = useMemo(() => buildSlots(readList("slotStarts"), readNumber("slotMinutes")), [])
  const [slotId, setSlotId] = useState(null)

  return (
    <section className="sheet" role="dialog" aria-labelledby="sheet-title">
      <div className="sheet-bar">
        <span className="demo-badge">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3.2 19 5.6v6.1c0 4.3-2.9 7.3-7 8.6-4.1-1.3-7-4.3-7-8.6V5.6L12 3.2z" />
            <path d="m8.6 12.1 2.2 2.2 4.6-4.8" />
          </svg>
          {readConfig("badgeLabel")}
        </span>
        <button type="button" className="close-btn" onClick={onClose}>
          {readConfig("closeLabel")}
        </button>
      </div>
      <h2 id="sheet-title">{space.name}</h2>
      <p className="sheet-address">{space.address}</p>
      <dl className="facts">
        <div>
          <dt>{readConfig("districtLabel")}</dt>
          <dd>{space.district}</dd>
        </div>
        <div>
          <dt>{readConfig("categoryLabel")}</dt>
          <dd>{space.category}</dd>
        </div>
      </dl>
      <div className="contact">
        <p className="contact-label">{readConfig("contactLabel")}</p>
        <div className="contact-row">
          <span className="avatar" style={{ background: colorFor(space.id) }}>
            {initials(space.contact)}
          </span>
          <span className="contact-name">{space.contact}</span>
        </div>
      </div>
      <div className="slots">
        <p className="contact-label">{readConfig("slotLabel")}</p>
        <div className="slot-row" role="group" aria-label={readConfig("slotLabel")}>
          {slots.map((slot) => {
            const on = slot.id === slotId
            return (
              <button
                key={slot.id}
                type="button"
                className={on ? "slot is-on" : "slot"}
                aria-pressed={on}
                onClick={() => setSlotId(on ? null : slot.id)}
              >
                {slot.label}
              </button>
            )
          })}
        </div>
      </div>
      <a className="route-btn" href={routeUrl(space.address)} target="_blank" rel="noopener noreferrer">
        {readConfig("routeLabel")}
      </a>
    </section>
  )
}
