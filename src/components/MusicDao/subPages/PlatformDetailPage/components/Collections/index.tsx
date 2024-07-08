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

import { SearchIcon, ArrowIcon } from '../../../../components/Icons/SvgIcons';
import Box from 'shared/ui-kit/Box';
import { Color } from 'shared/ui-kit';
import { CircularLoadingIndicator } from 'shared/ui-kit';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { AlbumsPageStyles } from './index.styles';
import {
  geCollectionsOfPlatform
} from 'shared/services/API';
import { ChevronIconLeft } from 'shared/ui-kit/Icons/chevronIconDown';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import URL from 'shared/functions/getURL';
import Loading from 'shared/ui-kit/Loading';

const NFTCollectionCard = lazy(
  () => import('components/MusicDao/components/Cards/NFTCollectionCard')
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

export default function CollectionsTab({platform}) {
  const classes = AlbumsPageStyles();

  const { platformId }: { platformId: string } = useParams();
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

  const [albums, setAlbums] = useState<any[]>([]);
  const [isAlbumLoading, setIsAlbumLoading] = useState<boolean>(false);
  const [hasMoreAlbum, setHasMoreAlbum] = useState<boolean>(true);
  const [lastAlbumId, setLastAlbumId] = useState<any>();

  const carouselRef = React.useRef<any>();
  const itemsToShow = isMobile ? 1 : isNarrow ? 2 : isTablet ? 3 : 4;

  useEffect(() => {
    loadAlbums(true);
  }, [platformId]);

  const loadAlbums = async (init = false) => {
    if (isAlbumLoading) return;
    try {
      setIsAlbumLoading(true);

      const response = await geCollectionsOfPlatform({
        platformId: platformId,
        lastId: init ? undefined : lastAlbumId,
        type: undefined
      });
      if (response.success) {
        const newCharacters = response.data;
        const newLastId = response.lastId;
        const newhasMore = response.hasMore;

        setAlbums((prev) =>
          init ? newCharacters : [...prev, ...newCharacters]
        );
        setLastAlbumId(newLastId);
        setHasMoreAlbum(newhasMore);
      } else {
        setAlbums([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsAlbumLoading(false);
    }
  };

  return (
    <Box className={classes.content}>
      <Box zIndex={1}>
        {!isAlbumLoading && albums?.length < 2 ? (
          <Box textAlign="center" mt={2}>
            No Collection
          </Box>
        ) :
        <InfiniteScroll
          hasChildren={albums?.length > 0}
          dataLength={albums?.length}
          scrollableTarget={'scrollContainer'}
          next={loadAlbums}
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
          <MasonryGrid
            gutter={isMobile ? '8px' : '16px'}
            data={albums}
            renderItem={(item, _) => (
              <NFTCollectionCard
                collection={item}
                isLoading={Object.entries(item).length === 0}
              />
            )}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
          />
        </InfiniteScroll>}
      </Box>
    </Box>
  );
}
