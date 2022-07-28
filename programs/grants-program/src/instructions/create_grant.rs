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
    due_date: i64,
) -> Result<()> {
    // checking if info is longer than 45 characters
    if info.chars().count() > 45 {
        return err!(GrantError::InfoTooLong);
    }
    
    if due_date <= Clock::get()?.unix_timestamp {
        return err!(GrantError::DueDateInPast);
    }

    ctx.accounts.grant.set_inner(Grant::new(
        *ctx.bumps
            .get("grant")
            .expect("We should've gotten the grant's canonical bump"),
        ctx.accounts.author.key(),
        info,
        target_lamports,
        due_date,
        ctx.accounts.program_info.grants_count as u32,
    ));

    // Increment the number of grants by one
    ctx.accounts.program_info.increment_grants_count();

    Ok(())
}
