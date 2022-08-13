
use anchor_lang::prelude::*;
use crate::state::{ProgramInfo};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    admin: Signer<'info>,

    #[account(
        init, 
        payer = admin, 
        seeds = [ProgramInfo::SEED.as_bytes().as_ref()], 
        bump, 
        space = 8 + ProgramInfo::MAXIMUM_SPACE)]
    program_info: Account<'info, ProgramInfo>,

    system_program: Program<'info, System>,
}

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    ctx.accounts.program_info.set_inner(
        ProgramInfo::new(
            *ctx.bumps.get(ProgramInfo::SEED).expect("We should've gotten the program_info's canonical bump"),
            ctx.accounts.admin.key()
        )
    );

    Ok(())
}
