use anchor_lang::prelude::*;

/// This account will keep track of the money given to a grant, which can be
/// either a user donation or a match. This will not hold the money.
#[account]
pub struct Donation {
    pub payer: Pubkey,          // 32
    pub grant: Pubkey,          // 32
    pub amount: u64,            // 8
    pub state: DonationState,   // 1
    bump: u8,                   // 1
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum DonationState {
    Funded,
    Cancelled,
}

impl Donation {
    pub const MAXIMUM_SPACE: usize = 32 + 32 + 8 + 1 + 1;

    pub const SEED_PREFIX: &'static str = "donation";

    pub fn new(bump: u8, payer: Pubkey, grant: Pubkey, amount: u64) -> Self {
        Donation {
            payer,
            grant,
            amount,
            state: DonationState::Funded,
            bump,
        }
    }

    pub fn amount(&self) -> u64 {
        self.amount
    }

    pub fn bump(&self) -> u8 {
        self.bump
    }

    /// the equivalent of what will be matched with the current donation
    pub fn matching_amount(&self) -> u64 {
        // TODO: this will be replaced by quadratic matching or any other matching algorithm
        // 1:1 matching
        self.amount
    }
}
