// ChevronDownIcon.tsx
import React from "react";

interface ChevronDownIconProps {
  size?: number;
  className:string;
}

export const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
