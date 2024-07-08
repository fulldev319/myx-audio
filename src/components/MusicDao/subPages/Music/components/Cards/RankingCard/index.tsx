import React, { useContext, useRef, useState } from 'react';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';

// import { useTypedSelector } from 'store/reducers/Reducer';
import {
  CopyAddressIcon,
  DownloadQRIcon,
  FaceBookShareIcon,
  // InstagramShareIcon,
  SongShareIcon,
  TwitterShareIcon
} from 'components/MusicDao/components/Icons/SvgIcons';

import Box from 'shared/ui-kit/Box';
import MusicContext from 'shared/contexts/MusicContext';
import URLTraxMicroservice from 'shared/functions/getURLMusicMicroservice';
import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
// import { FruitSelect } from 'shared/ui-kit/Select/FruitSelect';
import { processImage } from 'shared/helpers';

import { rankingCardStyles } from './index.styles';

const RANDOM_MOCK_PLAYLISTS_LENGTH = 19;

export default function RankingCard({ item, myPlaylists }) {
  const classes = rankingCardStyles();
  // const user = useTypedSelector((state) => state.user);
  const history = useHistory();
  const { setQRCodeValue, setShowQRCodeDownload, setCopyLink } =
    useContext(MusicContext);

  const [shareOpenMenu, setShareOpenMenu] = useState<boolean>(false);
  const anchorShareMenuRef = useRef<HTMLImageElement>(null);
  const [song, setSong] = useState<any>(item);

  const [status, setStatus] = useState<any>('');

  const handleShareOpenMenu = (event: React.MouseEvent<EventTarget>) => {
    event.stopPropagation();
    setShareOpenMenu(true);
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

  const [playlistOpenMenu, setPlaylistOpenMenu] = useState<boolean>(false);
  const anchorPlaylistMenuRef = useRef<HTMLImageElement>(null);

  const handlePlaylistOpenMenu = (event: React.MouseEvent<EventTarget>) => {
    event.stopPropagation();
    setPlaylistOpenMenu(true);
  };

  const handlePlaylistCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorShareMenuRef.current &&
      anchorShareMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setPlaylistOpenMenu(false);
  };

  const handleListKeyDownPlaylistMenu = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setPlaylistOpenMenu(false);
    }
  };

  const addSongToMyPlaylist = (playlist: any) => {
    const token: string = Cookies.get('accessToken') || '';
    axios
      .post(`${URLTraxMicroservice()}/playlists/addSongsToPlaylist`, {
        id: playlist.id,
        songs: [song.song_name],
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.success) {
          setStatus({
            msg: 'Song added to Playlist',
            key: Math.random(),
            variant: 'success'
          });
          /*setTimeout(() => {
            setStatus("");
          }, 2000);*/
        } else {
          setStatus({
            msg: 'Error adding to Playlist',
            key: Math.random(),
            variant: 'error'
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setStatus({
          msg: 'Error adding to Playlist',
          key: Math.random(),
          variant: 'error'
        });
      });
  };

  const getShareUrl = React.useMemo(() => {
    return `${window.location.origin}/#/player/albums/${item.album_name}/${item.song_name}`;
  }, [item]);

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

  // const handleFruit = (type) => {
  //   const token: string = Cookies.get('accessToken') || '';
  //   const body = {
  //     userId: user.id,
  //     podAddress: song.song_name,
  //     fruitId: type,
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   };
  //   axios.post(`${URLTraxMicroservice()}/songs/fruit`, body).then((res) => {
  //     if (res.data?.success) {
  //       const itemCopy = { ...song };
  //       itemCopy.fruits = [
  //         ...(itemCopy.fruits || []),
  //         { userId: user.id, fruitId: type, date: new Date().getTime() }
  //       ];
  //       setSong(itemCopy);
  //     }
  //   });
  // };

  return (
    <div className={classes.card}>
      <div
        onClick={() => {
          history.push(`/player/albums/${song.album_name}/${song.id}`);
        }}
        className={classes.album}
        style={{
          backgroundImage: processImage(
            song.image
              ? `url(${song.image})`
              : song.album_image
              ? `url(${song.album_image})`
              : `url(${require(`assets/mediaIcons/mockup/playlist_mock_up_${
                  Math.floor(Math.random() * RANDOM_MOCK_PLAYLISTS_LENGTH) + 1
                }.webp`)})`
          )
        }}
      />
      <div className={classes.title}>
        {song.song_name || song.MediaName || 'Song name'}
      </div>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        px={3}
        mt={1}
        width={1}
        style={{ paddingTop: '20px', marginTop: '0' }}
      >
        {/* <img style={{width: "20px", height: "20px"}}
             src={require("assets/musicDAOImages/fruit.webp")}
             alt="trending" /> */}
        {/* <FruitSelect
          fruitObject={song}
          members={[]}
          onGiveFruit={handleFruit}
          style={{ background: 'transparent' }}
        /> */}
        <img
          style={{ width: '20px', height: '20px' }}
          ref={anchorShareMenuRef}
          onClick={handleShareOpenMenu}
          src={require('assets/musicDAOImages/upload.webp')}
          alt="upload"
        />
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
                    <MenuItem onClick={handleTrackingShare}>
                      <TwitterShareButton
                        url={getShareUrl}
                        className={classes.shareButton}
                      >
                        <TwitterShareIcon />
                        <span>Share on Twitter</span>
                      </TwitterShareButton>
                    </MenuItem>
                    <MenuItem onClick={handleTrackingShare}>
                      <FacebookShareButton
                        url={getShareUrl}
                        className={classes.shareButton}
                      >
                        <FaceBookShareIcon />
                        <span>Share on Facebook</span>
                      </FacebookShareButton>
                    </MenuItem>
                    {/* <MenuItem>
                      <InstagramShareIcon />
                      Share on Instagram
                    </MenuItem> */}
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
        <img
          style={{ width: '20px', height: '20px' }}
          ref={anchorPlaylistMenuRef}
          onClick={handlePlaylistOpenMenu}
          src={require('assets/musicDAOImages/add-list.webp')}
          alt="addlist"
        />
        <Popper
          open={playlistOpenMenu}
          anchorEl={anchorPlaylistMenuRef.current}
          transition
          disablePortal={false}
          placement="bottom"
          style={{ position: 'inherit' }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={handlePlaylistCloseMenu}>
                  <MenuList
                    autoFocusItem={shareOpenMenu}
                    id="playlist-menu-list-grow"
                    onKeyDown={handleListKeyDownPlaylistMenu}
                  >
                    {myPlaylists && myPlaylists.length > 0 ? (
                      myPlaylists.map((playlist, index) => {
                        return (
                          <MenuItem
                            onClick={() => {
                              addSongToMyPlaylist(playlist);
                              setPlaylistOpenMenu(false);
                            }}
                          >
                            {playlist.Title || ''}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <MenuItem>No playlists</MenuItem>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
      {status ? (
        <AlertMessage message={status.msg} variant={status.variant} />
      ) : (
        ''
      )}
    </div>
  );
}
