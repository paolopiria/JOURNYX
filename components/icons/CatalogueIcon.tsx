import React from 'react';

interface IconProps {
  active?: boolean;
  size?: number;
  className?: string;
}

export const CatalogueIcon: React.FC<IconProps> = ({ active = false, size = 28, className }) => {
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
      {/* cls-3 (the page/sheet background) */}
      <path
        d="M6.71,1.8h18.53l3.59,3.59v21.56l-3.27,3.27H6.71l-3.53-3.53V4.74s3.53-3.13,3.53-2.94Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="bevel"
        strokeWidth={3}
      />
      {/* top-left box - cls-1 (accent) */}
      <path
        d="M7.79,6.65h4.93l.96.96v5.74l-.87.87h-5.02l-.94-.94v-5.84s.94-.83.94-.78Z"
        fill={fillAccent}
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={2}
      />
      {/* top-right box - cls-2 (empty grid shape) */}
      <path
        d="M19.2,6.65h4.93l.96.96v5.74l-.87.87h-5.02l-.94-.94v-5.84s.94-.83.94-.78Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="bevel"
        strokeWidth={3}
      />
      {/* bottom-left box - cls-2 (empty grid shape) */}
      <path
        d="M7.85,17.78h4.93l.96.96v5.74l-.87.87h-5.02l-.94-.94v-5.84s.94-.83.94-.78Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="bevel"
        strokeWidth={3}
      />
      {/* bottom-right box - cls-1 (accent) */}
      <path
        d="M19.26,17.78h4.93l.96.96v5.74l-.87.87h-5.02l-.94-.94v-5.84s.94-.83.94-.78Z"
        fill={fillAccent}
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={2}
      />
    </svg>
  );
};
