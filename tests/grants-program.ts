import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GrantsProgram } from "../target/types/grants_program";

describe("grants-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.GrantsProgram as Program<GrantsProgram>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
