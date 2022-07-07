use anchor_lang::prelude::*;

/// This account hold the information of a payment, which can be
/// either a donation or a match.
#[account]
pub struct Escrow {
    payer: Pubkey,          // 32
    receiver: Pubkey,       // 32
    amount: u64,            // 8
    pub state: EscrowState, // 1
    bump: u8,               // 1
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum EscrowState {
    Funded,
    Cancelled,
    Released,
}

impl Escrow {
    pub const MAXIMUM_SPACE: usize = 32 + 32 + 8 + 1 + 1;

    pub fn new(bump: u8, payer: Pubkey, receiver: Pubkey, amount: u64) -> Self {
        Escrow {
            payer,
            receiver,
            amount,
            state: EscrowState::Funded,
            bump,
        }
    }

    pub fn amount(&self) -> u64 {
        self.amount
    }

    pub fn receiver(&self) -> Pubkey {
        self.receiver
    }

    pub fn payer(&self) -> Pubkey {
        self.payer
    }

    pub fn bump(&self) -> u8 {
        self.bump
    }
}
