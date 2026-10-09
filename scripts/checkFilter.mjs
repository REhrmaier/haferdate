import assert from "node:assert/strict"
import { safeSpaces, loadSpaces } from "../src/data/safeSpaces.js"
import { filterSpaces } from "../src/filterSpaces.js"
import { mapSettings, readFilters, readList, readNumber } from "../src/config.js"
import { buildSlots } from "../src/slots.js"

const { allFilter, districts } = readFilters()
const loaded = loadSpaces(safeSpaces, districts)
const map = mapSettings()

assert.equal(loaded.length, 8)
assert.equal(filterSpaces(loaded, "", "Maxvorstadt", allFilter).length, 4)
assert.equal(filterSpaces(loaded, "", "Altstadt", allFilter).length, 3)
assert.equal(filterSpaces(loaded, "", "Neuhausen", allFilter).length, 1)
assert.equal(filterSpaces(loaded, "lost", allFilter, allFilter)[0].name, "Lost Weekend")
assert.equal(filterSpaces(loaded, "kosmos", "Altstadt", allFilter).length, 0)
assert.equal(filterSpaces(loaded, "ruffini", "Neuhausen", allFilter).length, 1)
assert.equal(filterSpaces(loaded, "schellingstrasse", allFilter, allFilter).length, 2)

loaded.forEach((space) => {
  assert.ok(space.lat >= map.south && space.lat <= map.north)
  assert.ok(space.lng >= map.west && space.lng <= map.east)
})

let rejected = false
try {
  loadSpaces([{ ...loaded[0], district: "Schwabing" }], districts)
} catch (error) {
  rejected = true
}
assert.equal(rejected, true)

const slots = buildSlots(readList("slotStarts"), readNumber("slotMinutes"))
assert.deepEqual(slots.map((slot) => slot.label), ["17:00–17:30", "17:30–18:00", "18:00–18:30", "18:30–19:00"])
let badSlot = false
try {
  buildSlots(["25:00"], 30)
} catch (error) {
  badSlot = true
}
assert.equal(badSlot, true)

console.log("filter check ok")
