import { useState, useEffect } from 'react';

export const usePersistentState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, state]);

  return [state, setState];
};