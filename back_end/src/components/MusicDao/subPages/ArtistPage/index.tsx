import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import useTheme from '@material-ui/core/styles/useTheme';
import Skeleton from '@material-ui/lab/Skeleton';

import { StyledDivider, CircularLoadingIndicator } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import PodCard from 'components/MusicDao/components/Cards/PodCard';
import { ReactComponent as ShareIcon } from 'assets/icons/share_filled.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as MinusIcon } from 'assets/icons/minus.svg';
import { useShareMedia } from 'shared/contexts/ShareMediaContext';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import {
  musicDaoGetCreatedSongNFts,
  musicDaoGetPodsOfArtist
} from 'shared/services/API';
import { useUserConnections } from 'shared/contexts/UserConnectionsContext';
import URL from 'shared/functions/getURL';
import { getPodStatus } from 'shared/functions/utilsMusicDao';
import ArtistSongCard from 'components/MusicDao/components/Cards/ArtistSongCard';
import { useTypedSelector } from '../../../../store/reducers/Reducer';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import getPhotoIPFS from '../../../../shared/functions/getPhotoIPFS';
import { ArrowIcon } from '../../components/Icons/SvgIcons';
import { artistPageStyles } from './index.styles';
import { useAuth } from 'shared/contexts/AuthContext';

const CustomMenuItem = withStyles({
  root: {
    fontSize: '14px'
  }
})(MenuItem);

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

const TABS = ['Owned Capsules', 'Tracks'];

export default function ArtistPage() {
  const classes = artistPageStyles();
  const params: any = useParams();
  const history = useHistory();
  const artistId = params?.id;

  const userSelector = useTypedSelector((state) => state.user);

  const [artist, setArtist] = useState<any>({});
  const [loadingArtist, setLoadingArtist] = useState<boolean>(false);
  const [openShareMenu, setOpenShareMenu] = React.useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);
  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
  const [isFollowing, setIsFollowing] = React.useState<number>(
    artistId ? isUserFollowed(artistId) : 0
  );
  const [isLoadingFollow, setIsLoadingFollow] = React.useState<boolean>(false);

  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();

  const { isSignedin } = useAuth();

  const theme = useTheme();
  const tabletMatch = useMediaQuery(theme.breakpoints.down('sm'));
  const mobileMatch = useMediaQuery(theme.breakpoints.down('xs'));

  const [pods, setPods] = useState<any[]>([]);
  const [isPodLoading, setIsPodLoading] = useState<boolean>(false);
  const [hasMorePod, setHasMorePod] = useState<boolean>(true);
  const lastPodIdRef = React.useRef<string>('');

  const [songs, setSongs] = useState<any[]>([]);
  const [isSongLoading, setIsSongLoading] = useState<boolean>(false);
  const [hasMoreSong, setHasMoreSong] = useState<boolean>(true);
  const lastSongIdRef = React.useRef<string>('');

  const [avatar, setAvatar] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState(TABS[0]);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
    // fetchSocialToken(artistId);
  }, []);

  useEffect(() => {
    if (artist && artist.id && ipfs) {
      getUserPhotoIpfs(artist);
    }
  }, [artist, ipfs]);

  const getUserPhotoIpfs = async (user: any) => {
    if (
      user?.infoImage?.newFileCID &&
      user?.infoImage?.metadata?.properties?.name
    ) {
      let imageUrl = await getPhotoIPFS(
        user.infoImage.newFileCID,
        user.infoImage.metadata.properties.name,
        downloadWithNonDecryption
      );
      setAvatar(imageUrl);
    } else {
      setAvatar(getDefaultAvatar());
    }
  };

  useEffect(() => {
    if (artistId) {
      setLoadingArtist(true);
      axios
        .get(`${URL()}/user/getBasicInfo/${artistId}`)
        .then((res) => {
          if (res.data.success) {
            setLoadingArtist(false);
            setArtist({
              id: artistId,
              ...res.data.data,
              verified: true
            });
          }
        })
        .catch((err) => {
          setLoadingArtist(false);
        });

      lastPodIdRef.current = '';
      loadMorePod();

      lastSongIdRef.current = '';
      loadMoreSong();
    }
  }, [artistId]);

  const loadMorePod = () => {
    if (isPodLoading) return;
    setIsPodLoading(true);
    musicDaoGetPodsOfArtist(artistId, lastPodIdRef.current)
      .then((resp) => {
        setIsPodLoading(false);
        if (resp?.success) {
          const data = resp.data;
          const nextPagePods = (data.pods || [])
            .filter((p) => getPodStatus(p))
            .map((p) => ({ ...p, status: getPodStatus(p) }));
          setHasMorePod(data.hasMore ?? false);
          setPods((prev) => [...prev, ...nextPagePods]);
          lastPodIdRef.current = nextPagePods.length
            ? nextPagePods[nextPagePods.length - 1].Id
            : '';
        }
      })
      .catch((err) => console.log(err));
  };

  const loadMoreSong = () => {
    if (!hasMoreSong || isSongLoading) return;
    setIsSongLoading(true);
    musicDaoGetCreatedSongNFts(artistId)
      .then((resp) => {
        setIsSongLoading(false);
        if (resp?.success) {
          const data = resp.data;
          const nextPageSongs = data.nfts || [];
          setHasMoreSong(data.hasMore ?? false);
          setSongs((prev) => [...prev, ...nextPageSongs]);
          lastSongIdRef.current = nextPageSongs.length
            ? nextPageSongs[nextPageSongs.length - 1].Id
            : '';
        }
      })
      .catch((err) => console.log(err));
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

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleOpenQRCodeModal = () => {
    const link = `artists/${artistId}`;
    shareMediaWithQrCode(artistId, link);
  };

  const handleOpenShareModal = () => {
    const link = `artists/${artistId}`;
    shareMediaToSocial(artistId, 'Capsule', 'NEW-MUSIC-PODS', link);
  };

  const handleFollow = () => {
    setIsLoadingFollow(true);
    if (!isFollowing) {
      followUser(artistId, true)
        .then((_) => setIsFollowing(2))
        .then(() => {
          setArtist((prev) => {
            const newFollowers = [
              ...prev.followers,
              {
                user: userSelector.id,
                accepted: false
              }
            ];
            return { ...prev, followers: newFollowers };
          });
          setIsLoadingFollow(false);
        });
    } else {
      unfollowUser(artistId)
        .then((_) => setIsFollowing(0))
        .then(() => {
          setArtist((prev) => {
            let newFollowers = [...prev.followers];
            newFollowers = newFollowers.filter(
              (user) => user.user !== userSelector.id
            );
            return {
              ...prev,
              numFollowers: prev.numFollower - 1,
              followers: newFollowers
            };
          });
          setIsLoadingFollow(false);
        });
    }
  };

  return (
    <Box className={classes.content} id={'scrollContainer'}>
      <Box className={classes.gradient}>
        <Box className={classes.fitWidth}>
          {mobileMatch ? (
            <>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                style={{ cursor: 'pointer' }}
                onClick={() => history.goBack()}
                mb={3}
              >
                <Box>
                  <ArrowIcon color={'#54658F'} />
                </Box>
                <Box
                  color="#54658F"
                  fontSize={14}
                  fontWeight={700}
                  ml="5px"
                  mb="4px"
                >
                  BACK
                </Box>
              </Box>
              <Box
                position="relative"
                width={'100%'}
                height={441}
                borderRadius={16}
                overflow="hidden"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                ) : (
                  <Skeleton
                    animation="wave"
                    variant="rect"
                    width={'100%'}
                    height={'100%'}
                  />
                )}
              </Box>
              <Box className={classes.header2} mt={2}>
                Artist Profile
              </Box>
              <Box className={classes.headerTitle} mt={1}>
                {artist.name}
              </Box>
              {artist.verified && (
                <Box className={classes.verified}>
                  <img
                    src={require('assets/icons/verified_filled_gradient.webp')}
                    alt="verified"
                  />
                  <span>Verified Artist</span>
                </Box>
              )}
              <Box
                mt={2.5}
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Box>
                  <Box className={classes.header1}>
                    {artist.followers?.length || 0}
                  </Box>
                  <Box className={classes.header3}>Followers</Box>
                </Box>
                <Box>
                  <Box className={classes.header1}>{songs.length}</Box>
                  <Box className={classes.header3}>Tracks</Box>
                </Box>
                <Box>
                  <Box className={classes.header1}>{pods.length}</Box>
                  <Box className={classes.header3}>Capsules</Box>
                </Box>
              </Box>
              <Box mt={2} className={classes.flexBox}>
                <Box className={classes.flexBox}></Box>
                <Box mx={2} className={classes.svgBox}>
                  <div ref={anchorShareMenuRef}>
                    <ShareIcon onClick={showShareMenu} />
                  </div>
                </Box>
                {openShareMenu && (
                  <Popper
                    open={openShareMenu}
                    anchorEl={anchorShareMenuRef.current}
                    transition
                    disablePortal={false}
                    style={{ position: 'inherit' }}
                    placement="left"
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          // transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                          position: 'inherit'
                        }}
                      >
                        <Paper className={classes.paper}>
                          <ClickAwayListener onClickAway={handleCloseShareMenu}>
                            <MenuList
                              autoFocusItem={openShareMenu}
                              id="menu-list-grow"
                              onKeyDown={handleListKeyDownShareMenu}
                            >
                              <CustomMenuItem onClick={handleOpenShareModal}>
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
                              <CustomMenuItem onClick={handleOpenQRCodeModal}>
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
                {artistId !== userSelector.id &&
                  isSignedin &&
                  (isLoadingFollow ? (
                    <CircularLoadingIndicator />
                  ) : (
                    <div className={classes.whiteBox} onClick={handleFollow}>
                      <Box className={classes.svgBox}>
                        {isFollowing === 0 ? <PlusIcon /> : <MinusIcon />}
                      </Box>
                      <Box ml={1} fontSize={12}>
                        {isFollowing === 0 ? 'Follow' : 'Unfollow'}
                      </Box>
                    </div>
                  ))}
                {/* <Box ml={2}>
                <FruitSelect fruitObject={artist} onGiveFruit={handleFruit} />
              </Box> */}
              </Box>
              <StyledDivider type="solid" mt={2} />
            </>
          ) : tabletMatch ? (
            <>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                style={{ cursor: 'pointer' }}
                onClick={() => history.goBack()}
                mb={3}
              >
                <Box>
                  <ArrowIcon color={'#54658F'} />
                </Box>
                <Box
                  color="#54658F"
                  fontSize={14}
                  fontWeight={700}
                  ml="5px"
                  mb="4px"
                >
                  BACK
                </Box>
              </Box>
              <Grid container spacing={4}>
                <Grid item md={6}>
                  <Box className={classes.header2} mt={2}>
                    Artist Profile
                  </Box>
                  <Box className={classes.headerTitle} mt={1}>
                    {artist.name}
                  </Box>
                  {artist.verified && (
                    <Box className={classes.verified} mb={2.5}>
                      <img
                        src={require('assets/icons/verified_filled_gradient.webp')}
                        alt="verified"
                      />
                      <span>Verified Artist</span>
                    </Box>
                  )}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Box className={classes.header1}>
                        {artist.followers?.length || 0}
                      </Box>
                      <Box className={classes.header3}>Followers</Box>
                    </Box>
                    <Box>
                      <Box className={classes.header1}>{songs.length}</Box>
                      <Box className={classes.header3}>Tracks</Box>
                    </Box>
                    <Box>
                      <Box className={classes.header1}>{pods.length}</Box>
                      <Box className={classes.header3}>Pods</Box>
                    </Box>
                  </Box>
                  <Box mt={2} className={classes.flexBox}>
                    <Box className={classes.flexBox}></Box>
                    <Box mx={2} className={classes.svgBox}>
                      <div ref={anchorShareMenuRef}>
                        <ShareIcon onClick={showShareMenu} />
                      </div>
                    </Box>
                    {openShareMenu && (
                      <Popper
                        open={openShareMenu}
                        anchorEl={anchorShareMenuRef.current}
                        transition
                        disablePortal={false}
                        style={{ position: 'inherit' }}
                        placement="left"
                      >
                        {({ TransitionProps, placement }) => (
                          <Grow
                            {...TransitionProps}
                            style={{
                              // transformOrigin: placement === "bottom" ? "center top" : "center bottom",
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
                    {artist.id !== userSelector.id &&
                      isSignedin &&
                      (isLoadingFollow ? (
                        <CircularLoadingIndicator />
                      ) : (
                        <div
                          className={classes.whiteBox}
                          onClick={handleFollow}
                        >
                          <Box className={classes.svgBox}>
                            {isFollowing === 0 ? <PlusIcon /> : <MinusIcon />}
                          </Box>
                          <Box ml={1} fontSize={12}>
                            {isFollowing === 0 ? 'Follow' : 'Unfollow'}
                          </Box>
                        </div>
                      ))}
                    {/* <Box ml={2}>
                    <FruitSelect fruitObject={artist} onGiveFruit={handleFruit} />
                  </Box> */}
                  </Box>
                </Grid>
              </Grid>
              {avatar ? (
                <img src={avatar} className={classes.artistImage} />
              ) : (
                <div className={classes.artistImage}>
                  <Skeleton
                    animation="wave"
                    variant="rect"
                    width={'100%'}
                    height={'100%'}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <Grid container style={{ position: 'relative' }} spacing={8}>
                <Grid item xs={12} sm={8}>
                  <Box
                    className={classes.flexBox}
                    justifyContent="space-between"
                  >
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      style={{ cursor: 'pointer' }}
                      onClick={() => history.goBack()}
                    >
                      <Box>
                        <ArrowIcon color={'#54658F'} />
                      </Box>
                      <Box
                        color="#54658F"
                        fontSize={14}
                        fontWeight={700}
                        ml="5px"
                        mb="4px"
                      >
                        BACK
                      </Box>
                    </Box>
                    <Box className={classes.flexBox}>
                      <Box className={classes.flexBox}></Box>
                      <Box mx={2} className={classes.svgBox}>
                        <div ref={anchorShareMenuRef}>
                          {/* <ShareIcon onClick={showShareMenu} /> */}
                          <img
                            src={require('assets/icons/share_dark.webp')}
                            alt="share"
                            onClick={showShareMenu}
                          />
                        </div>
                      </Box>
                      {openShareMenu && (
                        <Popper
                          open={openShareMenu}
                          anchorEl={anchorShareMenuRef.current}
                          transition
                          disablePortal={false}
                          style={{ position: 'inherit' }}
                          placement="bottom"
                        >
                          {({ TransitionProps, placement }) => (
                            <Grow
                              {...TransitionProps}
                              style={{
                                // transformOrigin: placement === "bottom" ? "center top" : "center bottom",
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
                      {artistId !== userSelector.id &&
                        isSignedin &&
                        (isLoadingFollow ? (
                          <CircularLoadingIndicator />
                        ) : (
                          <div
                            className={classes.whiteBox}
                            onClick={handleFollow}
                          >
                            <Box className={classes.svgBox}>
                              {isFollowing === 0 ? <PlusIcon /> : <MinusIcon />}
                            </Box>
                            <Box ml={1} fontSize={12}>
                              {isFollowing === 0 ? 'Follow' : 'Unfollow'}
                            </Box>
                          </div>
                        ))}
                      {/* <Box ml={2}>
                    <FruitSelect fruitObject={artist} onGiveFruit={handleFruit} />
                  </Box> */}
                    </Box>
                  </Box>
                  <Box className={classes.header2} mt={2}>
                    Artist Profile
                  </Box>
                  <Box className={classes.headerTitle} mt={1}>
                    {artist.name}
                  </Box>
                  {artist.verified && (
                    <Box className={classes.verified}>
                      <img
                        src={require('assets/icons/verified_filled_gradient.webp')}
                        alt="verified"
                      />
                      <span>Verified Artist</span>
                    </Box>
                  )}
                  <Box
                    className={classes.flexBox}
                    // justifyContent="space-between"
                    mt={3}
                    borderTop="1px solid #00000022"
                    pt={4}
                  >
                    <Box>
                      <Box className={classes.header1}>
                        {artist.followers?.length || 0}
                      </Box>
                      <Box className={classes.header3}>Followers</Box>
                    </Box>
                    <Box className={classes.vert} />
                    <Box>
                      <Box className={classes.header1}>{songs.length}</Box>
                      <Box className={classes.header3}>Tracks</Box>
                    </Box>
                    <Box className={classes.vert} />
                    <Box>
                      <Box className={classes.header1}>{pods.length}</Box>
                      <Box className={classes.header3}>Pods</Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              {avatar ? (
                <img src={avatar} className={classes.artistImage} />
              ) : (
                <div className={classes.artistImage}>
                  <Skeleton
                    animation="wave"
                    variant="rect"
                    width={'100%'}
                    height={'100%'}
                  />
                </div>
              )}
            </>
          )}
        </Box>
      </Box>
      <Box className={classes.tabs}>
        <Box display="flex" className={classes.tabContainer}>
          {TABS.map((tab, index) => (
            <Box
              key={`tab-${index}`}
              className={`${classes.tab} ${
                tab === currentTab ? classes.selectedTab : ''
              }`}
              onClick={() => setCurrentTab(tab)}
            >
              {tab}
            </Box>
          ))}
        </Box>
      </Box>
      <Box className={classes.claimTable}>
        {currentTab === TABS[0] ? (
          <>
            <Box className={classes.headerSubTitle}>ALL OWNED CAPSULES</Box>
            <InfiniteScroll
              hasChildren={pods.length > 0}
              dataLength={pods.length}
              scrollableTarget={'scrollContainer'}
              next={loadMorePod}
              hasMore={hasMorePod}
              loader={
                isPodLoading && (
                  <LoadingIndicatorWrapper>
                    <CircularLoadingIndicator />
                  </LoadingIndicatorWrapper>
                )
              }
              style={{ overflow: 'inherit' }}
            >
              <Box mt={4}>
                <Grid container spacing={2} wrap="wrap">
                  {pods.map((pod, index) => (
                    <Grid
                      key={`pods-${index}`}
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                    >
                      <PodCard pod={pod} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </InfiniteScroll>
          </>
        ) : (
          <>
            <Box className={classes.headerSubTitle}>All created tracks</Box>
            <InfiniteScroll
              hasChildren={songs.length > 0}
              dataLength={songs.length}
              scrollableTarget={'scrollContainer'}
              next={loadMoreSong}
              hasMore={hasMoreSong}
              loader={
                isSongLoading && (
                  <LoadingIndicatorWrapper>
                    <CircularLoadingIndicator />
                  </LoadingIndicatorWrapper>
                )
              }
              style={{ overflow: 'inherit' }}
            >
              <Box mt={4}>
                <Grid container spacing={2} wrap="wrap">
                  {songs.map((song, index) => (
                    <Grid
                      key={`songs-${index}`}
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                    >
                      <ArtistSongCard song={song} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </InfiniteScroll>
          </>
        )}

        {/* <Box mt={6}>
          <Box className={classes.headerSubTitle}>Social Token</Box>
          <div className={classes.socialTokenSection}>
            {token ? (
              <>
                <img
                  src={
                    tokenImageIPFS ? tokenImageIPFS : require("assets/musicDAOImages/social_token_mgr.webp")
                  }
                  alt="social_token"
                  style={{
                    paddingRight: "20px",
                    paddingBottom: mobileMatch ? "15px" : "0",
                    width: mobileMatch ? "100%" : "160px",
                  }}
                />
                <div>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={mobileMatch ? "center" : "flex-start"}
                  >
                    <Box>
                      <Box className={classes.typo2} style={{ color: "#54658F" }}>
                        Capsule Token Name
                      </Box>
                      <Box className={classes.typo1} style={{ color: "#2D3047" }}>
                        {token.TokenName}
                      </Box>
                    </Box>
                    <div
                      style={{
                        width: "1px",
                        height: "40px",
                        background: "#ddd",
                        margin: mobileMatch ? "0 20px" : "0 50px",
                      }}
                    ></div>
                    <Box>
                      <Box className={classes.typo2} style={{ color: "#54658F" }}>
                        Symbol
                      </Box>
                      <Box className={classes.typo1} style={{ color: "#2D3047" }}>
                        {token.TokenSymbol}
                      </Box>
                    </Box>
                  </Box>
                  <Box className={classes.typo3} style={{ color: "#54658F" }} pt={2}>
                    {token.Description}
                  </Box>
                </div>
              </>
            ) : (
              <Box>No Social Token Data</Box>
            )}
          </div>
        </Box> */}
      </Box>
    </Box>
  );
}
