use anchor_lang::prelude::*;
use crate::{state::{Grant, GrantsProgramInfo}, errors::GrantErrors};

#[derive(Accounts)]
pub struct CreateGrant<'info> {
    #[account(mut)]
    author: Signer<'info>,

    #[account(mut)]
    admin: Signer<'info>,

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

pub fn create_grant(ctx: Context<CreateGrant>, info: String, target_lamports: u32, due_date: u32) -> Result<()> {
    // checking if info is longer than 200 characters
    if info.chars().count() > 200 {
        return Err(GrantErrors::InfoTooLong.into());
    }

    ctx.accounts.grant.set_inner(Grant::new(
        ctx.accounts.author.key(),
        info,
        target_lamports as u64,
        due_date as u32,
        ctx.accounts.program_info.grants_count() as u32,
    ));

    // Increment the number of grants by one
    ctx.accounts.program_info.increment_grants_count();

    Ok(())
}
