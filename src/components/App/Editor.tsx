// Import necessary components and libraries
import { useEditor, EditorContent } from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import EditorToolBar from "./EditorToolBar";
import { editor_props } from "../../Types/components.types";
import DOMPurify from "dompurify";

// Define the Editor component
const Editor = ({ value, className, setValue, setHtml }: editor_props) => {
  // Initialize the Tiptap editor
  const editor = useEditor({
    extensions: [StarterKit.configure(), Underline, Image],
    content: value,
    editorProps: {
      attributes: {
        // Set the class and other attributes for the editor
        class: `flex min-h-[80px] ${className} rounded-md border border-input bg-background px-2 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
      },
    },
    onUpdate: ({ editor }) => {
      //Sanitizing the HTML before using
      const html = DOMPurify.sanitize(editor.getHTML(), {
        ALLOWED_TAGS: ["b", "i", "u", "img", "strike"],
      });
      // Update the HTML and text values when the editor content is updated
      setHtml(html);
      setValue(editor.getText());
    },
  });

  // Render the Editor component
  return (
    <div className="flex flex-col gap-2">
      {/* Render the toolbar for the editor */}
      <EditorToolBar editor={editor} />

      {/* Render the content area of the editor */}
      <EditorContent editor={editor} />
    </div>
  );
};

// Export the Editor component
export default Editor;
