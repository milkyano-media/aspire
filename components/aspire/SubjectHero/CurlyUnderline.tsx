interface CurlyUnderlineProps {
  className?: string;
  strokeWidth?: number;
}

export function CurlyUnderline({
  className = '',
  strokeWidth = 3, // default value
}: CurlyUnderlineProps) {
  return (
    <svg
      className={`absolute -bottom-2 left-0 w-full ${className}`}
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 4C10 0, 20 8, 30 4C40 0, 50 8, 60 4C70 0, 80 8, 90 4C95 2, 100 4, 100 4"
        stroke="#ffa737"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
