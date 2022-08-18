use crate::errors::GrantError;
use anchor_lang::prelude::*;

use super::Donation;

/// This account holds the information for a grant account

#[account]
#[derive(Default)]
pub struct Grant {
    pub bump: u8,                    // 1
    pub author: Pubkey,              // 32
    info: String,                    // 4 + (4 * 45) Added 4 at the beginning since we need to provide string length prefix
    pub total_donors: u32,           // 8
    target_lamports: u64,            // 16
    due_date: i64,                   // 16 (UnixTimestamp)
    pub funding_state: FundingState, // 1
    pub is_matching_eligible: bool,  // 1
    pub grant_num: u32,              // 8
}

impl Grant {
    pub const MAXIMUM_SPACE: usize = 1 + 32 + (4 + (4 * 45)) + 8 + 16 + 16 + 1 + 1 + 8;

    pub fn new(
        bump: u8,
        author: Pubkey,
        info: String,
        target_lamports: u64,
        due_date: i64,
        grant_num: u32,
    ) -> Self {
        Grant {
            bump,
            author,
            info,
            target_lamports,
            due_date,
            grant_num,
            ..Default::default() // rest of the fields are initialized to default values
        }
    }

    /// Checks if the grant is active and cancells it
    pub fn cancel_grant(&mut self) -> Result<()> {
        self.is_active()?;

        self.funding_state = FundingState::Cancelled;

        Ok(())
    }

    /// Checks if the grant is available for funding
    pub fn is_active(&self) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        msg!("now: {}", now);
        msg!("due_date: {}", self.due_date);
        if now > self.due_date {
            return err!(GrantError::DueDateInPast)
        }
        match self.funding_state {
            FundingState::Active => Ok(()),
            FundingState::Released => err!(GrantError::ReleasedGrant),
            FundingState::Cancelled => err!(GrantError::CancelledGrant),
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum FundingState {
    Active,
    Released,
    Cancelled,
}
impl Default for FundingState {
    fn default() -> Self {
        FundingState::Active
    }
}
