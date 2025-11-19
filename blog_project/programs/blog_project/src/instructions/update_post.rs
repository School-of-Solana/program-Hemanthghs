use anchor_lang::prelude::*;
use crate::state::Post;
use crate::errors::BlogError;
use crate::events::UpdatePostEvent;

#[derive(Accounts)]
pub struct UpdatePost<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        has_one = authority
    )]
    pub post: Account<'info, Post>,
}

pub fn _update_post(ctx: Context<UpdatePost>, title: String, content: String) -> Result<()> {
    let post = &mut ctx.accounts.post;
    let authority = &ctx.accounts.authority;

    // Validation
    require!(!title.is_empty(), BlogError::TitleEmpty);
    require!(!content.is_empty(), BlogError::ContentEmpty);
    require!(title.len() <= 100, BlogError::TitleTooLong);
    require!(content.len() <= 1000, BlogError::ContentTooLong);

    let clock = Clock::get()?;
    let current_time = clock.unix_timestamp;

    post.title = title.clone();
    post.content = content;
    post.updated_at = current_time;

    emit!(UpdatePostEvent {
        post: post.key(),
        authority: authority.key(),
        title,
        updated_at: current_time,
    });

    Ok(())
}