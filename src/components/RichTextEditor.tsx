'use client'

import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<any>(null)

  return (
    <div className="rich-text-editor">
      <Editor
        apiKey="gv8vua7hmn7lkf6gdbqkfseoen4otbwecdbvwgtdo71auy4o"
        onInit={(_evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={onChange}
        init={{
          height: 400,
          menubar: false,
          plugins: [
            'lists', 'link', 'code', 'table', 'paste', 'wordcount', 'autoresize'
          ],
          toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | link | removeformat | code',
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              color: #495057;
              text-align: justify;
            }
            p { margin: 0 0 1em 0; }
            ul, ol { margin: 0 0 1em 1.5em; padding-left: 0; }
            li { margin-bottom: 0.5em; }
          `,
          placeholder: placeholder || 'Digite a descrição do imóvel...',
          branding: false,
          promotion: false,
          // Preservar quebras de linha e formatação
          forced_root_block: 'p',
          force_br_newlines: false,
          force_p_newlines: true,
          convert_newlines_to_brs: false,
          remove_linebreaks: false,
          apply_source_formatting: true,
          // Configurações de paste
          paste_as_text: false,
          paste_preprocess: function(_plugin: any, args: any) {
            // Preservar quebras de linha ao colar
            args.content = args.content.replace(/\n/g, '<br/>');
          }
        }}
      />
    </div>
  )
}
