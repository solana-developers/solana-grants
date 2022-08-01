use anchor_lang::prelude::*;
use crate::errors::GrantErrors;
use crate::state::{Grant, GrantsProgramInfo};

/**
 * CancelGrantAdmin
 *
 * This instruction let only admin cancel a grant.
 */
#[derive(Accounts)]
pub struct CancelGrantAdmin<'info> {
    #[account(mut)]
    admin: Signer<'info>,

    #[account(
    mut,
    seeds = [b"grant", grant.grant_num.to_be_bytes().as_ref()],
    bump,
    )]
    grant: Account<'info, Grant>,

    #[account(mut, seeds = [b"program_info"], bump = program_info.bump(), has_one = admin)]
    program_info: Account<'info, GrantsProgramInfo>,

    system_program: Program<'info, System>,
}

pub fn cancel_grant_admin(ctx: Context<CancelGrantAdmin>) -> Result<()> {
    // checking if grant is inactive
    if ctx.accounts.grant.is_cancelled == true {
        return Err(GrantErrors::AlreadyInActive.into());
    }

    // cancelling grant
    ctx.accounts.grant.cancel_grant();

    Ok(())
}