import React, { lazy, useEffect, useState } from 'react';

import { useMediaQuery, useTheme } from '@material-ui/core';

import Box from 'shared/ui-kit/Box';
import { usePageStyles } from './index.styles';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { getWeb3OwnersOfCollection } from 'shared/services/API';

const NFTOwnerCard = lazy(
  () => import('components/MusicDao/components/Cards/NFTOwnerCard')
);

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 2,
  700: 2,
  1200: 3,
  1440: 4
};

export default function OwnersSubPage({ collection }) {
  const classes = usePageStyles();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [owners, setOwners] = useState<any[]>([]);
  const [ownerHasMore, setOwnerHasMore] = useState<boolean>(true);
  const [isOwnerLoading, setIsOwnerLoading] = useState<boolean>(false);
  const [lastOwnerId, setLastOwnerId] = React.useState<any>(undefined);
  const [totalOwnerCount, setTotalOwnerCount] = React.useState<number>(0);

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
    if (collection) {
      loadOwners(true);
      setTotalOwnerCount(collection.nftCount);
    }
  }, [collection]);

  const loadOwners = async (init = false) => {
    if (isOwnerLoading) return;
    try {
      setIsOwnerLoading(true);

      const response = await getWeb3OwnersOfCollection({
        collectionAddress: collection.address,
        lastId: init ? undefined : lastOwnerId,
        pageSize: 12
      });
      if (response.success) {
        let newOwners = response.data;
        const newhasMore = newOwners.length === 12;
        setOwners((prev) => (init ? newOwners : [...prev, ...newOwners]));
        setLastOwnerId(response.lastId);
        setOwnerHasMore(newhasMore);
      } else {
        setOwners([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsOwnerLoading(false);
    }
  };

  return (
    <Box
      className={classes.root}
      id="scrollContainerForMarketplaceCollectionDetails"
    >
      <Box>
        <InfiniteScroll
          hasChildren={owners.length > 0}
          dataLength={owners.length}
          scrollableTarget={'scrollContainerForMarketplaceCollectionDetails'}
          next={loadOwners}
          hasMore={ownerHasMore}
          loader={
            isOwnerLoading && (
              <MasonryGrid
                gutter={isMobile ? '8px' : '16px'}
                data={Array(loadingCount).fill(0)}
                renderItem={(item, index) => (
                  <NFTOwnerCard
                    totalOwnerCount={totalOwnerCount}
                    data={item}
                    index={index + 1}
                    isLoading={Object.entries(item).length === 0}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            )
          }
        >
          <Box mt={4} style={{ marginBottom: isMobile ? '8px' : '16px' }}>
            {!isOwnerLoading && owners.length === 0 && (
              <Box textAlign="center" mt={6}>
                No Owners
              </Box>
            )}
            <MasonryGrid
              gutter={isMobile ? '8px' : '16px'}
              data={owners}
              renderItem={(item, index) => (
                <NFTOwnerCard
                  totalOwnerCount={totalOwnerCount}
                  data={item}
                  index={index + 1}
                  isLoading={Object.entries(item).length === 0}
                />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
          </Box>
        </InfiniteScroll>
      </Box>
    </Box>
  );
}
