import varuint from '../../utils/varuint'
import bufferutils from '../../utils/bufferutils'
import createHash = require("create-hash");
import { fromBase58Check, toBase58Check } from '../../utils/address';
import { I_ADDR_VERSION } from '../../constants/vdxf';
import { VDXFObject } from "../";
import { MMR, MemoryBasedDb } from "./MMR"
import { BN } from 'bn.js'
import { get } from 'http';

const { BufferReader, BufferWriter } = bufferutils;

export interface AttestationData{
    attestationKey?: string;
    salt?: string;
    value?: string;
}


export class Attestation extends VDXFObject {
    components: Array<AttestationData>;
    signatures: {[attestor: string]: string};
    mmr: MMR;

    constructor(vdxfkey: string = "", data?: { 
      components?: Array<AttestationData>;
      signatures?: {[attestor: string]: string};
    }) {
      super(vdxfkey);

      if (data) {
        if (data?.components) this.components = data.components;
        if (data?.signatures) this.signatures = data.signatures;
      }
      
    }

    dataByteLength(): number {
 
      let byteLength = 0;

      byteLength += varuint.encodingLength(this.components.length)
      for (const n of this.components) {

        byteLength += 20;  //key
        byteLength += 32;  //salt
        byteLength += varuint.encodingLength(Buffer.from(n.value, "utf8").length);
        byteLength += Buffer.from(n.value, "utf8").length;

      }

      const objKeys = Object.keys(this.signatures);
      byteLength += varuint.encodingLength(objKeys.length);

      for (const item of objKeys) {
        byteLength += 20;  //key
        byteLength += varuint.encodingLength(Buffer.from(this.signatures[item], "base64").length);
        byteLength += Buffer.from(this.signatures[item], "base64").length;

      }   
      return byteLength;
    }
  
    toDataBuffer(): Buffer {
      const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));
      bufferWriter.writeCompactSize(this.components.length);
      for (const n of this.components) {

        bufferWriter.writeSlice(fromBase58Check(n.attestationKey).hash);
        bufferWriter.writeSlice(Buffer.from(n.salt, "hex"));
        bufferWriter.writeCompactSize(Buffer.from(n.value, "utf8").length)
        bufferWriter.writeSlice(Buffer.from(n.value, "utf8"));

      }

      const objKeys = Object.keys(this.signatures);
      bufferWriter.writeCompactSize(objKeys.length);

      for (const item of objKeys) {

        bufferWriter.writeSlice(fromBase58Check(item).hash);
        bufferWriter.writeVarSlice(Buffer.from(this.signatures[item], "base64"))

      }

      return bufferWriter.buffer
    }
  
    fromDataBuffer(buffer: Buffer, offset?: number): number {

      const reader = new bufferutils.BufferReader(buffer, offset);  
      const attestationsByteLength = reader.readCompactSize();


      this.components = new Array();
      
      const componentsMapSize = reader.readVarInt();

      for (var i = 0; i < componentsMapSize.toNumber(); i++) {

        const attestationKey = toBase58Check(reader.readSlice(20), I_ADDR_VERSION);
        const salt = Buffer.from(reader.readSlice(32)).toString('hex');
        const value = Buffer.from(reader.readVarSlice()).toString('utf8');
        this.components.push({attestationKey, salt, value});

      }
    
      const signaturesSize = reader.readVarInt();
      this.signatures = {};

      for (var i = 0; i < signaturesSize.toNumber(); i++) {

        const attestor = toBase58Check(reader.readSlice(20), I_ADDR_VERSION);
        const signature = reader.readVarSlice().toString('base64');
        this.signatures[attestor] = signature;
      }
  
      return reader.offset;
    }

    async createMMR() {

      const attestationHashes = this.getHashes();

      if (!this.mmr) {
        this.mmr = new MMR();
      }

      for (var i = 0; i < attestationHashes.length; i++) {
        await this.mmr.append(attestationHashes[i], i)
      }

      return this.mmr;
    }

    async routeHash() {

      await this.createMMR();
      return await this.mmr.getRoot();
    }

    async getRoot() {

      return await this.mmr.getRoot();

    }

    async getProof(keys: Array<number>): Promise<AttestationProof> {
  
      const itemMaps = new Map();

      keys.forEach((key, index) => {itemMaps.set(index, this.components[key])});
            
      const reply = new AttestationProof("", {component: itemMaps, mmr: await this.mmr.getProof(keys, null)});
      
      return reply;

    }

    getHash(n: AttestationData): Buffer {
      
      const bufferWriter = new BufferWriter(Buffer.alloc(20 + 
                                                          32 + 
                                                          varuint.encodingLength(Buffer.from(n.value, "utf8").length) + 
                                                          Buffer.from(n.value, "utf8").length ));
      bufferWriter.writeSlice(fromBase58Check(n.attestationKey).hash);
      bufferWriter.writeSlice(Buffer.from(n.salt, "hex"));
      bufferWriter.writeCompactSize(Buffer.from(n.value, "utf8").length)
      bufferWriter.writeSlice(Buffer.from(n.value, "utf8"));

      return createHash("sha256").update(bufferWriter.buffer).digest();

    }

    getHashes(): Array<Buffer> {
      
      const hashArray = [];
      this.components.forEach((item) => hashArray.push(this.getHash(item)));
      return hashArray;
    }

  }

  export class AttestationProof extends VDXFObject {
    component: Map<number,AttestationData>;
    mmr: MMR;

    constructor(vdxfkey: string = "", data?: { 
      component?: Map<number,AttestationData>;
      mmr?: MMR;

    }) {
      super(vdxfkey);

      if (data) {
        if (data?.component) this.component = data.component;
        if (data?.mmr) this.mmr = data.mmr;
      }
      
    }

    dataByteLength(): number {
 
      let byteLength = 0;
      byteLength += varuint.encodingLength(this.component.size)

      for (const [key, item] of this.component) {
        byteLength += varuint.encodingLength(this.component.size)
        byteLength += varuint.encodingLength(key)
        byteLength += 20;  //key
        byteLength += 32;  //salt
        byteLength += varuint.encodingLength(Buffer.from(item.value, "utf8").length);
        byteLength += Buffer.from(item.value, "utf8").length;
      }

      byteLength += varuint.encodingLength(this.mmr.db.getLeafLength());

      const nodes = this.mmr.db.getNodes();
      const objKeys = Object.keys(nodes);
      byteLength += varuint.encodingLength(objKeys.length);

      for (const item of objKeys) {
        byteLength += varuint.encodingLength(parseInt(item));
        byteLength += varuint.encodingLength(nodes[item].length);

      }   
      return byteLength;
    }
  
    toDataBuffer(): Buffer {
      const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));
      
      bufferWriter.writeCompactSize(this.component.size);
      for (const [key, item] of this.component) {
        bufferWriter.writeCompactSize(key);
        bufferWriter.writeSlice(fromBase58Check(item.attestationKey).hash);
        bufferWriter.writeSlice(Buffer.from(item.salt, "hex"));
        bufferWriter.writeVarSlice(Buffer.from(item.value, "utf8"))
      }

      bufferWriter.writeCompactSize(this.mmr.db.getLeafLength());
      const nodes = this.mmr.db.getNodes();
      const objKeys = Object.keys(nodes);

      for (const item of objKeys) {

        bufferWriter.writeCompactSize(parseInt(item));
        bufferWriter.writeVarSlice(nodes[item])

      }

      return bufferWriter.buffer
    }
  
    fromDataBuffer(buffer: Buffer, offset?: number): number {

      const reader = new bufferutils.BufferReader(buffer, offset);  
      const attestationsByteLength = reader.readCompactSize(); //dummy read

      const componentsLength = reader.readCompactSize();
      this.component = new Map();

      for (var i = 0; i < componentsLength; i++) {
        const key = reader.readCompactSize();
        const attestationKey = toBase58Check(reader.readSlice(20), I_ADDR_VERSION);
        const salt = Buffer.from(reader.readSlice(32)).toString('hex');
        const value = Buffer.from(reader.readVarSlice()).toString('utf8');
        this.component.set(key, {attestationKey, salt, value});
      }

      const referenceTreeLength = reader.readVarInt();
      const nodes = {};
      
      for (var i = 0; i < referenceTreeLength.toNumber(); i++) {
        
        const nodeIndex = reader.readCompactSize();
        const signature = reader.readVarSlice();
        nodes[nodeIndex] = signature;
      }

      this.mmr = new MMR(new MemoryBasedDb(referenceTreeLength, nodes))
      
      return reader.offset;
    }

    async routeHash() {
      return await this.mmr.getRoot();
    }

    async checkProof() { 
      
      try {

        for (const [key, item] of this.component) {

          const hash = this.getHash(key);
          const proof = await this.mmr.getProof([key], null);

          if(hash !== proof) {
            throw new Error("Attestation not found in MMR");
          }
        }
      } catch (e) { 

      }
    }

    getHash(key): Buffer {
      
      const bufferWriter = new BufferWriter(Buffer.alloc(20 + 
                                                          32 + 
                                                          varuint.encodingLength(Buffer.from(this.component.get(key).value, "utf8").length) + 
                                                          Buffer.from(this.component.get(key).value, "utf8").length ));
      bufferWriter.writeSlice(fromBase58Check(this.component.get(key).attestationKey).hash);
      bufferWriter.writeSlice(Buffer.from(this.component.get(key).salt, "hex"));
      bufferWriter.writeCompactSize(Buffer.from(this.component.get(key).value, "utf8").length)
      bufferWriter.writeSlice(Buffer.from(this.component.get(key).value, "utf8"));

      return createHash("sha256").update(bufferWriter.buffer).digest();

    }



  }
