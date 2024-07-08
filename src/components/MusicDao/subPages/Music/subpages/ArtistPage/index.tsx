import React, { useEffect, useState, useContext } from 'react';
import cls from 'classnames';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Table from '@material-ui/core/Table';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';
import { musicSubPageStyles } from '../index.styles';
import SongsRowHeader from '../../components/SongsRowHeader';
import SongRow from '../../components/SongRow';
import SubpageHeader from '../../components/SubpageHeader';
import AlbumCard from '../../components/Cards/AlbumCard';
import ArtistCard from '../../components/Cards/ArtistCard';
import PlaylistCard from '../../components/Cards/PlaylistCard';
import { useTypedSelector } from 'store/reducers/Reducer';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { COLUMNS_COUNT_BREAK_POINTS_SIX } from '../SearchPage';
import URL from 'shared/functions/getURL';
import Box from 'shared/ui-kit/Box';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import {
  musicDaoGetAlbumsOfArtist,
  mediaGetUserPlaylists,
  mediaGetMyPlaylists
} from 'shared/services/API';
// import { processImage } from 'shared/helpers';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import MusicContext from 'shared/contexts/MusicContext';

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

export default function ArtistPage() {
  const classes = musicSubPageStyles();
  const user = useTypedSelector((state) => state.user);
  const params: any = useParams();

  const { songsList, setSongsList } = useContext(MusicContext);

  const [artistInfo, setArtistInfo] = useState<any>();
  const [loadingArtistInfo, setLoadingArtistInfo] = useState<boolean>(false);
  const [color, setColor] = useState<string>('#ffffff');

  const [songs, setSongs] = useState<any[]>([]);
  const [loadingSongs, setLoadingSongs] = useState<boolean>(false);

  const [albums, setAlbums] = useState<any[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState<boolean>(false);

  const [spottedPlaylists, setSpottedPlaylists] = useState<any[]>([]);
  const [loadingSpottedPlaylists, setLoadingSpottedPlaylists] =
    useState<boolean>(false);

  const [interestedArtists, setInterestedArtists] = useState<any[]>([]);
  const [loadingInterestedArtists, setLoadingInterestedArtists] =
    useState<boolean>(false);

  const { setMultiAddr } = useIPFS();

  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  const getArtiststInfo = async () => {
    if (loadingArtistInfo) {
      return;
    }
    setLoadingArtistInfo(true);

    const response = await axios.get(
      `${URL()}/musicDao/getPlayerArtistDetail?artistId=${params.id}`
    );
    if (response.data.success) {
      setArtistInfo((prev) => ({ ...prev, ...response.data.data }));
    } else {
      console.log(response.data.message);
    }
    setLoadingArtistInfo(false);
  };

  const getSongs = async () => {
    if (loadingSongs || !params?.id) {
      return;
    }

    setLoadingSongs(true);
    const response = await axios.get(`${URL()}/musicDao/getPlayerUserSongs`, {
      params: {
        userId: params.id
        // lastTimestamp: undefined,
      }
    });

    if (response.data.success) {
      let newSongs: any[] = [];
      if (response.data.data.length > 0) {
        for (let i = 0; i < response.data.data.length; i++) {
          const s = response.data.data[i];
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

          const songData = {
            ...s,
            ImageUrl: s.Image ?? getDefaultBGImage()
          };
          newSongs.push(songData);
        }
        if (newSongs.length > 0) {
          setArtistInfo((prev) => ({
            ...prev,
            songs: [...songs, ...newSongs]
          }));
          setSongs((prev) => [...prev, ...newSongs]);
        }
      } else {
        setArtistInfo((prev) => ({ ...prev, songs }));
      }
      setLoadingSongs(false);
    } else {
      setLoadingSongs(false);
      console.log(response.data.message);
    }
  };

  const getInterestedArtists = () => {
    if (loadingInterestedArtists) {
      return;
    }
    setLoadingInterestedArtists(true);
    axios
      .get(`${URL()}/claimableSongs/getArtistList`)
      .then((response) => {
        if (response.data.success) {
          const artists = response.data.data.map((item) => {
            return {
              ...item,
              Type: OpenType.Artist
            };
          });
          artists.sort((a, b) => a.artist_name.localeCompare(b.artist_name));
          setInterestedArtists(artists);
          setLoadingInterestedArtists(false);
        } else {
          console.log(response.data.message);
          setLoadingInterestedArtists(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoadingInterestedArtists(false);
      });
  };

  const getAlbums = () => {
    if (!params.id || loadingAlbums) {
      return;
    }
    setLoadingAlbums(true);
    musicDaoGetAlbumsOfArtist(params.id)
      .then((response) => {
        if (response.success) {
          const data = response.data;
          let newAlbums: any[] = [];
          for (let i = 0; i < data.albums.length; i++) {
            newAlbums.push({
              Type: OpenType.Album,
              ...data.albums[i]
            });
          }
          setAlbums((prev) => [...prev, ...newAlbums]);
          // lastAlbumIdRef.current = nextPageAlbums.length ? nextPageAlbums[nextPageAlbums.leng - 1].id : "";
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoadingAlbums(false));
  };

  const getSpottedPlaylists = () => {
    if (!params.id || loadingSpottedPlaylists) {
      return;
    }
    setLoadingSpottedPlaylists(true);
    mediaGetUserPlaylists(params.id)
      .then((response) => {
        if (response.success) {
          const data = response.data;
          let newDatas: any[] = [];
          for (let i = 0; i < data.playlists.length; i++) {
            newDatas.push({
              Type: OpenType.PlaylistDetail,
              ...data.playlists[i]
            });
          }
          setSpottedPlaylists((prev) => [...prev, ...newDatas]);
          // lastAlbumIdRef.current = nextPageAlbums.length ? nextPageAlbums[nextPageAlbums.leng - 1].id : "";
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoadingSpottedPlaylists(false));
  };

  const getMyPlayLists = async () => {
    const resp = await mediaGetMyPlaylists();
    if (resp.success) {
      setPlaylists(resp.data.playlists);
    }
  };

  useEffect(() => {
    if (params?.id) {
      getArtiststInfo();
      getSongs();
      getAlbums();
      getSpottedPlaylists();
      getInterestedArtists;
      getMyPlayLists();
    }
  }, [params?.id]);

  let matchArtists = interestedArtists.slice(0, 6);
  return (
    <LoadingWrapper loading={loadingArtistInfo}>
      {artistInfo && (
        <div className={classes.page}>
          {!artistInfo?.ImageUrl ? (
            <div className={classes.content} style={{ marginTop: '104px' }}>
              <div className={classes.empty}>Artist not found</div>
            </div>
          ) : (
            <SubpageHeader
              item={{
                ...artistInfo,
                verified: false,
                Color: color,
                image: artistInfo.ImageUrl
              }}
              setItem={setArtistInfo}
            />
          )}
          <div className={classes.content} style={{ paddingBottom: 0 }}>
            {loadingSongs ? (
              <div className={classes.loaderDiv}>
                <CircularProgress style={{ color: '#A0D800' }} />
              </div>
            ) : songs.length > 0 ? (
              <>
                <Table className={classes.table}>
                  <SongsRowHeader page="artist" />
                  {songs &&
                    songs.length > 0 &&
                    songs.map((song, index) => (
                      <SongRow
                        row={song}
                        page="artist"
                        simplified={false}
                        key={`song-${index}`}
                        myPlaylists={playlists}
                        refreshSongsList={() => {
                          setSongsList(artistInfo.songs);
                        }}
                      />
                    ))}
                </Table>
              </>
            ) : null}
            <Box height="50px" />
            {loadingAlbums ? (
              <div className={classes.cards}>
                <MasonryGrid
                  gutter={'20px'}
                  data={Array(6).fill(0)}
                  renderItem={(item, index) => (
                    <AlbumCard
                      item={item}
                      key={`item-${index}`}
                      isLoading={loadingAlbums}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </div>
            ) : albums.length > 0 ? (
              <>
                <div className={classes.title}>Collections</div>
                <div className={classes.cards}>
                  <MasonryGrid
                    gutter={'20px'}
                    data={albums.slice(0, 5)}
                    renderItem={(item, index) => (
                      <AlbumCard
                        item={item}
                        key={`item-${index}`}
                        isLoading={loadingAlbums}
                      />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                  />
                </div>
              </>
            ) : null}

            {loadingSpottedPlaylists ? (
              <div
                className={classes.cards}
                style={{ justifyContent: 'flex-start' }}
              >
                <MasonryGrid
                  gutter={'20px'}
                  data={Array(6).fill(0)}
                  renderItem={(item, index) => (
                    <PlaylistCard
                      item={item}
                      key={`item-${index}`}
                      isLoading={loadingSpottedPlaylists}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </div>
            ) : spottedPlaylists.length > 0 ? (
              <>
                <div className={classes.title}>Spotted On</div>
                <div
                  className={classes.cards}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <MasonryGrid
                    gutter={'20px'}
                    data={spottedPlaylists.slice(0, 5)}
                    renderItem={(item, index) => (
                      <PlaylistCard
                        item={item}
                        key={`item-${index}`}
                        isLoading={loadingSpottedPlaylists}
                      />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                  />
                </div>
              </>
            ) : null}

            {loadingInterestedArtists ? (
              <div className={cls(classes.cards, classes.cardsHide)}>
                <MasonryGrid
                  gutter={'30px'}
                  data={Array(6).fill(0)}
                  renderItem={(item, index) => (
                    <ArtistCard item={item} key={`item-${index}`} />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                />
              </div>
            ) : matchArtists && matchArtists.length > 0 ? (
              <>
                <div className={classes.title}>You might be interested</div>
                <div className={cls(classes.cards, classes.cardsHide)}>
                  <MasonryGrid
                    gutter={'30px'}
                    data={matchArtists}
                    renderItem={(item, index) => (
                      <ArtistCard item={item} key={`item-${index}`} />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                  />
                </div>
              </>
            ) : null}
            {/* <div className={classes.title}>Information</div>
            <div
              className={classes.artistInfo}
              style={{
                backgroundImage: artistInfo.ImageUrl
                  ? `url(${processImage(artistInfo.ImageUrl)})`
                  : 'none'
              }}
            >
              <div className={classes.filter}>
                <h4>
                  {artistInfo.totalReproductions
                    ? artistInfo.totalReproductions.toLocaleString()
                    : 0}{' '}
                  Reproductions
                </h4>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </LoadingWrapper>
  );
}
