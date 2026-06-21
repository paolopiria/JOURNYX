import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const SuggestedForYouIcon: React.FC<IconProps> = ({ size = 24, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
    >
      <polygon
        points="16 2.62 19.66 12.5 29.54 16.16 19.66 19.81 16 29.69 12.34 19.81 2.46 16.16 12.34 12.5 16 2.62"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={2}
      />
      <polygon
        points="16 11.48 17.26 14.89 20.68 16.16 17.26 17.42 16 20.83 14.74 17.42 11.32 16.16 14.74 14.89 16 11.48"
        fill="#764d9a"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={0.75}
      />
    </svg>
  );
};
