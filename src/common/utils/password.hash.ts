import * as argon2 from 'argon2';

export async function hashData(data: string): Promise<string> {
  return argon2.hash(data);
}

export async function verifyHashData(hash: string, plainData: string): Promise<boolean> {
  return argon2.verify(hash, plainData);
}
