use anchor_lang::prelude::*;

#[account]
pub struct EscrowIndex {
    bump: u8,       // 1
    escrow: Pubkey, // 32
}

impl EscrowIndex {
    pub const MAXIMUM_SPACE: usize = 1 + 32;

    pub fn init(&mut self, bump: u8, escrow: Pubkey) {
        self.bump = bump;
        self.escrow = escrow;
    }

    pub fn bump(&self) -> u8 {
        self.bump
    }

    pub fn escrow(&self) -> Pubkey {
        self.escrow
    }
}
