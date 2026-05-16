import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import WeatherBackground from './components/WeatherBackground';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import AirQuality from './components/AirQuality';
import WeatherAlerts from './components/WeatherAlerts';
import LoadingSkeleton from './components/LoadingSkeleton';
import FavoritesSection from './components/FavoritesSection';
import SettingsPanel from './components/SettingsPanel';

const WeatherDashboard: React.FC = () => {
  const { state } = useWeather();
  const { loading, error, weatherData, theme } = state;

  useEffect(() => {
    // Apply theme to <html> element
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <div className="relative min-h-screen text-white transition-colors duration-500">
      <WeatherBackground />
      <WeatherAlerts />
      <SettingsPanel />

      <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8 lg:py-10">
        {/* Header with Search */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple 
                           flex items-center justify-center shadow-glow-blue"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </motion.div>
              <div>
                <h1 className="text-white/90 text-base sm:text-xl font-bold tracking-tight">WeatherVault</h1>
                <p className="text-white/30 text-[10px] sm:text-xs">Premium Weather Intelligence</p>
              </div>
            </div>

            {/* Status indicators */}
            {weatherData && (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-white/30 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-glow" />
                  Live
                </div>
                <div className="flex items-center gap-1.5 text-white/30 text-xs">
                  <FiRefreshIcon />
                  Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
          </div>

          <SearchBar />
        </motion.header>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSkeleton />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <div className="glass rounded-3xl p-8 max-w-md mx-auto">
                <div className="text-red-400 text-5xl mb-4">⚠</div>
                <h2 className="text-secondary text-xl font-semibold mb-2">Unable to Load Weather</h2>
                <p className="text-muted text-sm mb-6">{error}</p>
                <p className="text-dim text-xs">
                  Make sure you have a valid OpenWeatherMap API key configured.
                  Check the console for more details.
                </p>
              </div>
            </motion.div>
          ) : weatherData ? (
            <motion.main
              key="weather"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 md:space-y-8"
            >
              <CurrentWeather />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <HourlyForecast />
                  <DailyForecast />
                </div>
                <div className="space-y-6">
                  <AirQuality />
                  <SunriseSunsetCard />
                  <FavoritesSection />
                </div>
              </div>

              {/* Footer */}
              <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center py-6 sm:py-8"
              >
                <p className="text-faint text-[10px] sm:text-xs">
                  WeatherVault · Premium Weather Intelligence
                </p>
              </motion.footer>
            </motion.main>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FiRefreshIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const SunriseSunsetCard: React.FC = () => {
  const { state } = useWeather();
  const { weatherData } = state;

  if (!weatherData) return null;

  const { sunrise, sunset } = weatherData.current;
  const now = Date.now() / 1000;
  const dayLength = sunset - sunrise;
  const elapsed = now - sunrise;
  const progress = Math.min(1, Math.max(0, elapsed / dayLength));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="glass rounded-3xl p-6"
    >
      <h3 className="text-dim text-xs uppercase tracking-wider mb-4">Daylight</h3>

      <div className="relative mb-4">
        {/* Sun arc visualization */}
        <svg className="w-full h-16" viewBox="0 0 300 60">
          <defs>
            <linearGradient id="sunArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff9a3c" stopOpacity="0.3" />
              <stop offset={`${progress * 100}%`} stopColor="#ffbe0b" stopOpacity="0.8" />
              <stop offset={`${progress * 100}%`} stopColor="#ffbe0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1a1a3e" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Arc path */}
          <path
            d="M 10 55 Q 150 -10 290 55"
            fill="none"
            stroke="url(#sunArc)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Sun position */}
          <motion.circle
            cx={10 + (progress * 280)}
            cy={55 - (Math.sin(progress * Math.PI) * 55)}
            r="6"
            fill="#ffbe0b"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          />
          <motion.circle
            cx={10 + (progress * 280)}
            cy={55 - (Math.sin(progress * Math.PI) * 55)}
            r="12"
            fill="#ffbe0b"
            opacity="0.2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 0.3 }}
          />
        </svg>
      </div>

      <div className="flex justify-between">
        <div>
          <div className="text-dim text-xs">Sunrise</div>
          <div className="text-secondary text-sm font-medium">
            {new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="text-center">
          <div className="text-dim text-xs">Daylight</div>
          <div className="text-secondary text-sm font-medium">
            {Math.floor(dayLength / 3600)}h {Math.floor((dayLength % 3600) / 60)}m
          </div>
        </div>
        <div className="text-right">
          <div className="text-dim text-xs">Sunset</div>
          <div className="text-secondary text-sm font-medium">
            {new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function App() {
  return (
    <WeatherProvider>
      <WeatherDashboard />
    </WeatherProvider>
  );
}

export default App;
