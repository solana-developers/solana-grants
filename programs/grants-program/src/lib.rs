// #![warn(missing_docs)]

//! This library has all the logic for the smart contract of Solana Grants.

use anchor_lang::prelude::*;
use instructions::*;
use state::InitGrant;

mod errors;
mod instructions;
pub mod state;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

/// This is the main account
#[program]
pub mod grants_program {

    use super::*;

    pub fn create_grant(ctx: Context<CreateGrant>, grant_info: InitGrant) -> Result<()> {
        instructions::create_grant(ctx, grant_info)
    }

    pub fn create_donation(ctx: Context<CreateDonation>, lamports: u32) -> Result<()> {
        instructions::create_donation(ctx, lamports as u64)
    }

    pub fn increment_donation(ctx: Context<IncrementDonation>, lamports: u32) -> Result<()> {
        instructions::increment_donation(ctx, lamports as u64)
    }

    pub fn release_grant(ctx: Context<ReleaseGrant>) -> Result<()> {
        instructions::release_grant(ctx)
    }

    pub fn cancel_donation(ctx: Context<CancelDonation>) -> Result<()> {
        instructions::cancel_donation(ctx)
    }

    pub fn initialize_program_info(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize(ctx)
    }
}
