
use anchor_lang::prelude::*;
use crate::state::ProgramInfo;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    authority: Signer<'info>,

    #[account(init, payer = authority, seeds = [ProgramInfo::SEED_PREFIX.as_bytes().as_ref()], bump, space = 8 + ProgramInfo::MAXIMUM_SPACE)]
    program_info: Account<'info, ProgramInfo>,

    system_program: Program<'info, System>,
}

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    ctx.accounts.program_info.set_inner(
        ProgramInfo::new (
            *ctx.bumps.get("program_info").unwrap(),
            ctx.accounts.authority.key(),
            Default::default()
        )
    );

    Ok(())
} 