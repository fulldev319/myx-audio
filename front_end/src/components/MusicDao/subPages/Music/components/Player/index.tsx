import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
// import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
// import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import withStyles from '@material-ui/core/styles/withStyles';
import Slider from '@material-ui/core/Slider';

import { RootState } from 'store/reducers/Reducer';
import WaveForm from 'components/MusicDao/components/WaveForm';

import MusicContext from 'shared/contexts/MusicContext';
import * as API from 'shared/services/API/MediaAPI';
// import { signPayload } from 'shared/services/WalletSign';
// import { getWalletInfo } from 'shared/helpers';
// import { signTransaction } from 'shared/functions/signTransaction';
import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
// import URL from 'shared/functions/getURL';
import Box from 'shared/ui-kit/Box';
import { fLoader, pLoader } from 'shared/functions/ipfs/hls';
import {
  musicDaoFruitSongNFT,
  musicDaoLikeSongNFT,
  musicDaoUpdateSongViewCount
} from 'shared/services/API';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import { processImage } from 'shared/helpers';

import { playerStyles } from './index.styles';
import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  LikedIcon,
  UnlikedIcon
} from 'components/MusicDao/subPages/GovernancePage/styles';
import { MusicPlatformPictures } from 'shared/constants/constants';
import { Hidden } from '@material-ui/core';

const breakpoint = 750;

export default function Player() {
  const classes = playerStyles();
  const { songsList, setSongsList } = useContext(MusicContext);
  const {
    selectedSong,
    setSelectedSong,
    freeMusicTime,
    setFreeMusicTime,
    playerState,
    setPlayerState
  } = useContext(MediaPlayerKeyContext);
  const { showAlertMessage } = useAlertMessage();

  const history = useHistory();

  const [width, setWidth] = React.useState(window.innerWidth); // responsive for javascript
  const [liked, setLiked] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [openError, setOpenError] = useState(false);
  const [fruitOpenMenu, setFruitOpenMenu] = useState<boolean>(false);
  const anchorFruitMenuRef = useRef<any>(null);
  const [openMusicDetail, setOpenMusicDetail] = useState<boolean>(false);
  const anchorMenuDetailRef = useRef<any>(null);
  const [previousSong, setPreviousSong] = useState<any>({});
  const [waveData, setWaveData] = React.useState<Uint8Array>(
    new Uint8Array(500).fill(0).map((_) => Math.round(Math.random() * 500))
  );
  const [waveMetaData, setWaveMetaData] = React.useState<any>({});

  let playerAudio: any = useRef();

  const [finishTrigger, setFinishTrigger] = useState<any>(new Date().getTime());
  const [shuffled, setShuffled] = useState<boolean>(false);
  const [repeated, setRepeated] = useState<boolean>(false);
  const [newSongsList, setNewSongsList] = useState<string[]>([]);

  //TODO: CALCULATE TIME SPENT + TOTAL
  const [token, setToken] = useState<string>('ETH');
  const userSelector = useSelector((state: RootState) => state.user);

  const [timerId, setTimerId] = useState<any>(null);

  const openTab = React.useMemo(() => {
    const openTabs = window.location.href.split('/#/player')[1].split('/');
    return openTabs.length > 1 ? openTabs[1] : '';
  }, [window.location.href]);

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    if (songsList) {
      let songs = [] as any[];
      songsList.forEach((s) => {
        songs.push(s.url);
      });
      setNewSongsList(songs);
    }
  }, [songsList]);

  useEffect(() => {
    setLiked(!!selectedSong?.likes?.find((v) => v.userId === userSelector.id));
  }, [selectedSong, userSelector?.id]);

  useEffect(() => {
    if (selectedSong?.id) {
      musicDaoUpdateSongViewCount(selectedSong?.id).then((res) => {
        if (res.success) {
          setSelectedSong({
            ...selectedSong,
            totalReproductions: res.totalReproductions
          });
        }
      });
    }
  }, [selectedSong?.id]);

  useEffect(() => {
    if (!selectedSong) {
      return;
    }
    // if (!previousSong || !previousSong.song_name || selectedSong.song_name !== previousSong.song_name) {
    //   const token: string = Cookies.get('accessToken') || "";
    //   axios
    //     .post(`${URLTraxMicroservice()}/songs/trackingMusic`, {
    //       songId: selectedSong.song_name,
    //       userId: userSelector.id,
    //       playlistId: selectedSong.playlist || null,
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })
    //     .then(response => {
    //       console.log(response.data);
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // }
    if (!playerState.playing) {
      handleCloseNFT();
      return;
    }
    if (!playerState.validated) {
      handleConfirmSign();
    }

    if (selectedSong?.url) {
      getWaveData();
    }

    setPreviousSong(selectedSong);
    setToken(selectedSong.priceToken ?? 'ETH');
  }, [selectedSong]);

  // useEffect(() => {
  //   if (selectedSong && !selectedSong.playing && playerState.playing) {
  //     setSelectedSong({ ...selectedSong, playing: true, Imageurl: selectedSong.Imageurl });
  //     localStorage.setItem("playlistCID", selectedSong.metadataMedia.newFileCID);
  //   } else if (selectedSong && selectedSong.playing && !playerState.playing) {
  //     setSelectedSong({ ...selectedSong, playing: false });
  //   }
  // }, [playerState]);

  useEffect(() => {
    if (songsList?.length > 0) {
      handleSkip();
    } else if (repeated) {
      if (playerAudio?.current) {
        playerAudio.current.seekTo(0);
      }
    } else {
      setPlayerState((state) => ({
        ...state,
        playing: false
      }));
    }
  }, [finishTrigger]);

  const getWaveData = async () => {
    setWaveData(
      new Uint8Array(500).fill(0).map((_) => Math.round(Math.random() * 500))
    );
  };

  const handleLike = async () => {
    if (!selectedSong) {
      return;
    }

    try {
      const res = await musicDaoLikeSongNFT(
        userSelector.id,
        selectedSong.id,
        liked ? 'dislike' : 'like'
      );
      if (res?.success) {
        const itemCopy = { ...selectedSong };
        if (!liked) {
          itemCopy.likes = [
            ...(itemCopy.likes || []),
            { userId: userSelector.id, date: new Date().getTime() }
          ];
        } else {
          itemCopy.likes = itemCopy.likes.filter(
            (v) => v.userId !== userSelector?.id
          );
        }
        setSelectedSong(itemCopy);
      }
    } catch (error) {}
  };

  const start = () => {
    if (!freeMusicTime) {
      reset();
    } else {
      loop();
    }
  };

  const pause = () => {
    // console.log('pause');
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };

  const reset = () => {
    console.log('reset');
    pause();
    setFreeMusicTime(10);
    loop();
  };

  const loop = () => {
    let timer: any = setInterval(function () {
      if (0 >= freeMusicTime) {
        pause();
        return;
      }
      setFreeMusicTime(freeMusicTime - 1);
    }, 1000);
    setTimerId(timer);
  };

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const handleShuffle = (shuffledValue) => {
    if (songsList?.length > 0) {
      let urls = [...songsList];
      if (!shuffledValue) {
        urls = shuffle(urls);
      }
      let sList = [] as any[];
      (!shuffledValue ? urls : songsList).forEach((s) => {
        sList.push(s.url);
      });
      setNewSongsList(sList);
    }
    setShuffled(!shuffledValue);
  };

  const handleSkip = () => {
    if (songsList?.length > 0 && selectedSong?.url) {
      const thisMediaIndex = newSongsList.findIndex(
        (m) => m === selectedSong.url
      );
      let nextUrlIndex = thisMediaIndex + 1;
      if (nextUrlIndex <= newSongsList.length - 1) {
        let nextMedia = songsList.find(
          (m) => m.url === newSongsList[nextUrlIndex]
        );
        setSelectedSong({
          ...nextMedia,
          Imageurl: nextMedia.Imageurl,
          duration:
            nextMedia.mediaDuration ??
            nextMedia.Duration ??
            nextMedia.duration ??
            0
        });
        setPlayerState({
          ...playerState,
          playing: true,
          loading: true,
          duration:
            nextMedia.mediaDuration ??
            nextMedia.Duration ??
            nextMedia.duration ??
            0
        });
      } else if (repeated) {
        let nextMedia = songsList.find((m) => m.url === newSongsList[0]);
        setSelectedSong({
          ...nextMedia,
          Imageurl: nextMedia.Imageurl,
          duration:
            nextMedia.mediaDuration ??
            nextMedia.Duration ??
            nextMedia.duration ??
            0
        });
        setPlayerState({
          ...playerState,
          playing: true,
          loading: true,
          duration:
            nextMedia.mediaDuration ??
            nextMedia.Duration ??
            nextMedia.duration ??
            0
        });
      } else {
        setPlayerState((state) => ({
          ...state,
          playing: false
        }));
      }
    }
  };
  const handlePlay = () => {
    if (selectedSong?.url) {
      if (playerState.loading) return;
      setPlayerState((state) => ({
        ...state,
        playing: !playerState.playing
      }));
    } else if (newSongsList?.length > 0) {
      setSelectedSong({
        ...songsList[0],
        Imageurl: songsList[0].Imageurl,
        duration:
          songsList[0].mediaDuration ??
          songsList[0].Duration ??
          songsList[0].duration ??
          0
      });
      setPlayerState({ ...playerState, playing: true, loading: true });
    }
  };
  const handlePrev = () => {
    if (songsList?.length > 0 && selectedSong?.url) {
      const thisMediaIndex = newSongsList.findIndex(
        (m) => m === selectedSong.url
      );
      let prevUrlIndex = thisMediaIndex - 1;
      if (prevUrlIndex >= 0) {
        let prevMedia = songsList.find(
          (m) => m.url === newSongsList[prevUrlIndex]
        );
        setSelectedSong({
          ...prevMedia,
          Imageurl: prevMedia.Imageurl,
          duration:
            prevMedia.mediaDuration ??
            prevMedia.Duration ??
            prevMedia.duration ??
            0
        });
        setPlayerState({
          ...playerState,
          playing: true,
          loading: true,
          duration:
            prevMedia.mediaDuration ??
            prevMedia.Duration ??
            prevMedia.duration ??
            0
        });
      } else if (repeated) {
        let prevMedia = songsList.find(
          (m) => m.url === newSongsList[newSongsList.length - 1]
        );
        setSelectedSong({
          ...prevMedia,
          Imageurl: prevMedia.Imageurl,
          duration:
            prevMedia.mediaDuration ??
            prevMedia.Duration ??
            prevMedia.duration ??
            0
        });
        setPlayerState({
          ...playerState,
          playing: true,
          loading: true,
          duration:
            prevMedia.mediaDuration ??
            prevMedia.Duration ??
            prevMedia.duration ??
            0
        });
      } else {
        setPlayerState((state) => ({
          ...state,
          playing: false
        }));
      }
    }
  };

  const handleRepeat = () => {
    setRepeated(!repeated);
  };

  const handleSeekChange = (e, v) => {
    setPlayerState({ ...playerState, seeking: true, played: Number(v) });
  };

  const handleSeekMouseUp = (e, v) => {
    setPlayerState({ ...playerState, seeking: false });

    if (playerAudio?.current) {
      playerAudio.current.seekTo(parseFloat(v));
    }
  };

  const handleSeekFromWave = (seconds) => {
    if (playerAudio?.current) {
      playerAudio.current.seekTo(seconds);
      setPlayerState({ ...playerState, playedSeconds: seconds });
    }
  };

  const handleProgress = (stateIn) => {
    if (!playerState.seeking) {
      setPlayerState({ ...playerState, ...stateIn, loading: false });
    }
  };

  const handleAddToPlaylist = () => {
    if (!selectedSong) {
      return;
    }
    setSongsList([selectedSong, ...songsList]);
    history.push('/player/queue');
  };

  const handleConfirmSign = async () => {
    try {
      start();
      if (
        !selectedSong.BlockchainNetwork ||
        selectedSong.BlockchainNetwork === 'Music Chain'
      ) {
        let txData: any = {
          MediaSymbol: selectedSong.song_name,
          Address: userSelector.address
        };
        /*const { privateKey } = await getWalletInfo(userSelector.mnemonic);
        const { signature: nftSignature } = await signPayload(
          "openNFT",
          userSelector.address,
          txData,
          privateKey
        );*/
        const openNftRequest = {
          Function: 'openNFT',
          // Address: userSelector.address,
          // Signature: nftSignature,
          Payload: txData
        };
        const response = await API.openNFT({
          chain: 'music',
          data: openNftRequest,
          userId: userSelector.id
        });
        if (!response.success) {
          throw new Error(response.error);
        }
      }
      setPlayerState({ ...playerState, playing: true, validated: true });
    } catch (e) {
      console.log(e);
      setErrorMsg(e.message);
      handleClickError();
    }
  };

  const handleCloseNFT = async () => {
    pause();
    try {
      if (
        !selectedSong.BlockchainNetwork ||
        selectedSong.BlockchainNetwork === 'Music Chain'
      ) {
        /*let data = {
          MediaSymbol: selectedSong.song_name,
          // MediaType: "",
          Address: userSelector.address,
          SharingId: "",
        };
        const [hash, signature] = await signTransaction(userSelector.mnemonic, data);
        let body = {
          Payload: data,
          Hash: hash,
          Signature: signature,
        };
        const response = await API.closeNFT({ chain: "music", data: body });
        if (!response.success) {
          throw new Error(response.error);
        }*/
      }
      // setPlayerState({ ...playerState, playing: false, validated: false });
    } catch (e) {
      console.log(e);
      setErrorMsg(e.message);
      handleClickError();
    }
  };

  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 4000);
  };

  const volumeChanged = (event: any, newValue: number | number[]) => {
    setPlayerState({ ...playerState, volume: newValue as number });
  };

  const handleClickMenuItem = (key) => {
    history.push(`/player/${key}`);
  };

  const isHLSMedia = selectedSong?.url?.endsWith('m3u8');
  const hlsPlayerOptions = {
    file: {
      forceAudio: true,
      forceHLS: true,
      hlsOptions: { fLoader, pLoader },
      attributes: { controlsList: 'nodownload' }
    }
  };
  const playerConfiguration = isHLSMedia ? hlsPlayerOptions : {};

  const handleDuration = React.useCallback(
    (duration) => {
      if (duration != selectedSong?.duration) {
        setSelectedSong((song) => ({ ...song, duration }));
        setWaveMetaData({ trackDuration: duration * 1000 });
      }
    },
    [setSelectedSong, selectedSong]
  );

  const getSliderControl = () => {
    return (
      <>
        {/* <Box className={classes.controlBox}>
        <Box mr={1}>
          {`${Math.floor((playerState.playedSeconds % 3600) / 60)}:${
            Math.floor(playerState.playedSeconds % 60) < 10 ? '0' : ''
          }${Math.floor(playerState.playedSeconds % 60).toFixed(0)}`}
        </Box>
        <PlayerSlider
          className={classes.track}
          defaultValue={0}
          min={0}
          max={0.999999}
          step={0.0000001}
          value={playerState.played}
          onChange={handleSeekChange}
          onChangeCommitted={handleSeekMouseUp}
        />
        {selectedSong?.duration > 0 && (
          <Box ml={1}>{`${Math.floor(
            (selectedSong?.duration % 3600) / 60
          )}:${
            Math.floor(selectedSong?.duration % 60) < 10 ? '0' : ''
          }${Math.floor(selectedSong?.duration % 60).toFixed(0)}`}</Box>
        )}
      </Box> */}
        {!!waveData?.length && (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            className={classes.tracking}
          >
            <Box fontSize={11} color={'white'} mr={1}>
              {playerState.playedSeconds
                ? `${Math.floor((playerState.playedSeconds % 3600) / 60)}:${
                    Math.floor(playerState.playedSeconds % 60) < 10 ? '0' : ''
                  }${Math.floor(playerState.playedSeconds % 60).toFixed(0)}`
                : '0:00'}
            </Box>
            <Box position="relative" flex={1}>
              <WaveForm
                waveformData={waveData}
                waveformMeta={waveMetaData}
                onSeek={handleSeekFromWave}
                trackProgress={
                  (playerState.playedSeconds * 100) /
                  (selectedSong?.duration ?? 1)
                }
                height={70}
              />
            </Box>
            <Box fontSize={11} color={'white'} ml={1}>
              {selectedSong && selectedSong?.duration
                ? `${Math.floor((selectedSong?.duration % 3600) / 60)}:${
                    Math.floor(selectedSong?.duration % 60) < 10 ? '0' : ''
                  }${Math.floor(selectedSong?.duration % 60).toFixed(0)}`
                : '0:00'}
            </Box>
          </Box>
        )}
      </>
    );
  };

  const getLeftControls = () => {
    return (
      <Box className={classes.controls}>
        <Box display="flex" mr={2}>
          {/* <button
        onClick={() => {
          handleShuffle(shuffled);
        }}
      >
        <img
          src={require(shuffled
            ? 'assets/icons/shuffle_mint.svg'
            : 'assets/icons/shuffle_white.svg')}
          alt="shuffle"
        />
      </button> */}
          <button onClick={handlePrev}>
            <PrevIcon />
          </button>
          <button onClick={handlePlay}>
            {playerState.loading ? (
              <CircularProgress
                style={{ width: 20, height: 20, color: 'white' }}
              />
            ) : playerState.playing ? (
              <PauseIcon />
            ) : (
              <PlayIcon />
            )}
          </button>
          <button onClick={handleSkip}>
            <NextIcon />
          </button>
          {/* <button onClick={handleRepeat}>
        <img
          src={
            repeated
              ? require('assets/icons/repeat_mint.svg')
              : require('assets/icons/repeat_white.svg')
          }
          alt="repeat"
        />
      </button> */}
        </Box>
        {width > breakpoint ? getSliderControl() : <></>}
      </Box>
    );
  };

  const getRightControls = () => {
    return (
      <div className={classes.controlsRight}>
        <Box display="flex" alignItems="center">
          <div
            style={{
              width: 24,
              minWidth: 24,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img
              src={require(`assets/icons/${
                playerState.muted ? 'volume_mute' : 'volume'
              }.webp`)}
              alt="volume"
              onClick={() => {
                setPlayerState({
                  ...playerState,
                  muted: !playerState.muted
                });
              }}
              style={{ cursor: 'pointer', width: 'auto', height: 'auto' }}
            />
          </div>
          <PlayerSlider
            style={{ width: 100, marginLeft: 4, marginRight: 24 }}
            value={playerState.volume}
            onChange={volumeChanged}
            aria-labelledby="continuous-slider"
          />
        </Box>
        {selectedSong?.url?.length > 0 && (
          <div
            className={classes.musicDetail}
            ref={anchorMenuDetailRef}
            onClick={() => setOpenMusicDetail((prev) => !prev)}
          >
            Music Details
          </div>
        )}
        {openMusicDetail && selectedSong?.url?.length > 0 && (
          <Popper
            open={openMusicDetail}
            anchorEl={anchorMenuDetailRef.current}
            transition
            disablePortal
            placement="bottom-end"
            style={{ position: 'inherit' }}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps}>
                <Paper className={classes.paper}>
                  <ClickAwayListener
                    onClickAway={() => setOpenMusicDetail(false)}
                  >
                    <Box className={classes.musicDetailBox}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box display="flex" alignItems="center">
                          <img
                            src={processImage(selectedSong.Image)}
                            alt="song-image"
                            width="80px"
                            height="80px"
                            style={{ objectFit: 'cover' }}
                          />
                          <Box maxWidth={160} overflow="hidden" ml={2}>
                            <Box className={classes.detailTitle}>
                              {selectedSong.Name}
                            </Box>
                            <Box mt={1}>{selectedSong?.Artist}</Box>
                          </Box>
                        </Box>
                        <Box className={classes.genreLabel} ml={2}>
                          {selectedSong.Genre}
                        </Box>
                      </Box>
                      {selectedSong.Description && (
                        <>
                          <Box className={classes.detailTitle} my={2}>
                            Description
                          </Box>
                          <Box
                            className={classes.artistName}
                            style={{ color: '#BCBCBC', maxWidth: 350 }}
                          >
                            {selectedSong.Description}
                          </Box>
                        </>
                      )}
                      <Box mt={2}>
                        <Box className={classes.platformBox}>
                          <Box style={{ opacity: 0.4 }}>Platform</Box>
                          <Box display="flex" alignItems="center" color="white">
                            <Box mr={1}>{selectedSong.Source}</Box>
                            <Box
                              className={classes.popBtnBox}
                              style={{ background: 'white' }}
                            >
                              <img
                                src={
                                  selectedSong?.Source &&
                                  MusicPlatformPictures.find(
                                    (v) =>
                                      v === selectedSong.Source.toLowerCase()
                                  )
                                    ? require(`assets/platformImages/${selectedSong.Source.toLowerCase()}.webp`)
                                    : null
                                }
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Box className={classes.platformBox}>
                          <Box style={{ opacity: 0.4 }}>Chain</Box>
                          <Box display="flex" alignItems="center" color="white">
                            <Box mr={1}>Ethereum</Box>
                            <Box
                              className={classes.popBtnBox}
                              style={{ background: 'grey' }}
                            >
                              <img
                                src={require('assets/chainImages/eth.webp')}
                                width="24px"
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Box className={classes.platformBox}>
                          <Box style={{ opacity: 0.4 }}>Ipfs</Box>
                          <Box
                            display="flex"
                            alignItems="center"
                            color="white"
                            style={{ cursor: 'pointer' }}
                          >
                            <Box mr={1}>Go to</Box>
                            <Box
                              onClick={() => {
                                if (selectedSong.ExternalUrl) {
                                  window.open(
                                    selectedSong.ExternalUrl,
                                    '_blank'
                                  );
                                }
                              }}
                            >
                              <LinkIcon />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        )}
      </div>
    );
  };

  return (
    <div className={classes.player}>
      {width > breakpoint ? (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          p={'12px 24px'}
        >
          <div className={classes.songInfo}>
            <div
              className={`${classes.albumImage} ${classes.pointer}`}
              style={{
                backgroundImage: selectedSong?.ImageUrl
                  ? `url(${processImage(selectedSong.ImageUrl)})`
                  : selectedSong?.Image
                  ? `url(${processImage(selectedSong.Image)})`
                  : 'none'
              }}
            />
            <Box display="flex" flexDirection="column" color="white">
              <div className={classes.title}>
                {selectedSong?.Name ?? selectedSong?.Title ?? ''}
              </div>
              <div
                className={`${classes.artist} ${classes.pointer}`}
                onClick={() => {
                  if (selectedSong?.CreatorUrlSlug) {
                    history.push(
                      `/player/artists/${selectedSong?.CreatorUrlSlug}`
                    );
                  }
                }}
              >
                {selectedSong?.Artist}
              </div>
            </Box>
            {selectedSong?.id && (
              <Box
                className={classes.likedIcon}
                onClick={() => {
                  handleLike();
                }}
              >
                {liked ? (
                  <LikedIcon color="#5046BB" />
                ) : (
                  <UnlikedIcon color="#9598A3" />
                )}
              </Box>
            )}
          </div>
          {getLeftControls()}
          {getRightControls()}
        </Box>
      ) : (
        <Box className={classes.mobileFooter}>
          <Box className={classes.mobilePlayer}>
            <Box
              display={'flex'}
              alignItems="center"
              justifyContent={'space-between'}
            >
              <Box display={'flex'} alignItems="center">
                <img
                  src={
                    processImage(selectedSong.ImageUrl) ??
                    processImage(selectedSong.Image) ??
                    'none'
                  }
                />
                <Box display={'flex'} flexDirection="column">
                  <Box className={classes.title} mb={0.5}>
                    {selectedSong?.Name ?? selectedSong?.Title ?? ''}
                  </Box>
                  <Box
                    className={`${classes.artist} ${classes.pointer}`}
                    onClick={() => {
                      if (selectedSong?.CreatorUrlSlug) {
                        history.push(
                          `/player/artists/${selectedSong.CreatorUrlSlug}`
                        );
                      }
                    }}
                  >
                    {selectedSong?.Artist}
                  </Box>
                </Box>
                {selectedSong?.id && (
                  <Box
                    className={classes.likedIcon}
                    onClick={() => {
                      handleLike();
                    }}
                  >
                    {liked ? (
                      <LikedIcon color="#5046BB" />
                    ) : (
                      <UnlikedIcon color="#9598A3" />
                    )}
                  </Box>
                )}
              </Box>
              {getLeftControls()}
              <Hidden xsDown>{getRightControls()}</Hidden>
            </Box>
            <Hidden smUp>{getRightControls()}</Hidden>
            {getSliderControl()}
          </Box>
          <Box height={'1px'} width={1} bgcolor={'#CACACA'} my={3} />
          <Box className={classes.mobileMenu}>
            <Box
              className={openTab === '' ? classes.mobileHomeMenuItem : ''}
              onClick={() => handleClickMenuItem('')}
            >
              <MobileHomeIcon color={openTab === '' ? 'white' : '#232323'} />
              {openTab === '' && <Box ml={1}>Home</Box>}
            </Box>
            <Box
              className={openTab === 'search' ? classes.mobileHomeMenuItem : ''}
              onClick={() => handleClickMenuItem('search')}
            >
              <MobileSearchIcon
                color={openTab === 'search' ? 'white' : '#232323'}
              />
              {openTab === 'search' && <Box ml={1}>Search</Box>}
            </Box>
            <Box
              className={
                openTab === 'recentlyPlayed' ? classes.mobileHomeMenuItem : ''
              }
              onClick={() => handleClickMenuItem('recentlyPlayed')}
            >
              <MobileGroupIcon
                color={openTab === 'recentlyPlayed' ? 'white' : '#232323'}
              />
              {openTab === 'recentlyPlayed' && (
                <Box ml={1}>Recently Played</Box>
              )}
            </Box>
            <Box
              className={
                openTab === 'playlist' ? classes.mobileHomeMenuItem : ''
              }
              onClick={() => handleClickMenuItem('Playlist')}
            >
              <MobileMediaIcon
                color={openTab === 'playlist' ? 'white' : '#232323'}
              />
              {openTab === 'playlist' && <Box ml={1}>Playlist</Box>}
            </Box>
          </Box>
        </Box>
      )}
      {selectedSong && (
        <ReactPlayer
          height={0}
          width={0}
          config={playerConfiguration}
          onContextMenu={(e) => e.preventDefault()}
          url={selectedSong.url}
          volume={playerState.volume / 100}
          muted={playerState.muted}
          className="react-player"
          ref={playerAudio}
          playing={
            selectedSong?.url && playerState.playing && playerState.validated
              ? true
              : false
          }
          onEnded={() => {
            setFinishTrigger(new Date().getTime());
          }}
          onPause={() => {
            // setSelectedSong({ ...selectedSong, playing: false });
            // setPlayerState({ ...playerState, playing: false });
          }}
          onPlay={() => {
            // setSelectedSong({ ...selectedSong, playing: true });
            // setPlayerState({ ...playerState, playing: true, loading: false });
          }}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onError={(err, data, hls, global) => {
            setPlayerState({ ...playerState, playing: false, loading: false });
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
      {openError && (
        <AlertMessage
          key={Math.random()}
          message={errorMsg}
          variant={'error'}
        />
      )}
    </div>
  );
}

const PlayerSlider = withStyles({
  root: {
    color: '#707582',
    height: 4,
    borderRadius: 2,
    padding: 0
  },
  thumb: {
    height: 8,
    width: 8,
    background: '#205580',
    border: 'none',
    margin: 0,
    bottom: -2
  },
  track: {
    background: '#205580',
    height: 4,
    borderRadius: 3
  },
  rail: {
    background: '#707582',
    height: 4,
    borderRadius: 3
  }
})(Slider);

const PlayIcon = () => (
  <svg
    width="15"
    height="18"
    viewBox="0 0 15 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.25 8.56699C14.5833 8.75944 14.5833 9.24056 14.25 9.43301L0.75 17.2272C0.416667 17.4197 -7.94635e-07 17.1791 -7.7781e-07 16.7942L-9.64174e-08 1.20577C-7.95928e-08 0.820871 0.416667 0.580308 0.75 0.772758L14.25 8.56699Z"
      fill="white"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="10"
    height="5"
    viewBox="0 0 10 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M-1.96528e-07 4.49605C-2.02289e-07 4.62784 0.0586708 4.7464 0.161473 4.85181C0.381615 5.0494 0.733951 5.0494 0.939457 4.85181L5.00552 1.20223L9.05691 4.83863C9.27705 5.03622 9.62939 5.03622 9.83489 4.83863C10.055 4.64104 10.055 4.32479 9.83489 4.14034L5.40185 0.148195C5.18171 -0.0493985 4.82938 -0.0493985 4.62387 0.148195L0.176152 4.14034C0.0587071 4.23261 3.70025e-05 4.3643 3.69968e-05 4.49609L-1.96528e-07 4.49605Z"
      fill="white"
    />
  </svg>
);

const MobileHomeIcon = ({ color }) => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.3962 22.1361H9.60449V15.9382C9.60449 15.3652 10.0732 14.8965 10.6462 14.8965H14.3545C14.9274 14.8965 15.3962 15.3652 15.3962 15.9382V22.1361Z"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M22.1351 11.8646V18.8542C22.1351 20.6667 20.7393 22.1354 19.0101 22.1354H5.98926C4.26009 22.1354 2.86426 20.6667 2.86426 18.8542V11.8646C2.86426 10.8854 3.27051 9.96875 3.98926 9.34375L10.4997 3.625C11.6559 2.60417 13.3434 2.60417 14.4997 3.625L21.0101 9.34375C21.7288 9.96875 22.1351 10.8854 22.1351 11.8646Z"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const MobileSearchIcon = ({ color }) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.7125 23.9875C8.0375 23.9875 3.4375 19.3875 3.4375 13.7125C3.4375 8.0375 8.0375 3.4375 13.7125 3.4375C19.3875 3.4375 23.9875 8.0375 23.9875 13.7125C23.9875 19.3875 19.3875 23.9875 13.7125 23.9875Z"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M26.5623 26.5633L21.4248 21.4258"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const MobileGroupIcon = ({ color }) => (
  <svg
    width="26"
    height="23"
    viewBox="0 0 26 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.2375 21.5512C4.22968 21.5512 3.26313 21.1508 2.55049 20.4382C1.83786 19.7255 1.4375 18.759 1.4375 17.7512C1.4375 16.7433 1.83786 15.7768 2.55049 15.0642C3.26313 14.3515 4.22968 13.9512 5.2375 13.9512H6.4375V21.5512H5.2375Z"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M20.7625 21.5512C21.7703 21.5512 22.7369 21.1508 23.4495 20.4382C24.1621 19.7255 24.5625 18.759 24.5625 17.7512C24.5625 16.7433 24.1621 15.7768 23.4495 15.0642C22.7369 14.3515 21.7703 13.9512 20.7625 13.9512H19.5625V21.5512H20.7625Z"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M24.5625 17.7503V12.3878C24.5391 9.34454 23.3077 6.43519 21.1394 4.29968C18.9711 2.16416 16.0433 0.977364 13 1.00033C9.95671 0.977364 7.02892 2.16416 4.86059 4.29968C2.69225 6.43519 1.46095 9.34454 1.4375 12.3878L1.4375 17.7503"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const MobileMediaIcon = ({ color }) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.5627 14.0384C11.3382 13.9152 11.0853 13.8529 10.8292 13.8577C10.5731 13.8624 10.3228 13.934 10.1029 14.0655C9.88306 14.1969 9.7014 14.3835 9.57595 14.6068C9.45049 14.8301 9.38561 15.0823 9.38775 15.3384V19.3009C9.38803 19.5562 9.45435 19.8071 9.58026 20.0292C9.70617 20.2512 9.88738 20.437 10.1063 20.5683C10.3252 20.6997 10.5744 20.7722 10.8296 20.7787C11.0848 20.7853 11.3374 20.7258 11.5627 20.6059L15.2127 18.6309C15.4482 18.5036 15.6449 18.3149 15.782 18.085C15.919 17.8551 15.9914 17.5923 15.9914 17.3246C15.9914 17.057 15.919 16.7942 15.782 16.5643C15.6449 16.3343 15.4482 16.1457 15.2127 16.0184L11.5627 14.0384Z"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M21.9375 24.7125C21.938 24.9556 21.8905 25.1964 21.7977 25.4211C21.7049 25.6457 21.5686 25.8499 21.3968 26.0218C21.2249 26.1936 21.0207 26.3299 20.7961 26.4227C20.5714 26.5155 20.3306 26.563 20.0875 26.5625H5.2875C5.04442 26.563 4.80363 26.5155 4.57896 26.4227C4.35428 26.3299 4.15014 26.1936 3.97825 26.0218C3.80637 25.8499 3.67012 25.6457 3.57732 25.4211C3.48452 25.1964 3.43701 24.9556 3.4375 24.7125V9.9125C3.43701 9.66942 3.48452 9.42863 3.57732 9.20396C3.67012 8.97928 3.80637 8.77514 3.97825 8.60325C4.15014 8.43137 4.35428 8.29512 4.57896 8.20232C4.80363 8.10952 5.04442 8.06201 5.2875 8.0625H20.0875C20.3306 8.06201 20.5714 8.10952 20.7961 8.20232C21.0207 8.29512 21.2249 8.43137 21.3968 8.60325C21.5686 8.77514 21.7049 8.97928 21.7977 9.20396C21.8905 9.42863 21.938 9.66942 21.9375 9.9125V24.7125Z"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8.0625 5.275C8.06613 4.78662 8.2626 4.31946 8.60911 3.97529C8.95563 3.63112 9.42411 3.43782 9.9125 3.4375L24.725 3.4375C25.2121 3.43816 25.6791 3.63197 26.0236 3.97642C26.368 4.32088 26.5618 4.78787 26.5625 5.275V20.0875C26.5622 20.5759 26.3689 21.0444 26.0247 21.3909C25.6805 21.7374 25.2134 21.9339 24.725 21.9375"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const LinkIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.8334 8.16699H7.00008C6.38124 8.16699 5.78775 8.41282 5.35017 8.85041C4.91258 9.28799 4.66675 9.88149 4.66675 10.5003V21.0003C4.66675 21.6192 4.91258 22.2127 5.35017 22.6502C5.78775 23.0878 6.38124 23.3337 7.00008 23.3337H17.5001C18.1189 23.3337 18.7124 23.0878 19.15 22.6502C19.5876 22.2127 19.8334 21.6192 19.8334 21.0003V15.167"
      stroke="white"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.6667 16.3337L23.3334 4.66699"
      stroke="white"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M17.5 4.66699H23.3333V10.5003"
      stroke="white"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const PrevIcon = () => (
  <svg
    width="23"
    height="22"
    viewBox="0 0 23 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.75 11.433C1.41667 11.2406 1.41667 10.7594 1.75 10.567L16.75 1.90673C17.0833 1.71428 17.5 1.95484 17.5 2.33974L17.5 19.6603C17.5 20.0452 17.0833 20.2857 16.75 20.0933L1.75 11.433Z"
      fill="#FEFEFF"
    />
    <rect y="2" width="2" height="18" rx="1" fill="#FEFEFF" />
  </svg>
);

const NextIcon = () => (
  <svg
    width="23"
    height="22"
    viewBox="0 0 23 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.25 10.567C21.5833 10.7594 21.5833 11.2406 21.25 11.433L6.25 20.0933C5.91667 20.2857 5.5 20.0452 5.5 19.6603L5.5 2.33975C5.5 1.95485 5.91667 1.71428 6.25 1.90673L21.25 10.567Z"
      fill="#FEFEFF"
    />
    <rect x="21" y="2" width="2" height="18" rx="1" fill="#AAAAAA" />
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
