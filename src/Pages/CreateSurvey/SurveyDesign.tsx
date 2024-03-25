import { FC } from "react";
import { cn } from "../../lib/utils";
import { useSurveyWorkSpace } from "../../provider";

export const SurveyDesign: FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const { surveyDesign } = useSurveyWorkSpace();
  //  GOOGLE GEMINI generated the stylings
  const allStyles = {
    font_size: {
      SMALL: "text-xs", // Tailwind class for small font size
      MEDIUM: "text-base", // Tailwind class for medium font size
      LARGE: "text-lg", // Tailwind class for large font size
    },
    font_family: {
      // You can add custom font families here using Tailwind's font-family utility
      // For example:
      SANS_SERIF: "font-sans",
      MONOSPACE: "font-mono",
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
  };

  return (
    <div
      className={cn(
        "",
        className,
        allStyles.border_radius[surveyDesign?.border_radius ?? "MEDIUM"],
        allStyles.color[surveyDesign?.color ?? "GREEN"],
        allStyles.font_size[surveyDesign?.font_size ?? "MEDIUM"]
      )}
    >
      {children}
    </div>
  );
};
