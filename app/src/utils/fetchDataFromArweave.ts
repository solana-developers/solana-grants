import { ARWEAVE_DEVNET } from "../constants";

export default async (id: string) => {
  try {
    const response = await fetch(`${ARWEAVE_DEVNET}/${id}`);
    const arrayBuffer = await response.arrayBuffer();
    const data = String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
    return { err: false, data: JSON.parse(data) };
  } catch (error) {
    return { err: true };
  }
}