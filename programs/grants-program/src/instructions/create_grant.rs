use anchor_lang::prelude::*;
use crate::state::{Grant, GrantsProgramInfo};

#[derive(Accounts)]
pub struct CreateGrant<'info> {
    #[account(mut)]
    author: Signer<'info>,

    #[account(
    init,
    payer = author,
    seeds = [b"grant", program_info.grants_count().to_be_bytes().as_ref()],
    bump,
    space = 8 + Grant::MAXIMUM_SPACE
    )]
    grant: Account<'info, Grant>,

    #[account(mut, seeds = [b"program_info"], bump = program_info.bump())]
    program_info: Account<'info, GrantsProgramInfo>,

    system_program: Program<'info, System>,
}

pub fn create_grant(ctx: Context<CreateGrant>, target_lamports: u32, due_date: u32) -> Result<()> {
    ctx.accounts.grant.set_inner(Grant::new (
        ctx.accounts.author.key(),
        Default::default(),
        Default::default(),
        Default::default(),
        Default::default(), // initialize the rest of the fields to their default values
        target_lamports as u64,
        due_date as u32,
    ));

    // Increment the number of grants by one
    &ctx.accounts.program_info.increment_grants_count();

    Ok(())
}
