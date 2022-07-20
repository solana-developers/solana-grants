use crate::{state::Donation, errors::GrantsProgramError};

use anchor_lang::prelude::*;

/// This account holds all the important info regarding a particular grant
#[account]
#[derive(Default)]
pub struct Grant {
    title: String,          // (4 + 50)
    description: String,    // (4 + 400)
    image: String,          // (4 + 255)
    repo: String,           // (4 + 255)
    pub creator: Pubkey,    // 32
    pub state: GrantState,  // 1
    pub amount_raised: u64, // 4
    pub total_donors: u32,  // 4
    pub bump: u8,           // 1
}

impl Grant {
    pub const MAXIMUM_SPACE: usize =
        (4 + 50) + (4 + 400) + (4 + 255) + (4 + 255) + 32 + 1 + 4 + 4 + 1;

    pub fn init(&mut self, grant_info: InitGrant) {
        let InitGrant {
            title,
            description,
            image,
            repo,
            creator,
        } = grant_info;

        *self = Grant {
            title,
            description,
            image,
            repo,
            state: GrantState::Active,
            creator,
            ..Default::default()
        };
    }

    /// Updates the grant's total `amount_raised`, increments the `total_donors`
    /// by one, and adds the payment to the `payments` structure.
    pub fn update_with_donation(&mut self, escrow: &Donation) {
        self.amount_raised += escrow.amount();
        self.total_donors += 1;
    }

    pub fn is_active(&self) -> Result<()> {
        match self.state {
            GrantState::Active => Ok(()),
            GrantState::Released => err!(GrantsProgramError::ReleasedGrant),
            GrantState::Cancelled => err!(GrantsProgramError::CancelledGrant),
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

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct InitGrant {
    title: String,
    description: String,
    image: String,
    repo: String,
    creator: Pubkey,
}
