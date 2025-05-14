
"use client";

import { useEffect } from 'react';
import { seedInitialData } from '@/lib/seedDatabase';

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This should ideally be run once, perhaps via an admin panel or a script.
    // Running it in layout ensures data is there for development.
    // Ensure NEXT_PUBLIC_FIREBASE_PROJECT_ID is set before calling seed.
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
       seedInitialData();
    } else {
      console.warn("Firebase Project ID not set. Skipping data seeding.");
    }
  }, []);
  
  return <>{children}</>;
}
