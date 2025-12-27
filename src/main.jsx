// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { Provider } from 'react-redux';
// import { store } from './redux/store.js';
// import App from './App.jsx';
// import './index.css';

// createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     <StrictMode>
//       <App />
//     </StrictMode>
//   </Provider>
// );
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import App from './App.jsx';
import './index.css';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <App />
      </LocalizationProvider>
    </StrictMode>
  </Provider>
);
