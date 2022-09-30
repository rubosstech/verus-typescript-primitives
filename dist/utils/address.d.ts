/// <reference types="node" />
export declare const fromBase58Check: (address: string) => {
    version: number;
    hash: Buffer;
};
export declare const toBase58Check: (hash: Buffer, version: number) => string;
