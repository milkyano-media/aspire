'use client';

interface ScrollDownIndicatorProps {
  targetId?: string;
}

export function ScrollDownIndicator({ targetId = 'form' }: ScrollDownIndicatorProps) {
  const handleClick = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="relative w-24 h-24 md:w-28 md:h-28 cursor-pointer group"
      aria-label="Scroll down to form"
    >
      {/* Rotating text circle */}
      <svg
        className="w-full h-full animate-spin-slow"
        viewBox="0 0 100 100"
      >
        <defs>
          <path
            id="circlePath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>
        <text className="text-[11px] fill-[#1a2b4a] uppercase tracking-[0.3em]">
          <textPath href="#circlePath" startOffset="0%">
            SCROLL DOWN • SCROLL DOWN •
          </textPath>
        </text>
      </svg>

      {/* Center arrow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-[#ffa737] group-hover:translate-y-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </button>
  );
}
