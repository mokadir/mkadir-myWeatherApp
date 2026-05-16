import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import { getWeatherBackground } from '../utils/helpers';

const WeatherBackground: React.FC = () => {
  const { state } = useWeather();
  const { weatherData } = state;

  const isDay = useMemo(() => {
    if (!weatherData) return true;
    const now = Date.now() / 1000;
    return now > weatherData.current.sunrise && now < weatherData.current.sunset;
  }, [weatherData]);

  const condition = weatherData?.current.condition || 'clear';
  const gradient = useMemo(() => getWeatherBackground(condition as any, isDay), [condition, isDay]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: gradient }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />

      {/* Animated weather particles */}
      {condition === 'rain' && <RainEffect />}
      {condition === 'drizzle' && <RainEffect density="light" />}
      {condition === 'thunderstorm' && <ThunderstormEffect />}
      {condition === 'snow' && <SnowEffect />}
      {condition === 'clear' && <SunEffect />}
      {condition === 'cloudy' && <CloudEffect />}
      {condition === 'mist' || condition === 'fog' || condition === 'haze' ? <FogEffect /> : null}

      {/* Floating particles */}
      <ParticleField />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </div>
  );
};

const RainEffect: React.FC<{ density?: 'light' | 'normal' | 'heavy' }> = ({ density = 'normal' }) => {
  const count = density === 'light' ? 50 : density === 'heavy' ? 200 : 100;
  const drops = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${0.5 + Math.random() * 0.3}s`,
      height: `${10 + Math.random() * 20}px`,
      opacity: 0.3 + Math.random() * 0.4,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute animate-rain-drop"
          style={{
            left: drop.left,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
            opacity: drop.opacity,
          }}
        >
          <div
            className="w-[1px] bg-gradient-to-b from-transparent via-blue-300/60 to-blue-400/40 rounded-full"
            style={{ height: drop.height }}
          />
        </div>
      ))}
    </div>
  );
};

const ThunderstormEffect: React.FC = () => {
  return (
    <>
      <RainEffect density="heavy" />
      {/* Lightning flashes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 animate-lightning bg-white/30" />
        <div
          className="absolute inset-0 animate-lightning bg-white/20"
          style={{ animationDelay: '1.3s', animationDuration: '5s' }}
        />
        <div
          className="absolute inset-0 animate-lightning bg-white/10"
          style={{ animationDelay: '2.7s', animationDuration: '6s' }}
        />
      </div>
    </>
  );
};

const SnowEffect: React.FC = () => {
  const flakes = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
      size: `${2 + Math.random() * 6}px`,
      opacity: 0.4 + Math.random() * 0.5,
      drift: `${-30 + Math.random() * 60}px`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            filter: 'blur(0.5px)',
          }}
          animate={{
            y: ['-10px', '100vh'],
            x: [0, flake.drift],
            rotate: [0, 360],
            opacity: [0, flake.opacity, flake.opacity, 0],
          }}
          transition={{
            duration: parseFloat(flake.duration),
            repeat: Infinity,
            delay: parseFloat(flake.delay),
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

const SunEffect: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sun glow */}
      <div className="absolute top-20 right-20 w-64 h-64">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300/30 via-orange-300/20 to-transparent blur-3xl animate-pulse-glow" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-200/40 via-orange-200/20 to-transparent blur-2xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Moving sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <div
          key={i}
          className="absolute top-32 right-20 w-96 h-1 animate-sun-ray"
          style={{
            transformOrigin: 'left center',
            transform: `rotate(${angle}deg)`,
            animationDelay: `${i * 0.5}s`,
            background: 'linear-gradient(90deg, rgba(255,200,50,0.3) 0%, transparent 100%)',
          }}
        />
      ))}
    </div>
  );
};

const CloudEffect: React.FC = () => {
  const clouds = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: `${5 + Math.random() * 30}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${25 + Math.random() * 20}s`,
      size: 100 + Math.random() * 200,
      opacity: 0.1 + Math.random() * 0.15,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute animate-cloud"
          style={{
            top: cloud.top,
            animationDelay: cloud.delay,
            animationDuration: cloud.duration,
            opacity: cloud.opacity,
          }}
        >
          <svg width={cloud.size} height={cloud.size * 0.6} viewBox="0 0 200 120" fill="white">
            <ellipse cx="60" cy="70" rx="50" ry="35" />
            <ellipse cx="100" cy="50" rx="60" ry="40" />
            <ellipse cx="140" cy="65" rx="45" ry="30" />
            <ellipse cx="100" cy="60" rx="70" ry="35" />
          </svg>
        </div>
      ))}
    </div>
  );
};

const FogEffect: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-white/5 animate-pulse-glow" />
      <div className="absolute inset-0 bg-white/10 animate-pulse-glow" style={{ animationDelay: '2s' }} />
    </div>
  );
};

const ParticleField: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${6 + Math.random() * 6}s`,
      size: `${1 + Math.random() * 3}px`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: parseFloat(p.duration),
            repeat: Infinity,
            delay: parseFloat(p.delay),
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default WeatherBackground;
