import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BusinessProvider } from './context/BusinessProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BusinessProvider> 
      <App />
    </BusinessProvider>
  </React.StrictMode>,
)