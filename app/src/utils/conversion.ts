const toBytesInt32 = (num: number): Buffer => {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setUint32(0, num);
  return Buffer.from(arr);
};

export { toBytesInt32 };