// Import necessary components and libraries
import { Bold, Image, Italic, Strikethrough, Underline } from "lucide-react";
import { editor_toolbar_prop } from "../../Types/components.types";
import { Toggle } from "../Toggle";
import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";

// Define the EditorToolBar component
const EditorToolBar = ({ editor }: editor_toolbar_prop) => {
  const [_, setImages] = useState<string[]>([]);
  //Use react callback to imageURL
  useEffect(() => {
    if (_.length >= 1) {
      editor?.chain().focus().setImage({ src: _[0] }).run();
    }
  }, [_]);

  return (
    // Container for the toolbar buttons
    <div className="flex items-center gap-2">
      {/* Toggle button for bold */}
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor?.isActive("bold")}
        onPressedChange={() => editor?.chain().focus().toggleBold().run()}
        className={`data-[state=on]:bg-green-200 data-[state=on]:text-green-500 `}
      >
        <Bold size={17} />
      </Toggle>

      {/* Toggle button for italic */}
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor?.isActive("italic")}
        onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
        className={`data-[state=on]:bg-green-200 data-[state=on]:text-green-500 `}
      >
        <Italic size={17} />
      </Toggle>

      {/* Toggle button for strikethrough */}
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor?.isActive("strike")}
        onPressedChange={() => editor?.chain().focus().toggleStrike().run()}
        className={`data-[state=on]:bg-green-200 data-[state=on]:text-green-500 `}
      >
        <Strikethrough size={17} />
      </Toggle>
      {/* Button for underline */}
      <Toggle
        size={"sm"}
        variant={"outline"}
        pressed={editor?.isActive("strike")}
        onPressedChange={() => editor?.chain().focus().toggleUnderline().run()}
        className={`data-[state=on]:bg-green-200 data-[state=on]:text-green-500 `}
      >
        <Underline size={17} />
      </Toggle>

      {/* Disabled toggle button for blockquote */}
      <ImageUploader
        button={
          <Toggle
            size={"sm"}
            variant={"outline"}
            pressed={editor?.isActive("image")}
            onPressedChange={() => {}}
          >
            <Image size={17} />
          </Toggle>
        }
        setImages={setImages}
        images={[]}
        url=""
        setUrl={() => ""}
      />
    </div>
  );
};

// Export the EditorToolBar component
export default EditorToolBar;
