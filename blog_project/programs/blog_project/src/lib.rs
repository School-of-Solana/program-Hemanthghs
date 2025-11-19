#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
mod instructions;
mod state;
mod errors;
mod events;

use instructions::*;

declare_id!("FVsq9TLQforiou9dxDT6XgdbRBF7H9fZpkiVPvrdarkx");

#[program]
pub mod blog_project {
    use super::*;

    pub fn create_post(ctx: Context<CreatePost>, title: String, content: String) -> Result<()> {
        _create_post(ctx, title, content)
    }

    pub fn update_post(ctx: Context<UpdatePost>, title: String, content: String) -> Result<()> {
        _update_post(ctx, title, content)
    }

    pub fn delete_post(ctx: Context<DeletePost>) -> Result<()> {
        _delete_post(ctx)
    }
}