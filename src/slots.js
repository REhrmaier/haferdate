function parseClock(value) {
  if (typeof value !== "string" || !/^\d{2}:\d{2}$/.test(value)) {
    console.error("slot time is invalid: " + value)
    throw new Error("slot time is invalid: " + value)
  }
  const hour = Number(value.slice(0, 2))
  const minute = Number(value.slice(3))
  if (hour > 23 || minute > 59) {
    console.error("slot time is invalid: " + value)
    throw new Error("slot time is invalid: " + value)
  }
  return hour * 60 + minute
}

function formatClock(total) {
  const day = 24 * 60
  const minutes = ((total % day) + day) % day
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60
  const hh = hour < 10 ? "0" + hour : String(hour)
  const mm = minute < 10 ? "0" + minute : String(minute)
  return hh + ":" + mm
}

export function buildSlots(starts, minutes) {
  if (!Array.isArray(starts) || starts.length === 0) {
    console.error("slot list is empty")
    throw new Error("slot list is empty")
  }
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes >= 24 * 60) {
    console.error("slot length is invalid")
    throw new Error("slot length is invalid")
  }
  const seen = new Set()
  return starts.map((start) => {
    const begin = parseClock(start)
    if (seen.has(begin)) {
      console.error("duplicate slot: " + start)
      throw new Error("duplicate slot: " + start)
    }
    seen.add(begin)
    return { id: start, label: start + "–" + formatClock(begin + minutes) }
  })
}
