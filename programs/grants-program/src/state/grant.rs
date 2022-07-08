use anchor_lang::prelude::*;

/// This account holds the information for a grant account

#[account]
#[derive(Default)]
pub struct Grant {
    author: Pubkey,        // 32
    escrow_count: u32,     // 8
    info: String,          // 4 + 200
    lamports_raised: u64,  // 16
    total_donors: u32,     // 8
    target_lamports: u64,  // 16
    due_date: u32,       // 16 im not sure about this type
}

impl Grant {
    pub const MAXIMUM_SPACE: usize = 32 + 8 + (4 + 200) + 16 + 8 + 16 + 16;

    pub fn new(author: Pubkey, escrow_count: u32, info: String, lamports_raised: u64, total_donors: u32, target_lamports: u64, due_date: u32) -> Self {
        Grant {
            author,
            escrow_count,
            info,
            lamports_raised,
            total_donors,
            target_lamports,
            due_date,
        }
    }

    pub fn author(&self) -> Pubkey {
        self.author
    }

    pub fn target_lamports(&self) -> u64 {
        self.target_lamports
    }

    pub fn due_date(&self) -> u32 {
        self.due_date
    }

    /// Updates the grant's total `amount_raised`, increments the `total_donors`
    // by one, and adds the payment to the `payments` structure.
    pub fn update_with_payment(&mut self) {
        // self.amount_raised += payment.amount();
        self.total_donors += 1;
        self.escrow_count += 1;
    }
}