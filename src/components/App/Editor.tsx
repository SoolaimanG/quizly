import { FC } from "react";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { Editor, EditorContent, useEditor } from "@tiptap/react";

export const MinimalEditor: FC<{
  value: string;
  disabled?: boolean;
  placeholder?: string;
  description?: boolean;
  header?: boolean;
  onChange: (e: Editor) => void;
}> = ({ value, placeholder, description, header, onChange }) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Placeholder.configure({
        placeholder: placeholder || "This is the header, you can change this.",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: `<p>${value}</p>`,
    editorProps: {
      attributes: {
        class: `${description && "text-sm italic"} ${
          header && "text-xl dark:font-semibold"
        } focus:outline-none placeholder:text-primary`,
        spellcheck: "true",
      },
    },
    onUpdate(props) {
      onChange(props.editor as Editor);
    },
  });

  return <EditorContent disabled editor={editor} />;
};
