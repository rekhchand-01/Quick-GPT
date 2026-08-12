import type { ReactNode } from 'react';
import {
  ClerkProvider as RealClerkProvider,
  PricingTable as RealPricingTable,
  UserButton as RealUserButton,
  useAuth as useRealAuth,
  useClerk as useRealClerk,
  useUser as useRealUser,
} from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = Boolean(
  PUBLISHABLE_KEY &&
  PUBLISHABLE_KEY.trim() &&
  PUBLISHABLE_KEY.startsWith('pk_live_') &&
  !PUBLISHABLE_KEY.includes('dummy') &&
  !PUBLISHABLE_KEY.includes('placeholder')
);

interface ClerkProviderProps {
  children: ReactNode;
  publishableKey?: string;
}

export function ClerkProvider({ children, publishableKey }: ClerkProviderProps) {
  if (hasValidClerkKey && publishableKey) {
    return <RealClerkProvider publishableKey={publishableKey}>{children}</RealClerkProvider>;
  }

  return <>{children}</>;
}

export function useAuth() {
  if (hasValidClerkKey) {
    return useRealAuth();
  }

  return {
    getToken: async () => null,
    isLoaded: true,
    isSignedIn: false,
    userId: null,
    sessionId: null,
  };
}

export function useUser() {
  if (hasValidClerkKey) {
    return useRealUser();
  }

  return {
    user: null,
    isLoaded: true,
    isSignedIn: false,
  };
}

export function useClerk() {
  if (hasValidClerkKey) {
    return useRealClerk();
  }

  return {
    openSignIn: () => undefined,
    signOut: async () => undefined,
  };
}

export function UserButton(props: Record<string, unknown>) {
  if (hasValidClerkKey) {
    return <RealUserButton {...props} />;
  }

  return <button type="button" className="rounded-md border px-3 py-2 text-sm">Sign in</button>;
}

export function PricingTable(props: Record<string, unknown>) {
  if (hasValidClerkKey) {
    return <RealPricingTable {...props} />;
  }

  return <div className="rounded-lg border p-4 text-sm">Clerk pricing is unavailable in local development.</div>;
}
