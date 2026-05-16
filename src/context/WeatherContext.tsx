import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { WeatherData, TemperatureUnit, FavoriteCity, CitySearchResult } from '../types';
import { weatherService } from '../utils/weatherService';

interface WeatherState {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  unit: TemperatureUnit;
  favorites: FavoriteCity[];
  selectedCity: CitySearchResult | null;
  searchHistory: string[];
  soundEnabled: boolean;
  soundType: 'rain' | 'thunder' | 'wind' | 'none';
  showAlerts: boolean;
  dismissedAlerts: string[];
  theme: 'dark' | 'light';
}

type WeatherAction =
  | { type: 'SET_WEATHER_DATA'; payload: WeatherData }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_UNIT'; payload: TemperatureUnit }
  | { type: 'ADD_FAVORITE'; payload: FavoriteCity }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_SELECTED_CITY'; payload: CitySearchResult | null }
  | { type: 'ADD_TO_SEARCH_HISTORY'; payload: string }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'SET_SOUND_TYPE'; payload: 'rain' | 'thunder' | 'wind' | 'none' }
  | { type: 'DISMISS_ALERT'; payload: string }
  | { type: 'TOGGLE_ALERTS' }
  | { type: 'SET_THEME'; payload: 'dark' | 'light' };

const initialState: WeatherState = {
  weatherData: null,
  loading: true,
  error: null,
  unit: 'celsius',
  favorites: [],
  selectedCity: null,
  searchHistory: [],
  soundEnabled: false,
  soundType: 'none',
  showAlerts: true,
  dismissedAlerts: [],
  theme: 'dark',
};

function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'SET_WEATHER_DATA':
      return { ...state, weatherData: action.payload, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_UNIT':
      return { ...state, unit: action.payload };
    case 'ADD_FAVORITE':
      if (state.favorites.some(f => `${f.lat}-${f.lon}` === `${action.payload.lat}-${action.payload.lon}`)) {
        return state;
      }
      const updatedFavorites = [...state.favorites, action.payload];
      localStorage.setItem('weatherFavorites', JSON.stringify(updatedFavorites));
      return { ...state, favorites: updatedFavorites };
    case 'REMOVE_FAVORITE': {
      const filtered = state.favorites.filter(f => `${f.lat}-${f.lon}` !== action.payload);
      localStorage.setItem('weatherFavorites', JSON.stringify(filtered));
      return { ...state, favorites: filtered };
    }
    case 'SET_SELECTED_CITY':
      return { ...state, selectedCity: action.payload };
    case 'ADD_TO_SEARCH_HISTORY': {
      const history = [action.payload, ...state.searchHistory.filter(h => h !== action.payload)].slice(0, 10);
      localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
      return { ...state, searchHistory: history };
    }
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    case 'SET_SOUND_TYPE':
      return { ...state, soundType: action.payload, soundEnabled: action.payload !== 'none' };
    case 'DISMISS_ALERT':
      return {
        ...state,
        dismissedAlerts: [...state.dismissedAlerts, action.payload],
      };
    case 'TOGGLE_ALERTS':
      return { ...state, showAlerts: !state.showAlerts };
    case 'SET_THEME':
      localStorage.setItem('weatherTheme', action.payload);
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

interface WeatherContextProps {
  state: WeatherState;
  dispatch: React.Dispatch<WeatherAction>;
  fetchWeather: (lat: number, lon: number, cityName?: string) => Promise<void>;
  fetchWeatherByCity: (cityName: string) => Promise<void>;
  getWeatherForLocation: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextProps | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState, () => {
    const savedFavorites = localStorage.getItem('weatherFavorites');
    const savedHistory = localStorage.getItem('weatherSearchHistory');
    const savedTheme = localStorage.getItem('weatherTheme') as 'dark' | 'light' | null;
    return {
      ...initialState,
      favorites: savedFavorites ? JSON.parse(savedFavorites) : [],
      searchHistory: savedHistory ? JSON.parse(savedHistory) : [],
      theme: savedTheme || 'dark',
    };
  });

  const fetchWeather = useCallback(async (lat: number, lon: number, cityName?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const data = await weatherService.getFullWeatherData(lat, lon, cityName);
      dispatch({ type: 'SET_WEATHER_DATA', payload: data });
      // Cache the data
      const cacheKey = `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`;
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (err: any) {
      // Try to load from cache
      const cacheKey = `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 30 * 60 * 1000) { // 30 min cache
          dispatch({ type: 'SET_WEATHER_DATA', payload: data });
          return;
        }
      }
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to fetch weather data' });
    }
  }, []);

  const fetchWeatherByCity = useCallback(async (cityName: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const data = await weatherService.getWeatherByCityName(cityName);
      dispatch({ type: 'SET_WEATHER_DATA', payload: data });
      dispatch({ type: 'ADD_TO_SEARCH_HISTORY', payload: cityName });
      // Cache
      const cacheKey = `weather_city_${cityName.toLowerCase()}`;
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (err: any) {
      const cacheKey = `weather_city_${cityName.toLowerCase()}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 30 * 60 * 1000) {
          dispatch({ type: 'SET_WEATHER_DATA', payload: data });
          return;
        }
      }
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to fetch weather data' });
    }
  }, []);

  const getWeatherForLocation = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });
      const { latitude, longitude } = position.coords;
      await fetchWeather(latitude, longitude);
    } catch {
      // Fallback to a default city
      await fetchWeather(40.7128, -74.006, 'New York');
    }
  }, [fetchWeather]);

  useEffect(() => {
    getWeatherForLocation();
  }, [getWeatherForLocation]);

  return (
    <WeatherContext.Provider value={{ state, dispatch, fetchWeather, fetchWeatherByCity, getWeatherForLocation }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within a WeatherProvider');
  return context;
};
