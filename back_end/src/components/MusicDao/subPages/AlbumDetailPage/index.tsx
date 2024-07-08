import React, { lazy, Suspense, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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

import {
  ArrowIcon,
  PagePreviewIcon,
  DetailIcon,
  UnionIcon
} from '../../components/Icons/SvgIcons';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';
import { useTypedSelector } from 'store/reducers/Reducer';
import { OpenseaIcon } from '../SingleSongDetailPage';
import PlayIcon from 'components/MusicDao/components/Icons/PlayMetaIcon';
import ViewIcon from 'components/MusicDao/components/Icons/ViewMetaIcon';

import Box from 'shared/ui-kit/Box';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import {
  CircularLoadingIndicator,
  PrimaryButton,
  SecondaryButton
} from 'shared/ui-kit';
import { useShareMedia } from 'shared/contexts/ShareMediaContext';
import {
  musicDaoGetAlbumDetail,
  musicDaoGetAlbumSongs
} from 'shared/services/API';
import Loading from 'shared/ui-kit/Loading';
import { processImage } from 'shared/helpers';

import { albumDetailPageStyles } from './index.styles';

const ArtistSongCard = lazy(
  () => import('components/MusicDao/components/Cards/ArtistSongCard')
);
const ListSongCard = lazy(
  () => import('components/MusicDao/components/Cards/ListSongCard')
);

const CustomMenuItem = withStyles({
  root: {
    fontSize: '14px'
  }
})(MenuItem);

export default function AlbumDetailPage() {
  const classes = albumDetailPageStyles();
  const commonClasses = musicDaoPageStyles();

  const history = useHistory();

  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();

  const { id } = useParams<{ id: string }>();

  const user = useTypedSelector((state) => state.user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const [albumDetailData, setAlbumDetailData] = useState<any>(null);
  const [isAlbumLoading, setIsAlbumLoading] = useState<boolean>(false);

  const [isSongLoading, setIsSongLoading] = useState<boolean>(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [hasMoreSong, setHasMoreSong] = useState<boolean>(true);
  const lastId = React.useRef<string | undefined>();

  const [openShareMenu, setOpenShareMenu] = useState<boolean>(false);
  const anchorShareMenuRef = useRef<HTMLDivElement>(null);

  const [isListView, setIsListView] = useState<boolean>(false);

  const [isOnyDraftAlbum, setIsOnyDraftAlbum] = useState<boolean>(true);

  React.useEffect(() => {
    if (id) {
      setIsAlbumLoading(true);
      musicDaoGetAlbumDetail(id, user.id)
        .then((res) => {
          if (res.success) {
            setAlbumDetailData(res.data);
            setIsOnyDraftAlbum(res.data.hasNFT === true ? false : true);
          }
        })
        .finally(() => setIsAlbumLoading(false));
    }
  }, [id]);

  React.useEffect(() => {
    if (albumDetailData && albumDetailData.id) {
      loadMore();
    }
  }, [albumDetailData]);

  const loadMore = async () => {
    if (lastId.current && (!hasMoreSong || isSongLoading)) return;
    setIsSongLoading(true);

    const response = await musicDaoGetAlbumSongs(albumDetailData.id, {
      lastId: lastId?.current,
      userId: user?.id
    });
    if (response.success) {
      const newSongs = response.songs || [];
      if (newSongs.length) {
        if (lastId.current === undefined) {
          setSongs(newSongs);
        } else {
          setSongs([...songs, ...newSongs]);
        }
        setHasMoreSong(response.hasMore ?? false);
        lastId.current = newSongs[newSongs.length - 1].Id;
      }
    }
    setIsSongLoading(false);
  };
  const handleRemove = (index) => {
    if (songs.length === 1) lastId.current = undefined;
    if (lastId.current === songs[songs.length - 1].Id) {
      lastId.current = songs[songs.length - 2].Id;
    }
    let newSongs: any[] = [];
    for (let i = 0; i < songs.length; i++) {
      newSongs.push(songs[i]);
    }
    newSongs.splice(index, 1);
    setSongs(newSongs);

    let albumData = albumDetailData;
    albumData.songCount--;
    setAlbumDetailData(albumData);
  };

  const handleGotoScan = () => {
    const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(
      `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/token/${
        albumDetailData.id
      }`,
      '_blank'
    );
  };

  const handleOpensea = () => {
    const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(
      `https://${!isProd ? 'testnets.' : ''}opensea.io/assets/${
        !isProd ? 'mumbai' : 'matic'
      }/${albumDetailData.id}/1`,
      '_blank'
    );
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
    const link = `music/collection/${albumDetailData.id}`;
    shareMediaWithQrCode(albumDetailData.id, link);
  };

  const handleOpenShareModal = () => {
    const link = `music/collection/${albumDetailData.id}`;
    shareMediaToSocial(albumDetailData.id, 'Capsule', 'NEW-CAPSULES', link);
  };

  const ownerAddress = React.useMemo(() => {
    if (albumDetailData) {
      const address = albumDetailData.creatorInfo?.address || '';
      return address.length > 17
        ? address.substr(0, 13) + '...' + address.substr(address.length - 3, 3)
        : address;
    } else {
      return '';
    }
  }, [albumDetailData]);

  return (
    <Suspense fallback={<Loading />}>
      <Box className={classes.root} id="scrollContainer">
        {isAlbumLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={1}
          >
            <CircularLoadingIndicator />
          </Box>
        ) : albumDetailData ? (
          <Box className={classes.infoContainer}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                style={{ cursor: 'pointer' }}
                onClick={() => history.goBack()}
              >
                <div>
                  <ArrowIcon color={'#2D3047'} />
                </div>
                <Box
                  color="#2D3047"
                  fontSize={14}
                  fontWeight={700}
                  ml="5px"
                  mb="4px"
                >
                  BACK
                </Box>
              </Box>
              <Box className={classes.flexBox}>
                <Box className={classes.svgBox}>
                  <div ref={anchorShareMenuRef}>
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
              </Box>
            </Box>
            {!isTablet && !isMobile && (
              <Box display="flex" justifyContent="space-between" mt={3}>
                <Box
                  display="flex"
                  flexDirection="column"
                  minWidth={400}
                  maxWidth={500}
                >
                  <img
                    src={
                      processImage(albumDetailData.image) || getDefaultBGImage()
                    }
                    className={classes.artistImage}
                  />
                  {!isOnyDraftAlbum && (
                    <>
                      <div className={classes.addressSection}>
                        <Box display="flex" flexDirection="column" mr={1}>
                          <div
                            className={classes.typo1}
                          >{`Preview on Polygonscan`}</div>
                          <div
                            className={classes.typo3}
                            style={{ marginTop: '4px' }}
                          >
                            {albumDetailData?.id}
                          </div>
                        </Box>
                        <Box
                          style={{ cursor: 'pointer' }}
                          onClick={handleGotoScan}
                        >
                          <PagePreviewIcon />
                        </Box>
                      </div>
                      <div
                        className={classes.openseaSection}
                        onClick={handleOpensea}
                      >
                        <div className={classes.typo1}>Check on Opensea</div>
                        <OpenseaIcon />
                      </div>
                    </>
                  )}
                </Box>
                <Box display="flex" flexDirection="column" width={1} ml={5}>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.meta}
                    >
                      <PlayIcon />
                      <span>{`${
                        albumDetailData?.listenedCount ?? 'No'
                      } Plays`}</span>
                    </Box>
                    <div className={classes.divider} />
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.meta}
                    >
                      <ViewIcon />
                      <span>{`${
                        albumDetailData?.viewCount ?? 'No'
                      } Views`}</span>
                    </Box>
                  </Box>
                  <div className={classes.title}>
                    {albumDetailData.name || ''}
                  </div>
                  <div className={classes.subtitle}>
                    {albumDetailData.description || ''}
                  </div>
                  <Box className={classes.typo5} mt={2}>
                    {albumDetailData.creatorInfo?.name || ''}
                  </Box>
                  <Box
                    display="flex"
                    pb={2}
                    mb={2}
                    mt={1}
                    borderBottom="1px solid #0000001A"
                  >
                    <Box
                      className={classes.typo4}
                      pr={3}
                      borderRight="1px solid #00000020"
                      mr={3}
                    >
                      {albumDetailData.songCount}{' '}
                      {albumDetailData.songCount <= 1 ? 'Track' : 'Tracks'}
                    </Box>
                    <div className={classes.typo4}>
                      {new Date(albumDetailData.createdAt).getFullYear()}
                    </div>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={3}
                    mb={3}
                  >
                    <Box className={classes.typo6}>
                      All tracks in collection
                    </Box>
                    <Box
                      className={classes.controlBox}
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                    >
                      <SecondaryButton
                        className={`${commonClasses.showButton} ${
                          isListView ? commonClasses.showButtonSelected : ''
                        }`}
                        size="small"
                        onClick={() => setIsListView(true)}
                        isRounded
                      >
                        <UnionIcon />
                      </SecondaryButton>
                      <PrimaryButton
                        className={`${commonClasses.showButton} ${
                          !isListView ? commonClasses.showButtonSelected : ''
                        }`}
                        size="small"
                        onClick={() => setIsListView(false)}
                        isRounded
                        style={{ marginLeft: 0 }}
                      >
                        <DetailIcon />
                      </PrimaryButton>
                    </Box>
                  </Box>
                  <InfiniteScroll
                    hasChildren={songs.length > 0}
                    dataLength={songs.length}
                    scrollableTarget={'scrollContainer'}
                    next={loadMore}
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
                    {isListView ? (
                      <>
                        <Box
                          className={classes.listViewRow}
                          px={2}
                          py={1.5}
                          mb={1}
                        >
                          <Box width={isMobile ? 120 : 270}>Track</Box>
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                            flex="1"
                          >
                            <Box fontWeight="normal">Artist</Box>
                            <Box display="flex" alignItems="center">
                              <Box
                                width={isMobile ? 50 : isTablet ? 90 : 150}
                                color="#2D3047"
                              >
                                Genre
                              </Box>
                              <Box
                                width={isMobile ? 40 : isTablet ? 90 : 150}
                                textAlign="center"
                              >
                                Chain
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        {songs.map((song, index) => (
                          <ListSongCard
                            key={`songs-${index}`}
                            data={song}
                            collection={albumDetailData}
                          />
                        ))}
                      </>
                    ) : (
                      <Grid container spacing={2} wrap="wrap">
                        {songs.map((song, index) => (
                          <Grid key={`songs-${index}`} item md={6} lg={4}>
                            <ArtistSongCard
                              song={song}
                              // isOwner={user.id === song.creatorId}
                              onRemove={() => {
                                handleRemove(index);
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </InfiniteScroll>
                </Box>
              </Box>
            )}
            {isMobile && (
              <Box display="flex" flexDirection="column" mt={5}>
                <Box display="flex" flexDirection="column" mx={2}>
                  <img
                    src={
                      processImage(albumDetailData.image) || getDefaultBGImage()
                    }
                    className={classes.artistImage}
                  />
                  {!isOnyDraftAlbum && (
                    <>
                      <div className={classes.addressSection}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          width="90%"
                          mr={1}
                        >
                          <div
                            className={classes.typo1}
                          >{`Preview on Polygonscan`}</div>
                          <div
                            className={classes.typo3}
                            style={{ marginTop: '4px' }}
                          >
                            {albumDetailData?.id}
                          </div>
                        </Box>
                        <Box
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleGotoScan()}
                        >
                          <PagePreviewIcon />
                        </Box>
                      </div>
                      <div
                        className={classes.openseaSection}
                        onClick={() => handleOpensea()}
                      >
                        <div className={classes.typo1}>Check on Opensea</div>
                        <OpenseaIcon />
                      </div>
                    </>
                  )}
                </Box>
                <Box display="flex" flexDirection="column" width={1} mt={4}>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.meta}
                    >
                      <PlayIcon />
                      <span>{`${
                        albumDetailData?.listenedCount ?? 'No'
                      } Plays`}</span>
                    </Box>
                    <div className={classes.divider} />
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.meta}
                    >
                      <ViewIcon />
                      <span>{`${
                        albumDetailData?.viewCount ?? 'No'
                      } Views`}</span>
                    </Box>
                  </Box>
                  <div className={classes.title}>
                    {albumDetailData.name || ''}
                  </div>
                  <div className={classes.subtitle}>
                    {albumDetailData.description || ''}
                  </div>
                  <Box className={classes.typo5} mt={2}>
                    {albumDetailData.creatorInfo?.name || ''}
                  </Box>
                  <Box
                    display="flex"
                    pb={2}
                    mb={2}
                    mt={1}
                    borderBottom="1px solid #0000001A"
                  >
                    <Box
                      className={classes.typo4}
                      pr={3}
                      borderRight="1px solid #00000020"
                      mr={3}
                    >
                      {albumDetailData.songCount} Tracks
                    </Box>
                    <div className={classes.typo4}>
                      {new Date(albumDetailData.createdAt).getFullYear()}
                    </div>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box className={classes.tagLabel}>Genre</Box>
                    <Box className={classes.tag}>POP</Box>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={3}
                    mb={3}
                  >
                    <Box className={classes.typo6}>
                      All tracks in collection
                    </Box>
                    <Box
                      className={classes.controlBox}
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                    >
                      <SecondaryButton
                        className={`${commonClasses.showButton} ${
                          isListView ? commonClasses.showButtonSelected : ''
                        }`}
                        size="small"
                        onClick={() => setIsListView(true)}
                        isRounded
                      >
                        <UnionIcon />
                      </SecondaryButton>
                      <PrimaryButton
                        className={`${commonClasses.showButton} ${
                          !isListView ? commonClasses.showButtonSelected : ''
                        }`}
                        size="small"
                        onClick={() => setIsListView(false)}
                        isRounded
                        style={{ marginLeft: 0 }}
                      >
                        <DetailIcon />
                      </PrimaryButton>
                    </Box>
                  </Box>
                  <InfiniteScroll
                    hasChildren={songs.length > 0}
                    dataLength={songs.length}
                    scrollableTarget={'scrollContainer'}
                    next={loadMore}
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
                    {isListView ? (
                      <>
                        <Box
                          className={classes.listViewRow}
                          px={2}
                          py={1.5}
                          mb={1}
                        >
                          <Box width={isMobile ? 120 : isTablet ? 270 : 370}>
                            Track
                          </Box>
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                            flex="1"
                          >
                            <Box fontWeight="normal">Artist</Box>
                            <Box display="flex" alignItems="center">
                              <Box
                                width={isMobile ? 50 : isTablet ? 90 : 150}
                                color="#2D3047"
                              >
                                Genre
                              </Box>
                              <Box
                                width={isMobile ? 40 : isTablet ? 90 : 150}
                                textAlign="center"
                              >
                                Chain
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        {songs.map((song, index) => (
                          <ListSongCard
                            key={`songs-${index}`}
                            data={song}
                            collection={albumDetailData}
                          />
                        ))}
                      </>
                    ) : (
                      <Grid container spacing={2} wrap="wrap">
                        {songs.map((song, index) => (
                          <Grid key={`songs-${index}`} item xs={12}>
                            <ArtistSongCard
                              song={song}
                              // isOwner={user.id === song.creatorId}
                              onRemove={() => {
                                handleRemove(index);
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </InfiniteScroll>
                </Box>
              </Box>
            )}
            {isTablet && !isMobile && (
              <Box display="flex" flexDirection="column" mt={7}>
                <Box display="flex" alignItems="center">
                  <img
                    src={
                      processImage(albumDetailData.image) || getDefaultBGImage()
                    }
                    className={classes.artistImage}
                  />
                  <Box
                    ml="20px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    {!isOnyDraftAlbum && (
                      <>
                        <div className={classes.addressSection}>
                          <Box display="flex" flexDirection="column" mr={1}>
                            <div
                              className={classes.typo1}
                            >{`Preview on Polygonscan`}</div>
                            <div
                              className={classes.typo3}
                              style={{ marginTop: '4px' }}
                            >
                              {albumDetailData?.id}
                            </div>
                          </Box>
                          <Box
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleGotoScan()}
                          >
                            <PagePreviewIcon />
                          </Box>
                        </div>
                        <div
                          className={classes.openseaSection}
                          onClick={() => handleOpensea()}
                        >
                          <div className={classes.typo1}>Check on Opensea</div>
                          <OpenseaIcon />
                        </div>
                      </>
                    )}
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column" width={1} mt={3}>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.meta}
                    >
                      <PlayIcon />
                      <span>{`${
                        albumDetailData?.listenedCount ?? 'No'
                      } Plays`}</span>
                    </Box>
                    <div className={classes.divider} />
                    <Box
                      display="flex"
                      alignItems="center"
                      className={classes.meta}
                    >
                      <ViewIcon />
                      <span>{`${
                        albumDetailData?.viewCount ?? 'No'
                      } Views`}</span>
                    </Box>
                  </Box>
                  <div className={classes.title}>
                    {albumDetailData.name || ''}
                  </div>
                  <div className={classes.subtitle}>
                    {albumDetailData.description || ''}
                  </div>
                  <Box className={classes.typo5} mt={2}>
                    {albumDetailData.creatorInfo?.name || ''}
                  </Box>
                  <Box
                    display="flex"
                    pb={2}
                    mb={2}
                    mt={1}
                    borderBottom="1px solid #0000001A"
                  >
                    <Box
                      className={classes.typo4}
                      pr={3}
                      borderRight="1px solid #00000020"
                      mr={3}
                    >
                      {albumDetailData.songCount} Tracks
                    </Box>
                    <div className={classes.typo4}>
                      {new Date(albumDetailData.createdAt).getFullYear()}
                    </div>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box className={classes.tagLabel}>Genre</Box>
                    <Box className={classes.tag}>POP</Box>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={3}
                    mb={3}
                  >
                    <Box className={classes.typo6}>
                      All tracks in collection
                    </Box>
                    <Box
                      className={classes.controlBox}
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                    >
                      <SecondaryButton
                        className={`${commonClasses.showButton} ${
                          isListView ? commonClasses.showButtonSelected : ''
                        }`}
                        size="small"
                        onClick={() => setIsListView(true)}
                        isRounded
                      >
                        <UnionIcon />
                      </SecondaryButton>
                      <PrimaryButton
                        className={`${commonClasses.showButton} ${
                          !isListView ? commonClasses.showButtonSelected : ''
                        }`}
                        size="small"
                        onClick={() => setIsListView(false)}
                        isRounded
                        style={{ marginLeft: 0 }}
                      >
                        <DetailIcon />
                      </PrimaryButton>
                    </Box>
                  </Box>
                  <InfiniteScroll
                    hasChildren={songs.length > 0}
                    dataLength={songs.length}
                    scrollableTarget={'scrollContainer'}
                    next={loadMore}
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
                    {isListView ? (
                      <>
                        <Box
                          className={classes.listViewRow}
                          px={2}
                          py={1.5}
                          mb={1}
                        >
                          <Box width={isMobile ? 120 : isTablet ? 270 : 370}>
                            Track
                          </Box>
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                            flex="1"
                          >
                            <Box fontWeight="normal">Artist</Box>
                            <Box display="flex" alignItems="center">
                              <Box
                                width={isMobile ? 50 : isTablet ? 90 : 150}
                                textAlign="center"
                                color="#2D3047"
                              >
                                Genre
                              </Box>
                              <Box
                                width={isMobile ? 40 : isTablet ? 90 : 150}
                                textAlign="center"
                              >
                                Chain
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        {songs.map((song, index) => (
                          <ListSongCard
                            key={`songs-${index}`}
                            data={song}
                            collection={albumDetailData}
                          />
                        ))}
                      </>
                    ) : (
                      <Grid container spacing={2} wrap="wrap">
                        {songs.map((song, index) => (
                          <Grid key={`songs-${index}`} item sm={6} md={6}>
                            <ArtistSongCard
                              song={song}
                              // isOwner={user.id === song.creatorId}
                              onRemove={() => {
                                handleRemove(index);
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </InfiniteScroll>
                </Box>
              </Box>
            )}
          </Box>
        ) : null}
      </Box>
    </Suspense>
  );
}

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;
