'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function CreatePostModal({
  open,
  onClose,
  title,
  setTitle,
  content,
  setContent,
  onSubmit,
  loading,
}: {
  open: boolean
  onClose: () => void
  title: string
  setTitle: (v: string) => void
  content: string
  setContent: (v: string) => void
  onSubmit: () => void
  loading: boolean
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-6xl rounded-2xl shadow-2xl p-6 text-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-100">Create New Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-xl transition">
            ✖
          </button>
        </div>

        {/* Title */}
        <input
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent mb-4"
          placeholder="Post Title"
          value={title}
          maxLength={32}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Editor + Preview */}
        <div className="grid grid-cols-2 gap-4">
          <textarea
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 h-80 resize-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="Write your content in Markdown..."
            maxLength={1000}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Markdown Preview */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 h-80 overflow-auto text-gray-200 prose prose-invert max-w-none">
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || '_Live preview will appear here..._'}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Publish */}
        <button
          onClick={onSubmit}
          disabled={loading}
          className={`mt-6 px-8 py-3 rounded-xl font-semibold w-full shadow-lg transition ${
            loading ? 'bg-blue-500/50 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'Creating...' : 'Publish Post'}
        </button>
      </div>
    </div>
  )
}
