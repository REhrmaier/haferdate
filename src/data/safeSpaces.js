const requiredKeys = ["id", "name", "address", "district", "lat", "lng", "category", "contact"]

const safeSpaces = [
  {
    id: 1,
    name: "Lost Weekend",
    address: "Schellingstraße 3, 80799 München",
    district: "Maxvorstadt",
    lat: 48.149121,
    lng: 11.579657,
    category: "Café",
    contact: "Nora Bergmann",
  },
  {
    id: 2,
    name: "Man versus Machine",
    address: "Schellingstraße 18, 80799 München",
    district: "Maxvorstadt",
    lat: 48.149908,
    lng: 11.577609,
    category: "Café",
    contact: "David Winter",
  },
  {
    id: 3,
    name: "Café Jasmin",
    address: "Steinheilstraße 20, 80333 München",
    district: "Maxvorstadt",
    lat: 48.15002,
    lng: 11.56372,
    category: "Café",
    contact: "Aylin Sommer",
  },
  {
    id: 4,
    name: "Café Kosmos",
    address: "Dachauer Straße 7, 80335 München",
    district: "Maxvorstadt",
    lat: 48.14248,
    lng: 11.56002,
    category: "Bar",
    contact: "Leo Hartmann",
  },
  {
    id: 5,
    name: "Ruffini",
    address: "Orffstraße 22–24, 80637 München",
    district: "Neuhausen",
    lat: 48.15792,
    lng: 11.53545,
    category: "Café",
    contact: "Mira König",
  },
  {
    id: 6,
    name: "Café Luitpold",
    address: "Brienner Straße 11, 80333 München",
    district: "Altstadt",
    lat: 48.14296,
    lng: 11.574947,
    category: "Café",
    contact: "Emma Stein",
  },
  {
    id: 7,
    name: "Café Frischhut",
    address: "Prälat-Zistl-Straße 8, 80331 München",
    district: "Altstadt",
    lat: 48.13489,
    lng: 11.57455,
    category: "Café",
    contact: "Ben Adler",
  },
  {
    id: 8,
    name: "Café Glockenspiel",
    address: "Marienplatz 28, 80331 München",
    district: "Altstadt",
    lat: 48.13692,
    lng: 11.57477,
    category: "Café",
    contact: "Sofia Weber",
  },
]

export function loadSpaces(rows, districts) {
  if (!Array.isArray(rows) || rows.length === 0) {
    console.error("safe space list is empty")
    throw new Error("safe space list is empty")
  }
  if (!Array.isArray(districts) || districts.length === 0) {
    console.error("district list is empty")
    throw new Error("district list is empty")
  }
  const seen = new Set()
  rows.forEach((row) => {
    requiredKeys.forEach((key) => {
      if (row[key] === undefined || row[key] === null || row[key] === "") {
        console.error("safe space missing " + key)
        throw new Error("safe space missing " + key)
      }
    })
    if (!Number.isFinite(row.lat) || !Number.isFinite(row.lng)) {
      console.error("safe space coordinates must be numbers: " + row.name)
      throw new Error("safe space coordinates must be numbers: " + row.name)
    }
    if (seen.has(row.id)) {
      console.error("duplicate safe space id: " + row.id)
      throw new Error("duplicate safe space id: " + row.id)
    }
    if (!districts.includes(row.district)) {
      console.error("district is not in the filter list: " + row.district)
      throw new Error("district is not in the filter list: " + row.district)
    }
    seen.add(row.id)
  })
  return rows
}

export { safeSpaces }
