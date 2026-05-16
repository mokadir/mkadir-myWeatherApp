import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiX, FiClock, FiStar, FiNavigation } from 'react-icons/fi';
import { useWeather } from '../context/WeatherContext';
import { CitySearchResult } from '../types';
import { weatherService } from '../utils/weatherService';

const SearchBar: React.FC = () => {
  const { state, dispatch, fetchWeather, getWeatherForLocation, fetchWeatherByCity } = useWeather();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  const searchCities = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const cities = await weatherService.searchCities(q);
      setResults(cities);
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchCities(val), 300);
  };

  const selectCity = (city: CitySearchResult) => {
    dispatch({ type: 'SET_SELECTED_CITY', payload: city });
    dispatch({ type: 'ADD_TO_SEARCH_HISTORY', payload: `${city.name}, ${city.country}` });
    fetchWeather(city.lat, city.lon, city.name);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleGeolocation = () => {
    getWeatherForLocation();
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleHistoryClick = (cityName: string) => {
    fetchWeatherByCity(cityName.split(',')[0]);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center gap-2 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/40 text-base sm:text-lg" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Search city..."
            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/10 backdrop-blur-xl border border-white/10 
                       rounded-xl sm:rounded-2xl text-white placeholder-white/40 font-light
                       focus:outline-none focus:border-accent-blue/50 focus:bg-white/15
                       transition-all duration-300 text-sm sm:text-base"
            aria-label="Search for a city"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResults([]); }}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* Geolocation button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGeolocation}
          className="p-3 sm:p-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl
                     text-white/70 hover:text-accent-blue hover:border-accent-blue/50
                     transition-all duration-300 shrink-0"
          aria-label="Use current location"
        >
          <FiNavigation className="text-base sm:text-lg" />
        </motion.button>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 left-0 right-0 sm:right-[76px] z-50">
            <div className="bg-gray-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Search results */}
              {isSearching ? (
                <div className="p-4 text-center text-white/40 text-sm">
                  Searching...
                </div>
              ) : results.length > 0 ? (
                <div>
                  <div className="px-4 py-2 text-xs text-white/30 uppercase tracking-wider font-medium">
                    Search Results
                  </div>
                  {results.map((city, i) => (
                    <motion.button
                      key={`${city.lat}-${city.lon}-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => selectCity(city)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left group"
                    >
                      <FiMapPin className="text-white/30 group-hover:text-accent-blue transition-colors shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-white/80 text-sm font-medium block truncate">
                          {city.name}
                        </span>
                        <span className="text-white/30 text-xs">
                          {city.country}{city.state ? `, ${city.state}` : ''}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : query.length >= 2 ? (
                <div className="p-4 text-center text-white/40 text-sm">
                  No cities found
                </div>
              ) : null}

              {/* Search history */}
              {state.searchHistory.length > 0 && results.length === 0 && (
                <div>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-xs text-white/30 uppercase tracking-wider font-medium">
                      Recent Searches
                    </span>
                    <FiClock className="text-white/20 text-xs" />
                  </div>
                  {state.searchHistory.slice(0, 5).map((item, i) => (
                    <motion.button
                      key={item + i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => handleHistoryClick(item)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left group"
                    >
                      <FiClock className="text-white/20 group-hover:text-accent-blue transition-colors shrink-0" />
                      <span className="text-white/60 text-sm truncate">{item}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Favorites */}
              {state.favorites.length > 0 && results.length === 0 && (
                <div>
                  <div className="px-4 py-2 flex items-center justify-between border-t border-white/5">
                    <span className="text-xs text-white/30 uppercase tracking-wider font-medium">
                      Favorites
                    </span>
                    <FiStar className="text-accent-yellow text-xs" />
                  </div>
                  {state.favorites.slice(0, 3).map((fav, i) => (
                    <motion.button
                      key={fav.name + i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => fetchWeather(fav.lat, fav.lon, fav.name)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left group"
                    >
                      <FiStar className="text-accent-yellow/50 group-hover:text-accent-yellow transition-colors shrink-0" />
                      <span className="text-white/60 text-sm truncate">
                        {fav.name}, {fav.country}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
