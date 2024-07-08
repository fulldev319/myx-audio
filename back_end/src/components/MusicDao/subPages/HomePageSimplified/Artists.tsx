import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  useMemo,
  useCallback
} from 'react';
import Carousel from 'react-spring-3d-carousel';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';

import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

// import { RootState } from 'store/reducers/Reducer';
// import {
//   setArtistsList,
//   setScrollPositionInArtists
// } from 'store/actions/Artists';
import { setSongsList, setScrollPositionInSongs } from 'store/actions/Songs';
import { setPodsList, setScrollPositionInPods } from 'store/actions/Pods';
import Box from 'shared/ui-kit/Box';
import { Text } from 'components/MusicDao/components/ui-kit';
import { FontSize, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';
import {
  DetailIcon,
  UnionIcon
} from 'components/MusicDao/components/Icons/SvgIcons';
import { ChevronIconLeft } from 'shared/ui-kit/Icons/chevronIconDown';
import Loading from 'shared/ui-kit/Loading';
import URL from 'shared/functions/getURL';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { artistPageStyles } from './Artists.styles';

const ArtistCard = lazy(
  () => import('components/MusicDao/components/Cards/ArtistCard')
);
const CustomPopup = lazy(
  () => import('components/MusicDao/components/CustomPopup')
);
const ListArtistCard = lazy(
  () => import('components/MusicDao/components/Cards/ListArtistCard')
);

const SortType = ['Recent', 'Popular'];
const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  700: 2,
  1200: 3,
  1440: 4
};

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

export default function Artists() {
  const classes = artistPageStyles();
  const commonClasses = musicDaoPageStyles();
  const dispatch = useDispatch();

  // const artistsList = useSelector(
  //   (state: RootState) => state.artists.artistsList
  // );
  // const scrollPosition = useSelector(
  //   (state: RootState) => state.artists.scrollPositionInArtists
  // );

  const width = useWindowDimensions().width;
  const loadingCount = React.useMemo(
    () =>
      width > 1440
        ? 4
        : width > 1200
        ? 3
        : width > 700
        ? 2
        : width > 400
        ? 2
        : 1,
    [width]
  );
  const isMobile = useMediaQuery('(max-width:750px)');
  const isTablet = useMediaQuery('(max-width:1050px)');

  const theme = useTheme();
  const breakTwo = useMediaQuery(theme.breakpoints.up(700));
  const breakThree = useMediaQuery(theme.breakpoints.up(1200));
  const breakFour = useMediaQuery(theme.breakpoints.up(1440));

  const [sortType, setSortType] = useState(SortType[0]);

  const [artists, setArtists] = useState<any[]>([]);
  const [hasMoreArtist, setHasMoreArtist] = useState<boolean>(true);
  const [loadingArtists, setLoadingArtists] = useState<boolean>(false);
  // const [isListView, setIsListView] = useState<boolean>(false);

  const [currentSlider, setCurrentSlider] = useState<number>(0);

  const [lastArtistRef, setLastArtistRef] = useState<string>('');
  const [loadingTopArtists, setLoadingTopArtists] = useState<boolean>(false);
  const [topArtists, setTopArtists] = useState<any[]>([]);

  const handleSortTypeChange = (e) => {
    setSortType(e);
  };

  useEffect(() => {
    // initialize store
    dispatch(setSongsList([]));
    dispatch(setPodsList([]));
    dispatch(setScrollPositionInSongs(0));
    dispatch(setScrollPositionInPods(0));
  }, []);

  useEffect(() => {
    getTopArtists();
    getArtists(true);
  }, [sortType]);

  const getArtists = async (init = false) => {
    if (loadingArtists) return;

    setLoadingArtists(true);
    const token: string = Cookies.get('accessToken') || '';
    console.log('===========', lastArtistRef)
    axios
      .get(`${URL()}/musicDao/getAllArtists`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          sortBy: sortType,
          lastId: lastArtistRef,
        }
      })
      .then((response) => {
        if (response.data.success) {
          setArtists((prev) =>
            init
              ? response.data.data.artists
              : [...prev, ...response.data.data.artists]
          );
          // dispatch(
          //   setArtistsList(
          //     init
          //       ? [...response.data.data.artists]
          //       : [...artistsList, ...response.data.data.artists]
          //   )
          // );
          setLastArtistRef(response.data.data.artists[response.data.data.artists.length-1].id);
          setHasMoreArtist(response.data.data.hasMore);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoadingArtists(false));
  };

  const getTopArtists = () => {
    const token: string = Cookies.get('accessToken') || '';
    setLoadingTopArtists(true);
    axios
      .get(`${URL()}/musicDao/getTopArtists`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
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

  const handleScroll = useCallback(
    async (e) => {
      if (loadingArtists) {
        return;
      }
      if (
        e.target.scrollTop + e.target.clientHeight >=
        e.target.scrollHeight - 100
      ) {
        if (hasMoreArtist) {
          getArtists();
        }
      }
    },
    [hasMoreArtist, getArtists]
  );

  const artistListWithSkeleton = useMemo(() => {
    return loadingArtists
      ? artists.concat(Array(loadingCount).fill(0))
      : artists;
  }, [artists, loadingArtists, loadingCount]);

  return (
    <Suspense fallback={<Loading />}>
      <Box
        className={classes.background}
        width="100%"
        overflow="auto"
        onScroll={handleScroll}
      >
        <Box className={classes.content}>
          {/* Top artists */}
          {/* <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            mt={isMobile ? 0 : 8}
            mb={isMobile ? 0 : 4}
            zIndex={1}
          >
            <Text
              size={isMobile ? FontSize.XL : FontSize.H4}
              bold
              style={{ color: 'white', textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)' }}
            >
              Top Artists
            </Text>
          </Box>
          {loadingTopArtists || topArtists?.length >= 5 ? (
            <>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                className={classes.carouselContainer}
                zIndex={1}
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
              <Box display="flex" justifyContent="center" zIndex={1}>
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
          ) : topArtists?.length >= 1 ? (
            <Grid container spacing={2}>
              {topArtists.map((artist, index) => (
                <Grid item key={`top-artist-${index}`} md={3} sm={6} xs={12}>
                  <ArtistCard data={artist} customSize={{ width: 300 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" width="100%" mb={10} zIndex={1}>
              No top artists
            </Box>
          )} */}
          {/* All Artists - title and filter control bar */}
          <Box className={classes.topBox} mt={8} mb={3} zIndex={1}>
            <Box
              width={'100%'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Text
                size={isMobile ? FontSize.XL : FontSize.H4}
                bold
                style={{ color: 'white', textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)', whiteSpace: 'nowrap' }}
              >
                All Artists
              </Text>
              {isMobile && (
                <Box className={classes.topControlBox}>
                  <Box
                    width={'100%'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'flex-end'}
                    mt={isMobile ? 2 : 0}
                    mr={isMobile ? 0 : 2}
                  >
                    <Box className={classes.filterBox}>
                      <CustomPopup
                        items={SortType}
                        label={'Sort by'}
                        onSelect={handleSortTypeChange}
                        value={sortType}
                        theme="dark"
                      />
                    </Box>
                  </Box>
                </Box>
              )}
              {/* {isMobile && (
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
              )} */}
            </Box>
            {!isMobile && (
              <Box className={classes.topControlBox}>
                <Box
                  width={'100%'}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'flex-end'}
                  mt={isMobile ? 2 : 0}
                  mr={isMobile ? 0 : 2}
                >
                  <Box className={classes.filterBox} width={165}>
                    <CustomPopup
                      items={SortType}
                      label={'Sort by'}
                      onSelect={handleSortTypeChange}
                      value={sortType}
                      theme="dark"
                    />
                  </Box>
                </Box>
                {/* {!isMobile && (
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
                )} */}
              </Box>
            )}
          </Box>
          {/* All Artists - artists list */}
          <MasonryGrid
            gutter={'24px'}
            data={artistListWithSkeleton}
            renderItem={(item, _) => (
              <ArtistCard
                data={item}
                customSize={{ height: 400 }}
                isLoading={Object.entries(item).length === 0}
              />
            )}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
          />
        </Box>
      </Box>
    </Suspense>
  );
}
