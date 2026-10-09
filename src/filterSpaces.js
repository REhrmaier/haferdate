function fold(value) {
  return value
    .toLowerCase()
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .replaceAll("ü", "u")
    .replaceAll("ß", "ss")
}

export function filterSpaces(spaces, query, district, allLabel) {
  if (!Array.isArray(spaces)) {
    console.error("safe spaces must be a list")
    throw new Error("safe spaces must be a list")
  }
  if (typeof query !== "string") {
    console.error("search query must be a string")
    throw new Error("search query must be a string")
  }
  if (!district) {
    console.error("district filter is missing")
    throw new Error("district filter is missing")
  }
  if (!allLabel) {
    console.error("all filter label is missing")
    throw new Error("all filter label is missing")
  }
  const needle = fold(query.trim())
  return spaces.filter((space) => {
    const districtOk = district === allLabel || space.district === district
    if (!districtOk) return false
    if (!needle) return true
    const hay = fold([space.name, space.address, space.district, space.category, space.contact].join(" "))
    return hay.includes(needle)
  })
}
