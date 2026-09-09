'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Bold, Italic, List, ListOrdered, Link2, Undo2, Redo2, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToolbarButton = {
  label: string
  icon: LucideIcon
  isActive?: () => boolean
  run: () => void
}

export function RichTextEditor({
  value,
  onChange,
  ariaLabel,
}: {
  value: string
  onChange: (html: string) => void
  ariaLabel?: string
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: false, link: false }),
      Link.configure({ openOnClick: false, autolink: false, HTMLAttributes: { rel: 'noreferrer' } }),
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class: 'rich-text min-h-28 px-3 py-2.5 text-sm leading-6 focus:outline-none',
        'aria-label': ariaLabel ?? 'Rich text editor',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html === '<p></p>' ? '' : html)
    },
  })

  // Keep the editor in sync if the parent resets the value (e.g. cancel).
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const next = value || '<p></p>'
    if (current !== next) editor.commands.setContent(next, { emitUpdate: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor])

  if (!editor) {
    return (
      <div className="min-h-28 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground">
        Loading editor…
      </div>
    )
  }

  const buttons: ToolbarButton[] = [
    {
      label: 'Bold',
      icon: Bold,
      isActive: () => editor.isActive('bold'),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: 'Italic',
      icon: Italic,
      isActive: () => editor.isActive('italic'),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: 'Bullet list',
      icon: List,
      isActive: () => editor.isActive('bulletList'),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: 'Numbered list',
      icon: ListOrdered,
      isActive: () => editor.isActive('orderedList'),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: 'Link',
      icon: Link2,
      isActive: () => editor.isActive('link'),
      run: () => {
        if (editor.isActive('link')) {
          editor.chain().focus().unsetLink().run()
          return
        }
        const url = window.prompt('Link URL')
        if (url) editor.chain().focus().setLink({ href: url }).run()
      },
    },
    { label: 'Undo', icon: Undo2, run: () => editor.chain().focus().undo().run() },
    { label: 'Redo', icon: Redo2, run: () => editor.chain().focus().redo().run() },
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background focus-within:border-brand/60 focus-within:ring-1 focus-within:ring-brand/30">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 px-1.5 py-1">
        {buttons.map(({ label, icon: Icon, isActive, run }) => (
          <button
            key={label}
            type="button"
            onClick={run}
            aria-label={label}
            aria-pressed={isActive?.() ?? undefined}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
              isActive?.() && 'bg-brand/10 text-brand',
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
