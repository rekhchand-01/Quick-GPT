import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from './clerk';
import { Toaster } from 'react-hot-toast';

import { QueryProvider } from './providers/QueryProvider';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = Boolean(PUBLISHABLE_KEY && PUBLISHABLE_KEY.startsWith('pk_'));

const appContent = (
  <QueryProvider>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontWeight: 500,
          },
        }}
      />
      <App />
    </BrowserRouter>
  </QueryProvider>
);

createRoot(document.getElementById('root')!).render(
  hasValidClerkKey ? (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {appContent}
    </ClerkProvider>
  ) : appContent
);