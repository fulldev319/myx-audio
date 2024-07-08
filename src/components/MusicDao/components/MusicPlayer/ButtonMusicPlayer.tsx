import React, { useContext } from 'react';
import ReactPlayer from 'react-player';
import { useAuth } from 'shared/contexts/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useCookies } from 'react-cookie';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import Web3 from 'web3';
import io from 'socket.io-client';

import Box from 'shared/ui-kit/Box';
import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';
import { fLoader, pLoader, getPlayerKey } from 'shared/functions/ipfs/hls';
import IPFSURL from 'shared/functions/getIPFSBackendURL';
// import OrbitDBClass from "shared/functions/orbitdb/OrbitDBClass";
import {
  defaultPlayerState,
  MediaPlayerKeyContext
} from 'shared/contexts/MediaPlayerKeyContext';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import * as API from 'shared/services/API/WalletAuthAPI';
import {
  socket,
  setSocket,
  playerSocket,
  setPlayerSocket
} from 'components/Login/Auth';
import { setLoginBool } from 'store/actions/LoginBool';
import { setUser } from 'store/actions/User';
import NoMetamaskModal from 'components/Connect/modals/NoMetamaskModal';
import ConnectWalletModal from '../../modals/ConnectWalletModal';
import PostNoteModal from 'components/Connect/modals/PostNoteModal';
import URL from 'shared/functions/getURL';
import { musicDaoUpdatePlayCount } from 'shared/services/API';
import { useStyles } from './MusicPlayer.styles';
import { Gradient } from 'shared/ui-kit';
import CircularProgress from '@material-ui/core/CircularProgress';
import { v4 as uuidv4 } from 'uuid';

const playerOptions = {
  file: {
    forceAudio: true,
    attributes: { controlsList: 'nodownload', preload: 'metadata' }
  }
};

const hlsPlayerOptions = {
  file: {
    forceAudio: true,
    forceHLS: true,
    hlsOptions: {
      fLoader,
      pLoader,
      maxBufferLength: 60,
      maxBufferSize: 120 * 1000 * 1000
    },
    attributes: { controlsList: 'nodownload' }
  }
};

interface Props {
  media: any;
  songId: string;
  feed?: () => void;
  buttonSize?: number;
  isActive?: boolean;
  isPlayerMeida?: boolean;
  isFromPlayer?: boolean;
  hasBackground?: boolean;
  isUsingAtPlayerApp?: boolean;
  PlayButton?: ({ onClick }) => any | undefined;
  PauseButton?: ({ onClick }) => any | undefined;
}

const ButtonMusicPlayer = ({
  media,
  songId,
  feed = () => {},
  buttonSize = 1,
  isActive = true,
  isPlayerMeida = false,
  isFromPlayer = false,
  hasBackground = true,
  isUsingAtPlayerApp = false,
  PlayButton = undefined,
  PauseButton = undefined
}: Props) => {
  const classes = useStyles();
  const { isSignedin, setSignedin } = useAuth();
  const { account, active, library } = useWeb3React();
  const {
    showPlayerKeyModal,
    playerKeyIsReady,
    setPlayerKeyIsReady,
    freeMusicTime,
    setFreeMusicTime,
    selectedSong,
    setSelectedSong,
    playerState,
    setPlayerState
  } = useContext(MediaPlayerKeyContext);
  const playerAudio: any = React.useRef();
  const [isFeed, setIsFeed] = React.useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();
  const [signatureFail, setSignatureFail] = React.useState<boolean>(false);
  const [noMetamask, setNoMetamask] = React.useState<boolean>(false);
  const [connectWallet, setConnectWallet] = React.useState<boolean>(false);
  const [isShowPostNote, setShowPostNote] = React.useState<boolean>(false);
  const [connected, setConnected] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const signData = React.useRef();
  const timerRef = React.useRef<any>();
  const playerTimerRef = React.useRef<any>();
  const key = getPlayerKey();
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
  const [handlePlayIsPressed, setHandlePlayIsPressed] =
    React.useState<boolean>(false);

  const songURL = React.useMemo(() => {
    if (
      isPlayerMeida &&
      media &&
      (media.AnimationUrl?.length > 0 || media.AnimationURL?.length > 0)
    )
      return `https://proxy.myx.audio/getFile?url=${
        media.AnimationUrl ?? media.AnimationURL
      }`;
    else if (media && media.newFileCID && media?.metadata?.properties?.name)
      return `${getURLfromCID(media.newFileCID)}/${
        media.metadata.properties.name
      }`;
    return '';
  }, [media]);

  const songSelected = React.useMemo(() => {
    const ret1 = songURL && selectedSong?.url === songURL;
    let ret2 = true;
    if (media?.Id && selectedSong?.Id) {
      ret2 = media?.Id === selectedSong?.Id;
    } else {
      ret2 = songId === selectedSong.songId;
    }
    return ret1 && ret2;
  }, [selectedSong?.Id, selectedSong?.url, selectedSong.songId, songURL]);

  const isPlaying = React.useMemo(() => {
    const ret1 = songSelected && playerState?.playing;
    let ret2 = true;
    if (media?.Id && selectedSong?.Id) {
      ret2 = media?.Id === selectedSong?.Id;
    }
    return ret1 && ret2;
  }, [playerState, songSelected]);

  const isLoading = React.useMemo(() => {
    const ret1 = songSelected && playerState?.loading;
    let ret2 = true;
    if (media?.Id && selectedSong?.Id) {
      ret2 = media?.Id === selectedSong?.Id;
    }
    return ret1 && ret2;
  }, [playerState, songSelected]);

  // const isHLSMedia = !(
  //   isPlayerMeida &&
  //   media &&
  //   media.AnimationUrl?.length > 0
  // );
  const isHLSMedia = React.useMemo(() => songURL?.endsWith('m3u8'), [songURL]);

  const mediaDuration = React.useMemo(() => {
    if (isPlayerMeida && (media?.Duration || media?.duration)) {
      return media?.Duration ?? Number(media?.duration);
    } else if (media?.metadata?.properties?.duration) {
      const duration = media?.metadata?.properties?.duration;
      return duration;
    }
    return 0;
  }, [media, isPlayerMeida]);

  React.useEffect(() => {
    if (!songSelected) {
      setHandlePlayIsPressed(false);
    }
  }, [songSelected, setHandlePlayIsPressed]);

  React.useEffect(() => {
    if (playerAudio?.current && playerState.seeking)
      playerAudio.current.seekTo(parseFloat(playerState.played));
  }, [playerState]);

  /*React.useEffect(() => {
    if (!key || !playerKeyIsReady) {
      setPlayerKeyIsReady(false);
      showPlayerKeyModal();
    }
  });*/

  // React.useEffect(() => {
  //   if (isFeed && feed) {
  //     feed();
  //   }
  // }, [isFeed, feed]);

  const handleProgress = React.useCallback(
    (stateIn) => {
      if (!playerState.seeking) {
        setPlayerState((playerState) => ({ ...playerState, ...stateIn }));
        setFreeMusicTime(stateIn.playedSeconds);
      }
      if (isHLSMedia) {
        const mediaId = isPlayerMeida ? 'P5V87' : media.newFileCID;
        const { played, playedSeconds, loaded, loadedSeconds } = stateIn;
        // console.log('handleProgress', playedSeconds);
        playerSocket.emit('addConsumptionBySecond', {
          mediaId,
          loadedSeconds: loadedSeconds.toFixed(0),
          playedSeconds: playedSeconds.toFixed(0)
        });
        // console.log("Player Consumption - ", {
        //   playedSeconds: `${playedSeconds.toFixed(0)}s`,
        //   loadedSeconds: `${loadedSeconds.toFixed(0)}s`,
        // });
        // OrbitDBClass.db.add({ playedSeconds: playedSeconds.toFixed(0), mediaId, timeStamp: Math.floor(Date.now() / 1000) });
        // OrbitDBClass.db.add({ loadedSeconds: loadedSeconds.toFixed(0), mediaId, timeStamp: Math.floor(Date.now() / 1000) });
      }
    },
    [
      playerState,
      setPlayerState,
      setFreeMusicTime,
      playerSocket,
      isPlayerMeida,
      media
    ]
  );

  const handleSignIn = React.useCallback(async () => {
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
      if (!playerSocket) {
        const sock = io(IPFSURL(), {
          query: { token: Cookies.get('accessToken') || '' },
          transports: ['websocket']
        });
        sock.on('connected', () => {
          if (playerTimerRef.current) {
            clearInterval(playerTimerRef.current);
          }
        });
        sock.connect();
        setPlayerSocket(sock);
        sock.on('disconnect', () => {
          playerTimerRef.current = setInterval(() => {
            sock.connect();
          }, 5000);
        });
      }
      dispatch(setUser(res.userData));
      localStorage.setItem('address', account);
      localStorage.setItem('userId', res.userData.id);
      localStorage.setItem('userSlug', res.userData.urlSlug ?? res.userData.id);

      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + Cookies.get('accessToken');
      dispatch(setLoginBool(true));
    }
  }, [account, setSignedin, setUser]);

  const onGetTrax = React.useCallback(async () => {
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
  }, [
    setShowPostNote,
    account,
    library,
    setCookie,
    handleSignIn,
    setSignatureFail,
    showAlertMessage
  ]);

  const handleConnectWallet = React.useCallback(() => {
    if (active) {
      if (account) {
        onGetTrax();
      }
    } else {
      setConnectWallet(true);
    }
  }, [active, account, onGetTrax, setConnectWallet]);

  const handlePlay = React.useCallback(
    (e) => {
      e.stopPropagation();
      if (!isSignedin) {
        handleConnectWallet();
        return;
      }
      if (
        (!isPlayerMeida ||
          media?.ExternalUrl?.includes('.myx.audio') ||
          media?.newFileCID?.length > 0) &&
        (!key || !playerKeyIsReady)
      ) {
        setPlayerKeyIsReady(false);
        showPlayerKeyModal();
        return;
      }

      // console.log('handlePlay', media, songURL, handlePlayIsPressed);
      if (!handlePlayIsPressed) {
        setHandlePlayIsPressed(true);
        try {
          if (!playerState.playing) musicDaoUpdatePlayCount({ songId });
        } catch (err) {
          console.error(`musicDaoUpdatePlayCount ${songId}`);
        }
        if (mediaDuration) {
          setSelectedSong((song) => ({
            ...media,
            // ...song,
            duration: mediaDuration ?? 0,
            url: songURL,
            songId
          }));
        } else {
          setSelectedSong((song) => ({
            ...media,
            // ...song,
            url: songURL,
            songId
          }));
        }
        setPlayerState((state) => ({
          ...state,
          playing: true,
          loading: true,
          played: 0,
          playedSeconds: 0,
          duration: mediaDuration
        }));
        // console.log(media);
        feed();
        if (playerState) setIsFeed(true);
      } else if (selectedSong && selectedSong.url) {
        if (playerState.loading) return;
        try {
          if (!playerState.playing) musicDaoUpdatePlayCount({ songId });
        } catch (err) {
          console.error(`musicDaoUpdatePlayCount ${songId}`);
        }
        setPlayerState((state) => ({
          ...state,
          playing: !playerState.playing
        }));
        if (playerState) setIsFeed(true);
      }
    },
    [
      handleConnectWallet,
      handlePlayIsPressed,
      setHandlePlayIsPressed,
      musicDaoUpdatePlayCount,
      setSelectedSong,
      setPlayerState,
      playerState,
      selectedSong,
      setIsFeed
    ]
  );

  const handleDuration = React.useCallback(
    (duration) => {
      if (duration != selectedSong?.duration)
        setSelectedSong((song) => ({ ...song, duration }));
    },
    [setSelectedSong, selectedSong]
  );

  // console.log('123');
  // if (!playerKeyIsReady || !key) {
  //   return null;
  // }

  // console.log('isHLSMedia', isHLSMedia, songURL);
  if (!songURL) return <></>;
  return (
    <Box>
      {!PlayButton && !PauseButton && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box
            className={`${classes.playButton} ${buttonSize > 1 ? 'big' : ''}`}
            onClick={handlePlay}
            width={`${30 * buttonSize}px`}
            height={`${30 * buttonSize}px`}
            style={{
              background: hasBackground
                ? isFromPlayer
                  ? '#FF00C6'
                  : 'linear-gradient(88.38deg, #4434FF 7.67%, #2B99FF 102.5%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)'
                : 'none'
            }}
          >
            {isLoading ? (
              <Box width="30px" height="30px">
                <CircularProgress style={{ width: 30, height: 30 }} />
              </Box>
            ) : isPlaying ? (
              <>
                <PauseIcon
                  color={isActive ? '#fff' : '#ccc'}
                  size={buttonSize}
                />
              </>
            ) : (
              <>
                <PlayIcon
                  color={isActive ? '#fff' : '#ccc'}
                  size={buttonSize}
                />
              </>
            )}
          </Box>
        </Box>
      )}
      {PlayButton && PauseButton && (
        <>
          {isLoading ? (
            <CircularProgress style={{ width: 12, height: 12 }} />
          ) : isPlaying ? (
            <PauseButton onClick={handlePlay} />
          ) : (
            <PlayButton onClick={handlePlay} />
          )}
        </>
      )}
      {!isUsingAtPlayerApp && songURL && songSelected && (
        <ReactPlayer
          height={0}
          width={0}
          config={isHLSMedia ? hlsPlayerOptions : playerOptions}
          onContextMenu={(e) => e.preventDefault()}
          url={songURL}
          volume={playerState.volume / 100}
          muted={playerState.muted}
          className="react-player"
          ref={playerAudio}
          playing={isPlaying && playerState.validated}
          onPause={() => {
            setPlayerState({ ...playerState, playing: false });
          }}
          onPlay={() => {
            setPlayerState({ ...playerState, playing: true, loading: false });
          }}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onError={(err, data, hls, global) => {
            setPlayerState({ ...playerState, playing: false, loading: false });
            console.log('ReactPlayer-Couldn’t decrypt the content', songId, {
              err,
              data,
              hls,
              global
            });
            if (data?.details === 'keyLoadError') {
              console.log('Signature Verification Failed');
              // history.push("/");
            }
          }}
        />
      )}
      <PostNoteModal
        open={isShowPostNote}
        onClose={() => setShowPostNote(false)}
        onNext={onGetTrax}
      />
      <NoMetamaskModal open={noMetamask} onClose={() => setNoMetamask(false)} />
      <ConnectWalletModal
        open={connectWallet}
        handleClose={() => setConnectWallet(false)}
        setConnected={setConnected}
      />
    </Box>
  );
};

export default ButtonMusicPlayer;

const PlayIcon = ({ color = '#fff', size = 1 }) => (
  <svg
    width={13 * size}
    height={16 * size}
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
const PauseIcon = ({ color = '#fff', size = 1 }) => (
  <svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width={15 * size}
    height={15 * size}
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
