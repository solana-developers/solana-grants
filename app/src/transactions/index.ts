import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GrantsProgram } from "../../../target/types/grants_program";

export const program = anchor.workspace.GrantsProgram as Program<GrantsProgram>;

export { makeDonation } from "./makeDonation";
