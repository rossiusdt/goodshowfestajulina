import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AnalyticsDashboard from './pages/AnalyticsDashboard.tsx';
import './index.css';

const isAnalytics = window.location.pathname === '/analytics';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAnalytics ? <AnalyticsDashboard /> : <App />}
  </StrictMode>
);
