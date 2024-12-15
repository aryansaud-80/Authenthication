import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router';
import { AppContentProvider } from './context/AppContext.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <AppContentProvider>
      <App />
    </AppContentProvider>
  </Router>
);
