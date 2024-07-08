import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import Web3 from 'web3';

import useTheme from '@material-ui/core/styles/useTheme';
import withStyles from '@material-ui/core/styles/withStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';

import { setLoginBool } from 'store/actions/LoginBool';
import { setUser } from 'store/actions/User';
import { useTypedSelector } from 'store/reducers/Reducer';
import { socket, setSocket } from 'components/Login/Auth';
import WaveForm from 'components/MusicDao/components/WaveForm';
import PostNoteModal from 'components/Connect/modals/PostNoteModal';
import NoMetamaskModal from 'components/Connect/modals/NoMetamaskModal';
import ConnectWalletModal from '../ConnectWalletModal';

import URL from 'shared/functions/getURL';
import * as API from 'shared/services/API/WalletAuthAPI';
import { fLoader, pLoader, getPlayerKey } from 'shared/functions/ipfs/hls';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import Avatar from 'shared/ui-kit/Avatar';
import { CloseIcon, ShareIcon } from 'shared/ui-kit/Icons';
import { useShareMedia } from 'shared/contexts/ShareMediaContext';
import {
  getDefaultAvatar,
  getDefaultBGImage
} from 'shared/services/user/getUserAvatar';
// import { FruitSelect } from 'shared/ui-kit/Select/FruitSelect';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import {
  musicDaoGetSongNFTDetail
  // musicDaoFruitSongNFT,
  // musicDaoGetSongNFTComments
} from 'shared/services/API';
import getPhotoIPFS from 'shared/functions/getPhotoIPFS';
import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';
import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';
import { useAuth } from 'shared/contexts/AuthContext';
import { processImage } from 'shared/helpers';
// import { LoadingWrapper } from 'shared/ui-kit/Hocs';
// import EmojiPane from 'shared/ui-kit/EmojiPane';

import { contentPreviewModalStyles } from './index.styles';
// import PlayMetaIcon from 'components/MusicDao/components/Icons/PlayMetaIcon';
// import ViewIcon from 'components/MusicDao/components/Icons/ViewMetaIcon';

const CustomMenuItem = withStyles({
  root: {
    fontSize: '14px'
  }
})(MenuItem);

const hlsPlayerOptions = {
  file: {
    forceAudio: true,
    forceHLS: true,
    hlsOptions: { fLoader, pLoader },
    attributes: { controlsList: 'nodownload' }
  }
};

const ContentPreviewModal = ({
  song,
  open,
  onClose,
  handleRefresh,
  onEdit,
  onMint,
  id
}: {
  song: any;
  open: boolean;
  onClose: () => void;
  handleRefresh?: () => void;
  id: string;
  onEdit?: () => void;
  onMint?: () => void;
}) => {
  const { showAlertMessage } = useAlertMessage();
  const classes = contentPreviewModalStyles();
  const history = useHistory();
  const { isSignedin, setSignedin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.between(600, 900));

  const user: any = useTypedSelector((state) => state.user);

  const playerAudio: any = React.useRef();
  const [selectedSong, setSelectedSong] = React.useState<any>();
  const [waveData, setWaveData] = React.useState<Uint8Array>();
  const [waveMetaData, setWaveMetaData] = React.useState<any>({});
  const [playerState, setPlayerState] = React.useState({
    url: null,
    pip: false,
    playing: false,
    validated: true,
    controls: false,
    light: false,
    volume: 100,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    volumeOpen: false,
    dropdownOpen: false,
    fullscreen: false,
    seeking: false,
    playedSeconds: 0
  });
  const { showPlayerKeyModal, playerKeyIsReady, setPlayerKeyIsReady } =
    useContext(MediaPlayerKeyContext);
  const [durationShow, setDurationShow] = useState<any>(0);
  const [isSongLoading, setIsSongLoading] = useState<boolean>(false);
  const [songDetailData, setSongDetailData] = useState<any>(null);
  const [refreshed, setRefreshed] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [songImageIPFS, setSongImageIPFS] = useState<any>();
  // const [podImageIPFS, setPodImageIPFS] = useState<any>(null);

  const [openShareMenu, setOpenShareMenu] = useState<boolean>(false);
  const anchorShareMenuRef = useRef<HTMLDivElement>(null);
  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();

  const { account, active, library } = useWeb3React();
  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();
  const key = getPlayerKey();
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
  const [storedToRecently, setStoredToRecently] = useState<boolean>(false);

  const [noMetamask, setNoMetamask] = useState<boolean>(false);
  const [connectWallet, setConnectWallet] = useState<boolean>(false);
  const [isShowPostNote, setShowPostNote] = useState<boolean>(false);

  const [showVolumnSlider, setShowVolumnSlider] = useState<boolean>(false);
  const [response, setResponse] = useState('');
  const [isResponding, setIsResponding] = useState<boolean>(false);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const commentsRef = useRef<any>();

  const dispatch = useDispatch();
  const signData = useRef();
  const timerRef = useRef<any>();

  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const emojiRef = useRef<any>();
  const inputRef = useRef<any>();

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);

    const getSongDetail = async () => {
      setIsSongLoading(true);
      const response = await musicDaoGetSongNFTDetail(id);
      if (response.success) {
        let scanNetworkName = '';
        if (response.data.Network === 'POLYGON')
          scanNetworkName = 'Polygonscan';
        else if (response.data.Network === 'ETHEREUM')
          scanNetworkName = 'Etherscan';
        else if (response.data.Network === 'BINANCE')
          scanNetworkName = 'BscScan';
        setSongDetailData({
          ...response.data,
          scanNetworkName: scanNetworkName
        });
      }
      setIsSongLoading(false);
    };
    getSongDetail();
  }, [id, refreshed, account]);

  useEffect(() => {
    if (commentsRef.current) {
      setTimeout(() => {
        commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
      }, 10);
    }
  }, [commentsRef.current]);

  useEffect(() => {
    if (
      song &&
      song.metadataMedia &&
      song.metadataMedia.newFileCID &&
      song.metadataMedia?.metadata?.properties?.name
    ) {
      setSelectedSong({
        url: `${getURLfromCID(song.metadataMedia.newFileCID)}/${
          song.metadataMedia.metadata.properties.name
        }`
      });
      localStorage.setItem('playlistCID', song.metadataMedia.newFileCID);
      if (song?.metadataMedia?.metadata?.properties?.wave_data_url) {
        getWaveData(song.metadataMedia.metadata.properties.wave_data_url);
      }
      if (song?.metadataMedia?.metadata?.properties?.duration) {
        const duration = song?.metadataMedia?.metadata?.properties?.duration;
        setDurationShow(duration);
      }
    }
  }, [song]);

  useEffect(() => {
    if (!key || !playerKeyIsReady) {
      setPlayerKeyIsReady(false);
      showPlayerKeyModal();
    }
  });

  const getWaveData = async (url) => {
    // headers: {Authorization: `Bearer ${token}`}
    const axiosArrayBuffer = (
      await axios.get(url, { responseType: 'arraybuffer' })
    ).data;
    const axiosArray = new Uint8Array(axiosArrayBuffer);
    setWaveData(axiosArray);
  };

  useEffect(() => {
    if (ipfs && Object.keys(ipfs).length !== 0 && songDetailData) {
      setIsOwner(
        songDetailData?.ownerAddress?.toLowerCase() === account?.toLowerCase()
      );
      getNFTImage(songDetailData);
    }
    if (
      songDetailData &&
      songDetailData.podInfo &&
      songDetailData.podInfo.InfoImage &&
      ipfs
    ) {
      getPodImageIPFS(
        songDetailData.podInfo.InfoImage.newFileCID,
        songDetailData.podInfo.InfoImage.metadata.properties.name
      );
    }
  }, [songDetailData, ipfs, isOwner]);

  const getNFTImage = async (data: any) => {
    if (
      data?.metadataPhoto?.newFileCID &&
      data?.metadataPhoto?.metadata?.properties?.name
    ) {
      let imageUrl = await getPhotoIPFS(
        data.metadataPhoto.newFileCID,
        data.metadataPhoto.metadata.properties.name,
        downloadWithNonDecryption
      );
      setSongImageIPFS(imageUrl);
    } else {
      setSongImageIPFS(getDefaultBGImage());
    }
  };

  const getPodImageIPFS = async (cid: string, fileName: string) => {
    // if (cid && fileName) {
    //   let imageUrl = await getPhotoIPFS(cid, fileName, downloadWithNonDecryption);
    //   setPodImageIPFS(imageUrl);
    // } else {
    //   setPodImageIPFS(getDefaultBGImage());
    // }
  };

  const showShareMenu = () => {
    setOpenShareMenu(true);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorShareMenuRef.current &&
      anchorShareMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenShareMenu(false);
  };

  const handleListKeyDownShareMenu = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  };

  const handleOpenQRCodeModal = () => {
    setOpenShareMenu(false);
    const link = `${window.location.origin}/#/music/track/${id}`;
    shareMediaWithQrCode(songDetailData.nftAddress, link, 'Media', 'MYX-SONGS');
  };

  const handleOpenShareModal = () => {
    setOpenShareMenu(false);
    const link = `${window.location.origin}/#/music/track/${id}`;
    shareMediaToSocial(songDetailData.nftAddress, 'Track', 'MYX-SONGS', link);
  };

  // const handleFruit = (type) => {
  //   if (
  //     songDetailData.fruits
  //       ?.filter((f) => f.fruitId === type)
  //       ?.find((f) => f.userId === user.id)
  //   ) {
  //     showAlertMessage('You had already given this fruit.', {
  //       variant: 'info'
  //     });
  //     return;
  //   }

  //   musicDaoFruitSongNFT(user.id, id, type).then((res) => {
  //     if (res.success) {
  //       const itemCopy = { ...songDetailData };
  //       itemCopy.fruits = [
  //         ...(itemCopy.fruits || []),
  //         { userId: user.id, fruitId: type, date: new Date().getTime() }
  //       ];
  //       setSongDetailData(itemCopy);
  //     }
  //   });
  // };

  const onEditDraft = () => {
    onEdit && onEdit();
  };

  const onMintNFT = () => {
    onMint && onMint();
  };

  const ownerAddress = useMemo(() => {
    const podAddress =
      songDetailData?.isPod === true && songDetailData?.podInfo
        ? songDetailData?.podInfo?.PodAddress ?? songDetailData?.podInfo?.id
        : '';
    return podAddress
      ? `${podAddress.substr(0, 6)}......${podAddress.substr(-6)}`
      : songDetailData?.ownerAddress
      ? `${songDetailData?.ownerAddress.substr(
          0,
          6
        )}......${songDetailData?.ownerAddress.substr(-6)}`
      : '';
  }, [songDetailData]);

  const avatarURL = useMemo(() => {
    if (songDetailData?.Artists) {
      const result: any[] = [];
      for (const f of songDetailData?.Artists.main) {
        if (f.imageUrl?.startsWith('/assets')) {
          const lastIndex = f.imageUrl.lastIndexOf('/');
          result.push(
            require(`assets/anonAvatars/${f.imageUrl.substr(lastIndex + 1)}`)
          );
        } else {
          result.push(f.imageUrl ?? getDefaultAvatar());
        }
      }
      for (const f of songDetailData?.Artists.featured) {
        if (f.imageUrl?.startsWith('/assets')) {
          const lastIndex = f.imageUrl.lastIndexOf('/');
          result.push(
            require(`assets/anonAvatars/${f.imageUrl.substr(lastIndex + 1)}`)
          );
        } else {
          result.push(f.imageUrl ?? getDefaultAvatar());
        }
      }

      return result;
    }
    if (songDetailData?.isPod === true && songDetailData?.podInfo) {
      const collabs = songDetailData.podInfo?.Collabs?.filter((u) =>
        u.name ? true : false
      );
      const result: any[] = [];
      for (const f of collabs) {
        if (f.imageUrl?.startsWith('/assets')) {
          const lastIndex = f.imageUrl.lastIndexOf('/');
          result.push(
            require(`assets/anonAvatars/${f.imageUrl.substr(lastIndex + 1)}`)
          );
        } else {
          result.push(f.imageUrl ?? getDefaultAvatar());
        }
      }

      return result;
    }
    return [
      songDetailData?.owner?.avatar ??
        songDetailData?.creator?.avatar ??
        getDefaultAvatar()
    ];
  }, [songDetailData /*, podImageIPFS */]);

  const creatorName = useMemo(() => {
    if (songDetailData?.Artists) {
      let result = songDetailData?.Artists.main[0]
        ? songDetailData?.Artists.main[0].name
        : '';
      if (songDetailData?.Artists.featured?.length) {
        result = result ? result + ' ft ' : '';
        songDetailData?.Artists.featured.map((v, i) => {
          if (i < songDetailData?.Artists.featured.length - 1)
            result += v.name + ', ';
          else {
            result += v.name;
          }
        });
      }

      if (result) return result;
    }
    if (songDetailData?.isPod === true && songDetailData?.podInfo) {
      const collabs = songDetailData.podInfo?.Collabs?.filter((u) =>
        u.name ? true : false
      );
      return collabs.map(
        (v, i) =>
          `${v.name}${
            i === 0 && collabs.length > 1
              ? ' ft '
              : i === collabs.length - 1
              ? ''
              : ', '
          }`
      );
    } else {
      const name = songDetailData?.creator?.name ?? '';
      return name.length > 17
        ? name.substr(0, 13) + '...' + name.substr(name.length - 3, 3)
        : name;
    }
  }, [songDetailData]);

  const handleConnectWallet = () => {
    if (active) {
      if (account) {
        onGetTrax();
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
    }
  };

  const handleSeek = (seconds) => {
    if (playerAudio?.current) {
      playerAudio.current.seekTo(seconds);
      setPlayerState({ ...playerState, playedSeconds: seconds });
    }
  };

  const handleProgress = (stateIn) => {
    if (!playerState.seeking) {
      setPlayerState({ ...playerState, ...stateIn });
    }
  };

  const handleDuration = (duration) => {
    setDurationShow(duration);
    setSelectedSong({ ...selectedSong, duration });
    setWaveMetaData({ trackDuration: duration * 1000 });
  };

  const handlePlay = () => {
    if (selectedSong && selectedSong.url) {
      setPlayerState({ ...playerState, playing: !playerState.playing });
      // if (playerState) {
      //   setIsFeed(true);
      // }
      if (!storedToRecently) {
        axios
          .post(`${URL()}/musicDao/song/updateRecentlySongAndListeningCount`, {
            data: {
              songId: songDetailData.Id,
              userId: user.id,
              isPublic: songDetailData.isPublic
            }
          })
          .then((res) => {
            if (res.data.success) {
              setStoredToRecently(true);
            }
          });
      }
    }
  };

  const handleSeekChange = (_, v) => {
    setPlayerState({ ...playerState, seeking: true, played: Number(v) });
  };

  const handleSeekMouseUp = (_, v) => {
    setPlayerState({ ...playerState, seeking: false });

    if (playerAudio?.current) {
      playerAudio.current.seekTo(parseFloat(v));
    }
  };

  const volumeChanged = (event: any, newValue: number | number[]) => {
    setPlayerState({ ...playerState, volume: newValue as number });
  };

  const makeResponse = () => {
    if (response && !isResponding) {
      setIsResponding(true);
      let body = {
        songId: songDetailData.Id,
        response: response
      };
      axios
        .post(`${URL()}/musicDao/song/makeResponse`, body)
        .then((response) => {
          if (response.data.success) {
            if (response.data.success) {
              let responses: any[] = [...response.data.data];
              setSongDetailData((prev) => ({
                ...prev,
                commentCount: (prev.commentCount || 0) + 1,
                comments: responses.reverse()
              }));
              setResponse('');
            }
          }
        })
        .finally(() => setIsResponding(false));
    }
  };

  // const handleScroll = React.useCallback(
  //   async (e) => {
  //     if (commentsLoading || !hasMore) return;
  //     if (e.target.scrollTop === 0) {
  //       setCommentsLoading(true);
  //       const lastMsgID =
  //         songDetailData?.comments?.length > 0
  //           ? songDetailData.comments[0].date
  //           : null;
  //       musicDaoGetSongNFTComments(songDetailData?.Id, lastMsgID)
  //         .then((res) => {
  //           if (res.success) {
  //             setSongDetailData((prev) => ({
  //               ...prev,
  //               comments: [...res.data.reverse(), ...prev.comments]
  //             }));
  //             setHasMore(res.data.length === 10);
  //             if (lastMsgID) {
  //               const el = document.getElementById(lastMsgID);
  //               const itemList = document.getElementById('commentContainer');
  //               if (commentsRef && commentsRef.current && el && itemList) {
  //                 commentsRef.current.scrollTop = Math.max(
  //                   0,
  //                   el.getBoundingClientRect().y -
  //                     itemList.getBoundingClientRect().y -
  //                     90
  //                 );
  //               }
  //             }
  //           }
  //         })
  //         .finally(() => setCommentsLoading(false));
  //     }
  //   },
  //   [songDetailData, hasMore, commentsLoading, commentsRef]
  // );

  // const handleKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //     makeResponse();
  //   }
  // };

  // const toggleEmojiPicker = () => {
  //   if (isResponding) return;
  //   setShowEmoji(!showEmoji);
  // };

  // const addEmoji = (e, emojiObject) => {
  //   let emoji = emojiObject.emoji;
  //   setResponse((prev) => prev + emoji);
  //   setShowEmoji(false);
  //   setTimeout(() => {
  //     inputRef.current?.focus();
  //   }, 100);
  // };

  return (
    <>
      <Modal
        size="medium"
        isOpen={open}
        onClose={onClose}
        className={classes.root}
      >
        {isSongLoading ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <CircularProgress style={{ color: '#A0D800' }} />
          </div>
        ) : (
          <>
            <Box className={classes.close} onClick={() => onClose()}>
              <CloseIcon />
            </Box>
            <Box className={classes.mainContent}>
              <div className={classes.nftInfoSection}>
                <Box display="flex" flexDirection="column">
                  <Box
                    display="flex"
                    flexDirection={isMobile ? 'column' : 'row'}
                    alignItems={isMobile ? 'start' : 'center'}
                    justifyContent={'space-between'}
                  >
                    <div className={classes.viewLabel}>
                      Draft of TRACK preview
                    </div>
                    <Box className={classes.tag} mt={isMobile ? 0.5 : 0}>
                      {songDetailData?.Genre}
                    </Box>
                  </Box>
                  <Box className={classes.nftContent}>
                    <Box
                      className={classes.creatorinfoSection}
                      justifyContent="space-between"
                    >
                      <Box display="flex" alignItems="center">
                        <Box display="flex">
                          {avatarURL.map((a, i) => (
                            <Avatar
                              key={`avatar_${i}`}
                              size={42}
                              rounded
                              image={processImage(a)}
                              onClick={() => {
                                if (
                                  songDetailData.isPod &&
                                  songDetailData?.podInfo
                                ) {
                                  history.push(
                                    `/capsules/${songDetailData.podInfo.Id}`
                                  );
                                } else if (songDetailData.creator?.urlSlug) {
                                  history.push(
                                    `/profile/${songDetailData.creator?.urlSlug}`
                                  );
                                }
                              }}
                              style={{ marginLeft: i > 0 ? -12 : 0 }}
                            />
                          ))}
                        </Box>
                        <Box display="flex" flexDirection="column" mx={1}>
                          <Box
                            className={classes.typo1}
                            mb={0.5}
                            onClick={() => {
                              if (
                                songDetailData.isPod &&
                                songDetailData?.podInfo
                              ) {
                                history.push(
                                  `/capsules/${songDetailData.podInfo.Id}`
                                );
                              } else if (songDetailData.creator?.urlSlug) {
                                history.push(
                                  `/profile/${songDetailData.creator?.urlSlug}`
                                );
                              }
                            }}
                          >
                            {creatorName}
                          </Box>
                          <CopyToClipboard
                            text={
                              songDetailData?.podInfo?.PodAddress ??
                              songDetailData?.ownerAddress ??
                              ''
                            }
                            onCopy={() => {
                              showAlertMessage('Copied to clipboard', {
                                variant: 'success'
                              });
                            }}
                          >
                            <Box display="flex" alignItems="center">
                              <Box className={classes.typo1} mr={1}>
                                {ownerAddress}
                              </Box>
                              <CopyIcon />
                            </Box>
                          </CopyToClipboard>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center">
                        {/* {songDetailData && isSignedin && (
                          <FruitSelect
                            fruitObject={songDetailData}
                            fruitWidth={22}
                            fruitHeight={22}
                            style={{ background: '#65CB63' }}
                            onGiveFruit={handleFruit}
                          />
                        )} */}
                        <div
                          className={classes.shareButton}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: 8
                          }}
                          ref={anchorShareMenuRef}
                          onClick={showShareMenu}
                        >
                          <ShareIcon />
                        </div>
                        {openShareMenu && (
                          <Popper
                            open={openShareMenu}
                            anchorEl={anchorShareMenuRef.current}
                            transition
                            disablePortal={false}
                            style={{ position: 'inherit', zIndex: 1400 }}
                            placement="bottom"
                          >
                            {({ TransitionProps, placement }) => (
                              <Grow
                                {...TransitionProps}
                                style={{
                                  position: 'inherit'
                                }}
                              >
                                <Paper className={classes.paper}>
                                  <ClickAwayListener
                                    onClickAway={handleCloseShareMenu}
                                  >
                                    <MenuList
                                      autoFocusItem={openShareMenu}
                                      id="menu-list-grow"
                                      onKeyDown={handleListKeyDownShareMenu}
                                    >
                                      <CustomMenuItem
                                        onClick={handleOpenShareModal}
                                      >
                                        <img
                                          src={require('assets/icons/butterfly.webp')}
                                          alt={'spaceship'}
                                          style={{
                                            width: 20,
                                            height: 20,
                                            marginRight: 5
                                          }}
                                        />
                                        Share on social media
                                      </CustomMenuItem>
                                      <CustomMenuItem
                                        onClick={handleOpenQRCodeModal}
                                      >
                                        <img
                                          src={require('assets/icons/qrcode_small.webp')}
                                          alt={'spaceship'}
                                          style={{
                                            width: 20,
                                            height: 20,
                                            marginRight: 5
                                          }}
                                        />
                                        Share With QR Code
                                      </CustomMenuItem>
                                    </MenuList>
                                  </ClickAwayListener>
                                </Paper>
                              </Grow>
                            )}
                          </Popper>
                        )}
                      </Box>
                    </Box>
                    <Box className={classes.typo2} mt={5.625}>
                      {songDetailData?.Title || ''}
                    </Box>
                    <Box className={classes.typo5} mt={5.625}>
                      Description
                    </Box>
                    <Box className={classes.typo3} mt={1.25} mb={4}>
                      {songDetailData?.Description || ''}
                    </Box>
                    {isSignedin &&
                      isOwner &&
                      (song.isPod === false || !song.podInfo) && (
                        <>
                          <PrimaryButton
                            size="medium"
                            className={`${classes.button} ${classes.editButton}`}
                            onClick={onEditDraft}
                          >
                            Edit Draft
                          </PrimaryButton>
                          {/* <div
                          style={{ position: 'relative', marginTop: '24px' }}
                        >
                          <PrimaryButton
                            size="medium"
                            className={`${classes.button}`}
                            style={{ width: '100%' }}
                            onClick={onMintNFT}
                          >
                            Mint NFT
                          </PrimaryButton>
                        </div> */}
                        </>
                      )}
                  </Box>
                </Box>
                {/* <Box mt={1}>
                <Box className={classes.divider} />
                <Box
                  display="flex"
                  alignItems="center"
                  mt={2}
                  mb={2}
                  justifyContent="space-between"
                  width="100%"
                >
                  <Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.meta}
                    >
                      <ViewIcon />
                      <span>Views</span>
                    </Box>
                    <div className={classes.viewMeta}>
                      {songDetailData?.viewCount ?? 'N/A'}
                    </div>
                  </Box>
                  <div className={classes.verticalDivider} />
                  <Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.meta}
                    >
                      <PlayMetaIcon />
                      <span>Plays</span>
                    </Box>
                    <div className={classes.playMeta}>
                      {songDetailData?.listenedCount ?? 'N/A'}
                    </div>
                  </Box>
                </Box>
              </Box>
              <Box position="relative" flex={1}>
                {songDetailData?.commentCount > 0 && (
                  <>
                    <Box className={classes.divider} />
                    <Box className={classes.commentBox}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                      >
                        <Box className={classes.commentTitle}>
                          {songDetailData.commentCount || 0} Comments
                        </Box>
                        <Box
                          className={classes.viewAllComment}
                          onClick={() => {
                            if (commentsRef.current)
                              commentsRef.current.scrollTop = 0;
                          }}
                        >
                          Scroll Up
                        </Box>
                      </Box>
                      <div
                        style={{
                          maxHeight: '210px',
                          overflow: 'auto',
                          flex: 1
                        }}
                        id="commentContainer"
                        onScroll={handleScroll}
                        ref={commentsRef}
                      >
                        {commentsLoading && <LoadingWrapper loading />}
                        {songDetailData.comments.map((response, i) => (
                          <Box
                            display="flex"
                            key={`response_${i}`}
                            mb={1}
                            id={response.date}
                          >
                            <Avatar
                              size={32}
                              rounded
                              image={response.imageUrl ?? getDefaultAvatar()}
                              onClick={() => {
                                history.push(`/profile/${response.urlSlug}`);
                              }}
                            />
                            <Box className={classes.response} ml={2} mt={0.5}>
                              {response.response}
                            </Box>
                          </Box>
                        ))}
                      </div>
                    </Box>
                  </>
                )}
                {isSignedin && (
                  <Box className={classes.inputBox}>
                    <Box className={classes.divider} my={1} />
                    <Box className={classes.inputResponseWallPost}>
                      <Avatar size={32} rounded image={user.urlIpfsImage} />
                      <input
                        value={response}
                        placeholder="Write a message..."
                        onChange={(e) => {
                          let res = e.target.value;
                          setResponse(res);
                        }}
                        onKeyDown={handleKeyDown}
                        type="text"
                        className={classes.input}
                        ref={inputRef}
                        disabled={isResponding}
                      />
                      <div
                        onClick={toggleEmojiPicker}
                        ref={emojiRef}
                        className={classes.emojiImg}
                      >
                        <SendImojiIcon />
                        {showEmoji && (
                          <EmojiPane
                            open={showEmoji}
                            anchorEl={emojiRef.current}
                            handleClose={() => setShowEmoji(false)}
                            addEmoji={addEmoji}
                          />
                        )}
                      </div>
                      <div
                        className={classes.sendImg}
                        onClick={makeResponse}
                        style={{ marginLeft: 8 }}
                      >
                        <SendIcon />
                      </div>
                    </Box>
                  </Box>
                )}
              </Box> */}
              </div>
              <div className={classes.nftPreviewSection}>
                <Box display="flex" justifyContent="center">
                  <img
                    src={songImageIPFS}
                    alt="song image"
                    className={classes.songImage}
                  />
                </Box>
                {isSignedin && playerKeyIsReady && selectedSong && (
                  <ReactPlayer
                    height={0}
                    width={0}
                    config={hlsPlayerOptions}
                    onContextMenu={(e) => e.preventDefault()}
                    url={selectedSong.url}
                    volume={playerState.volume / 100}
                    className="react-player"
                    ref={playerAudio}
                    playing={playerState.playing && playerState.validated}
                    onPause={() =>
                      setPlayerState({ ...playerState, playing: false })
                    }
                    onPlay={() =>
                      setPlayerState({ ...playerState, playing: true })
                    }
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onError={() => {
                      console.log(`Couldn’t decrypt the content`, {
                        variant: 'error'
                      });
                    }}
                  />
                )}
                {waveData && waveData?.length < 100 ? (
                  <Box pl={isMobile ? 0 : 15} pr={isMobile ? 0 : 11}>
                    {isSignedin && (
                      <Box className={classes.containerPlayer}>
                        <Box
                          display="flex"
                          alignItems="center"
                          width="100%"
                          mx={3}
                          justifyContent="space-between"
                        >
                          <Box
                            className={classes.playButtonForProgressLine}
                            onClick={handlePlay}
                          >
                            {playerState.playing ? (
                              <>
                                <PauseIcon color={'#fff'} />
                              </>
                            ) : (
                              <>
                                <PlayIcon color={'#fff'} />
                              </>
                            )}
                          </Box>
                          <Box
                            display="flex"
                            alignItems="center"
                            flexDirection="column"
                            width="100%"
                          >
                            <Box className={classes.playTimeForProgressLine}>
                              <span>
                                {playerState.playedSeconds
                                  ? `${Math.floor(
                                      (playerState.playedSeconds % 3600) / 60
                                    )}:${
                                      Math.floor(
                                        playerState.playedSeconds % 60
                                      ) < 10
                                        ? '0'
                                        : ''
                                    }${Math.floor(
                                      playerState.playedSeconds % 60
                                    ).toFixed(0)}`
                                  : '0:00'}
                              </span>
                              <span>
                                {selectedSong && durationShow
                                  ? `${Math.floor(
                                      (durationShow % 3600) / 60
                                    )}:${
                                      Math.floor(durationShow % 60) < 10
                                        ? '0'
                                        : ''
                                    }${Math.floor(durationShow % 60).toFixed(
                                      0
                                    )}`
                                  : '0:00'}
                              </span>
                            </Box>
                            <Box className={classes.slider}>
                              <PlayerSlider
                                defaultValue={0}
                                min={0}
                                max={0.999999}
                                step={0.0000001}
                                value={playerState.played}
                                onChange={handleSeekChange}
                                onChangeCommitted={handleSeekMouseUp}
                              />
                            </Box>
                          </Box>
                          <Box position="relative">
                            <img
                              src={require('assets/icons/volume.webp')}
                              alt="volume"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setShowVolumnSlider(!showVolumnSlider);
                              }}
                            />
                            {showVolumnSlider && (
                              <div
                                style={{
                                  height: 50,
                                  position: 'absolute',
                                  bottom: '36px',
                                  right: '-4px'
                                }}
                              >
                                <PlayerSlider
                                  orientation="vertical"
                                  value={playerState.volume}
                                  onChange={volumeChanged}
                                  aria-labelledby="continuous-slider"
                                />
                              </div>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <>
                    {!isMobile ? (
                      <>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mt={3}
                          mx={3}
                        >
                          <Box
                            className={classes.playButton}
                            onClick={
                              isSignedin ? handlePlay : handleConnectWallet
                            }
                          >
                            {playerState.playing ? (
                              <Box
                                style={{
                                  width: 32,
                                  height: 32,
                                  background: '#65CB63',
                                  borderRadius: '50%',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  display: 'flex'
                                }}
                              >
                                <PauseIcon color={'#fff'} />
                              </Box>
                            ) : (
                              <Box
                                style={{
                                  width: 32,
                                  height: 32,
                                  background: '#65CB63',
                                  borderRadius: '50%',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  display: 'flex'
                                }}
                              >
                                <PlayIcon color={'#fff'} />
                              </Box>
                            )}
                          </Box>
                          <Box className={classes.playTime}>
                            <span>
                              {playerState.playedSeconds
                                ? `${Math.floor(
                                    (playerState.playedSeconds % 3600) / 60
                                  )}:${
                                    Math.floor(playerState.playedSeconds % 60) <
                                    10
                                      ? '0'
                                      : ''
                                  }${Math.floor(
                                    playerState.playedSeconds % 60
                                  ).toFixed(0)}`
                                : '0:00'}
                            </span>
                            <span>&nbsp;/&nbsp;</span>
                            <span>
                              {selectedSong && durationShow
                                ? `${Math.floor((durationShow % 3600) / 60)}:${
                                    Math.floor(durationShow % 60) < 10
                                      ? '0'
                                      : ''
                                  }${Math.floor(durationShow % 60).toFixed(0)}`
                                : '0:00'}
                            </span>
                          </Box>
                          <Box position="relative">
                            <img
                              src={require('assets/icons/volume.webp')}
                              alt="volume"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setShowVolumnSlider(!showVolumnSlider);
                              }}
                            />
                            {showVolumnSlider && (
                              <div
                                style={{
                                  height: 50,
                                  position: 'absolute',
                                  bottom: '36px',
                                  right: '-4px'
                                }}
                              >
                                <PlayerSlider
                                  orientation="vertical"
                                  value={playerState.volume}
                                  onChange={volumeChanged}
                                  aria-labelledby="continuous-slider"
                                />
                              </div>
                            )}
                          </Box>
                        </Box>
                        <Box padding={isTablet ? '24px 8px' : 0}>
                          {!!waveData?.length && (
                            <WaveForm
                              waveformData={waveData}
                              waveformMeta={waveMetaData}
                              onSeek={handleSeek}
                              trackProgress={
                                (playerState.playedSeconds * 100) /
                                (selectedSong?.duration ?? 1)
                              }
                            />
                          )}
                        </Box>
                      </>
                    ) : (
                      <Box display="flex" flexDirection="column">
                        <Box
                          display="flex"
                          alignItems="center"
                          mt={3}
                          mx={3}
                          justifyContent="space-between"
                        >
                          <Box
                            className={classes.playButton}
                            onClick={
                              isSignedin ? handlePlay : handleConnectWallet
                            }
                          >
                            {playerState.playing ? (
                              <Box>
                                <PauseIcon color={'#fff'} />
                              </Box>
                            ) : (
                              <Box>
                                <PlayIcon color={'#fff'} />
                              </Box>
                            )}
                          </Box>
                          <Box className={classes.playTime}>
                            <span>
                              {playerState.playedSeconds
                                ? `${Math.floor(
                                    (playerState.playedSeconds % 3600) / 60
                                  )}:${
                                    Math.floor(playerState.playedSeconds % 60) <
                                    10
                                      ? '0'
                                      : ''
                                  }${Math.floor(
                                    playerState.playedSeconds % 60
                                  ).toFixed(0)}`
                                : '0:00'}
                            </span>
                            <span>&nbsp;/&nbsp;</span>
                            <span>
                              {selectedSong && durationShow
                                ? `${Math.floor((durationShow % 3600) / 60)}:${
                                    Math.floor(durationShow % 60) < 10
                                      ? '0'
                                      : ''
                                  }${Math.floor(durationShow % 60).toFixed(0)}`
                                : '0:00'}
                            </span>
                          </Box>
                          <Box position="relative">
                            <img
                              src={require('assets/icons/volume.webp')}
                              alt="volume"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setShowVolumnSlider(!showVolumnSlider);
                              }}
                            />
                            {showVolumnSlider && (
                              <div
                                style={{
                                  height: 50,
                                  position: 'absolute',
                                  bottom: '36px',
                                  right: '-4px'
                                }}
                              >
                                <PlayerSlider
                                  orientation="vertical"
                                  value={playerState.volume}
                                  onChange={volumeChanged}
                                  aria-labelledby="continuous-slider"
                                />
                              </div>
                            )}
                          </Box>
                        </Box>
                        <Box>
                          {!!waveData?.length && (
                            <WaveForm
                              waveformData={waveData}
                              waveformMeta={waveMetaData}
                              onSeek={handleSeek}
                              trackProgress={
                                (playerState.playedSeconds * 100) /
                                (selectedSong?.duration ?? 1)
                              }
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </>
                )}
              </div>
            </Box>
          </>
        )}
      </Modal>
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
          setConnected={(_: any) => {}}
        />
      )}
    </>
  );
};

export default ContentPreviewModal;

const PlayerSlider = withStyles({
  root: {
    width: '100%',
    flexGrow: 1,
    color: '#707582',
    height: 4,
    borderRadius: 2,
    padding: 0
  },
  thumb: {
    height: 4,
    width: 4,
    background: '#FFFFFF',
    border: 'none',
    margin: 0
  },
  track: {
    background: '#65CB63',
    height: 4,
    borderRadius: 3
  },
  rail: {
    background: '#707582',
    height: 4,
    borderRadius: 3
  }
})(Slider);

const PlayIcon = ({ color = '#fff' }) => (
  <svg
    width="13"
    height="16"
    viewBox="0 0 13 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.5241 0.937906C0.857828 0.527894 0 1.00724 0 1.78956V14.2104C0 14.9928 0.857827 15.4721 1.5241 15.0621L11.6161 8.85166C12.2506 8.46117 12.2506 7.53883 11.6161 7.14834L1.5241 0.937906Z"
      fill={color}
    />
  </svg>
);

const PauseIcon = ({ color = '#fff' }) => (
  <svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="15px"
    height="15px"
    viewBox="0 0 277.338 277.338"
  >
    <g>
      <path
        d="M14.22,45.665v186.013c0,25.223,16.711,45.66,37.327,45.66c20.618,0,37.339-20.438,37.339-45.66V45.665
c0-25.211-16.721-45.657-37.339-45.657C30.931,0,14.22,20.454,14.22,45.665z"
        fill={color}
      />
      <path
        d="M225.78,0c-20.614,0-37.325,20.446-37.325,45.657V231.67c0,25.223,16.711,45.652,37.325,45.652s37.338-20.43,37.338-45.652
V45.665C263.109,20.454,246.394,0,225.78,0z"
        fill={color}
      />
    </g>
  </svg>
);

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="none"
  >
    <path
      d="M13.5833 9.86458H14.8333C15.7538 9.86458 16.5 9.1557 16.5 8.28125V2.73958C16.5 1.86513 15.7538 1.15625 14.8333 1.15625H9C8.07953 1.15625 7.33333 1.86513 7.33333 2.73958V3.92708M3.16667 15.4063H9C9.92047 15.4063 10.6667 14.6974 10.6667 13.8229V8.28125C10.6667 7.4068 9.92047 6.69792 9 6.69792H3.16667C2.24619 6.69792 1.5 7.4068 1.5 8.28125V13.8229C1.5 14.6974 2.24619 15.4063 3.16667 15.4063Z"
      stroke="#54658F"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SendImojiIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.11111 14.4444C7.11111 14.4444 8.94444 16.8889 12 16.8889C15.0556 16.8889 17 14.5 17 14.5L7.11111 14.4444Z"
      fill="#2D3047"
      stroke="#2D3047"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
    <path
      d="M8.33203 10.332H8.34425M15.6654 10.332H15.6776"
      stroke="#2D3047"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="bevel"
    />
  </svg>
);

const SendIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 1L1 8L8 11L11 18L18 1Z"
      stroke="#2D3047"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);
