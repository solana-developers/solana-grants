
use anchor_lang::prelude::*;

#[error_code]
pub enum DonationError {
    #[msg("This donation has already refunded the payer")]
    CancelledDonation,
    
    #[msg("The grant related to this donation is not eligible for matching")]
    NotMatchingEligible,

    #[msg("The matching account does not have to sufficient funds to match the donation")]
    InsufficientFunds,
}
