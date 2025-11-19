Here is a polished, professional **README** for your **Blog Project (Solana + Markdown Editor)** — following the same style as your example.

You can paste this directly into your repository.

---

# 📝 **Blog Project — Decentralized Blogging on Solana**

**Deployed Frontend URL:** *[https://solana-blog-project.vercel.app/](https://solana-blog-project.vercel.app/)*

**Solana Program ID:** ```FVsq9TLQforiou9dxDT6XgdbRBF7H9fZpkiVPvrdarkx```

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
pnpm install
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

Here is a clean, professional **Frontend Running Instructions** section you can paste directly into your README:

---

## 🖥️ Frontend — Running Instructions

### 📦 Install Dependencies

Go to the `frontend` folder:

```bash
cd frontend
```

Install packages (choose any one):

```bash
yarn install
# or
pnpm install
# or
npm install
```

---

### 🚀 Development Server

Start the local development server:

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

---

### 🏗 Build for Production

Generate a production build:

```bash
npm run build
```

---

### ▶️ Start Production Server

After building:

```bash
npm run start
```

---

## Demo Sreenshots

<img width="1761" height="726" alt="image" src="https://github.com/user-attachments/assets/66367899-37c2-4c03-aa68-418848585691" />

<img width="1761" height="726" alt="image" src="https://github.com/user-attachments/assets/98377cb8-2119-4139-9e70-a1ae30e49051" />

<img width="1761" height="1027" alt="image" src="https://github.com/user-attachments/assets/71b602ca-6541-4cb0-827a-f1e88c791a5d" />

<img width="1761" height="1027" alt="image" src="https://github.com/user-attachments/assets/9d11f9ec-57a6-401c-bc94-a148ae2fd6a6" />

<img width="1761" height="1027" alt="image" src="https://github.com/user-attachments/assets/574d26db-e81e-48f2-84ad-ef0e9881eebe" />



