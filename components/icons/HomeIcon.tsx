import React from 'react';

interface IconProps {
  active?: boolean;
  size?: number;
  className?: string;
}

export const HomeIcon: React.FC<IconProps> = ({ active = false, size = 28, className }) => {
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
      <polygon
        points="30.83 10.94 16 1.35 1.17 10.94 4.05 10.94 4.05 30.52 27.95 30.52 27.95 10.94 30.83 10.94"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="bevel"
        strokeWidth={3}
      />
      <rect
        x="12.45"
        y="19.89"
        width="7.11"
        height="10.63"
        fill={fillAccent}
        stroke="currentColor"
        strokeLinejoin="bevel"
        strokeWidth={2}
      />
    </svg>
  );
};
