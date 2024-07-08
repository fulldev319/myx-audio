import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import ArtistCard from '../../components/Cards/ArtistCard';
import PlaylistCard from '../../components/Cards/PlaylistCard';
import PlayerSongCard from 'components/MusicDao/components/Cards/PlayerSongCard';

import Box from 'shared/ui-kit/Box';
import URL from 'shared/functions/getURL';
import {
  mediaGetMyPlaylists,
  mediaGetPlaylistDetail,
  musicDaoGetPlayerGenreSongs
} from 'shared/services/API';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { processImage } from 'shared/helpers';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import { musicSubPageStyles } from '../index.styles';
import { homePageNewStyles } from './index.styles';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import MusicContext from 'shared/contexts/MusicContext';
import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';

import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import GenreCard from '../../components/Cards/GenreCard';
import { Grid } from '@material-ui/core';

export default function HomePageNew() {
  const comonClasses = musicSubPageStyles();
  const classes = homePageNewStyles();
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const { setSongsList } = useContext(MusicContext);
  // const [autoPlayingSongs, setAutoPlayingSongs] = useState<any[]>([]);

  const [recentlySongs, setRecentlySongs] = useState<any[]>([]);
  const [isLoadingRecentlySongs, setIsLoadingRecentlySongs] =
    useState<boolean>(false);

  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [isLoadingTopArtists, setIsLoadingTopArtists] =
    useState<boolean>(false);

  const [topPlaylists, setTopPlaylists] = useState<any[]>([]);
  const [isLoadingTopPlaylists, setIsLoadingTopPlaylists] =
    useState<boolean>(false);

  const [topGenres, setTopGenres] = useState<any[]>([]);
  const [isLoadingTopGenres, setIsLoadingTopGenres] = useState<boolean>(false);

  const width = useWindowDimensions().width;
  const loadingCount = React.useMemo(
    () =>
      width >= 1440
        ? 5
        : width >= 1200
        ? 4
        : width >= 800
        ? 3
        : width >= 600
        ? 2
        : 1,
    [width]
  );
  const loadingCountSix = React.useMemo(
    () =>
      width >= 1440
        ? 6
        : width >= 1200
        ? 5
        : width >= 960
        ? 4
        : width >= 750
        ? 3
        : width >= 600
        ? 2
        : 1,
    [width]
  );

  const [myPlaylists, setMyPlaylists] = useState<any[]>([]);

  const { selectedSong, setSelectedSong, playerState, setPlayerState } =
    useContext(MediaPlayerKeyContext);

  useEffect(() => {
    getMyPlayLists();
    getTopPlaylists();
    getTopArtists();
    getTopGenres();
    getRecentlySongs();
  }, []);
  const getMyPlayLists = async () => {
    const resp = await mediaGetMyPlaylists();
    if (resp.success) {
      setMyPlaylists(resp.data.playlists);
    }
  };

  const getRecentlySongs = async () => {
    if (isLoadingRecentlySongs) return;
    setIsLoadingRecentlySongs(true);
    axios.get(`${URL()}/musicDao/getPlyerRecentlySongs`).then(async (res) => {
      const resp = res.data;
      if (resp.success) {
        let retSongs = resp.data.retSongs.filter((v, i) => i < 6);
        retSongs = makeAutoPlaySongsList(retSongs);
        setRecentlySongs((prev) => [...prev, ...retSongs]);
        // makeAutoPlaySongsList(retSongs);
      }
      setIsLoadingRecentlySongs(false);
    });
  };

  const getTopArtists = async () => {
    if (isLoadingTopArtists) return;
    setIsLoadingTopArtists(true);
    axios.get(`${URL()}/musicDao/getPlayerTopArtists`).then(async (res) => {
      const resp = res.data;
      if (resp.success) {
        let newTopArtists = [];
        if (resp.data.topArtists?.length > 0) {
          newTopArtists = resp.data.topArtists.map((v) => {
            return { ...v, ImageUrl: processImage(v.ImageUrl) };
          });
        }
        setTopArtists(newTopArtists);
        setIsLoadingTopArtists(false);
      } else {
        setIsLoadingTopArtists(false);
      }
    });
  };

  const getTopGenres = async () => {
    if (isLoadingTopArtists) return;
    setIsLoadingTopGenres(true);
    axios
      .get(`${URL()}/musicDao/getPlayerTopGenres`)
      .then((res) => {
        const resp = res.data;
        if (resp.success) {
          let genres = resp.data.genres ?? [];
          for (let i = 0; i < genres.length; i++) {
            genres[i].playingStatus = 0;
          }
          setTopGenres(genres);
        }
      })
      .finally(() => {
        setIsLoadingTopGenres(false);
      });
  };

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
            const songs: any[] = [];
            let duration = 0;
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
              duration,
              playingStatus: 0,
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

  const handlePlaylistPlay = async (id: string) => {
    if (
      topPlaylists?.length > 0 &&
      topPlaylists.findIndex((v) => v.id === id) >= 0
    ) {
      const playlists = topPlaylists;
      const curIndex = topPlaylists.findIndex((v) => v.id === id);
      // load songs and refresh current clicked playlist
      if (!playlists[curIndex].songs) {
        try {
          const response = await mediaGetPlaylistDetail(id);
          if (response.success) {
            const a = response.data;
            a.playingStatus = topPlaylists[curIndex].playingStatus;
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
              setSelectedSong({
                ...playlists[i].songs[0],
                duration: playlists[i].songs[0].mediaDuration ?? 0
              });
            } else {
              setSelectedSong({
                ...playlists[i].songs[0],
                duration:
                  playlists[i].songs[0].Duration ??
                  playlists[i].songs[0].duration ??
                  0
              });
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
      setTopPlaylists(playlists);
      setOffPlayingStatusGenre();
    }
  };

  const handlePlayGenre = async (id: string) => {
    if (topGenres?.length > 0 && topGenres.findIndex((v) => v.id === id) >= 0) {
      const curIndex = topGenres.findIndex((v) => v.id === id);
      // if (topGenres[curIndex].songCount <= 0) return;
      const genres = topGenres;
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
      setTopGenres(genres);
      setOffPlayingStatusTopPlaylists();
    }
  };

  const setOffPlayingStatusTopPlaylists = () => {
    let list = topPlaylists;
    for (let i = 0; i < list.length; i++) {
      list[i].playingStatus = 0;
    }
    setTopPlaylists(list);
  };
  const setOffPlayingStatusGenre = () => {
    let list = topGenres;
    for (let i = 0; i < list.length; i++) {
      list[i].playingStatus = 0;
    }
    setTopGenres(list);
  };

  return (
    <div className={classes.root} id={'scrollContainer'}>
      <Box mb={6}>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box className={comonClasses.sectionTitle}>Top Playlists</Box>
            <Box
              className={classes.showAll}
              onClick={() => {
                history.push(`/player/playlist`);
              }}
            >
              Explore All
            </Box>
          </Box>
          <Box mt={3}>
            {isLoadingTopPlaylists ? (
              <MasonryGrid
                gutter={'20px'}
                data={Array(isMobile ? 1 : isTablet ? 2 : 4).fill(0)}
                renderItem={(item, index) => (
                  <PlaylistCard
                    item={item}
                    key={`top-playlist-${index}`}
                    isLoading={isLoadingTopPlaylists}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            ) : (
              <MasonryGrid
                gutter={'20px'}
                data={topPlaylists}
                renderItem={(item, index) => (
                  <PlaylistCard
                    item={item}
                    key={`top-playlist-${index}`}
                    isLoading={isLoadingTopPlaylists}
                    handlePlaylistPlay={handlePlaylistPlay}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            )}
          </Box>
        </Box>
        <Box mt={6}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box className={comonClasses.sectionTitle}>Top Artists</Box>
            <Box
              className={classes.showAll}
              onClick={() => {
                history.push(`/player/artists`);
              }}
            >
              Explore All
            </Box>
          </Box>
          <Box mt={3}>
            {isLoadingTopArtists ? (
              <MasonryGrid
                gutter={'20px'}
                data={Array(loadingCountSix).fill(0)}
                renderItem={(item, index) => (
                  <ArtistCard
                    item={item}
                    key={`top-artist-${index}`}
                    isLoading={isLoadingTopArtists}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
              />
            ) : (
              <MasonryGrid
                gutter={'20px'}
                data={topArtists.slice(0, loadingCountSix)}
                renderItem={(item, index) => (
                  <ArtistCard
                    item={item}
                    key={`top-artist-${index}`}
                    isLoading={isLoadingTopArtists}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
              />
            )}
          </Box>
        </Box>
        <Box mt={6}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box className={comonClasses.sectionTitle}>Top Genres</Box>
            <Box
              className={classes.showAll}
              onClick={() => {
                history.push(`/player/genres`);
              }}
            >
              Explore All
            </Box>
          </Box>
          <Box mt={3}>
            {isLoadingTopGenres ? (
              <MasonryGrid
                gutter={'20px'}
                data={Array(loadingCount).fill(0)}
                renderItem={(item, index) => (
                  <GenreCard
                    item={item}
                    key={`top-genres-${index}`}
                    size="large"
                    isLoading={isLoadingTopGenres}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FIVE}
              />
            ) : (
              !!topGenres?.length && (
                <>
                  <Grid container spacing={3} style={{ marginBottom: '24px' }}>
                    <Grid item xs={12} sm={6}>
                      <GenreCard
                        item={topGenres[0]}
                        size="large"
                        isLoading={isLoadingTopGenres}
                        handlePlayGenre={handlePlayGenre}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <GenreCard
                        item={topGenres[1]}
                        size="large"
                        isLoading={isLoadingTopGenres}
                        handlePlayGenre={handlePlayGenre}
                      />
                    </Grid>
                  </Grid>
                  <MasonryGrid
                    gutter={'20px'}
                    data={topGenres.slice(
                      2,
                      Math.min(loadingCount + 2, topGenres.length)
                    )}
                    renderItem={(item, index) => (
                      <GenreCard
                        item={item}
                        key={`top-genres-${index}`}
                        size="large"
                        isLoading={isLoadingTopGenres}
                        handlePlayGenre={handlePlayGenre}
                      />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FIVE}
                  />
                </>
              )
            )}
          </Box>
        </Box>
        {(isLoadingRecentlySongs || recentlySongs.length > 0) && (
          <Box mt={6}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box className={comonClasses.sectionTitle}>Recently Played</Box>
              <Box
                className={classes.showAll}
                onClick={() => {
                  history.push(`/player/recentlyplayed`);
                }}
              >
                Explore All
              </Box>
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
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FIVE}
                />
              ) : (
                <MasonryGrid
                  gutter={'20px'}
                  data={recentlySongs}
                  renderItem={(item, index) => (
                    <PlayerSongCard
                      key={`recently-song-${index}`}
                      song={item}
                      isLoading={isLoadingRecentlySongs}
                      myPlaylists={myPlaylists}
                      refreshSongsList={() => {
                        setOffPlayingStatusTopPlaylists();
                        setOffPlayingStatusGenre();
                        setSongsList(recentlySongs);
                      }}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FIVE}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
}

const COLUMNS_COUNT_BREAK_POINTS_FIVE = {
  570: 1,
  600: 2,
  800: 3,
  1200: 4,
  1440: 5
};
const COLUMNS_COUNT_BREAK_POINTS_SIX = {
  470: 1,
  600: 2,
  750: 3,
  960: 4,
  1200: 5,
  1440: 6
};
const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  700: 2,
  1200: 3,
  1440: 4
};
