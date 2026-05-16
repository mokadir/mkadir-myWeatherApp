---
description: Apply these responsive design patterns when building React components
---

Use responsive Tailwind classes for all components: sm: (640px+), md: (768px+), lg: (1024px+). Always start with mobile-first (no prefix) then add larger breakpoints. Use text-[10px] sm:text-xs or text-xs sm:text-sm for font sizes. Use gap-2 sm:gap-3 md:gap-4 for spacing. Use p-3 sm:p-4 md:p-6 for padding. Make sure horizontal scroll containers use touch-pan-x and have proper scrollbar hiding. Keep settings panels full-width on mobile (w-[calc(100%-2rem)]) and fixed-width on desktop (w-72).