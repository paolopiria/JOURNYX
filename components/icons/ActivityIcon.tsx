import React from 'react';

interface IconProps {
  active?: boolean;
  size?: number;
  className?: string;
}

export const ActivityIcon: React.FC<IconProps> = ({ active = false, size = 28, className }) => {
  const hasTextColor = className?.split(' ').some(c => c.startsWith('text-'));
  const textColor = hasTextColor ? '' : (active ? 'text-[#764d9a]' : 'text-slate-400');
  const fillAccent = active ? '#764d9a' : 'none';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={`${textColor} ${className || ''}`}
    >
      <path
        d="M19.24,26.48v2.65l-1.75,2.09h-2.97l-1.76-2.09v-2.65s6.45,0,6.48,0Z"
        fill={fillAccent}
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={2}
      />
      <polygon
        points="12.14 1.55 19.87 1.55 25.16 7.35 25.16 16.23 30.49 22.17 30.49 24.98 29.09 26.48 2.93 26.48 1.51 24.97 1.51 22.17 6.86 16.21 6.86 7.35 12.14 1.55"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={3}
      />
    </svg>
  );
};
