import React, { useState, useEffect } from 'react';

import Table from '@material-ui/core/Table';
import CircularProgress from '@material-ui/core/CircularProgress';

import Box from 'shared/ui-kit/Box';
import { musicSubPageStyles } from '../index.styles';
import { fruitPageStyles } from './index.style';
import AlbumCard from '../../components/Cards/AlbumCard';
import PlaylistCard from '../../components/Cards/PlaylistCard';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import SongsRowHeader from '../../components/SongsRowHeader';
import SongRow from '../../components/SongRow';
import { useTypedSelector } from 'store/reducers/Reducer';
import {
  musicDaoGetFruitSongs,
  musicDaoGetFruitArtists,
  musicDaoGetFruitPlaylists,
  musicDaoGetFruitAlbums,
  mediaGetMyPlaylists
} from 'shared/services/API';
import { COLUMNS_COUNT_BREAK_POINTS_SIX } from '../SearchPage';
import ArtistCard from '../../components/Cards/ArtistCard';

enum OpenType {
  Home = 'HOME',
  Playlist = 'PLAYLIST',
  MyPlaylist = 'MYPLAYLIST',
  Album = 'ALBUM',
  Artist = 'ARTIST',
  Liked = 'LIKED',
  Library = 'LIBRARY',
  Search = 'SEARCH',
  Queue = 'QUEUE',
  Fruit = 'FRUIT'
}

const tabs = [
  { name: 'All', icon: require('assets/icons/fruits.webp') },
  { name: 'avocado', icon: require('assets/icons/avocado.webp') },
  { name: 'watermelon', icon: require('assets/icons/watermelon.webp') },
  { name: 'orange', icon: require('assets/icons/orange.webp') }
];

export default function FruitPage() {
  const commonClasses = musicSubPageStyles();
  const classes = fruitPageStyles();
  const user = useTypedSelector((state) => state.user);

  const [loading, setLoading] = useState<boolean>(false);
  const [curTab, setCurTab] = useState<number>(1);

  const [songs, setSongs] = useState<any[]>([]);
  const [loadingSongs, setLoadingSongs] = useState<boolean>(false);

  const [loadingArtists, setLoadingArtists] = useState<boolean>(false);
  const [artists, setArtists] = useState<any[]>([]);

  const [loadingPlaylists, setLoadingPlaylists] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<any[]>([]);

  const [loadingAlbums, setLoadingAlbums] = useState<boolean>(false);
  const [albums, setAlbums] = useState<any[]>([]);

  const [myPlaylists, setMyPlaylists] = useState<any[]>([]);

  useEffect(() => {
    fetchFruitSongs();
    fetchFruitArtists();
    fetchFruitPlaylists();
    fetchFruitAlbums();
  }, [user, curTab]);
  useEffect(() => {
    getMyPlayLists();
  }, [user]);

  const handleTabChange = (index) => {
    setCurTab(index);
  };

  const getMyPlayLists = async () => {
    const resp = await mediaGetMyPlaylists();
    if (resp.success) {
      setMyPlaylists(resp.data.playlists);
    }
  };
  const fetchFruitArtists = async () => {
    if (loadingArtists) return;
    try {
      setLoadingArtists(true);
      const resp = await musicDaoGetFruitArtists({
        fruitId: curTab,
        userId: user.id,
        pageNum: 1
      });
      if (resp.success) {
        const newArtists = resp.data.artists || [];
        setArtists(newArtists);
      }
      setLoadingArtists(false);
    } catch (error) {
      console.log(error);
      setLoadingArtists(false);
    }
  };
  const fetchFruitPlaylists = async () => {
    if (loadingPlaylists) return;
    try {
      setLoadingPlaylists(true);
      const resp = await musicDaoGetFruitPlaylists({
        fruitId: curTab,
        userId: user.id,
        pageNum: 1
      });
      if (resp.success) {
        const newPlaylists = resp.data.playlists || [];
        setPlaylists(newPlaylists);
      }
      setLoadingPlaylists(false);
    } catch (error) {
      console.log(error);
      setLoadingPlaylists(false);
    }
  };
  const fetchFruitAlbums = async () => {
    if (loadingPlaylists) return;
    try {
      setLoadingAlbums(true);
      const resp = await musicDaoGetFruitAlbums({
        fruitId: curTab,
        userId: user.id,
        pageNum: 1
      });
      if (resp.success) {
        const newAlubms = resp.data.albums || [];
        setAlbums(newAlubms);
      }
      setLoadingAlbums(false);
    } catch (error) {
      console.log(error);
      setLoadingAlbums(false);
    }
  };
  const fetchFruitSongs = async () => {
    if (loadingSongs) return;
    try {
      setLoadingSongs(true);
      const resp = await musicDaoGetFruitSongs({
        fruitId: curTab,
        userId: user.id,
        pageNum: 1
      });
      if (resp.success) {
        const newSongs = resp.data.songs || [];
        setSongs(newSongs);
      }
      setLoadingSongs(false);
    } catch (error) {
      console.log(error);
      setLoadingSongs(false);
    }
  };

  return (
    <div className={commonClasses.pageHeader}>
      {loading ? (
        <div className={commonClasses.loaderDiv}>
          <CircularProgress style={{ color: '#A0D800' }} />
        </div>
      ) : (
        <div className={commonClasses.content}>
          <Box className={classes.pageTitle}>My Fruits</Box>
          <Box display="flex" alignItems="center" my={4}>
            {tabs.map((item, index) => (
              <Box
                key={`fruit-tab-${index}`}
                className={classes.tabButton}
                bgcolor={curTab === index ? '#65CB63' : '#fff'}
                color={curTab === index ? '#fff' : '#2D3047'}
                onClick={() => {
                  handleTabChange(index);
                }}
              >
                <img
                  src={item.icon}
                  alt="fruit"
                  style={{ width: 20, height: 20, marginRight: 5 }}
                />
                <span>{item.name}</span>
              </Box>
            ))}
          </Box>
          {songs.length > 0 && (
            <>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box className={classes.title}>Tracks</Box>
                <Box className={classes.more}>Explore all</Box>
              </Box>
              <Box>
                <Table className={commonClasses.table}>
                  <SongsRowHeader page="album" />
                  {songs &&
                    songs.length > 0 &&
                    songs.map((song, index) => (
                      <SongRow
                        row={song}
                        myPlaylists={myPlaylists}
                        simplified={false}
                        page="album"
                        key={`song-${index}`}
                      />
                    ))}
                </Table>
              </Box>
            </>
          )}
          {artists.length > 0 && (
            <>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                my={2}
              >
                <Box className={classes.title}>artists</Box>
                <Box className={classes.more}>Explore all</Box>
              </Box>
              <Box mb={3}>
                <MasonryGrid
                  gutter={'30px'}
                  data={artists.slice(0, 6)}
                  renderItem={(item, index) => (
                    <ArtistCard
                      item={item}
                      key={`item-${index}`}
                      isLoading={loadingArtists}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </Box>
            </>
          )}
          {playlists.length > 0 && (
            <>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                my={2}
              >
                <Box className={classes.title}>playlists</Box>
                <Box className={classes.more}>Explore all</Box>
              </Box>
              <Box mb={3}>
                <MasonryGrid
                  gutter={'30px'}
                  data={playlists.slice(0, 6)}
                  renderItem={(item, index) => (
                    <PlaylistCard
                      item={item}
                      key={`item-${index}`}
                      isLoading={loadingPlaylists}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </Box>
            </>
          )}
          {albums.length > 0 && (
            <>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                my={2}
              >
                <Box className={classes.title}>collections</Box>
                <Box className={classes.more}>Explore all</Box>
              </Box>
              <Box>
                <MasonryGrid
                  gutter={'30px'}
                  data={albums.slice(0, 6)}
                  renderItem={(item, index) => (
                    <AlbumCard
                      item={item}
                      key={`item-${index}`}
                      isLoading={loadingAlbums}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </Box>
            </>
          )}
        </div>
      )}
    </div>
  );
}
