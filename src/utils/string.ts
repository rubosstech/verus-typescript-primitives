export const isHexString = (s: string) => {
  try {
    const striBuf = Buffer.from(s, 'hex');
    striBuf.toString('hex');
  
    return true;
  } catch(e) {
    return false;
  }
}