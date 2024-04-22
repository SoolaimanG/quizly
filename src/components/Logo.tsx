import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";
import { logo_props } from "../Types/components.types";
import { Button } from "./Button";

// Logo component
const Logo = ({
  size = "default",
  color = false,
  style = "normal",
  show_word = true,
  className = "",
}: logo_props) => {
  // Styling for different variations based on size, color, and style
  const toggleVariants = cva(
    `${
      color ? "text-green-600" : ""
    } flex items-center gap-1 font-semibold cursor-pointer`,
    {
      variants: {
        size: {
          default: "text-2xl",
          sm: "text-xl",
          lg: "text-4xl",
        },
        style: {
          italic: "italic font-semibold",
          normal: "text-normal",
          bold: "font-bold",
        },
      },
    }
  );

  return (
    // Logo container with dynamic styling based on size and style
    <div className={cn(toggleVariants({ size, style }), className)}>
      {/* Button component with dynamic styling based on color */}
      <Button
        className={`text-xl hover:bg-transparent dark:bg-green-500 dark:text-white ${
          color
            ? "bg-green-400"
            : "bg-white border border-green-400 text-green-600"
        }`}
        size={"icon"}
      >
        <h1>Q</h1>
      </Button>
      {/* Render the word "Quizly" if show_word is true */}
      {show_word && <h1 className="italic">Quizly</h1>}
    </div>
  );
};

// Export the Logo component as the default export
export default Logo;
