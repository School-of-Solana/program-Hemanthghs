use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Post {
    pub authority: Pubkey,
    pub post_id: u64,
    #[max_len(100)]
    pub title: String,
    #[max_len(1000)]
    pub content: String,
    pub created_at: i64,
    pub updated_at: i64,
}