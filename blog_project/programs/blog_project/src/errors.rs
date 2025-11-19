use anchor_lang::prelude::*;

#[error_code]
pub enum BlogError {
    #[msg("Title is too long (max 100 characters)")]
    TitleTooLong,
    #[msg("Content is too long (max 1000 characters)")]
    ContentTooLong,
    #[msg("Title cannot be empty")]
    TitleEmpty,
    #[msg("Content cannot be empty")]
    ContentEmpty,
    #[msg("Overflow occurred")]
    Overflow,
}