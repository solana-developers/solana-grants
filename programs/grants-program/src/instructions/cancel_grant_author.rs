use anchor_lang::prelude::*;
use crate::errors::GrantErrors;
use crate::state::{Grant, GrantsProgramInfo};

/**
 * CancelGrantAuthor
 *
 * This instruction let only author cancel a grant.
 */
#[derive(Accounts)]
pub struct CancelGrantAuthor<'info> {
    #[account(mut)]
    author: Signer<'info>,

    #[account(
    mut,
    seeds = [b"grant", grant.grant_num.to_be_bytes().as_ref()],
    bump,
    has_one = author)]
    grant: Account<'info, Grant>,

    #[account(mut, seeds = [b"program_info"], bump = program_info.bump())]
    program_info: Account<'info, GrantsProgramInfo>,

    system_program: Program<'info, System>,
}

pub fn cancel_grant_author(ctx: Context<CancelGrantAuthor>) -> Result<()> {
    // checking if grant is inactive
    if ctx.accounts.grant.is_active == false {
        return Err(GrantErrors::AlreadyInActive.into());
    }

    // cancelling grant
    ctx.accounts.grant.cancel_grant();

    Ok(())
}