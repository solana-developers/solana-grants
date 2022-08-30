import {Program, Provider} from '@project-serum/anchor'
import { GrantsProgram } from 'idl/grants_program';
import idl from '../../idl/grants_program.json'

export default function getProgram(provider: Provider) {

    /* Create the program interface combining the idl, program IDL, and provider */
    const jsonString = JSON.stringify(idl);
    const idlJSON = JSON.parse(jsonString);

    return new Program(idlJSON, idl.metadata.address, provider) as Program<GrantsProgram>;
}