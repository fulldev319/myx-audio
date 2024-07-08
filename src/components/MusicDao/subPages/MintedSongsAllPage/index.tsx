import React, { Suspense, lazy, useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import { useDebounce } from 'use-debounce/lib';
import { useDispatch, useSelector } from 'react-redux';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import { RootState } from 'store/reducers/Reducer';
import { setSongsList, setScrollPositionInSongs } from 'store/actions/Songs';
// import {
//   setArtistsList,
//   setScrollPositionInArtists
// } from 'store/actions/Artists';
// import { setPodsList, setScrollPositionInPods } from 'store/actions/Pods';
// import { setMusicsList, setScrollPositionInMusics } from 'store/actions/Musics';
import {
  setCollectionsList,
  setScrollPositionInCollections
} from 'store/actions/Collections';
import { /*SearchIcon,*/ ArrowIcon } from '../../components/Icons/SvgIcons';
import Box from 'shared/ui-kit/Box';
import Loading from 'shared/ui-kit/Loading';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
// import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
// import { Color } from 'shared/ui-kit';
import { getAllWeb3Songs } from 'shared/services/API';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';

import { usePageStyles } from './index.styles';

const NFTTrackCard = lazy(
  () => import('components/MusicDao/components/Cards/NFTTrackCard')
);

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 2,
  700: 2,
  1200: 3,
  1440: 4
};

export default function MintedSongsAllPage() {
  const classes = usePageStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const songsList = useSelector((state: RootState) => state.songs.songsList);
  const scrollPosition = useSelector(
    (state: RootState) => state.songs.scrollPositionInSongs
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  // const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [songs, setSongs] = useState<any[]>(songsList || []);
  const [lastSongId, setLastSongId] = useState<any>();
  const [songHasMore, setSongHasMore] = useState<boolean>(false);
  const [isSongLoading, setIsSongLoading] = useState<boolean>(false);
  // const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);
  const [searchValue, setSearchValue] = React.useState<string>('');

  const [debouncedSearchValue] = useDebounce(searchValue, 500);

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
        : 2,
    [width]
  );

  useEffect(() => {
    // initialize store

    setCollectionsList([]);
    setScrollPositionInCollections(0);
    // dispatch(setArtistsList([]));
    // dispatch(setMusicsList([]));
    // dispatch(setPodsList([]));
    // dispatch(setScrollPositionInMusics(0));
    // dispatch(setScrollPositionInArtists(0));
    // dispatch(setScrollPositionInPods(0));
  }, []);

  useEffect(() => {
    loadSongs(true);
  }, [debouncedSearchValue]);

  const loadSongs = async (init = false) => {
    if (isSongLoading) return;
    try {
      setIsSongLoading(true);

      const response = await getAllWeb3Songs({
        lastId: init ? undefined : lastSongId,
        pageSize: 12,
        status: undefined,
        search: debouncedSearchValue
      });
      if (response.success) {
        const newCharacters = response.data;
        const newLastId = response.lastId;
        const newhasMore = response.hasMore;
        setSongs((prev) =>
          init ? newCharacters : [...prev, ...newCharacters]
        );
        dispatch(
          setSongsList(
            init ? [...newCharacters] : [...songsList, ...newCharacters]
          )
        );
        setLastSongId(newLastId);
        setSongHasMore(newhasMore);
      } else {
        setSongs([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSongLoading(false);
    }
  };

  const handleScroll = (e) => {
    dispatch(setScrollPositionInSongs(e.target.scrollTop));
  };

  return (
    <Suspense fallback={<Loading />}>
      <Box
        className={classes.collectionsRoot}
        id={'scrollContainerInSongs'}
        onScroll={handleScroll}
      >
        <Box className={classes.content}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={4}
          >
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              style={{ cursor: 'pointer' }}
              onClick={() => history.goBack()}
            >
              <div>
                <ArrowIcon color={'#fff'} />
              </div>
              <Box
                color="#fff"
                fontSize={14}
                fontWeight={700}
                ml="5px"
                mb="4px"
              >
                BACK
              </Box>
            </Box>
          </Box>
          <Box className={classes.nftCollectionSection}>
            <Box className={classes.title}>All Songs</Box>
            {/* <Box
              display={'flex'}
              alignItems="center"
              justifyContent={'space-between'}
              mt={4.5}
            >
              <Box
                className={classes.filterBtn}
                display={'flex'}
                alignItems="center"
              >
                <FilterIcon />
                <Box className={classes.typo1} ml={2}>
                  Filter
                </Box>
              </Box>
              <div className={classes.filterButtonBox}>
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
                  <SearchIcon color={Color.MusicDAODark} />
                </Box>
              </div>
            </Box> */}
            <Box>
              <InfiniteScroll
                hasChildren={songs.length > 0}
                dataLength={songs.length}
                scrollableTarget={'scrollContainerInSongs'}
                next={() => loadSongs()}
                hasMore={songHasMore}
                initialScrollY={scrollPosition - 300}
                loader={
                  isSongLoading && (
                    <MasonryGrid
                      gutter={isMobile ? '8px' : '16px'}
                      data={Array(loadingCount).fill(0)}
                      renderItem={(item, _) => (
                        <NFTTrackCard
                          data={item}
                          isLoading={Object.entries(item).length === 0}
                        />
                      )}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                    />
                  )
                }
              >
                <Box mt={4} style={{ marginBottom: isMobile ? '8px' : '16px' }}>
                  {!isSongLoading && songs.length === 0 && (
                    <Box textAlign="center" mt={6}>
                      No Songs
                    </Box>
                  )}
                  <MasonryGrid
                    gutter={isMobile ? '8px' : '16px'}
                    data={songs}
                    renderItem={(item, _) => (
                      <NFTTrackCard
                        data={item}
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
