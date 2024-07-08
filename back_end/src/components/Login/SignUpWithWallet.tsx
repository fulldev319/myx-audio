import React, { useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import Cookies from 'js-cookie';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import makeStyles from '@material-ui/core/styles/makeStyles';

import { setUser } from 'store/actions/User';
import { setLoginBool } from 'store/actions/LoginBool';
import { useAuth } from 'shared/contexts/AuthContext';
import * as API from 'shared/services/API/WalletAuthAPI';
import {
  CreateMusicWalletModal,
  MnemonicWordsInputModal
} from 'shared/ui-kit/Modal/Modals';
import { generateMusicWallet } from 'shared/helpers';
import * as Crypto from 'shared/helpers/aes-gcm';
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

declare let window: any;
interface ISignUpWalletProps {
  handleCloseModal: () => void;
}
const SignUpWallet: React.FC<ISignUpWalletProps> = ({ handleCloseModal }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
  const classes = useStyles();
  const [signedUp, setSignedUp] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [showMusicWalletDialog, setShowMusicWalletDialog] =
    useState<boolean>(false);
  const [showMnemonicInputModal, setShowMnemonicInputModal] =
    useState<boolean>(false);
  const dispatch = useDispatch();
  const { setSignedin } = useAuth();
  const history = useHistory();
  var web3;
  var accounts;

  const signUpWithMetamask = async () => {
    if (!(window as any).ethereum) {
      window.alert('Please install MetaMask first.');
      return;
    }

    if (!web3) {
      try {
        await (window as any).ethereum.enable();
        // We don't know window.web3 version, so we use our own instance of Web3
        // with the injected provider given by MetaMask
        web3 = new Web3((window as any).ethereum);
      } catch (error) {
        window.alert('You need to allow MetaMask.');
        return;
      }
    }
    accounts = await window.ethereum.request({ method: 'eth_accounts' });
    setAddress(accounts[0]);
    if (accounts[0]) {
      API.signUpWithMetamaskWallet(accounts[0], web3, 'Music Wallet')
        .then((result) => {
          if (result.success) {
            setSignedUp(true);
            API.signInWithMetamaskWallet(
              accounts[0],
              web3,
              'Myx',
              result.signature
            ).then((res) => {
              if (res.isSignedIn) {
                const data = res.userData;
                setCookie('accessToken', res.accessToken);
                socket.emit('add user', data.id);
                dispatch(setUser(data));
                localStorage.setItem('userId', data.id);
                localStorage.setItem('userSlug', data.urlSlug ?? data.id);

                axios.defaults.headers.common['Authorization'] =
                  'Bearer ' + Cookies.get('accessToken');
                dispatch(setLoginBool(true));

                //added this last line to refresh the page, it got stuck after loging in. If there's
                //another way to fix that feel free to change it
                window.location.replace('/');
              } else {
                if (res.message) {
                  //setErrors(res.message);
                } else {
                  setErrors('Connect the metamask');
                }
              }
            });
          } else {
            setErrors('There was an error when creating User');
          }
        })
        .catch((err) => {
          console.log('Error in SignUp.tsx -> storeUser() : ', err);
        });
    }
  };

  const signUpWithMusicWallet = async (mnemonic: string[]) => {
    const { address, privateKey } = await generateMusicWallet(mnemonic);
    try {
      const respSignUp = await API.signUpWithMusicWallet(address, privateKey);
      if (respSignUp.success) {
        setSignedUp(true);
        const respSignIn = await API.signInWithMusicWallet(address, privateKey);
        if (respSignIn.isSignedIn) {
          const data = respSignIn.userData;
          socket.emit('add user', data.id);

          dispatch(setUser(data));
          localStorage.setItem('userId', data.id);
          localStorage.setItem('userSlug', data.urlSlug ?? data.id);

          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + Cookies.get('accessToken');
          dispatch(setLoginBool(true));

          await Crypto.saveMusicKey(privateKey);
          //added this last line to refresh the page, it got stuck after loging in. If there's
          //another way to fix that feel free to change it
          setTimeout(() => {
            window.location.replace('/');
          }, 500);
        } else {
          if (respSignIn.message) {
            throw new Error(respSignIn.message);
          } else {
            throw new Error('Connect the metamask');
          }
        }
      } else {
        throw new Error(respSignUp.message);
      }
    } catch (err) {
      console.log('SignUpWithMusicWallet Error', err.message);
      setErrors(err.message || 'Network Error');
    }
  };

  if (signedUp)
    return (
      <div className={classes.description}>
        Register account with {address && address} address sucessfully
      </div>
    );
  if (errors) return <div className={classes.description}>{errors}</div>;
  return (
    <>
      <CreateMusicWalletModal
        open={showMusicWalletDialog}
        handleOk={() => {
          setShowMusicWalletDialog(false);
          setShowMnemonicInputModal(true);
        }}
        handleClose={() => setShowMusicWalletDialog(false)}
      />
      <MnemonicWordsInputModal
        open={showMnemonicInputModal}
        title="Sign Up with Music Wallet"
        submitBtnTxt="Sign Up"
        handleSubmit={signUpWithMusicWallet}
        handleClose={() => setShowMnemonicInputModal(false)}
      />
      <div className={classes.header}>Sign Up With Wallet</div>
      <div className={classes.description}>
        To create and monetize your content!
      </div>
      <div className={classes.connect}>
        <button onClick={signUpWithMetamask}>
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
        <button onClick={() => setShowMusicWalletDialog(true)}>
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

export default SignUpWallet;
