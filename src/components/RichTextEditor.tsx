'use client'

import { useRef, useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    updateContent()
  }

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain')
    document.execCommand('insertHTML', false, text.replace(/\n/g, '<br>'))
    updateContent()
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold text-sm"
          title="Negrito (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 italic text-sm"
          title="Itálico (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
          title="Sublinhado (Ctrl+U)"
        >
          <u>U</u>
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
          title="Alinhar à esquerda"
        >
          <i className="fas fa-align-left"></i>
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
          title="Centralizar"
        >
          <i className="fas fa-align-center"></i>
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
          title="Alinhar à direita"
        >
          <i className="fas fa-align-right"></i>
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyFull')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
          title="Justificar"
        >
          <i className="fas fa-align-justify"></i>
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
          title="Lista com marcadores"
        >
          <i className="fas fa-list-ul"></i>
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
          title="Lista numerada"
        >
          <i className="fas fa-list-ol"></i>
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
          title="Limpar formatação"
        >
          <i className="fas fa-eraser"></i>
        </button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={updateContent}
        onPaste={handlePaste}
        className="w-full p-4 min-h-[400px] focus:outline-none resize-y overflow-auto"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#495057',
          textAlign: 'justify'
        }}
        data-placeholder={placeholder || 'Digite a descrição do imóvel...'}
      />

      {/* Placeholder style */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>

      {/* Hint */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-xs text-gray-500">
        Dica: Use os botões da barra de ferramentas para formatar o texto. Enter cria novo parágrafo.
      </div>
    </div>
  )
}
