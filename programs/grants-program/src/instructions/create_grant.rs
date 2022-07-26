use crate::{
    errors::GrantError,
    state::{Grant, ProgramInfo},
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CreateGrant<'info> {
    #[account(mut)]
    author: Signer<'info>,

    #[account(mut)]
    admin: Signer<'info>,

    #[account(
        init,
        payer = author,
        seeds = [b"grant", program_info.grants_count.to_be_bytes().as_ref()],
        bump,
        space = 8 + Grant::MAXIMUM_SPACE
    )]
    grant: Account<'info, Grant>,

    #[account(mut, seeds = [ProgramInfo::SEED.as_bytes().as_ref()], bump = program_info.bump)]
    program_info: Account<'info, ProgramInfo>,

    system_program: Program<'info, System>,
}

pub fn create_grant(
    ctx: Context<CreateGrant>,
    info: String,
    target_lamports: u64,
    due_date: u32,
) -> Result<()> {
    // TODO: validate due_date

    // checking if info is longer than 200 characters
    if info.chars().count() > 200 {
        return Err(GrantError::InfoTooLong.into());
    }

    ctx.accounts.grant.set_inner(Grant::new(
        *ctx.bumps.get("grant").expect("We should've gotten the grant's canonical bump"),
        ctx.accounts.author.key(),
        info,
        target_lamports as u64,
        due_date as u32,
        ctx.accounts.program_info.grants_count as u32,
    ));

    // Increment the number of grants by one
    ctx.accounts.program_info.increment_grants_count();

    Ok(())
}
