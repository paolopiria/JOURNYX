import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const MostHypedIcon: React.FC<IconProps> = ({ size = 24, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
    >
      <polygon
        points="5.9 13.76 10.28 13.76 12.61 16.11 19.43 16.11 21.73 13.76 26.1 13.76 28.46 16.11 28.46 29.15 27.33 30.42 25.43 30.42 19.84 24.25 12.38 24.08 6.62 30.41 4.71 30.42 3.54 29.16 3.54 16.11 5.9 13.76"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={3}
      />
      <path
        d="M11.89,10.71v-3.97h-1.54l-1.73,1.47v3.39h3.27v-.9Z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={1}
      />
      <path
        d="M17.11,10.29v-5.83h-1.54l-1.73,2.16v4.99h3.27v-1.32Z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={1}
      />
      <polygon
        points="20.98 1.58 19.06 4.23 19.35 4.23 19.35 11.61 22.62 11.61 22.62 4.23 22.91 4.23 20.98 1.58"
        fill="#764d9a"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={1}
      />
    </svg>
  );
};
