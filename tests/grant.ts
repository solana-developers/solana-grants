import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {GrantsProgram} from "../target/types/grants_program";
import {Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {encode} from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import {expect} from "chai";

const toBytesInt32 = (num: number): Buffer => {
    const arr = new ArrayBuffer(4);
    const view = new DataView(arr);
    view.setUint32(0, num);
    return Buffer.from(arr);
};

describe("grant", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.GrantsProgram as Program<GrantsProgram>;

    const programWallet = (program.provider as anchor.AnchorProvider).wallet;

    let programInfoPDA: PublicKey;

    before(async () => {
        const [newProgramInfoPDA, _bump] = await anchor.web3.PublicKey.findProgramAddress(
            [
                encode("program_info"),
            ],
            program.programId
        );

        programInfoPDA = newProgramInfoPDA;
    })

    async function generateFundedKeypair(): Promise<anchor.web3.Keypair> {
        const newKeypair = anchor.web3.Keypair.generate();

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: programWallet.publicKey,
                toPubkey: newKeypair.publicKey,
                lamports: 5 * LAMPORTS_PER_SOL,
            })
        );

        const _confirmation = await (
            program.provider as anchor.AnchorProvider
        ).sendAndConfirm(transaction);

        return newKeypair;
    }

    it("Initializes Grant Program Info!", async () => {
        // Add your test here.
        const _tx = await program.methods
            .initializeProgramInfo()
            .accounts({
                admin: programWallet.publicKey,
                programInfo: programInfoPDA,
            }).rpc();

        const programInfo = await program.account.grantsProgramInfo.fetch(programInfoPDA)

        expect(programInfo.admin).to.eql(programWallet.publicKey);
        expect(programInfo.grantsCount).to.eql(0);

    });

    it("Creates a grant", async () => {

        const author = await generateFundedKeypair();
        const grantsCount = (await program.account.grantsProgramInfo.fetch(programInfoPDA)).grantsCount;

        const [grantPDA, _bump] = await anchor.web3.PublicKey.findProgramAddress(
            [
                encode("grant"),
                toBytesInt32(grantsCount),
            ],
            program.programId
        );

        const targetLamports = LAMPORTS_PER_SOL;
        const dueDate = 123124;

        const _tx = await program.methods
            .createGrant(targetLamports, dueDate)
            .accounts({
                grant: grantPDA,
                programInfo: programInfoPDA,
                author: author.publicKey,
            })
            .signers([author])
            .rpc();

        const grant = await program.account.grant.fetch(grantPDA);

        expect(grant.dueDate).to.eql(dueDate);
        expect(grant.author).to.eql(author.publicKey);
        expect(grant.lamportsRaised.toNumber()).to.eql(0);
        expect(grant.totalDonors).to.eql(0);
        expect(grant.targetLamports.toNumber()).to.eql(targetLamports);
        expect(grant.escrowCount).to.eql(0);
        expect(grant.info).to.eql("")
    })
});
