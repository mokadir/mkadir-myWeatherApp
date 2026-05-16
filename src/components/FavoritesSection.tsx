import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiX } from 'react-icons/fi';
import { useWeather } from '../context/WeatherContext';

const FavoritesSection: React.FC = () => {
  const { state, dispatch, fetchWeather } = useWeather();

  if (!state.favorites.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass rounded-3xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <FiStar className="text-accent-yellow/70" />
        <h2 className="text-white/80 text-sm font-medium uppercase tracking-wider">Favorite Cities</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {state.favorites.map((fav, i) => (
          <motion.div
            key={`${fav.lat}-${fav.lon}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative"
          >
            <button
              onClick={() => fetchWeather(fav.lat, fav.lon, fav.name)}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl
                         text-white/70 hover:text-white text-sm transition-all duration-300 flex items-center gap-2"
            >
              <FiStar className="text-accent-yellow/50 group-hover:text-accent-yellow transition-colors" />
              <span>{fav.name}, {fav.country}</span>
            </button>
            <button
              onClick={() => dispatch({ type: 'REMOVE_FAVORITE', payload: `${fav.lat}-${fav.lon}` })}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove ${fav.name} from favorites`}
            >
              <FiX className="w-3 h-3 text-white" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FavoritesSection;
