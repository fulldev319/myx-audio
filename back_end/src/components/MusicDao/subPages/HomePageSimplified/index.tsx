import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import Carousel from 'react-spring-3d-carousel';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { Text } from 'components/MusicDao/components/ui-kit';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';
import {
  Color,
  ContentType,
  FontSize,
  PrimaryButton,
  SecondaryButton
} from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { ChevronIconLeft } from 'shared/ui-kit/Icons/chevronIconDown';
import URL from 'shared/functions/getURL';
import {
  musicDaoGetRaisedTrendingPods,
  musicDaoGetNewestSongNFts
} from 'shared/services/API';
import { getPodStatus } from 'shared/functions/utilsMusicDao';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { useAuth } from 'shared/contexts/AuthContext';
import MaintainenceContext from 'shared/contexts/MaintainenceContext';

import { ArrowLeftIcon } from '../GovernancePage/styles';
import { homePageStyles } from './index.styles';
import Loading from 'shared/ui-kit/Loading';

const ArtistCard = lazy(
  () => import('components/MusicDao/components/Cards/ArtistCard')
);
const ArtistSongCard = lazy(
  () => import('components/MusicDao/components/Cards/ArtistSongCard')
);
const CreateContentModal = lazy(
  () => import('components/MusicDao/modals/CreateContentModal')
);
const CreatePodModal = lazy(
  () => import('components/MusicDao/modals/CreateNewPodModal')
);
const CreateMutipleEditionsPod = lazy(
  () => import('components/MusicDao/modals/CreateMutipleEditionsPod')
);
const PodCard = lazy(
  () => import('components/MusicDao/components/Cards/PodCard')
);
const WhiteListModal = lazy(
  () => import('components/MusicDao/modals/WhiteListModal')
);

const TopArtistsData = (topArtists: any[], isLoading = false) => {
  const artistData: any[] = [];
  topArtists.map((data, index) => {
    artistData.push({
      key: `uuid_${data.name}_${index}`,
      content: (
        <ArtistCard
          data={data}
          customSize={{ width: 300 }}
          isLoading={isLoading}
        />
      )
    });
  });

  return artistData;
};

export default function HomePage() {
  const commonClasses = musicDaoPageStyles();
  const classes = homePageStyles();
  const history = useHistory();
  const { isOnMaintenance } = useContext(MaintainenceContext);
  const { isSignedin, accountStatus } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');

  const width = useWindowDimensions().width;
  const loadingCount = React.useMemo(
    () => (width > 1200 ? 4 : width > 960 ? 2 : 1),
    [width]
  );

  const [loadingTrendingSongs, setLoadingTrendingSongs] =
    useState<boolean>(true);
  const [trendingSongs, setTrendingSongs] = useState<any[]>([]);

  const [loadingNewestSongs, setLoadingNewestSongs] = useState<boolean>(true);
  const [newestSongs, setNewestSongs] = useState<any[]>([]);

  const [currentSlider, setCurrentSlider] = useState<number>(0);

  const [loadingTopArtists, setLoadingTopArtists] = useState<boolean>(true);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [openCreateMusicModal, setOpenCreateMusicModal] =
    useState<boolean>(false);
  const [openCreatePodModal, setOpenCreatePodModal] = useState<boolean>(false);
  const [openCreateContent, setOpenCreateContent] = useState<boolean>(false);

  const [contentType, setContentType] = useState<ContentType>(
    ContentType.SongSingleEdition
  );

  useEffect(() => {
    getTopArtists();
    getTopTrendingPods();
    getNewestSongs();
  }, []);

  const getTopArtists = () => {
    setLoadingTopArtists(true);
    axios
      .get(`${URL()}/musicDao/getTopArtists`, {})
      .then((resp) => {
        const data = resp.data;
        if (data.success) {
          setTopArtists(data.data.topArtists);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoadingTopArtists(false));
  };

  // load pods for next page
  const getTopTrendingPods = () => {
    setLoadingTrendingSongs(true);
    musicDaoGetRaisedTrendingPods()
      .then((resp) => {
        if (resp?.success) {
          const data = resp.data;
          const nextPagePods = data
            .filter((p) => getPodStatus(p))
            .map((p) => ({ ...p, status: getPodStatus(p) }));

          setTrendingSongs(nextPagePods);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingTrendingSongs(false));
  };

  // load newest tracks
  const getNewestSongs = () => {
    setLoadingNewestSongs(true);
    musicDaoGetNewestSongNFts()
      .then((resp) => {
        console.log('-------------', resp)
        if (resp?.success) {
          const data = resp.data.nfts;
          setNewestSongs(data);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingNewestSongs(false));
  };

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
    <Suspense fallback={<Loading />}>
      <Box position="relative">
        <Box className={classes.contentBox}>
          <div className={classes.header}>
            Use <span>Myx</span>
          </div>
          <Text className={classes.headerTitle} color={Color.White}>
            A revolutionary Web3 music space for artist and music lovers
          </Text>
          {isSignedin && accountStatus && (
            <Box className={classes.topBtnRow}>
              {accountStatus !== 'nolist' && (
                <div style={{ position: 'relative' }}>
                  <PrimaryButton
                    size="medium"
                    onClick={() => setOpenCreateContent(true)}
                    isRounded
                    style={{
                      background: '#2D3047',
                      paddingLeft: '58px',
                      paddingRight: '58px',
                      height: 52,
                      marginLeft: isMobile ? 0 : '8px',
                      marginTop: isMobile ? '8px' : 0
                    }}
                    disabled={isOnMaintenance}
                  >
                    Create Content
                  </PrimaryButton>
                </div>
              )}
            </Box>
          )}
          {/* <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            mt={12}
            mb={4}
          >
            <Text
              size={isMobile ? FontSize.XL : FontSize.H4}
              bold
              style={{ color: 'white' }}
            >
              Top Artists
            </Text>
            <SecondaryButton
              className={commonClasses.showAll}
              size="medium"
              radius={29}
              onClick={() => history.push('/artists')}
              style={{
                display: isMobile ? 'flex' : 'block'
              }}
            >
              Explore All
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
          </Box>
          {loadingTopArtists || topArtists?.length >= 5 ? (
            <>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                className={classes.carouselContainer}
              >
                <Box className={classes.carouselBox}>
                  <Carousel
                    slides={TopArtistsData(
                      loadingTopArtists
                        ? Array(5).fill(0)
                        : topArtists.slice(0, 5),
                      loadingTopArtists
                    )}
                    goToSlide={currentSlider}
                    showNavigation={false}
                    offsetRadius={isMobile ? 0 : isTablet ? 2 : 3}
                  />
                </Box>
              </Box>
              <Box display="flex" justifyContent="center">
                <Box className={classes.arrowBox} mt={2}>
                  <Box
                    style={{ transform: 'rotate(90deg)', cursor: 'pointer' }}
                    mr={2}
                    onClick={() => setCurrentSlider((prev) => prev - 1)}
                  >
                    <ChevronIconLeft />
                  </Box>
                  <Box
                    style={{ transform: 'rotate(-90deg)', cursor: 'pointer' }}
                    ml={2}
                    onClick={() => setCurrentSlider((prev) => prev + 1)}
                  >
                    <ChevronIconLeft />
                  </Box>
                </Box>
              </Box>
            </>
          ) : topArtists && topArtists.length >= 1 ? (
            <Grid container spacing={2}>
              {topArtists.map((artist, index) => (
                <Grid item key={`top-artist-${index}`} md={3} sm={6} xs={12}>
                  <ArtistCard data={artist} customSize={{ width: 300 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" width="100%" mb={10}>
              No top artists
            </Box>
          )} */}

          {loadingTrendingSongs || trendingSongs?.length > 0 ? (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
              mt={4}
            >
              <Text
                size={isMobile ? FontSize.XL : FontSize.H4}
                bold
                style={{ color: 'white' }}
              >
                Discover Capsules
              </Text>
              <SecondaryButton
                className={commonClasses.showAll}
                size="medium"
                radius={29}
                onClick={() => history.push('/capsules')}
                style={{
                  display: isMobile ? 'flex' : 'block'
                }}
              >
                Explore All
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
            </Box>
          ) : null}
          <Grid container spacing={2} style={{ marginBottom: 50 }}>
            {loadingTrendingSongs || trendingSongs?.length > 0
              ? (loadingTrendingSongs
                  ? Array(loadingCount).fill(0)
                  : trendingSongs
                ).map((song, index) => (
                  <Grid
                    item
                    key={`trending-pod-${index}`}
                    md={3}
                    sm={6}
                    xs={12}
                  >
                    <PodCard pod={song} isLoading={loadingTrendingSongs} />
                  </Grid>
                ))
              : null}
          </Grid>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            mt={4}
          >
            <Text
              size={isMobile ? FontSize.XL : FontSize.H4}
              bold
              style={{ color: 'white' }}
            >
              Top Tracks
            </Text>
            <SecondaryButton
              className={commonClasses.showAll}
              size="medium"
              radius={29}
              onClick={() => history.push('/music')}
              style={{
                display: isMobile ? 'flex' : 'block'
              }}
            >
              Explore All
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
          </Box>
          <Grid container spacing={2} style={{ marginBottom: 50 }}>
            {loadingNewestSongs || newestSongs?.length > 0 ? (
              (loadingNewestSongs
                ? Array(loadingCount).fill(0)
                : newestSongs
              ).map((song, index) => (
                <Grid item key={`newest-pod-${index}`} md={3} sm={6} xs={12}>
                  <ArtistSongCard song={song} isLoading={loadingNewestSongs} />
                </Grid>
              ))
            ) : (
              <Box textAlign="center" width="100%">
                No newest tracks
              </Box>
            )}
          </Grid>
        </Box>
        {openCreateMusicModal &&
          (accountStatus !== 'authorized' ? (
            <WhiteListModal
              open={openCreateMusicModal}
              handleClose={() => setOpenCreateMusicModal(false)}
            />
          ) : (
            <CreateMutipleEditionsPod //CreateSongModalNew
              onClose={() => setOpenCreateMusicModal(false)}
              handleRefresh={() => {}}
              open={openCreateMusicModal}
              type={contentType}
            />
          ))}
        {openCreatePodModal &&
          (accountStatus !== 'authorized' ? (
            <WhiteListModal
              open={openCreatePodModal}
              handleClose={() => setOpenCreatePodModal(false)}
            />
          ) : (
            <CreatePodModal
              onClose={() => {
                setOpenCreatePodModal(false);
              }}
              type={contentType}
              handleRefresh={() => {}}
              open={openCreatePodModal}
            />
          ))}
        {openCreateContent &&
          (accountStatus !== 'authorized' ? (
            <WhiteListModal
              open={openCreateContent}
              handleClose={() => setOpenCreateContent(false)}
            />
          ) : (
            <CreateContentModal
              handleClose={() => setOpenCreateContent(false)}
              onClickeContentCreation={(type) => {
                handleOpenCreatingModal(type);
              }}
              open={openCreateContent}
            />
          ))}
      </Box>
    </Suspense>
  );
}
