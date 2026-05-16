import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import { useWeather } from '../context/WeatherContext';

const WeatherAlerts: React.FC = () => {
  const { state, dispatch } = useWeather();
  const { weatherData, dismissedAlerts, showAlerts } = state;

  if (!weatherData?.alerts.length || !showAlerts) return null;

  const activeAlerts = weatherData.alerts.filter(
    alert => !dismissedAlerts.includes(alert.event)
  );

  if (!activeAlerts.length) return null;

  const severityColors = {
    minor: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-300', icon: 'text-yellow-400' },
    moderate: { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-300', icon: 'text-orange-400' },
    severe: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-300', icon: 'text-red-400' },
    extreme: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-300', icon: 'text-purple-400' },
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full space-y-2">
      <AnimatePresence>
        {activeAlerts.map((alert) => {
          const colors = severityColors[alert.severity] || severityColors.moderate;

          return (
            <motion.div
              key={alert.event}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`${colors.bg} ${colors.border} backdrop-blur-xl border rounded-2xl p-4 shadow-2xl`}
            >
              <div className="flex items-start gap-3">
                <FiAlertTriangle className={`${colors.icon} text-xl mt-0.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`${colors.text} text-sm font-semibold`}>{alert.event}</span>
                    <button
                      onClick={() => dispatch({ type: 'DISMISS_ALERT', payload: alert.event })}
                      className="text-white/30 hover:text-white/70 transition-colors shrink-0"
                      aria-label="Dismiss alert"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-white/60 text-xs mt-1 line-clamp-2">{alert.description}</p>
                  <p className="text-white/30 text-[10px] mt-1">
                    {new Date(alert.start * 1000).toLocaleTimeString()} - {new Date(alert.end * 1000).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default WeatherAlerts;
