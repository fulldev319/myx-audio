import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import Box from 'shared/ui-kit/Box';
import { CircularLoadingIndicator } from 'shared/ui-kit';
import { musicDaoGetPods } from 'shared/services/API';
import PodCard from 'components/MusicDao/components/Cards/PodCard';
import { ArrowIcon } from '../../components/Icons/SvgIcons';
import { voteSubPageStyles } from './index.styles';

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

export default function VotePage() {
  const classes = voteSubPageStyles();
  const history = useHistory();

  const theme = useTheme();
  const isLgTablet = useMediaQuery('(min-width: 1400px)');
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery('(max-width: 700px)');

  const [pods, setPods] = useState<any[]>([]);
  // pagination
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const lastIdRef = useRef<string>('');

  useEffect(() => {
    loadMore();
  }, []);

  // load pods for next page
  const loadMore = () => {
    setIsLoading(true);
    musicDaoGetPods('All', lastIdRef.current)
      .then((resp) => {
        setIsLoading(false);
        if (resp?.success) {
          const data = resp.data;
          const nextPagePods = data.pods;
          setHasMore(data.hasMore ?? false);
          setPods([...pods, ...nextPagePods]);
          lastIdRef.current = nextPagePods.length
            ? nextPagePods[nextPagePods.length - 1].PodAddress
            : '';
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={classes.content} id={'scrollContainerOnPodsAllPage'}>
      <div className={classes.headerTitle}>
        <div className={classes.headerBack} onClick={() => history.goBack()}>
          <Box color="#FFFFFF">
            <ArrowIcon />
          </Box>
          <Box color="#FFFFFF" fontSize={14} fontWeight={700} ml="5px" mb="4px">
            BACK
          </Box>
        </div>
        <div className={classes.headerMainTitle}>All Capsules</div>
        <div />
      </div>
      <InfiniteScroll
        hasChildren={pods.length > 0}
        dataLength={pods.length}
        scrollableTarget={'scrollContainerOnPodsAllPage'}
        next={loadMore}
        hasMore={hasMore}
        loader={
          isLoading && (
            <LoadingIndicatorWrapper>
              <CircularLoadingIndicator />
            </LoadingIndicatorWrapper>
          )
        }
        style={{ overflow: 'inherit' }}
      >
        <Box mt={4}>
          <Grid container spacing={2} wrap="wrap">
            {pods.map((pod, index) => (
              <Grid
                key={`trending-pods-${index}`}
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
              >
                <PodCard pod={pod} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </InfiniteScroll>
    </div>
  );
}
