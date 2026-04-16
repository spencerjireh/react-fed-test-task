import { createRoot } from 'react-dom/client';

import { App } from './app';
import { enableMocking } from './testing/mocks';

import './styles/index.css';

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});
