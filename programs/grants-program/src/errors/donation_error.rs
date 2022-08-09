
use anchor_lang::prelude::*;

#[error_code]
pub enum DonationError {
    #[msg("This donation has already refunded the payer")]
    CancelledDonation,
    
}
