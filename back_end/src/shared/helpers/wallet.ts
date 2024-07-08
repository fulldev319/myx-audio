import { mnemonicToSeed } from 'bip39';
import { fromMasterSeed } from 'hdkey';
import { privateToAddress } from 'ethereumjs-util';
import * as Crypto from 'shared/helpers/aes-gcm';

/**
 * Generate Music Wallet privateKey + address from mnemonic phrases
 * @param phrases
 * @returns
 */
export const generateMusicWallet = async (phrases: string[]) => {
  const derivationPath = "m/44'/60'/0'/0/0";
  const seed = await mnemonicToSeed(phrases.join(' '));
  const node = fromMasterSeed(seed);
  const hdKey = node.derive(derivationPath);
  const address = '0x' + privateToAddress(hdKey._privateKey).toString('hex');
  return { address, privateKey: hdKey._privateKey };
};

/**
 * get Music Wallet privateKey + address from local storage
 * @param phrases
 * @returns
 */
export const getMusicWallet = async () => {
  try {
    const privateKey = await Crypto.loadMusicKey();
    const address =
      '0x' + privateToAddress(Buffer.from(privateKey)).toString('hex');
    return { address, privateKey, error: undefined };
  } catch (e) {
    return {
      address: '',
      privateKey: '',
      error: e.message || 'Music wallet key error'
    };
  }
};

/**
 * get wallet info (address, privateKey) from mnemonics
 * @param mnemonics string | array<string>
 * @returns
 */
export async function getWalletInfo(mnemonics: string | Array<string>) {
  const mnemonicList = Array.isArray(mnemonics)
    ? mnemonics
    : mnemonics.split(/(\s+)/).filter((e) => e.trim().length > 0);
  const { address, privateKey } = await generateMusicWallet(mnemonicList);

  if (!address || !privateKey) {
    throw new Error('Invalid Wallet Address');
  }
  return { address, privateKey };
}

/**
 * save encrypted music wallet info to local storage
 * @param phrases
 */
export async function saveMusicWallet(phrases: string[]) {
  const { privateKey } = await generateMusicWallet(phrases);
  await Crypto.saveMusicKey(privateKey);
}

/**
 * Get wallet address from privateKey
 * @param privateKey Uint8Array
 * @return address string
 */
export function convertPrivateKeyToAddress(privateKey: Uint8Array) {
  const address =
    '0x' + privateToAddress(Buffer.from(privateKey)).toString('hex');
  return address;
}

/**
 * Remove Music wallet key from local storage
 */
export function lockMusicWallet() {
  localStorage.setItem('MUSIC_WALLET_KEY', '');
}
