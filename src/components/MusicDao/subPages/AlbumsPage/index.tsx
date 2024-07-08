import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import Carousel from 'react-elastic-carousel';
import { useDebounce } from 'use-debounce/lib';
import Axios from 'axios';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import { SearchIcon, ArrowIcon } from '../../components/Icons/SvgIcons';
import Box from 'shared/ui-kit/Box';
import { Color } from 'shared/ui-kit';
import { CircularLoadingIndicator } from 'shared/ui-kit';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { AlbumsPageStyles } from './index.styles';
import {
  musicDaoGetTopAlbums,
  musicDaoGetAlbums,
  musicDaoGetAlbumsOfArtist
} from 'shared/services/API';
import { ChevronIconLeft } from 'shared/ui-kit/Icons/chevronIconDown';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import URL from 'shared/functions/getURL';
import Loading from 'shared/ui-kit/Loading';

const AlbumCard = lazy(
  () => import('components/MusicDao/components/Cards/AlbumCard')
);

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

const COLUMNS_COUNT_BREAK_POINTS = {
  400: 1,
  650: 2,
  1200: 3,
  1420: 4
};

export default function AlbumsPage() {
  const classes = AlbumsPageStyles();

  const { urlSlug } = useParams<{ urlSlug: string }>();
  const history = useHistory();

  const theme = useTheme();
  const isNormalScreen = useMediaQuery(theme.breakpoints.down(1800));
  const isTablet = useMediaQuery(theme.breakpoints.down(1420));
  const isNarrow = useMediaQuery(theme.breakpoints.down(860));
  const isMobile = useMediaQuery(theme.breakpoints.down(650));

  const [userId, setUserId] = useState<string | undefined>();

  const width = useWindowDimensions().width;
  const loadingCount = React.useMemo(
    () => (width >= 1280 ? 4 : width >= 960 ? 3 : width >= 600 ? 2 : 1),
    [width]
  );

  const [searchValue, setSearchValue] = React.useState<string>('');
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);

  const [albums, setAlbums] = useState<any[]>([1, 2, 3, 4, 5, 6, 7, 8]);
  const [isAlbumLoading, setIsAlbumLoading] = useState<boolean>(false);
  const [hasMoreAlbum, setHasMoreAlbum] = useState<boolean>(true);
  const lastAlbumId = React.useRef<string | undefined>();

  const [isTopAlbumLoading, setIsTopAlbumLoading] = useState<boolean>(false);
  const [topAlbums, setTopAlbums] = useState<any[]>([]);
  const carouselRef = React.useRef<any>();
  const itemsToShow = isMobile ? 1 : isNarrow ? 2 : isTablet ? 3 : 4;

  useEffect(() => {
    getTopAlbums();
  }, []);

  const getTopAlbums = () => {
    setIsTopAlbumLoading(true);
    musicDaoGetTopAlbums()
      .then((res) => {
        setTopAlbums(res.albums || []);
      })
      .finally(() => setIsTopAlbumLoading(false));
  };

  useEffect(() => {
    if (urlSlug) {
      Axios.get(`${URL()}/user/getIdFromSlug/${urlSlug}/user`).then(
        (response) => {
          if (response.data.success) {
            setUserId(response.data.data.id);
          }
        }
      );
    } else {
      setUserId(undefined);
    }
  }, [urlSlug]);

  useEffect(() => {
    lastAlbumId.current = undefined;
    setAlbums([]);
    setHasMoreAlbum(true);
    setTimeout(() => loadMore());
  }, [debouncedSearchValue, userId]);

  const loadMore = async () => {
    if (isAlbumLoading) return;
    setIsAlbumLoading(true);
    if (!urlSlug) {
      const response = await musicDaoGetAlbums({
        lastId: lastAlbumId.current,
        search: debouncedSearchValue ? debouncedSearchValue : undefined
      });
      if (response.success) {
        const newAlbums = response.albums || [];
        if (lastAlbumId.current === undefined) {
          setAlbums(newAlbums);
        } else {
          setAlbums((prev) => [...prev, ...newAlbums]);
        }
        setHasMoreAlbum(newAlbums.length === 8);
        lastAlbumId.current = newAlbums.length
          ? newAlbums[newAlbums.length - 1].id
          : '';
      }
    } else if (userId) {
      const response = await musicDaoGetAlbumsOfArtist(
        userId,
        lastAlbumId.current || ''
      );
      if (response.success) {
        const data = response.data;
        const newAlbums = data.albums || [];
        if (lastAlbumId.current === undefined) {
          setAlbums(newAlbums);
        } else {
          setAlbums((prev) => [...prev, ...newAlbums]);
        }
        setHasMoreAlbum(data.hasMore ?? false);
        lastAlbumId.current = newAlbums.length
          ? newAlbums[newAlbums.length - 1].id
          : '';
      }
    }
    setIsAlbumLoading(false);
  };

  return (
    <Suspense fallback={<Loading />}>
      <Box
        className={classes.background}
        position="relative"
        id={'scrollContainer'}
      >
        <Box className={classes.content}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            style={{ cursor: 'pointer' }}
            zIndex={1}
            onClick={() => history.goBack()}
          >
            <div>
              <ArrowIcon color={'white'} />
            </div>
            <Box color="white" fontSize={14} fontWeight={700} ml="5px" mb="4px">
              BACK
            </Box>
          </Box>

          {!userId && (
            <Box mb={3}>
              {isTopAlbumLoading || topAlbums.length ? (
                <Box mt={6} mb={4}>
                  <Box
                    className={classes.flexBox}
                    justifyContent="space-between"
                  >
                    <Box className={classes.header1}>Top Collections</Box>
                    {topAlbums &&
                    topAlbums.length &&
                    ((isMobile && topAlbums.length > 1) ||
                      (isTablet && topAlbums.length > 2) ||
                      (isNormalScreen && topAlbums.length > 3) ||
                      topAlbums.length > 4) ? (
                      <Box display="flex" justifyContent="center">
                        <Box className={classes.arrowBox}>
                          <Box
                            style={{
                              transform: 'rotate(90deg)',
                              cursor: 'pointer'
                            }}
                            mr={2}
                            onClick={() => carouselRef.current.slidePrev()}
                          >
                            <ChevronIconLeft />
                          </Box>
                          <Box
                            style={{
                              transform: 'rotate(-90deg)',
                              cursor: 'pointer'
                            }}
                            ml={2}
                            onClick={() => carouselRef.current.slideNext()}
                          >
                            <ChevronIconLeft />
                          </Box>
                        </Box>
                      </Box>
                    ) : null}
                  </Box>
                </Box>
              ) : null}
              <Box className={classes.carousel}>
                {topAlbums && topAlbums.length ? (
                  !isMobile &&
                  (topAlbums.length === 2 || topAlbums.length === 3) ? (
                    <div /*className={classes.allNFTSection}*/>
                      <MasonryGrid
                        gutter={'16px'}
                        data={topAlbums}
                        renderItem={(item, index) => <AlbumCard item={item} />}
                        columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                      />
                    </div>
                  ) : (
                    <Carousel
                      isRTL={false}
                      itemsToShow={itemsToShow}
                      pagination={false}
                      showArrows={false}
                      ref={carouselRef}
                      itemPadding={[0, 4]}
                    >
                      {topAlbums.map((item: any, i: Number) => (
                        <div
                          key={item.id}
                          style={{
                            width: '100%',
                            paddingBottom: '15px',
                            display: 'flex',
                            justifyContent: isMobile
                              ? 'center'
                              : topAlbums.length === 2 && i === 1
                              ? 'flex-end'
                              : topAlbums.length === 3 && i === 1
                              ? 'center'
                              : topAlbums.length === 3 && i === 2
                              ? 'flex-end'
                              : 'flex-start'
                          }}
                        >
                          <AlbumCard item={item} />
                        </div>
                      ))}
                    </Carousel>
                  )
                ) : isTopAlbumLoading ? (
                  <MasonryGrid
                    gutter={'24px'}
                    data={Array(loadingCount).fill(0)}
                    renderItem={(item, index) => (
                      <AlbumCard
                        item={item}
                        isLoading={isTopAlbumLoading}
                        key={`album_${index}`}
                      />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                  />
                ) : (
                  <div></div>
                )}
              </Box>
            </Box>
          )}

          <Box
            className={classes.flexBox}
            position="relative"
            justifyContent="space-between"
            width={1}
            zIndex={1}
            mt={3}
          >
            <Box className={classes.header1} mr={2}>
              All Collections
            </Box>
            <Box className={classes.optionSection} zIndex={1}>
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
          </Box>

          <Box zIndex={1}>
            {!isAlbumLoading && !hasMoreAlbum && albums.length === 0 && (
              <Box textAlign="center" mt={2}>
                No Collection
              </Box>
            )}
            <InfiniteScroll
              hasChildren={albums.length > 0}
              dataLength={albums.length}
              scrollableTarget={'scrollContainer'}
              next={loadMore}
              hasMore={hasMoreAlbum}
              loader={
                isAlbumLoading && (
                  <LoadingIndicatorWrapper>
                    <CircularLoadingIndicator />
                  </LoadingIndicatorWrapper>
                )
              }
              style={{ overflow: 'inherit' }}
            >
              <Box mt={4}>
                <Grid container spacing={2} wrap="wrap">
                  {albums.map((item, index) => (
                    <Grid
                      key={`albums-${index}`}
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                    >
                      <AlbumCard item={item} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </InfiniteScroll>
          </Box>
        </Box>
      </Box>
    </Suspense>
  );
}
