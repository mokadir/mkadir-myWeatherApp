import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';
import { useWeather } from '../context/WeatherContext';
import { formatTemperature, getWeatherIconUrl } from '../utils/helpers';

const HourlyForecast: React.FC = () => {
  const { state } = useWeather();
  const { weatherData, unit } = state;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [, setScrollPos] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const hourlyData = weatherData?.hourly?.slice(0, 24);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setScrollPos(scrollLeft);
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    ref?.addEventListener('scroll', checkScroll);
    return () => ref?.removeEventListener('scroll', checkScroll);
  }, []);

  if (!hourlyData?.length) return null;

  const hourly = hourlyData;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  // Find min/max temps for the chart
  const temps = hourly.map(h => h.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = maxTemp - minTemp || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="glass rounded-3xl p-6 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FiClock className="text-accent-blue/70" />
          <h2 className="text-white/80 text-sm font-medium uppercase tracking-wider">Hourly Forecast</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className={`p-1.5 rounded-lg transition-all ${canScrollLeft ? 'bg-white/10 text-white/60 hover:bg-white/20' : 'bg-white/5 text-white/20 cursor-default'}`}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className={`p-1.5 rounded-lg transition-all ${canScrollRight ? 'bg-white/10 text-white/60 hover:bg-white/20' : 'bg-white/5 text-white/20 cursor-default'}`}
            aria-label="Scroll right"
            disabled={!canScrollRight}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable hourly cards with temperature graph */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {hourly.map((hour, index) => {
          const isNow = index === 0;
          const hourLabel = index === 0
            ? 'Now'
            : new Date(hour.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true });
          const tempPercent = ((hour.temp - minTemp) / range) * 100;
          const iconUrl = getWeatherIconUrl(hour.icon);

          return (
            <motion.div
              key={hour.dt}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className={`flex flex-col items-center min-w-[80px] p-4 rounded-2xl transition-all duration-300 cursor-pointer
                ${isNow
                  ? 'bg-accent-blue/20 border border-accent-blue/30 shadow-glow-blue'
                  : 'bg-white/5 border border-white/5 hover:bg-white/10'
                }`}
            >
              {/* Time label */}
              <span className={`text-xs font-medium mb-2 ${isNow ? 'text-accent-blue' : 'text-white/50'}`}>
                {hourLabel}
              </span>

              {/* Icon */}
              <div className="relative mb-2">
                <img
                  src={iconUrl}
                  alt={hour.condition}
                  className="w-10 h-10 drop-shadow-lg"
                  style={{ filter: 'brightness(1.1)' }}
                />
              </div>

              {/* Temperature */}
              <span className={`text-lg font-bold ${isNow ? 'text-white' : 'text-white/80'}`}>
                {formatTemperature(hour.temp, unit)}
              </span>

              {/* Precipitation probability */}
              {hour.pop > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <svg className="w-3 h-3 text-accent-blue/60" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3a1 1 0 01.707.293l5.657 5.657a1 1 0 01-1.414 1.414L11 6.414V17a1 1 0 11-2 0V6.414l-3.95 3.95a1 1 0 01-1.414-1.414l5.657-5.657A1 1 0 0110 3z" />
                  </svg>
                  <span className="text-accent-blue/60 text-xs">{hour.pop}%</span>
                </div>
              )}

              {/* Mini temperature bar */}
              <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-300"
                  style={{ width: `${Math.max(10, tempPercent)}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HourlyForecast;
