import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import Box from 'shared/ui-kit/Box';
import { Color, PrimaryButton } from 'shared/ui-kit';
import PodCard from 'components/MusicDao/components/Cards/PodCard';
import CreatePodModal from 'components/MusicDao/modals/CreatePodModal/CreatePodModal';
import { CircularLoadingIndicator } from 'shared/ui-kit';
import { musicDaoGetTrendingPods, musicDaoGetPods } from 'shared/services/API';
import { podsPageStyles } from './index.styles';
import { SearchIcon } from '../../components/Icons/SvgIcons';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import CustomPopup from 'components/MusicDao/components/CustomPopup';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
import { useDebounce } from 'use-debounce/lib';

const FILTEROPTIONS = ['Trending', 'Hot', 'New'];
const ALLMOREOPTIONS = ['Newest pods'];

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

export default function PodsPage() {
  const classes = podsPageStyles();
  const user = useTypedSelector(getUser);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [selectedFilterOptions, setSelectedFilterOptions] = useState<string>(
    FILTEROPTIONS[0]
  );

  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [trendingPods, setTrendingPods] = useState<any[]>();
  const [pods, setPods] = useState<any[]>([]);
  const [selectedAllMoreOption, setSelectedAllMoreOption] = useState<string>(
    ALLMOREOPTIONS[0]
  );

  const [searchValue, setSearchValue] = React.useState<string>('');
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);

  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  // pagination
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const lastIdRef = useRef<string>('');

  // load trending pods
  useEffect(() => {
    handleRefresh();
  }, [debouncedSearchValue]);

  useEffect(() => {
    loadMore(true);
  }, []);

  // load pods for next page
  const loadMore = (init: boolean = false) => {
    if (isLoading) return;
    setIsLoading(true);
    if (init) {
      lastIdRef.current = '';
    }
    musicDaoGetPods('All', lastIdRef.current)
      .then((resp) => {
        setIsLoading(false);
        if (resp?.success) {
          const data = resp.data;
          const nextPagePods = data.pods;
          setHasMore(data.hasMore ?? false);
          if (init) {
            setPods(nextPagePods);
          } else {
            setPods([...pods, ...nextPagePods]);
          }

          lastIdRef.current = nextPagePods.length
            ? nextPagePods[nextPagePods.length - 1].Id
            : '';
        }
      })
      .catch((err) => console.log(err));
  };

  const handleLoadMore = () => {
    loadMore();
  };

  const handleRefresh = useCallback(() => {
    setTrendingPods([]);
    musicDaoGetTrendingPods(
      selectedFilterOptions === FILTEROPTIONS[2],
      selectedFilterOptions === FILTEROPTIONS[1],
      debouncedSearchValue
    )
      .then((resp) => {
        if (resp?.success) setTrendingPods(resp.data);
        else setTrendingPods([]);
      })
      .catch((_) => setTrendingPods([]));
    loadMore(true);
  }, []);

  return (
    <Box className={classes.content} id={'scrollContainer'}>
      {/* Top box - title, description, create button */}
      <Box
        className={classes.flexBox}
        width={1}
        justifyContent="center"
        flexDirection="column"
        mt={2}
        zIndex={1}
      >
        <div className={classes.headerTitle}>
          <span>Music</span> Capsules
        </div>
        <div className={classes.header2}>
          <Box textAlign={isMobile ? 'center' : undefined}>
            Create, browse and get involved in the governance and capitalization
            of <span>music assets</span>
          </Box>
        </div>
        <PrimaryButton
          size="medium"
          onClick={() => setOpenCreateModal(true)}
          isRounded
          style={{
            background: '#2D3047',
            paddingLeft: '58px',
            paddingRight: '58px',
            height: 52
          }}
        >
          Create New Capsule
        </PrimaryButton>
      </Box>
      {/* Trending title and list */}
      <Box mt={2} zIndex={1}>
        <Box className={classes.filterContainer}>
          <Box className={classes.header1} color="#2D3047">
            Trending
          </Box>
          <Box className={classes.optionSection}>
            <Box
              className={classes.filterButtonBox}
              ml={1}
              style={{ cursor: 'auto' }}
            >
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
            </Box>
          </Box>
        </Box>
        <LoadingWrapper loading={!trendingPods || trendingPods.length === 0}>
          <Box mt={4}>
            <Grid container spacing={2} wrap="wrap">
              {trendingPods?.map((pod, index) => (
                <Grid
                  key={`trending-pods-${index}`}
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={3}
                >
                  <PodCard pod={pod} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </LoadingWrapper>
      </Box>
      {/* All title and Sort control */}
      <Box
        zIndex={1}
        className={classes.flexBox}
        justifyContent="space-between"
        mt={6}
        mb={2}
      >
        <Box className={classes.header1} color="#2D3047">
          All
        </Box>
        <Box className={classes.flexBox}>
          <Box
            color={Color.MusicDAODark}
            fontSize={12}
            fontWeight={500}
            mr="10px"
          >
            Sort by
          </Box>
          <CustomPopup
            items={ALLMOREOPTIONS}
            value={selectedAllMoreOption}
            onSelect={(value) => setSelectedAllMoreOption(value)}
            theme="dark"
          />
        </Box>
      </Box>
      {/* all list */}
      <InfiniteScroll
        hasChildren={pods.length > 0}
        dataLength={pods.length}
        scrollableTarget={'scrollContainer'}
        next={handleLoadMore}
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
              <Grid key={`pods-${index}`} item xs={12} sm={6} md={3} lg={3}>
                <PodCard pod={pod} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </InfiniteScroll>

      {openCreateModal && (
        <CreatePodModal
          onClose={() => setOpenCreateModal(false)}
          type={'Digital NFT'}
          handleRefresh={handleRefresh}
          open={openCreateModal}
        />
      )}
    </Box>
  );
}
