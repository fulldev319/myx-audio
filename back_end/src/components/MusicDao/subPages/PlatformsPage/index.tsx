import React, { lazy, Suspense, useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import { Text } from 'components/MusicDao/components/ui-kit';
import { BackIcon } from '../GovernancePage/styles';
import Box from 'shared/ui-kit/Box';
import Loading from 'shared/ui-kit/Loading';
import { Color } from 'shared/ui-kit';
import { getPlatforms, getTopPlatforms } from 'shared/services/API';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { PlatformPageStyles } from './index.styles';

const PlatformCard = lazy(
  () => import('components/MusicDao/components/Cards/PlatformCard')
);

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  700: 2,
  1200: 3,
  1440: 3
};

export default function MusicPage() {
  const classes = PlatformPageStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(600));

  const history = useHistory();

  const [platforms, setPlatforms] = useState<any[]>([]);
  const [topPlatforms, setTopPlatforms] = useState<any[]>([]);
  const [isPlatformLoading, setIsPlatformLoading] = useState<boolean>(false);
  const [hasMorePlatform, setHasMorePlatform] = useState<boolean>(true);
  const [lastPlatformId, setLastPlatformId] = useState<any>();

  useEffect(() => {
    loadPlatforms(true);
    getTopPlatforms().then((res) => {
      if (res.success) {
        let result = res.data;
        if (result.length > 2) {
          result = [result[1], result[0], result[2]];
        }
        setTopPlatforms(result);
      }
    });
  }, []);

  const loadPlatforms = async (init = false) => {
    if (isPlatformLoading) return;
    try {
      setIsPlatformLoading(true);
      const response = await getPlatforms({
        lastId: init ? undefined : lastPlatformId
      });
      if (response.success) {
        const newCharacters = response.data;
        const newLastId = response.lastId;
        const newhasMore = true;

        setPlatforms((prev) =>
          init ? newCharacters : [...prev, ...newCharacters]
        );
        setLastPlatformId(newLastId);
        setHasMorePlatform(newhasMore);
      } else {
        setPlatforms([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPlatformLoading(false);
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <Box
        className={classes.background}
        position="relative"
        id={'scrollContainer'}
      >
        {!isMobile && (
          <>
            <img
              src={require('assets/musicDAOImages/release_1.png')}
              className={classes.green2}
            />
            <img
              src={require('assets/musicDAOImages/release_2.png')}
              className={classes.green1}
            />
          </>
        )}
        <Box className={classes.content}>
          <Box
            display="flex"
            flexDirection="row"
            className={classes.backButton}
            onClick={() => history.goBack()}
          >
            <BackIcon />
            <Text ml={1} color={Color.White} bold>
              BACK
            </Text>
          </Box>
          <Box
            className={classes.flexBox}
            width={1}
            justifyContent="center"
            flexDirection="column"
            mt={2}
            zIndex={1}
          >
            <div className={classes.headerTitle}>
              Explore Top <span style={{ color: '#01f877' }}>Web3</span> <br />
              Platforms
            </div>
            <div className={classes.header2}>
              <Box textAlign="center">
                Discover & collect NFTs from your favorite music artists
              </Box>
            </div>
          </Box>
          {/* <Box style={{ textAlign: 'right' }} mt={2}>
            <SearchIcon />
          </Box> */}

          <Box className={classes.topSection} mt={10}>
            {topPlatforms.map((item, index) => (
              <PlatformCard
                data={item}
                index={index}
                key={`top_platform_${index}`}
              />
            ))}
          </Box>
          <Box zIndex={1}>
            <InfiniteScroll
              hasChildren={platforms.length > 0}
              dataLength={platforms.length}
              scrollableTarget={'scrollContainer'}
              next={() => loadPlatforms()}
              hasMore={hasMorePlatform}
              // initialScrollY={scrollPosition - 300}
              loader={
                isPlatformLoading && (
                  <MasonryGrid
                    gutter={'24px'}
                    data={platforms}
                    renderItem={(item, index) => (
                      <PlatformCard
                        data={item}
                        isLoading={true}
                        key={`platform_${index}`}
                      />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                )
              }
              style={{ overflow: 'inherit' }}
            >
              <Box mt={8}>
                {!isPlatformLoading &&
                  !hasMorePlatform &&
                  platforms.length < 1 && (
                    <Box textAlign="center" mt={6}>
                      No Track
                    </Box>
                  )}
                <MasonryGrid
                  gutter={'24px'}
                  data={platforms.filter(
                    (p) => !topPlatforms.find((t) => t.id === p.id)
                  )}
                  renderItem={(item, index) => (
                    <PlatformCard
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
    </Suspense>
  );
}
