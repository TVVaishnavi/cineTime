import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MovieProvider, TheatreProvider } from './hooks/controller';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MovieProvider>
      <TheatreProvider>
        <App />
      </TheatreProvider>
    </MovieProvider>
  </React.StrictMode>
);

