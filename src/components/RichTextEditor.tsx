
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Toggle } from './ui/toggle';
import { Button } from './ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Type,
  Image as ImageIcon,
  Link as LinkIcon,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import { Input } from './ui/input';
import { useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

export function RichTextEditor({ content, onChange, onImageUpload }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
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
      TextStyle,
      Color,
      ListItem,
      BulletList,
      OrderedList,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none min-h-[100px] focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      try {
        const url = await onImageUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const addLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b">
        <Toggle
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <div className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          <select
            className="border rounded px-2 py-1"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          >
            <option value="#000000">Default</option>
            <option value="#958DF1">Purple</option>
            <option value="#F98181">Red</option>
            <option value="#FBBC88">Orange</option>
            <option value="#FAF594">Yellow</option>
            <option value="#70CFF8">Blue</option>
            <option value="#94FADB">Teal</option>
            <option value="#B9F18D">Green</option>
          </select>
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <ImageIcon className="h-4 w-4" />
        </label>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (editor.isActive('link')) {
                removeLink();
              } else {
                setShowLinkInput(!showLinkInput);
              }
            }}
          >
            <LinkIcon className={`h-4 w-4 ${editor.isActive('link') ? 'text-primary' : ''}`} />
          </Button>
          {showLinkInput && (
            <div className="flex items-center gap-2">
              <Input
                type="url"
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="h-8"
              />
              <Button variant="outline" size="sm" onClick={addLink}>
                Add
              </Button>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      <EditorContent editor={editor} className="prose dark:prose-invert max-w-none" />
    </div>
  );
}
