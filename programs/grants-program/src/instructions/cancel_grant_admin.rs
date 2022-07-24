use crate::state::{Grant, ProgramInfo};
use anchor_lang::prelude::*;

/// This instruction letsan admin cancel a grant.
#[derive(Accounts)]
pub struct CancelGrantAdmin<'info> {
    #[account(mut)]
    admin: Signer<'info>,

    #[account(
        mut,
        seeds = [b"grant", grant.grant_num.to_be_bytes().as_ref()],
        bump = grant.bump,
    )]
    grant: Account<'info, Grant>,

    #[account(
        seeds = [b"program_info"], 
        bump = program_info.bump, 
        has_one = admin,
    )]
    program_info: Account<'info, ProgramInfo>,

    system_program: Program<'info, System>,
}

pub fn cancel_grant_admin(ctx: Context<CancelGrantAdmin>) -> Result<()> {
    ctx.accounts.grant.cancel_grant()
}
