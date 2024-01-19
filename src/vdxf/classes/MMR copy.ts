// Licence MIT
// Adapted to Verus Blake2b MMR. 
// MMR Code is from
//Copyright (c) 2019 Zac Mitton under MIT License
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
//documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
//the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and 
//to permit persons to whom the Software is furnished to do so, subject to the following conditions:


var blake2b = require('blake2b')
const { Lock } = require('semaphore-async-await')
import { BN } from 'bn.js';
import { AttestationData } from './Attestation';
import { VDXFObject } from "../";


class CChunkedLayer<NODE_TYPE>
{
  private CHUNK_SHIFT: number;
  private vSize: number;
  private nodes: Array<Array<NODE_TYPE>>;

  constructor() { this.nodes = []; this.vSize = 0; this.CHUNK_SHIFT = 2; }

  chunkSize(): number {
    return 1 << this.CHUNK_SHIFT;
  }

  chunkMask(): number {
    return this.chunkSize() - 1;
  }

  size(): number {
    return this.vSize;
  }

  getIndex(idx: number): NODE_TYPE {
    if (idx < this.vSize) {
      return this.nodes[idx >> this.CHUNK_SHIFT][idx & this.chunkMask()];
    }
    else {
      throw new Error("CChunkedLayer [] index out of range");
    }
  }

  push_back(node: NODE_TYPE) {
    this.vSize++;

    // if we wrapped around and need more space, we need to allocate a new chunk
    // printf("vSize: %lx, chunkMask: %lx\n", vSize, chunkMask());

    if ((this.vSize & this.chunkMask()) == 1) {
      this.nodes.push(Array<NODE_TYPE>());
      // this.nodes[this.nodes.length - 1].reserve(chunkSize()); 
      // TypeScript, arrays are dynamic and don't have a reserve method or an equivalent.
    }
    this.nodes[this.nodes.length - 1].push(node);
    // printf("nodes.size(): %lu\n", nodes.size());
  }

  clear() {
    this.nodes = [];
    this.vSize = 0;
  }

  resize(newSize: number) {
    if (newSize == 0) {
      this.clear();
    }
    else {
      let chunksSize = ((newSize - 1) >> this.CHUNK_SHIFT) + 1;
      this.nodes.length = chunksSize;
      for (let i = this.size() ? ((this.size() - 1) >> this.CHUNK_SHIFT) + 1 : 1; i <= chunksSize; i++) {
        if (i < chunksSize) {
          this.nodes[this.nodes.length - 1].length = this.chunkSize();
        }
        else {
          // this.nodes[this.nodes.length - 1].reserve(chunkSize());
          this.nodes[this.nodes.length - 1].length = (((newSize - 1) & this.chunkMask()) + 1);
        }
      }

      this.vSize = ((this.nodes.length - 1) << this.CHUNK_SHIFT) + ((newSize - 1) & this.chunkMask()) + 1;
    }
  }
};

//template <typename NODE_TYPE, typename UNDERLYING>
class COverlayNodeLayer<NODE_TYPE, UNDERLYING> {

  private nodeSource: UNDERLYING;
  private vSize: number;

  constructor(NodeSource: UNDERLYING) {
    this.nodeSource = NodeSource;
    this.vSize = 0;
  }

  size(): number {
    return this.vSize;
  }

  getIndex(idx: number): NODE_TYPE {
    if (idx < this.vSize) {
      let retval: NODE_TYPE;
      return retval;
    }
    else {
      throw new Error("COverlayNodeLayer [] index out of range");

    }
  }

  // node type must be moveable just to be passed here, but the default overlay has no control over the underlying storage
  // and only tracks size changes
  push_back(node: NODE_TYPE) { this.vSize++; }
  clear() { this.vSize = 0; }
  resize(newSize: number) { this.vSize = newSize; }
};

export class CMMRNode {
  hash: Buffer;

  constructor(Hash?: Buffer) {
    if (Hash) {
      this.hash = Hash;
    }
  }

  digest(input) {
    var out = Buffer.allocUnsafe(32);
    return blake2b(out.length, null, null, Buffer.from("VerusDefaultHash")).update(input).digest(out);
  }

  HashObj(obj: Buffer, onbjR?: Buffer): Buffer {
    if (!onbjR) return this.digest(obj);
    else return this.digest(Buffer.concat([obj, onbjR]));
  }

  // add a right to this left and create a parent node
  CreateParentNode(nRight: CMMRNode): CMMRNode {
    return this.digest(Buffer.concat([this.hash, nRight.hash]));
  }

  GetProofHash(opposite: CMMRNode): Array<Buffer> {
    return [this.hash];
  }

  // leaf nodes that track additional data, such as block power, may need a hash added to the path
  // at the very beginning
  GetLeafHash(): Array<Buffer> { return []; }

  GetExtraHashCount() {
    // how many extra proof hashes per layer are added with this node
    return 0;
  }
};

function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length);
  return arg;
}

//template <typename NODE_TYPE=CDefaultMMRNode, typename LAYER_TYPE=CChunkedLayer<NODE_TYPE>, typename LAYER0_TYPE=LAYER_TYPE>
export class CMerkleMountainRange {
  layer0: CChunkedLayer<CMMRNode>;
  vSize: number;
  upperNodes: Array<CChunkedLayer<CMMRNode>>;
  _leafLength: number;


  constructor() {


  }

  digest(input) {
    var out = Buffer.allocUnsafe(32);
    return blake2b(out.length, null, null, Buffer.from("VerusDefaultHash")).update(input).digest(out);
  }

  getbyteLength(): number {
    return 1;
  }

  toBuffer(): Buffer {
    return Buffer.from([]);
  }

  add(leaf: CMMRNode): number {
    this.layer0.push_back(leaf);

    let height = 0;
    let layerSize: number;
    for (layerSize = this.layer0.size(); height <= this.upperNodes.length && layerSize > 1; height++) {
      let newSizeAbove = layerSize >> 1;

      // expand vector of vectors if we are adding a new layer
      if (height == this.upperNodes.length) {
        this.upperNodes.length = (this.upperNodes.length + 1);
        // printf("adding2: upperNodes.size(): %lu, upperNodes[%d].size(): %lu\n", upperNodes.size(), height, height && upperNodes.size() ? upperNodes[height-1].size() : 0);
      }

      let curSizeAbove = this.upperNodes[height].size();

      // if we need to add an element to the vector above us, do it
      // printf("layerSize: %u, newSizeAbove: %u, curSizeAbove: %u\n", layerSize, newSizeAbove, curSizeAbove);
      if (!(layerSize & 1) && newSizeAbove > curSizeAbove) {
        let idx = layerSize - 2;
        if (height > 0) {
          // printf("upperNodes.size(): %lu, upperNodes[%d].size(): %lu, upperNodes[%d].size(): %lu\n", upperNodes.size(), height, upperNodes[height].size(), height - 1, upperNodes[height - 1].size());
          // upperNodes[height - 1].Printout();
          // upperNodes[height].Printout();
          // printf("upperNodes[%d].size(): %lu, nodep hash: %s\n", height - 1, upperNodes[height - 1].size(), upperNodes[height - 1][idx].hash.GetHex().c_str());
          // printf("nodep + 1 hash: %p\n", upperNodes[height - 1][idx + 1].hash.GetHex().c_str());
          this.upperNodes[height].push_back(this.upperNodes[height - 1][idx].CreateParentNode(this.upperNodes[height - 1][idx + 1]));
        }
        else {
          this.upperNodes[height].push_back(this.layer0[idx].CreateParentNode(this.layer0[idx + 1]));
          // printf("upperNodes.size(): %lu, upperNodes[%d].size(): %lu\n", upperNodes.size(), height, upperNodes[height].size());
          // upperNodes[height].Printout();
        }
      }
      layerSize = newSizeAbove;
    }
    // return new index
    return this.layer0.size() - 1;
  }
  size() {
    return this.size();
  }

  height() {
    return this.layer0.size() > 0 ? this.upperNodes.length + 1 : 0;
  }

  getNode(Height, Index) {
    let layers = this.height();
    if (Height < layers) {
      if (Height) {
        if (Index < this.upperNodes[Height - 1].size()) {
          return this.upperNodes[Height - 1][Index];
        }
      }
      else {
        if (Index < this.layer0.size()) {
          return this.layer0[Index];
        }
      }
    }
    return null;
  }

}

export class CMMRBranch {
  CMerkleBranchBase?: number;
  nIndex?: number;
  nSize?: number;
  branch?: Array<Buffer>;

  constructor(CMerkleBranchBase?: number, nIndex?: number, nSize?: number, branch?: Array<Buffer>) {
    this.CMerkleBranchBase = CMerkleBranchBase;
    this.nIndex = nIndex;
    this.nSize = nSize;
    this.branch = branch;
  }


  digest(input) {
    var out = Buffer.allocUnsafe(32);
    return blake2b(out.length, null, null, Buffer.from("VerusDefaultHash")).update(input).digest(out);
  }

  safeCheck(hash: Buffer) {

    let index = GetMMRProofIndex(this.nIndex, this.nSize, 0);

    let joined = Buffer.allocUnsafe(64);
    let hashInProgress = hash;

    for (let i = 0; i < this.branch.length; i++) {

      if (index.and(new BN(1)).gt(new BN(0))) {
        if (this.branch[i] === hashInProgress) throw new Error("Value can be equal to node but never on the right");
        joined = Buffer.concat([this.branch[i], hashInProgress]);
      } else {
        joined = Buffer.concat([hashInProgress, this.branch[i]]);
      }
      hashInProgress = this.digest(joined);

      index = index.shrn(1);
    }

    return hashInProgress;
  }
}

export class AttestaionProof extends VDXFObject {

  components?: Array<AttestationData>;
  attestationProof?: Array<CMMRBranch>;

  constructor(vdxfkey: string = "", data?: {
    components?: Map<number, AttestationData>;
    signatures?: { [attestor: string]: { signature: string, system: string } };
    mmr?: MMR;
  }) {
    super(vdxfkey);

    if (data) {
      this.components = data.components || null;
      this.signatures = data.signatures || null;
      this.mmr = data.mmr || null;
    }

  }



}

//template <typename NODE_TYPE, typename LAYER_TYPE=CChunkedLayer<NODE_TYPE>, typename LAYER0_TYPE=LAYER_TYPE, typename HASHALGOWRITER=CBLAKE2bWriter>
class CMerkleMountainView {
  mmr: CMerkleMountainRange; // the underlying mountain range, which provides the hash vectors
  sizes: Array<number>;                    // sizes that we will use as proxies for the size of each vector at each height
  peaks: Array<CMMRNode>;                   // peaks
  peakMerkle: Array<Array<CMMRNode>>;  // cached layers for the peak merkle if needed

  constructor(mountainRange: CMerkleMountainRange, viewSize?: number = 0) {
    this.mmr = mountainRange;
    let maxSize = mountainRange.size();
    if (viewSize > maxSize || viewSize == 0) {
      viewSize = maxSize;
    }
    this.sizes.push(viewSize);

    for (viewSize >>= 1; viewSize; viewSize >>= 1) {
      this.sizes.push(viewSize);
    }
  }



    // how many elements are stored in this view
    size(): number
    {
  // zero if empty or the size of the zeroeth layer
  return this.sizes.length == 0 ? 0 : this.sizes[0];
}

CalcPeaks(force = false)
{
  // if we don't yet have calculated peaks, calculate them
  if (force || (this.peaks.length == 0 && this.size() != 0)) {
    // reset the peak merkle tree, in case this is forced
    this.peaks = new Array<CMMRNode>;
    this.peakMerkle = new Array<Array<CMMRNode>>;
    for (let ht = 0; ht < this.sizes.length; ht++)
    {
      // if we're at the top or the layer above us is smaller than 1/2 the size of this layer, rounded up, we are a peak
      if (ht == (this.sizes.length - 1) || this.sizes[ht + 1] < ((this.sizes[ht] + 1) >> 1)) {
        this.peaks.splice(0, 0, this.mmr.getNode(ht, this.sizes[ht] - 1));
      }
    }
  }
}

resize(newSize: number): number
{
  if (newSize != this.size()) {

    this.sizes = new Array<number>;
    this.peaks = new Array<CMMRNode>;
    this.peakMerkle = new Array<Array<CMMRNode>>;

    let maxSize = this.mmr.size();
    if (newSize > maxSize) {
      newSize = maxSize;
    }
    this.sizes.push(newSize);
    newSize >>= 1;

    while (newSize) {
      this.sizes.push(newSize);
      newSize >>= 1;
    }
  }
  return this.size();
}

  maxsize(): number
  {
    return this.mmr.size() - 1;
  }

GetPeaks(): Array<CMMRNode>
{
  this.CalcPeaks();
  return this.peaks;
}

GetRoot(): Buffer
{
  let rootHash = Buffer.allocUnsafe(32);

  if (this.size() > 0 && this.peakMerkle.length == 0) {
    // get peaks and hash to a root
    this.CalcPeaks();

    let layerNum: number = 0, layerSize = this.peaks.length;
    // with an odd number of elements below, the edge passes through
    for (let passThrough: boolean = !!(layerSize & 1); layerNum == 0 || layerSize > 1; passThrough = !!(layerSize & 1), layerNum++)
    {
      this.peakMerkle.push(Array<CMMRNode>());

      let i;
      let layerIndex = layerNum ? layerNum - 1 : 0;      // layerNum is base 1

      for (i = 0; i < (layerSize >> 1); i++) {
        if (layerNum > 0) {
          this.peakMerkle[this.peakMerkle.length - 1].push(this.peakMerkle[layerIndex][i << 1].CreateParentNode(this.peakMerkle[layerIndex][(i << 1) + 1]));
        }
        else {
          this.peakMerkle[this.peakMerkle.length - 1].push(this.peaks[i << 1].CreateParentNode(this.peaks[(i << 1) + 1]));
        }
      }
      if (passThrough) {
        if (layerNum > 0) {
          // pass the end of the prior layer through
          this.peakMerkle[this.peakMerkle.length - 1].push(this.peakMerkle[layerIndex][this.peakMerkle[layerIndex].length - 1]);
        }
        else {
          this.peakMerkle[this.peakMerkle.length].push(this.peaks[this.peaks.length - 1]);
        }
      }
      // each entry in the next layer should be either combined two of the prior layer, or a duplicate of the prior layer's end
      layerSize = this.peakMerkle[this.peakMerkle.length - 1].length;
    }
    rootHash = this.peakMerkle[this.peakMerkle.length - 1][0].hash;
  }
  else if (this.peakMerkle.length > 0) {
    rootHash = this.peakMerkle[this.peakMerkle.length - 1][0].hash;
  }
  return rootHash;
}

GetRootNode(): CMMRNode
{
        // ensure merkle tree is calculated
  let root = this.GetRoot();
  if (root.length > 0) {
    return this.peakMerkle[this.peakMerkle.length - 1][0];
  }
  else {
    return null;
  }
}

    // return hash of the element at "index"
GetHash(index: number): Buffer
{
  if (index < this.size()) {
    return this.mmr.layer0[index].hash;
  }
  else {
    return Buffer.allocUnsafe(32);
  }
}

GetBranchType(): number
{
  let BRANCH_MMRBLAKE_NODE = 2
  return BRANCH_MMRBLAKE_NODE;
}

    // return a proof of the element at "pos"
GetProof(retProof: CMMRNode, pos: number): boolean
{
  // find a path from the indicated position to the root in the current view
  let retBranch = new CMMRBranch();

  if (pos < this.size()) {
    // just make sure the peakMerkle tree is calculated
    this.GetRoot();

    // if we have leaf information, add it
    let toAdd: Array<Buffer> = this.mmr.layer0[pos].GetLeafHash();
    if (toAdd.length > 0) {
      retBranch.branch.splice(retBranch.branch.length, 0, toAdd[0]);
    }

    let p = pos;
    for (int l = 0; l < sizes.size(); l++)
    {
      if (p & 1) {
        std:: vector < uint256 > proofHashes = mmr.GetNode(l, p - 1).GetProofHash(mmr.GetNode(l, p));
        retBranch.branch.insert(retBranch.branch.end(), proofHashes.begin(), proofHashes.end());
        p >>= 1;
      }
      else {
        // make sure there is one after us to hash with or we are a peak and should be hashed with the rest of the peaks
        if (sizes[l] > (p + 1)) {
          std:: vector < uint256 > proofHashes = mmr.GetNode(l, p + 1).GetProofHash(mmr.GetNode(l, p));
          retBranch.branch.insert(retBranch.branch.end(), proofHashes.begin(), proofHashes.end());
          p >>= 1;
        }
        else {
                        /* for (auto &oneNode : peaks)
                        {
                            printf("peaknode: ");
                            for (auto oneHash : oneNode.GetProofHash(oneNode))
                            {
                                printf("%s:", oneHash.GetHex().c_str());
                            }
                            printf("\n");
                        } */

                        // we are at a peak, the alternate peak to us, or the next thing we should be hashed with, if there is one, is next on our path
                        uint256 peakHash = mmr.GetNode(l, p).hash;

          // linear search to find out which peak we are in the base of the peakMerkle
          for (p = 0; p < peaks.size(); p++) {
            if (peaks[p].hash == peakHash) {
              break;
            }
          }

          // p is the position in the merkle tree of peaks
          assert(p < peaks.size());

                        // move up to the top, which is always a peak of size 1
                        uint32_t layerNum, layerSize;
          for (layerNum = 0, layerSize = peaks.size(); layerNum == 0 || layerSize > 1; layerSize = peakMerkle[layerNum++].size()) {
                            uint32_t layerIndex = layerNum ? layerNum - 1 : 0;      // layerNum is base 1

            // we are an odd member on the end (even index) and will not hash with the next layer above, we will propagate to its end
            if ((p < layerSize - 1) || (p & 1)) {
              if (p & 1) {
                // hash with the one before us
                if (layerNum) {
                  std:: vector < uint256 > proofHashes = peakMerkle[layerIndex][p - 1].GetProofHash(peakMerkle[layerIndex][p]);
                  retBranch.branch.insert(retBranch.branch.end(), proofHashes.begin(), proofHashes.end());
                }
                else {
                  std:: vector < uint256 > proofHashes = peaks[p - 1].GetProofHash(peaks[p]);
                  retBranch.branch.insert(retBranch.branch.end(), proofHashes.begin(), proofHashes.end());
                }
              }
              else {
                // hash with the one in front of us
                if (layerNum) {
                  std:: vector < uint256 > proofHashes = peakMerkle[layerIndex][p + 1].GetProofHash(peakMerkle[layerIndex][p]);
                  retBranch.branch.insert(retBranch.branch.end(), proofHashes.begin(), proofHashes.end());
                }
                else {
                  std:: vector < uint256 > proofHashes = peaks[p + 1].GetProofHash(peaks[p]);
                  retBranch.branch.insert(retBranch.branch.end(), proofHashes.begin(), proofHashes.end());
                }
              }
            }
            p >>= 1;
          }

          // finished
          break;
        }
      }
    }
    retBranch.branchType = GetBranchType(NODE_TYPE());
    retBranch.nSize = size();
    retBranch.nIndex = pos;
    retProof << retBranch;
    return true;
  }
  return false;
}

    // return a vector of the bits, either 1 or 0 in each byte, to represent both the size
    // of the proof by the size of the vector, and the expected bit in each position for the given
    // position in a Merkle Mountain View of the specified size
    static std:: vector < unsigned char > GetProofBits(uint64_t pos, uint64_t mmvSize)
{
  std:: vector < unsigned char > Bits;
  std:: vector < uint64_t > Sizes;
  std:: vector < unsigned char > PeakIndexes;
  std:: vector < uint64_t > MerkleSizes;

  // printf("GetProofBits - pos: %lu, mmvSize: %lu\n", pos, mmvSize);

  // find a path from the indicated position to the root in the current view
  if (pos > 0 && pos < mmvSize) {
            int extrahashes = NODE_TYPE:: GetExtraHashCount();

    Sizes.push_back(mmvSize);
    mmvSize >>= 1;

    while (mmvSize) {
      Sizes.push_back(mmvSize);
      mmvSize >>= 1;
    }

    for (uint32_t ht = 0; ht < Sizes.size(); ht++)
    {
      // if we're at the top or the layer above us is smaller than 1/2 the size of this layer, rounded up, we are a peak
      if (ht == ((uint32_t)Sizes.size() - 1) || (Sizes[ht] & 1))
      {
        PeakIndexes.insert(PeakIndexes.begin(), ht);
      }
    }

            // figure out the peak merkle
            uint64_t layerNum = 0, layerSize = PeakIndexes.size();
    // with an odd number of elements below, the edge passes through
    for (bool passThrough = (layerSize & 1); layerNum == 0 || layerSize > 1; passThrough = (layerSize & 1), layerNum++)
    {
      layerSize = (layerSize >> 1) + passThrough;
      if (layerSize) {
        MerkleSizes.push_back(layerSize);
      }
    }

    // add extra hashes for a node on the right
    for (int i = 0; i < extrahashes; i++)
    {
      Bits.push_back(0);
    }

            uint64_t p = pos;
    for (int l = 0; l < Sizes.size(); l++)
    {
      // printf("GetProofBits - Bits.size: %lu\n", Bits.size());

      if (p & 1) {
        Bits.push_back(1);
        p >>= 1;

        for (int i = 0; i < extrahashes; i++)
        {
          Bits.push_back(0);
        }
      }
      else {
        // make sure there is one after us to hash with or we are a peak and should be hashed with the rest of the peaks
        if (Sizes[l] > (p + 1)) {
          Bits.push_back(0);
          p >>= 1;

          for (int i = 0; i < extrahashes; i++)
          {
            Bits.push_back(0);
          }
        }
        else {
          for (p = 0; p < PeakIndexes.size(); p++) {
            if (PeakIndexes[p] == l) {
              break;
            }
          }

          // p is the position in the merkle tree of peaks
          assert(p < PeakIndexes.size());

                        // move up to the top, which is always a peak of size 1
                        uint64_t layerNum;
                        uint64_t layerSize;
          for (layerNum = -1, layerSize = PeakIndexes.size(); layerNum == -1 || layerSize > 1; layerSize = MerkleSizes[++layerNum]) {
            // printf("GetProofBits - Bits.size: %lu\n", Bits.size());
            if (p < (layerSize - 1) || (p & 1)) {
              if (p & 1) {
                // hash with the one before us
                Bits.push_back(1);

                for (int i = 0; i < extrahashes; i++)
                {
                  Bits.push_back(0);
                }
              }
              else {
                // hash with the one in front of us
                Bits.push_back(0);

                for (int i = 0; i < extrahashes; i++)
                {
                  Bits.push_back(0);
                }
              }
            }
            p >>= 1;
          }
          // finished
          break;
        }
      }
    }
  }
  return Bits;
}
};



export class MMR {
  lock: any;
  _leafLength: number;
  db: any;

  constructor(db = new MemoryBasedDb()) {
    this.db = db
    this.lock = new Lock(1)

  }

  digest(input) {
    var out = Buffer.allocUnsafe(32);
    return blake2b(out.length, null, null, Buffer.from("VerusDefaultHash")).update(Buffer.concat([...input])).digest(out);
  }

  async get(leafIndex) {
    let leafValue
    await this.lock.acquire()
    try {
      let leafLength = await this.getLeafLength()
      if (leafIndex >= leafLength) { throw new Error('Leaf not in tree') }
      let leafPosition = MMR.getNodePosition(leafIndex)
      let localPeakPosition = MMR.localPeakPosition(leafIndex, leafLength)
      let localPeakValue = await this._getNodeValue(localPeakPosition)
      leafValue = await this._verifyPath(localPeakPosition, localPeakValue, leafPosition)
    } finally {
      this.lock.release()
    }
    return leafValue
  }

  async _get(nodePosition) {
    let nodeValue
    await this.lock.acquire()
    try {
      let nodeLength = await this.getNodeLength()
      let leafLength = await this.getLeafLength()
      if (nodePosition.i >= nodeLength) { throw new Error('Node not in tree') }
      let peakPositions = MMR.peakPositions(leafLength - 1)
      let localPeakPosition
      for (let i = 0; i < peakPositions.length; i++) {
        if (peakPositions[i].i >= nodePosition.i) {
          localPeakPosition = peakPositions[i]
          break
        }
      }
      let localPeakValue = await this._getNodeValue(localPeakPosition)
      nodeValue = await this._verifyPath(localPeakPosition, localPeakValue, nodePosition)
    } finally {
      this.lock.release()
    }
    return nodeValue
  }

  async append(value, leafIndex) {
    await this.lock.acquire()
    try {
      let leafLength = await this.getLeafLength()
      if (leafIndex == undefined || leafIndex == leafLength) {
        let nodePosition = MMR.getNodePosition(leafLength)
        let mountainPositions = MMR.mountainPositions(MMR.localPeakPosition(leafLength, leafLength), nodePosition.i)
        await this.db.set(value, nodePosition.i)
        await this._hashUp(mountainPositions)
        await this._setLeafLength(leafLength + 1)
      } else {
        throw new Error('Can only append to end of MMR (leaf ' + leafLength + '). Index ' + leafIndex + ' given.')
      }
    } finally {
      this.lock.release()
    }
  }
  async appendMany(values, startLeafIndex) {
    if (startLeafIndex == undefined) {
      startLeafIndex = await this.getLeafLength()
    }
    for (let i = 0; i < values.length; i++) {
      await this.append(values[i], startLeafIndex + i)
    }
  }
  async getRoot(leafIndex?: number) {
    let peakValues = []
    await this.lock.acquire()
    try {
      if (!leafIndex) {
        leafIndex = await this.getLeafLength() - 1
      }
      let peakPositions = MMR.peakPositions(leafIndex)
      for (let i = 0; i < peakPositions.length; i++) {
        peakValues.push(await this._getNodeValue(peakPositions[i]))
      }
    } finally {
      this.lock.release()
    }
    // note: a single peak differs from its MMR root in that it gets hashed a second time
    return this.digest([...peakValues])
  }
  async getNodeLength() { return MMR.getNodePosition(await this.getLeafLength()).i }
  async getLeafLength() { // caching
    if (this._leafLength == undefined) { // dirty length
      this._leafLength = await this.db.getLeafLength()
    }
    return this._leafLength
  }
  async delete(leafIndex) { // logically deletes everything after (and including) leafIndex
    await this.lock.acquire()
    try {
      let leafLength = await this.getLeafLength()
      if (leafIndex < leafLength) {
        await this._setLeafLength(leafIndex)
      }
    } finally {
      this.lock.release()
    }
  }
  async getProof(leafIndexes, referenceTreeLength) { // returns a sparse MMR containing the leaves specified
    let proofMmr
    await this.lock.acquire()
    try {
      referenceTreeLength = referenceTreeLength || await this.getLeafLength()

      let positions = MMR.proofPositions(leafIndexes, referenceTreeLength)
      let nodes = {}

      let nodeIndexes = Object.keys(positions)
      await Promise.all(nodeIndexes.map(async (i) => {
        let nodeValue = await this._getNodeValue(positions[i])
        nodes[i] = nodeValue
      }))
      proofMmr = new MMR(new MemoryBasedDb(referenceTreeLength, nodes))

    } finally {
      this.lock.release()
      return proofMmr
    }
  }

  async _getNodeValue(position) {
    // caller's responsibility to request a position within leafLength
    let nodeValue = await this.db.get(position.i)
    if (nodeValue) {
      return nodeValue
    } else if (position.h > 0) { // implied node
      let leftChildValue = await this._getNodeValue(MMR.leftChildPosition(position))
      let rightChildValue = await this._getNodeValue(MMR.rightChildPosition(position))
      return this.digest([leftChildValue, rightChildValue])
    } else {
      throw new Error('Missing node in db')
    }
  }
  async _verifyPath(currentPosition, currentValue, destinationPosition) { // verifies as it walks
    if (currentPosition.i == destinationPosition.i) { // base case
      return currentValue
    } else {
      let leftChildPosition = MMR.leftChildPosition(currentPosition)
      let rightChildPosition = MMR.rightChildPosition(currentPosition)
      let leftValue = await this._getNodeValue(leftChildPosition)
      let rightValue = await this._getNodeValue(rightChildPosition)
      if (!currentValue.equals(this.digest([leftValue, rightValue]))) {
        throw new Error('Hash mismatch of node #' + currentPosition.i + ' and its children')
      }
      if (destinationPosition.i > currentPosition.i - 2 ** currentPosition.h - currentPosition.h + 1) { //umm yeah, check this line
        return this._verifyPath(rightChildPosition, rightValue, destinationPosition)
      } else {
        return this._verifyPath(leftChildPosition, leftValue, destinationPosition)
      }
    }
  }
  async _setLeafLength(leafLength) {
    await this.db.setLeafLength(leafLength)
    this._leafLength = leafLength
  }
  async _hashUp(positionPairs) {
    for (let i = positionPairs.length - 1; i >= 0; i--) {
      let leftValue = await this._getNodeValue(positionPairs[i][0])
      let rightValue = await this._getNodeValue(positionPairs[i][1])
      let writeIndex = MMR.parentIndex(positionPairs[i][0])
      await this.db.set(this.digest([leftValue, rightValue]), writeIndex)
    }
  }


  static leftChildPosition(position) {
    if (position.h <= 0) { throw new Error('Height 0 does not have child') }
    return new Position(position.i - 2 ** position.h, position.h - 1, false)
  }
  static rightChildPosition(position) {
    if (position.h <= 0) { throw new Error('Height 0 does not have child') }
    return new Position(position.i - 1, position.h - 1, true)
  }
  static siblingPosition(position) {
    let multiplier = position.r ? -1 : 1
    return new Position(position.i + multiplier * (2 ** (position.h + 1) - 1), position.h, !position.r)
  }
  static parentIndex(position) {
    if (position.r) {
      return position.i + 1
    } else {
      return position.i + 2 ** (position.h + 1)
    }
  }
  static peakPositions(leafIndex) {
    let currentPosition = this.godPeakFromLeafIndex(leafIndex)
    let peakPositions = []
    while (leafIndex >= 0) {
      currentPosition = this.leftChildPosition(currentPosition)
      if (leafIndex >= 2 ** currentPosition.h - 1) {
        peakPositions.push(currentPosition)
        currentPosition = this.siblingPosition(currentPosition)
        leafIndex -= 2 ** currentPosition.h // leafIndex becomes a kindof accumulator
      }
    }
    return peakPositions
  }
  static localPeakPosition(leafIndex, leafLength) {
    let lastLeafIndex = leafLength <= leafIndex ? leafIndex : leafLength - 1
    return MMR._localPeakPosition(leafIndex, MMR.peakPositions(lastLeafIndex))
  }
  static _localPeakPosition(leafIndex, peakPositions) {
    for (let i = 0; i < peakPositions.length; i++) {
      let currentRange = 2 ** (peakPositions[i].h)
      if (leafIndex < currentRange) {
        return peakPositions[i]
      } else {
        leafIndex -= currentRange
      }
    }
  }
  static mountainPositions(currentPosition, targetNodeIndex) { // positions to hash after appending
    let mountainPositions = []
    while (currentPosition.h > 0) {
      let children = [this.leftChildPosition(currentPosition), this.rightChildPosition(currentPosition)]
      mountainPositions.push(children)
      if (targetNodeIndex > currentPosition.i - 2 ** currentPosition.h - currentPosition.h + 1) {
        currentPosition = children[1]
      } else {
        currentPosition = children[0]
      }
    }
    return mountainPositions
  }
  static godPeakFromLeafIndex(leafIndex) { // imaginary peak that is above all nodes
    let peakHeight = 0
    while (2 ** peakHeight <= leafIndex + 1) { peakHeight++ }
    return new Position(2 ** (peakHeight + 1) - 2, peakHeight, false)
  }
  static getNodePosition(leafIndex) {
    let currentPosition = this.godPeakFromLeafIndex(leafIndex)
    let accumulator = 0
    while (currentPosition.h > 0) {
      let serviceRange = 2 ** (currentPosition.h - 1)
      if (leafIndex >= accumulator + serviceRange) {
        currentPosition = this.rightChildPosition(currentPosition)
        accumulator += serviceRange
      } else {
        currentPosition = this.leftChildPosition(currentPosition)
      }
    }
    return currentPosition
  }
  static proofPositions(leafIndexes, referenceTreeLength) {
    let positions = {}
    let finalPeakPositions = MMR.peakPositions(referenceTreeLength - 1)
    // add peak positions
    for (let i = 0; i < finalPeakPositions.length; i++) { // log(n)/2
      positions[finalPeakPositions[i].i] = finalPeakPositions[i]
    }
    //add local mountain proof positions for each leaf
    for (let i = 0; i < leafIndexes.length; i++) { // k*2log(n)
      let nodePosition = MMR.getNodePosition(leafIndexes[i])
      let finalLocalPeak = MMR._localPeakPosition(leafIndexes[i], finalPeakPositions)
      // positions[finalLocalPeak.i] = finalLocalPeak // ?? should already have all peaks
      let mountainPositions = MMR.mountainPositions(finalLocalPeak, nodePosition.i)
      for (let j = 0; j < mountainPositions.length; j++) {
        positions[mountainPositions[j][0].i] = mountainPositions[j][0]
        positions[mountainPositions[j][1].i] = mountainPositions[j][1]
      }
    }
    // find implied positions (ones which can be calculated based on child positions that are present)
    let positionIndexes = Object.keys(positions)
    let impliedIndexes = []
    for (let j = 0; j < positionIndexes.length; j++) { // k*log(n)
      if (positions[positionIndexes[j]].h > 0) {
        let hasLeftChild = MMR._hasPosition(positions, MMR.leftChildPosition(positions[positionIndexes[j]]))
        let hasRightChild = MMR._hasPosition(positions, MMR.rightChildPosition(positions[positionIndexes[j]]))
        if (hasLeftChild && hasRightChild) {
          impliedIndexes.push(positionIndexes[j]) // don't remove them yet because recursion will be slower
        }
      }
    }
    // finally remove implied nodes
    for (var i = 0; i < impliedIndexes.length; i++) { // k*log(n)
      impliedIndexes[i]
      delete positions[impliedIndexes[i]]
    }
    return positions
  }
  static _hasPosition(nodes, position) {
    let has = !!nodes[position.i]
    if (!has && position.h > 0) {
      if (MMR._hasPosition(nodes, MMR.leftChildPosition(position))
        && MMR._hasPosition(nodes, MMR.rightChildPosition(position))
      ) {
        has = true
      }
    }
    return has
  }
}

export class MemoryBasedDb {

  leafLength: any;
  nodes: { [number: number]: Buffer };
  constructor(...args) {
    if (args[0] == undefined || typeof args[0] == 'number') {
      this.leafLength = args[0] || 0
      this.nodes = args[1] || {}

    }
  }
  async get(index) {
    return this.nodes[index]
  }
  async set(value, index) {
    this.nodes[index] = value
  }
  async getLeafLength() {
    return this.leafLength
  }
  async setLeafLength(leafLength) {
    return this.leafLength = leafLength
  }
  async getNodes() {
    return this.nodes
  }
}

const GetMMRProofIndex = (pos: number, mmvSize: number, extraHashes: number): InstanceType<typeof BN> => {
  let index = new BN(0);
  let layerSizes = [];
  let merkleSizes = [];
  let peakIndexes = [];
  let bitPos = 0;

  //start at the beginning
  //create a simulation of a mmr based on size
  if (!(pos > 0 && pos < mmvSize)) return new BN(0);

  //create an array of all the sizes
  while (mmvSize) {
    layerSizes.push(mmvSize);
    mmvSize = mmvSize >> 1
  }

  for (let height = 0; height < layerSizes.length; height++) {
    if (height == layerSizes.length - 1 || layerSizes[height] & 1) {
      peakIndexes.push(height);
    }
  }

  //array flip peak indexes
  peakIndexes.reverse();

  let layerNum = 0;
  let layerSize = peakIndexes.length;

  for (let passThrough = (layerSize & 1); layerNum == 0 || layerSize > 1; passThrough = (layerSize & 1), layerNum++) {
    layerSize = (layerSize >> 1) + passThrough;
    if (layerSize) {
      merkleSizes.push(layerSize);
    }
  }
  //flip the merklesizes

  for (let i = 0; i < extraHashes; i++) {
    bitPos++;
  }

  let p = pos;
  for (let l = 0; l < layerSizes.length; l++) {
    if (p & 1) {
      index = index.or(new BN(1).shln(bitPos++));

      p >>= 1;

      for (let i = 0; i < extraHashes; i++) {
        bitPos++;
      }

    } else {
      if (layerSizes[l] > (p + 1)) {

        bitPos++;
        p >>= 1;
        for (let i = 0; i < extraHashes; i++) {
          bitPos++;
        }
      } else {

        for (p = 0; p < peakIndexes.length; p++) {

          if (peakIndexes[p] == l) {
            break;
          }
        }

        for (let layerNum = -1, layerSize = peakIndexes.length; layerNum == -1 || layerSize > 1; layerSize = merkleSizes[++layerNum]) {

          if (p < (layerSize - 1) || (p & 1)) {


            if (p & 1) {
              // hash with the one before us
              index = index.or(new BN(1).shln(bitPos++));

              for (let i = 0; i < extraHashes; i++) {
                bitPos++;
              }
            } else {
              // hash with the one in front of us
              bitPos++;

              for (let i = 0; i < extraHashes; i++) {
                bitPos++;
              }
            }
          }
          p >>= 1;
        }

        break;
      }

    }
  }
  return index;
}
