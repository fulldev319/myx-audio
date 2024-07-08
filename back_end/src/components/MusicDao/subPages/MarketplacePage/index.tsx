import React, { Suspense, lazy, useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import SpringCarousel from 'react-spring-3d-carousel';
import Carousel from 'react-elastic-carousel';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useAuth } from 'shared/contexts/AuthContext';
import { MenuItem, Select } from '@material-ui/core';

import Box from 'shared/ui-kit/Box';
import Loading from 'shared/ui-kit/Loading';
import Avatar from 'shared/ui-kit/Avatar';
import {
  PrimaryButton,
  CircularLoadingIndicator,
  ContentType
} from 'shared/ui-kit';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { listenerSocket } from 'components/Login/Auth';
import {
  getSongNftFeed,
  getNFTCollections,
  getTopWeb3Songs,
  getTopPlatforms,
  getTopWeb3Artists,
  getNewlyMintedSongs
  // getPlatforms
} from 'shared/services/API';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { processImage } from 'shared/helpers';
import { ChevronIconLeft } from 'shared/ui-kit/Icons/chevronIconDown';
import {
  getDefaultAvatar,
  getDefaultBGImage
} from 'shared/services/user/getUserAvatar';
import TopSongCard from 'components/MusicDao/components/Cards/TopSongCard';
import { DropDownIcon } from '../GovernancePage/styles';
import { usePageStyles } from './index.styles';

const NFTArtistCard = lazy(
  () => import('components/MusicDao/components/Cards/NFTArtistCard')
);

const NFTCollectionCard = lazy(
  () => import('components/MusicDao/components/Cards/NFTCollectionCard')
);

const ArtistSongCard = lazy(
  () => import('components/MusicDao/components/Cards/ArtistSongCard')
);

const NFTTrackCard = lazy(
  () => import('components/MusicDao/components/Cards/NFTTrackCard')
);

const HowWorksOfSongModal = lazy(
  () => import('components/MusicDao/modals/HowWorksOfSongModal')
);

const WhiteListModal = lazy(
  () => import('components/MusicDao/modals/WhiteListModal')
);

const CreateContentModal = lazy(
  () => import('components/MusicDao/modals/CreateContentModal')
);
const CreatePodModal = lazy(
  () => import('components/MusicDao/modals/CreateNewPodModal')
);
const CreateMutipleEditionsPod = lazy(
  () => import('components/MusicDao/modals/CreateMutipleEditionsPod')
);
// const PlatformCard = lazy(
//   () => import('components/MusicDao/components/Cards/PlatformCard')
// );

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  400: 2,
  700: 2,
  1200: 3,
  1440: 3
};

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 2,
  700: 2,
  1200: 3,
  1440: 4
};

const filterType = ['Top Platforms', 'Top Songs', 'Top Artists'];

export default function MarketplacePage() {
  const classes = usePageStyles();
  const history = useHistory();
  const { isSignedin, accountStatus } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isSmallTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [collections, setCollections] = useState<any[]>([]);
  const [lastCollectionId, setLastCollectionId] = useState<any>();
  const [collectionHasMore, setCollectionHasMore] = useState<boolean>(false);
  const [isCollectionLoading, setIsCollectionLoading] = useState<boolean>(
    false
  );
  const [isTopSongsLoading, setIsTopSongsLoading] = useState<boolean>(false);
  const [isTopPlatformsLoading, setIsTopPlatformsLoading] = useState<boolean>(
    false
  );

  const [loadingTopArtists, setLoadingTopArtists] = useState<boolean>(false);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  // const carouselRef = React.useRef<any>();

  const [songs, setSongs] = useState<any[]>([]);
  const [isSongLoading, setIsSongLoading] = useState<boolean>(false);
  // const [platforms, setPlatforms] = useState<any[]>([]);
  // const [lastPlatformId, setLastPlatformId] = useState<any>();
  // const [platformHasMore, setPlatformHasMore] = useState<boolean>(false);
  // const [isPlatformLoading, setIsPlatformLoading] = useState<boolean>(false);
  // const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);
  // const [searchValue, setSearchValue] = React.useState<string>('');

  const [selFilterType, setSelFilterType] = React.useState<string>(
    filterType[0]
  );
  const [currentSlider, setCurrentSlider] = useState<number>(0);
  const [currentSliderPlatform, setCurrentSliderPlatform] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionloading, setTransactionLoading] = useState<boolean>(false);
  const [transactionHasMore, setTransactionHasMore] = useState<boolean>(false);
  const [lastTransactionId, setLastTransactionId] = useState<any>();

  const [topSongs, setTopSongs] = useState<any[]>([]);
  const [topPlatforms, setTopPlatforms] = useState<any[]>([]);
  const topCarouselRef = React.useRef<any>();
  const [selectedTopSong, setSelectedTopSong] = useState<number>(0);

  const [contentType, setContentType] = useState<ContentType>(
    ContentType.SongSingleEdition
  );
  const [openHowWorksModal, setOpenHowWorksModal] = useState<boolean>(false);
  const [openCreateContent, setOpenCreateContent] = useState<boolean>(false);
  const [openCreateMusicModal, setOpenCreateMusicModal] = useState<boolean>(
    false
  );
  const [openCreatePodModal, setOpenCreatePodModal] = useState<boolean>(false);

  const MAX_NEW_LIST_LENGTH = 8;
  const COLLECTION_LIST_LENGTH = 6;
  // const PLATFORM_LIST_LENGTH = 3;

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
    loadTopPlatforms();
    loadTopSongs();
    loadTopArtists();
    loadSongs(true);
    // loadPlatforms();
    loadCollections(true);
    loadTransactions(true);
  }, []);

  const loadTopArtists = async () => {
    if (loadingTopArtists) return;
    try {
      setLoadingTopArtists(true);
      const responseTopArtists = await getTopWeb3Artists({ pageSize: 5 });
      if (responseTopArtists.success) {
        let newCharacters = responseTopArtists.data;
        newCharacters = newCharacters.sort((a, b) =>
          a.count > b.count
            ? -1
            : a.count === b.count
              ? a.count > b.count
                ? 1
                : 1
              : 1
        );
        setTopArtists(newCharacters);
      } else {
        setTopArtists([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTopArtists(false);
    }
  };

  const loadSongs = async (init = false) => {
    if (isSongLoading) return;
    try {
      setIsSongLoading(true);

      const response = await getNewlyMintedSongs({
        pageSize: MAX_NEW_LIST_LENGTH
      });
      if (response.success) {
        const newCharacters = response.data;
        setSongs((prev) =>
          init ? newCharacters : [...prev, ...newCharacters]
        );
      } else {
        setSongs([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSongLoading(false);
    }
  };

  // const loadPlatforms = async (init = false) => {
  //   if (isPlatformLoading) return;
  //   try {
  //     setIsPlatformLoading(true);

  //     const response = await getPlatforms({
  //       lastId: undefined,
  //       pageSize: PLATFORM_LIST_LENGTH
  //     });
  //     if (response.success) {
  //       const newCharacters = response.data;
  //       const newLastId = response.lastId;
  //       const newhasMore = response.hasMore;
  //       console.log(newCharacters);
  //       setPlatforms((prev) =>
  //         init ? newCharacters : [...prev, ...newCharacters]
  //       );
  //       setLastPlatformId(newLastId);
  //       setPlatformHasMore(newhasMore);
  //     } else {
  //       setPlatforms([]);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsPlatformLoading(false);
  //   }
  // };

  useEffect(() => {
    if (listenerSocket) {
      const newNFTHandler = (_newNFT) => {
        if (_newNFT && !isSongLoading) {
          setSongs((prev) => {
            const _newListings = prev.filter(
              (nft) =>
                _newNFT.collectionId !== nft.collectionId ||
                _newNFT.tokenId !== nft.tokenId
            );
            if (_newListings.length >= MAX_NEW_LIST_LENGTH) {
              _newListings.pop();
            }
            return [_newNFT].concat(_newListings);
          });
        }
      };

      const updateMarketPlaceFeedHandler = (_transaction) => {
        setTransactions((prev) => {
          let _transactions = prev.map((transaction) =>
            _transaction.id === transaction.id ? _transaction : transaction
          );
          if (
            _transactions.length === 0 ||
            _transactions[0].createdAt <= _transaction.createdAt
          ) {
            _transactions = [_transaction].concat(_transactions);
          }
          return _transactions;
        });
      };

      listenerSocket.on('newNFT', newNFTHandler);
      listenerSocket.on('updateMarketPlaceFeed', updateMarketPlaceFeedHandler);

      return () => {
        listenerSocket.removeListener('newNFT', newNFTHandler);
        listenerSocket.removeListener(
          'updateMarketPlaceFeed',
          updateMarketPlaceFeedHandler
        );
      };
    }
  }, [listenerSocket]);

  const loadTransactions = async (init = false) => {
    if (transactionloading) return;
    try {
      setTransactionLoading(true);

      const response = await getSongNftFeed({
        // collectionId: collectionId,
        lastId: init ? undefined : lastTransactionId,
        type: undefined
      });
      console.log(response);
      if (response.success) {
        const newCharacters = response.data.list;
        const newLastId = response.data.lastId;
        const newhasMore = response.data.hasMore;

        setTransactions((prev) =>
          init ? newCharacters : [...prev, ...newCharacters]
        );
        setLastTransactionId(newLastId);
        setTransactionHasMore(newhasMore);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTransactionLoading(false);
    }
  };

  const loadTopSongs = async () => {
    if (isTopSongsLoading) return;
    try {
      setIsTopSongsLoading(true);

      const response = await getTopWeb3Songs({
        pageSize: MAX_NEW_LIST_LENGTH,
        status: undefined
      });
      if (response.success) {
        setTopSongs(response.data);
      } else {
        setTopSongs([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsTopSongsLoading(false);
    }
  };

  const loadTopPlatforms = async () => {
    if (isTopSongsLoading) return;
    try {
      setIsTopPlatformsLoading(true);

      const response = await getTopPlatforms();
      if (response.success) {
        setTopPlatforms(response.data);
      } else {
        setTopPlatforms([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsTopPlatformsLoading(false);
    }
  };

  const loadCollections = async (init = false) => {
    if (isCollectionLoading) return;
    try {
      setIsCollectionLoading(true);

      const response = await getNFTCollections({
        lastId: init ? undefined : lastCollectionId,
        pageSize: COLLECTION_LIST_LENGTH,
        status: undefined
      });
      if (response.success) {
        const newCharacters = response.data;
        const newLastId = response.lastId;
        const newhasMore = true;

        setCollections((prev) =>
          init ? newCharacters : [...prev, ...newCharacters]
        );
        setLastCollectionId(newLastId);
        setCollectionHasMore(newhasMore);
      } else {
        setCollections([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsCollectionLoading(false);
    }
  };

  const handleRefresh = () => {
    loadTopPlatforms();
    loadTopSongs();
    loadTopArtists();
    loadSongs(true);
    loadCollections(true);
    loadTransactions(true);
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

  const handleGoToNFT = (collection, tokenId, source) => {
    if (source === 'myx') {
      history.push(`/music/myx-track/${collection}-${tokenId}`);
    } else {
      history.push(`/music/web3-track/${collection}-${tokenId}`);
    }
  };
  // const gotoCollection = (id) => {
  //   history.push(`/collections/${id}`);
  // };
  // const goToArtistPage = (id) => {
  //   history.push(`/marketplace/artists/${id}`);
  // };
  const handleGoToOpenseaSong = (collectionAddress, tokenId) => {
    // const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(
      `https://opensea.io/assets/${collectionAddress}/${tokenId}`,
      '_blank'
    );
    // window.open(`https://${!isProd ? 'testnets.' : ''}opensea.io/${artist?.name}`,'_blank');
  };
  const handleGoToOpenseaArtist = (name) => {
    // const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(`https://opensea.io/${name}`, '_blank');
    // window.open(`https://${!isProd ? 'testnets.' : ''}opensea.io/${artist?.name}`,'_blank');
  };

  const shortId = (id) => {
    if (!id || id.length < 12) {
      return id;
    }
    return id.substring(0, 6) + '...' + id.substring(id.length - 4);
  };

  return (
    <Suspense fallback={<Loading />}>
      <Box className={classes.marketplaceRoot} id={'scrollContainer'}>
        <Box className={classes.content}>
          {!isMobile && (
            <>
              {/* <img
                src={require('assets/icons3d/soundwave.svg')}
                style={{
                  position: 'absolute',
                  left: 50,
                  top: 150,
                  width: 150
                }}
              /> */}
              {/* <img
                src={require('assets/icons3d/play_triangle.svg')}
                style={{
                  position: 'absolute',
                  right: 100,
                  top: 50
                }}
              /> */}
            </>
          )}
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            <Box className={classes.title}>Explore Myx Music</Box>
            <Box className={classes.description}>
              The Web3 Marketplace to trade, collaborate and create Music NFTs
            </Box>
            <Box className={classes.topBtnRow}>
              <PrimaryButton
                size="medium"
                onClick={() => setOpenHowWorksModal(true)}
                isRounded
                style={{
                  color: '#FFFFFF',
                  background: 'rgba(255, 255, 255, 0.2)',
                  width: 170,
                  height: 52,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                How It Works
              </PrimaryButton>
              {isSignedin && accountStatus && (
                <PrimaryButton
                  size="medium"
                  onClick={() => setOpenCreateContent(true)}
                  isRounded
                  style={{
                    background: '#2D3047',
                    width: 170,
                    height: 52,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '8px'
                  }}
                >
                  Create
                </PrimaryButton>
              )}
            </Box>
          </Box>
          <Box className={classes.headerSection}>
            <Box className={classes.leftHeaderSection}>
              {selFilterType === filterType[1] ? (
                <Box>
                  {isTopSongsLoading ? (
                    <Box display={'flex'} justifyContent="center" mt={10}>
                      <CircularLoadingIndicator />
                    </Box>
                  ) : (
                    <>
                      <Box
                        className={classes.sliderContainer}
                        mt={10}
                        position="relative"
                      >
                        <Carousel
                          isRTL={false}
                          itemsToShow={
                            isMobile ? 1 : isSmallTablet ? 2 : isTablet ? 3 : 4
                          }
                          pagination={false}
                          showArrows={false}
                          ref={topCarouselRef}
                        >
                          {topSongs?.map((item, idx) => (
                            <TopSongCard
                              data={item}
                              key={`topSong_${idx}`}
                              setSelected={() => setSelectedTopSong(idx)}
                              isSelected={idx === selectedTopSong}
                            />
                          ))}
                        </Carousel>
                        <Box
                          display="flex"
                          justifyContent="center"
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            transform: 'translateY(50%)'
                          }}
                        >
                          <Box className={classes.arrowBox}>
                            <Box
                              style={{
                                transform: 'rotate(90deg)',
                                cursor: 'pointer'
                              }}
                              mr={2}
                              onClick={() => topCarouselRef.current.slidePrev()}
                            >
                              <ChevronIconLeft />
                            </Box>
                            <Box
                              style={{
                                transform: 'rotate(-90deg)',
                                cursor: 'pointer'
                              }}
                              ml={2}
                              onClick={() => topCarouselRef.current.slideNext()}
                            >
                              <ChevronIconLeft />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      <Box className={classes.typo1} mt={3} px={1}>
                        {topSongs[selectedTopSong]?.Name || ''}
                      </Box>
                      <Box
                        className={classes.typo2}
                        mt={1.5}
                        px={1}
                        display="flex"
                        alignItems={isMobile ? 'start' : 'center'}
                        flexDirection={isMobile ? 'column' : 'row'}
                      >
                        <Box
                          mr={1}
                          onClick={() =>
                            handleGoToOpenseaSong(
                              topSongs[selectedTopSong]?.CollectionAddress,
                              topSongs[selectedTopSong]?.TokenId
                            )
                          }
                        >
                          <OpenseaIcon />
                        </Box>
                        {topSongs[selectedTopSong]?.OwnerAddress || ''}
                      </Box>
                      <Box
                        className={classes.typo3}
                        mt={1.5}
                        px={1}
                        minHeight={'36px'}
                      >
                        {topSongs[selectedTopSong]?.Description || ''}
                      </Box>
                      {topSongs[selectedTopSong]?.Name && (
                        <PrimaryButton
                          size="medium"
                          style={{
                            width: 215,
                            height: 52,
                            borderRadius: 40,
                            background: '#0D59EE',
                            marginLeft: 8,
                            marginTop: 25
                          }}
                          onClick={() => {
                            history.push(`/songs`);
                          }}
                        >
                          Explore All
                        </PrimaryButton>
                      )}
                    </>
                  )}
                </Box>
              ) : selFilterType === filterType[0] ? (
                <>
                  {isTopPlatformsLoading ? (
                    <Box display={'flex'} justifyContent="center" mt={10}>
                      <CircularLoadingIndicator />
                    </Box>
                  ) : (
                    <Box className={classes.topPlatformsCarouselWrapper}>
                      <SpringCarousel
                        slides={topPlatforms.map((item, index) => ({
                          key: `platform_image_${index}`,
                          content: (
                            <img
                              src={
                                processImage(item?.image) ?? getDefaultBGImage()
                              }
                              onClick={() =>
                                history.push('/platforms/' + item?.id)
                              }
                              alt="platform image"
                              className={classes.leftHeaderCollectionImg}
                              style={{
                                objectFit: 'cover',
                                cursor: 'pointer'
                              }}
                              width="250px"
                            />
                          )
                        }))}
                        goToSlide={currentSliderPlatform + 1}
                        showNavigation={false}
                        offsetRadius={isMobile ? 1 : 2}
                      />
                    </Box>
                  )}
                  {topPlatforms?.length > 0 && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      flexDirection="column"
                    >
                      <Box
                        className={classes.leftHeaderArtistArrowBox}
                        style={{ marginTop: -20 }}
                      >
                        <Box
                          style={{ cursor: 'pointer' }}
                          mr={3}
                          onClick={() =>
                            setCurrentSliderPlatform((prev) =>
                              prev === 0 ? 4 : prev - 1
                            )
                          }
                        >
                          <ArrowIcon />
                        </Box>
                        <Box
                          bgcolor="#FEF4EF"
                          width={'1px'}
                          height={1}
                          mb={'5px'}
                        />
                        <Box
                          style={{
                            transform: 'scaleX(-1)',
                            cursor: 'pointer'
                          }}
                          ml={3}
                          onClick={() =>
                            setCurrentSliderPlatform((prev) =>
                              prev === 4 ? 0 : prev + 1
                            )
                          }
                        >
                          <ArrowIcon />
                        </Box>
                      </Box>
                      <Box className={classes.typo1} mt={2} px={1}>
                        {topPlatforms[
                          currentSliderPlatform % topPlatforms?.length
                        ]?.name || ''}
                      </Box>
                      <Box className={classes.typo2} mt={1.5} px={1}>
                        {topPlatforms[
                          currentSliderPlatform % topPlatforms?.length
                        ]?.artistName || ''}
                      </Box>
                      <Box
                        className={classes.typo3}
                        mt={1}
                        px={1}
                        minHeight={isMobile ? 33 : 36}
                      >
                        {topPlatforms[
                          currentSliderPlatform % topPlatforms?.length
                        ]?.description || ''}
                      </Box>
                      {topPlatforms[
                        currentSliderPlatform % topPlatforms?.length
                      ] && (
                          <PrimaryButton
                            size="medium"
                            style={{
                              width: 215,
                              height: 52,
                              borderRadius: 40,
                              background: 'rgb(13, 89, 238)',
                              marginLeft: 8,
                              marginTop: 20
                            }}
                            onClick={() => {
                              history.push('/platforms');
                            }}
                          >
                            Explore All
                          </PrimaryButton>
                        )}
                    </Box>
                  )}
                </>
              ) : (
                <Box width={1}>
                  {topArtists && topArtists.length > 0 ? (
                    <>
                      <Box className={classes.topArtistsCarouselWrapper}>
                        <SpringCarousel
                          slides={topArtists.map((item, index) => ({
                            key: index,
                            content: (
                              <Avatar
                                size={210}
                                rounded
                                image={
                                  processImage(item.image) ?? getDefaultAvatar()
                                }
                              />
                            )
                          }))}
                          goToSlide={currentSlider}
                          showNavigation={false}
                          offsetRadius={isMobile ? 1 : 2}
                        />
                      </Box>
                      <Box
                        display={'flex'}
                        justifyContent="center"
                        flexDirection={'column'}
                        alignItems="center"
                      >
                        <div
                          className={classes.leftHeaderArtistArrowBox}
                          style={{
                            marginTop: 8
                          }}
                        >
                          <Box
                            style={{ cursor: 'pointer' }}
                            mr={3}
                            onClick={() => setCurrentSlider((prev) => prev - 1)}
                          >
                            <ArrowIcon />
                          </Box>
                          <Box
                            bgcolor="#FEF4EF"
                            width={'1px'}
                            height={1}
                            mb={'5px'}
                          />
                          <Box
                            style={{
                              transform: 'scaleX(-1)',
                              cursor: 'pointer'
                            }}
                            ml={3}
                            onClick={() => setCurrentSlider((prev) => prev + 1)}
                          >
                            <ArrowIcon />
                          </Box>
                        </div>
                        {topArtists?.length > 0 && (
                          <>
                            <Box className={classes.typo9} mt={3.5}>
                              {topArtists[currentSlider % topArtists?.length]
                                ?.name ?? ''}
                            </Box>
                            <Box
                              display={'flex'}
                              flexDirection={isMobile ? 'column' : 'row'}
                              alignItems={isMobile ? 'center' : 'start'}
                              mt={1}
                              mb={4}
                            >
                              <Box
                                className={classes.typo10}
                                onClick={() => {
                                  window.open(
                                    `https://opensea.io/${topArtists[
                                      currentSlider % topArtists?.length
                                    ]?.address
                                    }`,
                                    '_blank'
                                  );
                                }}
                              >
                                <OpenseaIcon />
                              </Box>
                              <Box
                                className={classes.typo10}
                                color="#2D304721"
                                mx={1}
                              ></Box>
                              <Box className={classes.typo11}>
                                {topArtists[currentSlider % topArtists?.length]
                                  ?.address ?? ''}
                              </Box>
                            </Box>
                            {topArtists[currentSlider % topArtists?.length] && (
                              <PrimaryButton
                                size="medium"
                                style={{
                                  width: 215,
                                  height: 52,
                                  borderRadius: 40,
                                  background: 'rgb(13, 89, 238)'
                                }}
                                onClick={() => history.push('/web3-artists')}
                              >
                                Explore All
                              </PrimaryButton>
                            )}
                          </>
                        )}
                      </Box>
                    </>
                  ) : (
                    <Box display="flex" justifyContent="center" mt={6}>
                      No Artists
                    </Box>
                  )}
                </Box>
              )}
              <Box
                display={'flex'}
                alignItems="center"
                gridGap={4}
                position={'absolute'}
                left={36}
                top={36}
              >
                {isMobile ? (
                  <Select
                    IconComponent={DropDownIcon}
                    value={selFilterType}
                    onChange={(e) => {
                      setSelFilterType('' + e.target.value);
                    }}
                    style={{
                      height: 34,
                      borderRadius: 40,
                      background: '#0D59EE',
                      color: '#fff',
                      padding: '6px 14px 3px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: 0
                    }}
                  >
                    {filterType.map((type, index) => (
                      <MenuItem key={`discussion-sort-${index}`} value={type}>
                        <Box>{type}</Box>
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  filterType.map((type) => (
                    <PrimaryButton
                      size="medium"
                      style={{
                        height: isTablet ? 34 : 33,
                        borderRadius: 40,
                        background: selFilterType === type ? '#0D59EE' : '#fff',
                        color: selFilterType === type ? '#fff' : '#000',
                        padding: '0px 14px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 0
                      }}
                      onClick={() => {
                        setSelFilterType(type);
                      }}
                    >
                      {type}
                    </PrimaryButton>
                  ))
                )}
              </Box>
            </Box>
            <Box className={classes.rightHeaderSection}>
              <Box className={classes.typo4} pl={2}>
                Latest Transfers
              </Box>
              <Box className={classes.transferHistoryHeader}>
                <Box width={'50%'}>Name</Box>
                <Box width={'30%'} textAlign="center">
                  Status
                </Box>
                <Box width={'20%'} textAlign="center" pr={1}>
                  Price
                </Box>
              </Box>
              <Box className={classes.transferHistoryContent}>
                {transactionloading ? (
                  <Box display={'flex'} justifyContent="center" mt={3}>
                    <CircularLoadingIndicator />
                  </Box>
                ) : transactions && transactions.length ? (
                  transactions.map((item, index) => (
                    <Box
                      display={'flex'}
                      alignItems="center"
                      pb={2}
                      borderBottom="1px solid #ffffff10"
                      mt={1.5}
                    >
                      <Box
                        display={'flex'}
                        alignItems="center"
                        width={'50%'}
                        justifyContent="start"
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          handleGoToNFT(
                            item.collection,
                            item.tokenId,
                            item.source
                          )
                        }
                      >
                        <div className={classes.avatar}>
                          <img
                            src={
                              processImage(item?.image) ??
                              require('assets/musicDAOImages/marketplace_avatar_sample.webp')
                            }
                            alt="nft image"
                          />
                        </div>
                        <Box>{item.name}</Box>
                      </Box>
                      <Box
                        width={'30%'}
                        display="flex"
                        justifyContent={'center'}
                      >
                        <Box
                          className={classes.transferType}
                          style={{
                            background:
                              item.type.toLowerCase() === 'transfer'
                                ? '#65CB63'
                                : item.type.toLowerCase() === 'sold'
                                  ? '#29BAF9'
                                  : item.type.toLowerCase() === 'mint'
                                    ? '#2D3047'
                                    : '#65CB63'
                          }}
                          width={'70%'}
                        >
                          {item.type}
                        </Box>
                      </Box>
                      <Box width={'20%'} textAlign="center">
                        {item.price ? `${Number(item.price).toFixed(4)} ${item.symbol ? item.symbol : 'USDT'}` : '-'}
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box
                    style={{
                      flex: '1',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gridGap: '13px'
                    }}
                  >
                    <NoHistoryIcon />
                    <Box className={classes.noHistory}>
                      No transaction history yet.
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Box className={classes.topArtistSection}>
            <Box
              display={'flex'}
              alignItems="center"
              justifyContent={'space-between'}
            >
              <Box className={classes.title1}>Top Artists</Box>
              <Box
                className={classes.typo5}
                onClick={() => {
                  history.push('/web3-artists');
                }}
              >
                View All
              </Box>
            </Box>
            <Box className={classes.topArtists} mt={6}>
              {isTablet ? (
                topArtists.slice(0, 4).map((item, idx) => (
                  <Box
                    display={'flex'}
                    alignItems="center"
                    onClick={() =>
                      item &&
                      item.address &&
                      history.push(`/marketplace/artists/${item.address}`)
                    }
                  >
                    <Box className={classes.typo8} mr={1.5}>
                      {idx + 1}.
                    </Box>
                    <Avatar
                      size={60}
                      rounded
                      image={
                        processImage(item.image) ??
                        require('assets/musicDAOImages/marketplace_avatar_sample.webp')
                      }
                    />
                    <Box display={'flex'} flexDirection="column" ml={1.2}>
                      <Box className={classes.typo6} mb={1}>
                        {item.name}
                      </Box>
                      <Box
                        className={classes.typo7}
                        display="flex"
                        alignItems="center"
                      >
                        <Box
                          mr={1}
                          onClick={() => handleGoToOpenseaArtist(item.name)}
                        >
                          <OpenseaIcon />
                        </Box>
                        {shortId(item.address)}
                      </Box>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box
                  className={classes.sliderContainer1}
                  padding={2}
                  ml={-2}
                  mt={-2}
                >
                  <MasonryGrid
                    gutter={isMobile ? '8px' : '16px'}
                    data={topArtists.slice(0, 4)}
                    renderItem={(item, idx) => (
                      <NFTArtistCard
                        data={item}
                        index={idx + 1}
                        key={`top_artist_box_${idx}`}
                      />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                  {/* <Carousel
                    isRTL={false}
                    itemsToShow={4}
                    pagination={false}
                    showArrows={false}
                    ref={carouselRef}
                  >
                    {topArtists.map((item, idx) => (
                      <NFTArtistCard
                        data={item}
                        index={idx + 1}
                        key={`top_artist_box_${idx}`}
                      />
                    ))}
                  </Carousel> */}
                </Box>
              )}
            </Box>
          </Box>
          {/* <Box className={classes.nftCollectionSection}>
            <Box
              display={'flex'}
              alignItems="center"
              justifyContent={'space-between'}
            >
              <Box className={classes.title1}>Platforms</Box>
              <Box
                className={classes.typo5}
                onClick={() => {
                  history.push('/platforms');
                }}
              >
                EXPLORE All
              </Box>
            </Box>
          </Box>
          <Box>
            <Box mt={4} style={{ marginBottom: isMobile ? '8px' : '16px' }}>
              {!isPlatformLoading && platforms.length === 0 && (
                <Box textAlign="center" mt={6}>
                  No Platforms
                </Box>
              )}
              <MasonryGrid
                gutter={isMobile ? '8px' : '16px'}
                data={platforms}
                renderItem={(item, _) => (
                  <PlatformCard
                    data={item}
                    isLoading={Object.entries(item).length === 0}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
              />
            </Box>
          </Box> */}
          <Box className={classes.nftCollectionSection}>
            <Box
              display={'flex'}
              alignItems="center"
              justifyContent={'space-between'}
            >
              <Box className={classes.title1}>NFT Collections</Box>
              <Box
                className={classes.typo5}
                onClick={() => {
                  history.push('/collections');
                }}
              >
                EXPLORE All
              </Box>
            </Box>
          </Box>
          <Box>
            <Box mt={4} style={{ marginBottom: isMobile ? '8px' : '16px' }}>
              {!isCollectionLoading && collections.length === 0 && (
                <Box textAlign="center" mt={6}>
                  No NFT Collections
                </Box>
              )}
              <MasonryGrid
                gutter={isMobile ? '8px' : '16px'}
                data={collections}
                renderItem={(item, _) => (
                  <NFTCollectionCard
                    collection={item}
                    isLoading={Object.entries(item).length === 0}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
              />
            </Box>
          </Box>
          <Box className={classes.newlyMintedSongSection}>
            <Box
              display={'flex'}
              alignItems="center"
              justifyContent={'space-between'}
            >
              <Box className={classes.title1}>Newly Minted Songs</Box>
              <Box
                className={classes.typo5}
                onClick={() => {
                  history.push('/songs');
                }}
              >
                EXPLORE All
              </Box>
            </Box>
            <Box>
              <InfiniteScroll
                hasChildren={songs.length > 0}
                dataLength={songs.length}
                scrollableTarget={'scrollContainer'}
                next={() => { }}
                hasMore={false}
                loader={
                  isSongLoading && (
                    <MasonryGrid
                      gutter={isMobile ? '8px' : '16px'}
                      data={Array(loadingCount).fill(0)}
                      renderItem={(item, _) =>
                        item.Source == 'myx' ? (
                          <ArtistSongCard
                            song={item}
                            isLoading={Object.entries(item).length === 0}
                            platform={true}
                          />
                        ) : (
                          <NFTTrackCard
                            data={item}
                            isLoading={Object.entries(item).length === 0}
                          />
                        )
                      }
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                    />
                  )
                }
              >
                <Box mt={4} style={{ marginBottom: isMobile ? '8px' : '16px' }}>
                  {!isSongLoading && songs.length === 0 && (
                    <Box textAlign="center" mt={6}>
                      No Songs
                    </Box>
                  )}
                  <MasonryGrid
                    gutter={isMobile ? '8px' : '16px'}
                    data={songs}
                    renderItem={(item, _) =>
                      item.Source == 'myx' ? (
                        <ArtistSongCard
                          song={item}
                          isLoading={Object.entries(item).length === 0}
                          platform={true}
                        />
                      ) : (
                        <NFTTrackCard
                          data={item}
                          isLoading={Object.entries(item).length === 0}
                        />
                      )
                    }
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                </Box>
              </InfiniteScroll>
            </Box>
          </Box>
        </Box>
        {openHowWorksModal && (
          <HowWorksOfSongModal
            open={openHowWorksModal}
            handleClose={() => setOpenHowWorksModal(false)}
            type="song"
          />
        )}
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

        {openCreateMusicModal &&
          (accountStatus !== 'authorized' ? (
            <WhiteListModal
              open={openCreatePodModal}
              handleClose={() => setOpenCreateMusicModal(false)}
            />
          ) : (
            <CreateMutipleEditionsPod // CreateSongModalNew
              onClose={() => setOpenCreateMusicModal(false)}
              handleRefresh={() => { }}
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
      </Box>
    </Suspense>
  );
}

const ArrowIcon = () => (
  <svg
    width="11"
    height="21"
    viewBox="0 0 11 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.658 1.40234L0.441406 10.6189L9.658 19.8355"
      stroke="#181818"
      stroke-width="0.829493"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const NoHistoryIcon = () => (
  <svg
    width="62"
    height="56"
    viewBox="0 0 62 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.5"
      d="M33.1805 7.96465e-06C22.2684 7.96465e-06 12.771 6.22449 8.20438 15.3201L7.21263 13.5454C6.61236 12.4362 5.44119 11.7609 4.1852 11.7967C3.00421 11.8228 1.92444 12.4688 1.34701 13.4964C0.769578 14.5273 0.776109 15.7833 1.36659 16.8076L5.95993 25.0026C6.831 26.575 8.7916 27.1753 10.3967 26.3597L18.5655 22.184C19.3909 21.8023 20.027 21.1041 20.3272 20.2461C20.6273 19.3849 20.5621 18.442 20.151 17.6298C19.7367 16.8207 19.0124 16.2107 18.1415 15.9497C17.2704 15.6854 16.3308 15.7866 15.5381 16.2335L15.2771 16.364C19.0288 10.5571 25.6188 6.68123 33.1812 6.68123C44.9552 6.68123 54.3991 16.0149 54.3991 27.5601C54.3991 39.0109 45.1046 48.2886 33.4684 48.4389C32.5811 48.452 31.7362 48.8174 31.1196 49.4535C30.503 50.0896 30.1637 50.9444 30.1768 51.8317C30.1931 52.7158 30.5585 53.5608 31.1947 54.1774C31.8308 54.7939 32.6856 55.1332 33.5729 55.1202C48.7427 54.9244 61.0812 42.6421 61.0812 27.5601C61.0812 12.3544 48.5164 7.96465e-06 33.1805 7.96465e-06Z"
      fill="#F0F2F5"
    />
    <path
      opacity="0.8"
      d="M31.2234 16.6882C31.6797 16.2352 32.3048 15.975 32.9614 15.9657C33.63 15.9541 34.2745 16.2053 34.7476 16.6607C35.2207 17.116 35.4814 17.7386 35.4718 18.3821V26.7451L40.7243 30.7967C41.7888 31.6168 41.9626 33.1152 41.1105 34.142C40.256 35.1666 38.6991 35.3338 37.6346 34.5137L31.4552 29.7559C30.8686 29.3029 30.5258 28.6199 30.5283 27.8974V18.3818C30.5162 17.7499 30.7672 17.1412 31.2234 16.6882Z"
      fill="white"
    />
  </svg>
);

export const OpenseaIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_7431_101126)">
      <path
        d="M22.0004 11.0554C22.0004 16.9709 17.2043 21.767 11.2888 21.767C5.37323 21.767 0.577148 16.9709 0.577148 11.0554C0.577148 5.13983 5.37323 0.34375 11.2888 0.34375C17.2055 0.34375 22.0004 5.13983 22.0004 11.0554Z"
        fill="#2081E2"
      />
      <path
        d="M5.86199 11.4154L5.9082 11.3427L8.69471 6.98358C8.73544 6.91976 8.83118 6.92636 8.86199 6.99568C9.32751 8.03897 9.7292 9.33649 9.54102 10.1443C9.46068 10.4766 9.24058 10.9267 8.99295 11.3427C8.96105 11.4033 8.92583 11.4627 8.8884 11.5199C8.87079 11.5463 8.84108 11.5617 8.80916 11.5617H5.94341C5.86638 11.5617 5.82126 11.4781 5.86199 11.4154Z"
        fill="white"
      />
      <path
        d="M18.2824 12.2258V12.9158C18.2824 12.9554 18.2582 12.9906 18.223 13.0061C18.0073 13.0985 17.2688 13.4375 16.9618 13.8645C16.1782 14.9551 15.5795 16.5145 14.2413 16.5145H8.65835C6.67964 16.5145 5.07617 14.9056 5.07617 12.9202V12.8564C5.07617 12.8036 5.11908 12.7606 5.17191 12.7606H8.28419C8.34581 12.7606 8.39092 12.8179 8.38544 12.8784C8.36342 13.0809 8.40084 13.2878 8.49658 13.476C8.68147 13.8513 9.06445 14.0857 9.47824 14.0857H11.019V12.8828H9.49585C9.41772 12.8828 9.37151 12.7925 9.41663 12.7287C9.43312 12.7034 9.45185 12.677 9.47164 12.6473C9.61582 12.4426 9.82161 12.1246 10.0263 11.7625C10.1661 11.5182 10.3014 11.2573 10.4104 10.9954C10.4324 10.9481 10.45 10.8997 10.4676 10.8523C10.4973 10.7687 10.5281 10.6906 10.5501 10.6124C10.5722 10.5464 10.5898 10.4771 10.6074 10.4121C10.6591 10.1898 10.6811 9.95431 10.6811 9.71C10.6811 9.61426 10.6767 9.51411 10.6679 9.41837C10.6635 9.31382 10.6503 9.20926 10.6371 9.10471C10.6283 9.01227 10.6118 8.92092 10.5942 8.82518C10.5722 8.68542 10.5413 8.54676 10.5061 8.40698L10.494 8.35417C10.4676 8.25841 10.4456 8.16708 10.4148 8.07134C10.3278 7.77088 10.2277 7.47815 10.122 7.20413C10.0835 7.09517 10.0395 6.99062 9.99548 6.88608C9.93057 6.7287 9.86452 6.58564 9.804 6.45027C9.77319 6.38863 9.74678 6.3325 9.72036 6.27528C9.69065 6.21035 9.65984 6.14541 9.62901 6.0838C9.60701 6.03648 9.58169 5.99245 9.56408 5.94843L9.3759 5.60066C9.34948 5.55334 9.39351 5.49721 9.44523 5.51152L10.6228 5.83066H10.6261C10.6283 5.83066 10.6294 5.83178 10.6305 5.83178L10.7857 5.87469L10.9562 5.92313L11.019 5.94071V5.2408C11.019 4.90293 11.2897 4.62891 11.6243 4.62891C11.7915 4.62891 11.9434 4.69714 12.0524 4.80828C12.1613 4.91945 12.2295 5.07132 12.2295 5.2408V6.27969L12.355 6.31489C12.3649 6.31821 12.3748 6.32261 12.3836 6.3292C12.4144 6.35232 12.4584 6.38642 12.5146 6.42826C12.5586 6.46346 12.6059 6.50639 12.6631 6.55042C12.7765 6.64175 12.9119 6.75951 13.0604 6.89488C13.1 6.92899 13.1386 6.96421 13.1738 6.99943C13.3653 7.17771 13.5799 7.3868 13.7846 7.61792C13.8418 7.68285 13.8979 7.74888 13.9552 7.8182C14.0124 7.88864 14.0729 7.95797 14.1257 8.02732C14.1951 8.11976 14.2699 8.2155 14.3348 8.31565C14.3656 8.36297 14.4009 8.41139 14.4306 8.45872C14.5142 8.58526 14.588 8.71624 14.6584 8.8472C14.6881 8.90772 14.7189 8.97375 14.7453 9.03868C14.8235 9.21367 14.8851 9.39195 14.9247 9.57024C14.9368 9.60876 14.9456 9.65058 14.95 9.688V9.69681C14.9632 9.74962 14.9676 9.80574 14.972 9.86297C14.9896 10.0457 14.9808 10.2283 14.9412 10.4121C14.9247 10.4903 14.9027 10.564 14.8763 10.6421C14.8499 10.717 14.8235 10.7951 14.7894 10.8688C14.7233 11.0218 14.6452 11.1748 14.5527 11.3179C14.523 11.3707 14.4878 11.4268 14.4526 11.4796C14.4141 11.5358 14.3745 11.5886 14.3392 11.6403C14.2908 11.7063 14.2391 11.7757 14.1863 11.8373C14.1389 11.9022 14.0905 11.9672 14.0377 12.0244C13.964 12.1113 13.8935 12.1939 13.8198 12.2731C13.7758 12.3248 13.7285 12.3777 13.68 12.425C13.6327 12.4778 13.5843 12.5251 13.5403 12.5691C13.4665 12.6429 13.4049 12.7001 13.3532 12.7474L13.2321 12.8586C13.2145 12.874 13.1914 12.8828 13.1672 12.8828H12.2295V14.0857H13.4093C13.6734 14.0857 13.9244 13.9921 14.1268 13.8204C14.1962 13.7599 14.4988 13.498 14.8565 13.1029C14.8686 13.0897 14.884 13.0798 14.9016 13.0754L18.1602 12.1334C18.2208 12.1157 18.2824 12.162 18.2824 12.2258Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_7431_101126">
        <rect
          width="21.4232"
          height="21.4232"
          fill="white"
          transform="translate(0.577148 0.34375)"
        />
      </clipPath>
    </defs>
  </svg>
);
