import React, { lazy, Suspense, useState, useEffect, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDebounce } from 'use-debounce/lib';
import Axios from 'axios';
// import Carousel from 'react-elastic-carousel';
// import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import useMediaQuery from '@material-ui/core/useMediaQuery';
// import Hidden from '@material-ui/core/Hidden';
import useTheme from '@material-ui/core/styles/useTheme';

// import { RootState } from 'store/reducers/Reducer';
// import { setMusicsList, setScrollPositionInMusics } from 'store/actions/Musics';
import {
  setArtistsList,
  setScrollPositionInArtists
} from 'store/actions/Artists';
import { setPodsList, setScrollPositionInPods } from 'store/actions/Pods';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';
import {
  SearchIcon,
  UnionIcon,
  DetailIcon
} from '../../components/Icons/SvgIcons';
import Box from 'shared/ui-kit/Box';
import Loading from 'shared/ui-kit/Loading';
import {
  Color,
  ContentType,
  PrimaryButton,
  SecondaryButton
} from 'shared/ui-kit';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { musicDaoGetSongNFts, musicDaoGetTopAlbums } from 'shared/services/API';
import { MusicGenres } from 'shared/constants/constants';
import { useAuth } from 'shared/contexts/AuthContext';
import URL from 'shared/functions/getURL';
// import { ChevronIconLeft } from 'shared/ui-kit/Icons/chevronIconDown';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
// import { ArrowLeftIcon } from '../GovernancePage/styles';
import { MusicPageStyles } from './index.styles';

const WhiteListModal = lazy(
  () => import('components/MusicDao/modals/WhiteListModal')
);
const ArtistSongCard = lazy(
  () => import('components/MusicDao/components/Cards/ArtistSongCard')
);
const ListSongCard = lazy(
  () => import('components/MusicDao/components/Cards/ListSongCard')
);
// const AlbumCard = lazy(
//   () => import('components/MusicDao/components/Cards/AlbumCard')
// );
const HowWorksOfSongModal = lazy(
  () => import('components/MusicDao/modals/HowWorksOfSongModal')
);
const CustomSelect = lazy(
  () => import('components/MusicDao/components/CustomSelect')
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

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  700: 2,
  1200: 3,
  1440: 4
};

const filterTagOptions = ['All Types', 'NFT', 'Draft'];
const filterTagMorOptions = ['All Genres'].concat(MusicGenres);
const filterEdition = ['All Editions', 'Regular', 'Streaming', 'Investing'];

export default function MusicPage() {
  const classes = MusicPageStyles();
  const commonClasses = musicDaoPageStyles();
  const dispatch = useDispatch();

  // const songsList = useSelector((state: RootState) => state.musics.songsList);
  // const scrollPosition = useSelector(
  //   (state: RootState) => state.musics.scrollPositionInSongs
  // );

  const theme = useTheme();
  // const isNormalScreen = useMediaQuery(theme.breakpoints.down(1800));
  // const isTablet = useMediaQuery(theme.breakpoints.down(1420));
  const isMedium = useMediaQuery(theme.breakpoints.down(1200));
  const isNarrow = useMediaQuery(theme.breakpoints.down(860));
  const isMobile = useMediaQuery(theme.breakpoints.down(600));

  const breakTwo = useMediaQuery(theme.breakpoints.up(700));
  const breakThree = useMediaQuery(theme.breakpoints.up(1200));
  const breakFour = useMediaQuery(theme.breakpoints.up(1440));

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
        : 1,
    [width]
  );

  // const history = useHistory();
  const { isSignedin, accountStatus } = useAuth();

  const [kind, setKind] = useState<string>(filterTagOptions[1]);
  const [edition, setEdition] = useState<string>(filterEdition[0]);
  const [genre, setGenre] = useState<string>(filterTagMorOptions[0]);

  const [openHowWorksModal, setOpenHowWorksModal] = useState<boolean>(false);
  const [openCreateMusicModal, setOpenCreateMusicModal] =
    useState<boolean>(false);
  const [openCreatePodModal, setOpenCreatePodModal] = useState<boolean>(false);
  const [openCreateContent, setOpenCreateContent] = useState<boolean>(false);
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.SongSingleEdition
  );

  const [searchValue, setSearchValue] = React.useState<string>('');
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);

  const [isListView, setIsListView] = useState<boolean>(false);

  const [songs, setSongs] = useState<any[]>([]);
  const [isSongLoading, setIsSongLoading] = useState<boolean>(false);
  const [hasMoreSong, setHasMoreSong] = useState<boolean>(true);
  const [pagination, setPagination] = useState<number>(1);

  // const [isTopAlbumLoading, setIsTopAlbumLoading] = useState<boolean>(false);
  // const [topAlbums, setTopAlbums] = useState<any[]>([]);
  // const carouselRef = React.useRef<any>();
  // const itemsToShow = isMobile ? 1 : isNarrow ? 2 : isTablet ? 3 : 4;

  useEffect(() => {
    // initialize store
    dispatch(setArtistsList([]));
    dispatch(setPodsList([]));
    dispatch(setScrollPositionInArtists(0));
    dispatch(setScrollPositionInPods(0));

    getAlbum();
  }, []);

  useEffect(() => {
    setHasMoreSong(true);
    setSongs([]);
    loadMore(true);
  }, [edition, kind, genre, debouncedSearchValue]);

  const getAlbum = () => {
    // setIsTopAlbumLoading(true);
    // musicDaoGetTopAlbums()
    //   .then((res) => {
    //     setTopAlbums(res.albums || []);
    //   })
    //   .finally(() => setIsTopAlbumLoading(false));
  };

  const onChangeFilterMore = (val) => {
    setGenre(val);
  };

  // const onChangeFilterKind = (val) => {
  //   setKind(val);
  // };

  // const onChangeFilterEdition = (val) => {
  //   setEdition(val);
  // };

  const loadMore = async (init = false) => {
    if (isSongLoading) return;

    const page = init ? 1 : pagination + 1;
    setPagination(page);
    setIsSongLoading(true);

    Axios.get(`${URL()}/token/getAllTokenInfos`)
      .then(async (res) => {
        const resp = res.data;
        if (resp.success) {
          // get song list
          const response = await musicDaoGetSongNFts(
            page,
            kind,
            genre,
            edition,
            debouncedSearchValue
          );
          if (response.success) {
            const newSongs = response.data.nfts || [];
            if (newSongs.length > 0) {
              newSongs.forEach((v) => {
                v.curPrice = v?.sellingOffer?.Price
                  ? `${getTokenName(
                      resp.tokens,
                      v?.sellingOffer.PaymentToken
                    )} ${getTokenPrice(
                      resp.tokens,
                      v?.sellingOffer.Price,
                      v?.sellingOffer.PaymentToken
                    )}`
                  : 'Not set';
              });
              // setSongs([...[newSongs[0]]]);
              setSongs((prev) =>
                init ? [...newSongs] : [...prev, ...newSongs]
              );
              // dispatch(
              //   setMusicsList(init ? [...newSongs] : [...songsList, ...newSongs])
              // );
            }
            setHasMoreSong(response.data.hasMore ?? false);
            // setHasMoreSong(false);
          }
        }
      })
      .finally(() => setIsSongLoading(false));
  };

  const handleRefresh = () => {
    getAlbum();
    setHasMoreSong(true);
    loadMore(true);
  };

  const getTokenName = (allTokens, addr) => {
    if (allTokens.length == 0) return '';
    const token = allTokens.find(
      (token) => token.Address?.toLowerCase() === addr?.toLowerCase()
    );
    return token?.Symbol ?? '';
  };

  const getTokenPrice = (allTokens, price, addr) => {
    if (allTokens.length == 0) return 0;
    const token = allTokens.find(
      (token) => token.Address?.toLowerCase() === addr?.toLowerCase()
    );
    return token ? price / 10 ** token.Decimals : 0;
  };

  const songListWithSkeleton = useMemo(() => {
    if (hasMoreSong) {
      let addedCount = 1;
      if (breakFour) {
        addedCount = 4 - (songs.length % 4);
      } else if (breakThree) {
        addedCount = 3 - (songs.length % 3);
      } else if (breakTwo) {
        addedCount = 2 - (songs.length % 2);
      }

      const result = [...songs];
      for (let index = 0; index < addedCount; index++) {
        result.push({});
      }
      return result;
    } else {
      return songs;
    }
  }, [songs, hasMoreSong, breakTwo, breakThree, breakFour]);

  const handleScroll = (e) => {
    // dispatch(setScrollPositionInMusics(e.target.scrollTop));
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
            className={classes.flexBox}
            width={1}
            justifyContent="center"
            flexDirection="column"
            mt={2}
            zIndex={1}
          >
            <div className={classes.headerTitle}>Tracks and Collections</div>
            <div className={classes.header2}>
              <Box textAlign="center">Discover and trade music NFTs</Box>
            </div>
            <Box className={classes.topBtnRow}>
              <PrimaryButton
                size="medium"
                onClick={() => setOpenHowWorksModal(true)}
                isRounded
                style={{
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.2)',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  height: 52,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isMobile ? '100%' : ''
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
                    paddingLeft: '58px',
                    paddingRight: '58px',
                    height: 52,
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: isMobile ? 0 : '8px',
                    marginTop: isMobile ? '8px' : 0
                  }}
                >
                  {accountStatus === 'nolist' ? 'Create' : 'Create Content'}
                </PrimaryButton>
              )}
            </Box>
          </Box>
          {/* {isTopAlbumLoading || topAlbums.length ? (
            <Box
              className={classes.flexBox}
              justifyContent="space-between"
              mt={12}
              mb={4}
            >
              <Box className={classes.flexBox}>
                <Box className={classes.header1} mr={2}>
                  Top Collections
                </Box>
                <Hidden xsDown>
                  {topAlbums &&
                  topAlbums.length &&
                  ((isMobile && topAlbums.length > 1) ||
                    (isTablet && topAlbums.length > 2) ||
                    (isNormalScreen && topAlbums.length > 3) ||
                    topAlbums.length > 4) ? (
                    <Box display="flex" justifyContent="center">
                      <Box className={classes.arrowBox}>
                        <Box
                          style={{
                            transform: 'rotate(90deg)',
                            cursor: 'pointer'
                          }}
                          mr={2}
                          onClick={() => carouselRef.current.slidePrev()}
                        >
                          <ChevronIconLeft />
                        </Box>
                        <Box
                          style={{
                            transform: 'rotate(-90deg)',
                            cursor: 'pointer'
                          }}
                          ml={2}
                          onClick={() => carouselRef.current.slideNext()}
                        >
                          <ChevronIconLeft />
                        </Box>
                      </Box>
                    </Box>
                  ) : null}
                </Hidden>
              </Box>
              <SecondaryButton
                className={commonClasses.showAll}
                size="medium"
                radius={29}
                onClick={() => history.push('/music/collections')}
                style={isMobile ? { display: 'flex' } : {}}
              >
                Show All
                <Box
                  position="absolute"
                  flexDirection="row"
                  top={0}
                  right={0}
                  pr={2}
                >
                  <ArrowLeftIcon />
                </Box>
              </SecondaryButton>
            </Box>
          ) : null}
          {topAlbums.length ? (
            <Hidden smUp>
              <Box display="flex" justifyContent="center" mb={2}>
                <Box className={classes.arrowBox}>
                  <Box
                    style={{ transform: 'rotate(90deg)', cursor: 'pointer' }}
                    mr={2}
                    onClick={() => carouselRef.current.slidePrev()}
                  >
                    <ChevronIconLeft />
                  </Box>
                  <Box
                    style={{ transform: 'rotate(-90deg)', cursor: 'pointer' }}
                    ml={2}
                    onClick={() => carouselRef.current.slideNext()}
                  >
                    <ChevronIconLeft />
                  </Box>
                </Box>
              </Box>
            </Hidden>
          ) : null}
          <Box className={classes.carousel}>
            {topAlbums && topAlbums.length ? (
              !isMobile &&
              (topAlbums.length === 2 || topAlbums.length === 3) ? (
                <div>
                  <MasonryGrid
                    gutter={'16px'}
                    data={topAlbums}
                    renderItem={(item) => <AlbumCard item={item} />}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                </div>
              ) : (
                <Carousel
                  isRTL={false}
                  itemsToShow={itemsToShow}
                  pagination={false}
                  showArrows={false}
                  ref={carouselRef}
                  itemPadding={[0, 4]}
                >
                  {topAlbums.map((item: any, i: Number) => (
                    <div
                      key={item.id}
                      style={{
                        width: '100%',
                        paddingBottom: '15px',
                        display: 'flex',
                        justifyContent: isMobile
                          ? 'center'
                          : topAlbums.length === 2 && i === 1
                          ? 'flex-end'
                          : topAlbums.length === 3 && i === 1
                          ? 'center'
                          : topAlbums.length === 3 && i === 2
                          ? 'flex-end'
                          : 'flex-start'
                      }}
                    >
                      <AlbumCard item={item} />
                    </div>
                  ))}
                </Carousel>
              )
            ) : isTopAlbumLoading ? (
              <MasonryGrid
                gutter={'24px'}
                data={Array(loadingCount).fill(0)}
                renderItem={(item, index) => (
                  <AlbumCard
                    item={item}
                    isLoading={isTopAlbumLoading}
                    key={`album_${index}`}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            ) : (
              <div></div>
            )}
          </Box> */}

          {isMobile ? (
            <Box mt={12} zIndex={100}>
              <Box className={classes.header1}>Explore Tracks</Box>
              <Box
                className={classes.flexBox}
                justifyContent="space-between"
                mt={2}
              >
                <div className={classes.filterButtonBox}>
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
                      height: 'auto',
                      maxWidth: isMobile ? 100 : undefined
                    }}
                    theme="music dao"
                  />
                  <Box
                    onClick={() => {}}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    style={{ cursor: 'pointer' }}
                  >
                    <SearchIcon color={Color.MusicDAODark} />
                  </Box>
                </div>
                <Box
                  className={classes.controlBox}
                  ml={2}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                >
                  <SecondaryButton
                    className={`${commonClasses.showButton} ${
                      isListView ? commonClasses.showButtonSelected : ''
                    }`}
                    size="small"
                    onClick={() => setIsListView(true)}
                    isRounded
                  >
                    <UnionIcon />
                  </SecondaryButton>
                  <PrimaryButton
                    className={`${commonClasses.showButton} ${
                      !isListView ? commonClasses.showButtonSelected : ''
                    }`}
                    size="small"
                    onClick={() => setIsListView(false)}
                    isRounded
                    style={{ marginLeft: 0 }}
                  >
                    <DetailIcon />
                  </PrimaryButton>
                </Box>
              </Box>
              <Box maxWidth={250} mt={1}>
                <CustomSelect
                  label={'Genre:'}
                  containerStyle={classes.filterTag}
                  items={filterTagMorOptions}
                  onSelect={onChangeFilterMore}
                  value={genre}
                  theme="dark"
                  width={'250px'}
                />
              </Box>
              <Box
                className={classes.flexBox}
                justifyContent="space-between"
                mt={1}
              >
                {/* <CustomSelect
                  label={'Type:'}
                  containerStyle={classes.filterTag}
                  items={filterTagOptions}
                  onSelect={onChangeFilterKind}
                  value={kind}
                  theme="dark"
                  width={'160px'}
                />
                <CustomSelect
                  label={'Edition:'}
                  containerStyle={classes.filterTag}
                  items={filterEdition}
                  onSelect={onChangeFilterEdition}
                  value={edition}
                  theme="dark"
                  width={'200px'}
                /> */}
              </Box>
            </Box>
          ) : (
            <>
              <Box
                className={classes.flexBox}
                justifyContent="space-between"
                width={1}
                mt={4}
                zIndex={100}
              >
                <Box className={classes.header1}>Explore Tracks</Box>
                <Box className={classes.flexBox}>
                  {!isMedium && (
                    <Box display="flex" alignItems="flex-end" flexWrap="wrap">
                      <CustomSelect
                        label={'Genre:'}
                        containerStyle={classes.filterTag}
                        items={filterTagMorOptions}
                        onSelect={onChangeFilterMore}
                        value={genre}
                        theme="dark"
                        width={'250px'}
                      />
                      {/* <CustomSelect
                        label={'Type:'}
                        containerStyle={classes.filterTag}
                        items={filterTagOptions}
                        onSelect={onChangeFilterKind}
                        value={kind}
                        theme="dark"
                        width={'160px'}
                      />
                      <CustomSelect
                        label={'Edition:'}
                        containerStyle={classes.filterTag}
                        items={filterEdition}
                        onSelect={onChangeFilterEdition}
                        value={edition}
                        theme="dark"
                        width={'200px'}
                      /> */}
                    </Box>
                  )}
                  <Box className={classes.optionSection} ml={2}>
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
                    <Box
                      className={classes.controlBox}
                      ml={2}
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                    >
                      <SecondaryButton
                        className={`${commonClasses.showButton} ${
                          isListView ? commonClasses.showButtonSelected : ''
                        }`}
                        size="small"
                        onClick={() => setIsListView(true)}
                        isRounded
                      >
                        <UnionIcon />
                      </SecondaryButton>
                      <PrimaryButton
                        className={`${commonClasses.showButton} ${
                          !isListView ? commonClasses.showButtonSelected : ''
                        }`}
                        size="small"
                        onClick={() => setIsListView(false)}
                        isRounded
                        style={{ marginLeft: 0 }}
                      >
                        <DetailIcon />
                      </PrimaryButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {isMedium && (
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  width={'100%'}
                  mt={2}
                >
                  <CustomSelect
                    label={'Genre:'}
                    containerStyle={classes.filterTag}
                    items={filterTagMorOptions}
                    onSelect={onChangeFilterMore}
                    value={genre}
                    theme="dark"
                    width={'250px'}
                  />
                  {/* <CustomSelect
                    label={'Type:'}
                    containerStyle={classes.filterTag}
                    items={filterTagOptions}
                    onSelect={onChangeFilterKind}
                    value={kind}
                    theme="dark"
                    width={'160px'}
                  />
                  <CustomSelect
                    label={'Edition:'}
                    containerStyle={classes.filterTag}
                    items={filterEdition}
                    onSelect={onChangeFilterEdition}
                    value={edition}
                    theme="dark"
                    width={'200px'}
                  /> */}
                </Box>
              )}
            </>
          )}
          <Box zIndex={1}>
            <InfiniteScroll
              hasChildren={songs.length > 0}
              dataLength={songs.length}
              scrollableTarget={'scrollContainer'}
              next={loadMore}
              hasMore={hasMoreSong}
              // initialScrollY={scrollPosition - 300}
              loader={
                isSongLoading &&
                (isListView ? (
                  Array(loadingCount)
                    .fill(0)
                    .map((song, index) => (
                      <ListSongCard
                        key={`songs-${index}`}
                        data={song}
                        isLoading
                      />
                    ))
                ) : (
                  <></>
                ))
              }
              style={{ overflow: 'inherit' }}
            >
              {isListView ? (
                <Box mt={4}>
                  <Box className={classes.listViewRow} px={2} py={1.5} mb={1}>
                    <Box width={isMobile ? 120 : 270}>Track</Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      flex="1"
                    >
                      <Box fontWeight="normal">Artist</Box>
                      <Box display="flex" alignItems="center">
                        <Box
                          width={isMobile ? 50 : isNarrow ? 90 : 150}
                          color="#2D3047"
                        >
                          Genre
                        </Box>
                        <Box
                          width={isMobile ? 40 : isNarrow ? 90 : 150}
                          textAlign="center"
                        >
                          Chain
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {!isSongLoading && !hasMoreSong && songs.length === 0 && (
                    <Box textAlign="center" mt={6}>
                      No Track
                    </Box>
                  )}

                  {songs.map((song, index) => (
                    <ListSongCard key={`songs-${index}`} data={song} />
                  ))}
                </Box>
              ) : (
                <Box mt={4}>
                  {!isSongLoading && !hasMoreSong && songs.length === 0 && (
                    <Box textAlign="center" mt={6}>
                      No Track
                    </Box>
                  )}
                  <MasonryGrid
                    gutter={'24px'}
                    data={songListWithSkeleton}
                    renderItem={(item, _) => (
                      <ArtistSongCard
                        song={item}
                        isLoading={Object.entries(item).length === 0}
                      />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                </Box>
              )}
            </InfiniteScroll>
          </Box>
        </Box>
        {openHowWorksModal && (
          <HowWorksOfSongModal
            open={openHowWorksModal}
            handleClose={() => setOpenHowWorksModal(false)}
            type="song"
          />
        )}

        {openCreateMusicModal &&
          (accountStatus !== 'authorized' ? (
            <WhiteListModal
              open={openCreatePodModal}
              handleClose={() => setOpenCreateMusicModal(false)}
            />
          ) : (
            <CreateMutipleEditionsPod // CreateSongModalNew
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
