import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const GameOfTheYearIcon: React.FC<IconProps> = ({ size = 24, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
    >
      <g>
        <polygon
          points="22.81 1.74 9.17 1.74 8.06 2.75 8.06 13.83 12.7 18.77 19.32 18.77 23.94 13.82 23.94 2.74 22.81 1.74"
          fill="none"
          stroke="currentColor"
          strokeMiterlimit={10}
          strokeWidth={3}
        />
        <polygon
          points="23.94 4.01 29.45 4.01 30.54 5.13 30.54 10.25 27.22 13.63 23.94 13.63 23.94 4.01"
          fill="none"
          stroke="currentColor"
          strokeMiterlimit={10}
          strokeWidth={3}
        />
        <polygon
          points="8.06 4.01 2.55 4.01 1.46 5.13 1.46 10.25 4.78 13.63 8.06 13.63 8.06 4.01"
          fill="none"
          stroke="currentColor"
          strokeMiterlimit={10}
          strokeWidth={3}
        />
        <rect
          x="12.91"
          y="18.77"
          width="6.23"
          height="5.36"
          fill="none"
          stroke="currentColor"
          strokeMiterlimit={10}
          strokeWidth={3}
        />
        <polygon
          points="19.15 24.13 21.81 24.13 23.83 26.2 23.83 29.86 23.13 30.58 8.96 30.58 8.32 29.92 8.32 25.93 10.1 24.12 19.15 24.13"
          fill="none"
          stroke="currentColor"
          strokeMiterlimit={10}
          strokeWidth={3}
        />
      </g>
      <polygon
        points="16.08 5.88 17.26 9.07 20.45 10.25 17.26 11.43 16.08 14.63 14.89 11.43 11.7 10.25 14.89 9.07 16.08 5.88"
        fill="#764d9a"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={1}
      />
    </svg>
  );
};
