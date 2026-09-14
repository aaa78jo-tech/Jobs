import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'jobs.favorites';
const USER_NAME_KEY = 'jobs.userName';

interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (professionId: string) => boolean;
  toggleFavorite: (professionId: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  isLoaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [userName, setUserNameState] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [storedFavorites, storedName] = await Promise.all([
          AsyncStorage.getItem(FAVORITES_KEY),
          AsyncStorage.getItem(USER_NAME_KEY),
        ]);
        if (storedFavorites) setFavoriteIds(JSON.parse(storedFavorites));
        if (storedName) setUserNameState(storedName);
      } catch {
        // Local storage unavailable — start with defaults.
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const toggleFavorite = (professionId: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(professionId)
        ? prev.filter((id) => id !== professionId)
        : [...prev, professionId];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    AsyncStorage.setItem(USER_NAME_KEY, name).catch(() => {});
  };

  const value = useMemo(
    () => ({
      favoriteIds,
      isFavorite: (professionId: string) => favoriteIds.includes(professionId),
      toggleFavorite,
      userName,
      setUserName,
      isLoaded,
    }),
    [favoriteIds, userName, isLoaded]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
}
