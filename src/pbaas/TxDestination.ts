import { IdentityID } from './IdentityID';
import { KeyID } from './KeyID';
import { NoDestination } from './NoDestination';

export interface TxDestinationInterface {
  new (hash?: Buffer): TxDestination;
}

// Add support for CNoDestination, CPubKey, CScriptID, CIndexID, CQuantumID
export type TxDestination = IdentityID | KeyID | NoDestination;