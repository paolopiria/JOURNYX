import React from 'react';

interface IconProps {
  active?: boolean;
  size?: number;
  className?: string;
}

export const ProfileIcon: React.FC<IconProps> = ({ active = false, size = 28, className }) => {
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
      <g id="icon_2" data-name="icon 2">
        <polygon
          points="29.06 17.72 16.05 29.68 2.94 17.62 9.76 15.56 13.24 18.6 18.98 18.6 22.68 15.56 29.06 17.72"
          fill="none"
          stroke="currentColor"
          strokeMiterlimit={10}
          strokeWidth={3}
        />
        <polygon
          points="18.3 2.19 21.19 5.1 21.19 10.26 17.41 14.06 14.59 14.06 10.81 10.26 10.81 5.11 13.7 2.19 18.3 2.19"
          fill={fillAccent}
          stroke="currentColor"
          strokeMiterlimit={10}
          strokeWidth={3}
        />
      </g>
    </svg>
  );
};
