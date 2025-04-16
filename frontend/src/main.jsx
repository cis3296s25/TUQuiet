import './utils/polyfills'; // polyfill for websocket usage
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './utils/animations.css' // import animation style
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
