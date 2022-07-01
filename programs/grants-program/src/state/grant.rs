use crate::state::Escrow;

use anchor_lang::prelude::*;

/// This account holds all the important info regarding a particular grant
#[account]
#[derive(Default)]
pub struct Grant {
    title: String,            // (4 + 50)
    description: String,      // (4 + 400)
    image: String,            // (4 + 255)
    repo: String,             // (4 + 255)
    pub is_active: bool,      // 1
    amount_raised: u64,       // 4
    total_donors: u32,        // 4
    payments: Option<Pubkey>, // (1 + 32)
}

impl Grant {
    pub const MAXIMUM_SPACE: usize =
        (4 + 50) + (4 + 400) + (4 + 255) + (4 + 255) + 1 + 4 + 4 + (1 + 32);

    pub fn init(&mut self, grant_info: InitGrant) {
        let InitGrant {
            title,
            description,
            image,
            repo,
        } = grant_info;
        *self = Grant {
            title,
            description,
            image,
            repo,
            is_active: true,
            ..Default::default()
        };
    }

    /// Updates the grant's total `amount_raised`, increments the `total_donors`
    /// by one, and adds the payment to the `payments` structure.
    pub fn update_with_payment(&mut self, payment: Escrow) {
        self.amount_raised += payment.amount();
        self.total_donors += 1;
        // TODO: add the payment to the payments field
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct InitGrant {
    title: String,
    description: String,
    image: String,
    repo: String,
}
