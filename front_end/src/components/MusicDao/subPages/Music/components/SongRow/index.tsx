import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  InstapaperShareButton
} from 'react-share';
import axios from 'axios';
import cls from 'classnames';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import Cookies from 'js-cookie';
import { RootState } from 'store/reducers/Reducer';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import withStyles from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import NestedMenuItem from 'material-ui-nested-menu-item';
import URL from 'shared/functions/getURL';

import {
  AddPlayListIcon,
  AddQueueIcon,
  AlbumIcon,
  ArtistIcon,
  RemovePlayListIcon,
  CopyAddressIcon,
  DownloadQRIcon,
  FaceBookShareIcon,
  InstagramShareIcon,
  SongShareIcon,
  TwitterShareIcon,
  UploadIcon
} from 'components/MusicDao/components/Icons/SvgIcons';
import {
  LikedIcon,
  UnlikedIcon
} from 'components/MusicDao/subPages/GovernancePage/styles';

import MusicContext from 'shared/contexts/MusicContext';
import Box from 'shared/ui-kit/Box';
import URLTraxMicroservice from 'shared/functions/getURLMusicMicroservice';
import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import {
  mediaAddSongToPlaylist,
  mediaRemoveSongFromPlaylist,
  musicDaoLikeSongNFT
} from 'shared/services/API';
// import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';
import { processImage } from 'shared/helpers';

import { actionsRowStyles } from '../ActionsRow/index.styles';
import { songRowStyles } from './index.styles';
import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';
import ButtonMusicPlayer from 'components/MusicDao/components/MusicPlayer/ButtonMusicPlayer';

// import { queueMock, albumsMock, playlistMock } from '../../mockData';

enum OpenType {
  Home = 'HOME',
  Playlist = 'PLAYLIST',
  MyPlaylist = 'MYPLAYLIST',
  Album = 'ALBUM',
  Artist = 'ARTIST',
  Liked = 'LIKED',
  Library = 'LIBRARY',
  Search = 'SEARCH',
  Queue = 'QUEUE'
}

export default function SongRow({
  index = 0,
  row,
  myPlaylists = [],
  simplified,
  page,
  playlist = null,
  refreshPlaylist = () => {},
  refreshSongsList = () => {}
}: {
  index?: number;
  row?: any;
  myPlaylists?: any[];
  simplified?: any;
  page?: any;
  playlist?: any;
  refreshPlaylist?: () => void;
  refreshSongsList?: () => void;
}) {
  const userSelector = useSelector((state: RootState) => state.user);
  const history = useHistory();
  const classes = songRowStyles();
  const actionRowClasses = actionsRowStyles();
  const { showAlertMessage } = useAlertMessage();
  const [song, setSong] = useState<any>(row);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [status, setStatus] = useState<any>('');
  const [addingPlayLists, setAddingPlayLists] = useState<any[]>(myPlaylists);

  const {
    setSongsList,
    songsList,
    setQRCodeValue,
    setShowQRCodeDownload,
    setCopyLink
  } = useContext(MusicContext);
  const { selectedSong, setSelectedSong, playerState, setPlayerState } =
    useContext(MediaPlayerKeyContext);
  const mobileMatch = useMediaQuery('(max-width:600px)');
  const tabletMatch = useMediaQuery('(max-width:980px)');

  const [duration, setDuration] = useState<string>('');

  const [fruitOpenMenu, setFruitOpenMenu] = useState<boolean>(false);
  const anchorFruitMenuRef = useRef<HTMLButtonElement>(null);

  const [shareOpenMenu, setShareOpenMenu] = useState<boolean>(false);
  const anchorShareMenuRef = useRef<HTMLButtonElement>(null);

  const [openSettingMenu, setOpenSettingMenu] = useState(false);
  const anchorSettingMenuRef = useRef<HTMLButtonElement>(null);

  const [handlingLike, setHandlingLike] = useState<boolean>(false);
  const [storedToRecently, setStoredToRecently] = useState<boolean>(false);

  useEffect(() => {
    if (selectedSong?.id === song?.id) {
      setSong((prev) => ({
        ...prev,
        likes: selectedSong.likes,
        totalReproductions: selectedSong.totalReproductions
      }));
    }
  }, [selectedSong]);

  useEffect(() => {
    setSong(row);
  }, [row]);

  useEffect(() => {
    if (song && song.likes && userSelector?.id) {
      if (song.likes?.find((f) => f.userId === userSelector.id)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
  }, [song, userSelector]);

  useEffect(() => {
    const filteredPlaylists = myPlaylists.filter((v) => {
      if (v.Songs?.find((s) => s === row?.id)) return false;
      return true;
    });
    setAddingPlayLists(filteredPlaylists);
  }, [myPlaylists]);

  const handleFeed = () => {
    // refresh auto playing list
    refreshSongsList();

    const songId = song.Id ?? song.songId ?? song.draftId ?? song.id;
    // console.log({ songId, song }, 'handleFeed');

    if (!storedToRecently) {
      axios
        .post(`${URL()}/musicDao/song/updateRecentlySongAndListeningCount`, {
          data: {
            songId: songId,
            userId: userSelector.id,
            isPublic: song.isPublic ?? false
          }
        })
        .then((res) => {
          if (res.data.success) {
            setStoredToRecently(true);
          }
        });
    }
  };

  const handleLike = async (type) => {
    if (handlingLike) return;

    const itemCopy = { ...song };
    if (type === 'like') {
      itemCopy.likes = [
        ...(itemCopy.likes || []),
        { userId: userSelector.id, date: new Date().getTime() }
      ];
    } else {
      itemCopy.likes = itemCopy.likes.filter(
        (v) => v.userId !== userSelector?.id
      );
    }
    setSong(itemCopy);

    try {
      setHandlingLike(true);
      const res = await musicDaoLikeSongNFT(userSelector.id, song.id, type);
      if (res?.success) {
        if (selectedSong.id === song.id) {
          setSelectedSong({ ...selectedSong, likes: itemCopy.likes });
        }
        if (type === 'dislike') {
          refreshPlaylist();
        }
      } else {
        if (type === 'like') {
          itemCopy.likes = itemCopy.likes.filter(
            (v) => v.userId !== userSelector?.id
          );
        } else {
          itemCopy.likes = [
            ...(itemCopy.likes || []),
            { userId: userSelector.id, date: new Date().getTime() }
          ];
        }
        setSong(itemCopy);
      }
      setHandlingLike(false);
    } catch (error) {
      setHandlingLike(false);
    }
  };

  const handleFruitCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorFruitMenuRef.current &&
      anchorFruitMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setFruitOpenMenu(false);
  };

  const handleListKeyDownFruitMenu = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setFruitOpenMenu(false);
    }
  };

  const handleShareCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorShareMenuRef.current &&
      anchorShareMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setShareOpenMenu(false);
  };

  const handleListKeyDownShareMenu = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setShareOpenMenu(false);
    }
  };

  const handleCloseSettingMenu = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorSettingMenuRef.current &&
      anchorSettingMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenSettingMenu(false);
  };

  function handleListKeyDownSettingMenu(e: React.KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault();
      setOpenSettingMenu(false);
    }
  }

  useEffect(() => {
    if (song?.Duration) {
      const songDuration = song?.Duration;
      let hrs = Math.floor(songDuration / 3600);
      let min = Math.floor((songDuration % 3600) / 60);
      let sec = Math.floor(songDuration % 60);
      let strDur = '';
      if (hrs) {
        if (hrs < 10) strDur += '0';
        strDur += hrs.toString();
        strDur += ':';
      }
      if (min < 10) strDur += '0';
      strDur += min.toString();
      strDur += ':';
      if (sec < 10) strDur += '0';
      strDur += sec.toString();
      setDuration(strDur);
    }

    /*const fetchAlbumData = async () => {
      try {
        const response = await axios.get(`${URL()}/claimableSongs/getAlbumDetail?albumId=${song.album_name}`);
        if (response.data.success) {
          let albumData = response.data.data;
          setAlbum(albumData);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAlbumData();*/
  }, [song]);

  /*
  useEffect(() => {
    if (selectedSong && selectedSong.url && song.url) {
      if (selectedSong.url !== song.url) {
        setPlayerState({ ...playerState, playing: false });
      } else {
        if (playerState?.playing) {
          setPlayerState({ ...playerState, playing: true });
        } else {
          setPlayerState({ ...playerState, playing: false });
        }
      }
    }
  }, [selectedSong]);

  const handleSelectSong = () => {
    //find list where this song is stored
    //TODO: find album and load songs
    // let album = albumsMock.find(a => openTab && a.id === openTab.id);
    // if (openTab && openTab.type === OpenType.Liked) {
    //   //TODO: load liked songs
    //   setSongsList(queueMock);
    // } else if (openTab && openTab.type === OpenType.Queue) {
    //   //TODO: load songs in queue
    //   if (!playerState?.playing) {
    //     setSongsList(songsList.filter(item => item.song_name !== song.song_name));
    //   }
    // } else if (openTab && openTab.type === OpenType.Album) {
    //   if (album) {
    //     setSongsList(album.songs);
    //   }
    // } else if (openTab && openTab.type === OpenType.Playlist) {
    //   //TODO: find album and load songs
    //   let playlist = playlistMock.find(p => p.id === openTab.id);
    //   if (playlist) setSongsList(playlist.Songs);
    // } else if(openTab && openTab.type === OpenType.Artist) {

    // }

    //set song
    if (!playerState?.playing) {
      setSelectedSong({
        ...song,
        url: song?.AnimationUrl
          ? `https://proxy.myx.audio/getFile?url=${song.AnimationUrl}`
          : `${getURLfromCID(song.metadataMedia.newFileCID)}/${
              song.metadataMedia.metadata.properties.name
            }`,
        ImageUrl: song?.Image ? song?.Image : song?.ImageUrl ?? '',
        playlist: playlist
      });

      // setSelectedSong({ ...song, ImageUrl: album?.ImageUrl ?? "", playing: true, playlist: playlist });
      setPlayerState({ ...playerState, playing: true });
    } else {
      setSelectedSong({
        ...song,
        ImageUrl: song?.Image ? song?.Image : song?.ImageUrl ?? '',
        playlist: playlist
      });
      setPlayerState({ ...playerState, playing: false });
    }
  };
*/
  const onAddToQueue = () => {
    if (!song) {
      return;
    }
    setSongsList([song, ...songsList]);
    history.push('/player/queue');
  };

  const onGoToArtist = () => {
    if (!song) {
      return;
    }

    history.push(`/player/artists/${song.CreatorAddress}`);
  };

  const onGoToAlbum = () => {
    if (!song) {
      return;
    }
    history.push(`/player/artists/${song.album_name}`);
  };

  const handleAddSongToPlaylist = async (playlist) => {
    try {
      const resp = await mediaAddSongToPlaylist({
        id: playlist.id,
        songs: [song.id]
      });
      if (resp.success) {
        // update myPlaylist
        setAddingPlayLists(addingPlayLists.filter((v) => v.id !== playlist.id));
        showAlertMessage('Added successfuly!', { variant: 'success' });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const removeFromThisPlaylist = async (playlist: any) => {
    console.log(song);
    try {
      const resp = await mediaRemoveSongFromPlaylist({
        id: playlist.id,
        songs: [song.id]
      });
      if (resp.success) {
        showAlertMessage('Removed successfuly!', { variant: 'success' });
        refreshPlaylist();
      }
    } catch (error) {
      console.log(error);
    }

    // const token: string = Cookies.get('accessToken') || "";
    // axios
    //   .post(`${URLTraxMicroservice()}/playlists/removeSongsFromPlaylist`, {
    //     id: playlist,
    //     songs: [song.song_name],
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then(response => {
    //     if (response.data.success) {
    //       setStatus({
    //         msg: "Song removed from Playlist",
    //         key: Math.random(),
    //         variant: "success",
    //       });
    //       refreshPlaylist();
    //     } else {
    //       setStatus({
    //         msg: "Error removing song from Playlist",
    //         key: Math.random(),
    //         variant: "error",
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     setStatus({
    //       msg: "Error removing song from Playlist",
    //       key: Math.random(),
    //       variant: "error",
    //     });
    //   });
  };

  const getShareUrl = React.useMemo(() => {
    return `${window.location.origin}/#/player/albums/${song.album_name}/${song.song_name}`;
  }, [song]);

  const handleDownloadQRShow = () => {
    setShareOpenMenu(false);
    setQRCodeValue(getShareUrl);
    setShowQRCodeDownload(true);
    handleTrackingShare();
  };

  const handleCopyLink = () => {
    setShareOpenMenu(false);
    setCopyLink(getShareUrl);
    handleTrackingShare();
  };

  const handleTrackingShare = () => {
    const token: string = Cookies.get('accessToken') || '';
    axios
      .post(`${URLTraxMicroservice()}/songs/trackingShared`, {
        songId: song.song_name || song.MediaName || '',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const PlayButton = ({ onClick }) => {
    return (
      <Box
        onClick={onClick}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {('0' + index).slice(-2)}
      </Box>
    );
  };
  const PauseButton = ({ onClick }) => {
    return (
      <Box
        onClick={onClick}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <SoundIcon />
      </Box>
    );
  };

  return (
    <tbody>
      <StyledTableRow
        className={cls(
          { selected: selectedSong && song.id === selectedSong?.id },
          classes.row
        )}
      >
        <StyledTableCell align="center" width={80}>
          {/* <div style={{ width: 30, minWidth: 30 }}> */}
          <ButtonMusicPlayer
            media={song}
            songId={song?.id}
            isFromPlayer={true}
            isPlayerMeida={true}
            isUsingAtPlayerApp={true}
            feed={handleFeed}
            hasBackground={false}
            PlayButton={PlayButton}
            PauseButton={PauseButton}
          />
          {/* </div> */}
        </StyledTableCell>
        <StyledTableCell align="left">
          <Box display="flex" flexDirection="row" alignItems="center">
            {/* <div style={{ width: 30, minWidth: 30 }}>
              <ButtonMusicPlayer
                media={song}
                songId={song?.id}
                isFromPlayer={true}
                isPlayerMeida={true}
                isUsingAtPlayerApp={true}
                feed={handleFeed}
                hasBackground={false}
              />
            </div> */}
            <Box
              className={classes.songImage}
              // ml={2}
              style={
                tabletMatch
                  ? {
                      backgroundImage: song?.ImageUrl
                        ? `url(${processImage(song?.ImageUrl)})`
                        : song?.Image
                        ? `url(${processImage(song?.Image)})`
                        : 'none',
                      width: 36,
                      height: 36,
                      minWidth: 36,
                      minHeight: 36
                      // marginRight: 15
                    }
                  : {
                      backgroundImage: song?.ImageUrl
                        ? `url(${processImage(song?.ImageUrl)})`
                        : song?.Image
                        ? `url(${processImage(song?.Image)})`
                        : 'none'
                    }
              }
            />
            <Box display="flex" flexDirection="column" color="#181818">
              <Box
                className={classes.songNameLabel}
                fontSize={mobileMatch ? 14 : tabletMatch ? 16 : 18}
              >
                {song?.Name}
              </Box>
              <Box
                className={classes.artistNameLabel}
                fontSize={mobileMatch ? 10 : tabletMatch ? 12 : 14}
              >
                {song?.Artist}
                {/* {`${song?.creatorFirstName} ${song?.creatorLastName}` ??
                  'Artist'} */}
              </Box>
            </Box>
          </Box>
        </StyledTableCell>
        {!mobileMatch && (
          <>
            <StyledTableCell
              align="center"
              style={
                mobileMatch
                  ? {
                      fontSize: 14
                    }
                  : tabletMatch
                  ? {
                      fontSize: 16,
                      padding: 8,
                      height: 55
                    }
                  : {
                      fontSize: 18
                    }
              }
              className={classes.albumNameLabel}
            >
              {song.Source}
            </StyledTableCell>

            {!simplified && page !== 'search' && (
              <StyledTableCell
                align="center"
                style={
                  mobileMatch
                    ? {
                        fontSize: 14
                      }
                    : tabletMatch
                    ? {
                        fontSize: 16,
                        padding: 8
                      }
                    : {
                        fontSize: 18
                      }
                }
              >
                {song.totalReproductions
                  ? `${
                      song.totalReproductions > 1000000
                        ? (song.totalReproductions / 1000000).toFixed(1)
                        : song.totalReproductions > 1000
                        ? (song.totalReproductions / 1000).toFixed(1)
                        : song.totalReproductions
                    } ${
                      song.totalReproductions > 1000000
                        ? 'M'
                        : song.totalReproductions > 1000
                        ? 'K'
                        : ''
                    }`
                  : '0'}
              </StyledTableCell>
            )}
            <StyledTableCell
              align="center"
              style={
                mobileMatch
                  ? {
                      fontSize: 14
                    }
                  : tabletMatch
                  ? {
                      fontSize: 16,
                      padding: 8
                    }
                  : {
                      fontSize: 18
                    }
              }
            >
              {duration}
            </StyledTableCell>
          </>
        )}
        {!simplified && (
          <StyledTableCell align="right" style={{ width: '100px' }}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <button
                className={actionRowClasses.likeIcon}
                ref={anchorShareMenuRef}
                onClick={() => setShareOpenMenu(true)}
                style={{ width: 'auto', height: 'auto' }}
              >
                <UploadIcon width={20} height={20} color="#fff" />
              </button>
              <Popper
                open={shareOpenMenu}
                anchorEl={anchorShareMenuRef.current}
                transition
                disablePortal={false}
                placement="bottom"
                style={{ position: 'inherit' }}
              >
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps}>
                    <Paper className={classes.paper}>
                      <ClickAwayListener onClickAway={handleShareCloseMenu}>
                        <MenuList
                          autoFocusItem={shareOpenMenu}
                          id="share-menu-list-grow"
                          onKeyDown={handleListKeyDownShareMenu}
                        >
                          <MenuItem onClick={() => handleTrackingShare()}>
                            <TwitterShareButton
                              url={getShareUrl}
                              className={classes.shareButton}
                            >
                              <TwitterShareIcon />
                              <span>Share on Twitter</span>
                            </TwitterShareButton>
                          </MenuItem>
                          <MenuItem onClick={() => handleTrackingShare()}>
                            <FacebookShareButton
                              url={getShareUrl}
                              className={classes.shareButton}
                            >
                              <FaceBookShareIcon />
                              <span>Share on Facebook</span>
                            </FacebookShareButton>
                          </MenuItem>
                          <MenuItem>
                            <InstapaperShareButton
                              url={getShareUrl}
                              className={classes.shareButton}
                            >
                              <InstagramShareIcon />
                              <span> Share on Instagram</span>
                            </InstapaperShareButton>
                          </MenuItem>
                          <MenuItem onClick={handleCopyLink}>
                            <SongShareIcon />
                            Copy song link
                          </MenuItem>
                          <MenuItem onClick={handleDownloadQRShow}>
                            <DownloadQRIcon />
                            Download QR code
                          </MenuItem>
                          <MenuItem>
                            <CopyAddressIcon />
                            Copy address
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
              <>
                {/* <button
                  className={actionRowClasses.likeIcon}
                  ref={anchorFruitMenuRef}
                  onClick={() => setFruitOpenMenu(true)}
                >
                  <img
                    src={require(`assets/musicDAOImages/trending.webp`)}
                    style={{ width: 30, height: 30 }}
                    alt="like"
                  />
                </button>
                <Popper
                  open={fruitOpenMenu}
                  anchorEl={anchorFruitMenuRef.current}
                  transition
                  disablePortal={false}
                  placement="bottom"
                  style={{ position: 'inherit' }}
                >
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                      <Paper className={classes.paper1}>
                        <ClickAwayListener onClickAway={handleFruitCloseMenu}>
                          <MenuList
                            autoFocusItem={fruitOpenMenu}
                            id="fruit-menu-list-grow"
                            onKeyDown={handleListKeyDownFruitMenu}
                          >
                            <MenuItem onClick={() => handleFruit(1)}>
                              🍉{' '}
                              {song.fruits?.filter(
                                (fruit) => fruit.fruitId === 1
                              )?.length || 0}
                            </MenuItem>
                            <MenuItem onClick={() => handleFruit(2)}>
                              🥑{' '}
                              {song.fruits?.filter(
                                (fruit) => fruit.fruitId === 2
                              )?.length || 0}
                            </MenuItem>
                            <MenuItem onClick={() => handleFruit(3)}>
                              🍊{' '}
                              {song.fruits?.filter(
                                (fruit) => fruit.fruitId === 3
                              )?.length || 0}
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper> */}
              </>
              {isLiked ? (
                <Box
                  className={actionRowClasses.likedIcon}
                  onClick={() => {
                    handleLike('dislike');
                  }}
                >
                  <LikedIcon color="#5046BB" />
                </Box>
              ) : (
                <Box
                  className={actionRowClasses.likedIcon}
                  onClick={() => {
                    handleLike('like');
                  }}
                >
                  <UnlikedIcon color="#9598A3" />
                </Box>
              )}
              <button
                ref={anchorSettingMenuRef}
                onClick={() => setOpenSettingMenu(true)}
              >
                <MenuDots />
              </button>
              <Popper
                open={openSettingMenu}
                anchorEl={anchorSettingMenuRef.current}
                transition
                disablePortal={false}
                placement="bottom"
                style={{ position: 'inherit' }}
              >
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps}>
                    <Paper className={classes.paper}>
                      <ClickAwayListener onClickAway={handleCloseSettingMenu}>
                        <MenuList
                          autoFocusItem={openSettingMenu}
                          id="setting-menu-list-grow"
                          onKeyDown={handleListKeyDownSettingMenu}
                        >
                          {/* <MenuItem onClick={onAddToQueue}>
                            <AddQueueIcon />
                            Add to play queue
                          </MenuItem> */}
                          {page !== 'artist' ? (
                            <MenuItem onClick={onGoToArtist}>
                              <ArtistIcon />
                              Go to Artist
                            </MenuItem>
                          ) : null}
                          {/* {page !== 'album' ? (
                            <MenuItem onClick={onGoToAlbum}>
                              <AlbumIcon />
                              Go to Album
                            </MenuItem>
                          ) : null} */}
                          {page === 'playlist' ? (
                            <MenuItem
                              onClick={() => removeFromThisPlaylist(playlist)}
                            >
                              <RemovePlayListIcon />
                              Remove from this Playlist
                            </MenuItem>
                          ) : null}

                          <NestedMenuItem
                            label="Add to Playlist"
                            parentMenuOpen={true}
                          >
                            {addingPlayLists?.length > 0 ? (
                              <>
                                {addingPlayLists.map((item, index) => (
                                  <MenuItem
                                    key={`adding-playlist-${index}`}
                                    onClick={() =>
                                      handleAddSongToPlaylist(item)
                                    }
                                  >
                                    <AddPlayListIcon />
                                    {item.Title}
                                  </MenuItem>
                                ))}
                              </>
                            ) : (
                              <MenuItem>No your own playlist yet.</MenuItem>
                            )}
                          </NestedMenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Box>
          </StyledTableCell>
        )}
        {status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : null}
      </StyledTableRow>
    </tbody>
  );
}

const StyledTableCell = withStyles(() =>
  createStyles({
    root: {
      borderBottom: 'none',
      fontSize: '18px',
      color: '#fff',
      margin: '16px 0px',
      '&.selected': {
        background: '#0B1539'
      }
    }
  })
)(TableCell);

const StyledTableRow = withStyles(() =>
  createStyles({
    root: {
      borderBottom: 'none',
      padding: '0px 16px',
      '&.selected': {
        background: '#0B1539'
      }
    }
  })
)(TableRow);

const MenuDots = () => (
  <svg
    width="4"
    height="20"
    viewBox="0 0 4 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="2" cy="2" r="2" fill="#fff" />
    <circle cx="2" cy="10" r="2" fill="#fff" />
    <circle cx="2" cy="18" r="2" fill="#fff" />
  </svg>
);

const SoundIcon = () => (
  <svg
    width="26"
    height="20"
    viewBox="0 0 26 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.35 17.925C15.35 18.95 14.3875 19.575 13.675 18.9875L5.71251 14.2375C5.17501 14.2375 4.62501 14.25 4.08751 14.25C3.73991 14.2523 3.3953 14.1858 3.07356 14.0542C2.75182 13.9226 2.45932 13.7286 2.21295 13.4834C1.96657 13.2382 1.7712 12.9466 1.63811 12.6255C1.50502 12.3044 1.43684 11.9601 1.4375 11.6125V8.5125C1.4375 7.81299 1.71538 7.14213 2.21001 6.64751C2.70464 6.15288 3.3755 5.875 4.07501 5.875H5.72501V5.8875L13.6875 1C14.3875 0.437502 15.35 1.05 15.35 2.075V17.925Z"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M22.25 4.4248C22.9856 5.15449 23.5689 6.0231 23.9659 6.98017C24.3629 7.93724 24.5657 8.96367 24.5625 9.99981C24.5653 11.0359 24.3623 12.0622 23.9653 13.0192C23.5683 13.9762 22.9853 14.8449 22.25 15.5748"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M19.45 7.2124C19.8175 7.57779 20.1093 8.01207 20.3088 8.49038C20.5083 8.9687 20.6115 9.48166 20.6125 9.9999C20.6115 10.5181 20.5083 11.0311 20.3088 11.5094C20.1093 11.9877 19.8175 12.422 19.45 12.7874"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M15.35 8.6875C15.6981 8.6875 16.0319 8.82578 16.2781 9.07192C16.5242 9.31806 16.6625 9.6519 16.6625 10C16.6625 10.3481 16.5242 10.6819 16.2781 10.9281C16.0319 11.1742 15.6981 11.3125 15.35 11.3125"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
