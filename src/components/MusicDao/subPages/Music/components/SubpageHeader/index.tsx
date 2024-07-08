import React, { useEffect, useState, useContext } from 'react';
// import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import useMediaQuery from '@material-ui/core/useMediaQuery';

// import { RootState } from 'store/reducers/Reducer';
import { Text } from 'components/MusicDao/components/ui-kit';
import { BackMobileIcon } from 'components/MusicDao/components/Icons/SvgIcons';
import EditPlaylistModal from '../../modals/EditPlaylistModal';

import { subpageHeaderStyles } from './index.styles';
import Box from 'shared/ui-kit/Box';
import { Color } from 'shared/ui-kit';
// import { useUserConnections } from 'shared/contexts/UserConnectionsContext';
// import { PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import { processImage } from 'shared/helpers';
import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';
import ActionsRow from '../ActionsRow';

export default function SubpageHeader({
  item,
  setItem,
  handleEdit = () => {},
  handleDelete = () => {}
}: {
  item: any;
  setItem: (prev: any) => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
}) {
  const classes = subpageHeaderStyles();
  // const userSelector = useSelector((state: RootState) => state.user);
  const history = useHistory();

  const mobileMatch = useMediaQuery('(max-width:600px)');
  const [openPlaylistModal, setOpenPlaylistModal] = useState<boolean>(false);

  // const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
  // const [isFollowing, setIsFollowing] = React.useState<number>(0);
  // const [followingCount, setFollowingCount] = useState(item.numFollowers);

  const { selectedSong, playerState } = useContext(MediaPlayerKeyContext);
  const [revenueCount, setRevenueCount] = React.useState<number>(11.0000235);

  const openTab = React.useMemo(() => {
    const openTabs = window.location.href.split('/#/player')[1].split('/');
    return openTabs.length > 1 ? openTabs[1] : '';
  }, [window.location.href]);

  useEffect(() => {
    if (openTab === 'playlist' && item?.songs?.length > 0) {
      const timerId = setInterval(() => {
        if (
          item.songs.find((v) => v.url === selectedSong.url) &&
          !playerState.loading &&
          playerState.playing
        ) {
          setRevenueCount((prev) => prev + 0.000025);
        }
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [openTab, item]);

  // useEffect(() => {
  //   if (item.id) {
  //     setIsFollowing(isUserFollowed(item.id));
  //   }
  // }, [item, isUserFollowed]);

  const handleOpenEditPlaylistModal = () => {
    setOpenPlaylistModal(true);
  };
  const handleCloseEditPlaylistModal = () => {
    setOpenPlaylistModal(false);
  };

  // const handleFollow = (e) => {
  //   e.stopPropagation();
  //   e.preventDefault();

  //   if (!item.id) return;

  //   if (!isFollowing) {
  //     followUser(item.id, false).then((_) => {
  //       setFollowingCount(followingCount + 1);
  //       setIsFollowing(1);
  //     });
  //   } else {
  //     unfollowUser(item.id).then((_) => {
  //       setFollowingCount(followingCount - 1);
  //       setIsFollowing(0);
  //     });
  //   }
  // };

  if (openTab && item)
    return (
      <div className={classes.headerContainer}>
        {!item.empty && (
          <div
            className={classes.header}
            style={
              openTab === 'albums'
                ? {
                    height: mobileMatch ? undefined : 310,
                    minHeight: mobileMatch ? undefined : 310,
                    maxHeight: mobileMatch ? undefined : 310,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: item.image
                      ? `url(${processImage(item.image)})`
                      : `linear-gradient(360deg, #ffffff -100%, ${item.Color} 100%)`
                  }
                : openTab === 'playlist'
                ? {
                    height: 518,
                    minHeight: 310,
                    maxHeight: 518,
                    background: item.ImageUrl
                      ? `url(${processImage(item.CoverImage)})`
                      : `linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    margin: '0 48px',
                    borderRadius: 32
                  }
                : openTab === 'artists'
                ? {
                    height: 310,
                    minHeight: 310,
                    maxHeight: 310,
                    backgroundImage: item.ImageUrl
                      ? `url(${processImage(item.ImageUrl)})`
                      : 'none'
                  }
                : openTab === 'genres'
                ? {
                    height: mobileMatch ? 310 : 518,
                    minHeight: 310,
                    maxHeight: 518,
                    backgroundImage: item.ImageUrl
                      ? `url(${item.ImageUrl})`
                      : 'none'
                  }
                : openTab === 'liked'
                ? {
                    height: 400,
                    minHeight: 400,
                    maxHeight: 400,
                    background: `linear-gradient(275.28deg, #EF28DD -2.99%, #0D15FA 100%)`,
                    borderTopLeftRadius: 16,
                    borderBottomRightRadius: 16,
                    overflow: 'hidden'
                  }
                : {
                    height: 225,
                    minHeight: 225,
                    maxHeight: 225,
                    background: `linear-gradient(90deg, #43CEA2 -20%, #185A9D 100%)`
                  }
            }
          >
            {openTab === 'liked' && (
              <img
                src={require('assets/musicDAOImages/liked_song_gradient.png')}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  height: '100%'
                }}
              />
            )}
            {mobileMatch ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                style={{
                  backgroundColor:
                    openTab === 'albums' ||
                    openTab === 'playlist' ||
                    openTab === 'artists'
                      ? 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 100%)'
                      : 'transparent',
                  height: '100%',
                  backdropFilter: openTab === 'artists' ? 'blur(20px)' : 'none'
                }}
                py={2.5}
                px={2}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-start"
                  width={1}
                  mb={3}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  <BackMobileIcon />
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent={
                    openTab === 'artists' ? 'flex-end' : 'flex-start'
                  }
                  flex={1}
                >
                  {openTab === 'albums' && (
                    <div
                      className={classes.albumImage}
                      style={{
                        backgroundImage: item.image
                          ? `url(${processImage(item.image)})`
                          : 'none',
                        position: 'relative',
                        marginTop: 16,
                        marginBottom: 8,
                        marginRight: 0
                      }}
                    />
                  )}
                  {(openTab === 'albums' || openTab === 'artists') && (
                    <label style={{ color: Color.White }}>
                      {openTab === 'artists' && item.verified && `VERIFIED `}
                      {openTab}
                      {openTab === 'artists' && item.verified && (
                        <img
                          src={require('assets/icons/check_white.webp')}
                          alt="check"
                        />
                      )}
                    </label>
                  )}
                  {openTab === 'playlist' && item.artist_name && (
                    <Box
                      display="flex"
                      alignItems="center"
                      color="white"
                      fontSize="14px"
                      marginBottom="16px"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        history.push(`/player/artists/${item.artist_name}`);
                      }}
                    >
                      <div
                        className={classes.avatar}
                        style={{
                          backgroundImage:
                            item.artist_image !== ''
                              ? `url(${item.artist_image})`
                              : 'none'
                        }}
                      />
                      <b>{item.artist_name ?? 'Artist Name'}</b>
                    </Box>
                  )}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={2}
                    style={{ flexWrap: 'wrap' }}
                  >
                    <div
                      className={classes.title}
                      style={{ fontSize: 32, color: Color.White }}
                    >
                      {openTab === 'albums'
                        ? item.album_name ?? 'Album Title'
                        : openTab === 'playlist'
                        ? item.Title ?? 'Playlist Name'
                        : openTab === 'artists'
                        ? item.artist_name ?? 'Artist Name'
                        : openTab === 'genres'
                        ? item.GenreName ?? 'Genre Name'
                        : openTab === 'liked'
                        ? 'Liked Songs'
                        : openTab === 'library'
                        ? 'Library'
                        : openTab === 'myplaylist'
                        ? 'My Playlist'
                        : 'Queued'}
                    </div>
                    {/* <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" borderRadius="100%" width={40} height={40} bgcolor="rgba(255, 255, 255, 0.3)" ml={2}>
                      <span style={{ marginLeft: 0, marginRight: 4, color: Color.White }}>3</span>
                      <img src={require("assets/icons/flash.webp")} alt="flash" />
                    </Box> */}
                  </Box>
                  {openTab === 'albums' || openTab === 'artists' ? (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      color="white"
                      fontSize="14px"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        history.push(`/player/artists/${item.artist_name}`);
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <div
                          className={classes.avatar}
                          style={{
                            backgroundImage: item.ImageUrl
                              ? `url(${processImage(item.ImageUrl)})`
                              : 'none'
                          }}
                        />
                        <b>
                          {openTab === 'artists'
                            ? `${
                                item.followers ? item.followers.length : 0
                              } followers`
                            : item.artist_name ?? 'Artist Name'}
                        </b>
                      </Box>
                      {openTab === 'albums' ? (
                        <Box display="flex" alignItems="center" mt={1}>
                          {/*<span>{item.year ?? "unknown"}</span>
                          <span>·</span>*/}
                          <span>
                            {item.songs ? item.songs.length : '0'} songs
                          </span>
                          <span>·</span>
                          <span>{item.Duration}</span>
                        </Box>
                      ) : openTab === 'artists' ? (
                        <Box display="flex" alignItems="center" mt={1}>
                          <span>{`43.752.138 Monthly listeners`}</span>
                        </Box>
                      ) : null}
                    </Box>
                  ) : openTab === 'library' ||
                    openTab === 'liked' ||
                    openTab === 'queue' ? (
                    <span>{`${item.length ?? 0} Tracks`}</span>
                  ) : openTab === 'playlist' ? (
                    <Text color={Color.White} bold>
                      {item.count || 0} Tracks
                    </Text>
                  ) : null}
                  {(openTab === 'albums' ||
                    openTab === 'artists' ||
                    openTab === 'liked' ||
                    openTab === 'queue') && (
                    <ActionsRow item={item} setItem={setItem} />
                  )}
                </Box>
              </Box>
            ) : (
              <div
                className={classes.filter}
                style={{
                  background:
                    openTab === 'albums' ||
                    openTab === 'playlist' ||
                    openTab === 'artists'
                      ? 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 100%)'
                      : openTab === 'genres'
                      ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%)'
                      : 'transparent',
                  backdropFilter:
                    openTab === 'albums'
                      ? 'blur(25.91px)'
                      : openTab === 'artists'
                      ? 'blur(20px)'
                      : 'none',
                  // background:
                  //   openTab === 'genres'
                  //     ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%)'
                  //     : 'transparent',
                  justifyContent: openTab === 'genres' ? 'center' : 'none'
                }}
              >
                {/* Image */}
                {openTab === 'albums' || openTab === 'artists' ? (
                  <div
                    style={{
                      background:
                        openTab === 'artists'
                          ? 'linear-gradient(122.33deg, #4D08BC 13.31%, #2A9FE2 93.53%)'
                          : 'none',
                      padding: openTab === 'artists' ? '6px' : 0,
                      borderRadius: openTab === 'artists' ? '100%' : 0,
                      marginRight: 24
                    }}
                  >
                    <div
                      className={classes.albumImage}
                      style={{
                        backgroundImage: item.image
                          ? `url("${processImage(item.image)}")`
                          : 'none',
                        position: 'relative',
                        borderRadius: openTab === 'artists' ? '100%' : '0'
                      }}
                    />
                  </div>
                ) : null}

                <Box
                  display="flex"
                  flexDirection="column"
                  color="white"
                  style={
                    openTab === 'artists'
                      ? {
                          height: '70%',
                          justifyContent: 'flex-end'
                        }
                      : {}
                  }
                >
                  {/* Verified image & text */}
                  {(openTab === 'albums' || openTab === 'artists') &&
                    item.verified === true && (
                      <label style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          src={require('assets/icons/verified_filled_gradient.webp')}
                          alt="verified"
                        />
                        &nbsp;&nbsp;
                        {openTab === 'artists' &&
                          item.verified &&
                          `Verified Artist`}
                        {/* {openTab === 'artists' && item.verified && (
                          <img src={require("assets/icons/check_white.webp")} alt="check" />
                        )} */}
                      </label>
                    )}
                  {/* Title */}
                  <Box display="flex" alignItems="center" /* mb={8}*/>
                    <div
                      className={classes.title}
                      style={
                        openTab === 'genres'
                          ? {
                              fontSize: 120
                            }
                          : {}
                      }
                    >
                      {openTab === 'albums'
                        ? item.Name ?? 'Album Title'
                        : openTab === 'playlist'
                        ? item.Title ?? 'Playlist Name'
                        : openTab === 'artists'
                        ? `${item.ArtistName}`
                        : openTab === 'liked'
                        ? 'Liked Songs'
                        : openTab === 'library'
                        ? 'Library'
                        : openTab === 'myplaylist'
                        ? 'My Playlist'
                        : openTab === 'genres'
                        ? `${item.GenreName}`
                        : 'Queued'}
                    </div>
                    {/* <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" borderRadius="100%" width={40} height={40} bgcolor="rgba(255, 255, 255, 0.3)" ml={2}>
                      <span style={{ marginLeft: 0, marginRight: 4 }}>3</span>
                      <img src={require("assets/icons/flash.webp")} alt="flash" />
                    </Box> */}
                  </Box>
                  {/* Other Info */}
                  {openTab === 'albums' || openTab === 'artists' ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      color="white"
                      fontSize="14px"
                      style={{ cursor: 'pointer' }}
                      // onClick={() => {
                      //   setOpenTab({type: OpenType.Artist, id: openTab === 'albums' ? item.creatorInfo.urlSlug : item.artist_name, index: history.length});
                      //   setHistory([
                      //     ...history,
                      //     { type: OpenType.Artist, id: openTab === 'albums' ? item.creatorInfo.urlSlug : item.artist_name, index: history.length },
                      //   ]);
                      // }}
                    >
                      {openTab === 'albums' ? (
                        <Box display="flex" alignItems="center">
                          {item.creatorInfo && (
                            <>
                              <b>{item.creatorInfo?.name ?? ''}</b>
                              <span>·</span>
                              <span>
                                {item.createdAt
                                  ? new Date(item.createdAt).getFullYear()
                                  : ''}
                              </span>
                              <span>·</span>
                            </>
                          )}
                          <span>
                            {item.songCount ? item.songCount : '0'} songs
                          </span>
                          {item.Duration && (
                            <>
                              <span>·</span>
                              <span>
                                {item.Duration ? `·${item.Duration}` : ''}
                              </span>
                            </>
                          )}
                        </Box>
                      ) : openTab === 'artists' ? (
                        <Box display="flex" alignItems="center" mt={1}>
                          <span>{`${item?.likes?.length ?? 0} followers`}</span>
                          {/* <span>·</span> */}
                          {/* <span>{`${item.totalReproductions} Monthly listeners`}</span> */}
                        </Box>
                      ) : null}
                    </Box>
                  ) : openTab === 'library' || openTab === 'queue' ? (
                    <span>{`${item.length ?? 0} songs`}</span>
                  ) : openTab === 'liked' ? (
                    <span>{`${item.songs.length} songs`}</span>
                  ) : openTab === 'playlist' ? (
                    <Box className={classes.infoTxt}>
                      <span>
                        {item.creatorFirstName || ''}{' '}
                        {item.creatorLastName || ''} | {item.count || 0} Songs |{' '}
                        {item.duration > 0
                          ? `${Math.floor((item.duration % 3600) / 60)}:${
                              Math.floor(item.duration % 60) < 10 ? '0' : ''
                            }${Math.floor(item.duration % 60).toFixed(0)}`
                          : '0:00'}{' '}
                        Duration
                      </span>
                    </Box>
                  ) : null}

                  {/* actions row */}
                  {(openTab === 'albums' ||
                    openTab === 'artists' ||
                    openTab === 'liked' ||
                    openTab === 'queue') && (
                    <ActionsRow item={item} setItem={setItem} />
                  )}
                  {openTab === 'playlist' && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 48,
                        right: 72
                      }}
                    >
                      <ActionsRow
                        item={item}
                        setItem={setItem}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                      />
                    </div>
                  )}
                </Box>
              </div>
            )}
            {/* Avatar and Name for playlist */}
            {openTab === 'playlist' && (
              <div
                className={classes.avatar}
                onClick={() => {
                  history.push(`/player/artists/${item.creatorUrlSlug}`);
                }}
                style={{
                  backgroundImage:
                    item.creatorImageUrl !== ''
                      ? `url(${item.creatorImageUrl})`
                      : 'none',
                  width: 128,
                  height: 128,
                  border: '8px solid #081047',
                  position: 'absolute',
                  bottom: -55,
                  left: 60,
                  cursor: 'pointer'
                }}
              />
            )}
            {/* Revenue counter */}
            {openTab === 'playlist' && (
              <div className={classes.revenue}>
                <Box mb={2}>🔥Streaming Revenue</Box>
                <Box style={{ fontSize: 40 }}>${revenueCount.toFixed(7)}</Box>
              </div>
            )}
            {/* Follow button */}
            {/* {openTab === 'artists' && userSelector.id !== item.id && (
              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                {isFollowing === 0 ? (
                  <PrimaryButton size="medium" onClick={handleFollow}>
                    Follow
                  </PrimaryButton>
                ) : (
                  <SecondaryButton size="medium" onClick={handleFollow}>
                    Unfollow
                  </SecondaryButton>
                )}
              </div>
            )} */}
            {openTab === 'playlist' && (
              <EditPlaylistModal
                playlist={item}
                open={openPlaylistModal}
                handleClose={handleCloseEditPlaylistModal}
                handleRefresh={(itm) => {
                  //if (setItem) {
                  // TODO: fix this
                  //setItem(itm);
                  //}
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  else return null;
}

const FavoriteIcon = () => (
  <svg
    width="116"
    height="111"
    viewBox="0 0 116 111"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M58.2319 110.942L56.7239 110.007C43.4074 101.628 31.0213 91.8354 19.7779 80.7964C11.9679 72.9009 6.02108 63.3369 2.37791 52.8127C-0.985616 42.758 -0.697792 31.8274 3.19 21.9664C5.12045 17.1041 8.091 12.7302 11.8904 9.15573C15.6897 5.58124 20.2243 2.8941 25.1719 1.28544C26.8384 0.684136 28.5722 0.291641 30.334 0.116944H31.0299C32.6364 -0.17806 34.2699 -0.295583 35.9017 -0.233568H36.3658C39.9843 -0.176285 43.5695 0.474811 46.9799 1.69425H47.3279C47.5261 1.76956 47.7045 1.88943 47.8497 2.04476C49.1157 2.42502 50.34 2.93401 51.5037 3.56377L53.7078 4.557C54.2753 4.88651 54.8183 5.25752 55.3319 5.66702L56.2017 6.25108C56.7302 6.54057 57.2346 6.87278 57.7098 7.24432C64.0078 2.30375 71.767 -0.369933 79.7497 -0.350346H80.04C83.7051 -0.401688 87.3523 0.170983 90.8279 1.34374C95.7342 2.92695 100.23 5.58767 103.992 9.13381C107.753 12.6799 110.686 17.0231 112.578 21.8496C116.346 31.7293 116.673 42.6045 113.506 52.6959C109.85 63.2481 103.906 72.8474 96.1058 80.7964C84.8712 91.7729 72.5497 101.561 59.334 110.007L57.884 110.883L58.2319 110.942ZM86.6517 18.1105C85.6868 18.1312 84.7516 18.4508 83.9733 19.0257C83.195 19.6006 82.6113 20.403 82.3017 21.3238C81.9617 22.4865 82.0719 23.7357 82.6101 24.8198C83.1482 25.9039 84.0743 26.7423 85.2017 27.1659C87.0343 27.8852 88.608 29.1463 89.7156 30.7834C90.8233 32.4204 91.4132 34.357 91.4078 36.3381C91.344 36.9852 91.4087 37.6387 91.5979 38.2605C91.7871 38.8824 92.097 39.4601 92.5098 39.9601C93.0747 40.6921 93.8531 41.2274 94.7354 41.4913C95.6177 41.7551 96.5598 41.7342 97.4297 41.4314C98.2996 41.1286 99.0537 40.5592 99.586 39.8029C100.118 39.0466 100.402 38.1414 100.398 37.2143V36.5133C100.495 32.541 99.3719 28.6352 97.1812 25.3306C94.9906 22.026 91.8398 19.4839 88.1598 18.0522C87.651 18.0269 87.1414 18.0861 86.6517 18.2275V18.1105Z"
      fill="white"
    />
  </svg>
);
