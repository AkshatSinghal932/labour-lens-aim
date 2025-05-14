"use client";

import { useState, useEffect } from 'react';

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface UseUserLocationState {
  location: UserLocation | null;
  error: string | null;
  loading: boolean;
}

export function useUserLocation(): UseUserLocationState {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLoading(false);
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setError(error.message);
      setLoading(false);
    };

    // Set a default location for development or if permission denied
    const setDefaultLocation = () => {
      // Default to a known city, e.g., New Delhi, India
      setLocation({ latitude: 28.6139, longitude: 77.2090 });
      setLoading(false);
    };
    
    navigator.geolocation.getCurrentPosition(successHandler, (err) => {
        errorHandler(err);
        // Fallback to default location if there's an error (e.g. permission denied)
        // console.warn("Geolocation permission denied or error, using default location.");
        // setDefaultLocation();
    });

    // Cleanup function is not strictly necessary here as getCurrentPosition is a one-off
  }, []);

  return { location, error, loading };
}
