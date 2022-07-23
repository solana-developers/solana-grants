use anchor_lang::prelude::*;

#[error_code]
pub enum GrantErrors {
    #[msg("The provided info string should be 200 characters long maximum.")]
    InfoTooLong,

    #[msg("The provided date is not in the correct format.")]
    InvalidDateFormat,

    #[msg("The provided grant is already inactive.")]
    AlreadyInActive,

}