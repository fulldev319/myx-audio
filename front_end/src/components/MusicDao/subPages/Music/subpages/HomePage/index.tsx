import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import Pagination from '@material-ui/lab/Pagination';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CircularProgress from '@material-ui/core/CircularProgress';

import Box from 'shared/ui-kit/Box';
import { musicSubPageStyles } from '../index.styles';
import AlbumCard from '../../components/Cards/AlbumCard';
import PlaylistCard from '../../components/Cards/PlaylistCard';
import ArtistCard from '../../components/Cards/ArtistCard';
import RankingCard from '../../components/Cards/RankingCard';
import { Text } from 'components/MusicDao/components/ui-kit';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';
import URLTraxMicroservice from '../../../../../../shared/functions/getURLMusicMicroservice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/reducers/Reducer';
import { useHistory } from 'react-router-dom';
import useWindowDimensions from '../../../../../../shared/hooks/useWindowDimensions';

enum OpenType {
  Home = 'HOME',
  Playlist = 'PLAYLIST',
  MyPlaylist = 'MYPLAYLIST',
  Album = 'ALBUM',
  Artist = 'ARTIST',
  Song = 'SONG',
  Liked = 'LIKED',
  Library = 'LIBRARY',
  Search = 'SEARCH',
  Queue = 'QUEUE',
  GenreList = 'GENRELIST',
  Genre = 'GENRE',
  RecentSearches = 'RECENTSEARCHES',
  ExploreAll = 'EXPLOREALL'
}

enum ViewAllType {
  Album = 'New Albums',
  Artist = 'Featured Artists',
  Ranking = 'World Ranking',
  Discovery = 'Weekly Discovery'
}

export default function HomePage() {
  const classes = musicSubPageStyles();
  const commonClasses = musicDaoPageStyles();
  const historyUse = useHistory();

  const tabletMatch = useMediaQuery('(max-width:1280px)');
  const mobileMatch = useMediaQuery('(max-width:960px)');

  let userSelector = useSelector((state: RootState) => state.user);

  const [newAlbums, setNewAlbums] = useState<any>([]);
  const [artists, setArtists] = useState<any>([]);
  const [rankings, setRankings] = useState<any>([]);
  const [discovers, setDiscovers] = useState<any>([]);
  const [myPlaylists, setMyPlaylists] = useState<any>([]);

  const [showAll, setShowAll] = useState<ViewAllType | null>(null);

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  const fetchAlbumList = useCallback((pagination = 1) => {
    const token: string = Cookies.get('accessToken') || '';
    axios
      .get(`${URLTraxMicroservice()}/albums/get/${pagination}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.success) {
          setNewAlbums(
            response.data.data.albums.map((item) => ({
              ...item,
              Type: OpenType.Album
            }))
          );
          setTotal(response.data.data.totalCount);
          setLoading(false);
        } else {
          console.log(response.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const fetchArtistList = useCallback((pagination = 1) => {
    const token: string = Cookies.get('accessToken') || '';
    axios
      .get(`${URLTraxMicroservice()}/artists/get/${pagination}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.success) {
          setArtists(
            response.data.data.artists.map((item: any) => ({
              ...item,
              Type: OpenType.Artist
            }))
          );
          setTotal(response.data.data.totalCount);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const fetchRankingList = useCallback((pagination = 1) => {
    const token: string = Cookies.get('accessToken') || '';
    axios
      .get(`${URLTraxMicroservice()}/songs/ranking/get/${pagination}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.success) {
          setRankings(
            response.data.data.trendingSongs.map((item: any) => ({
              ...item,
              Type: OpenType.Song
            }))
          );
          setTotal(response.data.data.totalCount);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const fetchDiscoveryList = useCallback((pagination = 1) => {
    const token: string = Cookies.get('accessToken') || '';
    axios
      .get(`${URLTraxMicroservice()}/playlists/newest/get/${pagination}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.success) {
          setDiscovers(
            response.data.data.trendingSongs.map((item: any) => ({
              ...item,
              Type: OpenType.Playlist
            }))
          );
          setTotal(response.data.data.totalCount);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const fetchHomeInfo = useCallback((pagination = 1) => {
    const token: string = Cookies.get('accessToken') || '';
    axios
      .get(`${URLTraxMicroservice()}/musicDao/home/getInfo`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.success) {
          setRankings(
            response.data.data.trendingSongs.map((item: any) => ({
              ...item,
              Type: OpenType.Song
            }))
          );
          setArtists(
            response.data.data.topArtists.map((item: any) => ({
              ...item,
              Type: OpenType.Artist
            }))
          );
          setNewAlbums(
            response.data.data.newAlbums.map((item) => ({
              ...item,
              Type: OpenType.Album
            }))
          );
          setDiscovers(
            response.data.data.weeklyDiscover.map((item: any) => ({
              ...item,
              Type: OpenType.Playlist
            }))
          );
          setMyPlaylists(
            response.data.data.myPlaylists.map((item) => ({
              ...item
            }))
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const link = window.location.href.split('/')[7] || null;

    if (link && link !== '') {
      if (link === 'new-albums') {
        fetchAlbumList(page);
        setShowAll(ViewAllType.Album);
      } else if (link === 'featured-artists') {
        fetchArtistList(page);
        setShowAll(ViewAllType.Artist);
      } else if (link === 'world-ranking') {
        fetchRankingList(page);
        setShowAll(ViewAllType.Ranking);
      } else if (link === 'weekly-discover') {
        fetchDiscoveryList(page);
        setShowAll(ViewAllType.Discovery);
      }
    } else {
      if (showAll === ViewAllType.Album) {
        fetchAlbumList(page);
      } else if (showAll === ViewAllType.Artist) {
        fetchArtistList(page);
      } else if (showAll === ViewAllType.Ranking) {
        fetchRankingList(page);
      } else if (showAll === ViewAllType.Discovery) {
        fetchDiscoveryList(page);
      } else {
        fetchHomeInfo();
      }
    }
  }, [page, refresh, userSelector.id]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const renderItem = (type: ViewAllType) => {
    let sliceSize: number = 0;

    if (showAll) {
      sliceSize = 18;
    } else {
      if (mobileMatch) {
        sliceSize = 2;
      } else if (tabletMatch) {
        sliceSize = 4;
      } else {
        sliceSize = 6;
      }
    }

    if (type === ViewAllType.Album) {
      return (
        <Grid container spacing={2}>
          {newAlbums.slice(0, sliceSize).map((album, index) => (
            <Grid key={`album-card-${index}`} item xl={2} lg={2} md={3} xs={6}>
              <AlbumCard item={album} />
            </Grid>
          ))}
        </Grid>
      );
    } else if (type === ViewAllType.Artist) {
      return (
        <Grid container spacing={2}>
          {artists.slice(0, sliceSize).map((artist, index) => (
            <Grid key={`artist-card-${index}`} item xl={2} lg={2} md={3} xs={6}>
              <ArtistCard item={artist} />
            </Grid>
          ))}
        </Grid>
      );
    } else if (type === ViewAllType.Ranking) {
      return (
        <Grid container spacing={2}>
          {rankings.slice(0, sliceSize).map((ranking, index) => (
            <Grid
              key={`ranking-card-${index}`}
              item
              xl={2}
              lg={2}
              md={3}
              xs={6}
            >
              <RankingCard item={ranking} myPlaylists={myPlaylists} />
            </Grid>
          ))}
        </Grid>
      );
    } else if (type === ViewAllType.Discovery) {
      return (
        <Grid container spacing={2}>
          {discovers.slice(0, sliceSize).map((discover, index) => (
            <Grid
              key={`discover-card-${index}`}
              item
              xl={2}
              lg={2}
              md={3}
              xs={6}
            >
              <PlaylistCard item={discover} />
            </Grid>
          ))}
        </Grid>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={classes.pageHeader}>
      {loading ? (
        <div className={classes.loaderDiv}>
          <CircularProgress style={{ color: '#A0D800' }} />
        </div>
      ) : (
        <div className={classes.content}>
          {showAll ? (
            <>
              <Box
                className={classes.pointer}
                display="flex"
                flexDirection="row"
                alignItems="center"
                mb={3}
                onClick={() => {
                  setPage(0);
                  setShowAll(null);
                  historyUse.push('/player/home');
                  setLoading(true);
                }}
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path
                    d="M6 1L1 6L6 11"
                    stroke="#181818"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <Text ml={1.5}>Back</Text>
              </Box>
              <div className={classes.title}>{showAll}</div>
              <div className={classes.cards}>{renderItem(showAll)}</div>
              {total > 18 && (
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="center"
                  mt={5}
                >
                  <Pagination
                    count={Math.floor((total - 1) / 18) + 1}
                    page={page}
                    onChange={handleChange}
                  />
                </Box>
              )}
            </>
          ) : (
            <>
              {Object.keys(ViewAllType).map((type, index) => (
                <div key={`view-cards-${index}`}>
                  <div className={classes.title}>
                    {ViewAllType[type]}
                    <span
                      onClick={() => {
                        if (type === 'Artist') {
                          historyUse.push('/player/home/featured-artists');
                        } else if (type === 'Album') {
                          historyUse.push('/player/home/new-albums');
                        } else if (type === 'Ranking') {
                          historyUse.push('/player/home/world-ranking');
                        } else if (type === 'Discovery') {
                          historyUse.push('/player/home/weekly-discover');
                        }
                        setLoading(true);
                        setShowAll(ViewAllType[type]);
                        setPage(1);
                        setRefresh(true);
                      }}
                    >
                      VIEW MORE
                    </span>
                  </div>
                  <div className={classes.cards}>
                    {renderItem(ViewAllType[type])}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
