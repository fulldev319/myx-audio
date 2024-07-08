import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useWeb3React } from '@web3-react/core';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';

import makeStyles from '@material-ui/core/styles/makeStyles';

import { setUser } from 'store/actions/User';
import { setLoginBool } from 'store/actions/LoginBool';
import { useAuth } from 'shared/contexts/AuthContext';
import * as API from 'shared/services/API/WalletAuthAPI';
import { MnemonicWordsInputModal } from 'shared/ui-kit/Modal/Modals';
import { generateMusicWallet } from 'shared/helpers';
import * as Crypto from 'shared/helpers/aes-gcm';
import { convertPrivateKeyToAddress } from 'shared/helpers/wallet';
import { injected } from 'shared/connectors';
import { socket } from './Auth';

const useStyles = makeStyles(() => ({
  header: {
    fontSize: 40,
    lineHeight: '100%',
    textAlign: 'center'
  },
  description: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center'
  },
  connect: {
    width: 470,
    margin: 'auto',
    '& .option-title': {
      display: 'flex',
      fontSize: '30px'
    },
    '& .option-description': {
      display: 'flex',
      fontSize: 18,
      color: '#99A1B3',
      fontWeight: 'normal'
    },
    '& > button': {
      backgroundColor: 'white',
      color: '#181818',
      boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)',
      borderRadius: '20px',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 0,
      height: 115,
      marginLeft: 0,
      marginRight: 0,
      padding: 32,
      '&:hover': {
        boxShadow: '0px 0px 10px #27E8D9'
      },
      '&:focus': {
        outline: 'none'
      }
    }
  }
}));

const SignInWallet = () => {
  const classes = useStyles();
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
  const [errors, setErrors] = useState<string>('');
  const dispatch = useDispatch();
  const [showMnemonicInput, setShowMnemonicInput] = useState<boolean>(false);
  const { setSignedin } = useAuth();
  const { activate, account, deactivate, library } = useWeb3React();
  const [isMetamaskConnected, setMetamaskConnection] = useState(false);
  const signInWithMetamask = async () => {
    if (!(window as any).ethereum) {
      window.alert('Please install MetaMask first.');
      return;
    }
    // if (!web3) {
    //   try {
    //     // Request account access if needed
    //     await (window as any).ethereum.enable();

    //     // We don't know window.web3 version, so we use our own instance of Web3
    //     // with the injected provider given by MetaMask
    //     web3 = new Web3((window as any).ethereum);
    //   } catch (error) {
    //     window.alert("You need to allow MetaMask.");
    //     return;
    //   }
    // }
    await activate(injected);
    setMetamaskConnection(true);
    // const accounts = await web3.eth.getAccounts();
    // API.signInWithMetamaskWallet(accounts[0], web3, "Myx").then(successFunc).catch(failedFunc);
  };

  useEffect(() => {
    if (isMetamaskConnected) {
      if (account && library) {
        console.log(account, library);
        const web3 = new Web3(library.provider);
        API.signInWithMetamaskWallet(account, web3, 'Myx')
          .then(successFunc)
          .catch(failedFunc);
      }
    }
  }, [isMetamaskConnected, account, library]);

  const successFunc = (res) => {
    if (res && res.isSignedIn) {
      setSignedin(true);
      setCookie('accessToken', res.accessToken);
      const data = res.userData;
      socket.emit('add user', data.id);
      dispatch(setUser(data));
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userSlug', data.urlSlug ?? data.id);

      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + Cookies.get('accessToken');
      dispatch(setLoginBool(true));
    } else {
      throw new Error("Can't connect to the account");
    }
  };

  const failedFunc = (err: Error) => {
    setErrors(err.message);
  };

  const signInWithMusicWallet = async () => {
    try {
      const musicKey = await Crypto.loadMusicKey();
      const walletAddress = await convertPrivateKeyToAddress(musicKey);
      if (musicKey) {
        API.signInWithMusicWallet(walletAddress, musicKey)
          .then(successFunc)
          .then(async () => {
            console.log('success');
          })
          .catch(failedFunc);
      } else throw new Error('Loading music key failed');
    } catch (e) {
      // ALERT USER
      console.log(e.message);
      setShowMnemonicInput(true);
    }
  };
  if (errors) return <div className={classes.description}>{errors}</div>;

  const handleSubmitPhrases = async (phrases: string[]) => {
    try {
      const { address: musicWalletAddress, privateKey } =
        await generateMusicWallet(phrases);
      if (musicWalletAddress && privateKey) {
        API.signInWithMusicWallet(musicWalletAddress, privateKey)
          .then(successFunc)
          .then(async () => {
            await Crypto.saveMusicKey(privateKey);

            //added this last line to refresh the page, it got stuck after loging in. If there's
            //another way to fix that feel free to change it
            window.location.replace('/');
          })
          .catch(failedFunc);
      } else {
        throw new Error('Music Wallet Generation Failed');
      }
    } catch (e) {
      // ALERT USER
      console.log(e.message);
    }
  };

  return (
    <>
      <MnemonicWordsInputModal
        open={showMnemonicInput}
        handleSubmit={handleSubmitPhrases}
        handleClose={() => setShowMnemonicInput(false)}
      />
      <div className={classes.header}>Sign In</div>
      <div className={classes.description}>
        To create and monetize your content!
      </div>
      <div className={classes.connect}>
        <button onClick={signInWithMetamask}>
          <div>
            <div className="option-title">Metamask</div>
            <div className="option-description">
              Connect to your MetaMask Wallet
            </div>
          </div>
          <div>
            <img
              src={require('assets/walletImages/metamask.svg')}
              alt="metamask"
            />
          </div>
        </button>
        <button onClick={signInWithMusicWallet}>
          <div>
            <div className="option-title">Music Wallet</div>
            <div className="option-description">
              Connect to your Music Wallet
            </div>
          </div>
          <div>
            <img
              src={require('assets/walletImages/music_wallet.svg')}
              alt="music wallet"
            />
          </div>
        </button>
      </div>
    </>
  );
};

export default SignInWallet;
