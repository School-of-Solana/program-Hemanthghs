use anchor_lang::prelude::*;
use crate::state::Post;
use crate::events::DeletePostEvent;

#[derive(Accounts)]
pub struct DeletePost<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        has_one = authority,
        close = authority
    )]
    pub post: Account<'info, Post>,
}

pub fn _delete_post(ctx: Context<DeletePost>) -> Result<()> {
    let post = &ctx.accounts.post;
    let authority = &ctx.accounts.authority;

    emit!(DeletePostEvent {
        post: post.key(),
        authority: authority.key(),
        post_id: post.post_id,
    });

    Ok(())
}