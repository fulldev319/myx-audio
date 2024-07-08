import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import Carousel from 'react-spring-3d-carousel';
import ReactElasticCarousel from 'react-elastic-carousel';
import axios from 'axios';

import URL from 'shared/functions/getURL';
import Box from 'shared/ui-kit/Box';
import { musicSubPageStyles } from '../index.styles';
import { COLUMNS_COUNT_BREAK_POINTS_SIX } from '../SearchPage';
import PlaylistCard from '../../components/Cards/PlaylistCard';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { RootState } from 'store/reducers/Reducer';
import { mediaGetPlaylists, mediaGetPlaylistDetail } from 'shared/services/API';
import InfiniteScroll from 'react-infinite-scroll-component';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import MusicContext from 'shared/contexts/MusicContext';
import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';

enum OpenType {
  Home = 'HOME',
  Playlist = 'PLAYLIST',
  PlaylistDetail = 'PLAYLISTDETAIL',
  MyPlaylist = 'MYPLAYLIST',
  Album = 'ALBUM',
  Artist = 'ARTIST',
  Liked = 'LIKED',
  Library = 'LIBRARY',
  Search = 'SEARCH',
  Queue = 'QUEUE'
}

export default function PlaylistPage() {
  const classes = musicSubPageStyles();
  const userSelector = useSelector((state: RootState) => state.user);
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  // const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const isNormalScreen = useMediaQuery(theme.breakpoints.down(1800));
  const isTablet = useMediaQuery(theme.breakpoints.down(1420));
  const isNarrow = useMediaQuery(theme.breakpoints.down(860));
  const isMobile = useMediaQuery(theme.breakpoints.down(650));

  const itemsToShow = isMobile
    ? 1
    : isNarrow
    ? 2
    : isTablet
    ? 2
    : isNormalScreen
    ? 4
    : 4;

  const [allPlaylists, setAllPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastId, setLastId] = useState<any>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [topPlaylists, setTopPlaylists] = useState<any[]>([]);
  const [isLoadingTopPlaylists, setIsLoadingTopPlaylists] =
    useState<boolean>(false);
  const [currentSlider, setCurrentSlider] = useState<number>(0);

  const [latestPlaylists, setLatestPlaylists] = useState<any[]>([]);
  const [isLoadingLatestPlaylists, setIsLoadingLatestPlaylists] =
    useState<boolean>(false);
  const latestRef = useRef<any>();

  const { selectedSong, setSelectedSong, playerState, setPlayerState } =
    useContext(MediaPlayerKeyContext);
  const { fixSearch, setSongsList } = useContext(MusicContext);

  const loadAllPlaylists = async () => {
    if (loading) return;
    if (userSelector && userSelector.id) {
      try {
        setLoading(true);
        // const token: string = Cookies.get('accessToken') || "";
        const response = await mediaGetPlaylists(
          lastId,
          undefined,
          userSelector?.id ?? undefined
        );
        setLoading(false);
        if (response.success) {
          const data = response.data.playlists || [];
          const playlistsData = data.map((item) => {
            return {
              ...item,
              playingStatus: 0,
              Type: OpenType.PlaylistDetail
            };
          });
          setAllPlaylists((prev) => [...prev, ...playlistsData]);
          setHasMore(response.data.hasMore ?? false);
          if (playlistsData.length > 0)
            setLastId(playlistsData[playlistsData.length - 1].id);
        }
      } catch (err) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getLatestPlaylists();
    getTopPlaylists();
    loadAllPlaylists();
  }, [userSelector]);

  const getTopPlaylists = async () => {
    if (isLoadingTopPlaylists) return;
    setIsLoadingTopPlaylists(true);
    axios
      .get(`${URL()}/media/getTopPlaylists`, {
        params: { orderType: 'songCount' }
      })
      .then(async (res) => {
        const resp = res.data;
        if (resp.success) {
          const data = resp.data.playlists || [];
          const playlistsData = data.map((item) => {
            let duration = 0;
            const songs: any[] = [];
            if (item.listSongs && item.listSongs.length > 0) {
              for (let i = 0; i < item.listSongs?.length; i++) {
                const s = item.listSongs[i];
                if (s?.AnimationUrl?.length > 0)
                  s.url = `https://proxy.myx.audio/getFile?url=${s.AnimationUrl}`;
                else if (s?.newFileCID && s?.metadata?.properties?.name)
                  s.url = `${getURLfromCID(s.newFileCID)}/${
                    s.metadata.properties.name
                  }`;
                else s.url = '';

                if (s?.Duration || s?.duration) {
                  s.mediaDuration = s?.Duration ?? Number(s?.duration);
                } else if (s?.metadata?.properties?.duration) {
                  s.mediaDuration = s?.metadata?.properties?.duration;
                } else {
                  s.mediaDuration = 0;
                }
                duration += s.mediaDuration;

                songs.push({
                  ...s,
                  ImageUrl: s.Image ?? getDefaultBGImage()
                });
              }
            }
            return {
              ...item,
              playingStatus: 0,
              duration,
              songs
            };
          });

          setTopPlaylists((prev) => [...prev, ...playlistsData]);
          setIsLoadingTopPlaylists(false);
        } else {
          setIsLoadingTopPlaylists(false);
        }
      });
  };

  const getLatestPlaylists = async () => {
    if (isLoadingLatestPlaylists) return;
    setIsLoadingLatestPlaylists(true);
    axios.get(`${URL()}/media/getLatestPlaylists`).then(async (res) => {
      const resp = res.data;
      if (resp.success) {
        const data = resp.data.playlists || [];
        const playlistsData = data.map((item) => {
          return {
            ...item,
            playingStatus: 0,
            Type: OpenType.PlaylistDetail
          };
        });
        setLatestPlaylists((prev) => [...prev, ...playlistsData]);

        setIsLoadingLatestPlaylists(false);
      } else {
        setIsLoadingLatestPlaylists(false);
      }
    });
  };

  const topPlaylistsData = (
    playlists: any[],
    isLoading = false,
    keyword = 'playlist',
    size = 'small'
  ) => {
    const playlistsData: any[] = [];
    playlists.map((data, index) => {
      playlistsData.push({
        key: `${keyword}_${data.Title ?? ''}_${index}`,
        content: (
          <PlaylistCard
            key={`playlist-${keyword}-${index}`}
            item={data}
            isLoading={isLoading}
            size={size === 'large' ? 'large' : 'small'}
            handlePlaylistPlay={(id) => {
              handlePlaylistPlay(id, 'topPlaylist');
            }}
          />
        )
      });
    });

    return playlistsData;
  };

  const handlePlaylistPlay = async (id: string, listType: string) => {
    let playlists = topPlaylists;
    if (listType === 'topPlaylist') playlists = topPlaylists;
    else if (listType === 'latestPlaylist') playlists = latestPlaylists;
    else if (listType === 'allPlaylist') playlists = allPlaylists;

    if (playlists?.length > 0 && playlists.findIndex((v) => v.id === id) >= 0) {
      const curIndex = playlists.findIndex((v) => v.id === id);
      // load songs and refresh current clicked playlist
      if (!playlists[curIndex].songs) {
        try {
          const response = await mediaGetPlaylistDetail(id);
          if (response.success) {
            const a = response.data;
            a.playingStatus = playlists[curIndex].playingStatus;
            a.songs = [];

            if (a.listSongs && a.listSongs.length > 0) {
              for (let i = 0; i < a.listSongs?.length; i++) {
                const s = a.listSongs[i];
                if (s?.AnimationUrl?.length > 0)
                  s.url = `https://proxy.myx.audio/getFile?url=${s.AnimationUrl}`;
                else if (s?.newFileCID && s?.metadata?.properties?.name)
                  s.url = `${getURLfromCID(s.newFileCID)}/${
                    s.metadata.properties.name
                  }`;
                else s.url = '';

                if (s?.Duration || s?.duration) {
                  s.mediaDuration = s?.Duration ?? Number(s?.duration);
                } else if (s?.metadata?.properties?.duration) {
                  s.mediaDuration = s?.metadata?.properties?.duration;
                } else {
                  s.mediaDuration = 0;
                }

                a.songs.push({
                  ...s,
                  ImageUrl: s.Image ?? getDefaultBGImage()
                });
              }
            }
            playlists[curIndex] = a;
          } else return;
        } catch (error) {
          console.log(error);
          return;
        }
      }

      // set status
      for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].songs?.length <= 0) {
          // console.log(
          //   '================',
          //   listType,
          //   playlists[i].loadedSongCount
          // );
          continue;
        }
        if (i === curIndex) {
          if (playlists[i].playingStatus === 0) {
            // if stop, then change to playing
            playlists[i].playingStatus = 1; // set button UI

            setPlayerState((state) => ({
              ...state,
              playing: true,
              loading: true,
              played: 0,
              playedSeconds: 0,
              duration:
                playlists[i].songs[0].mediaDuration ??
                playlists[i].songs[0].Duration ??
                playlists[i].songs[0].duration ??
                0
            }));

            if (playlists[i].songs[0].mediaDuration) {
              setSelectedSong((song) => ({
                ...playlists[i].songs[0],
                duration: playlists[i].songs[0].mediaDuration ?? 0
              }));
            } else {
              setSelectedSong((song) => ({
                ...playlists[i].songs[0],
                duration:
                  playlists[i].songs[0].Duration ??
                  playlists[i].songs[0].duration ??
                  0
              }));
            }

            // set song list
            if (playlists[i].songs && playlists[i].songs.length > 0) {
              setSongsList(playlists[i].songs);
            }
          } else if (playlists[i].playingStatus === 1) {
            // if playing, change to pause
            playlists[i].playingStatus = 2; // set button UI
            setPlayerState((state) => ({
              ...state,
              playing: false
            }));
          } else if (playlists[i].playingStatus === 2) {
            // if pause, change to playing
            playlists[i].playingStatus = 1; // set button UI
            setPlayerState((state) => ({
              ...state,
              playing: true
            }));
          }
        } else {
          // set other playlist to stop
          playlists[i].playingStatus = 0;
        }
      }
      if (listType === 'topPlaylist') setTopPlaylists(playlists);
      else if (listType === 'latestPlaylist') setLatestPlaylists(playlists);
      else if (listType === 'allPlaylist') setAllPlaylists(playlists);

      updatePlayingStatus(id);
    }
  };

  const updatePlayingStatus = async (id: string) => {
    if (topPlaylists?.length > 0) {
      let updatingPlaylist = topPlaylists;
      for (let i = 0; i < updatingPlaylist.length; i++) {
        if (updatingPlaylist[i].id !== id)
          updatingPlaylist[i].playingStatus = 0;
      }
      setTopPlaylists(updatingPlaylist);
    }

    if (latestPlaylists?.length > 0) {
      let updatingPlaylist = latestPlaylists;
      for (let i = 0; i < updatingPlaylist.length; i++) {
        if (updatingPlaylist[i].id !== id)
          updatingPlaylist[i].playingStatus = 0;
      }
      setLatestPlaylists(updatingPlaylist);
    }

    if (allPlaylists?.length > 0) {
      let updatingPlaylist = allPlaylists;
      for (let i = 0; i < updatingPlaylist.length; i++) {
        if (updatingPlaylist[i].id !== id)
          updatingPlaylist[i].playingStatus = 0;
      }
      setAllPlaylists(updatingPlaylist);
    }
  };

  return (
    <div className={classes.page} id={'scrollContainer'}>
      <div className={classes.content}>
        {/* top playlists carousel */}
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box className={classes.sectionTitle}>Most Liked Playlist</Box>
            <Box display="flex" mt={2}>
              <Box
                style={{ cursor: 'pointer' }}
                mr={2}
                onClick={() => setCurrentSlider((prev) => prev - 1)}
              >
                <CarouselLeftIcon />
              </Box>
              <Box
                style={{ cursor: 'pointer' }}
                ml={2}
                onClick={() => setCurrentSlider((prev) => prev + 1)}
              >
                <CarouselRightIcon />
              </Box>
            </Box>
          </Box>
          <Box mt={3}>
            {isLoadingTopPlaylists || topPlaylists?.length >= 5 ? (
              <>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  className={classes.carouselContainer}
                >
                  <Box className={classes.carouselBox}>
                    <Carousel
                      slides={topPlaylistsData(
                        isLoadingTopPlaylists
                          ? Array(5).fill(0)
                          : topPlaylists.slice(0, 5),
                        isLoadingTopPlaylists,
                        'topPlaylists',
                        'large'
                      )}
                      goToSlide={currentSlider}
                      showNavigation={false}
                      offsetRadius={isMobile ? 0 : isTablet ? 2 : 3}
                    />
                  </Box>
                </Box>
              </>
            ) : topPlaylists && topPlaylists.length >= 1 ? (
              <MasonryGrid
                gutter={'20px'}
                data={topPlaylists}
                renderItem={(item, index) => (
                  <PlaylistCard
                    key={`${item.Title}-topPlaylist-${index}`}
                    size="large"
                    item={item}
                    index={index}
                    isLoading={isLoadingTopPlaylists}
                    handlePlaylistPlay={(id) => {
                      handlePlaylistPlay(id, 'topPlaylist');
                    }}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            ) : (
              <Box textAlign="center" width="100%">
                No top playlists
              </Box>
            )}
          </Box>
        </Box>

        {/* latest playlists slider */}
        <Box mt={6}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box className={classes.sectionTitle}>Latest Playlist</Box>
            <Box display="flex" mt={2}>
              <Box
                style={{ cursor: 'pointer' }}
                mr={2}
                onClick={() => {
                  latestRef.current.slidePrev();
                }}
              >
                <CarouselLeftIcon />
              </Box>
              <Box
                style={{ cursor: 'pointer' }}
                ml={2}
                onClick={() => {
                  latestRef.current.slideNext();
                }}
              >
                <CarouselRightIcon />
              </Box>
            </Box>
          </Box>
          <Box mt={3} height="380px" ml="-24px">
            {isLoadingLatestPlaylists || latestPlaylists?.length >= 4 ? (
              <>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  className={classes.carouselContainer}
                >
                  <Box style={{ width: '100%', height: '100%' }}>
                    <ReactElasticCarousel
                      isRTL={false}
                      itemsToShow={itemsToShow}
                      pagination={false}
                      showArrows={false}
                      ref={latestRef}
                      itemPadding={[0, 15]}
                    >
                      {latestPlaylists.map((item: any, i: Number) => (
                        <div
                          key={`latest-playlist-${item.id}`}
                          style={{
                            width: '100%',
                            // paddingBottom: "15px",
                            display: 'flex',
                            justifyContent: 'flex-start'
                          }}
                        >
                          <PlaylistCard
                            item={item}
                            isLoading={isLoadingLatestPlaylists}
                            handlePlaylistPlay={(id) => {
                              handlePlaylistPlay(id, 'latestPlaylist');
                            }}
                          />
                        </div>
                      ))}
                    </ReactElasticCarousel>
                  </Box>
                </Box>
              </>
            ) : isLoadingLatestPlaylists && latestPlaylists.length >= 1 ? (
              <MasonryGrid
                gutter={'20px'}
                data={latestPlaylists}
                renderItem={(item, index) => (
                  <PlaylistCard
                    key={`${item.Title}-latestPlaylist-${index}`}
                    item={item}
                    index={index}
                    isLoading={isLoadingLatestPlaylists}
                    handlePlaylistPlay={(id) => {
                      handlePlaylistPlay(id, 'latestPlaylist');
                    }}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            ) : (
              <Box textAlign="center" width="100%">
                No top playlists
              </Box>
            )}
          </Box>
        </Box>

        {/* explorer playlists */}
        <Box mt={6}>
          <div className={classes.sectionTitle}>Explore Playlist</div>
          <Box mt={4}>
            <InfiniteScroll
              style={{ overflow: 'unset' }}
              hasChildren={allPlaylists.length > 0}
              dataLength={allPlaylists.length}
              scrollableTarget={'scrollContainer'}
              next={loadAllPlaylists}
              hasMore={hasMore}
              loader={
                loading && (
                  <MasonryGrid
                    gutter={'30px'}
                    data={Array(isMobile ? 2 : 6).fill(0)}
                    renderItem={(item, index) => (
                      <PlaylistCard
                        item={item}
                        key={`item-${index}`}
                        isLoading={loading}
                      />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                )
              }
            >
              <div>
                <MasonryGrid
                  gutter={'30px'}
                  data={allPlaylists}
                  renderItem={(item, index) => (
                    <PlaylistCard
                      item={item}
                      key={`item-${index}`}
                      handlePlaylistPlay={(id) => {
                        handlePlaylistPlay(id, 'allPlaylist');
                      }}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                />
                {!loading && !hasMore && allPlaylists.length === 0 && (
                  <div className={classes.empty}>No Playlists Yet</div>
                )}
              </div>
            </InfiniteScroll>
          </Box>
        </Box>
      </div>
    </div>
  );
}

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  700: 2,
  1200: 3,
  1440: 4
};

const CarouselLeftIcon = () => (
  <svg
    width="70"
    height="70"
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="35" cy="35" r="35" fill="url(#paint0_linear_16901_281554)" />
    <path
      d="M39.7905 47C40.1068 47 40.3914 46.8592 40.6443 46.6125C41.1186 46.0841 41.1186 45.2385 40.6443 44.7453L31.8853 34.9867L40.6127 25.2634C41.0869 24.7351 41.0869 23.8895 40.6127 23.3963C40.1385 22.8679 39.3795 22.8679 38.9368 23.3963L29.3557 34.0356C28.8814 34.5639 28.8814 35.4095 29.3557 35.9027L38.9368 46.5772C39.1583 46.8591 39.4743 46.9999 39.7906 46.9999L39.7905 47Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_16901_281554"
        x1="15.75"
        y1="14.875"
        x2="42.875"
        y2="57.75"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4D08BC" />
        <stop offset="1" stopColor="#2A9FE2" />
      </linearGradient>
    </defs>
  </svg>
);

const CarouselRightIcon = () => (
  <svg
    width="70"
    height="70"
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="35"
      cy="35"
      r="35"
      transform="rotate(-180 35 35)"
      fill="url(#paint0_linear_16901_281557)"
    />
    <path
      d="M30.2095 23C29.8932 23 29.6086 23.1408 29.3557 23.3875C28.8814 23.9159 28.8814 24.7615 29.3557 25.2547L38.1147 35.0133L29.3873 44.7366C28.9131 45.2649 28.9131 46.1105 29.3873 46.6037C29.8615 47.1321 30.6205 47.1321 31.0632 46.6037L40.6443 35.9644C41.1186 35.4361 41.1186 34.5905 40.6443 34.0973L31.0632 23.4228C30.8417 23.1409 30.5257 23.0001 30.2094 23.0001L30.2095 23Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_16901_281557"
        x1="15.75"
        y1="14.875"
        x2="42.875"
        y2="57.75"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4D08BC" />
        <stop offset="1" stopColor="#2A9FE2" />
      </linearGradient>
    </defs>
  </svg>
);
