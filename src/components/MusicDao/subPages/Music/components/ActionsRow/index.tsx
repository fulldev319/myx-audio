import React, { useContext, useEffect, useRef, useState } from 'react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';

import { actionsRowStyles } from './index.styles';
import { PrimaryButton } from 'shared/ui-kit';
import MusicContext from 'shared/contexts/MusicContext';
import { RootState, useTypedSelector } from 'store/reducers/Reducer';
import URL from 'shared/functions/getURL';
import Box from 'shared/ui-kit/Box';
import {
  CopyAddressIcon,
  DownloadQRIcon,
  FaceBookShareIcon,
  SongShareIcon,
  TwitterShareIcon,
  UploadIcon
} from 'components/MusicDao/components/Icons/SvgIcons';
import ArtistRRSSModal from '../../modals/ArtistRRSSModal';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import URLTraxMicroservice from 'shared/functions/getURLMusicMicroservice';
import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function ActionsRow(props) {
  const { item, setItem, handleEdit, handleDelete } = props;
  const classes = actionsRowStyles();
  const user = useTypedSelector((state) => state.user);

  const { setSongsList, setShowQRCodeDownload, setQRCodeValue, setCopyLink } =
    useContext(MusicContext);
  const { selectedSong, setSelectedSong, playerState, setPlayerState } =
    useContext(MediaPlayerKeyContext);
  const { showAlertMessage } = useAlertMessage();

  const [fruitOpenMenu, setFruitOpenMenu] = useState<boolean>(false);
  const anchorFruitMenuRef = useRef<any>(null);

  const [shareOpenMenu, setShareOpenMenu] = useState<boolean>(false);
  const anchorShareMenuRef = useRef<any>(null);

  const [propertyOpenMenu, setPropertyOpenMenu] = useState<boolean>(false);
  const anchorPropertyMenuRef = useRef<any>(null);

  const userSelector = useSelector((state: RootState) => state.user);
  // const [following, setFollowing] = useState<boolean>(
  //   !userSelector || !item.followers
  //     ? false
  //     : item.followers?.includes(userSelector.id)
  // );
  const [handlingLike, setHandlingLike] = useState<boolean>(false);

  const [openModalRRSS, setOpenModalRRSS] = useState<boolean>(false);
  const handleOpenModalRRSS = () => {
    setOpenModalRRSS(true);
  };
  const handleCloseModalRRSS = () => {
    setOpenModalRRSS(false);
  };

  const openTab = React.useMemo(() => {
    const openTabs = window.location.href.split('/#/player')[1].split('/');
    return openTabs.length > 1 ? openTabs[1] : '';
  }, [window.location.href]);

  useEffect(() => {
    // setFollowing(
    //   !userSelector || !item.followers
    //     ? false
    //     : item.followers.includes(userSelector.id)
    // );
  }, [item]);

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
  const handlePropertyCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorPropertyMenuRef.current &&
      anchorPropertyMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setPropertyOpenMenu(false);
  };

  const handleListKeyDownShareMenu = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setShareOpenMenu(false);
    }
  };
  const handleListKeyDownPropertyMenu = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setPropertyOpenMenu(false);
    }
  };

  const handleFollow = (e, type) => {
    e.stopPropagation();
    e.preventDefault();

    if (handlingLike) return;

    const itemCopy = { ...item };
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
    props.setItem(itemCopy);

    try {
      setHandlingLike(true);
      const podAddress = item.id;
      const api = '/musicDao/artist/like';

      axios
        .post(`${URL()}${api}`, {
          userId: userSelector.id,
          id: podAddress,
          type
        })
        .then((res) => {
          if (res.data.success) {
            setHandlingLike(false);
          } else {
            setHandlingLike(false);
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
            props.setItem(itemCopy);
          }
        });
    } catch (error) {
      setHandlingLike(false);
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
      props.setItem(itemCopy);
    }
  };

  const handlePlay = () => {
    if (!item.songs?.length || playerState.loading) return;

    if (item?.songs?.find((v) => v.url === selectedSong?.url)) {
      setPlayerState((state) => ({
        ...state,
        playing: !playerState.playing
      }));
    } else {
      setPlayerState((state) => ({
        ...state,
        playing: true,
        loading: true,
        played: 0,
        playedSeconds: 0,
        duration:
          item.songs[0].mediaDuration ??
          item.songs[0].Duration ??
          item.songs[0].duration ??
          0
      }));
      if (item.songs[0].mediaDuration) {
        setSelectedSong((song) => ({
          ...item.songs[0],
          // ...song,
          duration: item.songs[0].mediaDuration ?? 0
        }));
      } else {
        setSelectedSong((song) => ({
          ...item.songs[0],
          // ...song,
          duration: item.songs[0].Duration ?? item.songs[0].duration ?? 0
        }));
      }
      // set song list
      if (item.songs && item.songs.length > 0) {
        setSongsList(item.songs);
      }
    }
  };

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
    let urlType: string = '';
    let body: any = {};

    if (openTab === 'albums') {
      urlType = 'albums';
      body = { albumId: item.album_name || '' };
    } else if (openTab === 'artists') {
      urlType = 'artists';
      body = { artistId: item.artist_name || '' };
    } else if (openTab === 'playlist' || openTab === 'myplaylist') {
      urlType = 'playlists';
      body = { playlistId: item.id || '' };
    }

    const token: string = Cookies.get('accessToken') || '';
    axios
      .post(`${URLTraxMicroservice()}/${urlType}/trackingShared`, {
        ...body,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getShareUrl = React.useMemo(() => {
    return window.location.href;
  }, [item]);

  useEffect(() => {
    if (selectedSong) {
      let playingSong;

      if (item.songs) {
        playingSong = item.songs.find(
          (s) => s.url && selectedSong.url === s.url
        );
      } else if (item.length > 0) {
        playingSong = item.find((s) => s.url && selectedSong.url === s.url);
      }

      if (
        playingSong &&
        selectedSong &&
        selectedSong.url &&
        playingSong.url &&
        selectedSong.url === playingSong.url
      ) {
        if (playerState?.playing) {
          setPlayerState({ ...playerState, playing: true });
        } else {
          setPlayerState({ ...playerState, playing: false });
        }
      }
    }
  }, [selectedSong]);

  const handleFruit = (type) => {
    if (
      item.fruits
        ?.filter((f) => f.fruitId === type)
        ?.find((f) => f.userId === userSelector.id)
    ) {
      showAlertMessage('You had already given this fruit.', {
        variant: 'info'
      });
      return;
    }

    const podAddress =
      openTab === 'ablum'
        ? item.id
        : openTab === 'playlist'
        ? item.id
        : item.id;
    const api =
      openTab === 'albums'
        ? '/musicDao/album/fruit'
        : openTab === 'playlist'
        ? '/musicDao/playlist/fruit'
        : '/musicDao/artist/fruit';
    axios
      .post(`${URL()}${api}`, {
        userId: userSelector.id,
        id: podAddress,
        fruitId: type
      })
      .then((res) => {
        if (res.data.success) {
          const itemCopy = { ...item };
          itemCopy.fruits = [
            ...(itemCopy.fruits || []),
            {
              userId: userSelector.id,
              fruitId: type,
              date: new Date().getTime()
            }
          ];
          setItem(itemCopy);
        }
      });

    // const token: string = Cookies.get('accessToken') || "";
    // const body = {
    //   userId: user.id,
    //   podAddress:
    //     openTab!.type === 'album'
    //       ? item.album_name
    //       : openTab!.type ==='playlist'
    //       ? item.id
    //       : item.artist_name,
    //   fruitId: type,
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // };
    // axios
    //   .post(
    //     `${URL()}/${
    //       openTab!.type === 'album'
    //         ? "albums"
    //         : openTab!.type ==='playlist'
    //         ? "playlists"
    //         : "artists"
    //     }/fruit`,
    //     body
    //   )
    //   .then(res => {
    //     if (res.data?.success) {
    //       const itemCopy = { ...item };
    //       itemCopy.fruits = [
    //         ...(itemCopy.fruits || []),
    //         { userId: user.id, fruitId: type, date: new Date().getTime() },
    //       ];
    //       setItem(itemCopy);
    //     }
    //   });
  };

  const handleLike = (type) => {
    if (handlingLike) return;

    const itemCopy = { ...item };
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
    setItem(itemCopy);

    try {
      setHandlingLike(true);
      const podAddress = item.id;
      const api =
        openTab === 'albums'
          ? '/musicDao/album/like'
          : openTab === 'playlist'
          ? '/musicDao/playlist/like'
          : '/musicDao/artist/like';

      axios
        .post(`${URL()}${api}`, {
          userId: userSelector.id,
          id: podAddress,
          type
        })
        .then((res) => {
          if (res.data.success) {
            setHandlingLike(false);
          } else {
            setHandlingLike(false);
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
            setItem(itemCopy);
          }
        });
    } catch (error) {
      setHandlingLike(false);
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
      setItem(itemCopy);
    }
  };

  if (openTab)
    return (
      <div className={classes.actions}>
        {openTab !== 'queue' ? (
          <Box display="flex" alignItems="center">
            <button className={classes.play} onClick={handlePlay}>
              {playerState?.loading ? (
                <CircularProgress
                  color="inherit"
                  style={{ width: 20, height: 20, marginRight: 16 }}
                />
              ) : item?.songs?.find((v) => v.url === selectedSong?.url) &&
                playerState.playing ? (
                <img
                  src={require(`assets/icons/pause_white.webp`)}
                  alt="play"
                  style={{ marginLeft: 0, height: 32 }}
                />
              ) : (
                <img
                  src={require(`assets/icons/play_white_filled.webp`)}
                  alt="play"
                />
              )}
              <div style={{ marginTop: 6 }}>
                {playerState?.loading
                  ? 'Loading...'
                  : playerState?.playing
                  ? 'Pause'
                  : 'Play Now'}
              </div>
            </button>
            {/* like button */}
            {(openTab === 'albums' || openTab === 'playlist') && (
              <>
                <>
                  {/* <button
                    className={classes.likeIcon}
                    ref={anchorFruitMenuRef}
                    onClick={() => setFruitOpenMenu(true)}
                  >
                    <img
                      src={require('assets/musicDAOImages/trending.webp')}
                      alt="trending"
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
                        <Paper className={classes.paper}>
                          <ClickAwayListener onClickAway={handleFruitCloseMenu}>
                            <MenuList
                              autoFocusItem={fruitOpenMenu}
                              id="fruit-menu-list-grow"
                              onKeyDown={handleListKeyDownFruitMenu}
                            >
                              <MenuItem onClick={() => handleFruit(1)}>
                                🍉{' '}
                                {item.fruits?.filter(
                                  (fruit) => fruit.fruitId === 1
                                )?.length || 0}
                              </MenuItem>
                              <MenuItem onClick={() => handleFruit(2)}>
                                🥑{' '}
                                {item.fruits?.filter(
                                  (fruit) => fruit.fruitId === 2
                                )?.length || 0}
                              </MenuItem>
                              <MenuItem onClick={() => handleFruit(3)}>
                                🍊{' '}
                                {item.fruits?.filter(
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
                {item?.likes?.find((v) => v.userId === user?.id) ? (
                  <Box
                    style={{
                      cursor: 'pointer',
                      width: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '100vh',
                      background:
                        'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 100%)',
                      boxShadow: '0px 4px 24px -1px rgba(0, 0, 0, 0.2)',
                      backdropFilter: 'blur(34px)'
                    }}
                    onClick={() => {
                      handleLike('dislike');
                    }}
                    mr={3}
                  >
                    <LikedIcon />
                  </Box>
                ) : (
                  <Box
                    style={{
                      cursor: 'pointer',
                      width: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '100vh',
                      background:
                        'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 100%)',
                      boxShadow: '0px 4px 24px -1px rgba(0, 0, 0, 0.2)',
                      backdropFilter: 'blur(34px)'
                    }}
                    onClick={() => {
                      handleLike('like');
                    }}
                    mr={3}
                  >
                    <UnlikedIcon />
                  </Box>
                )}
              </>
            )}
            {/* follow button */}
            {openTab === 'artists' && userSelector.id !== item.id && (
              <PrimaryButton
                size="medium"
                style={
                  !item?.likes?.find((v) => v.userId === userSelector?.id)
                    ? {
                        background:
                          'linear-gradient(122.33deg, #4D08BC 13.31%, #2A9FE2 93.53%)',
                        borderRadius: '100vh',
                        lineHeight: 0
                      }
                    : {
                        background:
                          'linear-gradient(122.33deg, #4D08BC 13.31%, #2A9FE2 93.53%)',
                        borderRadius: '100vh',
                        color: '#5046BB',
                        border: '2px solid #5046BB',
                        lineHeight: 0
                      }
                }
                onClick={(e) => {
                  handleFollow(
                    e,
                    !item?.likes?.find((v) => v.userId === userSelector?.id)
                      ? 'like'
                      : 'dislike'
                  );
                }}
              >
                {!item?.likes?.find((v) => v.userId === userSelector?.id)
                  ? 'Follow'
                  : 'Unfollow'}
              </PrimaryButton>
            )}
            {/* sharing button */}
            {(openTab === 'albums' ||
              // openTab === 'playlist' ||
              openTab === 'artists') && (
              <>
                <button
                  className={classes.likeIcon}
                  ref={anchorShareMenuRef}
                  onClick={() => setShareOpenMenu(true)}
                  style={{
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '100vh',
                    background:
                      'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 100%)',
                    boxShadow: '0px 4px 24px -1px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(34px)'
                  }}
                >
                  <MenuDots />
                </button>
                <Popper
                  open={shareOpenMenu}
                  anchorEl={anchorShareMenuRef.current}
                  transition
                  disablePortal={false}
                  placement="bottom"
                  style={{ position: 'inherit', zIndex: 1 }}
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
                            {/* <MenuItem>
                              <InstapaperShareButton url={getShareUrl} className={classes.shareButton}>
                                <InstagramShareIcon />
                                <span> Share on Instagram</span>
                              </InstapaperShareButton>
                            </MenuItem> */}
                            <MenuItem onClick={handleCopyLink}>
                              <SongShareIcon />
                              Copy{' '}
                              {openTab === 'albums'
                                ? 'albums'
                                : openTab === 'artists'
                                ? 'artist'
                                : 'playlist'}{' '}
                              link
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
              </>
            )}
            {/* property button */}
            {openTab === 'playlist' && item.creatorId === user.id && (
              <>
                <button
                  className={classes.likeIcon}
                  ref={anchorPropertyMenuRef}
                  onClick={() => setPropertyOpenMenu(true)}
                  style={{
                    marginLeft: 0,
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '100vh',
                    background:
                      'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 100%)',
                    boxShadow: '0px 4px 24px -1px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(34px)'
                  }}
                >
                  <MenuDots />
                </button>
                <Popper
                  open={propertyOpenMenu}
                  anchorEl={anchorPropertyMenuRef.current}
                  transition
                  disablePortal={false}
                  placement="bottom"
                  style={{ position: 'inherit', zIndex: 1 }}
                >
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                      <Paper className={classes.paper}>
                        <ClickAwayListener
                          onClickAway={handlePropertyCloseMenu}
                        >
                          <MenuList
                            autoFocusItem={propertyOpenMenu}
                            id="property-menu-list-grow"
                            onKeyDown={handleListKeyDownPropertyMenu}
                          >
                            <MenuItem
                              onClick={() => {
                                if (handleEdit) handleEdit();
                              }}
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                if (handleDelete) handleDelete();
                              }}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </>
            )}
            {/* {openTab === 'artists' && (
              <>
                {following ? (
                  <SecondaryButton size="medium" onClick={handleFollow}>
                    Unfollow
                  </SecondaryButton>
                ) : (
                  <PrimaryButton size="medium" onClick={handleFollow}>
                    Follow
                  </PrimaryButton>
                )}
              </>
            )}
            {openTab === 'artists' && (
              <PrimaryButton size="medium" onClick={handleOpenModalRRSS}>
                Manage RRSS
              </PrimaryButton>
            )} */}
          </Box>
        ) : (
          <div />
        )}
        {/* <RightItemsActions hours={5} /> */}
        {openModalRRSS && (
          <ArtistRRSSModal
            open={openModalRRSS}
            handleClose={handleCloseModalRRSS}
            artist={item}
            setArtist={(art) => setItem(art)}
          />
        )}
      </div>
    );
  else return null;
}

export const RightItemsActions = ({ hours }) => {
  return (
    <Box display="flex" alignItems="center" color="#181818" fontSize="14px">
      <img src={require('assets/icons/flash.webp')} alt="flash" />
      {hours} hours left
      <PrimaryButton size="medium" onClick={() => {}}>
        Add Funds
      </PrimaryButton>
    </Box>
  );
};

const PropertyIcon = () => (
  <svg
    width="50"
    height="10"
    viewBox="0 0 50 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="5" cy="5" r="5" fill="#fff" />
    <circle cx="25" cy="5" r="5" fill="#fff" />
    <circle cx="45" cy="5" r="5" fill="#fff" />
  </svg>
);

export const LikedIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.0401 18.99L9.78006 18.83C7.48413 17.3958 5.34859 15.7195 3.41007 13.83C2.06351 12.4785 1.0382 10.8414 0.410069 9.03997C-0.16985 7.3189 -0.120225 5.44789 0.550084 3.75997C0.88292 2.9277 1.39508 2.17901 2.05014 1.56716C2.70521 0.955312 3.48704 0.495351 4.34006 0.219994C4.6274 0.117069 4.92633 0.0498854 5.23008 0.0199823H5.35007C5.62706 -0.0305139 5.90869 -0.0506305 6.19004 -0.0400153H6.27005C6.89394 -0.0302102 7.51206 0.0812387 8.10007 0.289971H8.16007C8.19424 0.302862 8.22499 0.323381 8.25004 0.349969C8.4683 0.415058 8.6794 0.502183 8.88004 0.609979L9.26005 0.779992C9.3579 0.836395 9.45151 0.899901 9.54007 0.969994L9.69004 1.06997C9.78115 1.11952 9.86811 1.17639 9.95005 1.23998C11.0359 0.394301 12.3737 -0.0633571 13.75 -0.0600043H13.8001C14.432 -0.0687927 15.0608 0.0292321 15.6601 0.229974C16.506 0.500975 17.2812 0.956413 17.9297 1.56341C18.5782 2.1704 19.0838 2.91382 19.4101 3.73998C20.0597 5.4311 20.1161 7.29263 19.57 9.01998C18.9397 10.8262 17.9148 12.4693 16.57 13.83C14.633 15.7088 12.5087 17.3843 10.2301 18.83L9.98008 18.98L10.0401 18.99ZM14.94 3.09997C14.7737 3.1035 14.6124 3.15821 14.4782 3.25662C14.3441 3.35502 14.2434 3.49237 14.19 3.64999C14.1314 3.849 14.1504 4.06284 14.2432 4.24841C14.336 4.43397 14.4956 4.57748 14.69 4.64999C15.006 4.77311 15.2773 4.98897 15.4683 5.26919C15.6593 5.54941 15.761 5.88088 15.76 6.21999C15.7491 6.33077 15.7602 6.44263 15.7928 6.54906C15.8254 6.6555 15.8789 6.75439 15.95 6.83999C16.0474 6.96527 16.1817 7.05691 16.3338 7.10207C16.4859 7.14724 16.6483 7.14365 16.7983 7.09182C16.9483 7.03999 17.0783 6.94253 17.1701 6.81307C17.2619 6.68362 17.3108 6.52867 17.31 6.36999V6.24999C17.3269 5.57004 17.1332 4.90149 16.7555 4.33584C16.3778 3.77018 15.8345 3.33505 15.2 3.08999C15.1123 3.08565 15.0245 3.09578 14.94 3.11999V3.09997Z"
      fill="#fff"
    />
  </svg>
);

export const UnlikedIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 23 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.2307 20.9961C8.80057 19.486 6.54309 17.7115 4.49898 15.7048C3.05434 14.2532 1.95707 12.49 1.29021 10.5489C0.0897233 6.76943 1.49218 2.45969 5.44144 1.17353C6.46468 0.843243 7.55164 0.764102 8.61152 0.942714C9.6714 1.12133 10.6734 1.55254 11.5336 2.20024V2.20024C12.3926 1.55435 13.3926 1.12419 14.4503 0.945607C15.5081 0.767024 16.593 0.845148 17.6146 1.17353C21.5526 2.45969 22.9775 6.81456 21.7658 10.5489C21.1062 12.4935 20.008 14.2582 18.5571 15.7048C16.5112 17.7095 14.254 19.4838 11.8253 20.9961L11.556 21.1541L11.2307 20.9961Z"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.6848 5.42773C16.2729 5.61626 16.7919 5.97659 17.1755 6.46284C17.5592 6.94909 17.7902 7.53921 17.839 8.15797"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MenuDots = () => (
  <svg
    width="24"
    height="4"
    viewBox="0 0 24 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="2" cy="2" r="2" fill="white" />
    <circle cx="12" cy="2" r="2" fill="white" />
    <circle cx="22" cy="2" r="2" fill="white" />
  </svg>
);
