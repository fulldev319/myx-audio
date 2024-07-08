import React, { useEffect, useState, useContext, useRef } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import axios from 'axios';
import io from 'socket.io-client';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import { musicStyles } from './index.styles';
import Player from './components/Player';
import Sidebar from './components/Sidebar';
import MusicContext from 'shared/contexts/MusicContext';
import AlbumListPage from './subpages/AlbumListPage';
import AlbumPage from './subpages/AlbumPage';
import ArtistPage from './subpages/ArtistPage';
import HomePage from './subpages/HomePageNew';
import LibraryPage from './subpages/LibraryPage';
import LikedPage from './subpages/LikedPage';
import PlaylistPage from './subpages/PlaylistPage';
import PlaylistDetailPage from './subpages/PlaylistDetailPage';
import MyPlaylistPage from './subpages/MyPlaylistPage';
import QueuePage from './subpages/QueuePage';
import SearchPage from './subpages/SearchPage';
import FruitPage from './subpages/Fruit';
import Box from 'shared/ui-kit/Box';
import GenreListPage from './subpages/GenreListPage';
import GenrePage from './subpages/GenrePage';
import ExploreAllPage from './subpages/ExploreAllPage';
import { ShareWithQRCode } from 'shared/ui-kit/Modal/Modals/ShareWithQRCode';
import SubscriptionPage from './subpages/SubscriptionPage';
import { useTypedSelector } from 'store/reducers/Reducer';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { SecondaryButton } from 'shared/ui-kit';

import { ReactComponent as FiberManualRecordIcon } from 'assets/icons/fiber_manual_record.svg';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import FeaturedArtistsPage from './subpages/FeaturedArtistsPage';
import RecentlyPlayedPage from './subpages/RecentlyPlayedPage';
import { useAuth } from 'shared/contexts/AuthContext';
import { signOut } from 'store/actions/User';

import { socket, setSocket } from 'components/Login/Auth';

import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';

import NoMetamaskModal from 'components/Connect/modals/NoMetamaskModal';
import ConnectWalletModal from '../../modals/ConnectWalletModal';
import PostNoteModal from 'components/Connect/modals/PostNoteModal';
import { setUser } from 'store/actions/User';
import URL from 'shared/functions/getURL';
import { setLoginBool } from 'store/actions/LoginBool';
import Web3 from 'web3';
import * as API from 'shared/services/API/WalletAuthAPI';
import { useCookies } from 'react-cookie';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { injected } from 'shared/connectors';
import { CircularLoadingIndicator } from 'shared/ui-kit';
import { useDebounce } from 'use-debounce/lib';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { SearchIcon } from 'components/MusicDao/components/Icons/SvgIcons';
import { Color } from 'shared/ui-kit';

export default function Music() {
  const classes = musicStyles();
  const history = useHistory();

  const { activate, account, active, library } = useWeb3React();
  const dispatch = useDispatch();

  const { freeMusicTime } = useContext(MediaPlayerKeyContext);
  // const { freeMusicTime, setFreeMusicTime } = useContext(MediaPlayerKeyContext);
  const [fixSearch, setFixSearch] = useState<string>('');
  const [songsList, setSongsList] = useState<any[]>([]);

  const mobileMatch = useMediaQuery('(max-width:750px)');

  const [openQrCodeModal, setOpenQrCodeModal] = useState<boolean>(false);
  const [qrCodeValue, setQRCodeValue] = useState<string>('');

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [userId, setUserId] = useState<string>('');
  const [userProfile, setUserProfile] = useState<any>({});

  const userSelector = useTypedSelector((state) => state.user);
  const { isSignedin, setSignedin, accountStatus, updateAccountStatus } =
    useAuth();

  const popperOpen = Boolean(anchorEl);
  const popperId = popperOpen ? 'spring-popper' : undefined;

  const [arrowEl, setArrowEl] = React.useState<null | HTMLElement>(null);

  const [connectWallet, setConnectWallet] = React.useState<boolean>(false);
  const [noMetamask, setNoMetamask] = React.useState<boolean>(false);
  const [isShowPostNote, setShowPostNote] = React.useState<boolean>(false);
  const signData = React.useRef();
  const timerRef = React.useRef<any>();
  const [cookies, setCookie] = useCookies(['accessToken']);
  const { showAlertMessage } = useAlertMessage();
  const activateAccountRef = useRef<boolean>(false);

  const [searchValue, setSearchValue] = React.useState<string>('');
  const [debouncedSearchValue] = useDebounce(searchValue, 1000);

  useEffect(() => {
    setFixSearch(debouncedSearchValue);
    if (debouncedSearchValue?.length > 0) {
      history.push(`/player/search`);
    }
  }, [debouncedSearchValue]);

  const imageIPFS = React.useMemo(() => {
    if (userSelector.anon) {
      return require(`assets/anonAvatars/${userSelector.anonAvatar}`);
    } else if (userSelector?.urlIpfsImage) {
      return userSelector?.urlIpfsImage;
    }
  }, [userSelector]);

  const currentPathName = React.useMemo(() => {
    const openTabs = window.location.href.split('/#/player')[1].split('/');
    // console.log(openTabs);
    return openTabs.length > 1 ? openTabs[1] : '';
    // return window.location.href;
  }, [window.location.href]);

  const handleCopyAddress = (link: string) => {
    navigator.clipboard.writeText(link);
  };

  const handleCreatePopup = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfile = (e) => {
    history.push(`/profile/${userSelector.urlSlug}`);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setSignedin(false);
    dispatch(signOut());
    localStorage.removeItem('userSlug');
    localStorage.removeItem('userId');
    Cookies.remove('accessToken');
    localStorage.removeItem('address');
    history.push('/');
    window.location.reload();
  };

  useEffect(() => {
    if (!isSignedin) {
      handleConnectWallet();
      return;
    }

    setUserId(userSelector.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelector]);

  useEffect(() => {
    if (userId && userId.length > 0) {
      if (socket) {
        socket.on('user_connect_status', async (connectStatus) => {
          if (connectStatus.userId === userId) {
            let setterUser: any = { ...userProfile };
            setterUser.connected = connectStatus.connected;
            setUserProfile(setterUser);
          }
        });
      }
    }
  }, [userId, userProfile]);

  const handleConnectMetamask = () => {
    if (active) {
      if (account) {
        onGetTrax();
      }
    } else {
      activate(injected, undefined, true)
        .then(() => {
          activateAccountRef.current = true;
        })
        .catch((error) => {
          if (error instanceof UnsupportedChainIdError) {
            activate(injected);
          } else {
            console.info('Connection Error - ', error);
            setNoMetamask(true);
          }
        });
    }
  };

  const handleConnectWallet = () => {
    setConnectWallet(true);
  };

  const onGetTrax = async () => {
    setShowPostNote(false);
    try {
      if (account && library) {
        const web3 = new Web3(library.provider);
        const res = await API.signInWithMetamaskWallet(account, web3, 'Myx');
        if (res.isSignedIn) {
          signData.current = res;
          setCookie('accessToken', res.accessToken);
          handleSignIn();
        } else {
          if (res.message) {
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
      // history.push("/");
    }
  };

  if (isSignedin) {
    return (
      <MusicContext.Provider
        value={{
          fixSearch: fixSearch,
          setFixSearch: setFixSearch,
          songsList: songsList,
          setSongsList: setSongsList,
          setShowQRCodeDownload: setOpenQrCodeModal,
          showQRCodeDownload: openQrCodeModal,
          setQRCodeValue: setQRCodeValue,
          qrCodeValue: qrCodeValue,
          setCopyLink: handleCopyAddress
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          style={{ background: '#081047' }}
        >
          <Box flex={1} overflow="auto" className={classes.contentContainer}>
            <Sidebar seconds={freeMusicTime} />
            <div className={classes.mainContainer}>
              <Box width={1}>
                <Box
                  width={1}
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  padding={mobileMatch ? '16px' : '18px 36px 18px 52px'}
                  // borderBottom="1px solid #eee"
                >
                  {/* {currentPathName.length > 0 && currentPathName !== 'home' ? ( */}
                  <Box
                    className={classes.backBtnBox}
                    onClick={() => history.goBack()}
                  >
                    <BackIcon />
                    &nbsp;&nbsp;&nbsp;Back
                  </Box>
                  {/* ) : (
                    <Box />
                  )} */}
                  <Box
                    width={1}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent="flex-end"
                  >
                    <div className={classes.searchBox}>
                      <InputWithLabelAndTooltip
                        type="text"
                        inputValue={searchValue}
                        placeHolder="Search Music"
                        onInputValueChange={(e) => {
                          setSearchValue(e.target.value);
                        }}
                        style={{
                          background: 'transparent',
                          margin: 0,
                          marginRight: 8,
                          padding: 0,
                          border: 'none',
                          height: 'auto'
                        }}
                        theme="player search"
                      />
                      <Box
                        onClick={() => {}}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        style={{ cursor: 'pointer' }}
                      >
                        <SearchIcon color={Color.White} />
                      </Box>
                    </div>
                    <Box display="flex" alignItems="center">
                      <SecondaryButton
                        size="medium"
                        className={classes.accountInfo}
                        style={{
                          color: '#fff',
                          // background: 'transparent',
                          borderRadius: '100vh',
                          display: 'flex',
                          alignItems: 'center',
                          background:
                            'linear-gradient(#081047, #081047) padding-box, linear-gradient(122.33deg, #4C0CBD 13.31%, #2A9FE2 93.53%) border-box',
                          border: '1px solid transparent'
                          // borderWidth: '1px',
                          // borderStyle: 'solid',
                          // borderImage:
                          //   'linear-gradient(122.33deg, #4C0CBD 13.31%, #2A9FE2 93.53%) 1'
                        }}
                      >
                        <span>
                          <div
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              background: '#FF00C6'
                            }}
                          />
                        </span>
                        <label>
                          {account?.slice(0, 7)}...
                          {account?.slice(account?.length - 7)}
                        </label>
                      </SecondaryButton>
                      <div
                        id="header-popup-wallet"
                        className={classes.avatar}
                        style={{
                          backgroundImage: `url("${
                            imageIPFS || getDefaultAvatar()
                          }")`,
                          cursor: 'pointer',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                        onClick={handleCreatePopup}
                      />

                      <Popper
                        id={popperId}
                        open={popperOpen}
                        anchorEl={anchorEl}
                        transition
                        modifiers={{
                          arrow: {
                            enabled: true,
                            element: arrowEl
                          },
                          offset: {
                            enabled: true,
                            offset: '20, 0'
                          }
                        }}
                        placement="bottom-end"
                        style={{ zIndex: 1000 }}
                      >
                        <span
                          className={classes.header_popup_arrow}
                          ref={setArrowEl}
                        />
                        <ClickAwayListener
                          onClickAway={() => {
                            setAnchorEl(null);
                          }}
                        >
                          <div className={classes.header_popup_back}>
                            <div
                              className={classes.header_popup_back_item1}
                              onClick={handleProfile}
                            >
                              Profile
                            </div>
                            <div
                              className={classes.header_popup_back_item}
                              onClick={() => {
                                handleLogout();
                                setAnchorEl(null);
                              }}
                            >
                              Log Out
                            </div>
                          </div>
                        </ClickAwayListener>
                      </Popper>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <div className={classes.content}>
                <Switch>
                  <Route exact path="/player/search" component={SearchPage} />
                  <Route
                    exact
                    path="/player/albums"
                    component={AlbumListPage}
                  />
                  <Route
                    exact
                    path="/player/playlist"
                    component={PlaylistPage}
                  />
                  <Route
                    exact
                    path="/player/subscription"
                    component={SubscriptionPage}
                  />
                  <Route
                    exact
                    path="/player/artists"
                    component={FeaturedArtistsPage}
                  />
                  <Route
                    exact
                    path="/player/artists/:id"
                    component={ArtistPage}
                  />
                  <Route
                    exact
                    path="/player/playlist/:id"
                    component={PlaylistDetailPage}
                  />
                  <Route
                    exact
                    path="/player/genres"
                    component={GenreListPage}
                  />
                  <Route
                    exact
                    path="/player/genres/:id"
                    component={GenrePage}
                  />
                  <Route
                    exact
                    path="/player/albums/:id"
                    component={AlbumPage}
                  />
                  <Route exact path="/player/library" component={LibraryPage} />
                  <Route exact path="/player/liked" component={LikedPage} />
                  <Route
                    exact
                    path="/player/myplaylist"
                    component={MyPlaylistPage}
                  />
                  <Route exact path="/player/fruit" component={FruitPage} />
                  <Route
                    exact
                    path="/player/explorer"
                    component={ExploreAllPage}
                  />
                  <Route exact path="/player/queue" component={QueuePage} />
                  <Route
                    exact
                    path="/player/recentlyplayed"
                    component={RecentlyPlayedPage}
                  />
                  <Route path="/" component={HomePage} />
                </Switch>
              </div>
            </div>
          </Box>
          <Player />
          <ShareWithQRCode
            isOpen={openQrCodeModal}
            onClose={() => setOpenQrCodeModal(false)}
            shareLink={qrCodeValue}
          />
        </Box>
      </MusicContext.Provider>
    );
  } else {
    return (
      <div>
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularLoadingIndicator />
        </div>
        {isShowPostNote && (
          <PostNoteModal
            open={isShowPostNote}
            onClose={() => setShowPostNote(false)}
            onNext={onGetTrax}
          />
        )}
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
            setConnected={(v) => handleConnectMetamask()}
            showNoMetaMask={() => {
              setConnectWallet(false);
              handleConnectMetamask();
            }}
          />
        )}
      </div>
    );
  }
}

const BackIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="20" fill="url(#paint0_linear_16794_263438)" />
    <path
      d="M22.3953 26C22.5534 26 22.6957 25.9296 22.8222 25.8062C23.0593 25.5421 23.0593 25.1193 22.8222 24.8727L18.4427 19.9934L22.8064 15.1317C23.0435 14.8675 23.0435 14.4447 22.8064 14.1981C22.5692 13.934 22.1897 13.934 21.9684 14.1981L17.1778 19.5178C16.9407 19.7819 16.9407 20.2048 17.1778 20.4514L21.9684 25.7886C22.0791 25.9296 22.2372 26 22.3953 26L22.3953 26Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_16794_263438"
        x1="9"
        y1="8.5"
        x2="24.5"
        y2="33"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4D08BC" />
        <stop offset="1" stopColor="#2A9FE2" />
      </linearGradient>
    </defs>
  </svg>
);
