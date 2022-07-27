import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import 'leaflet/dist/leaflet.css';
import './reset.css';
import App from './App';

window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  event.stopPropagation();
  console.log('Unhandled error event', event);
});

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
