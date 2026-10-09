const config = {
  brand: "HaferDate",
  title: "Safe Spaces München",
  subtitle: "Entdecke Treffpunkte für dein nächstes Date",
  searchPlaceholder: "Safe Space suchen ...",
  clearSearch: "Suche löschen",
  filters: ["Alle", "Maxvorstadt", "Altstadt", "Neuhausen"],
  allFilter: "Alle",
  emptyLabel: "Keine Treffpunkte für diese Suche.",
  listSingular: "Treffpunkt",
  listPlural: "Treffpunkte",
  districtLabel: "Stadtteil",
  categoryLabel: "Kategorie",
  badgeLabel: "Safe Space",
  contactLabel: "Deine Ansprechperson",
  routeLabel: "Route anzeigen",
  closeLabel: "Schließen",
  slotLabel: "Zeitfenster",
  slotMinutes: 30,
  slotStarts: ["17:00", "17:30", "18:00", "18:30"],
  mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=",
  avatarColors: ["#2f6d4f", "#c86a32", "#8a5a44", "#3d6f8a"],
  marker: {
    size: 46,
  },
  map: {
    centerLat: 48.137154,
    centerLng: 11.576124,
    zoom: 13,
    focusZoom: 16,
    minZoom: 12,
    maxZoom: 18,
    south: 48.06,
    west: 11.3,
    north: 48.25,
    east: 11.84,
    boundsViscosity: 1,
    flySeconds: 0.65,
    focusShift: 0.22,
    scrollWheelZoom: true,
    zoomAnimation: true,
    markerLift: 800,
    markerRest: 0,
    tileUrl: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    attributionPrefix: "Leaflet",
  },
}

export function readConfig(path) {
  const parts = path.split(".")
  let cursor = config
  for (const part of parts) {
    if (cursor === null || typeof cursor !== "object" || !(part in cursor)) {
      console.error("missing config: " + path)
      throw new Error("missing config: " + path)
    }
    cursor = cursor[part]
  }
  if (cursor === undefined || cursor === null || cursor === "") {
    console.error("empty config: " + path)
    throw new Error("empty config: " + path)
  }
  return cursor
}

export function readNumber(path) {
  const value = readConfig(path)
  if (typeof value !== "number" || Number.isNaN(value)) {
    console.error("config must be a number: " + path)
    throw new Error("config must be a number: " + path)
  }
  return value
}

export function readFlag(path) {
  const value = readConfig(path)
  if (typeof value !== "boolean") {
    console.error("config must be yes or no: " + path)
    throw new Error("config must be yes or no: " + path)
  }
  return value
}

export function readList(path) {
  const value = readConfig(path)
  if (!Array.isArray(value) || value.length === 0) {
    console.error("config list is empty: " + path)
    throw new Error("config list is empty: " + path)
  }
  return value
}

export function readFilters() {
  const filters = readList("filters")
  const allFilter = readConfig("allFilter")
  if (!filters.includes(allFilter)) {
    console.error("all filter is missing from the filter list")
    throw new Error("all filter is missing from the filter list")
  }
  const districts = filters.filter((name) => name !== allFilter)
  if (districts.length === 0) {
    console.error("district filter list is empty")
    throw new Error("district filter list is empty")
  }
  return { filters, allFilter, districts }
}

export function mapSettings() {
  const settings = {
    centerLat: readNumber("map.centerLat"),
    centerLng: readNumber("map.centerLng"),
    zoom: readNumber("map.zoom"),
    focusZoom: readNumber("map.focusZoom"),
    minZoom: readNumber("map.minZoom"),
    maxZoom: readNumber("map.maxZoom"),
    south: readNumber("map.south"),
    west: readNumber("map.west"),
    north: readNumber("map.north"),
    east: readNumber("map.east"),
    boundsViscosity: readNumber("map.boundsViscosity"),
    flySeconds: readNumber("map.flySeconds"),
    focusShift: readNumber("map.focusShift"),
    scrollWheelZoom: readFlag("map.scrollWheelZoom"),
    zoomAnimation: readFlag("map.zoomAnimation"),
    markerLift: readNumber("map.markerLift"),
    markerRest: readNumber("map.markerRest"),
    tileUrl: readConfig("map.tileUrl"),
    attribution: readConfig("map.attribution"),
    attributionPrefix: readConfig("map.attributionPrefix"),
  }
  if (settings.minZoom > settings.zoom || settings.zoom > settings.maxZoom) {
    console.error("map zoom is outside the allowed range")
    throw new Error("map zoom is outside the allowed range")
  }
  if (settings.focusShift < 0 || settings.focusShift > 0.4) {
    console.error("map focus shift is out of range")
    throw new Error("map focus shift is out of range")
  }
  if (settings.south >= settings.north || settings.west >= settings.east) {
    console.error("map bounds are reversed")
    throw new Error("map bounds are reversed")
  }
  if (!settings.tileUrl.includes("{z}") || !settings.tileUrl.includes("{x}") || !settings.tileUrl.includes("{y}")) {
    console.error("map tile url is missing zoom placeholders")
    throw new Error("map tile url is missing zoom placeholders")
  }
  return settings
}
