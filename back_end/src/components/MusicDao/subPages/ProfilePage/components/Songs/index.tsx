import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import PodCard from 'components/MusicDao/components/Cards/PodCard';
import ArtistSongCard from 'components/MusicDao/components/Cards/ArtistSongCard';
import CreateContentModal from 'components/MusicDao/modals/CreateContentModal';
import CreateMutipleEditionsPod from 'components/MusicDao/modals/CreateMutipleEditionsPod';
import CreatePodModal from 'components/MusicDao/modals/CreateNewPodModal';
import CustomSelect from 'components/MusicDao/components/CustomSelect';

import Box from 'shared/ui-kit/Box';
import { useAuth } from 'shared/contexts/AuthContext';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { getPodStatus } from 'shared/functions/utilsMusicDao';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import {
  musicDaoGetPodsOfArtist,
  musicDaoGetAlbumsOfArtist,
  musicDaoGetCreatedSongNFts
} from 'shared/services/API';
import { SecondaryButton, ContentType } from 'shared/ui-kit';
import { MusicGenres } from 'shared/constants/constants';

import { profilePageStyles } from '../../index.styles';
const COLUMNS_COUNT_BREAK_POINTS = {
  400: 1,
  650: 2,
  1200: 3,
  1440: 4
};

const filterTagOptions = ['All Types', 'NFT', 'Draft'];
const filterTagMorOptions = ['All Genres'].concat(MusicGenres);
const filterEdition = ['All Editions', 'Regular', 'Streaming', 'Investing'];

const Songs = ({ userProfile, ownUser }) => {
  const { accountStatus } = useAuth();
  const classes = profilePageStyles();
  const width = useWindowDimensions().width;
  const loadingCount = React.useMemo(
    () => (width > 1200 ? 4 : width > 650 ? 3 : width > 400 ? 2 : 1),
    [width]
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(650));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const breakTwo = useMediaQuery(theme.breakpoints.up(400));
  const breakThree = useMediaQuery(theme.breakpoints.up(650));
  const breakFour = useMediaQuery(theme.breakpoints.up(1200));

  // const [kind, setKind] = useState<string>(filterTagOptions[0]);
  // const [edition, setEdition] = useState<string>(filterEdition[0]);
  // const [genre, setGenre] = useState<string>(filterTagMorOptions[0]);

  const history = useHistory();

  const [songs, setSongs] = React.useState<any[]>([]);
  const [isSongLoading, setIsSongLoading] = React.useState<boolean>(false);
  const [hasMoreSong, setHasMoreSong] = React.useState<boolean>(true);
  const lastSongStamp = React.useRef<any>(undefined);

  const [pods, setPods] = React.useState<any[]>([]);
  const [isPodLoading, setIsPodLoading] = React.useState<boolean>(false);
  const [hasMorePod, setHasMorePod] = React.useState<boolean>(true);
  const lastPodIdRef = React.useRef<string>('');

  const [albums, setAlbums] = useState<any[]>([]);
  const [isAlbumLoading, setIsAlbumLoading] = React.useState<boolean>(false);
  const [hasMoreAlbum, setHasMoreAlbum] = React.useState<boolean>(true);
  const lastAlbumIdRef = React.useRef<string>('');

  const [openCreateMusicModal, setOpenCreateMusicModal] = useState<boolean>(
    false
  );
  const [openCreatePodModal, setOpenCreatePodModal] = useState<boolean>(false);
  const [openCreateContent, setOpenCreateContent] = useState<boolean>(false);
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.SongSingleEdition
  );

  const [kind, setKind] = useState<string>(filterTagOptions[0]);
  const [edition, setEdition] = useState<string>(filterEdition[0]);
  const [genre, setGenre] = useState<string>(filterTagMorOptions[0]);

  useEffect(() => {
    lastSongStamp.current = undefined;
    loadMorePod();
    loadMoreAlbum();
  }, [userProfile.id]);

  useEffect(() => {
    lastSongStamp.current = undefined;
    setHasMoreSong(true);
    setSongs([]);
    loadMoreSong(true);
  }, [edition, kind, genre, userProfile.id]);

  const onChangeFilterMore = (val) => {
    setGenre(val);
  };

  const onChangeFilterKind = (val) => {
    setKind(val);
  };

  const onChangeFilterEdition = (val) => {
    setEdition(val);
  };

  const loadMorePod = () => {
    if (isPodLoading) return;
    setIsPodLoading(true);
    musicDaoGetPodsOfArtist(userProfile.id, lastPodIdRef.current)
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

  const loadMoreAlbum = () => {
    if (isAlbumLoading) return;
    setIsAlbumLoading(true);
    musicDaoGetAlbumsOfArtist(userProfile.id, lastAlbumIdRef.current)
      .then((resp) => {
        setIsAlbumLoading(false);
        if (resp?.success) {
          const data = resp.data;
          const nextPageAlbums = data.albums || [];
          setHasMoreAlbum(data.hasMore ?? false);
          setAlbums((prev) => [...prev, ...nextPageAlbums]);
          lastAlbumIdRef.current = nextPageAlbums.length
            ? nextPageAlbums[nextPageAlbums.leng - 1].id
            : '';
        }
      })
      .catch((err) => console.log(err));
  };

  const loadMoreSong = (init = false) => {
    if (isSongLoading) return;
    setIsSongLoading(true);
    musicDaoGetCreatedSongNFts(
      userProfile.id,
      ownUser,
      lastSongStamp.current,
      kind,
      genre,
      edition
    )
      .then((resp) => {
        if (resp?.success) {
          const data = resp.data;
          const nextPageSongs = data.nfts || [];
          setHasMoreSong(data.hasMore ?? false);
          setSongs((prev) =>
            init ? nextPageSongs : [...prev, ...nextPageSongs]
          );
          lastSongStamp.current = data.lastStamp;
          // lastSongStamp.current = nextPageSongs.length ? nextPageSongs[nextPageSongs.length - 1].Id : "";
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsSongLoading(false));
  };

  const handleRemove = (index) => {
    // if (songs.length === 1) lastSongIdRef.current = "";
    // if (lastSongIdRef.current === songs[songs.length - 1].Id) {
    //   lastSongIdRef.current = songs[songs.length - 2].Id;
    // }
    let newSongs: any[] = [];
    for (let i = 0; i < songs.length; i++) {
      newSongs.push(songs[i]);
    }
    newSongs.splice(index, 1);
    setSongs(newSongs);
  };

  const songListWithSkeleton = useMemo(() => {
    if (hasMoreSong) {
      let addedCount = 1;
      if (breakFour) {
        addedCount = 4 - (songs.length % 4);
      } else if (breakThree) {
        addedCount = 3 - (songs.length % 3);
      } else if (breakTwo) {
        addedCount = 2 - (songs.length % 2);
      }

      const result = [...songs];
      for (let index = 0; index < addedCount; index++) {
        result.push({});
      }

      return result;
    } else {
      return songs;
    }
  }, [songs, hasMoreSong, breakTwo, breakThree, breakFour]);

  // const onChangeFilterMore = val => {
  //   setGenre(val);
  // };

  // const onChangeFilterKind = val => {
  //   setKind(val);
  // };

  // const onChangeFilterEdition = val => {
  //   setEdition(val);
  // };

  const handleOpenCreatingModal = (type) => {
    setOpenCreateContent(false);
    setContentType(type);
    switch (type) {
      case ContentType.PodInvestment:
      case ContentType.PodCollaborative:
        setOpenCreatePodModal(true);
        break;
      case ContentType.SongSingleEdition:
      case ContentType.SongMultiEdition:
        setOpenCreateMusicModal(true);
        break;
    }
  };

  return (
    <Box py={6}>
      <div className={classes.topNFTWrapper}>
        {isPodLoading || pods.length ? (
          <Box
            className={`${classes.headerSubTitle} ${classes.fitContent}`}
            display="flex"
            alignItems={isMobile && pods.length > 1 ? 'unset' : 'center'}
            justifyContent="space-between"
            flexDirection={isMobile && pods.length > 1 ? 'column' : 'row'}
          >
            <Box
              display="flex"
              alignItems="center"
              my={3}
              justifyContent={'space-between'}
              width={1}
            >
              <Box style={{ textTransform: 'uppercase' }}>
                ALL OWNED CAPSULES
              </Box>
              {pods.length && pods.length > 4 ? (
                <SecondaryButton
                  className={classes.showAll}
                  size="medium"
                  radius={29}
                  onClick={() =>
                    history.push(`/profile/capsules/${userProfile.urlSlug}`)
                  }
                >
                  Show All
                  <Box
                    position="absolute"
                    flexDirection="row"
                    top={0}
                    right={0}
                    pr={2}
                  >
                    <ArrowLeftIcon />
                  </Box>
                </SecondaryButton>
              ) : null}
            </Box>
          </Box>
        ) : null}
        <div
          className={`${classes.topNFTContent} ${classes.fitContent}`}
          style={{
            marginTop: 0,
            marginBottom: 0
          }}
        >
          {pods && pods.length ? (
            <div className={classes.allNFTSection}>
              <MasonryGrid
                gutter={'24px'}
                data={pods.slice(0, loadingCount)}
                renderItem={(item, index) => (
                  <PodCard pod={item} key={`card_${index}`} />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
              />
            </div>
          ) : isPodLoading ? (
            <div className={classes.allNFTSection}>
              <MasonryGrid
                gutter={'24px'}
                data={Array(loadingCount).fill(0)}
                renderItem={(item, index) => (
                  <PodCard pod={item} isLoading key={`card_${index}`} />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
              />
            </div>
          ) : null}
        </div>
      </div>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={3}
        mb={4}
      >
        <Box
          className={classes.headerSubTitle}
          style={{ textTransform: 'uppercase' }}
        >
          All created tracks
        </Box>
        <Box display="flex" alignItems="center">
          {!isMobile && !isTablet && (
            <Box
              display="flex"
              alignItems="flex-end"
              flexWrap="wrap"
              mr={ownUser ? '20px' : 0}
            >
              <CustomSelect
                label={'Genre:'}
                containerStyle={classes.filterTag}
                items={filterTagMorOptions}
                onSelect={onChangeFilterMore}
                value={genre}
                theme="dark"
                width={'250px'}
              />
              {/* <CustomSelect
                label={'Type:'}
                containerStyle={classes.filterTag}
                items={filterTagOptions}
                onSelect={onChangeFilterKind}
                value={kind}
                theme="dark"
                width={'160px'}
              />
              <CustomSelect
                label={'Edition:'}
                containerStyle={classes.filterTag}
                items={filterEdition}
                onSelect={onChangeFilterEdition}
                value={edition}
                theme="dark"
                width={'200px'}
              /> */}
            </Box>
          )}
          {ownUser && accountStatus === 'authorized' && (
            <SecondaryButton
              className={classes.createSong}
              size="medium"
              radius={29}
              onClick={() => setOpenCreateContent(true)}
            >
              Create Content
            </SecondaryButton>
          )}
        </Box>
      </Box>
      {isMobile && (
        <Box display="flex" alignItems="flex-end" flexWrap="wrap">
          <Box display="flex" alignItems="center">
            <CustomSelect
              label={'Genre:'}
              containerStyle={classes.filterTag}
              items={filterTagMorOptions}
              onSelect={onChangeFilterMore}
              value={genre}
              theme="dark"
            />
            {/* <Box ml={2}>
              <CustomSelect
                label={'Type:'}
                containerStyle={classes.filterTag}
                items={filterTagOptions}
                onSelect={onChangeFilterKind}
                value={kind}
                theme="dark"
              />
            </Box> */}
          </Box>
          {/* <Box mt={1}>
            <CustomSelect
              label={'Edition:'}
              containerStyle={classes.filterTag}
              items={filterEdition}
              onSelect={onChangeFilterEdition}
              value={edition}
              theme="dark"
            />
          </Box> */}
        </Box>
      )}
      {isTablet && !isMobile && (
        <Box
          display="flex"
          alignItems="flex-end"
          flexWrap="wrap"
          justifyContent="flex-end"
        >
          <CustomSelect
            label={'Genre:'}
            containerStyle={classes.filterTag}
            items={filterTagMorOptions}
            onSelect={onChangeFilterMore}
            value={genre}
            theme="dark"
            width={'250px'}
          />
          {/* <CustomSelect
            label={'Type:'}
            containerStyle={classes.filterTag}
            items={filterTagOptions}
            onSelect={onChangeFilterKind}
            value={kind}
            theme="dark"
            width={'160px'}
          />
          <CustomSelect
            label={'Edition:'}
            containerStyle={classes.filterTag}
            items={filterEdition}
            onSelect={onChangeFilterEdition}
            value={edition}
            theme="dark"
            width={'200px'}
          /> */}
        </Box>
      )}
      {/* <Box className={classes.filter}>
        <CustomSelect
          label={"Genre:"}
          containerStyle={classes.filterTag}
          items={filterTagMorOptions}
          onSelect={onChangeFilterMore}
          value={genre}
          theme="dark"
          width={"250px"}
        />
        <CustomSelect
          label={"Type:"}
          containerStyle={classes.filterTag}
          items={filterTagOptions}
          onSelect={onChangeFilterKind}
          value={kind}
          theme="dark"
          width={"150px"}
        />
        <CustomSelect
          label={"Edition:"}
          containerStyle={classes.filterTag}
          items={filterEdition}
          onSelect={onChangeFilterEdition}
          value={edition}
          theme="dark"
          width={"200px"}
        />
      </Box> */}
      <InfiniteScroll
        hasChildren={songs.length > 0}
        dataLength={songs.length}
        scrollableTarget={'profile-infite-scroll'}
        next={loadMoreSong}
        hasMore={hasMoreSong}
        loader={
          isSongLoading && (
            <Grid container spacing={2} wrap="wrap">
              {Array(loadingCount)
                .fill(0)
                .map((song, index) => (
                  <Grid
                    key={`songs-${index}`}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                  >
                    <ArtistSongCard song={song} isLoading />
                  </Grid>
                ))}
            </Grid>
          )
        }
        style={{ overflow: 'inherit' }}
      >
        {isSongLoading || songs.length > 0 ? (
          <Box mt={4}>
            <Grid container spacing={2} wrap="wrap">
              {songListWithSkeleton.map((song, index) => (
                <Grid key={`songs-${index}`} item xs={12} sm={6} md={4} lg={3}>
                  <ArtistSongCard
                    song={song}
                    isShowEditionControl={true}
                    refresh={() => {
                      lastSongStamp.current = undefined;
                      setSongs([]);
                      loadMoreSong();
                    }}
                    onRemove={() => {
                      handleRemove(index);
                    }}
                    isLoading={Object.entries(song).length === 0}
                    openCreateContent={() => setOpenCreateContent(true)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <span>No Track</span>
        )}
      </InfiniteScroll>
      {openCreateMusicModal && (
        <CreateMutipleEditionsPod
          onClose={() => setOpenCreateMusicModal(false)}
          handleRefresh={() => {}}
          open={openCreateMusicModal}
          type={contentType}
        />
      )}
      {openCreatePodModal && (
        <CreatePodModal
          onClose={() => {
            setOpenCreatePodModal(false);
          }}
          type={contentType}
          handleRefresh={() => {}}
          open={openCreatePodModal}
        />
      )}
      {openCreateContent && (
        <CreateContentModal
          handleClose={() => setOpenCreateContent(false)}
          onClickeContentCreation={(type) => {
            handleOpenCreatingModal(type);
          }}
          open={openCreateContent}
        />
      )}
    </Box>
  );
};

export default Songs;

const ArrowLeftIcon = () => (
  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
    <path
      d="M8.40262 10.9386C8.59347 10.9386 8.76423 10.8658 8.9149 10.7201L13.6384 6.00419C13.7941 5.85854 13.8719 5.68025 13.8719 5.46931C13.8719 5.26339 13.7941 5.0851 13.6384 4.93443L8.9375 0.241071C8.85212 0.155692 8.76549 0.0941685 8.6776 0.0565011C8.5897 0.0188337 8.49805 0 8.40262 0C8.20173 0 8.03348 0.0652902 7.89788 0.195871C7.76228 0.326451 7.69448 0.492188 7.69448 0.69308C7.69448 0.793527 7.71205 0.887695 7.74721 0.975586C7.78237 1.06348 7.83259 1.14007 7.89788 1.20536L9.50251 2.83259L11.7139 4.8545L10.0374 4.75363L1.22321 4.75363C1.01228 4.75363 0.839007 4.82017 0.703404 4.95326C0.567801 5.08636 0.5 5.25837 0.5 5.46931C0.5 5.68527 0.567801 5.85979 0.703404 5.99289C0.839007 6.12598 1.01228 6.19252 1.22321 6.19252L10.0374 6.19252L11.7203 6.09264L9.50251 8.11356L7.89788 9.74079C7.83259 9.80608 7.78237 9.88267 7.74721 9.97056C7.71205 10.0585 7.69448 10.1526 7.69448 10.2531C7.69448 10.4489 7.76228 10.6122 7.89788 10.7427C8.03348 10.8733 8.20173 10.9386 8.40262 10.9386Z"
      fill="#2D3047"
    />
  </svg>
);
