import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { initHotJar } from './utils/hotjar.js';
import 'leaflet/dist/leaflet.css';
import './reset.css';
import App from './App';

if (
  process &&
  process.env &&
  typeof process.env.REACT_APP_HOTJAR_ID === 'string' &&
  process.env.REACT_APP_HOTJAR_ID.length
) {
  const hjid = Number.parseInt(process.env.REACT_APP_HOTJAR_ID, 10);

  if (!Number.isNaN(hjid)) {
    // eslint-disable-next-line no-console
    console.log(`HotJar ID = '${hjid}'`);

    try {
      initHotJar(hjid);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error while initializing HotJar code.');
    }
  }
}

window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  event.stopPropagation();
  // eslint-disable-next-line no-console
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
