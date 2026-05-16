import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in px-2 sm:px-0">
      {/* City & Date */}
      <div className="text-center space-y-2 sm:space-y-3">
        <div className="skeleton-shimmer h-8 sm:h-10 w-48 sm:w-64 mx-auto rounded-lg" />
        <div className="skeleton-shimmer h-4 sm:h-5 w-36 sm:w-48 mx-auto rounded" />
      </div>

      {/* Main Temperature */}
      <div className="flex flex-col items-center space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="skeleton-shimmer h-20 w-20 sm:h-28 sm:w-28 rounded-full" />
          <div className="skeleton-shimmer h-24 sm:h-32 w-28 sm:w-40 rounded-lg" />
        </div>
      </div>

      {/* Mood Card */}
      <div className="flex justify-center">
        <div className="skeleton-shimmer h-10 sm:h-12 w-48 sm:w-60 rounded-2xl" />
      </div>

      {/* Detail Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-24 sm:h-28 rounded-2xl" />
        ))}
      </div>

      {/* Hourly Forecast */}
      <div className="skeleton-shimmer h-40 sm:h-48 rounded-3xl" />

      {/* Daily Forecast */}
      <div className="skeleton-shimmer h-60 sm:h-72 rounded-3xl" />

      {/* Air Quality */}
      <div className="skeleton-shimmer h-40 sm:h-48 rounded-3xl" />

      {/* Additional Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="skeleton-shimmer h-36 sm:h-40 rounded-3xl" />
        <div className="skeleton-shimmer h-36 sm:h-40 rounded-3xl" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
