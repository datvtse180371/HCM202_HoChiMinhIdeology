import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RootLayout from './Layout.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootLayout>
      <App />
    </RootLayout>
  </StrictMode>,
)
