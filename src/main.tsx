import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const root = document.getElementById('root')!;
// CI prerenders the page into #root, so on the live site it is already painted before React runs
const snapshot = root.hasChildNodes();

createRoot(root).render(
  <StrictMode>
    <App snapshot={snapshot} />
  </StrictMode>,
);
