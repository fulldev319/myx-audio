import React, { Suspense, lazy, useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDebounce } from 'use-debounce/lib';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import { RootState } from 'store/reducers/Reducer';
import { setSongsList, setScrollPositionInSongs } from 'store/actions/Songs';
// import {
//   setArtistsList,
//   setScrollPositionInArtists
// } from 'store/actions/Artists';
// import { setSongsList, setScrollPositionInSongs } from 'store/actions/Songs';
// import { setPodsList, setScrollPositionInPods } from 'store/actions/Pods';
// import { setMusicsList, setScrollPositionInMusics } from 'store/actions/Musics';
import {
  setCollectionsList,
  setScrollPositionInCollections
} from 'store/actions/Collections';
import Box from 'shared/ui-kit/Box';
import Loading from 'shared/ui-kit/Loading';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { Color } from 'shared/ui-kit';
import { getNFTCollections } from 'shared/services/API';
import { ArrowIcon } from 'shared/ui-kit/Icons/SvgIcons';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { SearchIcon } from '../../components/Icons/SvgIcons';
import { usePageStyles } from './index.styles';

const NFTCollectionCard = lazy(
  () => import('components/MusicDao/components/Cards/NFTCollectionCard')
);

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  400: 2,
  700: 2,
  1200: 3,
  1440: 3
};

export default function CollectionsAllPage() {
  const classes = usePageStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const collectionsList = useSelector(
    (state: RootState) => state.collections.collectionsList
  );
  const scrollPosition = useSelector(
    (state: RootState) => state.collections.scrollPositionInCollections
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [collections, setCollections] = useState<any[]>(collectionsList || []);
  const [lastCollectionId, setLastCollectionId] = useState<any>();
  const [collectionHasMore, setCollectionHasMore] = useState<boolean>(false);
  const [isCollectionLoading, setIsCollectionLoading] =
    useState<boolean>(false);

  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);
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

    dispatch(setSongsList([]));
    dispatch(setScrollPositionInSongs(0));
    // dispatch(setArtistsList([]));
    // dispatch(setMusicsList([]));
    // dispatch(setPodsList([]));
    // dispatch(setScrollPositionInMusics(0));
    // dispatch(setScrollPositionInArtists(0));
    // dispatch(setScrollPositionInPods(0));
  }, []);

  useEffect(() => {
    loadCollections(true);
  }, [debouncedSearchValue]);

  const loadCollections = async (init = false) => {
    if (isCollectionLoading) return;
    try {
      setIsCollectionLoading(true);

      const response = await getNFTCollections({
        lastId: init ? undefined : lastCollectionId,
        pageSize: 12,
        searchStr: debouncedSearchValue
      });
      if (response.success) {
        const newCharacters = response.data;
        const newLastId = response.lastId;
        const newhasMore = true;

        setCollections((prev) =>
          init ? newCharacters : [...prev, ...newCharacters]
        );
        dispatch(
          setCollectionsList(
            init ? [...newCharacters] : [...collectionsList, ...newCharacters]
          )
        );
        setLastCollectionId(newLastId);
        setCollectionHasMore(newhasMore);
      } else {
        setCollections([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsCollectionLoading(false);
    }
  };

  const handleScroll = (e) => {
    dispatch(setScrollPositionInCollections(e.target.scrollTop));
  };

  return (
    <Suspense fallback={<Loading />}>
      <Box
        className={classes.collectionsRoot}
        id={'scrollContainerInCollections'}
        onScroll={handleScroll}
      >
        <Box className={classes.content}>
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
            <Box className={classes.title}>All Collections</Box>
            <Box
              display={'flex'}
              alignItems="center"
              justifyContent={'flex-end'}
              mt={4.5}
            >
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
            </Box>
            <Box>
              <InfiniteScroll
                hasChildren={collections.length > 0}
                dataLength={collections.length}
                scrollableTarget={'scrollContainerInCollections'}
                next={loadCollections}
                hasMore={collectionHasMore}
                initialScrollY={scrollPosition - 300}
                loader={
                  isCollectionLoading && (
                    <MasonryGrid
                      gutter={isMobile ? '8px' : '16px'}
                      data={Array(loadingCount).fill(0)}
                      renderItem={(item, _) => (
                        <NFTCollectionCard
                          collection={item}
                          isLoading={Object.entries(item).length === 0}
                        />
                      )}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                    />
                  )
                }
              >
                <Box mt={4} style={{ marginBottom: isMobile ? '8px' : '16px' }}>
                  {!isCollectionLoading && collections.length === 0 && (
                    <Box textAlign="center" mt={6}>
                      No NFT Collections
                    </Box>
                  )}
                  <MasonryGrid
                    gutter={isMobile ? '8px' : '16px'}
                    data={collections}
                    renderItem={(item, _) => (
                      <NFTCollectionCard
                        collection={item}
                        isLoading={Object.entries(item).length === 0}
                      />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
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
