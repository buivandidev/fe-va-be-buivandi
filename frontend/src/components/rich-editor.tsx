import { useRef, useMemo, useCallback } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { mediaApi } from '@/lib/api/admin'
import { getApiErrorMessage } from '@/lib/api/admin'

interface RichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const quillRef = useRef<any>(null)

  const imageHandler = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (file) {
        try {
          const media = await mediaApi.taiLenAnh(file)
          const quill = quillRef.current?.getEditor()
          if (quill) {
            const range = quill.getSelection(true)
            quill.insertEmbed(range.index || 0, 'image', media.urlTep)
            quill.setSelection((range.index || 0) + 1)
          }
        } catch (err) {
          alert('Lỗi tải ảnh lên: ' + getApiErrorMessage(err))
        }
      }
    }
  }, [])

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler])

  return (
    <div className="bg-white border-line overflow-hidden [&_.ql-editor]:min-h-[400px]">
      <ReactQuill 
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || 'Viết nội dung...'}
      />
    </div>
  )
}
