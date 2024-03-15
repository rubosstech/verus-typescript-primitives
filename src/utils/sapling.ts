import { bech32 } from "bech32";

// TODO: Fix this function, it doesn't decode sapling addrs
export const fromBech32 = (address: string): { version: number, prefix: string, data: Buffer } => {
  var result = bech32.decode(address);
  var data = bech32.fromWords(result.words);

  return {
    version: result.words[0],
    prefix: result.prefix,
    data: Buffer.from(data)
  }
}

export const convertBits = (data: Buffer, from: number, to: number, strictMode: boolean): Buffer => {
  const length = strictMode
    ? Math.floor((data.length * from) / to)
    : Math.ceil((data.length * from) / to);
  const mask = (1 << to) - 1;
  const result = Buffer.alloc(length);
  let index = 0;
  let accumulator = 0;
  let bits = 0;

  for (const value of data) {
    accumulator = (accumulator << from) | value;
    bits += from;
    while (bits >= to) {
      bits -= to;
      result[index] = (accumulator >> bits) & mask;
      ++index;
    }
  }

  if (!strictMode) {
    if (bits > 0) {
      result[index] = (accumulator << (to - bits)) & mask;
      ++index;
    }
  } else {
    throw new Error("Bits cannot be converted")
  }

  return result;
}

export const decodeSaplingAddress = (address: string): { d: Buffer, pk_d: Buffer } => {
  const result = fromBech32(address)
  const data = convertBits(result.data, 5, 8, false);

  return { d: data.subarray(0, 10), pk_d: data.subarray(10) }
}