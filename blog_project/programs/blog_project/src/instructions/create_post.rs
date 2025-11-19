use anchor_lang::prelude::*;
use crate::state::Post;
use crate::errors::BlogError;
use crate::events::CreatePostEvent;

#[derive(Accounts)]
#[instruction(title: String, content: String)]
pub struct CreatePost<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + Post::INIT_SPACE,
        seeds = [b"post", authority.key().as_ref(), title.as_bytes()],
        bump
    )]
    pub post: Account<'info, Post>,
    pub system_program: Program<'info, System>,
}

pub fn _create_post(ctx: Context<CreatePost>, title: String, content: String) -> Result<()> {
    let post = &mut ctx.accounts.post;
    let authority = &ctx.accounts.authority;

    // Validation
    require!(!title.is_empty(), BlogError::TitleEmpty);
    require!(!content.is_empty(), BlogError::ContentEmpty);
    require!(title.len() <= 100, BlogError::TitleTooLong);
    require!(content.len() <= 1000, BlogError::ContentTooLong);

    let clock = Clock::get()?;
    let current_time = clock.unix_timestamp;

    post.authority = authority.key();
    post.post_id = clock.unix_timestamp as u64; // Using timestamp as unique ID
    post.title = title.clone();
    post.content = content;
    post.created_at = current_time;
    post.updated_at = current_time;

    emit!(CreatePostEvent {
        post: post.key(),
        authority: authority.key(),
        post_id: post.post_id,
        title,
        created_at: current_time,
    });

    Ok(())
}