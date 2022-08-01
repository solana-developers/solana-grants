use crate::state::{Grant, ProgramInfo};
use anchor_lang::prelude::*;

/// This instruction lets an admin make a grant eligible for matching.
#[derive(Accounts)]
pub struct EligibleMatching<'info> {
    admin: Signer<'info>,

    #[account(
        mut,
        seeds = [b"grant", grant.grant_num.to_be_bytes().as_ref()],
        bump = grant.bump,
    )]
    grant: Account<'info, Grant>,

    #[account(
        seeds = [ProgramInfo::SEED.as_bytes().as_ref()], 
        bump = program_info.bump, 
        has_one = admin
    )]
    program_info: Account<'info, ProgramInfo>,
}

pub fn eligible_matching(ctx: Context<EligibleMatching>) -> Result<()> {
    // checking if grant is inactive
    if ctx.accounts.grant.is_cancelled == true {
        return Err(GrantErrors::AlreadyInActive.into());
    }

    // making grant matching eligible
    ctx.accounts.grant.is_matching_eligible = true;

    Ok(())
}
