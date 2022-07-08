use anchor_lang::prelude::*;
use instructions::*;

pub mod state;
mod instructions;

declare_id!("2BAJJedFtdAEv8BdDcQwnQEYuBieqkz3Yzdg8feBiCXc");

#[program]
pub mod grants_program {
    use super::*;

    pub fn create_grant(ctx: Context<CreateGrant>, target_lamports: u32, due_date: u32) -> Result<()> {
        instructions::create_grant(ctx, target_lamports, due_date)
    }

    pub fn initialize_program_info(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize(ctx)
    }

}


