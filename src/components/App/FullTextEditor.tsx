import { FC } from "react";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { Editor, EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  BoldIcon,
  CodesandboxIcon,
  Heading2Icon,
  Heading4Icon,
  ItalicIcon,
  ListOrderedIcon,
  RedoIcon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  Trash2Icon,
} from "lucide-react";
import Hint from "../Hint";
import { PilcrowIcon } from "lucide-react";
import { Heading1Icon } from "lucide-react";
import { Heading3Icon } from "lucide-react";
import { Heading5Icon } from "lucide-react";
import { ListIcon } from "lucide-react";
import { BracesIcon } from "lucide-react";
import { QuoteIcon } from "lucide-react";
import { RulerIcon } from "lucide-react";
import { UndoIcon } from "lucide-react";
import { Toggle } from "../Toggle";
import Logo from "../Logo";
import { cn } from "../../lib/utils";
const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const _toggleButtons = [
    {
      icon: <BoldIcon size={18} />,
      type: "bold",
      onClick: () => editor.chain().focus().toggleBold().run(),
      disabled: !editor.can().chain().focus().toggleBold().run(),
      content: "BOLD",
      buttonType: "icon",
    },
    {
      icon: <ItalicIcon size={18} />,
      type: "italic",
      onClick: () => editor.chain().focus().toggleItalic().run(),
      disabled: !editor.can().chain().focus().toggleItalic().run(),
      content: "ITALIC",
      buttonType: "icon",
    },
    {
      icon: <StrikethroughIcon size={18} />,
      type: "strike",
      onClick: () => editor.chain().focus().toggleStrike().run(),
      disabled: !editor.can().chain().focus().toggleStrike().run(),
      content: "STRIKE",
      buttonType: "icon",
    },
    {
      icon: <CodesandboxIcon size={18} />,
      type: "code",
      onClick: () => editor.chain().focus().toggleCode().run(),
      disabled: !editor.can().chain().focus().toggleCode().run(),
      content: "CODE",
      buttonType: "icon",
    },
    {
      icon: <RemoveFormattingIcon size={18} />,
      type: "clear",
      onClick: () => editor.chain().focus().unsetAllMarks().run(),
      disabled: false,
      content: "CODE",
      buttonType: "icon",
    },
    {
      icon: <Trash2Icon size={18} />,
      type: "clear_nodes",
      onClick: () => editor.chain().focus().clearNodes().run(),
      disabled: false,
      content: "CLEAR NODES",
      buttonType: "icon",
    },
    {
      icon: <PilcrowIcon size={18} />,
      type: "paragragh",
      onClick: () => editor.chain().focus().setParagraph().run(),
      disabled: false,
      content: "Paragraph",
      buttonType: "icon",
    },
    {
      icon: <Heading1Icon size={18} />,
      type: "heading",
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      disabled: false,
      content: "Heading 1",
      buttonType: "icon",
      level: 1,
    },
    {
      icon: <Heading2Icon size={18} />,
      type: "heading",
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      disabled: false,
      content: "Heading 2",
      buttonType: "icon",
      level: 2,
    },
    {
      icon: <Heading3Icon size={18} />,
      type: "heading",
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      disabled: false,
      content: "Heading 3",
      buttonType: "icon",
      level: 3,
    },
    {
      icon: <Heading4Icon size={18} />,
      type: "heading",
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      disabled: false,
      content: "Heading 4",
      buttonType: "icon",
      level: 4,
    },
    {
      icon: <Heading5Icon size={18} />,
      type: "heading",
      onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      disabled: false,
      content: "Heading 5",
      buttonType: "icon",
      level: 5,
    },
    {
      icon: <ListIcon size={18} />,
      type: "bulletList",
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      disabled: false,
      content: "Bullet List",
      buttonType: "icon",
    },
    {
      icon: <ListOrderedIcon size={18} />,
      type: "orderedList",
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      disabled: false,
      content: "Ordered List",
      buttonType: "icon",
    },
    {
      icon: <BracesIcon size={18} />,
      type: "codeBlock",
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      disabled: false,
      content: "Code Block",
      buttonType: "icon",
    },
    {
      icon: <QuoteIcon size={18} />,
      type: "blockQuote",
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      disabled: false,
      content: "Block Quote",
      buttonType: "icon",
    },
    {
      icon: <RulerIcon size={18} />,
      type: "horizontal_rule",
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      disabled: false,
      content: "Set Horizontal Rule",
      buttonType: "icon",
    },
    {
      icon: <UndoIcon size={18} />,
      type: "undo",
      onClick: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().chain().focus().undo().run(),
      content: "Undo",
      buttonType: "icon",
    },
    {
      icon: <RedoIcon size={18} />,
      type: "redo",
      onClick: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().chain().focus().redo().run(),
      content: "Redo",
      buttonType: "icon",
    },
  ];

  return (
    <div className=" flex items-center flex-wrap gap-2">
      {_toggleButtons.map((btn, index) => (
        <Hint
          key={index}
          element={
            <Toggle
              variant="outline"
              onClick={btn.onClick}
              disabled={btn.disabled}
            >
              {btn.icon}
            </Toggle>
          }
          content={btn.content}
        />
      ))}
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({}),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

const content = `
<h1>Welcome to <em>Quizly</em>!</h1>
    <p>
        Thank you for choosing <strong>Quizly</strong>! This is a platform where you can create and conduct surveys effortlessly.
    </p>
    <p>
        Below is a basic example of a survey introduction. Feel free to edit this text to suit your needs or start your own survey from scratch:
    </p>
    <div>
        <p>Hi there,</p>
        <p>This is a basic example of tiptap. Sure, there are all kinds of basic text styles you’d probably expect from a text editor. But wait until you see the lists:</p>
        <ul>
            <li>That’s a bullet list with one …</li>
            <li>… or two list items.</li>
        </ul>
        <p>Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:</p>
        <pre><code>body {
    display: none;
}</code></pre>
        <p>I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.</p>
        <p>Wow, that’s amazing. Good work, boy! 👏</p>
        <p>— Mom</p>
    </div>
    <p>Feel free to clear this and start your own custom HTML for your survey!</p>
`;

export const FullTextEditor: FC<{
  html?: string;
  className?: string;
  show_divider?: boolean;
  handleChange: (e: Editor) => void;
}> = ({ className, show_divider = true, html, handleChange }) => {
  return (
    <EditorProvider
      editorProps={{
        attributes: {
          class: cn(
            "p-1 outline-none focus:outline-none focus:ring-0 w-full h-full",
            className
          ),
        },
      }}
      onUpdate={({ editor }) => {
        handleChange(editor as Editor);
      }}
      slotBefore={
        <div className="flex flex-col gap-1">
          <MenuBar />
          {show_divider && <hr />}
        </div>
      }
      extensions={extensions}
      content={html ?? content}
    >
      <Logo size="sm" show_word className="mt-4" />
    </EditorProvider>
  );
};
