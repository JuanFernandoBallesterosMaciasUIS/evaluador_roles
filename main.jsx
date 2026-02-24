import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './evaluacion_roles.jsx'

// Fallback para window.storage si no existe (para que funcione en Vercel/Local)
if (!window.storage) {
  window.storage = {
    get: async (key) => {
      const val = localStorage.getItem(key);
      return val ? { value: val } : null;
    },
    set: async (key, val) => {
      localStorage.setItem(key, val);
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
