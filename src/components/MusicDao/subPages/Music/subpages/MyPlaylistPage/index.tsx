import React, { useEffect, useState } from 'react';
// import axios from "axios";
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

import CircularProgress from '@material-ui/core/CircularProgress';

import { musicSubPageStyles } from '../index.styles';
import { COLUMNS_COUNT_BREAK_POINTS_SIX } from '../SearchPage';
import PlaylistCard from '../../components/Cards/PlaylistCard';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { RootState } from 'store/reducers/Reducer';
import { mediaGetMyPlaylists } from 'shared/services/API';

enum OpenType {
  Home = 'HOME',
  Playlist = 'PLAYLIST',
  MyPlaylist = 'MYPLAYLIST',
  Album = 'ALBUM',
  Artist = 'ARTIST',
  Liked = 'LIKED',
  Library = 'LIBRARY',
  Search = 'SEARCH',
  Queue = 'QUEUE'
}

export default function MyPlaylistPage() {
  const classes = musicSubPageStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadPlaylists = async () => {
    const token: string = Cookies.get('accessToken') || '';
    const response = await mediaGetMyPlaylists();
    if (response.success) {
      const data = response.data.playlists || [];
      const playlistsData = data.map((item) => {
        return {
          ...item,
          Type: OpenType.Playlist
        };
      });
      setPlaylists(playlistsData);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  return (
    <div className={classes.page}>
      <div className={classes.content}>
        <div className={classes.title}>Playlist</div>
        {loading ? (
          <div className={classes.loaderDiv}>
            <CircularProgress style={{ color: '#A0D800' }} />
          </div>
        ) : playlists && playlists.length > 0 ? (
          <div className={classes.cards}>
            <MasonryGrid
              gutter={'30px'}
              data={playlists}
              renderItem={(item, index) => (
                <PlaylistCard item={item} key={`item-${index}`} />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
            />
          </div>
        ) : (
          <div className={classes.content} style={{ marginTop: '104px' }}>
            <div className={classes.empty}>
              You have not created any Playlist
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
