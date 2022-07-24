
//! This library has all the logic for the smart contract of Solana Grants.

use anchor_lang::prelude::*;
use instructions::*;

pub mod state;
mod instructions;
mod errors;

declare_id!("4rYKkNGRQSe2hJEQGgmiEAcg4KQzP8h8QfwTmmgChAmZ");

/// Main program entrypoint
#[program]
pub mod grants_program {
    #![warn(missing_docs)]

    use super::*;

    /// Initializes a grant and updates the program info's grant count
    pub fn create_grant(ctx: Context<CreateGrant>, info: String, target_lamports: u32, due_date: u32) -> Result<()> {
        instructions::create_grant(ctx, info, target_lamports, due_date)
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

    /// Initializes the program info data, which determines the admin.
    pub fn initialize_program_info(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize(ctx)
    }

    /// Lets an admin cancel a grant
    pub fn cancel_grant_admin(ctx: Context<CancelGrantAdmin>) -> Result<()> {
        instructions::cancel_grant_admin(ctx)
    }

    /// Lets an author cancel a grant
    pub fn cancel_grant_author(ctx: Context<CancelGrantAuthor>) -> Result<()> {
        instructions::cancel_grant_author(ctx)
    }

    /// Sets the matching eligibility to true
    pub fn eligible_matching(ctx: Context<EligibleMatching>) -> Result<()> {
        instructions::eligible_matching(ctx)
    }

}