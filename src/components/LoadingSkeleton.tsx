import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* City & Date */}
      <div className="text-center space-y-3">
        <div className="skeleton-shimmer h-10 w-64 mx-auto" />
        <div className="skeleton-shimmer h-5 w-48 mx-auto" />
      </div>

      {/* Main Temperature */}
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-4">
          <div className="skeleton-shimmer h-28 w-28 rounded-full" />
          <div className="skeleton-shimmer h-32 w-40" />
        </div>
      </div>

      {/* Mood Card */}
      <div className="flex justify-center">
        <div className="skeleton-shimmer h-12 w-60 rounded-2xl" />
      </div>

      {/* Detail Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-28 rounded-2xl" />
        ))}
      </div>

      {/* Hourly Forecast */}
      <div className="skeleton-shimmer h-48 rounded-3xl" />

      {/* Daily Forecast */}
      <div className="skeleton-shimmer h-72 rounded-3xl" />

      {/* Air Quality */}
      <div className="skeleton-shimmer h-48 rounded-3xl" />

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="skeleton-shimmer h-40 rounded-3xl" />
        <div className="skeleton-shimmer h-40 rounded-3xl" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
