import { WeatherCondition } from '../types';

export const getWeatherBackground = (condition: WeatherCondition, isDay: boolean): string => {
  const backgrounds: Record<WeatherCondition, { day: string; night: string }> = {
    clear: {
      day: 'linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 60%, #f5576c 100%)',
      night: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    },
    cloudy: {
      day: 'linear-gradient(135deg, #89ABE3 0%, #B8C6DB 50%, #E2E2E2 100%)',
      night: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    rain: {
      day: 'linear-gradient(135deg, #3b6e8f 0%, #2c5a7a 30%, #1a3a5c 70%, #0d2137 100%)',
      night: 'linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #162447 70%, #1a1a2e 100%)',
    },
    drizzle: {
      day: 'linear-gradient(135deg, #4a7c9a 0%, #3b6e8f 50%, #2c5a7a 100%)',
      night: 'linear-gradient(135deg, #0d2137 0%, #162447 50%, #1a1a2e 100%)',
    },
    thunderstorm: {
      day: 'linear-gradient(135deg, #1a1a2e 0%, #2d3047 30%, #3b2c3c 60%, #4a1942 100%)',
      night: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 30%, #2d3047 60%, #1a1a2e 100%)',
    },
    snow: {
      day: 'linear-gradient(135deg, #a8d8ea 0%, #c7ecee 30%, #dff9fb 60%, #f0f8ff 100%)',
      night: 'linear-gradient(135deg, #1a1a3e 0%, #2c2c54 30%, #40407a 60%, #2c2c54 100%)',
    },
    mist: {
      day: 'linear-gradient(135deg, #b8c6db 0%, #d4d4d4 50%, #e8e8e8 100%)',
      night: 'linear-gradient(135deg, #1a1a2e 0%, #2c2c3e 50%, #3a3a4a 100%)',
    },
    fog: {
      day: 'linear-gradient(135deg, #b8c6db 0%, #c8c8c8 50%, #dcdcdc 100%)',
      night: 'linear-gradient(135deg, #1a1a2e 0%, #2c2c3e 50%, #3a3a4a 100%)',
    },
    haze: {
      day: 'linear-gradient(135deg, #d4a373 0%, #e9c46a 30%, #f4a261 70%, #e76f51 100%)',
      night: 'linear-gradient(135deg, #2d1b00 0%, #4a2c00 50%, #1a1a2e 100%)',
    },
    dust: {
      day: 'linear-gradient(135deg, #cb997e 0%, #ddbea9 30%, #ffe8d6 70%, #b7b7a4 100%)',
      night: 'linear-gradient(135deg, #2d1b00 0%, #4a3c2e 50%, #1a1a2e 100%)',
    },
    tornado: {
      day: 'linear-gradient(135deg, #2d3047 0%, #3b2c3c 30%, #4a1942 60%, #1a1a2e 100%)',
      night: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 30%, #2d3047 60%, #1a1a2e 100%)',
    },
    squall: {
      day: 'linear-gradient(135deg, #2d3047 0%, #3b2c3c 30%, #4a1942 60%, #1a1a2e 100%)',
      night: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 30%, #2d3047 60%, #1a1a2e 100%)',
    },
  };

  const bg = backgrounds[condition] || backgrounds.cloudy;
  return isDay ? bg.day : bg.night;
};

export const getAirQualityInfo = (aqi: number): { label: string; color: string; percentage: number } => {
  const levels = [
    { label: 'Good', color: '#00e676', percentage: 20 },
    { label: 'Fair', color: '#ffeb3b', percentage: 40 },
    { label: 'Moderate', color: '#ff9800', percentage: 60 },
    { label: 'Poor', color: '#f44336', percentage: 80 },
    { label: 'Very Poor', color: '#880e4f', percentage: 100 },
  ];
  return levels[aqi - 1] || levels[0];
};

export const formatTemperature = (temp: number, unit: 'celsius' | 'fahrenheit'): string => {
  if (unit === 'fahrenheit') {
    return `${Math.round((temp * 9 / 5) + 32)}°`;
  }
  return `${Math.round(temp)}°`;
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const getUVIndexInfo = (uvIndex: number): { label: string; color: string } => {
  if (uvIndex <= 2) return { label: 'Low', color: '#00e676' };
  if (uvIndex <= 5) return { label: 'Moderate', color: '#ffeb3b' };
  if (uvIndex <= 7) return { label: 'High', color: '#ff9800' };
  if (uvIndex <= 10) return { label: 'Very High', color: '#f44336' };
  return { label: 'Extreme', color: '#880e4f' };
};

export const getVisibilityLabel = (meters: number): string => {
  if (meters >= 10000) return 'Excellent';
  if (meters >= 5000) return 'Good';
  if (meters >= 1000) return 'Moderate';
  return 'Poor';
};

export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
};

export const getTimeFromTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getDayFromTimestamp = (timestamp: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(timestamp * 1000).getDay()];
};

export const getDateFromTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const getWeatherMood = (condition: string, temp: number): string => {
  const moods: Record<string, string[]> = {
    clear: [
      'Perfect day for a walk in the park! 🌳',
      'Great weather for outdoor activities! ☀️',
      'Time to soak up some vitamin D! 🌞',
    ],
    cloudy: [
      'Cozy day to curl up with a book 📚',
      'Perfect weather for a coffee date ☕',
      'Good day for indoor activities 🏠',
    ],
    rain: [
      'Perfect weather to listen to some lo-fi 🎵',
      'Great day to stay in and watch a movie 🎬',
      'Time to make some hot cocoa! ☕',
    ],
    thunderstorm: [
      'Best to stay indoors and stay safe ⚡',
      'Dramatic weather - perfect for a thriller movie! 🎥',
      'Great day for some indoor gaming 🎮',
    ],
    snow: [
      'Winter wonderland outside! ⛄',
      'Perfect for building a snowman! ☃️',
      'Time for some hot chocolate! 🍫',
    ],
    default: [
      'Enjoy your day! ✨',
      'Another beautiful day! 🌟',
      'Make the most of today! 💫',
    ],
  };

  const conditionMoods = moods[condition] || moods.default;
  return conditionMoods[Math.floor(Math.random() * conditionMoods.length)];
};

export const convertTemp = (celsius: number, unit: 'celsius' | 'fahrenheit'): number => {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9 / 5) + 32);
  }
  return Math.round(celsius);
};
