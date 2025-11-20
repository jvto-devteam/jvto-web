"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type TiptapEditorProps = {
  /** HTML yang disimpan di DB (optional) */
  value?: string;
  /** Dipanggil setiap ada perubahan konten */
  onChange?: (html: string) => void;
};

export function TiptapEditor({ value = "", onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3], // biar H1 kamu kontrol dari layout page
        },
      }),
    ],
    content: value || "<p></p>",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange?.(html);
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  const mkBtn = (active: boolean) =>
    [
      "px-2 py-1 text-sm border rounded",
      active ? "bg-gray-900 text-white" : "bg-white",
    ].join(" ");

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b bg-gray-50 px-2 py-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={mkBtn(editor.isActive("bold"))}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={mkBtn(editor.isActive("italic"))}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={mkBtn(editor.isActive("strike"))}
        >
          Strike
        </button>

        <span className="mx-2 h-5 w-px bg-gray-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={mkBtn(editor.isActive("paragraph"))}
        >
          P
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={mkBtn(editor.isActive("heading", { level: 2 }))}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={mkBtn(editor.isActive("heading", { level: 3 }))}
        >
          H3
        </button>

        <span className="mx-2 h-5 w-px bg-gray-300" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          className={mkBtn(editor.isActive("bulletList"))}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          className={mkBtn(editor.isActive("orderedList"))}
        >
          1. List
        </button>
      </div>

      {/* Area editor */}
      <EditorContent
        editor={editor}
        className="min-h-[200px] px-3 py-2 focus:outline-none prose max-w-none"
      />
    </div>
  );
}
