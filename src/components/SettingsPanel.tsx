import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiVolume2, FiVolumeX, FiCloudRain, FiWind, FiZap, FiSettings, FiStar, FiX, FiBell, FiBellOff } from 'react-icons/fi';
import { useWeather } from '../context/WeatherContext';

const SettingsPanel: React.FC = () => {
  const { state, dispatch } = useWeather();
  const [isOpen, setIsOpen] = useState(false);

  const soundOptions = [
    { type: 'rain' as const, label: 'Rain', icon: <FiCloudRain /> },
    { type: 'thunder' as const, label: 'Thunder', icon: <FiZap /> },
    { type: 'wind' as const, label: 'Wind', icon: <FiWind /> },
  ];

  return (
    <>
      {/* Settings Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3 bg-white/10 backdrop-blur-xl border border-white/10 
                   rounded-full text-white/60 hover:text-accent-blue hover:border-accent-blue/50
                   transition-all duration-300 shadow-lg"
        aria-label="Toggle settings"
      >
        <FiSettings className="w-5 h-5" />
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed bottom-24 right-6 z-50 w-72 glass-strong rounded-2xl p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/80 text-sm font-medium">Settings</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/30 hover:text-white/70 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Sound Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs uppercase tracking-wider">Sound Ambience</span>
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
                    className={`p-1.5 rounded-lg transition-colors ${state.soundEnabled ? 'text-accent-blue bg-accent-blue/10' : 'text-white/30 hover:text-white/60'}`}
                    aria-label="Toggle sound"
                  >
                    {state.soundEnabled ? <FiVolume2 className="w-4 h-4" /> : <FiVolumeX className="w-4 h-4" />}
                  </button>
                </div>

                {state.soundEnabled && (
                  <div className="flex gap-2">
                    {soundOptions.map((option) => (
                      <button
                        key={option.type}
                        onClick={() => dispatch({ type: 'SET_SOUND_TYPE', payload: option.type })}
                        className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300
                          ${state.soundType === option.type
                            ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                            : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 border border-transparent'
                          }`}
                      >
                        <span className="text-lg">{option.icon}</span>
                        <span className="text-[10px]">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="border-t border-white/5 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-xs uppercase tracking-wider">Weather Alerts</span>
                    <button
                      onClick={() => dispatch({ type: 'TOGGLE_ALERTS' })}
                      className={`p-1.5 rounded-lg transition-colors ${state.showAlerts ? 'text-accent-cyan bg-accent-cyan/10' : 'text-white/30 hover:text-white/60'}`}
                      aria-label="Toggle alerts"
                    >
                      {state.showAlerts ? <FiBell className="w-4 h-4" /> : <FiBellOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Favorite Current City */}
                {state.weatherData && (
                  <div className="border-t border-white/5 pt-3">
                    <button
                      onClick={() => {
                        dispatch({
                          type: 'ADD_FAVORITE',
                          payload: {
                            name: state.weatherData!.city,
                            country: state.weatherData!.country,
                            lat: state.weatherData!.coordinates.lat,
                            lon: state.weatherData!.coordinates.lon,
                            addedAt: Date.now(),
                          },
                        });
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <FiStar className="text-accent-yellow/50" />
                      <span className="text-white/60 text-sm">Save current city</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsPanel;
