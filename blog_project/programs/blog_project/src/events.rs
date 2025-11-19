use anchor_lang::prelude::*;

#[event]
pub struct CreatePostEvent {
    pub post: Pubkey,
    pub authority: Pubkey,
    pub post_id: u64,
    pub title: String,
    pub created_at: i64,
}

#[event]
pub struct UpdatePostEvent {
    pub post: Pubkey,
    pub authority: Pubkey,
    pub title: String,
    pub updated_at: i64,
}

#[event]
pub struct DeletePostEvent {
    pub post: Pubkey,
    pub authority: Pubkey,
    pub post_id: u64,
}