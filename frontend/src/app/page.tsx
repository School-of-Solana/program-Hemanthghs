'use client'

import { useState, useEffect } from 'react'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { AnchorProvider, Program } from '@project-serum/anchor'
import idl from '@/idl/blog_project.json'
import CreatePostModal from '@/components/CreatePostModal'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Snackbar from '@/components/Snackbar'
import { formatDistanceToNow } from 'date-fns'

const PROGRAM_ID = new PublicKey('FVsq9TLQforiou9dxDT6XgdbRBF7H9fZpkiVPvrdarkx')

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function BlogApp() {
  const { connection } = useConnection()
  const wallet = useWallet()

  const [tab, setTab] = useState<'posts' | 'myposts'>('posts')

  const [posts, setPosts] = useState<any[]>([])
  const [myPosts, setMyPosts] = useState<any[]>([])

  const [loading, setLoading] = useState(false)

  const [snackbar, setSnackbar] = useState('')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [editContent, setEditContent] = useState('')
  const [editPost, setEditPost] = useState<any>(null)

  const [createLoading, setCreateLoading] = useState(false)

  const [loadingDeleteKey, setLoadingDeleteKey] = useState<string | null>(null)
  const [loadingUpdateKey, setLoadingUpdateKey] = useState<string | null>(null)

  const [openCreateModal, setOpenCreateModal] = useState(false)

  const getProvider = () => {
    if (!wallet.publicKey || !wallet.signTransaction) return null
    return new AnchorProvider(connection, wallet as any, {})
  }

  const getProgram = () => {
    const provider = getProvider()
    if (!provider) return null
    return new Program(idl as any, PROGRAM_ID, provider)
  }

  const getPostPDA = (title: string) => {
    if (!wallet.publicKey) return null
    return PublicKey.findProgramAddressSync(
      [Buffer.from('post'), wallet.publicKey.toBuffer(), Buffer.from(title)],
      PROGRAM_ID,
    )[0]
  }

  const loadAllPosts = async () => {
    setLoading(true)
    try {
      const program = getProgram()
      if (!program) return
      const all = await program.account.post.all()
      setPosts(all)
    } catch (err) {
      console.error('Error loading posts:', err)
    }
    setLoading(false)
  }

  const loadMyPosts = async () => {
    if (!wallet.publicKey) return
    setLoading(true)
    try {
      const program = getProgram()
      if (!program) return
      const fetched = await program.account.post.all([{ memcmp: { offset: 8, bytes: wallet.publicKey.toBase58() } }])
      setMyPosts(fetched)
    } catch (err) {
      console.error('Error loading my posts:', err)
    }
    setLoading(false)
  }

  const createPost = async () => {
    if (!title.trim()) {
      setSnackbar('❌ Title cannot be empty')
      return
    }

    if (title.length > 32) {
      setSnackbar('❌ Title too long (max 32 chars)')
      return
    }

    if (!content.trim()) {
      setSnackbar('❌ Content cannot be empty')
      return
    }

    if (content.length > 1000) {
      setSnackbar('❌ Content too long (max 1000 chars)')
      return
    }

    setCreateLoading(true)

    try {
      const program = getProgram()
      const pda = getPostPDA(title)

      await program!.methods
        .createPost(title, content)
        .accounts({
          authority: wallet.publicKey,
          post: pda,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      setSnackbar('✅ Post created!')
      setTitle('')
      setContent('')
      setOpenCreateModal(false)

      await loadMyPosts()
      await loadAllPosts()
    } catch (e: any) {
      setSnackbar(`❌ Error creating post ${e?.message}`)
    }

    setCreateLoading(false)
  }

  const updatePost = async (post: any) => {
    const key = post.publicKey.toString()
    setLoadingUpdateKey(key)

    try {
      const program = getProgram()
      const pda = getPostPDA(post.account.title)

      await program!.methods
        .updatePost(post.account.title, editContent)
        .accounts({
          authority: wallet.publicKey,
          post: pda,
        })
        .rpc()

      setSnackbar('✅ Updated successfully!')
      setEditPost(null)
      setEditContent('')
      await loadMyPosts()
      await loadAllPosts()
    } catch (err: any) {
      setSnackbar(`❌ Error updating post ${err?.message}`)
    }

    setLoadingUpdateKey(null)
  }

  const deletePost = async (post: any) => {
    const key = post.publicKey.toString()
    setLoadingDeleteKey(key)

    try {
      const program = getProgram()
      const pda = getPostPDA(post.account.title)

      await program!.methods
        .deletePost()
        .accounts({
          authority: wallet.publicKey,
          post: pda,
        })
        .rpc()

      setSnackbar('✅ Deleted successfully!')
      await loadMyPosts()
      await loadAllPosts()
    } catch (err: any) {
      setSnackbar(`❌ Error deleting post ${err?.message}`)
    }

    setLoadingDeleteKey(null)
  }

  useEffect(() => {
    if (wallet.connected) {
      loadAllPosts()
      loadMyPosts()
    }
  }, [wallet.connected])

  useEffect(() => {
    if (!snackbar) return
    const timer = setTimeout(() => setSnackbar(''), 3000)
    return () => clearTimeout(timer)
  }, [snackbar])

  if (!wallet.connected) {
    return (
      <div className="p-6 text-center border border-gray-800 rounded-xl bg-gray-900 text-gray-200">
        <h2 className="text-lg font-semibold">Connect your wallet</h2>
      </div>
    )
  }

  const shorten = (addr: string) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '')

  const PostCard = (post: any, showActions = false) => {
    if (!post?.account) return null

    const { title, content, createdAt, updatedAt, authority } = post.account
    const isEditing = editPost?.publicKey.equals(post.publicKey)

    return (
      <article className="bg-gray-900 border border-gray-800 rounded-2xl shadow-md hover:shadow-lg transition p-8">
        <h3 className="text-3xl font-bold text-gray-100 mb-3">{title}</h3>

        <div className="flex  items-center gap-2 text-sm text-gray-400 mb-6">
          <span>Author:</span>{' '}
          <span className="font-mono bg-gray-800 px-3 py-1 rounded-full">{shorten(authority.toString())}</span>
          <span>•</span>
          <span>{createdAt && `Created ${formatDistanceToNow(createdAt.toNumber() * 1000, { addSuffix: true })}`}</span>
          {updatedAt && updatedAt.toNumber() !== createdAt.toNumber() && (
            <>
              <span>•</span>
              <span className="text-xs italic">
                updated {formatDistanceToNow(updatedAt.toNumber() * 1000, { addSuffix: true })}
              </span>
            </>
          )}
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-gray-300 mb-6">
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || '_Live preview will appear here..._'}</ReactMarkdown>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-3 pt-6 border-t border-gray-800">
            <button
              onClick={() => {
                setEditPost(post)
                setEditContent(content)
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow"
            >
              Edit Post
            </button>

            <button
              onClick={() => deletePost(post)}
              disabled={loadingDeleteKey === post.publicKey.toString()}
              className={`px-5 py-2.5 rounded-xl shadow ${
                loadingDeleteKey === post.publicKey.toString()
                  ? 'bg-rose-400 text-white cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {loadingDeleteKey === post.publicKey.toString() ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}

        {isEditing && (
          <div className="mt-8 p-6 bg-gray-800 border border-gray-700 rounded-xl">
            <textarea
              className="w-full p-4 bg-gray-900 border border-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              rows={8}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => updatePost(post)}
                disabled={loadingUpdateKey === post.publicKey.toString()}
                className={`px-6 py-3 rounded-xl shadow text-white ${
                  loadingUpdateKey === post.publicKey.toString()
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loadingUpdateKey === post.publicKey.toString() ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                onClick={() => setEditPost(null)}
                className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </article>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-950 text-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Tabs */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-2 inline-flex mb-10 shadow">
            <button
              onClick={() => setTab('posts')}
              className={`px-8 py-3 rounded-xl font-semibold transition ${
                tab === 'posts' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              All Posts
            </button>

            <button
              onClick={() => setTab('myposts')}
              className={`px-8 py-3 rounded-xl font-semibold transition ${
                tab === 'myposts' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              My Posts
            </button>
          </div>

          {/* Posts */}
          {tab === 'posts' && (
            <div>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold text-gray-100">Community Feed</h2>

                <button
                  onClick={() => {
                    setTab('myposts')
                    setOpenCreateModal(true)
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow"
                >
                  ✍️ Write a Post
                </button>
              </div>

              {loading ? (
                <div className="space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 animate-pulse">
                      <div className="h-8 bg-gray-800 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-xl">No posts yet. Be the first to write one! 🚀</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {posts
                    .slice()
                    .sort((a, b) => b.account.createdAt.toNumber() - a.account.createdAt.toNumber())
                    .map((post) => PostCard(post, false))}
                </div>
              )}
            </div>
          )}

          {/* My Posts */}
          {tab === 'myposts' && (
            <div>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold text-gray-100">My Posts</h2>

                <button
                  onClick={() => setOpenCreateModal(true)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow"
                >
                  + New Post
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : myPosts.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 border-2 border-dashed border-gray-700 rounded-2xl">
                  <p className="text-xl text-gray-400 mb-6">You haven&apos;t posted anything yet.</p>

                  <button
                    onClick={() => setOpenCreateModal(true)}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow"
                  >
                    Create Your First Post
                  </button>
                </div>
              ) : (
                <div className="space-y-10">
                  {myPosts
                    .slice()
                    .sort((a, b) => b.account.createdAt.toNumber() - a.account.createdAt.toNumber())
                    .map((post) => PostCard(post, true))}
                </div>
              )}
            </div>
          )}
        </div>

        <CreatePostModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          onSubmit={createPost}
          loading={createLoading}
        />
      </div>

      <Snackbar message={snackbar} />
    </>
  )
}
