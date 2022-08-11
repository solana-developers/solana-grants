export type GrantsProgram = {
  "version": "0.1.0",
  "name": "grants_program",
  "docs": [
    "Main program entrypoint"
  ],
  "instructions": [
    {
      "name": "createGrant",
      "docs": [
        "Initializes a grant and updates the program info's grant count"
      ],
      "accounts": [
        {
          "name": "author",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "info",
          "type": "string"
        },
        {
          "name": "targetLamports",
          "type": "u64"
        },
        {
          "name": "dueDate",
          "type": "i64"
        }
      ]
    },
    {
      "name": "createDonation",
      "docs": [
        "Creates a donation which transfers money from the payer to the grant"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "donation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "donationIndex",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "incrementDonation",
      "docs": [
        "Increments the amount donated from a payer to a grant, effectively transferring it"
      ],
      "accounts": [
        {
          "name": "donation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "releaseGrant",
      "docs": [
        "Releases the funds from the grant to the grant creator account"
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "programInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "author",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancelDonation",
      "docs": [
        "Cancels a specific donation and refunds the money to the donor,",
        "this need authorization by an admin or DAO."
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "programInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "donation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeProgramInfo",
      "docs": [
        "Initializes the program info data, which determines the admin."
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancelGrantAdmin",
      "docs": [
        "Lets an admin cancel a grant"
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programInfo",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancelGrantAuthor",
      "docs": [
        "Lets an author cancel a grant"
      ],
      "accounts": [
        {
          "name": "author",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "eligibleMatching",
      "docs": [
        "Sets the matching eligibility to true"
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programInfo",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "donation",
      "docs": [
        "This account will keep track of the money given to a grant, which can be",
        "either a user donation or a match. This will not hold the money."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "payer",
            "type": "publicKey"
          },
          {
            "name": "grant",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "state",
            "type": {
              "defined": "DonationState"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "grant",
      "docs": [
        "This account holds the information for a grant account"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "author",
            "type": "publicKey"
          },
          {
            "name": "info",
            "type": "string"
          },
          {
            "name": "lamportsRaised",
            "type": "u64"
          },
          {
            "name": "totalDonors",
            "type": "u32"
          },
          {
            "name": "targetLamports",
            "type": "u64"
          },
          {
            "name": "dueDate",
            "type": "i64"
          },
          {
            "name": "state",
            "type": {
              "defined": "GrantState"
            }
          },
          {
            "name": "isMatchingEligible",
            "type": "bool"
          },
          {
            "name": "grantNum",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "link",
      "docs": [
        "This is just a linking account intended to be used as a PDA for",
        "when a different seed is needed to reach another account."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "address",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "programInfo",
      "docs": [
        "This account holds the information of number of grants and admin"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "grantsCount",
            "type": "u32"
          },
          {
            "name": "admin",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "GrantError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "InfoTooLong"
          },
          {
            "name": "ReleasedGrant"
          },
          {
            "name": "CancelledGrant"
          },
          {
            "name": "GrantStillActive"
          },
          {
            "name": "DueDateInPast"
          }
        ]
      }
    },
    {
      "name": "DonationState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Funded"
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    },
    {
      "name": "GrantState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Released"
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CancelledDonation",
      "msg": "This donation has already refunded the payer"
    }
  ]
};

export const IDL: GrantsProgram = {
  "version": "0.1.0",
  "name": "grants_program",
  "docs": [
    "Main program entrypoint"
  ],
  "instructions": [
    {
      "name": "createGrant",
      "docs": [
        "Initializes a grant and updates the program info's grant count"
      ],
      "accounts": [
        {
          "name": "author",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "info",
          "type": "string"
        },
        {
          "name": "targetLamports",
          "type": "u64"
        },
        {
          "name": "dueDate",
          "type": "i64"
        }
      ]
    },
    {
      "name": "createDonation",
      "docs": [
        "Creates a donation which transfers money from the payer to the grant"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "donation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "donationIndex",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "incrementDonation",
      "docs": [
        "Increments the amount donated from a payer to a grant, effectively transferring it"
      ],
      "accounts": [
        {
          "name": "donation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "releaseGrant",
      "docs": [
        "Releases the funds from the grant to the grant creator account"
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "programInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "author",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancelDonation",
      "docs": [
        "Cancels a specific donation and refunds the money to the donor,",
        "this need authorization by an admin or DAO."
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "programInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "donation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeProgramInfo",
      "docs": [
        "Initializes the program info data, which determines the admin."
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "programInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancelGrantAdmin",
      "docs": [
        "Lets an admin cancel a grant"
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programInfo",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cancelGrantAuthor",
      "docs": [
        "Lets an author cancel a grant"
      ],
      "accounts": [
        {
          "name": "author",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "eligibleMatching",
      "docs": [
        "Sets the matching eligibility to true"
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "grant",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programInfo",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "donation",
      "docs": [
        "This account will keep track of the money given to a grant, which can be",
        "either a user donation or a match. This will not hold the money."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "payer",
            "type": "publicKey"
          },
          {
            "name": "grant",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "state",
            "type": {
              "defined": "DonationState"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "grant",
      "docs": [
        "This account holds the information for a grant account"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "author",
            "type": "publicKey"
          },
          {
            "name": "info",
            "type": "string"
          },
          {
            "name": "lamportsRaised",
            "type": "u64"
          },
          {
            "name": "totalDonors",
            "type": "u32"
          },
          {
            "name": "targetLamports",
            "type": "u64"
          },
          {
            "name": "dueDate",
            "type": "i64"
          },
          {
            "name": "state",
            "type": {
              "defined": "GrantState"
            }
          },
          {
            "name": "isMatchingEligible",
            "type": "bool"
          },
          {
            "name": "grantNum",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "link",
      "docs": [
        "This is just a linking account intended to be used as a PDA for",
        "when a different seed is needed to reach another account."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "address",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "programInfo",
      "docs": [
        "This account holds the information of number of grants and admin"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "grantsCount",
            "type": "u32"
          },
          {
            "name": "admin",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "GrantError",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "InfoTooLong"
          },
          {
            "name": "ReleasedGrant"
          },
          {
            "name": "CancelledGrant"
          },
          {
            "name": "GrantStillActive"
          },
          {
            "name": "DueDateInPast"
          }
        ]
      }
    },
    {
      "name": "DonationState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Funded"
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    },
    {
      "name": "GrantState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Released"
          },
          {
            "name": "Cancelled"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CancelledDonation",
      "msg": "This donation has already refunded the payer"
    }
  ]
};
