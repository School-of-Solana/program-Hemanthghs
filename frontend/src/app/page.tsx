"use client";

import { useState, useEffect } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@project-serum/anchor";
import idl from "@/idl/blog_project.json";

const PROGRAM_ID = new PublicKey("FVsq9TLQforiou9dxDT6XgdbRBF7H9fZpkiVPvrdarkx");

export default function BlogApp() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [posts, setPosts] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editContent, setEditContent] = useState("");
  const [editPost, setEditPost] = useState<any>(null);

  const getProvider = () => {
    if (!wallet.publicKey || !wallet.signTransaction) return null;
    return new AnchorProvider(connection, wallet as any, {});
  };

  const getProgram = () => {
    const provider = getProvider();
    if (!provider) return null;
    return new Program(idl as any, PROGRAM_ID, provider);
  };

  const getPostPDA = (title: string) => {
    if (!wallet.publicKey) return null;
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("post"),
        wallet.publicKey.toBuffer(),
        Buffer.from(title),
      ],
      PROGRAM_ID
    )[0];
  };

  const loadPosts = async () => {
    if (!wallet.publicKey) return;
    setLoading(true);

    try {
      const program = getProgram();
      if (!program) return;

      const fetched = await program.account.post.all([
        {
          memcmp: {
            offset: 8, // discriminator
            bytes: wallet.publicKey.toBase58(),
          },
        },
      ]);

      setPosts(fetched);
    } catch (e) {
      console.error("Error loading posts:", e);
    }
    setLoading(false);
  };

  const createPost = async () => {
    if (!title.trim() || !content.trim()) {
      setMessage("❌ Please fill in both title and content");
      return;
    }

    if (title.length > 100) return setMessage("❌ Title max length is 100");
    if (content.length > 1000) return setMessage("❌ Content too long");

    setCreateLoading(true);

    try {
      const program = getProgram();
      if (!program) return;

      const pda = getPostPDA(title);
      if (!pda) return;

      await program.methods
        .createPost(title, content)
        .accounts({
          authority: wallet.publicKey,
          post: pda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setMessage("✅ Post created!");
      setTitle("");
      setContent("");
      await loadPosts();
    } catch (e) {
      console.log("Error creating post:", e);
      setMessage("❌ Error creating post");
    }

    setCreateLoading(false);
  };

  const updatePost = async (post: any) => {
    if (!editContent.trim()) {
      setMessage("❌ Content cannot be empty");
      return;
    }
    if (editContent.length > 1000)
      return setMessage("❌ Content too long (max 1000)");

    setUpdateLoading(true);
    try {
      const program = getProgram();
      if (!program) return;

      const pda = getPostPDA(post.account.title);
      if (!pda) return;

      await program.methods
        .updatePost(post.account.title, editContent)
        .accounts({
          authority: wallet.publicKey,
          post: pda,
        })
        .rpc();

      setMessage("✅ Post updated!");
      setEditPost(null);
      setEditContent("");
      await loadPosts();
    } catch (e) {
      console.log("Error updating:", e);
      setMessage("❌ Error updating");
    }
    setUpdateLoading(false);
  };

  const deletePost = async (post: any) => {
    setDeleteLoading(true);
    try {
      const program = getProgram();
      if (!program) return;

      const pda = getPostPDA(post.account.title);
      if (!pda) return;

      await program.methods
        .deletePost()
        .accounts({
          authority: wallet.publicKey,
          post: pda,
        })
        .rpc();

      setMessage("✅ Post deleted!");
      await loadPosts();
    } catch (e) {
      console.log("Error deleting:", e);
      setMessage("❌ Error deleting");
    }
    setDeleteLoading(false);
  };

  useEffect(() => {
    if (wallet.connected) loadPosts();
  }, [wallet.connected]);

  if (!wallet.connected) {
    return (
      <div className="p-6 text-center border rounded-xl">
        <h2 className="text-lg font-semibold">Connect your wallet</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-gray-800">
      {message && (
        <div
          className={`p-3 mb-5 rounded-md ${
            message.includes("❌")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* CREATE */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-3">Create New Post</h2>

        <input
          className="w-full p-2 mb-2 border rounded"
          placeholder="Post Title"
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-2 mb-2 border rounded"
          placeholder="Content"
          rows={4}
          maxLength={1000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          disabled={createLoading}
          onClick={createPost}
          className="w-full bg-blue-600 text-white p-2 rounded disabled:bg-blue-400"
        >
          {createLoading ? "Creating..." : "Create Post"}
        </button>
      </div>

      {/* POSTS */}
      <h2 className="text-xl font-bold mb-4">Your Posts</h2>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.publicKey.toString()}
            className="border p-3 rounded mb-6"
          >
            <h3 className="text-lg font-semibold">{post.account.title}</h3>
            <p>{post.account.content}</p>

            <p className="text-sm text-gray-500 mt-1">
              Created: {new Date(post.account.createdAt.toNumber()).toLocaleString()}
            </p>

            <p className="text-sm text-gray-500">
              Updated: {new Date(post.account.updatedAt.toNumber()).toLocaleString()}
            </p>

            {/* EDIT */}
            {editPost?.publicKey.equals(post.publicKey) ? (
              <div className="mt-3">
                <textarea
                  className="w-full border p-2 rounded"
                  rows={3}
                  maxLength={1000}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button
                  onClick={() => updatePost(post)}
                  disabled={updateLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  {updateLoading ? "Updating..." : "Update"}
                </button>
                <button
                  className="ml-3 text-gray-600"
                  onClick={() => setEditPost(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="bg-green-600 text-white px-3 py-1 rounded mt-3"
                onClick={() => {
                  setEditPost(post);
                  setEditContent(post.account.content);
                }}
              >
                Edit
              </button>
            )}

            {/* DELETE */}
            <button
              onClick={() => deletePost(post)}
              disabled={deleteLoading}
              className="bg-red-600 text-white px-3 py-1 rounded mt-3 ml-3"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
