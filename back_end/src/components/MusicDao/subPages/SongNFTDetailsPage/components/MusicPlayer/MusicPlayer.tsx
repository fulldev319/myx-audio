import React, { useContext } from 'react';
import ReactPlayer from 'react-player';
import { useHistory } from 'react-router-dom';
import { useAuth } from 'shared/contexts/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';

import Slider from '@material-ui/core/Slider';
import withStyles from '@material-ui/core/styles/withStyles';
import Skeleton from '@material-ui/lab/Skeleton';

import Box from 'shared/ui-kit/Box';
import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';
import { fLoader, pLoader, getPlayerKey } from 'shared/functions/ipfs/hls';
import IPFSURL from 'shared/functions/getIPFSBackendURL';
// import OrbitDBClass from "shared/functions/orbitdb/OrbitDBClass";
import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import Waveform from 'components/MusicDao/components/WaveForm';
import { useStyles } from './MusicPlayer.styles';
import * as API from 'shared/services/API/WalletAuthAPI';
import {
  socket,
  setSocket,
  playerSocket,
  setPlayerSocket
} from 'components/Login/Auth';
import { setLoginBool } from 'store/actions/LoginBool';
import { setUser } from 'store/actions/User';
import io from 'socket.io-client';
import NoMetamaskModal from 'components/Connect/modals/NoMetamaskModal';
import ConnectWalletModal from 'components/MusicDao/modals/ConnectWalletModal';
import Web3 from 'web3';
import { useDispatch } from 'react-redux';
import PostNoteModal from 'components/Connect/modals/PostNoteModal';
import { useWeb3React } from '@web3-react/core';
import URL from 'shared/functions/getURL';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { useCookies } from 'react-cookie';
import { musicDaoUpdatePlayCount } from 'shared/services/API';
const playerOptions = {
  file: { forceAudio: true, attributes: { controlsList: 'nodownload' } }
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
const MusicPlayer = ({
  media,
  isHls = false,
  isActive = true,
  feed = () => {},
  songId
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { isSignedin, setSignedin } = useAuth();
  const { account, active, library } = useWeb3React();
  const { showPlayerKeyModal, playerKeyIsReady, setPlayerKeyIsReady } =
    useContext(MediaPlayerKeyContext);
  const playerAudio: any = React.useRef();
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
  const [selectedSong, setSelectedSong] = React.useState<any>();
  const [waveData, setWaveData] = React.useState<Uint8Array>();
  const [waveMetaData, setWaveMetaData] = React.useState<any>({});
  const [isFeed, setIsFeed] = React.useState<boolean>(false);
  const [durationShow, setDurationShow] = React.useState<any>(0);
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

  const getWaveData = async (url) => {
    // headers: {Authorization: `Bearer ${token}`}
    const axiosArrayBuffer = (
      await axios.get(url, { responseType: 'arraybuffer' })
    ).data;
    const axiosArray = new Uint8Array(axiosArrayBuffer);
    setWaveData(axiosArray);
  };

  React.useEffect(() => {
    if (media && media.newFileCID && media?.metadata?.properties?.name) {
      setSelectedSong({
        url: `${getURLfromCID(media.newFileCID)}/${
          media.metadata.properties.name
        }`
      });
      localStorage.setItem('playlistCID', media.newFileCID);
      if (media?.metadata?.properties?.wave_data_url) {
        getWaveData(media.metadata.properties.wave_data_url);
      }
    }
    if (media?.metadata?.properties?.duration) {
      const duration = media?.metadata?.properties?.duration;
      setDurationShow(duration);
    }
  }, [media]);

  React.useEffect(() => {
    if (!key || !playerKeyIsReady) {
      setPlayerKeyIsReady(false);
      showPlayerKeyModal();
    }
  });

  React.useEffect(() => {
    if (isFeed && feed) {
      feed();
    }
  }, [isFeed, feed]);

  const handleSeekChange = (_, v) => {
    setPlayerState({ ...playerState, seeking: true, played: Number(v) });
  };

  const handleSeekMouseUp = (_, v) => {
    setPlayerState({ ...playerState, seeking: false });

    if (playerAudio?.current) {
      playerAudio.current.seekTo(parseFloat(v));
    }
  };

  const handleProgress = (stateIn) => {
    if (!playerState.seeking) {
      setPlayerState({ ...playerState, ...stateIn });
    }
    if (isHls) {
      const mediaId = media.newFileCID;
      const { played, playedSeconds, loaded, loadedSeconds } = stateIn;
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
  };

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
  };

  const handlePlay = () => {
    if (!isSignedin) handleConnectWallet();
    if (!isActive) return;

    if (selectedSong && selectedSong.url) {
      if (!playerState.playing) musicDaoUpdatePlayCount({ songId });
      setPlayerState({ ...playerState, playing: !playerState.playing });
      if (playerState) {
        setIsFeed(true);
      }
    }
  };

  const handleSeek = (seconds) => {
    if (playerAudio?.current) {
      playerAudio.current.seekTo(seconds);
      setPlayerState({ ...playerState, playedSeconds: seconds });
    }
  };

  const handleDuration = (duration) => {
    setDurationShow(duration);
    setSelectedSong({ ...selectedSong, duration });
    setWaveMetaData({ trackDuration: duration * 1000 });
  };

  // if (!playerKeyIsReady || !key) {
  //   return null;
  // }

  if (!selectedSong?.url) return <></>;

  return (
    <Box className={classes.container}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        style={{ width: '100%' }}
      >
        <Box className={classes.playButton} onClick={handlePlay}>
          {playerState.playing ? (
            <>
              <PauseIcon color={isActive ? '#fff' : '#ccc'} />
            </>
          ) : (
            <>
              <PlayIcon color={isActive ? '#fff' : '#ccc'} />
            </>
          )}
        </Box>
        <Box className={classes.slider}>
          {isSignedin && playerKeyIsReady && selectedSong && (
            <ReactPlayer
              height={0}
              width={0}
              config={isHls ? hlsPlayerOptions : playerOptions}
              onContextMenu={(e) => e.preventDefault()}
              url={selectedSong.url}
              volume={playerState.volume / 100}
              className="react-player"
              ref={playerAudio}
              playing={playerState.playing && playerState.validated}
              onPause={() => setPlayerState({ ...playerState, playing: false })}
              onPlay={() => setPlayerState({ ...playerState, playing: true })}
              onProgress={handleProgress}
              onDuration={handleDuration}
              onError={(err, data, hls, global) => {
                console.log('ReactPlayer-Couldn’t decrypt the content', {
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
          {waveData && waveData.length ? (
            waveData?.length < 100 ? (
              <PlayerSlider
                defaultValue={0}
                min={0}
                max={0.999999}
                step={0.0000001}
                value={playerState.played}
                onChange={handleSeekChange}
                onChangeCommitted={handleSeekMouseUp}
              />
            ) : (
              <Waveform
                waveformData={waveData}
                waveformMeta={waveMetaData}
                onSeek={handleSeek}
                trackProgress={
                  (playerState.playedSeconds * 100) /
                  (selectedSong?.duration ?? 1)
                }
              />
            )
          ) : (
            <Skeleton variant="rect" width="100%" height={118} />
          )}
        </Box>
        <Box className={classes.playTime}>
          <span>
            {playerState.playedSeconds
              ? `${Math.floor((playerState.playedSeconds % 3600) / 60)}:${
                  Math.floor(playerState.playedSeconds % 60) < 10 ? '0' : ''
                }${Math.floor(playerState.playedSeconds % 60).toFixed(0)}`
              : '0:00'}
          </span>
          <span>&nbsp;/&nbsp;</span>
          <span>
            {selectedSong && durationShow
              ? `${Math.floor((durationShow % 3600) / 60)}:${
                  Math.floor(durationShow % 60) < 10 ? '0' : ''
                }${Math.floor(durationShow % 60).toFixed(0)}`
              : '0:00'}
          </span>
        </Box>
      </Box>
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

export default MusicPlayer;

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
    background: '#fff',
    height: 4,
    borderRadius: 3
  },
  rail: {
    background: '#F7F9FE40',
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
