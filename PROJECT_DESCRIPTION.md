Here is a polished, professional **README** for your **Blog Project (Solana + Markdown Editor)** — following the same style as your example.

You can paste this directly into your repository.

---

# 📝 **Blog Project — Decentralized Markdown Blogging on Solana**

**Deployed Frontend URL:** *[https://solana-blog-project.vercel.app/](https://solana-blog-project.vercel.app/)*

**Solana Program ID:** *FVsq9TLQforiou9dxDT6XgdbRBF7H9fZpkiVPvrdarkx*

**Deployed on:** *Solana-Devnet*

---

## 📘 Project Overview

### **Description**

A fully decentralized blogging platform built on **Solana**.
Users can create on-chain blog posts, update them, and delete them — all stored in a **PDA-backed account** tied to their wallet.

Each post is saved using a Program Derived Address (PDA) and includes:

* Title
* Content (supports **Markdown**)
* Author address
* Created & updated timestamps

This project showcases real-world Solana development concepts including **PDAs**, **account allocation**, **event emission**, **state validation**, and a fully functional React/Next.js frontend.

---

## ✨ Key Features

### **On-chain Blog Features**

* **Create Post** — Title + Markdown content stored directly on-chain
* **Update Post** — Edit and save content with updated timestamps
* **Delete Post** — Closes the account and returns rent
* **My Posts** — View and manage your own posts
* **All Posts** — Browse posts created by other users

### **Frontend Features**

* **Live Markdown Preview** while writing
* **Modal-based Post Editor** (like Medium)
* **Beautiful UI with TailwindCSS + ReactMarkdown**
* **Snackbar alerts** for errors and success messages
* **Wallet Adapter Integration**
* **Sorted feed (newest first)**
* **Responsive UI**

---

## 🧠 Program Architecture

The Blog dApp uses a clean, modular Anchor architecture with events, validation, and PDA-based account management.

### 🧩 **PDA Usage**

Each post account is derived using:

```
["post", authority_pubkey, title]
```

This ensures:

* Each user can create multiple posts
* Posts are deterministic & collision-free
* Only the **post owner** can update/delete

---

## 🔧 Program Instructions

### **1. create_post(title, content)**

* Initializes a new PDA post account
* Validates title & content length
* Stores metadata + timestamps
* Emits `CreatePostEvent`

### **2. update_post(title, content)**

* Only the original author can modify
* Updates post content + updated_at
* Emits `UpdatePostEvent`

### **3. delete_post()**

* Closes the account
* Sends rent back to the user
* Emits `DeletePostEvent`

---

## 📦 Account Structure

```rust
#[account]
pub struct Post {
    pub authority: Pubkey,     // Post owner
    pub post_id: u64,          // Unique ID (timestamp-based)
    pub title: String,         // Max 32 chars
    pub content: String,       // Max 1000 chars (Markdown supported)
    pub created_at: i64,       // Unix time
    pub updated_at: i64,       // Timestamp on update
}
```

---

## 🧪 Testing

The project includes a full Anchor test suite covering:

### ✔ **Happy Path Tests**

* Create post
* Update post
* Delete post
* Create multiple posts
* Large content (within limit)
* Event emission for all operations

### ❌ **Unhappy Path Tests**

* Empty title
* Empty content
* Title > 100 chars
* Content > 1000 chars
* Duplicate title
* Unauthorized update/delete
* Delete non-existent post
* Update non-existent post

### ▶️ Run Tests

```bash
yarn install
anchor test
```

---

## 🚀 How to Use the dApp

1. **Connect Wallet** (Phantom or any Solana wallet)
2. Navigate to **"My Posts"**
3. Click **Create Post**
4. Write your post in Markdown
5. View live preview as you type
6. Publish to Solana
7. View in **All Posts** feed
8. Update or Delete anytime

---

## 🛠 Tech Stack

### **Solana Program**

* Anchor Framework
* Program Derived Addresses
* Event emission
* Account validation
* Error handling

### **Frontend**

* Next.js 15
* TailwindCSS
* ReactMarkdown + Remark GFM
* Solana Wallet Adapter
* TypeScript
* Modal dialogs + custom UI components

---

