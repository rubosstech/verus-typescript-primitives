type ContentMultiMapPrimitive = number | string;
type ContentMultiMapValue = { [key: string]: ContentMultiMapPrimitive | ContentMultiMapValue };

export interface IdentityDefinition {
  version?: number;
  flags?: number;
  primaryaddresses: Array<string>;
  minimumsignatures: number;
  name: string;
  identityaddress?: string;
  parent: string;
  systemid?: string;
  contentmap?: { [key: string]: string };
  contentmultimap?: ContentMultiMapValue | Array<ContentMultiMapValue>;
  revocationauthority?: string;
  recoveryauthority?: string;
  timelock?: number;
}