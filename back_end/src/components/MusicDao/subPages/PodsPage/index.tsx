import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  useRef,
  useMemo
} from 'react';
import clsx from 'clsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation, useHistory } from 'react-router-dom';
import { useDebounce } from 'use-debounce/lib';
import { useDispatch, useSelector } from 'react-redux';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import { useTypedSelector, RootState } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
import { setSongsList, setScrollPositionInSongs } from 'store/actions/Songs';
import {
  setArtistsList,
  setScrollPositionInArtists
} from 'store/actions/Artists';
import {
  // setPodsList,
  setReloadPods
  // setScrollPositionInPods
} from 'store/actions/Pods';
import { SearchIcon } from '../../components/Icons/SvgIcons';
import Box from 'shared/ui-kit/Box';
import { Color, ContentType, PrimaryButton } from 'shared/ui-kit';
import {
  // musicDaoGetPods,
  getMyxPods,
  musicDaoGetPodsProposal,
  musicDaoGetRaisedTrendingPods
  // musicDaoGetMyInvestments
} from 'shared/services/API';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import Loading from 'shared/ui-kit/Loading';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { getPodStatus } from 'shared/functions/utilsMusicDao';
import { useAuth } from 'shared/contexts/AuthContext';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { podsPageStyles } from './index.styles';

const PodProposalCard = lazy(
  () => import('components/MusicDao/components/Cards/PodProposalCard')
);
const PodCard = lazy(
  () => import('components/MusicDao/components/Cards/PodCard')
);
const HowWorksOfSongModal = lazy(
  () => import('components/MusicDao/modals/HowWorksOfSongModal')
);
const WhiteListModal = lazy(
  () => import('components/MusicDao/modals/WhiteListModal')
);
const CustomSelect = lazy(
  () => import('components/MusicDao/components/CustomSelect')
);
const CreateContentModal = lazy(
  () => import('components/MusicDao/modals/CreateContentModal')
);
// const CreateSongModalNew = lazy(
//   () => import('components/MusicDao/modals/CreateSongModalNew')
// );
const CreateMutipleEditionsPod = lazy(
  () => import('components/MusicDao/modals/CreateMutipleEditionsPod')
);
const CreatePodModal = lazy(
  () => import('components/MusicDao/modals/CreateNewPodModal')
);

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  700: 2,
  1200: 3,
  1440: 4
};

// const filterTagOptions = [
//   'All',
//   'Fund Song Creation',
//   'Song NFT',
//   'Funded',
//   'Sold out'
// ];

export default function PodsPage() {
  const classes = podsPageStyles();
  const user = useTypedSelector(getUser);
  const history = useHistory();
  const dispatch = useDispatch();

  // const podsList = useSelector((state: RootState) => state.pods.podsList);
  // const scrollPosition = useSelector(
  //   (state: RootState) => state.pods.scrollPositionInPods
  // );
  const reload = useSelector((state: RootState) => state.pods.reload);

  const { isSignedin, accountStatus } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const breakTwo = useMediaQuery(theme.breakpoints.up(700));
  const breakThree = useMediaQuery(theme.breakpoints.up(1200));
  const breakFour = useMediaQuery(theme.breakpoints.up(1440));

  const location: any = useLocation<Location>();

  const [openHowWorksModal, setOpenHowWorksModal] = useState<boolean>(false);
  const [openCreateMusicModal, setOpenCreateMusicModal] =
    useState<boolean>(false);
  const [openCreatePodModal, setOpenCreatePodModal] = useState<boolean>(false);
  const [openCreateContent, setOpenCreateContent] = useState<boolean>(false);
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.SongSingleEdition
  );

  const [originTrendingPods, setOriginTrendingPods] = useState<any[]>();
  const [trendingPods, setTrendingPods] = useState<any[]>();
  const [originPods, setOriginPods] = useState<any[]>([]);
  const [pods, setPods] = useState<any[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);

  const [proposals, setProposals] = useState<any[]>([]);
  const [isNoProposals, setIsNoProposals] = useState<boolean>(false);
  const [isLoadingProposals, setIsLoadingProposals] = useState<boolean>(false);
  const [lastId, setLastId] = useState<any>();
  const [activeTab, setActiveTab] = useState<number>(0);

  // const [originPodInvestments, setOriginPodInvestments] = useState<any[]>([]);
  // const [podInvestments, setPodInvestments] = useState<any[]>([]);

  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  // pagination
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasMoreProposals, setHasMoreProposals] = useState<boolean>(true);
  const lastIdRef = useRef<string>('undefined');

  // pagination for investments
  // const [isLoadingInvestments, setIsLoadingInvestments] =
  //   useState<boolean>(false);
  // const [hasMoreInvestments, setHasMoreInvestments] = useState<boolean>(true);
  // const lastIdRefInvestments = useRef<string>('undefined');

  const width = useWindowDimensions().width;
  const loadingCount = React.useMemo(
    () => (width > 1440 ? 4 : width > 1200 ? 3 : width > 700 ? 2 : 1),
    [width]
  );
  const [filterOption, setFilterOption] = useState<string>('All');

  const isShowProposalTab = true;

  useEffect(() => {
    // initialize store
    dispatch(setArtistsList([]));
    dispatch(setSongsList([]));
    dispatch(setScrollPositionInArtists(0));
    dispatch(setScrollPositionInSongs(0));
    dispatch(setReloadPods(false));
  }, []);

  useEffect(() => {
    setPods([]);
    setHasMore(true);
    loadMore(true);
  }, [filterOption]);

  useEffect(() => {
    if (reload) {
      setPods([]);
      setHasMore(true);
      loadMore(true);
      setTimeout(() => dispatch(setReloadPods(false)), 1000);
    }
  }, [reload]);

  useEffect(() => {
    const url = new URLSearchParams(location.search);
    setActiveTab(
      url.get('query') === 'investment'
        ? 2
        : url.get('query') === 'proposal'
        ? 1
        : 0
    );
    // if (url.get('query') === 'investment' || url.get('query') === 'proposal') {
    //   dispatch(setPodsList([]));
    // }
  }, [location.search]);

  useEffect(() => {
    musicDaoGetRaisedTrendingPods()
      .then((resp) => {
        if (resp?.success) {
          const data = resp.data;
          const nextPagePods = data
            .filter((p) => getPodStatus(p))
            .map((p) => ({ ...p, status: getPodStatus(p) }));

          setOriginTrendingPods(nextPagePods);
          setTrendingPods(
            nextPagePods.filter((p) =>
              debouncedSearchValue.length > 0
                ? p.name
                    ?.toUpperCase()
                    .includes(debouncedSearchValue.toUpperCase())
                : true
            )
          );
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setTrendingPods(
      originTrendingPods?.filter((p) =>
        debouncedSearchValue.length > 0
          ? p.name?.toUpperCase().includes(debouncedSearchValue.toUpperCase())
          : true
      )
    );
    setPods(
      originPods?.filter((p) =>
        debouncedSearchValue.length > 0
          ? p.name?.toUpperCase().includes(debouncedSearchValue.toUpperCase())
          : true
      )
    );
    setProposals([]);
    setHasMoreProposals(true);
  }, [debouncedSearchValue]);

  useEffect(() => {
    setLastId(undefined);
    if (
      isShowProposalTab &&
      isSignedin &&
      !isLoadingProposals &&
      user.address
    ) {
      loadMoreProposals(true);
    }
  }, [isSignedin, user.address, debouncedSearchValue]);

  // useEffect(() => {
  //   if (isSignedin) {
  //     loadMoreInvestments(true);
  //   }
  // }, [isSignedin]);

  const loadMoreProposals = (isInit = false) => {
    if (isLoadingProposals) return;
    setIsLoadingProposals(true);
    musicDaoGetPodsProposal(
      user.address,
      debouncedSearchValue,
      isInit ? undefined : lastId
    )
      .then((resp) => {
        if (resp?.success) {
          if (isInit) {
            setProposals(resp.data);
            setIsNoProposals(resp.data.length > 0 ? false : true);
          } else {
            setProposals((prev) => [...prev, ...resp.data]);
          }
          setLastId(resp.lastId);
          setHasMoreProposals(resp.data.length === 20);
        }
      })
      .finally(() => setIsLoadingProposals(false));
  };

  // load pods for next page
  const loadMore = (isInit = false) => {
    if (isLoading) return;
    setIsLoading(true);
    if (isInit) lastIdRef.current = 'undefined';
    getMyxPods(filterOption, lastIdRef.current)
      .then((resp) => {
        setIsLoading(false);
        if (resp?.success) {
          const data = resp.data;
          const nextPagePods = data.pods
            .filter((p) => getPodStatus(p))
            .map((p) => ({ ...p, status: getPodStatus(p) }));

          setHasMore(data.hasMore ?? false);
          lastIdRef.current = nextPagePods.length
            ? nextPagePods[nextPagePods.length - 1].createdAt
            : '';

          if (isInit) {
            setOriginPods(nextPagePods);
            setPods([
              ...nextPagePods.filter((p) =>
                debouncedSearchValue.length > 0
                  ? p.name
                      ?.toUpperCase()
                      .includes(debouncedSearchValue.toUpperCase())
                  : true
              )
            ]);
          } else {
            setOriginPods([...originPods, ...nextPagePods]);
            setPods([
              ...pods,
              ...nextPagePods.filter((p) =>
                debouncedSearchValue.length > 0
                  ? p.name
                      ?.toUpperCase()
                      .includes(debouncedSearchValue.toUpperCase())
                  : true
              )
            ]);
          }
          // dispatch(setPodsList([...podsList, ...nextPagePods]));
        }
      })
      .catch((err) => console.log(err));
  };

  // const loadMoreInvestments = (isInit = false) => {
  //   if (isLoadingInvestments) return;
  //   setIsLoadingInvestments(true);
  //   if (isInit) lastIdRefInvestments.current = 'undefined';
  //   musicDaoGetMyInvestments(lastIdRefInvestments.current)
  //     .then((resp) => {
  //       if (resp?.success) {
  //         const data = resp.data;
  //         const nextPagePods = data
  //           .filter((p) => getPodStatus(p))
  //           // .filter(p=>searchValue.length > 0 ? p.Name.toUpperCase().includes(searchValue.toUpperCase()) : true)
  //           .map((p) => ({ ...p, status: getPodStatus(p) }));

  //         setHasMoreInvestments(data.hasMore ?? false);
  //         lastIdRefInvestments.current = nextPagePods.length
  //           ? nextPagePods[nextPagePods.length - 1].id
  //           : '';

  //         if (isInit) {
  //           setOriginPodInvestments(nextPagePods);
  //           setPodInvestments(
  //             nextPagePods.filter((p) =>
  //               searchValue.length > 0
  //                 ? p.Name.toUpperCase().includes(searchValue.toUpperCase())
  //                 : true
  //             )
  //           );
  //         } else {
  //           setOriginPodInvestments([...originPodInvestments, ...nextPagePods]);
  //           setPodInvestments([
  //             ...originPodInvestments,
  //             ...nextPagePods.filter((p) =>
  //               searchValue.length > 0
  //                 ? p.Name.toUpperCase().includes(searchValue.toUpperCase())
  //                 : true
  //             )
  //           ]);
  //         }
  //       }
  //     })
  //     .catch((err) => console.log(err))
  //     .finally(() => setIsLoadingInvestments(false));
  // };

  const handleRefresh = () => {
    loadMore(true);
    // loadMoreInvestments(true);
    // loadMoreProposals(true);
  };

  const podListWithSkeleton = useMemo(() => {
    if (hasMore && !debouncedSearchValue) {
      let addedCount = 1;
      if (breakFour) {
        addedCount = 4 - (pods.length % 4);
      } else if (breakThree) {
        addedCount = 3 - (pods.length % 3);
      } else if (breakTwo) {
        addedCount = 2 - (pods.length % 2);
      }

      const result = [...pods];
      for (let index = 0; index < addedCount; index++) {
        result.push({});
      }

      return result;
    } else {
      return pods;
    }
  }, [pods, hasMore, breakTwo, breakThree, breakFour, debouncedSearchValue]);

  // const podInvestmentsListWithSkeleton = useMemo(() => {
  //   if (hasMoreInvestments) {
  //     let addedCount = 1;
  //     if (breakFour) {
  //       addedCount = 4 - (podInvestments.length % 4);
  //     } else if (breakThree) {
  //       addedCount = 3 - (podInvestments.length % 3);
  //     } else if (breakTwo) {
  //       addedCount = 2 - (podInvestments.length % 2);
  //     }

  //     const result = [...podInvestments];
  //     for (let index = 0; index < addedCount; index++) {
  //       result.push({});
  //     }

  //     return result;
  //   } else {
  //     return podInvestments;
  //   }
  // }, [podInvestments, hasMoreInvestments, breakTwo, breakThree, breakFour]);

  const handleScroll = (e) => {
    // dispatch(setScrollPositionInPods(e.target.scrollTop));
  };

  const handleOpenCreatingModal = (type) => {
    setOpenCreateContent(false);
    setContentType(type);
    switch (type) {
      case ContentType.PodInvestment:
      case ContentType.PodCollaborative:
        setOpenCreatePodModal(true);
        break;
      case ContentType.SongSingleEdition:
      case ContentType.SongMultiEdition:
        setOpenCreateMusicModal(true);
        break;
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <Box
        className={classes.background}
        position="relative"
        id={'scrollContainer'}
        onScroll={handleScroll}
      >
        <Box className={classes.content}>
          <Box
            display="flex"
            width={1}
            alignItems="flex-start"
            flexDirection="column"
            justifyContent="flex-start"
            mt={2}
            zIndex={1}
          >
            <Box className={classes.topBtnRow} width={1}>
              {isSignedin && accountStatus && (
                <div style={{ position: 'relative' }}>
                  <PrimaryButton
                    size="medium"
                    onClick={() => setOpenCreateContent(true)}
                    isRounded
                    style={{
                      background: 'white',
                      color: Color.Black,
                      height: 52,
                      marginLeft: '8px',
                      width: 150
                    }}
                  >
                    Create
                  </PrimaryButton>
                </div>
              )}
              <PrimaryButton
                size="medium"
                onClick={() => setOpenHowWorksModal(true)}
                isRounded
                style={{
                  color: 'white',
                  width: 150,
                  background: 'rgba(255, 255, 255, 0.2)',
                  height: 52,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 16
                }}
              >
                How It Works
              </PrimaryButton>
            </Box>
            <Box className={classes.headerTitle}>
              <span>Music</span> Capsules
            </Box>
            <Box className={classes.header2} maxWidth={750}>
              Create NFTs, invite collaborators, get investment
            </Box>
          </Box>
          <Box
            className={isMobile ? classes.columnBox : classes.flexBox}
            justifyContent="space-between"
            width={1}
            mt={4}
            zIndex={1}
          >
            <div
              className={classes.flexBox}
              style={{ borderBottom: '1px solid #ffffff22', color: 'white' }}
            >
              <div
                className={clsx(classes.tabItem, {
                  [classes.tabItemActive]: activeTab === 0
                })}
                onClick={() => history.push(`?query=all`)}
              >
                <div className={classes.header5}>Explore Trending</div>
              </div>
              {isShowProposalTab && isSignedin && (
                <Box
                  className={clsx(classes.tabItem, {
                    [classes.tabItemActive]: activeTab === 1
                  })}
                  ml={2}
                  onClick={() => history.push(`?query=proposal`)}
                >
                  <div className={classes.header5}>Capsule Proposals</div>
                </Box>
              )}
              {/* {isSignedin && (
                <Box
                  className={clsx(classes.tabItem, {
                    [classes.tabItemActive]: activeTab === 2
                  })}
                  ml={2}
                  onClick={() => history.push(`?query=investment`)}
                >
                  <div className={classes.header5}>My Investments</div>
                </Box>
              )} */}
            </div>
            <div className={classes.optionSection}>
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
            </div>
          </Box>
          {activeTab === 0 ? (
            <>
              <Box mt={6}>
                <MasonryGrid
                  gutter={'16px'}
                  data={trendingPods ?? Array(loadingCount).fill(0)}
                  renderItem={(item, _) => (
                    <PodCard pod={item} isLoading={!trendingPods} />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                />
              </Box>
              {/* All title and Sort control */}
              <Box
                zIndex={1}
                className={classes.flexBox}
                justifyContent="space-between"
                mt={6}
                mb={2}
              >
                <Box className={classes.header1}>
                  All
                </Box>
                {/* <Box className={classes.flexBox}>
                  <CustomSelect
                    label={'Filter:'}
                    containerStyle={classes.filterTag}
                    items={filterTagOptions}
                    onSelect={(val) => setFilterOption(val)}
                    value={filterOption}
                    theme="dark"
                    width={'180px'}
                  />
                </Box> */}
              </Box>
              {/* all list */}
              <InfiniteScroll
                hasChildren={pods.length > 0}
                dataLength={pods.length}
                scrollableTarget={'scrollContainer'}
                next={loadMore}
                hasMore={hasMore && !debouncedSearchValue}
                // initialScrollY={scrollPosition - 400}
                loader={isLoading && <></>}
                style={{ overflow: 'inherit' }}
              >
                <Box mt={4}>
                  <MasonryGrid
                    gutter={'16px'}
                    data={podListWithSkeleton}
                    renderItem={(item, _) => (
                      <PodCard
                        pod={item}
                        isLoading={Object.entries(item).length === 0}
                      />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                </Box>
              </InfiniteScroll>
            </>
          ) : activeTab == 1 ? (
            <div style={{ zIndex: 1 }}>
              <InfiniteScroll
                hasChildren={proposals.length > 0}
                dataLength={proposals.length}
                scrollableTarget={'scrollContainer'}
                next={loadMoreProposals}
                hasMore={hasMoreProposals}
                loader={
                  isLoadingProposals && (
                    <Box width={1} mb={2}>
                      <PodProposalCard
                        pod={{}}
                        handleRefresh={handleRefresh}
                        isLoading={isLoadingProposals}
                      />
                    </Box>
                  )
                }
                style={{ overflow: 'inherit' }}
              >
                <Box mt={4}>
                  {proposals.length > 0
                    ? proposals.map((pod, index) => (
                        <Box key={index} width={1} mb={2}>
                          <PodProposalCard
                            pod={pod}
                            handleRefresh={handleRefresh}
                          />
                        </Box>
                      ))
                    : !isLoadingProposals &&
                      isNoProposals && (
                        <Box
                          className={classes.header5}
                          textAlign="center"
                          width={1}
                        >
                          You don’t have any proposal capsules
                        </Box>
                      )}
                </Box>
              </InfiniteScroll>
            </div>
          ) : (
            <div style={{ zIndex: 1 }}>
              {/* <InfiniteScroll
                hasChildren={podInvestments.length > 0}
                dataLength={podInvestments.length}
                scrollableTarget={'scrollContainer'}
                next={loadMoreInvestments}
                hasMore={hasMoreInvestments}
                loader={isLoadingInvestments && <></>}
                style={{ overflow: 'inherit' }}
              >
                <Box mt={4}>
                  {podInvestments.length > 0 ? (
                    <MasonryGrid
                      gutter={'16px'}
                      data={podInvestmentsListWithSkeleton}
                      renderItem={(item, _) => (
                        <PodCard
                          pod={item}
                          isLoading={Object.entries(item).length === 0}
                        />
                      )}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                    />
                  ) : (
                    !isLoadingInvestments && (
                      <Box
                        className={classes.header5}
                        textAlign="center"
                        width={1}
                      >
                        You don’t have any investment pods
                      </Box>
                    )
                  )}
                </Box>
              </InfiniteScroll> */}
            </div>
          )}
        </Box>
        {openHowWorksModal && (
          <HowWorksOfSongModal
            open={openHowWorksModal}
            handleClose={() => setOpenHowWorksModal(false)}
            type="pod"
          />
        )}
        {openCreateMusicModal &&
          (accountStatus !== 'authorized' ? (
            <WhiteListModal
              open={openCreatePodModal}
              handleClose={() => setOpenCreateMusicModal(false)}
            />
          ) : (
            <CreateMutipleEditionsPod //CreateSongModalNew
              onClose={() => setOpenCreateMusicModal(false)}
              handleRefresh={() => {}}
              open={openCreateMusicModal}
              type={contentType}
            />
          ))}
        {openCreatePodModal &&
          (accountStatus !== 'authorized' ? (
            <WhiteListModal
              open={openCreatePodModal}
              handleClose={() => setOpenCreatePodModal(false)}
            />
          ) : (
            <CreatePodModal
              onClose={() => {
                setOpenCreatePodModal(false);
              }}
              type={contentType}
              handleRefresh={handleRefresh}
              open={openCreatePodModal}
            />
          ))}
        {openCreateContent &&
          (accountStatus !== 'authorized' ? (
            <WhiteListModal
              open={openCreateContent}
              handleClose={() => setOpenCreateContent(false)}
            />
          ) : (
            <CreateContentModal
              handleClose={() => setOpenCreateContent(false)}
              onClickeContentCreation={(type) => {
                handleOpenCreatingModal(type);
              }}
              open={openCreateContent}
            />
          ))}
      </Box>
    </Suspense>
  );
}
