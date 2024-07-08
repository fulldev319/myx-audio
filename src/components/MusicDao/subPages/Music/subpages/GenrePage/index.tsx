import React, { useEffect, useState, useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import SubpageHeader from '../../components/SubpageHeader';
import URL from 'shared/functions/getURL';
import {
  musicDaoGetPlayerGenreSongs,
  musicDaoGetPlayerSearchedGenreSongs,
  musicDaoGetPlayerGenreInfo,
  mediaGetMyPlaylists
} from 'shared/services/API';
import { MusicGenres } from 'shared/constants/constants';
import Box from 'shared/ui-kit/Box';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
// import PlaylistCard from '../../components/Cards/PlaylistCard';
import PlayerSongCard from 'components/MusicDao/components/Cards/PlayerSongCard';

import { useDebounce } from 'use-debounce/lib';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { SearchIcon } from 'components/MusicDao/components/Icons/SvgIcons';
import { Color } from 'shared/ui-kit';

import { musicSubPageStyles } from '../index.styles';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import MusicContext from 'shared/contexts/MusicContext';
import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';

export default function GenrePage() {
  const classes = musicSubPageStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const { songsList, setSongsList } = useContext(MusicContext);
  const [autoPlayingSongs, setAutoPlayingSongs] = useState<any[]>([]);

  const [searchValue, setSearchValue] = React.useState<string>('');
  const [debouncedSearchValue] = useDebounce(searchValue, 1000);

  const [genreInfo, setGenreInfo] = useState<any>(undefined);
  const [loadingGenreInfo, setLoadingGenreInfo] = useState<boolean>(false);

  const [popularPlaylist, setPopularPlaylist] = useState<any[]>([]);
  const [loadingPlaylist, setLoadingPlaylist] = useState<boolean>(false);

  const [songs, setSongs] = useState<any[]>([]);
  const [loadingSongs, setLoadingSongs] = useState<boolean>(false);
  const lastId = React.useRef<string | undefined>();
  const [hasMoreSong, setHasMoreSong] = useState<boolean>(true);

  const [myPlaylists, setMyPlaylists] = useState<any[]>([]);

  const params: any = useParams();

  useEffect(() => {
    getGenreInfo();
    // getPopularPlaylist();
    // getSongsByGenre();
    getMyPlayLists();
  }, [params?.id]);

  const getMyPlayLists = async () => {
    const resp = await mediaGetMyPlaylists();
    if (resp.success) {
      setMyPlaylists(resp.data.playlists);
    }
  };

  const getPopularPlaylist = async () => {
    if (loadingPlaylist) return;
    setLoadingPlaylist(true);
    const resp = await axios.get(`${URL()}/media/getTopPlaylists`, {
      params: { type: 'listenedCount' }
    });
    if (resp.data.success) {
      setPopularPlaylist(resp.data.data.playlists);
    }
    setLoadingPlaylist(false);
  };

  const getGenreInfo = async () => {
    if (loadingGenreInfo || !params?.id || params?.id.length === 0) return;
    try {
      setLoadingGenreInfo(true);
      const resp = await musicDaoGetPlayerGenreInfo(params?.id);
      if (resp.success) {
        setGenreInfo(resp.data);
      }
      setLoadingGenreInfo(false);
    } catch (error) {
      console.log(error);
      setLoadingGenreInfo(false);
    }
  };

  useEffect(() => {
    // refresh page with searching
    lastId.current = undefined;
    setHasMoreSong(true);
    setSongs([]);
    if (debouncedSearchValue.length > 0) {
      getSearchedSongsByGenre();
    } else {
      getSongsByGenre();
    }
  }, [debouncedSearchValue]);

  const getSongsByGenre = async () => {
    if (loadingSongs || !hasMoreSong || !params?.id || params?.id.length === 0)
      return;
    try {
      setLoadingSongs(true);
      const resp = await musicDaoGetPlayerGenreSongs(params?.id ?? '', {
        lastId: lastId.current
      });
      if (resp.success) {
        const newSongs = resp.songs || [];
        const addingSongs: any[] = [];
        for (let i = 0; i < newSongs.length; i++) {
          const ns = newSongs[i];
          if (ns) addingSongs.push(ns);
        }
        if (addingSongs.length) {
          if (lastId.current === undefined) {
            setSongs(addingSongs);
          } else {
            setSongs([...songs, ...addingSongs]);
          }
          makeAutoPlaySongsList(addingSongs);
        }
        if (newSongs.length > 0)
          lastId.current = newSongs[newSongs.length - 1].id;
        setHasMoreSong(resp.hasMore ?? false);
      }
      setLoadingSongs(false);
    } catch (error) {
      console.log(error);
      setLoadingSongs(false);
    }
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
      if (lastId?.current) {
        setAutoPlayingSongs([...autoPlayingSongs, ...returnSongs]);
      } else {
        setAutoPlayingSongs(returnSongs);
      }
    }
  };

  const getSearchedSongsByGenre = async () => {
    if (loadingSongs || !hasMoreSong || !params?.id || params?.id.length === 0)
      return;
    try {
      setLoadingSongs(true);
      const resp = await musicDaoGetPlayerSearchedGenreSongs(params?.id ?? '', {
        lastStamp: lastId.current,
        search: debouncedSearchValue
      });
      if (resp.success) {
        const newSongs = resp.data?.nfts || [];
        const addingSongs: any[] = [];
        for (let i = 0; i < newSongs.length; i++) {
          const ns = newSongs[i];
          if (ns) addingSongs.push(ns);
        }
        if (addingSongs.length) {
          if (lastId.current === undefined) {
            setSongs(addingSongs);
          } else {
            setSongs([...songs, ...addingSongs]);
          }
        }
        lastId.current = resp.data.lastOffsetEnd;
        setHasMoreSong(resp.data.hasMore ?? false);
      }
      setLoadingSongs(false);
    } catch (error) {
      console.log(error);
      setLoadingSongs(false);
    }
  };
  return (
    <div className={classes.page} id={'scrollContainer'}>
      {/* <div
        className={classes.searchBox}
        style={{ marginLeft: 30, marginBottom: 20 }}
      >
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
        <Box
          onClick={() => {}}
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ cursor: 'pointer' }}
        >
          <SearchIcon color={Color.MusicDAODark} />
        </Box>
      </div> */}

      <SubpageHeader
        item={{
          ImageUrl:
            genreInfo?.imgUrl?.length > 0
              ? genreInfo?.imgUrl
              : params?.id && Number(params?.id) < 29
              ? require(`assets/genreImages/${params?.id}cover.webp`)
              : require(`assets/genreImages/defaultcover.webp`),

          // require(`assets/genreImages/${params?.id ?? 'default'}.webp`),
          GenreName: genreInfo?.name ?? ''
        }}
        setItem={() => {}}
      />
      <div className={classes.content}>
        {/* <Box className={classes.title}>{MusicGenres[Number(openTab?.id)]}</Box> */}
        <Box mt={isMobile ? 2 : 6}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box className={classes.sectionTitle}>
              All {genreInfo?.name ?? ''} Songs
            </Box>
          </Box>
          <Box mt={3}>
            <InfiniteScroll
              style={{ overflow: 'unset' }}
              hasChildren={songs.length > 0}
              dataLength={songs.length}
              scrollableTarget={'scrollContainer'}
              next={
                debouncedSearchValue.length > 0
                  ? getSearchedSongsByGenre
                  : getSongsByGenre
              }
              hasMore={hasMoreSong}
              loader={
                loadingSongs && (
                  <MasonryGrid
                    gutter={'20px'}
                    data={Array(6).fill(0)}
                    renderItem={(item, index) => (
                      <PlayerSongCard
                        key={`genre-song-${index}`}
                        song={item}
                        isLoading={loadingSongs}
                        myPlaylists={myPlaylists}
                      />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                  />
                )
              }
            >
              <div style={{ marginBottom: 20 }}>
                <MasonryGrid
                  gutter={'20px'}
                  data={songs}
                  renderItem={(item, index) => (
                    <PlayerSongCard
                      key={`genre-song-${index}`}
                      song={item}
                      isLoading={false}
                      myPlaylists={myPlaylists}
                      refreshSongsList={() => {
                        setSongsList(autoPlayingSongs);
                      }}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
                {!loadingSongs && !hasMoreSong && songs.length === 0 && (
                  <div className={classes.empty}>No Songs Yet</div>
                )}
              </div>
            </InfiniteScroll>
          </Box>
        </Box>
        {/* <Box mb={6}>
          <Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box className={classes.sectionTitle}>popular playlists</Box>
              <Box className={classes.showAll}>Explore all</Box>
            </Box>
            <Box mt={3}>
              {loadingPlaylist ? (
                <MasonryGrid
                  gutter={'20px'}
                  data={Array(6).fill(0)}
                  renderItem={(item, index) => (
                    <PlaylistCard
                      item={item}
                      key={`popular-playlist-${index}`}
                      isLoading={loadingPlaylist}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              ) : (
                <MasonryGrid
                  gutter={'20px'}
                  data={popularPlaylist}
                  renderItem={(item, index) => (
                    <PlaylistCard
                      item={item}
                      key={`popular-playlist-${index}`}
                      isLoading={loadingPlaylist}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              )}
            </Box>
          </Box>
        </Box> */}
      </div>
    </div>
  );
}
export const COLUMNS_COUNT_BREAK_POINTS_SIX = {
  400: 1,
  600: 2,
  800: 3,
  1200: 4,
  1440: 5
};
