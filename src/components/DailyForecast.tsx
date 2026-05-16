import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';
import { useWeather } from '../context/WeatherContext';
import { formatTemperature, getDayFromTimestamp, getDateFromTimestamp, getWeatherIconUrl } from '../utils/helpers';

const DailyForecast: React.FC = () => {
  const { state } = useWeather();
  const { weatherData, unit } = state;

  if (!weatherData?.daily.length) return null;

  const daily = weatherData.daily.slice(0, 7);

  // Find overall temp range for consistent bar display
  const allTemps = daily.flatMap(d => [d.temp.min, d.temp.max]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const globalRange = globalMax - globalMin || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="glass rounded-3xl p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <FiCalendar className="text-accent-purple/70" />
        <h2 className="text-secondary text-sm font-medium uppercase tracking-wider">7-Day Forecast</h2>
      </div>

      {/* Daily items */}
      <div className="space-y-2">
        {daily.map((day, index) => {
          const isToday = index === 0;
          const minPercent = ((day.temp.min - globalMin) / globalRange) * 100;
          const maxPercent = ((day.temp.max - globalMin) / globalRange) * 100;

          return (
            <motion.div
              key={day.dt}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.08)' }}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 cursor-pointer
                ${isToday ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5'}`}
            >
              {/* Day name */}
              <div className="w-12 text-center">
                <span className={`text-sm font-medium ${isToday ? 'text-accent-blue' : 'text-tertiary'}`}>
                  {isToday ? 'Today' : getDayFromTimestamp(day.dt)}
                </span>
                {!isToday && (
                  <div className="text-[10px] text-dim">{getDateFromTimestamp(day.dt)}</div>
                )}
              </div>

              {/* Weather icon */}
              <div className="w-10 flex justify-center">
                <img
                  src={getWeatherIconUrl(day.icon)}
                  alt={day.condition}
                  className="w-8 h-8"
                  style={{ filter: 'brightness(1.1)' }}
                />
              </div>

              {/* Condition */}
              <div className="w-20 hidden sm:block">
                <span className="text-muted text-xs capitalize truncate block">{day.description}</span>
              </div>

              {/* Min temp */}
              <div className="w-10 sm:w-12 text-right">
                <span className="text-muted text-xs sm:text-sm">
                  {formatTemperature(day.temp.min, unit)}
                </span>
              </div>

              {/* Temperature bar */}
              <div className="flex-1 px-1 sm:px-3">
                <div className="relative h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute h-full rounded-full bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-orange"
                    initial={{ width: 0 }}
                    animate={{ width: `${maxPercent - minPercent}%` }}
                    transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
                    style={{ left: `${minPercent}%` }}
                  />
                </div>
              </div>

              {/* Max temp */}
              <div className="w-10 sm:w-12 text-left">
                <span className="text-secondary text-xs sm:text-sm font-medium">
                  {formatTemperature(day.temp.max, unit)}
                </span>
              </div>

              {/* Precipitation */}
              {day.pop > 0 && (
                <div className="w-10 text-right hidden sm:block">
                  <span className="text-accent-blue/60 text-xs">{day.pop}%</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DailyForecast;
