import { FC } from "react";

export const GoogleDriveIcon: FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
    >
      <path fill="#FFC107" d="M17 6L31 6 45 30 31 30z" />
      <path fill="#1976D2" d="M9.875 42L16.938 30 45 30 38 42z" />
      <path fill="#4CAF50" d="M3 30.125L9.875 42 24 18 17 6z" />
    </svg>
  );
};
