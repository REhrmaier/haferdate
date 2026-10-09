import { useEffect, useMemo, useState } from "react"
import logo from "./logo.png"
import { readConfig, readFilters } from "./config.js"
import { loadSpaces, safeSpaces } from "./data/safeSpaces.js"
import { filterSpaces } from "./filterSpaces.js"
import SafeMap from "./SafeMap.jsx"
import LocationSheet from "./LocationSheet.jsx"
import LocationRail from "./LocationRail.jsx"

export default function App() {
  const filterSet = useMemo(() => readFilters(), [])
  const spaces = useMemo(() => loadSpaces(safeSpaces, filterSet.districts), [filterSet])
  const [query, setQuery] = useState("")
  const [district, setDistrict] = useState(filterSet.allFilter)
  const [selectedId, setSelectedId] = useState(null)
  const [focusTick, setFocusTick] = useState(0)
  const visible = useMemo(
    () => filterSpaces(spaces, query, district, filterSet.allFilter),
    [spaces, query, district, filterSet]
  )
  const selected = visible.find((space) => space.id === selectedId) || null

  useEffect(() => {
    if (selectedId !== null && !selected) setSelectedId(null)
  }, [selectedId, selected])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setSelectedId(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  function choose(id) {
    setSelectedId(id)
    setFocusTick((tick) => tick + 1)
  }

  return (
    <div className="app">
      <header className="top">
        <div className="brand-row">
          <div className="brand">
            <img className="brand-mark" src={logo} alt="" />
            <span>{readConfig("brand")}</span>
          </div>
        </div>
        <h1>{readConfig("title")}</h1>
        <p className="subtitle">{readConfig("subtitle")}</p>
        <form
          className="search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            const field = event.currentTarget.querySelector("input")
            if (field) field.blur()
          }}
        >
          <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16.5 20 20.5" />
          </svg>
          <input
            type="search"
            value={query}
            placeholder={readConfig("searchPlaceholder")}
            aria-label={readConfig("searchPlaceholder")}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query ? (
            <button type="button" className="clear-btn" aria-label={readConfig("clearSearch")} onClick={() => setQuery("")}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 7l10 10M17 7 7 17" />
              </svg>
            </button>
          ) : null}
        </form>
        <div className="filters" role="group" aria-label={readConfig("title")}>
          {filterSet.filters.map((name) => (
            <button
              key={name}
              type="button"
              className={name === district ? "filter is-on" : "filter"}
              aria-pressed={name === district}
              onClick={() => setDistrict(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </header>
      <main className={selected ? "stage has-sheet" : "stage"}>
        <div className="map-wrap">
          <SafeMap spaces={visible} selectedId={selected ? selected.id : null} focusTick={focusTick} onSelect={choose} />
        </div>
        <LocationRail spaces={visible} selectedId={selected ? selected.id : null} onSelect={choose} />
        {selected ? <LocationSheet space={selected} onClose={() => setSelectedId(null)} /> : null}
      </main>
    </div>
  )
}
