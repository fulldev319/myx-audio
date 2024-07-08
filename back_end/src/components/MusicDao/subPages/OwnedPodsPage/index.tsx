import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDebounce } from 'use-debounce/lib';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import Box from 'shared/ui-kit/Box';
import { Color } from 'shared/ui-kit';
import { CircularLoadingIndicator } from 'shared/ui-kit';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { SearchIcon, ArrowIcon } from '../../components/Icons/SvgIcons';
import { ownedPodsPageStyles } from './index.styles';
import { musicDaoGetPodsOfArtist } from 'shared/services/API';
import { getPodStatus } from 'shared/functions/utilsMusicDao';
import PodCard from 'components/MusicDao/components/Cards/PodCard';
import Axios from 'axios';
import URL from 'shared/functions/getURL';

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

export default function OwnedPodsPage() {
  const classes = ownedPodsPageStyles();

  const { urlSlug } = useParams<{ urlSlug: string }>();
  const history = useHistory();

  const [searchValue, setSearchValue] = React.useState<string>('');
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);

  const [pods, setPods] = useState<any[]>([]);
  const [isPodLoading, setIsPodLoading] = useState<boolean>(false);
  const [hasMorePod, setHasMorePod] = useState<boolean>(true);
  const lastPodId = React.useRef<string>('');

  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    if (urlSlug) {
      Axios.get(`${URL()}/user/getIdFromSlug/${urlSlug}/user`).then(
        (response) => {
          if (response.data.success) {
            setUserId(response.data.data.id);
          }
        }
      );
    }
  }, [urlSlug]);

  useEffect(() => {
    lastPodId.current = '';
    setPods([]);
    setHasMorePod(true);
    setTimeout(() => loadMore());
  }, [debouncedSearchValue, userId]);

  const loadMore = async () => {
    if (!userId) {
      return;
    }

    if (lastPodId.current && (!hasMorePod || isPodLoading)) return;
    setIsPodLoading(true);
    const response = await musicDaoGetPodsOfArtist(
      userId,
      lastPodId.current,
      debouncedSearchValue ? debouncedSearchValue : undefined
    );
    if (response.success) {
      const data = response.data;
      const nextPagePods = (data.pods || [])
        .filter((p) => getPodStatus(p))
        .map((p) => ({ ...p, status: getPodStatus(p) }));
      setHasMorePod(data.hasMore ?? false);
      setPods((prev) => [...prev, ...nextPagePods]);
      lastPodId.current = nextPagePods.length
        ? nextPagePods[nextPagePods.length - 1].createdAt
        : '';
    }
    setIsPodLoading(false);
  };

  return (
    <Box
      className={classes.background}
      position="relative"
      id={'scrollContainer'}
    >
      <Box className={classes.content}>
        <Box
          className={classes.flexBox}
          position="relative"
          justifyContent="space-between"
          width={1}
          zIndex={1}
        >
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
          <Hidden smDown>
            <Box
              className={classes.flexBox}
              justifyContent="center"
              position="absolute"
              width={1}
            >
              <Box className={classes.header1}>All Capsules Owned</Box>
            </Box>
          </Hidden>
        </Box>
        <Hidden mdUp>
          <Box className={classes.header1} mt={3}>
            All Capsules Owned
          </Box>
        </Hidden>
        <Box zIndex={1}>
          {!isPodLoading && !hasMorePod && pods.length === 0 && (
            <Box textAlign="center" mt={2}>
              No Capsules Owned
            </Box>
          )}
          <InfiniteScroll
            hasChildren={pods.length > 0}
            dataLength={pods.length}
            scrollableTarget={'scrollContainer'}
            next={loadMore}
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
                {pods.map((item, index) => (
                  <Grid key={`pods-${index}`} item xs={12} sm={6} md={4} lg={3}>
                    <PodCard pod={item} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </InfiniteScroll>
        </Box>
      </Box>
    </Box>
  );
}
