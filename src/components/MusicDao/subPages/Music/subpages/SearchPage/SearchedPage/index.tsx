import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useTypedSelector } from 'store/reducers/Reducer';
import SongTable from '../../../components/SongTable';
import ArtistCard from '../../../components/Cards/ArtistCard';
import AlbumCard from '../../../components/Cards/AlbumCard';
import PlaylistCard from '../../../components/Cards/PlaylistCard';
import GenreCard from '../../../components/Cards/GenreCard';

import URL from 'shared/functions/getURL';
import Box from 'shared/ui-kit/Box';
import { musicSubPageStyles } from '../../index.styles';
import { searchPageStyles } from '../index.styles';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import {
  musicDaoGetPlayerAlbums,
  mediaGetPlaylists
} from 'shared/services/API';
import { processImage } from 'shared/helpers';
import { mediaGetMyPlaylists } from 'shared/services/API';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import CollectionCard from '../../../components/Cards/CollectionCard';

export default function SearchedPage({ search }: { search: any }) {
  const user = useTypedSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const [myPlaylists, setMyPlaylists] = useState<any[]>([]);

  const [songs, setSongs] = useState<any[]>([]);
  const [lastOffsetSong, setLastOffsetSong] = useState<any>(undefined);
  const [isSearchingSongs, setIsSearchingSongs] = useState<boolean>(false);
  const [hasMoreSongs, setHasMoreSongs] = useState<boolean>(true);

  const [artists, setArtists] = useState<any[]>([]);
  const [lastOffsetArtist, setLastOffsetArtist] = useState<any>(undefined);
  const [isSearchingArtists, setIsSearchingArtists] = useState<boolean>(false);
  const [hasMoreArtists, setHasMoreArtists] = useState<boolean>(true);
  const [viewMoreArtists, setViewMoreArtists] = useState<boolean>(false);

  const [collections, setCollections] = useState<any[]>([]);
  const [lastOffsetCollection, setLastOffsetCollection] =
    useState<any>(undefined);
  const [isSearchingCollections, setIsSearchingCollections] =
    useState<boolean>(false);
  const [hasMoreCollections, setHasMoreCollections] = useState<boolean>(true);
  const [viewMoreCollections, setViewMoreCollections] =
    useState<boolean>(false);

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [lastOffsetPlaylist, setLastOffsetPlaylist] = useState<any>(undefined);
  const [isSearchingPlaylists, setIsSearchingPlaylists] =
    useState<boolean>(false);
  const [hasMorePlaylists, setHasMorePlaylists] = useState<boolean>(true);
  const [viewMorePlaylists, setViewMorePlaylists] = useState<boolean>(false);

  const [genres, setGenres] = useState<any[]>([]);
  const [lastOffsetGenre, setLastOffsetGenre] = useState<any>(undefined);
  const [isSearchingGenres, setIsSearchingGenres] = useState<boolean>(false);
  const [hasMoreGenres, setHasMoreGenres] = useState<boolean>(true);
  const [viewMoreGenres, setViewMoreGenres] = useState<boolean>(false);

  const comonClasses = musicSubPageStyles();
  const classes = searchPageStyles();

  useEffect(() => {
    getMyPlayLists();
  }, []);
  const getMyPlayLists = async () => {
    const resp = await mediaGetMyPlaylists(user.id);
    if (resp.success) {
      setMyPlaylists(resp.data.playlists);
    }
  };

  useEffect(() => {
    loadSongs(true);
    loadArtists(true);
    loadCollections(true);
    loadPlaylists(true);
    loadGenres(true);
  }, [search]);

  const loadArtists = (isInit = false) => {
    if (isSearchingArtists || !search) return;
    if (isInit) {
      setLastOffsetArtist(undefined);
      setViewMoreArtists(false);
      setArtists([]);
    }
    setIsSearchingArtists(true);
    axios
      .get(`${URL()}/musicDao/getPlayerSearchedArtists`, {
        params: {
          search: search,
          lastStamp: isInit ? undefined : lastOffsetArtist
        }
      })
      .then(async (res) => {
        const ret = res.data;
        if (ret.success) {
          const newTopArtists = ret.data.artists.map((v) => {
            return { ...v, ImageUrl: processImage(v.ImageUrl) };
          });

          setArtists((prev) =>
            isInit ? newTopArtists : [...prev, ...newTopArtists]
          );
          setHasMoreArtists(ret.data.hasMore);
          setLastOffsetArtist(ret.data.lastOffsetEnd);
        }
      })
      .finally(() => {
        setIsSearchingArtists(false);
      });
  };
  const loadCollections = async (isInit = false) => {
    if (isSearchingCollections || !search) return;
    if (isInit) {
      setLastOffsetCollection(undefined);
      setViewMoreCollections(false);
      setCollections([]);
    }
    setIsSearchingCollections(true);
    const response = await musicDaoGetPlayerAlbums(
      isInit ? undefined : lastOffsetCollection,
      search
    );
    if (response.success) {
      let newAlbums: any[] = [];
      for (let i = 0; i < response.data.albums.length; i++) {
        newAlbums.push({
          ...response.data.albums[i]
        });
      }
      setCollections((prev) => (isInit ? newAlbums : [...prev, ...newAlbums]));
      setHasMoreCollections(response.data.hasMore ?? false);
      setLastOffsetCollection(response.data.lastOffsetEnd);
    }
    setIsSearchingCollections(false);
  };
  const loadPlaylists = async (isInit = false) => {
    if (isSearchingPlaylists || !search) return;
    if (isInit) {
      setLastOffsetPlaylist(undefined);
      setViewMorePlaylists(false);
      setPlaylists([]);
    }
    setIsSearchingPlaylists(true);
    const response = await mediaGetPlaylists(
      isInit ? undefined : lastOffsetCollection,
      search
    );
    if (response.success) {
      const newPlaylists = response.data.playlists || [];
      setPlaylists((prev) =>
        isInit ? newPlaylists : [...prev, ...newPlaylists]
      );
      setHasMorePlaylists(response.data.hasMore ?? false);
      setLastOffsetPlaylist(
        newPlaylists.length ? newPlaylists[newPlaylists.length - 1].id : ''
      );
    }
    setIsSearchingPlaylists(false);
  };
  const loadGenres = (isInit = false) => {
    if (isSearchingGenres || !search) return;
    if (isInit) {
      setLastOffsetArtist(undefined);
      setViewMoreGenres(false);
      setGenres([]);
    }
    setIsSearchingGenres(true);
    axios
      .get(`${URL()}/musicDao/getPlayerSearchedGenres`, {
        params: {
          search: search,
          lastStamp: isInit ? undefined : lastOffsetGenre
        }
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
              Type: 'GENRE'
            };
          });
          setGenres((prev) => (isInit ? newGenres : [...prev, ...newGenres]));
          setLastOffsetGenre(ret.data.lastOffsetEnd);
        }
        setHasMoreGenres(ret.data.hasMore);
      })
      .finally(() => {
        setIsSearchingGenres(false);
      });
  };

  const loadSongs = (isInit = false) => {
    if (isSearchingSongs || !search) return;
    if (isInit) {
      setLastOffsetSong(undefined);
      setSongs([]);
    }
    setIsSearchingSongs(true);
    axios
      .get(`${URL()}/musicDao/getPlayerSearchedSongNFTs`, {
        params: { search: search, lastStamp: lastOffsetSong }
      })
      .then(async (res) => {
        const ret = res.data;
        if (ret.success && ret.data.nfts.length > 0) {
          setSongs((prev) => [...prev, ...ret.data.nfts]);
          setHasMoreSongs(ret.data.hasMore);
          setLastOffsetSong(ret.data.lastOffsetEnd);
        }
      })
      .finally(() => {
        setIsSearchingSongs(false);
      });
  };

  return (
    <div>
      {/* Tracks */}
      <Box mt={6}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={comonClasses.sectionTitle}>Tracks</Box>
          <Box className={classes.showAll} onClick={() => {}}>
            Clear search history
          </Box>
        </Box>
        <Box mt={3}>
          {!isSearchingSongs && !hasMoreSongs && songs?.length === 0 ? (
            <div className={classes.empty}>No searched songs</div>
          ) : (
            <SongTable
              height={500}
              itemArray={songs}
              page="search"
              simplified={false}
              myPlaylists={myPlaylists}
              loading={isSearchingSongs}
              hasMore={hasMoreSongs}
              loadMore={() => loadSongs(false)}
            />
          )}
        </Box>
      </Box>
      {/* Artists */}
      <Box mt={12}>
        {/* {(isSearchingArtists || artists.length > 0) && ( */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={comonClasses.sectionTitle}>Artists</Box>
          <Box
            className={classes.showAll}
            onClick={() => {
              if (isSearchingArtists) return;
              setViewMoreArtists(!viewMoreArtists);
            }}
          >
            {viewMoreArtists ? 'hide more' : 'view more'}
          </Box>
        </Box>
        {/* )} */}
        <Box
          mt={3}
          style={viewMoreArtists ? { height: 760, overflow: 'auto' } : {}}
          id="scrollContainerArtist"
        >
          {!isSearchingArtists && !hasMoreArtists && artists?.length === 0 ? (
            <div className={classes.empty}>No searched artists</div>
          ) : !viewMoreArtists ? (
            <MasonryGrid
              gutter={'20px'}
              data={
                isSearchingArtists
                  ? Array(isMobile ? 1 : 6).fill(0)
                  : artists.slice(0, 6)
              }
              renderItem={(item, index) => (
                <ArtistCard
                  item={item}
                  key={`searched-artist-${index}`}
                  isLoading={isSearchingArtists}
                />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
            />
          ) : (
            <InfiniteScroll
              style={{ overflow: 'unset' }}
              hasChildren={artists.length > 0}
              dataLength={artists.length}
              scrollableTarget={'scrollContainerArtist'}
              next={loadArtists}
              hasMore={hasMoreArtists}
              loader={
                isSearchingArtists && (
                  <div style={{ marginTop: 20 }}>
                    <MasonryGrid
                      gutter={'20px'}
                      data={Array(isMobile ? 1 : 6).fill(0)}
                      renderItem={(item, index) => (
                        <ArtistCard
                          item={item}
                          key={`searching-artist-${index}`}
                          isLoading={isSearchingArtists}
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
                  data={artists}
                  renderItem={(item, index) => (
                    <ArtistCard
                      item={item}
                      key={`searched-artist-${index}`}
                      isLoading={false}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </Box>
            </InfiniteScroll>
          )}
        </Box>
      </Box>
      {/* Collections */}
      <Box mt={12}>
        {/* {(isSearchingCollections || collections.length > 0) && ( */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={comonClasses.sectionTitle}>Collections</Box>
          <Box
            className={classes.showAll}
            onClick={() => {
              if (isSearchingCollections) return;
              setViewMoreCollections(!viewMoreCollections);
            }}
          >
            {viewMoreCollections ? 'hide more' : 'view more'}
          </Box>
        </Box>
        {/* )} */}
        <Box
          mt={3}
          style={viewMoreCollections ? { height: 760, overflow: 'auto' } : {}}
          id="scrollContainerCollection"
        >
          {!isSearchingCollections &&
          !hasMoreCollections &&
          collections?.length === 0 ? (
            <div className={classes.empty}>No searched collections</div>
          ) : !viewMoreCollections ? (
            <MasonryGrid
              gutter={'20px'}
              data={
                isSearchingCollections
                  ? Array(isMobile ? 1 : 6).fill(0)
                  : collections.slice(0, 6)
              }
              renderItem={(item, index) => (
                <CollectionCard
                  item={item}
                  key={`searched-album-${index}`}
                  isLoading={isSearchingCollections}
                />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
          ) : (
            <InfiniteScroll
              style={{ overflow: 'unset' }}
              hasChildren={collections.length > 0}
              dataLength={collections.length}
              scrollableTarget={'scrollContainerCollection'}
              next={loadCollections}
              hasMore={hasMoreCollections}
              loader={
                isSearchingCollections && (
                  <div style={{ marginTop: 20 }}>
                    <MasonryGrid
                      gutter={'20px'}
                      data={Array(isMobile ? 1 : 6).fill(0)}
                      renderItem={(item, index) => (
                        <CollectionCard
                          item={item}
                          key={`searching-album-${index}`}
                          isLoading={isSearchingCollections}
                        />
                      )}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                    />
                  </div>
                )
              }
            >
              <Box>
                <MasonryGrid
                  gutter={'20px'}
                  data={collections}
                  renderItem={(item, index) => (
                    <CollectionCard
                      item={item}
                      key={`searched-album-${index}`}
                      isLoading={false}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                />
              </Box>
            </InfiniteScroll>
          )}
        </Box>
      </Box>
      {/* Playlists */}
      <Box mt={12}>
        {/* {(isSearchingPlaylists || playlists.length > 0) && ( */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={comonClasses.sectionTitle}>Playlists</Box>
          <Box
            className={classes.showAll}
            onClick={() => {
              if (isSearchingPlaylists) return;
              setViewMorePlaylists(!viewMorePlaylists);
            }}
          >
            {viewMorePlaylists ? 'hide more' : 'view more'}
          </Box>
        </Box>
        {/* )} */}
        <Box
          mt={3}
          style={viewMorePlaylists ? { height: 760, overflow: 'auto' } : {}}
          id="scrollContainerPlaylist"
        >
          {!isSearchingPlaylists &&
          !hasMorePlaylists &&
          playlists?.length === 0 ? (
            <div className={classes.empty}>No searched playlists</div>
          ) : !viewMorePlaylists ? (
            <MasonryGrid
              gutter={'20px'}
              data={
                isSearchingPlaylists
                  ? Array(isMobile ? 1 : 6).fill(0)
                  : playlists.slice(0, 6)
              }
              renderItem={(item, index) => (
                <PlaylistCard
                  item={item}
                  key={`searched-playlist-${index}`}
                  isLoading={isSearchingPlaylists}
                />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
          ) : (
            <InfiniteScroll
              style={{ overflow: 'unset' }}
              hasChildren={playlists.length > 0}
              dataLength={playlists.length}
              scrollableTarget={'scrollContainerPlaylist'}
              next={loadPlaylists}
              hasMore={hasMorePlaylists}
              loader={
                isSearchingPlaylists && (
                  <div style={{ marginTop: 20 }}>
                    <MasonryGrid
                      gutter={'20px'}
                      data={Array(isMobile ? 1 : 6).fill(0)}
                      renderItem={(item, index) => (
                        <PlaylistCard
                          item={item}
                          key={`searching-playlist-${index}`}
                          isLoading={isSearchingPlaylists}
                        />
                      )}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                    />
                  </div>
                )
              }
            >
              <Box>
                <MasonryGrid
                  gutter={'20px'}
                  data={playlists}
                  renderItem={(item, index) => (
                    <PlaylistCard
                      item={item}
                      key={`searched-playlist-${index}`}
                      isLoading={false}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                />
              </Box>
            </InfiniteScroll>
          )}
        </Box>
      </Box>
      {/* Genres */}
      <Box mt={12}>
        {/* {(isSearchingGenres || genres.length > 0) && ( */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={comonClasses.sectionTitle}>Genres</Box>
          <Box
            className={classes.showAll}
            onClick={() => {
              if (isSearchingGenres) return;
              setViewMoreGenres(!viewMoreGenres);
            }}
          >
            {viewMoreGenres ? 'hide more' : 'view more'}
          </Box>
        </Box>
        {/* )} */}
        <Box
          mt={3}
          style={viewMoreGenres ? { height: 760, overflow: 'auto' } : {}}
          id="scrollContainerGenre"
        >
          {!isSearchingGenres && !hasMoreGenres && genres?.length === 0 ? (
            <div className={classes.empty}>No searched genres</div>
          ) : !viewMoreGenres ? (
            <MasonryGrid
              gutter={'20px'}
              data={
                isSearchingGenres
                  ? Array(isMobile ? 1 : 3).fill(0)
                  : genres.slice(0, 3)
              }
              renderItem={(item, index) => (
                <GenreCard
                  item={item}
                  key={`searched--${index}`}
                  size="large"
                  isLoading={isSearchingGenres}
                />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
            />
          ) : (
            <InfiniteScroll
              style={{ overflow: 'unset' }}
              hasChildren={genres.length > 0}
              dataLength={genres.length}
              scrollableTarget={'scrollContainerGenre'}
              next={loadGenres}
              hasMore={hasMoreGenres}
              loader={
                isSearchingGenres && (
                  <div style={{ marginTop: 20 }}>
                    <MasonryGrid
                      gutter={'20px'}
                      data={Array(isMobile ? 1 : 3).fill(0)}
                      renderItem={(item, index) => (
                        <GenreCard
                          item={item}
                          key={`searching-genre-${index}`}
                          isLoading={isSearchingGenres}
                          size="large"
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
                  data={genres}
                  renderItem={(item, index) => (
                    <GenreCard
                      item={item}
                      key={`searched-genre-${index}`}
                      isLoading={false}
                      size="large"
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </Box>
            </InfiniteScroll>
          )}
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

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  700: 2,
  1200: 3,
  1440: 4
};

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  675: 1,
  900: 2,
  1440: 3
};
