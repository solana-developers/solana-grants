
//! This library has all the logic for the smart contract of Solana Grants.

use anchor_lang::prelude::*;
use instructions::*;
use state::InitGrant;

mod errors;
mod instructions;
mod state;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

/// Main program entrypoint
#[program]
pub mod grants_program {
    #![warn(missing_docs)]

    use super::*;

    /// TODO: to be replaced with Dhiraj's implementation
    pub fn create_grant(ctx: Context<CreateGrant>, grant_info: InitGrant) -> Result<()> {
        instructions::create_grant(ctx, grant_info)
    }

    /// Creates a donation which transfers money from the payer to the grant
    pub fn create_donation(ctx: Context<CreateDonation>, lamports: u32) -> Result<()> {
        instructions::create_donation(ctx, lamports as u64)
    }

    /// Increments the amount donated from a payer to a grant, effectively transferring it
    pub fn increment_donation(ctx: Context<IncrementDonation>, lamports: u32) -> Result<()> {
        instructions::increment_donation(ctx, lamports as u64)
    }

    /// Releases the funds from the grant to the grant creator account
    pub fn release_grant(ctx: Context<ReleaseGrant>) -> Result<()> {
        instructions::release_grant(ctx)
    }

    /// Cancels a specific donation and refunds the money to the donor,
    /// this need authorization by an admin or DAO.
    pub fn cancel_donation(ctx: Context<CancelDonation>) -> Result<()> {
        instructions::cancel_donation(ctx)
    }

    /// TODO: to be replaced with Dhiraj's implementation
    pub fn initialize_program_info(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize(ctx)
    }
}
