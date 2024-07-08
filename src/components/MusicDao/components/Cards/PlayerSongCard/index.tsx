import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import NestedMenuItem from 'material-ui-nested-menu-item';

import { useHistory } from 'react-router-dom';

import { useTypedSelector } from 'store/reducers/Reducer';
import URL from 'shared/functions/getURL';

import {
  LikedIcon,
  UnlikedIcon
} from 'components/MusicDao/subPages/GovernancePage/styles';
import ButtonMusicPlayer from '../../MusicPlayer/ButtonMusicPlayer';

import {
  mediaAddSongToPlaylist,
  musicDaoLikeSongNFT
} from 'shared/services/API';
import Box from 'shared/ui-kit/Box';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import { onGetNonDecrypt } from 'shared/ipfs/get';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import { musicDaoSongFeed } from 'shared/services/API';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import { processImage } from 'shared/helpers';
import { AddPlayListIcon } from 'components/MusicDao/components/Icons/SvgIcons';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { MusicPlatformPictures } from 'shared/constants/constants';

import { useCardStyles } from './index.styles';

export default function PlayerSongCard({
  song,
  isLoading = false,
  myPlaylists = [],
  refreshSongsList = () => {}
}: {
  song: any;
  isLoading?: boolean;
  myPlaylists: any[];
  refreshSongsList?: () => void;
}) {
  const classes = useCardStyles();
  const history = useHistory();
  const user = useTypedSelector((state) => state.user);
  const { ipfs, downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const [storedToRecently, setStoredToRecently] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [handlingLike, setHandlingLike] = useState<boolean>(false);
  const [markerPicture, setMarkerPicture] = useState<any>(undefined);

  const [addingPlayLists, setAddingPlayLists] = useState<any[]>(myPlaylists);
  const [openMenu, setOpenMenu] = useState(false);
  const anchorMenuRef = useRef<HTMLDivElement>(null);

  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    if (song?.Source) {
      const platform = song.Source.toLowerCase();
      if (MusicPlatformPictures.find((v) => v === platform)) {
        setMarkerPicture(
          require(`assets/platformImages/${platform}.webp`) ?? undefined
        );
      }
    }
  }, [song]);

  useEffect(() => {
    if (song && song.likes && user?.id) {
      if (song.likes?.find((f) => f.userId === user.id)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
  }, [song, user]);

  const getImageIPFS = async (cid: string, fileName: string) => {
    let files = await onGetNonDecrypt(
      cid,
      fileName,
      (fileCID, fileName, download) =>
        downloadWithNonDecryption(fileCID, fileName, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.buffer);
      if (fileName?.slice(-4) === '.gif') {
        setImageIPFS('data:image/gif;base64,' + base64String);
      } else {
        setImageIPFS('data:image/png;base64,' + base64String);
      }
    } else {
      setImageIPFS(getDefaultBGImage());
    }
  };

  useEffect(() => {
    if (song?.imageUrl || song?.Image) {
      setImageIPFS(processImage(song?.imageUrl || song?.Image));
    } else {
      if (ipfs && Object.keys(ipfs).length !== 0) {
        if (song && song.metadataPhoto && song.metadataPhoto.newFileCID) {
          getImageIPFS(
            song.metadataPhoto.newFileCID,
            song.metadataPhoto.metadata.properties.name
          );
        } else if (song && song.InfoImage && song.InfoImage.newFileCID) {
          getImageIPFS(
            song.InfoImage.newFileCID,
            song.InfoImage.metadata.properties.name
          );
        }
      }
    }
  }, [song, ipfs]);

  useEffect(() => {
    const filteredPlaylists = myPlaylists.filter((v) => {
      if (v.Songs?.find((s) => s === song?.id)) return false;
      return true;
    });
    setAddingPlayLists(filteredPlaylists);
  }, [myPlaylists]);

  const creatorName = useMemo(() => {
    if (song) {
      const name = song?.Artist ?? '';
      return name.length > 17
        ? name.substr(0, 13) + '...' + name.substr(name.length - 3, 3)
        : name;
    }
    return '';
  }, [song]);

  const handleFeed = () => {
    // refresh auto playing list
    refreshSongsList();

    const songId = song.Id ?? song.songId ?? song.draftId;
    // console.log({ songId, song }, 'handleFeed');

    musicDaoSongFeed(songId);
    if (!storedToRecently) {
      axios
        .post(`${URL()}/musicDao/song/updateRecentlySongAndListeningCount`, {
          data: {
            songId: songId,
            userId: user.id,
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

    if (type === 'like') {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
    try {
      setHandlingLike(true);
      const res = await musicDaoLikeSongNFT(user.id, song.Id, type);
      if (res?.success) {
      } else {
        if (type === 'like') {
          setIsLiked(false);
        } else {
          setIsLiked(true);
        }
      }
      setHandlingLike(false);
    } catch (error) {
      setHandlingLike(false);
      if (type === 'like') {
        setIsLiked(false);
      } else {
        setIsLiked(true);
      }
    }
  };

  const onGoToArtist = () => {
    if (!song) {
      return;
    }

    history.push(`/player/artists/${song.CreatorAddress}`);
  };
  const handleAddSongToPlaylist = async (playlist) => {
    try {
      const resp = await mediaAddSongToPlaylist({
        id: playlist.id,
        songs: [song.id ?? song.Id]
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

  const handleCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorMenuRef.current &&
      anchorMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpenMenu(false);
  };
  function handleListKeyDownMenu(e: React.KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault();
      setOpenMenu(false);
    }
  }

  return (
    <div className={classes.card}>
      <div className={classes.cardBox}>
        <SkeletonBox
          className={classes.album}
          loading={isLoading}
          image={imageIPFS ? imageIPFS : getDefaultBGImage()}
          height={1}
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
          }}
        />
        {!isLoading && (
          <>
            <Box className={classes.tag}>{song?.Genre}</Box>
            {markerPicture && (
              <Box className={classes.marker}>
                <img src={markerPicture} />
              </Box>
            )}
            <Box className={classes.playBtn}>
              <ButtonMusicPlayer
                isPlayerMeida={true}
                media={song}
                songId={song.Id ?? song.songId ?? song.draftId}
                feed={handleFeed}
                isFromPlayer
                isUsingAtPlayerApp
              />
            </Box>
            <Box className={classes.contentBox}>
              <div className={classes.title}>{song?.Name}</div>
              <Box
                mx="20px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <div className={classes.description}>{creatorName}</div>
                <Box display="flex" alignItems="center">
                  {isLiked ? (
                    <Box
                      className={classes.likedIcon}
                      onClick={() => {
                        handleLike('dislike');
                      }}
                    >
                      <LikedIcon color="#fff" />
                    </Box>
                  ) : (
                    <Box
                      className={classes.likedIcon}
                      onClick={() => {
                        handleLike('like');
                      }}
                    >
                      <UnlikedIcon color="#fff" />
                    </Box>
                  )}
                  <div
                    ref={anchorMenuRef}
                    onClick={() => {
                      setOpenMenu(true);
                    }}
                    style={{
                      marginLeft: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <MenuIcon />
                  </div>
                  <Popper
                    open={openMenu}
                    anchorEl={anchorMenuRef.current}
                    transition
                    disablePortal={false}
                    placement="bottom"
                    style={{ position: 'inherit' }}
                  >
                    {({ TransitionProps }) => (
                      <Grow {...TransitionProps}>
                        <Paper className={classes.paper}>
                          <ClickAwayListener onClickAway={handleCloseMenu}>
                            <MenuList
                              autoFocusItem={openMenu}
                              id="menu-list-grow"
                              onKeyDown={handleListKeyDownMenu}
                            >
                              <MenuItem onClick={onGoToArtist}>
                                Go to Artist
                              </MenuItem>
                              {/* <MenuItem onClick={onGoToAlbum}>
                            <AlbumIcon />
                            Go to Collection
                          </MenuItem> */}
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
                                        // style={{ background: '#181818' }}
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
              </Box>
            </Box>
          </>
        )}
      </div>
    </div>
  );
}

const MenuIcon = () => (
  <svg
    width="20"
    height="4"
    viewBox="0 0 20 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="18" cy="2" r="2" transform="rotate(90 18 2)" fill="#fff" />
    <circle cx="10" cy="2" r="2" transform="rotate(90 10 2)" fill="#fff" />
    <circle cx="2" cy="2" r="2" transform="rotate(90 2 2)" fill="#fff" />
  </svg>
);
