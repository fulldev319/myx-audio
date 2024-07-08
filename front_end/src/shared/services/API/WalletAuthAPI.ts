import axios from 'axios';
import Web3 from 'web3';
import { signWithMetamask, signWithMusic } from '../WalletSign';
import URL from 'shared/functions/getURL';
import Cookies from 'js-cookie';
import { useCookies } from 'react-cookie';
export async function signInWithMetamaskWallet(
  address: string,
  web3: Web3,
  domain: string,
  handleException?: () => void
): Promise<any> {
  const signature = await signWithMetamask(address, web3, domain);
  if (handleException) {
    handleException();
  }
  return new Promise<any>((resolve, reject) => {
    axios
      .post(`${URL()}/user/signInWithMetamaskWallet_v2`, {
        address,
        signature,
        domain
      })
      .then((res) => {
        Cookies.set('accessToken', res.data.accessToken);

        resolve({ ...res.data, signature });
      })
      .catch(async (err) => {
        // console.log("Error in SignIn.tsx -> fetchUser() : ", err);
        reject('Error');
      });
  });
}

export async function signInWithMusicWallet(
  address: string,
  privateKey?: any
): Promise<any> {
  let { hash, signature } = await signWithMusic(address, privateKey);
  hash = Buffer.from(hash).toString('hex');
  return new Promise<any>((resolve, reject) => {
    axios
      .post(`${URL()}/user/signInWithMusicWallet`, { address, hash, signature })
      .then((res) => {
        resolve(res.data);
      })
      .catch(async (err) => {
        // console.log("Error in SignIn.tsx -> fetchUser() : ", err);
        reject('Error');
      });
  });
}

export async function signUpWithMetamaskWallet(
  address: string,
  web3: Web3,
  domain: string
): Promise<any> {
  let signature = await signWithMetamask(address, web3, domain);
  return new Promise<any>((resolve, reject) => {
    axios
      .post(`${URL()}/user/signUpWithMetamaskWallet`, {
        firstName: 'User',
        email: 'music@gmail.com',
        address,
        signature
      })
      .then((res) => {
        res.data.signature = signature;
        resolve(res.data);
      })
      .catch(async (err) => {
        //   console.log("Error in SignUp.tsx -> storeUser() : ", err);
        reject('Error');
      });
  });
}

export async function signUpWithMusicWallet(
  address: string,
  privateKey?: any
): Promise<any> {
  let { hash, signature } = await signWithMusic(address, privateKey);
  hash = JSON.stringify(hash);
  return new Promise<any>((resolve, reject) => {
    axios
      .post(`${URL()}/user/signUpWithMusicWallet`, {
        firstName: 'User',
        email: 'music@gmail.com',
        address,
        hash,
        signature
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch(async (err) => {
        //   console.log("Error in SignUp.tsx -> storeUser() : ", err);
        reject('Error');
      });
  });
}
