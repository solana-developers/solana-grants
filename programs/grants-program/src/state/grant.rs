use anchor_lang::prelude::*;

/// This account holds the information for a grant account

#[account]
#[derive(Default)]
pub struct Grant {
    pub author: Pubkey,        // 32
    escrow_count: u32,         // 8
    info: String,              // 4 + (4 * 45) Added 4 at the beginning since we need to provide string length prefix
    lamports_raised: u64,      // 16
    total_donors: u32,         // 8
    target_lamports: u64,      // 16
    due_date: u64,             // 16
    pub is_active: bool,       // 1
    matching_eligible: bool,   // 1
    pub grant_num: u32,        // 8
}

impl Grant {
    pub const MAXIMUM_SPACE: usize = 32 + 8 + (4 + (4 * 45)) + 16 + 8 + 16 + 16 + 1 + 1 + 8;

    pub fn new(author: Pubkey, info: String, target_lamports: u64, due_date: u64, grant_num: u32) -> Self {
        Grant {
            author,
            info,
            target_lamports,
            due_date,
            grant_num,
            is_active: true,
            ..Default::default() // rest of the fields are initialized to default values
        }
    }

    /// Updates the grant's total `amount_raised`, increments the `total_donors`
    /// by one, and adds the payment to the `payments` structure.
    pub fn update_with_payment(&mut self) {

        self.total_donors += 1;
        self.escrow_count += 1;
    }

    pub fn cancel_grant(&mut self) {
        self.is_active = false;
    }

    pub fn eligible_grant(&mut self) {
        self.matching_eligible = true;
    }
}