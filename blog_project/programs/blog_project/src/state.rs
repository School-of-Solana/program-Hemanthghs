use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Post {
    /// The public key of the user who owns/created this post.
    pub authority: Pubkey,

    /// A unique identifier for the post, typically assigned by the program.
    pub post_id: u64,

    /// The title of the post. Limited to 100 UTF-8 characters.
    #[max_len(100)]
    pub title: String,

    /// The main content/body of the post. Limited to 1000 UTF-8 characters.
    #[max_len(1000)]
    pub content: String,

    /// The timestamp (Unix epoch, in seconds) when the post was first created.
    pub created_at: i64,

    /// The timestamp (Unix epoch, in seconds) when the post was last updated.
    pub updated_at: i64,
}
