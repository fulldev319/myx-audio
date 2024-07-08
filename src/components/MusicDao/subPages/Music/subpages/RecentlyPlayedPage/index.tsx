import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import { mediaGetMyPlaylists } from 'shared/services/API';

import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import URL from 'shared/functions/getURL';
import { RootState } from 'store/reducers/Reducer';
import { CircularLoadingIndicator } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import PlayerSongCard from 'components/MusicDao/components/Cards/PlayerSongCard';
import { musicSubPageStyles } from '../index.styles';

import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import MusicContext from 'shared/contexts/MusicContext';
import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';

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

export const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  900: 2,
  1200: 3,
  1440: 4
};

export default function PlaylistPage() {
  const classes = musicSubPageStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const { songsList, setSongsList } = useContext(MusicContext);
  const [autoPlayingSongs, setAutoPlayingSongs] = useState<any[]>([]);

  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastStamp, setLastStamp] = useState<any>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [myPlaylists, setMyPlaylists] = useState<any[]>([]);
  useEffect(() => {
    getMyPlayLists();
  }, []);
  const getMyPlayLists = async () => {
    const resp = await mediaGetMyPlaylists();
    if (resp.success) {
      setMyPlaylists(resp.data.playlists);
    }
  };

  const loadSongs = async () => {
    if (loading) return;
    if (userSelector && userSelector.id) {
      try {
        setLoading(true);
        axios
          .get(`${URL()}/musicDao/getPlyerRecentlySongs`, {
            params: { lastTimestamp: lastStamp }
          })
          .then(async (res) => {
            const resp = res.data;
            if (resp.success) {
              const resData = resp.data;
              setSongs((prev) => [...prev, ...resData.retSongs]);
              makeAutoPlaySongsList(resData.retSongs);
              setLastStamp(resData.lastTimestamp);
              setHasMore(resData.hasMore);
              setLoading(false);
            } else {
              setLoading(false);
            }
          });
      } catch (err) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadSongs();
  }, [userSelector]);

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
      if (lastStamp) {
        setAutoPlayingSongs([...autoPlayingSongs, ...returnSongs]);
      } else {
        setAutoPlayingSongs(returnSongs);
      }
    }
  };

  return (
    <div className={classes.page} id={'scrollContainer'}>
      <div className={classes.content}>
        <Box className={classes.sectionTitle} mb={2}>
          Recently Played
        </Box>
        {/* <div className={classes.cards}> */}
        <InfiniteScroll
          style={{ overflow: 'unset' }}
          hasChildren={songs.length > 0}
          dataLength={songs.length}
          scrollableTarget={'scrollContainer'}
          next={loadSongs}
          hasMore={hasMore}
          loader={
            loading && (
              <Box mt={2}>
                <MasonryGrid
                  gutter={'30px'}
                  data={Array(isMobile ? 2 : 6).fill(0)}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  renderItem={(item, index) => (
                    <PlayerSongCard
                      song={item}
                      key={`recently-song-${index}`}
                      isLoading={loading}
                      myPlaylists={myPlaylists}
                    />
                  )}
                />
              </Box>
            )
          }
        >
          <div>
            <MasonryGrid
              gutter={'30px'}
              data={songs}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              renderItem={(item, index) => (
                <PlayerSongCard
                  song={item}
                  key={`recently-song-${index}`}
                  isLoading={false}
                  myPlaylists={myPlaylists}
                  refreshSongsList={() => {
                    setSongsList(autoPlayingSongs);
                  }}
                />
              )}
            />
            {!loading && !hasMore && songs.length === 0 && (
              <div className={classes.empty}>No Songs Yet</div>
            )}
          </div>
        </InfiniteScroll>
        {/* </div> */}
        {/* {loading ?
          <div className={classes.loaderDiv}>
            <CircularProgress style={{ color: "#A0D800" }} />
          </div>
          :
          (playlists && playlists.length > 0) ? (
            <div className={classes.cards}>
              <MasonryGrid
                gutter={"30px"}
                data={playlists}
                renderItem={(item, index) => <PlaylistCard item={item} key={`item-${index}`} />}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
              />
            </div>
          ) : (
            <div className={classes.content} style={{ marginTop: "104px" }}>
              <div className={classes.empty}>You have not created any Playlist</div>
            </div>
          )
        } */}
      </div>
    </div>
  );
}
