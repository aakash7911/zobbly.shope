import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ProductProvider } from './context/ProductContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </StrictMode>,
)
