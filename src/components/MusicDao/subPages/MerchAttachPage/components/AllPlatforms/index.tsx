import React, { lazy, Suspense, useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import { Text } from 'components/MusicDao/components/ui-kit';
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

export default function AllPlatforms({ query, platformId, setPlatformId }) {
  const classes = PlatformPageStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(600));

  const history = useHistory();

  const [platforms, setPlatforms] = useState<any[]>([]);
  const [isPlatformLoading, setIsPlatformLoading] = useState<boolean>(false);
  const [hasMorePlatform, setHasMorePlatform] = useState<boolean>(true);
  const [lastPlatformId, setLastPlatformId] = useState<any>();

  useEffect(() => {
    loadPlatforms(true);
  }, []);

  const loadPlatforms = async (init = false) => {
    if (isPlatformLoading) return;
    try {
      setIsPlatformLoading(true);
      const response = await getPlatforms({
        lastId: init ? undefined : lastPlatformId
      });
      console.log(response);
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
        <Box className={classes.content}>
          <Box className={classes.header1} mt={8}>
            All Platforms
          </Box>
          <Box zIndex={1} paddingBottom={15}>
            <InfiniteScroll
              hasChildren={platforms.length > 0}
              dataLength={platforms.length}
              scrollableTarget={'scrollContainer'}
              next={() => {
                if (platforms.length > 0) loadPlatforms();
              }}
              hasMore={hasMorePlatform}
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
                        handleClick={() => setPlatformId(item.id)}
                        selected={item.id === platformId}
                      />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                )
              }
              style={{ overflow: 'inherit' }}
            >
              <Box mt={1}>
                {!isPlatformLoading &&
                  !hasMorePlatform &&
                  platforms.length < 1 && (
                    <Box textAlign="center" mt={6}>
                      No Platforms
                    </Box>
                  )}
                <MasonryGrid
                  gutter={'24px'}
                  data={platforms.filter((platform) =>
                    platform.name.toLowerCase().includes(query.toLowerCase())
                  )}
                  renderItem={(item) => (
                    <PlatformCard
                      data={item}
                      isLoading={Object.entries(item).length === 0}
                      handleClick={() => setPlatformId(item.id)}
                      selected={item.id === platformId}
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
