export const allStyles = {
  font_size: {
    SMALL: "text-xs", // Tailwind class for small font size
    MEDIUM: "text-base", // Tailwind class for medium font size
    LARGE: "text-lg", // Tailwind class for large font size
  },
  font_family: {
    SYSTEM: "font-sans", // Use user's system font
    ARIAL: "font-sans", // Apply Tailwind's sans-serif class for Arial
    FUTURA: "", // Futura might require additional font loading (see considerations)
    JOSEFIN_SANS: "font-sans", // Apply Tailwind's sans-serif class for JosefinSans
    TIMES_NEW_ROMAN: "serif", // Apply Tailwind's serif class for TimesNewRoman
    HELVETICA: "font-sans", // Apply Tailwind's sans-serif class for Helvetica
    GARAMOND: "serif", // Apply Tailwind's serif class for Garamond; consider font loading
  },
  border_radius: {
    SMALL: "rounded-sm", // Tailwind class for small rounded corners
    MEDIUM: "rounded-md", // Tailwind class for medium rounded corners
    LARGE: "rounded-lg", // Tailwind class for large rounded corners
  },
  color: {
    BLUE: "text-blue-500", // Tailwind class for blue color (adjust shade as needed)
    YELLOW: "text-yellow-500", // Tailwind class for yellow color (adjust shade as needed)
    GREEN: "text-green-500", // Tailwind class for green color (adjust shade as needed)
  },
  button: {
    BLUE: "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800", // Tailwind class for blue color (adjust shade as needed)
    YELLOW: "bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-800", // Tailwind class for yellow color (adjust shade as needed)
    GREEN: "bg-green-500 hover:bg-green-600 disabled:bg-green-800", // Tailwind class for green color (adjust shade as needed)
  },
  border: {
    BLUE: "border-blue-500 hover:bg-blue-300",
    YELLOW: "border-yellow-500 hover:bg-yellow-300",
    GREEN: "border-green-500 hover:bg-green-300",
  },
  button_text: {
    BLUE: "text-blue-500", // Tailwind class for blue color (adjust shade as needed)
    YELLOW: "text-yellow-500", // Tailwind class for yellow color (adjust shade as needed)
    GREEN: "text-green-500",
    WHITE: "text-white",
  },
};
