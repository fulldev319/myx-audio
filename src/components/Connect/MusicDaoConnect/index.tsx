import React, { useEffect, useState, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import { TwitterShareButton } from 'react-share';

import { useAuth } from 'shared/contexts/AuthContext';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import Box from 'shared/ui-kit/Box';
import Web3 from 'web3';
import Header from './components/Header';
import { musicHomePageStyles } from './index.styles';
import * as API from 'shared/services/API/WalletAuthAPI';
// import { ReactComponent as YoutubeIcon } from "assets/snsIcons/youtube.svg";
import { ReactComponent as TwitterIcon } from 'assets/snsIcons/twitter.svg';
import { ReactComponent as InstagramIcon } from 'assets/snsIcons/instagram.svg';
// import { ReactComponent as LinkedInIcon } from "assets/snsIcons/linkedin.svg";
// import { ReactComponent as TiktokIcon } from "assets/snsIcons/tiktok.svg";
import { ReactComponent as MediaIcon } from 'assets/snsIcons/media.svg';
import {
  // handleYoutubeLink,
  handleTwitterLink,
  handleInstagramLink,
  // handleLinkedinLink,
  // handleTiktokLink,
  handleMediumLink
} from 'shared/constants/constants';
import { socket, setSocket } from 'components/Login/Auth';
import axios from 'axios';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import URL from 'shared/functions/getURL';
import { setUser } from 'store/actions/User';
import { setLoginBool } from 'store/actions/LoginBool';
import { useHistory } from 'react-router-dom';
import { useInterval } from 'shared/hooks/useInterval';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import useIPFS from 'shared/utils-IPFS/useIPFS';

import USDTGetModal from '../modals/USDTGetModal';
import PostNoteModal from '../modals/PostNoteModal';
import NoAuthModal from '../modals/NoAuthModal';
import NoMetamaskModal from '../modals/NoMetamaskModal';
import ConnectWalletModal from '../../MusicDao/modals/ConnectWalletModal';
import { useCookies } from 'react-cookie';

const MusicSocialBox = () => {
  const classes = musicHomePageStyles();
  return (
    <Box className={classes.snsContainer}>
      {/* <Box className={classes.snsBox} onClick={handleYoutubeLink}>
        <YoutubeIcon width="26px" />
      </Box> */}
      <Box className={classes.snsBox} onClick={handleTwitterLink}>
        <TwitterIcon />
      </Box>
      <Box className={classes.snsBox} onClick={handleInstagramLink}>
        <InstagramIcon />
      </Box>
      {/* <Box className={classes.snsBox} onClick={handleLinkedinLink}>
        <LinkedInIcon />
      </Box> */}
      {/* <Box className={classes.snsBox} onClick={handleTiktokLink}>
        <TiktokIcon />
      </Box> */}
      <Box className={classes.snsBox} onClick={handleMediumLink}>
        <MediaIcon />
      </Box>
    </Box>
  );
};

const MusicMusicDaoConnect = () => {
  const history = useHistory();
  const classes = musicHomePageStyles();
  const { setSignedin } = useAuth();
  const { showAlertMessage } = useAlertMessage();
  const { deactivate, account, library, active } = useWeb3React();
  const [status, setStatus] = useState<string>('nolist');
  const [waitlisted, setWaitlisted] = useState<boolean>(false);
  const [tweetWaitlistLoading, setTweetWaitlistLoading] =
    useState<boolean>(false);
  const tweetWaitRef = useRef<boolean>(false);
  const twitterButton = useRef<HTMLButtonElement>(null);
  const [signatureFail, setSignatureFail] = useState<boolean>(false);

  const [noMetamask, setNoMetamask] = useState<boolean>(false);
  const [connectWallet, setConnectWallet] = useState<boolean>(false);
  const [isShowPostNote, setShowPostNote] = useState<boolean>(false);
  const [isShowUSDTGet, setShowUSDTGet] = useState<boolean>(false);
  const [isShowNoAuth, setShowNoAuth] = useState<boolean>(false);
  const [freeUSDTAmount, setFreeUSDTAmount] = useState<number>(0);
  const [connected, setConnected] = useState<boolean>(false);
  const [cookies, setCookie] = useCookies(['accessToken']);
  const dispatch = useDispatch();

  const signData = useRef();
  const timerRef = useRef<any>();

  useEffect(() => {
    if (connected && account && account.length > 0 && !signatureFail) {
      axios
        .post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account,
          appName: 'Myx'
        })
        .then(async (res) => {
          if (res.data.success === true) {
            const data = res.data.data;
            if (data.status === 'authorized') {
              setStatus('authorized');
              const isNotifiedTestnet = localStorage.getItem(
                `TraxTestNetNotify${account}`
              );
              if (!isNotifiedTestnet || isNotifiedTestnet !== 'true') {
                setShowPostNote(true);
                localStorage.setItem(`TraxTestNetNotify${account}`, 'true');
              } else {
                onGetTrax();
              }
            } else {
              if (data.status === 'nolist') {
                twitterButton?.current?.click();
                setTweetWaitlistLoading(true);
                tweetWaitRef.current = true;
              }
              setStatus(data.status);
            }
          }
        });
    }
  }, [account, connected, signatureFail]);

  //  blinding early access
  useEffect(() => {
    var bgColorIdx = 0;
    var colorIdx = 0;

    const intervalRef = setInterval(() => {
      var doc = document.getElementById('earlyAccessMusicDAO');
      const color = ['#ffffff', '#181818'];
      const bgColor = ['#ffa234', '#ef43c9', '#7e85ff', '#7ed1ef', '#bf7eff'];
      if (doc) {
        doc.style.backgroundColor = bgColor[bgColorIdx];
      }
      if (bgColorIdx % bgColor.length === 0) {
        if (doc) {
          doc.style.color = color[colorIdx];
        }
        colorIdx = (colorIdx + 1) % color.length;
      }
      bgColorIdx = (bgColorIdx + 1) % bgColor.length;
    }, 500);

    return () => {
      clearInterval(intervalRef);
    };
  }, []);

  useInterval(() => {
    if (tweetWaitRef.current) {
      axios
        .post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account,
          appName: 'Myx'
        })
        .then((res) => {
          if (res.data.success === true) {
            const data = res.data.data;
            if (data.status === 'waitlisted') {
              setWaitlisted(true);
              setTweetWaitlistLoading(false);
              tweetWaitRef.current = false;
            } else if (data.status === 'authorized') {
              history.push('/');
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, 10000);

  const handleConnectWallet = () => {
    // deactivate()
    if (active) {
      setConnected(true);
      if (account && signatureFail) {
        setSignatureFail(false);
      }
    } else {
      setConnectWallet(true);
    }
  };

  const onGetTrax = async () => {
    try {
      setShowPostNote(false);
      if (account && library) {
        const web3 = new Web3(library.provider);
        const res = await API.signInWithMetamaskWallet(account, web3, 'Myx');
        if (res.isSignedIn) {
          signData.current = res;
          setCookie('accessToken', res.accessToken);
          handleSignIn();
        } else {
          if (res.message) {
            setSignatureFail(true);
            showAlertMessage(res.message, { variant: 'error' });
          } else {
            showAlertMessage('Connect the metamask', { variant: 'error' });
          }
        }
      }
    } catch (err) {}
  };

  const handleSignIn = async () => {
    const res: any = signData.current;
    if (res && account) {
      setSignedin(true);
      if (!socket) {
        const sock = io(URL(), {
          query: { token: Cookies.get('accessToken') },
          transports: ['websocket']
        });
        sock.on('connected', () => {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        });
        sock.connect();
        setSocket(sock);

        sock.on('disconnect', () => {
          timerRef.current = setInterval(() => {
            sock.connect();
          }, 5000);
        });
      }
      if (socket) {
        socket.emit('add user', res.userData.id);
      }
      dispatch(setUser(res.userData));
      localStorage.setItem('address', account);
      localStorage.setItem('userId', res.userData.id);
      localStorage.setItem('userSlug', res.userData.urlSlug ?? res.userData.id);

      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + Cookies.get('accessToken');
      dispatch(setLoginBool(true));
      history.push('/');
    }
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.navigationContainer}>
        <Header cardHidden={!!account} />
        <Box
          className={classes.mainContainer}
          display="flex"
          flexDirection="column"
        >
          <Box className={classes.backImages} position="relative">
            <img
              src={require('assets/musicDAOImages/orange.webp')}
              style={{ top: 67, left: -67 }}
              alt="back1"
            />
            <img
              src={require('assets/musicDAOImages/avocado.webp')}
              style={{ top: -121, left: 116 }}
              alt="back3"
            />
            <img
              src={require('assets/musicDAOImages/watermelon.webp')}
              style={{ right: -42 }}
              alt="back5"
            />
          </Box>
          <Box
            className={classes.titleContainer}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box position="relative">
              <img
                src={require('assets/logos/music.webp')}
                alt="myx"
                className={classes.pixLogo}
              />
              <span id="earlyAccessMusicDAO" className={classes.earlyAccess}>
                early access
              </span>
            </Box>
          </Box>
          {connected && account && !signatureFail ? (
            <>
              {waitlisted ? (
                <>
                  <Box className={classes.titleDescription2}>
                    <h4 style={{ fontWeight: 400 }}>
                      🎉 Congrats! You’ve been successfully whitelisted.
                    </h4>
                    <h3 className={classes.titleFollow}>
                      Follow our social media for updates
                    </h3>
                  </Box>
                  <MusicSocialBox />
                </>
              ) : status != 'nolist' ? (
                <>
                  {status == 'authorized' ? (
                    <Box className={classes.titleDescription2}>
                      <h4 style={{ fontWeight: 400 }}>
                        Connect your Wallet to Mainnet Network
                      </h4>
                      <h3 className={classes.titleFollow}>
                        Follow our social media for updates
                      </h3>
                    </Box>
                  ) : (
                    <Box className={classes.titleDescription2}>
                      <h4 style={{ fontWeight: 400 }}>
                        Looks like you are already on our whitelist. Stay tuned!
                      </h4>
                      <h3 className={classes.titleFollow}>
                        Follow our social media for updates
                      </h3>
                    </Box>
                  )}
                  <MusicSocialBox />
                </>
              ) : (
                <>
                  <Box className={classes.titleDescription2}>
                    You're one step closer to getting on the app whitelist!
                    <br />
                    <span>Tweet this to enjoy early access</span>
                  </Box>
                  <Box className={classes.twitterShareContainer}>
                    <span>
                      I just joined the waitlist for <b>Myx</b> with {account}!
                      Join me to be one of the first people on <b>Myx</b> and a
                      chance to win up to 200 USDC!{' '}
                      <a href="https://app.myx.audio/" target="_blank">
                        https://app.myx.audio/
                      </a>
                    </span>
                    <LoadingWrapper loading={tweetWaitlistLoading}>
                      <TwitterShareButton
                        title={`I just joined the waitlist for Myx with ${account}! Join me to be one of the first people on Myx and a chance to win up to 200 USDC!`}
                        url="https://app.myx.audio/"
                        ref={twitterButton}
                      >
                        <button
                          className={classes.twitterShareButton}
                          onClick={() => {
                            setTweetWaitlistLoading(true);
                            tweetWaitRef.current = true;
                          }}
                        >
                          <TwitterIcon />
                          <span>Share on Twitter</span>
                        </button>
                      </TwitterShareButton>
                    </LoadingWrapper>
                  </Box>
                </>
              )}
            </>
          ) : (
            <>
              <Box className={classes.titleDescription}>
                Connect your wallet to get in to the whitelist, or{' '}
                <span>enter the platform if you already have access</span>
              </Box>
              <Box className={classes.btnConnectContainer}>
                <button
                  className={classes.btnConnect}
                  onClick={handleConnectWallet}
                >
                  Connect Wallet
                </button>
              </Box>
            </>
          )}
        </Box>
      </Box>
      <USDTGetModal
        open={isShowUSDTGet}
        onClose={() => {
          setShowUSDTGet(false);
          handleSignIn();
        }}
        amount={freeUSDTAmount}
        account={account ?? ''}
      />
      <PostNoteModal
        open={isShowPostNote}
        onClose={() => setShowPostNote(false)}
        onNext={onGetTrax}
      />
      <NoAuthModal
        open={isShowNoAuth}
        onClose={() => {
          setShowNoAuth(false);
          setSignatureFail(true);
        }}
      />
      {noMetamask && (
        <NoMetamaskModal
          open={noMetamask}
          onClose={() => setNoMetamask(false)}
        />
      )}
      {connectWallet && (
        <ConnectWalletModal
          open={connectWallet}
          handleClose={() => setConnectWallet(false)}
          setConnected={setConnected}
          showNoMetaMask={() => {
            setConnectWallet(false);
            setNoMetamask(true);
          }}
        />
      )}
    </Box>
  );
};

export default MusicMusicDaoConnect;
