import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { store } from './redux/store.js';
import { Provider } from 'react-redux';
import { persistor } from './redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from './Components/ThemeProvider.jsx';

createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
  </PersistGate>
);
