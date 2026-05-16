import React from 'react';
import { motion } from 'framer-motion';
import { FiDroplet, FiWind, FiSun, FiEye, FiThermometer, FiCompass } from 'react-icons/fi';
import { useWeather } from '../context/WeatherContext';
import { formatTemperature, getWindDirection, getUVIndexInfo, getVisibilityLabel, getWeatherIconUrl, getTimeFromTimestamp, getWeatherMood } from '../utils/helpers';

const CurrentWeather: React.FC = () => {
  const { state, dispatch } = useWeather();
  const { weatherData, unit } = state;

  if (!weatherData) return null;

  const { current, city, country } = weatherData;
  const uvInfo = getUVIndexInfo(current.uvIndex);
  const weatherMood = getWeatherMood(current.condition, current.temp);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  const toggleUnit = () => {
    dispatch({ type: 'SET_UNIT', payload: unit === 'celsius' ? 'fahrenheit' : 'celsius' });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto"
    >
      {/* City & Temperature Section */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/90 mb-2 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
        >
          {city}, {country}
        </motion.h1>
        <motion.p
          className="text-white/40 text-lg font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </motion.p>
      </motion.div>

      {/* Main Temperature Display */}
      <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-6">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img
              src={getWeatherIconUrl(current.icon)}
              alt={current.description}
              className="w-28 h-28 md:w-36 md:h-36 drop-shadow-2xl"
              style={{ filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}
            />
          </motion.div>
          <div className="flex flex-col items-start">
            <div className="flex items-start">
              <motion.span
                className="text-8xl md:text-9xl font-bold text-white tracking-tighter leading-none"
                key={current.temp}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {formatTemperature(current.temp, unit).slice(0, -1)}
              </motion.span>
              <motion.button
                onClick={toggleUnit}
                className="text-2xl md:text-3xl font-bold text-white/60 hover:text-white mt-4 transition-colors cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
              >
                °{unit === 'celsius' ? 'C' : 'F'}
              </motion.button>
            </div>
            <motion.p
              className="text-white/60 text-lg md:text-xl font-light capitalize mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {current.description}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* AI Weather Mood */}
      <motion.div
        variants={itemVariants}
        className="text-center mb-8"
      >
        <motion.div
          className="inline-block glass rounded-2xl px-6 py-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          <span className="text-white/80 text-lg font-light">{weatherMood}</span>
        </motion.div>
      </motion.div>

      {/* Details Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {/* Feels Like */}
        <DetailCard
          icon={<FiThermometer />}
          label="Feels Like"
          value={`${formatTemperature(current.feelsLike, unit)}`}
          delay={0}
        />

        {/* Humidity */}
        <DetailCard
          icon={<FiDroplet />}
          label="Humidity"
          value={`${current.humidity}%`}
          delay={0.1}
        />

        {/* Wind */}
        <DetailCard
          icon={<FiWind />}
          label="Wind"
          value={`${Math.round(current.windSpeed * 3.6)} km/h`}
          subvalue={getWindDirection(current.windDirection)}
          delay={0.2}
        />

        {/* UV Index */}
        <DetailCard
          icon={<FiSun />}
          label="UV Index"
          value={`${current.uvIndex}`}
          subvalue={uvInfo.label}
          color={uvInfo.color}
          delay={0.3}
        />

        {/* Visibility */}
        <DetailCard
          icon={<FiEye />}
          label="Visibility"
          value={`${(current.visibility / 1000).toFixed(1)} km`}
          subvalue={getVisibilityLabel(current.visibility)}
          delay={0.4}
        />

        {/* Pressure */}
        <DetailCard
          icon={<FiCompass />}
          label="Pressure"
          value={`${current.pressure} hPa`}
          delay={0.5}
        />

        {/* Sunrise */}
        <DetailCard
          icon={<FiSun />}
          label="Sunrise"
          value={getTimeFromTimestamp(current.sunrise)}
          delay={0.6}
        />

        {/* Sunset */}
        <DetailCard
          icon={<FiSun />}
          label="Sunset"
          value={getTimeFromTimestamp(current.sunset)}
          delay={0.7}
        />
      </motion.div>
    </motion.div>
  );
};

interface DetailCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subvalue?: string;
  color?: string;
  delay?: number;
}

const DetailCard: React.FC<DetailCardProps> = ({ icon, label, value, subvalue, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: 'easeOut' as const }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="glass rounded-2xl p-4 md:p-5 glass-hover group"
  >
    <div className="flex items-center gap-2 mb-3">
      <span className={`text-lg ${color ? '' : 'text-white/40'} group-hover:text-accent-blue transition-colors`}
        style={color ? { color } : undefined}>
        {icon}
      </span>
      <span className="text-white/40 text-xs uppercase tracking-wider font-medium">{label}</span>
    </div>
    <div className="text-white/90 text-xl md:text-2xl font-semibold">{value}</div>
    {subvalue && (
      <div className="text-white/30 text-xs mt-1">{subvalue}</div>
    )}
  </motion.div>
);

export default CurrentWeather;
