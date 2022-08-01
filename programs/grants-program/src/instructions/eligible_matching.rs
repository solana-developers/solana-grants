use anchor_lang::prelude::*;
use crate::errors::GrantErrors;
use crate::state::{Grant, GrantsProgramInfo};

/**
 * EligibleMatching
 *
 * This instruction let only admin make a grant matching eligible.
 */
#[derive(Accounts)]
pub struct EligibleMatching<'info> {
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

pub fn eligible_matching(ctx: Context<EligibleMatching>) -> Result<()> {
    // checking if grant is inactive
    if ctx.accounts.grant.is_cancelled == true {
        return Err(GrantErrors::AlreadyInActive.into());
    }

    // making grant matching eligible
    ctx.accounts.grant.eligible_grant();

    Ok(())
}