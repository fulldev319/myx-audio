import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import axios from 'axios';
import io from 'socket.io-client';
import { useDebounce } from 'use-debounce/lib';
import Cookies from 'js-cookie';
import { InjectedConnector } from '@web3-react/injected-connector';

import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Hidden from '@material-ui/core/Hidden';
import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { getUser } from 'store/selectors/user';
import { setUser, signOut } from 'store/actions/User';
import { setLoginBool } from 'store/actions/LoginBool';

import { listenerSocket, setSocket, socket } from 'components/Login/Auth';
import SignInModal from 'components/Login/SignInModal';
import { IconMessages } from './components/Toolbar/IconMessages';
import { IconNotifications } from './components/Toolbar/IconNotifications';
import { ToolbarButtonWithPopper } from './components/Toolbar/ToolbarButtonWithPopper';
import { MessageNotifications } from './components/Message/MessageNotifications';
import { NotificationsPopperContent } from './components/Notifications/NotificationsPopperContent';
import MusicAppIcon from './components/MusicAppIcon';
import MusicAppNavigation from './components/MusicAppNavigation';
import WhiteListModal from 'components/MusicDao/modals/WhiteListModal';
import NoAuthModal from 'components/Connect/modals/NoAuthModal';
import USDTGetModal from 'components/Connect/modals/USDTGetModal';
import NoMetamaskModal from 'components/Connect/modals/NoMetamaskModal';
import { useCookies } from 'react-cookie';
// import SignUpModal from "components/Connect/modals/SignUpModal";
import PostNoteModal from 'components/Connect/modals/PostNoteModal';

import { SecondaryButton } from '../Buttons';
import { injected } from 'shared/connectors';
import { useNotifications } from 'shared/contexts/NotificationsContext';
import URL from 'shared/functions/getURL';
import { CreateMusicWalletModal } from 'shared/ui-kit/Modal/Modals';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { useAuth } from 'shared/contexts/AuthContext';
import { useMessages } from 'shared/contexts/MessagesContext';
import { _signPayload } from 'shared/services/WalletSign';
import { usePageRefreshContext } from 'shared/contexts/PageRefreshContext';
import Box from 'shared/ui-kit/Box';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import * as API from 'shared/services/API/WalletAuthAPI';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { getMatchingUsers, IAutocompleteUsers } from 'shared/services/API';
// import getPhotoIPFS from "../../functions/getPhotoIPFS";

import { ReactComponent as FiberManualRecordIcon } from 'assets/icons/fiber_manual_record.svg';
import { headerStyles, useAutoCompleteStyles } from './Header.styles';
import { ContentType } from 'shared/constants/const';
import CreatePodModal from 'components/MusicDao/modals/CreateNewPodModal';
import CreateContentModal from 'components/MusicDao/modals/CreateContentModal';
import ConnectWalletModal from 'components/MusicDao/modals/ConnectWalletModal';
import CreateMutipleEditionsPod from 'components/MusicDao/modals/CreateMutipleEditionsPod';

const Header = ({ isOnMaintenance }) => {
  const classes = headerStyles();
  const autocompleteStyle = useAutoCompleteStyles();

  const pathName = window.location.href;
  const idUrl = pathName.split('/')[5]
    ? pathName.split('/')[5]
    : '' + localStorage.getItem('userId');

  const {
    isSignedin,
    setSignedin,
    accountStatus,
    updateAccountStatus
  } = useAuth();
  const history = useHistory();
  const dispatch = useDispatch();
  const userSelector = useSelector(getUser);

  const {
    unreadNotifications,
    notifications,
    dismissNotification,
    markAllNotificationsAsRead,
    removeNotification
  } = useNotifications();

  const { unreadMessages, markAllMessagesAsRead } = useMessages();
  const { showAlertMessage } = useAlertMessage();
  const { activate, account, library, active } = useWeb3React();
  const [isShowPostNote, setShowPostNote] = useState<boolean>(false);
  const [isShowUSDTGet, setShowUSDTGet] = useState<boolean>(false);
  const [isShowNoAuth, setShowNoAuth] = useState<boolean>(false);
  // const [isShowSignUp, setShowSignUp] = useState<boolean>(false);
  const [freeUSDTAmount, setFreeUSDTAmount] = useState<number>(0);
  const [noMetamask, setNoMetamask] = useState<boolean>(false);
  const [connectWallet, setConnectWallet] = useState<boolean>(false);

  const signData = useRef();

  const [userId, setUserId] = useState<string>('');
  const [ownUser, setOwnUser] = useState<boolean>(
    idUrl === localStorage.getItem('userId')
  );
  const [userProfile, setUserProfile] = useState<any>({});
  const [openSignInModal, setOpenSignInModal] = useState<boolean>(false);
  const [openNotificationModal, setOpenNotificationModal] = useState<boolean>(
    false
  );
  const [openMessagesModal, showMessagesModal] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<any>();
  const [openMusicWalletDialog, setOpenMusicWalletDialog] = useState<boolean>(
    false
  );
  const [numberMessages, setNumberMessages] = useState<number>(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [arrowEl, setArrowEl] = React.useState<null | HTMLElement>(null);
  const [hideNotificationsModal, setHideNotificationsModal] = useState<boolean>(
    false
  );
  const popperOpen = Boolean(anchorEl);
  const popperId = popperOpen ? 'spring-popper' : undefined;
  const [openMobileMenu, setOpenMobileMenu] = React.useState<boolean>(false);
  const anchorMobileMenuRef = React.useRef<HTMLDivElement>(null);
  const { ipfs, setMultiAddr } = useIPFS();
  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const { profileAvatarChanged } = usePageRefreshContext();
  const [autocompleteKey, setAutocompleteKey] = useState<number>(
    new Date().getTime()
  );

  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedValue] = useDebounce(searchValue, 500);
  const [autocompleteUsers, setAutocompleteUsers] = useState<
    IAutocompleteUsers[]
  >([]);

  const [isHideHeader, setIsHideHeader] = useState<boolean>(false);
  const [isTransparent, setIsTransparent] = useState<boolean>(false);


  const [appHeaderBackgroundColor, setAppHeaderBackgroundColor] =
    useState<string>('myx-app-header');


  const timerRef = useRef<any>();
  const activateAccountRef = useRef<boolean>(false);
  const [openCreateMusicModal, setOpenCreateMusicModal] = useState<boolean>(
    false
  );
  const [openCreatePodModal, setOpenCreatePodModal] = useState<boolean>(false);
  const [openCreateContent, setOpenCreateContent] = useState<boolean>(false);
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.SongSingleEdition
  );

  const [cookie, setCookie] = useCookies(['accessToken']);
  useEffect(() => {
    if (debouncedValue) {
      getMatchingUsers(searchValue, ['urlSlug', 'firstName', 'address']).then(
        async (resp) => {
          if (resp?.success) {
            const filteredUsers = resp.data.filter(
              (u) =>
                u.address &&
                u.address.toLowerCase() != userSelector.address.toLowerCase()
            );
            setAutocompleteUsers(filteredUsers);
          }
        }
      );
    } else {
      setAutocompleteUsers([]);
    }
  }, [debouncedValue]);

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  useEffect(() => {
    if (
      (account &&
        userSelector.address &&
        userSelector.address.toLowerCase() !== account.toLowerCase()) ||
      (!account && userSelector.address)
    ) {
      handleLogout();
      return;
    }
  }, [account, userSelector]);

  useEffect(() => {
    (window as any)?.ethereum?.on('accountsChanged', (accounts) => {
      if (isSignedin && !accounts.length) {
        handleLogout();
      }
    });
  }, []);

  useEffect(() => {
    if (account) {
      if (activateAccountRef.current) {
        onGetTrax();
        activateAccountRef.current = false;
      }
      axios
        .post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account,
          appName: 'Myx'
        })
        .then((res) => {
          if (res.data.success === true) {
            const data = res.data.data;
            updateAccountStatus(data.status);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [account]);

  const handleConnectMetamask = () => {
    if (active) {
      if (account) {
        onGetTrax();
      }
    } else {
      activate(injected, undefined, true)
        .then(() => {
          activateAccountRef.current = true;
          setConnectWallet(true);
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

  useEffect(() => {
    getPhotoUser();
  }, [ipfs, userSelector, profileAvatarChanged]);

  const getPhotoUser = async () => {
    if (userSelector.anon) {
      setImageIPFS(require(`assets/anonAvatars/${userSelector.anonAvatar}`));
    } else if (userSelector?.urlIpfsImage) {
      setImageIPFS(userSelector?.urlIpfsImage);
    }
  };

  const handleOpenMobileMenu = (event: React.MouseEvent<EventTarget>) => {
    event.stopPropagation();
    setOpenMobileMenu(true);
  };

  const handleCloseMobileMenu = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorMobileMenuRef.current &&
      anchorMobileMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpenMobileMenu(false);
  };

  const handleListKeyDownMobileMenu = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenMobileMenu(false);
    }
  };

  const handleCloseWalletDialog = () => {
    setOpenMusicWalletDialog(false);
  };
  const handleCreatePopup = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setSignedin(false);
    dispatch(signOut());
    localStorage.removeItem('userSlug');
    localStorage.removeItem('userId');
    Cookies.remove('accessToken');
    localStorage.removeItem('address');
    localStorage.removeItem('player_public_key_signature_v2');
    localStorage.removeItem('player_public_key');
    localStorage.removeItem('player_private_key');
    history.push('/');
    window.location.reload();
  };

  useEffect(() => {
    setUserId(userSelector.id);
    setOwnUser(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUrl, userSelector]);

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

  React.useEffect(() => {
    if (listenerSocket) {
      const successConnectHandler = (data) => {};

      listenerSocket.on('successConnectTest', successConnectHandler);

      return () => {
        listenerSocket.removeListener(
          'successConnectTest',
          successConnectHandler
        );
      };
    }
  }, [listenerSocket]);

  useEffect(() => {
    setNumberMessages(unreadMessages);
  }, [unreadMessages]);

  useEffect(() => {
    setIsHideHeader(true);
    setIsTransparent(false);
    setAppHeaderBackgroundColor('myx-app-header myx');
  }, []);

  const handleProfile = (e) => {
    handleCloseMobileMenu(e);
    history.push(`/profile/${userSelector.urlSlug}`);
    setAnchorEl(null);
  };

  const handleMessage = (e) => {
    handleCloseMobileMenu(e);
    history.push(`/${userSelector.urlSlug}/messages`);
  };

  const userSort = (a: any, b: any) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  };

  const handleOpenCreatingModal = (type) => {
    setOpenCreateContent(false);
    setContentType(type);
    switch (type) {
      case ContentType.PodInvestment:
      case ContentType.PodCollaborative:
        setOpenCreatePodModal(true);
        break;
      case ContentType.SongSingleEdition:
      case ContentType.SongMultiEdition:
        setOpenCreateMusicModal(true);
        break;
    }
  };

  return (
    <div
      className={classes.header}
      style={{
        background: 'rgba(24, 24, 24, 0.04)',
        border: 'none'
      }}
    >
      <div
        className={
          isTransparent
            ? 'transparent'
            : isHideHeader
            ? appHeaderBackgroundColor
            : ''
        }
        style={{
          height: '80px'
        }}
      >
        <div className="header-left">
          <MusicAppIcon isTransparent={isTransparent} />
          <Hidden smDown>
            <MusicAppNavigation />
          </Hidden>
        </div>
        <div className="header-right">
          {openMusicWalletDialog && (
            <CreateMusicWalletModal
              open={openMusicWalletDialog}
              handleClose={handleCloseWalletDialog}
              handleOk={() => {
                setOpenMusicWalletDialog(false);
                history.push('/create-wallet');
              }}
            />
          )}
          {isSignedin ? (
            <>
              <Hidden mdDown>
                <div className="header-icons">
                  <Autocomplete
                    clearOnBlur
                    id="autocomplete-share-media"
                    freeSolo
                    classes={autocompleteStyle}
                    key={autocompleteKey}
                    onChange={(event: any, user: any | null) => {
                      if (user && typeof user !== 'string') {
                        setSearchValue('');
                        setAutocompleteKey(new Date().getTime());
                      }
                    }}
                    options={autocompleteUsers}
                    renderOption={(option, { selected }) => (
                      <div
                        className={classes.searchMenuItem}
                        onClick={() => {
                          history.push(`/profile/${option.urlSlug}`);
                        }}
                      >
                        <Box display="flex" alignItems="center">
                          <div
                            className={classes.userImage}
                            style={{
                              backgroundImage: `url("${
                                option.imageUrl ?? getDefaultAvatar()
                              }")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: 'contain',
                              backgroundPosition: 'center'
                            }}
                          />
                          <div className={classes.searchMenuItemName}>
                            {option.name}
                          </div>
                        </Box>
                        <div>
                          <RightArrowIcon />
                        </div>
                      </div>
                    )}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <InputBase
                        value={searchValue}
                        onChange={(event) => {
                          setSearchValue(event.target.value);
                        }}
                        ref={params.InputProps.ref}
                        inputProps={params.inputProps}
                        style={{ width: '100%' }}
                        autoFocus
                        placeholder="Search user"
                        endAdornment={
                          <InputAdornment position="end">
                            <svg
                              width="29"
                              height="29"
                              viewBox="0 0 29 29"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M23.1612 24.3928C23.621 24.8526 24.3666 24.8526 24.8264 24.3928C25.2862 23.933 25.2862 23.1874 24.8264 22.7276L23.1612 24.3928ZM20.4613 12.3741C20.4613 16.6011 17.0347 20.0277 12.8077 20.0277V22.3827C18.3353 22.3827 22.8163 17.9017 22.8163 12.3741H20.4613ZM12.8077 20.0277C8.5807 20.0277 5.15405 16.6011 5.15405 12.3741H2.79908C2.79908 17.9017 7.28009 22.3827 12.8077 22.3827V20.0277ZM5.15405 12.3741C5.15405 8.1471 8.5807 4.72045 12.8077 4.72045V2.36549C7.28009 2.36549 2.79908 6.84649 2.79908 12.3741H5.15405ZM12.8077 4.72045C17.0347 4.72045 20.4613 8.1471 20.4613 12.3741H22.8163C22.8163 6.84649 18.3353 2.36549 12.8077 2.36549V4.72045ZM24.8264 22.7276L19.8956 17.7968L18.2304 19.462L23.1612 24.3928L24.8264 22.7276Z"
                                fill="#707582"
                              />
                            </svg>
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                  <div className={classes.divider} />
                </div>
              </Hidden>
              {
                <ToolbarButtonWithPopper
                  theme={isTransparent ? 'dark' : 'light'}
                  tooltip="Messages"
                  icon={IconMessages}
                  onIconClick={markAllMessagesAsRead}
                  badge={
                    numberMessages > 0 ? numberMessages.toString() : undefined
                  }
                  openToolbar={openMessagesModal}
                  handleOpenToolbar={showMessagesModal}
                >
                  <MessageNotifications
                    handleClosePopper={() => showMessagesModal(false)}
                  />
                </ToolbarButtonWithPopper>
              }
              {
                <ToolbarButtonWithPopper
                  theme={isTransparent ? 'dark' : 'light'}
                  tooltip="Notifications"
                  icon={IconNotifications}
                  badge={
                    unreadNotifications > 0
                      ? unreadNotifications.toString()
                      : undefined
                  }
                  onIconClick={markAllNotificationsAsRead}
                  openToolbar={openNotificationModal}
                  handleOpenToolbar={setOpenNotificationModal}
                  // hidden={hideNotificationsModal}
                >
                  <NotificationsPopperContent
                    theme={isTransparent ? 'dark' : 'light'}
                    notifications={notifications}
                    onDismissNotification={dismissNotification}
                    removeNotification={removeNotification}
                    onRefreshAllProfile={() => null}
                    viewMore={() => {}}
                    setSelectedNotification={setSelectedNotification}
                    handleShowContributionModal={() => {}}
                    handleClosePopper={() => {
                      setOpenNotificationModal(false);
                      setHideNotificationsModal(false);
                    }}
                    handleHidePopper={() => {
                      setHideNotificationsModal(true);
                    }}
                  />
                </ToolbarButtonWithPopper>
              }
              <Hidden mdDown>
                {account && (
                  <Hidden smDown>
                    <SecondaryButton
                      size="medium"
                      className={classes.accountInfo}
                    >
                      <span>
                        <FiberManualRecordIcon />
                      </span>
                      <label>
                        {account.slice(0, 7)}...
                        {account.slice(account.length - 7)}
                      </label>
                    </SecondaryButton>
                  </Hidden>
                )}
                <div className="avatar-container">
                  <div
                    id="header-popup-wallet"
                    aria-describedby={popperId}
                    onClick={handleCreatePopup}
                    className="avatar"
                    style={{
                      // backgroundImage: `url("${
                      //   imageIPFS || getDefaultAvatar()
                      // }")`,
                      cursor: ownUser ? 'pointer' : 'auto',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <img src={imageIPFS || getDefaultAvatar()} alt="avatar" />
                  </div>
                </div>
              </Hidden>

              {
                <Hidden lgUp>
                  <div
                    ref={anchorMobileMenuRef}
                    onClick={handleOpenMobileMenu}
                    style={{ marginLeft: 6, marginTop: 4, marginRight: 8 }}
                  >
                    <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                      <path
                        d="M1 1H17M1 6H17M1 11H17"
                        stroke={'white'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <Popper
                    open={openMobileMenu}
                    anchorEl={anchorMobileMenuRef.current}
                    transition
                    disablePortal={false}
                    placement="bottom"
                    style={{ position: 'inherit', zIndex: 9999 }}
                  >
                    {({ TransitionProps }) => (
                      <Grow {...TransitionProps}>
                        <Paper className={classes.mobilePopup}>
                          <ClickAwayListener
                            onClickAway={handleCloseMobileMenu}
                          >
                            <MenuList
                              autoFocusItem={openMobileMenu}
                              id="header-right-menu-list-grow"
                              onKeyDown={handleListKeyDownMobileMenu}
                            >
                              <MenuItem onClick={handleProfile}>
                                <div className="avatar-container">
                                  <div
                                    className="avatar"
                                    style={{
                                      backgroundImage: `url("${
                                        imageIPFS || getDefaultAvatar()
                                      }")`,
                                      cursor: ownUser ? 'pointer' : 'auto',
                                      backgroundRepeat: 'no-repeat',
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center',
                                      color: 'rgb(101, 203, 99)'
                                    }}
                                  />
                                </div>
                                My Profile
                              </MenuItem>
                              <Hidden mdUp>
                                {MusicDaoNavigator.map((nav, index) => (
                                  <MenuItem
                                    key={`nav-button-${index}`}
                                    onClick={() => {
                                      history.push(nav.link);
                                      setOpenMobileMenu(false);
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        color: 'rgb(101, 203, 99)',
                                        border: '1px solid rgb(101, 203, 99)',
                                        borderRadius: '100vh',
                                        width: 150,
                                        height: 40,
                                        padding: '4px 10px'
                                      }}
                                    >
                                      <div>{nav.name}</div>
                                      {index === 0 && (
                                        <img
                                          src={require('assets/logos/MYX_logo_3.svg')}
                                          alt="music"
                                          width={40}
                                        />
                                      )}
                                    </div>
                                  </MenuItem>
                                ))}
                              </Hidden>
                              <MenuItem
                                onClick={() => {
                                  if (!isOnMaintenance)
                                    setOpenCreateContent(true);
                                }}
                                style={isOnMaintenance ? { color: 'grey' } : {}}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: '#fff',
                                    background: '#000',
                                    borderRadius: '100vh',
                                    width: 150,
                                    height: 40,
                                    padding: '4px 10px'
                                  }}
                                >
                                  Create
                                  {/* {accountStatus === "nolist" ? "Create" : "Upload"} */}
                                </div>
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  handleLogout();
                                  setAnchorEl(null);
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: '#fff',
                                    background: '#000',
                                    borderRadius: '100vh',
                                    width: 150,
                                    height: 40,
                                    padding: '4px 10px'
                                  }}
                                >
                                  Log Out
                                </div>
                              </MenuItem>
                              {/* <MenuItem onClick={handleLogout}>
                                <img
                                  src={require("assets/icons/logout.webp")}
                                  alt="logout"
                                  style={{ width: "24px", height: "27px", marginRight: "8px" }}
                                />
                                Log Out
                              </MenuItem> */}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </Hidden>
              }
            </>
          ) : (
            <SecondaryButton
              size="medium"
              className={classes.accountInfo}
              onClick={handleConnectWallet}
              disabled={isOnMaintenance}
            >
              Connect Wallet
            </SecondaryButton>
          )}
        </div>
        {openSignInModal && (
          <SignInModal
            open={openSignInModal}
            handleClose={() => setOpenSignInModal(false)}
          />
        )}
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
          <span className={classes.header_popup_arrow} ref={setArrowEl} />
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
              {accountStatus && (
                <div
                  className={classes.header_popup_back_item}
                  onClick={() => {
                    if (!isOnMaintenance) setOpenCreateContent(true);
                  }}
                  style={isOnMaintenance ? { color: 'grey' } : {}}
                >
                  Create
                  {/* {accountStatus === "nolist" ? "Create" : "Upload"} */}
                </div>
              )}
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
      </div>
      {isShowNoAuth && (
        <NoAuthModal
          open={isShowNoAuth}
          onClose={() => {
            setShowNoAuth(false);
            handleSignIn();
          }}
        />
      )}
      {isShowUSDTGet && (
        <USDTGetModal
          open={isShowUSDTGet}
          onClose={() => {
            setShowUSDTGet(false);
            handleSignIn();
          }}
          amount={freeUSDTAmount}
          account={account ?? ''}
        />
      )}
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
      {/* {isShowSignUp && (
        <SignUpModal open={isShowSignUp} onClose={() => setShowSignUp(false)} onSignUp={onSignUp} />
      )} */}

      {openCreateMusicModal &&
        (accountStatus !== 'authorized' ? (
          <WhiteListModal
            open={openCreateMusicModal}
            handleClose={() => setOpenCreateMusicModal(false)}
          />
        ) : (
          <CreateMutipleEditionsPod
            onClose={() => setOpenCreateMusicModal(false)}
            handleRefresh={() => {}}
            open={openCreateMusicModal}
            type={contentType}
          />
        ))}
      {openCreatePodModal &&
        (accountStatus !== 'authorized' ? (
          <WhiteListModal
            open={openCreatePodModal}
            handleClose={() => setOpenCreatePodModal(false)}
          />
        ) : (
          <CreatePodModal
            onClose={() => {
              setOpenCreatePodModal(false);
            }}
            type={contentType}
            handleRefresh={() => {}}
            open={openCreatePodModal}
          />
        ))}
      {openCreateContent &&
        (accountStatus !== 'authorized' ? (
          <WhiteListModal
            open={openCreateContent}
            handleClose={() => setOpenCreateContent(false)}
          />
        ) : (
          <CreateContentModal
            handleClose={() => setOpenCreateContent(false)}
            onClickeContentCreation={(type) => {
              handleOpenCreatingModal(type);
            }}
            open={openCreateContent}
          />
        ))}
    </div>
  );
};

export default Header;

const MusicDaoNavigator = [
  // { name: "Home", link: "/" },
  // { name: "Free Music", link: "" },
  // { name: "Liquidity", link: "/liquidity" },
  // { name: "High Yield", link: "/high-yield" },
  // { name: "Trade TRAX", link: "" },
  // { name: "Claimable Music", link: "/claimable-music" },
  // { name: "Staking", link: "/staking" },
  // { name: "Governance", link: "/governance" },
  // { name: "Pods", link: "/capsules" },
  // { name: "Potions", link: "/potions" },
  { name: 'Home', value: 'home', link: '/' },
  { name: 'Music', value: 'music', link: '/music' },
  // { name: 'Merch', value: 'merch', link: '/merch' },
  { name: 'Myx Artists', value: 'artists', link: '/artists' },
  // { name: 'Marketplace', value: 'marketplace', link: '/marketplace' },
  { name: 'Capsules', value: 'capsules', link: '/capsules' }
];

export const DetailIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="6.5"
      y="0.625"
      width="6"
      height="6"
      rx="1"
      transform="rotate(90 6.5 0.625)"
      fill="#fff"
    />
    <rect
      x="6.5"
      y="7.625"
      width="6"
      height="6"
      rx="1"
      transform="rotate(90 6.5 7.625)"
      fill="#fff"
    />
    <rect
      x="13.5"
      y="0.625"
      width="6"
      height="6"
      rx="1"
      transform="rotate(90 13.5 0.625)"
      fill="#fff"
    />
    <rect
      x="13.5"
      y="7.625"
      width="6"
      height="6"
      rx="1"
      transform="rotate(90 13.5 7.625)"
      fill="#fff"
    />
  </svg>
);

export const DownArrowIcon = ({ color = 'white' }) => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.86914 5.77441C4.95508 5.77441 5.03613 5.75879 5.1123 5.72754C5.18848 5.69629 5.25586 5.64551 5.31445 5.5752L9.56836 1.22754C9.68555 1.11426 9.74414 0.977539 9.74414 0.817383C9.74414 0.708008 9.71777 0.608398 9.66504 0.518555C9.6123 0.428711 9.54199 0.357422 9.4541 0.304688C9.36621 0.251953 9.26562 0.225586 9.15234 0.225586C8.99219 0.225586 8.85156 0.28418 8.73047 0.401367L4.87162 4.35337L1.00781 0.401367C0.890625 0.28418 0.751953 0.225586 0.591797 0.225586C0.478516 0.225586 0.37793 0.251953 0.290039 0.304688C0.202148 0.357422 0.131836 0.428711 0.0791016 0.518555C0.0263672 0.608398 0 0.708008 0 0.817383C0 0.899414 0.015625 0.974609 0.046875 1.04297C0.078125 1.11133 0.121094 1.17285 0.175781 1.22754L4.42383 5.58105C4.55664 5.70996 4.70508 5.77441 4.86914 5.77441Z"
      fill={color}
    />
  </svg>
);

export const RightArrowIcon = () => (
  <svg
    width="6"
    height="10"
    viewBox="0 0 6 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 9L5 5L1 1"
      stroke="#0d5ae9"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
