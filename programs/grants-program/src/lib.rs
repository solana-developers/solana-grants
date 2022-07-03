// #![warn(missing_docs)]

//! This library has all the logic for the smart contract of Solana Grants.

use anchor_lang::prelude::*;
use instructions::*;
use state::InitGrant;

pub mod state;
mod instructions;
mod errors;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");


/// This is the main account
#[program]
pub mod grants_program {

    use super::*;

    pub fn create_grant(ctx: Context<CreateGrant>, grant_info: InitGrant ) -> Result<()> {
        instructions::create_grant(ctx, grant_info)
    }

    pub fn create_escrow(ctx: Context<CreateEscrow>, lamports: u32) -> Result<()> {
        instructions::create_escrow(ctx, lamports as u64)
    }

    pub fn release_escrow(ctx: Context<ReleaseEscrow>) -> Result<()> {
        instructions::release_escrow(ctx)
    }

    pub fn cancel_escrow(ctx: Context<CancelEscrow>) -> Result<()> {
        instructions::cancel_escrow(ctx)
    }
}