import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "./components/theme-provider.tsx"
import DataProvider from './provider/context-provider.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Stats from './stats.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<App />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
