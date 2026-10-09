import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "leaflet/dist/leaflet.css"
import "./index.css"
import App from "./App.jsx"

const root = document.getElementById("root")
if (!root) {
  console.error("missing root element")
  throw new Error("missing root element")
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
