import { Buffer } from "buffer"
import { createRoot } from "react-dom/client"
import "./locales/index.js"
import App from "./App.jsx"

import "./index.css"

window.Buffer = Buffer
createRoot(document.getElementById("root")).render(<App />)
