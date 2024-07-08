import React, { useEffect, useState, useContext } from 'react';

import Table from '@material-ui/core/Table';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';
import {
  musicDaoGetPlayerAlbumDetail,
  musicDaoGetPlayerAlbumSongs,
  mediaGetMyPlaylists
} from 'shared/services/API';
import SongsRowHeader from '../../components/SongsRowHeader';
import SongRow from '../../components/SongRow';
import SubpageHeader from '../../components/SubpageHeader';
import { musicSubPageStyles } from '../index.styles';
import { processImage } from 'shared/helpers';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import { useParams } from 'react-router-dom';
import MusicContext from 'shared/contexts/MusicContext';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';

export default function AlbumPage() {
  const classes = musicSubPageStyles();
  const params: any = useParams();

  const { songsList, setSongsList } = useContext(MusicContext);

  const [loadingAlbumData, setLoadingAlbumData] = useState<boolean>(false);
  const [album, setAlbum] = useState<any>({});

  const [color, setColor] = useState<string>('#ffffff');
  const [loading, setLoading] = useState<boolean>(true);

  const [songs, setSongs] = useState<any[]>([]);
  const [loadingSongs, setLoadingSongs] = useState<boolean>(false);
  const lastId = React.useRef<string | undefined>();
  const [hasMoreSong, setHasMoreSong] = useState<boolean>(true);

  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    //TODO: get real album
    if (!params.id) {
      return;
    }
    fetchAlbumData();
    fetchAlbumSongs();
  }, [params.id]);

  useEffect(() => {
    getPlayLists();
  }, []);

  const fetchAlbumData = async () => {
    if (loadingAlbumData) return;
    try {
      setLoadingAlbumData(true);
      const resp = await musicDaoGetPlayerAlbumDetail(params.id ?? '');
      if (resp.success) {
        const albumData = resp.data;
        albumData.image = albumData?.Image
          ? processImage(albumData.Image)
          : getDefaultBGImage();
        setAlbum(albumData);
      }

      setLoadingAlbumData(false);
    } catch (error) {
      console.log(error);
      setLoadingAlbumData(false);
    }
  };

  const fetchAlbumSongs = async () => {
    if (loadingSongs) return;
    try {
      setLoadingSongs(true);
      const resp = await musicDaoGetPlayerAlbumSongs(params?.id ?? '', {
        lastId: lastId.current
      });
      if (resp.success) {
        const newSongs: any[] = updateSongList(resp.songs);

        if (newSongs.length) {
          if (lastId.current === undefined) {
            setSongs(newSongs);
          } else {
            setSongs([...songs, ...newSongs]);
          }
          lastId.current = newSongs[newSongs.length - 1].Id;
        }
        setHasMoreSong(resp.hasMore ?? false);
      }
      setLoadingSongs(false);
    } catch (error) {
      console.log(error);
      setLoadingSongs(false);
    }
  };

  const updateSongList = (a) => {
    if (a?.length <= 0) return [];

    let asongs: any[] = [];
    let d = 0;
    let duration = '';
    for (let i = 0; i < a?.length; i++) {
      const s = a[i];
      if (s?.AnimationUrl?.length > 0)
        s.url = `https://proxy.myx.audio/getFile?url=${s.AnimationUrl}`;
      else if (s?.newFileCID && s?.metadata?.properties?.name)
        s.url = `${getURLfromCID(s.newFileCID)}/${s.metadata.properties.name}`;
      else s.url = '';

      if (s?.Duration || s?.duration) {
        s.mediaDuration = s?.Duration ?? Number(s?.duration);
      } else if (s?.metadata?.properties?.duration) {
        s.mediaDuration = s?.metadata?.properties?.duration;
      } else {
        s.mediaDuration = 0;
      }

      asongs.push({
        ...s,
        ImageUrl: s.Image ?? getDefaultBGImage()
      });
      if (s.mediaDuration) {
        d = d + s.mediaDuration;
      }
    }
    if (d > 0) {
      let hrs = Math.floor(d / 3600);
      let min = Math.floor((d % 3600) / 60);
      let seg = Math.floor(d % 60);
      duration = `${hrs && hrs > 0 ? `${hrs} hrs ` : ''}${min ?? 0} min ${
        seg ? seg.toFixed(0) : 0
      } seg`;
    } else {
      duration = `0 hrs 0 min 0 seg`;
    }

    return asongs;
  };

  const getPlayLists = async () => {
    const resp = await mediaGetMyPlaylists();
    if (resp.success) {
      setPlaylists(resp.data.playlists);
    }
  };

  // if (loading) {
  //   return (
  //     <div className={classes.loaderDiv}>
  //       <CircularProgress style={{ color: '#A0D800' }} />
  //     </div>
  //   );
  // }
  return (
    <div className={classes.page} id="album_page_body">
      {loadingAlbumData ? (
        <div className={classes.loaderDiv}>
          <CircularProgress style={{ color: '#A0D800' }} />
        </div>
      ) : (
        <SubpageHeader
          item={{ ...album, songs: songs, Color: `rgba(0,0,0,0.5)` }}
          setItem={setAlbum}
        />
      )}
      <div className={classes.content}>
        {songs.length > 0 || loadingSongs || hasMoreSong ? (
          <InfiniteScroll
            hasChildren={songs.length > 0}
            dataLength={songs.length}
            scrollableTarget={'album_page_body'}
            next={fetchAlbumSongs}
            hasMore={hasMoreSong}
            loader={loadingSongs && <LoadingWrapper loading />}
            style={{ overflow: 'inherit' }}
          >
            <Table className={classes.table}>
              <SongsRowHeader page="album" />
              {songs &&
                songs.length > 0 &&
                songs.map((song, index) => (
                  <SongRow
                    row={song}
                    myPlaylists={playlists}
                    simplified={false}
                    page="album"
                    key={`song-${index}`}
                    refreshSongsList={() => {
                      setSongsList(songs);
                    }}
                  />
                ))}
            </Table>
          </InfiniteScroll>
        ) : !hasMoreSong ? (
          <div className={classes.content} style={{ marginTop: '104px' }}>
            <div className={classes.empty}>No Songs</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
