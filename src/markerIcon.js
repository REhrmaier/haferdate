import L from "leaflet"
import { readNumber } from "./config.js"

const shield = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linejoin="round" d="M12 3.2 19 5.6v6.1c0 4.3-2.9 7.3-7 8.6-4.1-1.3-7-4.3-7-8.6V5.6L12 3.2z"/><path fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="m8.6 12.1 2.2 2.2 4.6-4.8"/></svg>'

export function markerIcon(selected) {
  const size = readNumber("marker.size")
  if (size <= 0) {
    console.error("marker size is invalid")
    throw new Error("marker size is invalid")
  }
  const state = selected ? " is-selected" : ""
  return L.divIcon({
    className: "safe-marker",
    html: '<div class="safe-pin' + state + '">' + shield + "</div>",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}
