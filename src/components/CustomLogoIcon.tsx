// src/components/CustomLogoIcon.tsx
import type { FC, SVGProps } from 'react';

const CustomLogoIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24" // Standard icon viewBox
    fill="currentColor" // Allows CSS to control the fill color of shapes unless overridden
    {...props}
  >
    {/* A generic lens-like placeholder with transparent background */}
    {/* The background of the SVG itself is transparent. Only drawn shapes are visible. */}
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="12" r="6" fill="currentColor" />
  </svg>
);

export default CustomLogoIcon;
