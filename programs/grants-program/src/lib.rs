use anchor_lang::prelude::*;
use instructions::*;

pub mod state;
mod instructions;
mod errors;

declare_id!("2BAJJedFtdAEv8BdDcQwnQEYuBieqkz3Yzdg8feBiCXc");

#[program]
pub mod grants_program {
    use super::*;

    pub fn create_grant(ctx: Context<CreateGrant>, info: String, target_lamports: u32, due_date: u64) -> Result<()> {
        instructions::create_grant(ctx, info, target_lamports, due_date)
    }

    pub fn initialize_program_info(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize(ctx)
    }

    pub fn cancel_grant_admin(ctx: Context<CancelGrantAdmin>) -> Result<()> {
        instructions::cancel_grant_admin(ctx)
    }

    pub fn cancel_grant_author(ctx: Context<CancelGrantAuthor>) -> Result<()> {
        instructions::cancel_grant_author(ctx)
    }

    pub fn eligible_matching(ctx: Context<EligibleMatching>) -> Result<()> {
        instructions::eligible_matching(ctx)
    }

}