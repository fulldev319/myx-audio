import React, { lazy, Suspense, useEffect, useState } from 'react';
import Carousel from 'react-spring-3d-carousel';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDebounce } from 'use-debounce/lib';
import { useHistory } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import Loading from 'shared/ui-kit/Loading';
import { ArrowIcon } from 'shared/ui-kit/Icons/SvgIcons';
import { getWeb3Artists, getTopWeb3Artists } from 'shared/services/API';
import { usePageStyles } from './index.styles';

const WeeklySalesCard = lazy(
  () => import('components/MusicDao/components/Cards/WeeklySalesCard')
);

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
        <WeeklySalesCard
          data={data}
          customSize={{ height: 260 }}
          isLoading={isLoading}
        />
      )
    });
  });

  return artistData;
};

export default function WeeklySalesPage() {
  const classes = usePageStyles();
  const history = useHistory();

  const isMobile = useMediaQuery('(max-width:750px)');
  const isTablet = useMediaQuery('(max-width:1050px)');

  const [artists, setArtists] = useState<any[]>([]);
  const [hasMoreArtist, setHasMoreArtist] = useState<boolean>(true);
  const [loadingArtists, setLoadingArtists] = useState<boolean>(false);
  const [lastArtistId, setLastArtistId] = useState<any>();
  const [pagination, setPagination] = useState<number>(1);

  const [currentSlider, setCurrentSlider] = useState<number>(0);

  const [loadingTopArtists, setLoadingTopArtists] = useState<boolean>(false);
  const [topArtists, setTopArtists] = useState<any[]>([]);

  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);
  const [searchValue, setSearchValue] = React.useState<string>('');

  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  useEffect(() => {
    loadTopArtists();
  }, []);

  useEffect(() => {
    setArtists([]);
    loadArtists(true);
  }, [debouncedSearchValue]);

  const loadTopArtists = async () => {
    if (loadingTopArtists) return;
    try {
      setLoadingTopArtists(true);
      const responseTopArtists = await getTopWeb3Artists({});
      if (responseTopArtists.success) {
        let newCharacters = responseTopArtists.data;
        newCharacters = newCharacters.sort((a, b) =>
          a.count > b.count
            ? -1
            : a.count === b.count
            ? a.count > b.count
              ? 1
              : 1
            : 1
        );
        const filteredArtists: any[] = [];
        newCharacters.map(
          (item, index) =>
            item.image && item.image != '' && filteredArtists.push(item)
        );
        setTopArtists(filteredArtists);
      } else {
        setTopArtists([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTopArtists(false);
    }
  };

  const loadArtists = async (init = false) => {
    if (loadingArtists) return;
    try {
      setLoadingArtists(true);
      const response = await getWeb3Artists({
        pageSize: 12,
        pagination: pagination,
        searchStr: debouncedSearchValue
      });
      if (response.success) {
        let newCharacters = response.data;
        newCharacters = newCharacters.sort((a, b) =>
          a.count > b.count
            ? -1
            : a.count === b.count
            ? a.count > b.count
              ? 1
              : 1
            : 1
        );
        const newhasMore = response.hasMore;

        const filteredArtists: any[] = [];
        newCharacters.map(
          (item, index) =>
            item.image && item.image != '' && filteredArtists.push(item)
        );

        setArtists((prev) =>
          init ? filteredArtists : [...prev, ...filteredArtists]
        );
        setPagination((prev) => prev + 1);
        setHasMoreArtist(newhasMore);
      } else {
        setArtists([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingArtists(false);
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <Box
        className={classes.background}
        id={'scrollContainerForMarketplaceAllArtists'}
      >
        <div className={classes.gradientBox} />
        <Box className={classes.content}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            style={{ cursor: 'pointer', marginBottom: 16 }}
            onClick={() => history.goBack()}
          >
            <div>
              <ArrowIcon color={'#fff'} />
            </div>
            <Box color="#fff" fontSize={14} fontWeight={700} ml="5px" mb="4px">
              BACK
            </Box>
          </Box>
          <Box className={classes.title} textAlign="center" mb={7}>
            Top Web3 Artist
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
              <Box display="flex" justifyContent="center" mt={5.5}>
                <Box
                  className={classes.arrowBox}
                  mr={2}
                  onClick={() => setCurrentSlider((prev) => prev - 1)}
                >
                  <LeftArrowIcon />
                </Box>
                <Box
                  className={classes.arrowBox}
                  style={{ transform: 'rotate(-180deg)' }}
                  onClick={() => setCurrentSlider((prev) => prev + 1)}
                >
                  <LeftArrowIcon />
                </Box>
              </Box>
            </>
          ) : topArtists?.length >= 1 ? (
            <Grid container spacing={2}>
              {topArtists.map((artist, index) => (
                <Grid item key={`top-artist-${index}`} md={3} sm={6} xs={12}>
                  <WeeklySalesCard data={artist} customSize={{ height: 260 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" width="100%" mb={10} zIndex={1}>
              No Sales
            </Box>
          )}
          <Box className={classes.title} mt={6.5} mb={3}>
            All Artists
          </Box>
          {/* <Box
            display={'flex'}
            alignItems="center"
            justifyContent={'flex-end'}
            mb={2}
          > */}
          {/* <Box
              className={classes.filterBtn}
              display={'flex'}
              alignItems="center"
            >
              <FilterIcon />
              <Box className={classes.typo1} ml={2}>
                Filter
              </Box>
            </Box> */}
          {/* <div className={classes.filterButtonBox}>
              {showSearchBox && (
                <InputWithLabelAndTooltip
                  type="text"
                  inputValue={searchValue}
                  placeHolder="Search"
                  onInputValueChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                  style={{
                    background: 'transparent',
                    margin: 0,
                    marginRight: 8,
                    padding: 0,
                    border: 'none',
                    height: 'auto'
                  }}
                  theme="music dao"
                />
              )}
              <Box
                onClick={() => setShowSearchBox((prev) => !prev)}
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{ cursor: 'pointer' }}
              >
                <SearchIcon color={'#2D3047'} />
              </Box>
            </div>
          </Box> */}
          {/* All Artists - artists list */}
          <Box minHeight={260}>
            <InfiniteScroll
              hasChildren={artists.length > 0}
              dataLength={artists.length}
              scrollableTarget={'scrollContainerForMarketplaceAllArtists'}
              next={loadArtists}
              hasMore={hasMoreArtist}
              loader={<></>}
              style={{ zIndex: 1, overflow: 'inherit' }}
            >
              <Box mt={4}>
                {!loadingArtists && artists.length === 0 && (
                  <Box textAlign="center" mt={6}>
                    No Arists
                  </Box>
                )}
                <MasonryGrid
                  gutter={'16px'}
                  data={artists}
                  renderItem={(item, _) => (
                    <WeeklySalesCard
                      data={item}
                      customSize={{ height: 180 }}
                      isLoading={Object.entries(item).length === 0}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                />
              </Box>
            </InfiniteScroll>
          </Box>
        </Box>
      </Box>
    </Suspense>
  );
}

const FilterIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.729757 3.40534H2.04961C2.26219 4.15751 2.79314 4.77886 3.50308 5.106C4.21287 5.433 5.03027 5.433 5.74007 5.106C6.44986 4.77886 6.98095 4.15751 7.19339 3.40534H17.2698C17.5306 3.40534 17.7716 3.26621 17.9018 3.04048C18.0322 2.81476 18.0322 2.53648 17.9018 2.31077C17.7716 2.0849 17.5306 1.94591 17.2698 1.94591H7.19339C6.98095 1.19374 6.44986 0.572392 5.74007 0.245249C5.03027 -0.0817496 4.21287 -0.0817496 3.50308 0.245249C2.79314 0.572388 2.2622 1.19374 2.04961 1.94591H0.729757C0.469008 1.94591 0.228032 2.0849 0.0977822 2.31077C-0.0325941 2.53649 -0.0325941 2.81477 0.0977822 3.04048C0.228017 3.2662 0.469004 3.40534 0.729757 3.40534ZM4.62134 1.45948C4.94396 1.45948 5.25331 1.58759 5.48141 1.81572C5.70939 2.0437 5.83751 2.35302 5.83751 2.67565C5.83751 2.99812 5.70939 3.30748 5.48141 3.53558C5.25329 3.7637 4.94396 3.89181 4.62134 3.89181C4.29886 3.89181 3.98951 3.7637 3.76141 3.53558C3.53329 3.3076 3.40517 2.99827 3.40517 2.67565C3.40559 2.35317 3.53385 2.0441 3.76183 1.816C3.98981 1.58802 4.29888 1.45977 4.62136 1.45949L4.62134 1.45948Z"
      fill="black"
    />
    <path
      d="M17.2701 8.02696H15.4638C15.2512 7.27479 14.7202 6.65345 14.0103 6.3263C13.3005 5.99931 12.4831 5.99931 11.7733 6.3263C11.0635 6.65344 10.5324 7.27479 10.3198 8.02696H0.729757C0.469008 8.02696 0.228032 8.1661 0.0977822 8.39182C-0.0325941 8.61754 -0.0325941 8.89582 0.0977822 9.12154C0.228017 9.34726 0.469004 9.48639 0.729757 9.48639H10.3198C10.5324 10.2386 11.0635 10.8599 11.7733 11.1871C12.4831 11.5141 13.3005 11.5141 14.0103 11.1871C14.7202 10.8599 15.2512 10.2386 15.4638 9.48639H17.2701C17.5308 9.48639 17.7718 9.34726 17.9021 9.12154C18.0324 8.89582 18.0324 8.61753 17.9021 8.39182C17.7718 8.1661 17.5308 8.02696 17.2701 8.02696ZM12.8918 9.97282H12.8919C12.5693 9.97282 12.26 9.84471 12.0319 9.61659C11.8039 9.38861 11.6756 9.07928 11.6756 8.75666C11.6756 8.43403 11.8039 8.12468 12.0319 7.89673C12.26 7.66861 12.5693 7.54049 12.8919 7.54049C13.2144 7.54049 13.5238 7.66861 13.7519 7.89673C13.98 8.12471 14.1081 8.43403 14.1081 8.75666C14.1077 9.07913 13.9794 9.3882 13.7514 9.61619C13.5235 9.84431 13.2143 9.97257 12.8919 9.97285L12.8918 9.97282Z"
      fill="black"
    />
    <path
      d="M17.2703 14.1083H7.19388C6.98143 13.3561 6.45035 12.7347 5.74056 12.4076C5.03076 12.0806 4.21336 12.0806 3.50357 12.4076C2.79363 12.7347 2.26269 13.3561 2.0501 14.1083H0.730246C0.469497 14.1083 0.22852 14.2474 0.0982705 14.4731C-0.0321058 14.6988 -0.0321058 14.9771 0.0982705 15.2028C0.228506 15.4287 0.469493 15.5677 0.730246 15.5677H2.0501C2.26268 16.3199 2.79363 16.9412 3.50357 17.2684C4.21336 17.5953 5.03076 17.5953 5.74056 17.2684C6.45035 16.9412 6.98143 16.3199 7.19388 15.5677H17.2703C17.5311 15.5677 17.7721 15.4287 17.9023 15.2028C18.0327 14.9771 18.0327 14.6988 17.9023 14.4731C17.7721 14.2474 17.5311 14.1083 17.2703 14.1083ZM4.62179 16.0541C4.29931 16.0541 3.98996 15.926 3.76186 15.6979C3.53374 15.4699 3.40562 15.1606 3.40562 14.838C3.40562 14.5155 3.53374 14.2061 3.76186 13.978C3.98998 13.7499 4.29931 13.6218 4.62179 13.6218C4.94441 13.6218 5.25376 13.7499 5.48186 13.978C5.70984 14.2061 5.83796 14.5155 5.83796 14.838C5.83768 15.1604 5.70942 15.4695 5.48144 15.6976C5.25332 15.9256 4.94428 16.0538 4.6218 16.0541L4.62179 16.0541Z"
      fill="black"
    />
  </svg>
);

const LeftArrowIcon = () => (
  <svg
    width="5"
    height="10"
    viewBox="0 0 5 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.49605 10C4.62784 10 4.7464 9.94133 4.85181 9.83853C5.0494 9.61838 5.0494 9.26605 4.85181 9.06054L1.20223 4.99448L4.83863 0.94309C5.03622 0.722948 5.03622 0.370612 4.83863 0.165107C4.64104 -0.0550355 4.32479 -0.0550355 4.14034 0.165107L0.148195 4.59815C-0.0493983 4.81829 -0.0493983 5.17062 0.148195 5.37613L4.14034 9.82385C4.23261 9.94129 4.3643 9.99996 4.49609 9.99996L4.49605 10Z"
      fill="white"
    />
  </svg>
);
