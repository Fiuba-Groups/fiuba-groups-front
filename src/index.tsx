import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { clearAllMockData } from './services/groupOffersService';

// Limpiar todos los datos mock al iniciar la aplicación
clearAllMockData();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Función global para limpiar todos los datos mock (accesible desde consola del navegador)
(window as any).clearAllMockData = clearAllMockData;
