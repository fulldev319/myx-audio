import React from 'react';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';

import Box from 'shared/ui-kit/Box';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getPodStatus } from 'shared/functions/utilsMusicDao';
import { musicDaoGetPodsOfArtist } from 'shared/services/API';
import { CircularLoadingIndicator } from 'shared/ui-kit';
import PodCard from 'components/MusicDao/components/Cards/PodCard';
import { profilePageStyles } from '../../index.styles';

const Pods = ({ artistId }) => {
  const classes = profilePageStyles();

  const [pods, setPods] = React.useState<any[]>([]);
  const [isPodLoading, setIsPodLoading] = React.useState<boolean>(false);
  const [hasMorePod, setHasMorePod] = React.useState<boolean>(true);
  const lastPodIdRef = React.useRef<string>('');

  React.useEffect(() => {
    lastPodIdRef.current = '';
    loadMorePod();
  }, [artistId]);

  const loadMorePod = () => {
    if (isPodLoading) return;
    setIsPodLoading(true);
    musicDaoGetPodsOfArtist(artistId, lastPodIdRef.current)
      .then((resp) => {
        setIsPodLoading(false);
        if (resp?.success) {
          const data = resp.data;
          const nextPagePods = (data.pods || [])
            .filter((p) => getPodStatus(p))
            .map((p) => ({ ...p, status: getPodStatus(p) }));
          setHasMorePod(data.hasMore ?? false);
          setPods((prev) => [...prev, ...nextPagePods]);
          lastPodIdRef.current = nextPagePods.length
            ? nextPagePods[nextPagePods.length - 1].Id
            : '';
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box py={6}>
      <Box className={classes.headerSubTitle}>ALL OWNED CAPSULES</Box>
      <InfiniteScroll
        hasChildren={pods.length > 0}
        dataLength={pods.length}
        scrollableTarget={'profile-infite-scroll'}
        next={loadMorePod}
        hasMore={hasMorePod}
        loader={
          isPodLoading && (
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
              <Grid key={`pods-${index}`} item xs={12} sm={6} md={4} lg={3}>
                <PodCard pod={pod} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </InfiniteScroll>
    </Box>
  );
};

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

export default Pods;
