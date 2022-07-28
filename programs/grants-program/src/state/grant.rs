use anchor_lang::prelude::*;
use crate::errors::GrantError;

use super::Donation;

/// This account holds the information for a grant account

#[account]
#[derive(Default)]
pub struct Grant {
    pub bump: u8,                   // 1
    pub author: Pubkey,             // 32
    info: String,                   // 4 + (4* 45)
    pub lamports_raised: u64,       // 16
    pub total_donors: u32,          // 8
    target_lamports: u64,           // 16
    due_date: i64,        // 16 (UnixTimestamp)
    pub state: GrantState,          // 1
    pub is_matching_eligible: bool, // 1
    pub grant_num: u32,             // 8
}

impl Grant {
    pub const MAXIMUM_SPACE: usize = 1+ 32 + (4 + (4 * 45)) + 16 + 8 + 16 + 16 + 1 + 1 + 8;

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

    /// Updates the grant's total `amount_raised`, increments the `total_donors`
    /// by one
    pub fn update_with_new_donation(&mut self, donation: &Donation) {
        self.lamports_raised += donation.amount();
        self.total_donors += 1;
    }

    /// Checks if the grant is active and cancells it
    pub fn cancel_grant(&mut self) -> Result<()> {
        self.is_active()?;
        
        self.state = GrantState::Cancelled;

        Ok(())
    }

    pub fn is_active(&self) -> Result<()> {
        match self.state {
            GrantState::Active => Ok(()),
            GrantState::Released => err!(GrantError::ReleasedGrant),
            GrantState::Cancelled => err!(GrantError::CancelledGrant),
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GrantState {
    Active,
    Released,
    Cancelled,
}
impl Default for GrantState {
    fn default() -> Self {
        GrantState::Active
    }
}
