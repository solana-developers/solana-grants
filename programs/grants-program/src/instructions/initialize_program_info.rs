use anchor_lang::prelude::*;
use crate::state::{GrantsProgramInfo};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    admin: Signer<'info>,

    #[account(init, payer = admin, seeds = [b"program_info"], bump, space = 8 + GrantsProgramInfo::MAXIMUM_SPACE)]
    program_info: Account<'info, GrantsProgramInfo>,

    system_program: Program<'info, System>,
}

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    ctx.accounts.program_info.set_inner(
        GrantsProgramInfo::new (
            *ctx.bumps.get("program_info").unwrap(),
            ctx.accounts.admin.key(),
            Default::default()
        )
    );

    Ok(())
}