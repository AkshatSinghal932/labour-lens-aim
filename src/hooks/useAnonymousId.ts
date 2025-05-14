"use client";

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed: npm install uuid @types/uuid

const ANONYMOUS_ID_KEY = 'labourLensAnonymousId';

export function useAnonymousId(): string | null {
  const [anonymousId, setAnonymousId] = useState<string | null>(null);

  useEffect(() => {
    let storedId = localStorage.getItem(ANONYMOUS_ID_KEY);
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem(ANONYMOUS_ID_KEY, storedId);
    }
    setAnonymousId(storedId);
  }, []);

  return anonymousId;
}
