import React from 'react';
import { motion } from 'framer-motion';
import { FiWind } from 'react-icons/fi';
import { useWeather } from '../context/WeatherContext';
import { getAirQualityInfo } from '../utils/helpers';

const AirQuality: React.FC = () => {
  const { state } = useWeather();
  const { weatherData } = state;

  if (!weatherData?.airQuality) return null;

  const { aqi, components } = weatherData.airQuality;
  const aqiInfo = getAirQualityInfo(aqi);

  const componentLabels: Record<string, string> = {
    co: 'CO',
    no: 'NO',
    no2: 'NO₂',
    o3: 'O₃',
    so2: 'SO₂',
    pm2_5: 'PM2.5',
    pm10: 'PM10',
    nh3: 'NH₃',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="glass rounded-3xl p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <FiWind className="text-accent-cyan/70" />
        <h2 className="text-white/80 text-sm font-medium uppercase tracking-wider">Air Quality</h2>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Circular AQI Indicator */}
        <div className="relative w-36 h-36">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={aqiInfo.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${aqiInfo.percentage * 3.14} ${(100 - aqiInfo.percentage) * 3.14}`}
              initial={{ strokeDasharray: '0 314' }}
              animate={{ strokeDasharray: `${aqiInfo.percentage * 3.14} ${(100 - aqiInfo.percentage) * 3.14}` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-4xl font-bold"
              style={{ color: aqiInfo.color }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {aqi}
            </motion.span>
            <span className="text-white/40 text-xs uppercase mt-1">AQI</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 w-full">
          <div className="text-center lg:text-left mb-4">
            <motion.span
              className="text-xl font-semibold"
              style={{ color: aqiInfo.color }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {aqiInfo.label}
            </motion.span>
            <p className="text-white/30 text-xs mt-1">Current Air Quality Index</p>
          </div>

          {/* Component grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(components).slice(0, 8).map(([key, value], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="bg-white/5 rounded-xl p-3 text-center"
              >
                <div className="text-white/90 text-sm font-semibold">{value.toFixed(1)}</div>
                <div className="text-white/30 text-xs">{componentLabels[key] || key}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AirQuality;
