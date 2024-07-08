import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import URL from 'shared/functions/getURL';
import Box from 'shared/ui-kit/Box';
import { musicSubPageStyles } from '../../index.styles';
import { searchPageStyles } from '../index.styles';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import GenreCard from '../../../components/Cards/GenreCard';
import {
  musicDaoGetPlayerTracks,
  mediaGetMyPlaylists,
  musicDaoGetPlayerGenreSongs
} from 'shared/services/API';
import PlayerSongCard from 'components/MusicDao/components/Cards/PlayerSongCard';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import MusicContext from 'shared/contexts/MusicContext';
import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';

export default function RecentSearchesPage() {
  const historyUse = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const { setSongsList } = useContext(MusicContext);

  const [recentlySongs, setRecentlySongs] = useState<any[]>([]);
  const [isLoadingRecentlySongs, setIsLoadingRecentlySongs] =
    useState<boolean>(false);
  const [lastOffsetRecentlySongs, setLastOffsetRecentlySongs] =
    useState<any>(undefined);
  const [hasMoreRecentlySongs, setHasMoreRecentlySongs] =
    useState<boolean>(true);
  const [viewMoreRecentlySongs, setViewMoreRecentlySongs] =
    useState<boolean>(false);

  const [recentlyGenres, setRecentlyGenres] = useState<any[]>([]);
  const [isLoadingRecentlyGenres, setIsLoadingRecentlyGenres] =
    useState<boolean>(false);
  const [lastOffsetRecentlyGenres, setLastOffsetRecentlyGenres] =
    useState<any>(undefined);
  const [hasMoreRecentlyGenres, setHasMoreRecentlyGenres] =
    useState<boolean>(true);
  const [viewMoreRecentlyGenres, setViewMoreRecentlyGenres] =
    useState<boolean>(false);

  const [allSongs, setAllSongs] = useState<any[]>([]);
  const [isLoadingAllSongs, setIsLoadingAllSongs] = useState<boolean>(false);
  const [hasMoreSongs, setHasMoreSongs] = useState<boolean>(true);
  const [pagination, setPagination] = useState<number>(1);

  const comonClasses = musicSubPageStyles();
  const classes = searchPageStyles();

  const [myPlaylists, setMyPlaylists] = useState<any[]>([]);

  const { selectedSong, setSelectedSong, playerState, setPlayerState } =
    useContext(MediaPlayerKeyContext);

  const getMyPlayLists = async () => {
    const resp = await mediaGetMyPlaylists();
    if (resp.success) {
      setMyPlaylists(resp.data.playlists);
    }
  };

  useEffect(() => {
    loadAllSongs(true);
    loadRcentlySongs(true);
    loadRcentlyGenres(true);
    getMyPlayLists();
  }, []);

  const loadRcentlySongs = (isInit = false, viewMore = false) => {
    if (isLoadingRecentlySongs) return;
    if (isInit) {
      setLastOffsetRecentlySongs(undefined);
    }
    setIsLoadingRecentlySongs(true);
    axios
      .get(`${URL()}/musicDao/getPlayerRecentlySearchedSongs`, {
        params: {
          pageSize: isInit && viewMore ? 18 : undefined,
          lastStamp: isInit ? undefined : lastOffsetRecentlySongs
        }
      })
      .then(async (res) => {
        const ret = res.data;
        if (ret.success && ret.data.songs.length > 0) {
          const addingSongs = makeAutoPlaySongsList(ret.data.songs);
          setRecentlySongs((prev) =>
            isInit ? addingSongs : [...prev, ...addingSongs]
          );
          setHasMoreRecentlySongs(ret.data.hasMore);
          setLastOffsetRecentlySongs(ret.data.lastOffsetEnd);
        }
      })
      .finally(() => {
        setIsLoadingRecentlySongs(false);
      });
  };
  const loadRcentlyGenres = (isInit = false) => {
    if (isLoadingRecentlyGenres) return;
    if (isInit) {
      setLastOffsetRecentlyGenres(undefined);
      setViewMoreRecentlyGenres(false);
    }
    setIsLoadingRecentlyGenres(true);
    axios
      .get(`${URL()}/musicDao/getPlayerRecentlySearchedGenres`, {
        params: { lastStamp: isInit ? undefined : lastOffsetRecentlyGenres }
      })
      .then(async (res) => {
        const ret = res.data;
        if (ret.success && ret.data.genres.length > 0) {
          const newGenres = ret.data.genres.map((v) => {
            return {
              // img: v.imgUrl,
              // genres: v.name,
              // id: v.id,
              ...v,
              Type: 'GENRE',
              playingStatus: 0
            };
          });
          setRecentlyGenres((prev) =>
            isInit ? newGenres : [...prev, ...newGenres]
          );
          setHasMoreRecentlyGenres(ret.data.hasMore);
          setLastOffsetRecentlyGenres(ret.data.lastOffsetEnd);
        }
      })
      .finally(() => {
        setIsLoadingRecentlyGenres(false);
      });
  };

  const loadAllSongs = (init = false) => {
    if (isLoadingAllSongs) return;

    const page = init ? 1 : pagination + 1;
    setPagination(page);
    setIsLoadingAllSongs(true);

    axios.get(`${URL()}/token/getAllTokenInfos`).then(async (res) => {
      const resp = res.data;
      if (resp.success) {
        // get song list
        const response = await musicDaoGetPlayerTracks(page, 'all', 'all', '');
        if (response.success) {
          let newSongs = response.data.nfts || [];
          newSongs = makeAutoPlaySongsList(newSongs);
          if (newSongs.length > 0) {
            setAllSongs((prev) =>
              init ? [...newSongs] : [...prev, ...newSongs]
            );
          }
          setHasMoreSongs(response.data.hasMore ?? false);
        }
        setIsLoadingAllSongs(false);
      } else {
        setIsLoadingAllSongs(false);
      }
    });
  };

  const makeAutoPlaySongsList = (orignSongs) => {
    let returnSongs: any[] = [];
    if (orignSongs?.length > 0) {
      for (let i = 0; i < orignSongs?.length; i++) {
        const s = orignSongs[i];
        let url = '';
        if (
          s?.metadataMedia?.newFileCID &&
          s?.metadataMedia.metadata?.properties?.name
        ) {
          url = `${getURLfromCID(s.metadataMedia.newFileCID)}/${
            s.metadataMedia.metadata.properties.name
          }`;
        } else if (s?.newFileCID && s?.metadata?.properties?.name) {
          url = `${getURLfromCID(s.newFileCID)}/${s.metadata.properties.name}`;
        } else if (s?.AnimationUrl?.length > 0) {
          url = `https://proxy.myx.audio/getFile?url=${s.AnimationUrl}`;
        } else if (s?.AnimationURL?.length > 0) {
          url = `https://proxy.myx.audio/getFile?url=${s.AnimationURL}`;
        }
        let mediaDuration = 0;
        if (s?.Duration || s?.duration) {
          mediaDuration = s?.Duration ?? Number(s?.duration);
        } else if (s?.metadata?.properties?.duration) {
          mediaDuration = s?.metadata?.properties?.duration;
        }

        returnSongs.push({
          ...s,
          url,
          mediaDuration,
          ImageUrl: s.Image ?? getDefaultBGImage()
        });
      }
    }
    return returnSongs;
  };

  const handlePlayGenre = async (id: string) => {
    if (
      recentlyGenres?.length > 0 &&
      recentlyGenres.findIndex((v) => v.id === id) >= 0
    ) {
      const curIndex = recentlyGenres.findIndex((v) => v.id === id);
      // if (topGenres[curIndex].songCount <= 0) return;
      const genres = recentlyGenres;
      // load songs and refresh current clicked playlist
      if (!genres[curIndex].songs) {
        try {
          const response = await musicDaoGetPlayerGenreSongs(id, {
            lastId: undefined
          });
          if (response.success) {
            let genreSongs = response.songs;
            genreSongs = makeAutoPlaySongsList(genreSongs);
            genres[curIndex].songs = genreSongs;
          }
        } catch (error) {
          console.log(error);
          return;
        }
      }

      // set status
      for (let i = 0; i < genres.length; i++) {
        if (i === curIndex) {
          if (genres[i].playingStatus === 0) {
            // if stop, then change to playing
            genres[i].playingStatus = 1; // set button UI

            setPlayerState((state) => ({
              ...state,
              playing: true,
              loading: true,
              played: 0,
              playedSeconds: 0,
              duration:
                genres[i].songs[0].mediaDuration ??
                genres[i].songs[0].Duration ??
                genres[i].songs[0].duration ??
                0
            }));

            if (genres[i].songs[0].mediaDuration) {
              setSelectedSong({
                ...genres[i].songs[0],
                duration: genres[i].songs[0].mediaDuration ?? 0
              });
            } else {
              setSelectedSong({
                ...genres[i].songs[0],
                duration:
                  genres[i].songs[0].Duration ??
                  genres[i].songs[0].duration ??
                  0
              });
            }

            // set song list
            if (genres[i].songs && genres[i].songs.length > 0) {
              setSongsList(genres[i].songs);
            }
          } else if (genres[i].playingStatus === 1) {
            // if playing, change to pause
            genres[i].playingStatus = 2; // set button UI
            setPlayerState((state) => ({
              ...state,
              playing: false
            }));
          } else if (genres[i].playingStatus === 2) {
            // if pause, change to playing
            genres[i].playingStatus = 1; // set button UI
            setPlayerState((state) => ({
              ...state,
              playing: true
            }));
          }
        } else {
          // set other playlist to stop
          genres[i].playingStatus = 0;
        }
      }
      setRecentlyGenres(genres);
    }
  };

  const setOffPlayingStatusGenre = () => {
    let list = recentlyGenres;
    for (let i = 0; i < list.length; i++) {
      list[i].playingStatus = 0;
    }
    setRecentlyGenres(list);
  };

  return (
    <div>
      {viewMoreRecentlySongs ? (
        <Box mt={6}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box className={comonClasses.sectionTitle}>Recent searches</Box>
            {isLoadingRecentlySongs ? (
              <Box></Box>
            ) : (
              <Box
                className={classes.showAll}
                onClick={() => {
                  setViewMoreRecentlySongs(!viewMoreRecentlySongs);
                  setRecentlySongs([]);
                  loadRcentlySongs(true, !viewMoreRecentlySongs);
                }}
              >
                Hide More
              </Box>
            )}
          </Box>
          <Box
            mt={3}
            style={{ height: 760, overflow: 'auto' }}
            id="scrollContainerRecent"
          >
            <InfiniteScroll
              style={{ overflow: 'unset' }}
              hasChildren={recentlySongs.length > 0}
              dataLength={recentlySongs.length}
              scrollableTarget={'scrollContainerRecent'}
              next={loadRcentlySongs}
              hasMore={hasMoreRecentlySongs}
              loader={
                isLoadingRecentlySongs && (
                  <div style={{ marginTop: 20 }}>
                    <MasonryGrid
                      gutter={'20px'}
                      data={Array(isMobile ? 1 : isTablet ? 2 : 6).fill(0)}
                      renderItem={(item, index) => (
                        <PlayerSongCard
                          key={`all-song-${index}`}
                          song={item}
                          isLoading={isLoadingRecentlySongs}
                          myPlaylists={myPlaylists}
                        />
                      )}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                    />
                  </div>
                )
              }
            >
              <Box>
                <MasonryGrid
                  gutter={'20px'}
                  data={recentlySongs}
                  renderItem={(item, index) => (
                    <PlayerSongCard
                      key={`all-song-${index}`}
                      song={item}
                      myPlaylists={myPlaylists}
                      // isLoading={isLoadingRecentlySongs}
                      refreshSongsList={() => {
                        setOffPlayingStatusGenre();
                        setSongsList(recentlySongs);
                      }}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
                {!isLoadingRecentlySongs &&
                  !hasMoreRecentlySongs &&
                  recentlySongs.length === 0 && (
                    <div className={classes.empty}>No Recently Songs Yet</div>
                  )}
              </Box>
            </InfiniteScroll>
          </Box>
        </Box>
      ) : (
        (isLoadingRecentlySongs || recentlySongs.length > 0) && (
          <Box mt={6}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box className={comonClasses.sectionTitle}>Recent searches</Box>
              {recentlySongs.length > 0 && (
                <Box
                  className={classes.showAll}
                  onClick={() => {
                    setViewMoreRecentlySongs(!viewMoreRecentlySongs);
                    setRecentlySongs([]);
                    loadRcentlySongs(true, !viewMoreRecentlySongs);
                  }}
                >
                  View More
                </Box>
              )}
            </Box>
            <Box mt={3}>
              {isLoadingRecentlySongs ? (
                <MasonryGrid
                  gutter={'20px'}
                  data={Array(isMobile ? 1 : isTablet ? 2 : 6).fill(0)}
                  renderItem={(item, index) => (
                    <PlayerSongCard
                      key={`recently-song-${index}`}
                      song={item}
                      isLoading={isLoadingRecentlySongs}
                      myPlaylists={myPlaylists}
                    />
                    // <ArtistSongCard
                    //     song={item}
                    //     key={`recently-song-${index}`}
                    //     isLoading={isLoadingRecentlySongs}
                    //   />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              ) : (
                recentlySongs.length > 0 && (
                  <MasonryGrid
                    gutter={'20px'}
                    data={recentlySongs.slice(0, 6)}
                    renderItem={(item, index) => (
                      <PlayerSongCard
                        key={`recently-song-${index}`}
                        song={item}
                        isLoading={isLoadingRecentlySongs}
                        myPlaylists={myPlaylists}
                        refreshSongsList={() => {
                          setOffPlayingStatusGenre();
                          setSongsList(recentlySongs);
                        }}
                      />
                      // <ArtistSongCard
                      //   song={item}
                      //   key={`recently-song-${index}`}
                      //   isLoading={isLoadingRecentlySongs}
                      // />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                  />
                )
              )}
            </Box>
          </Box>
        )
      )}

      {/* recently searched genres */}
      <Box mt={isMobile ? 8 : 6}>
        {(isLoadingRecentlyGenres || recentlyGenres.length > 0) && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box className={comonClasses.sectionTitle}>Genres</Box>
            <Box
              className={classes.showAll}
              onClick={() => {
                historyUse.push(`/player/genres`);
              }}
            >
              VIEW MORE
            </Box>
          </Box>
        )}
        <Box mt={3}>
          {isLoadingRecentlyGenres ? (
            <MasonryGrid
              gutter={'20px'}
              data={Array(isMobile ? 1 : isTablet ? 2 : 3).fill(0)}
              renderItem={(item, index) => (
                <GenreCard
                  item={item}
                  size="large"
                  isLoading={isLoadingRecentlyGenres}
                  key={`recently-genre-${index}`}
                />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
            />
          ) : (
            recentlyGenres.length > 0 && (
              <MasonryGrid
                gutter={'20px'}
                data={recentlyGenres.slice(0, 3)}
                renderItem={(item, index) => (
                  <GenreCard
                    item={item}
                    size="large"
                    isLoading={isLoadingRecentlyGenres}
                    key={`recently-genre-${index}`}
                    handlePlayGenre={handlePlayGenre}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
              />
            )
          )}
        </Box>
      </Box>

      {/* all songs */}
      <Box mt={isMobile ? 8 : 6}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={comonClasses.sectionTitle}>Explore all</Box>
        </Box>
        <Box mt={3}>
          <InfiniteScroll
            style={{ overflow: 'unset' }}
            hasChildren={allSongs.length > 0}
            dataLength={allSongs.length}
            scrollableTarget={'scrollContainer'}
            next={loadAllSongs}
            hasMore={hasMoreSongs}
            loader={
              isLoadingAllSongs && (
                <div style={{ marginTop: 20 }}>
                  <MasonryGrid
                    gutter={'20px'}
                    data={Array(isMobile ? 1 : isTablet ? 2 : 6).fill(0)}
                    renderItem={(item, index) => (
                      <PlayerSongCard
                        key={`all-song-${index}`}
                        song={item}
                        isLoading={isLoadingAllSongs}
                        myPlaylists={myPlaylists}
                      />
                      // <ArtistSongCard
                      //   song={item}
                      //   key={`all-song-${index}`}
                      //   isLoading={isLoadingAllSongs}
                      // />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                  />
                </div>
              )
            }
          >
            <Box>
              <MasonryGrid
                gutter={'20px'}
                data={allSongs}
                renderItem={(item, index) => (
                  <PlayerSongCard
                    key={`all-song-${index}`}
                    song={item}
                    myPlaylists={myPlaylists}
                    refreshSongsList={() => {
                      setOffPlayingStatusGenre();
                      setSongsList(allSongs);
                    }}
                  />
                  // <ArtistSongCard song={item} key={`all-song-${index}`} />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
              />
              {!isLoadingAllSongs && !hasMoreSongs && allSongs.length === 0 && (
                <div className={classes.empty}>No Songs Yet</div>
              )}
            </Box>
          </InfiniteScroll>
        </Box>
      </Box>
    </div>
  );
}

export const COLUMNS_COUNT_BREAK_POINTS_SIX = {
  400: 1,
  570: 2,
  700: 3,
  800: 4,
  1200: 5,
  1440: 6
};

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  675: 1,
  900: 2,
  1440: 3
};
