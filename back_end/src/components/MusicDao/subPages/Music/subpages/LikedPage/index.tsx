import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers/Reducer';

import Table from '@material-ui/core/Table';

import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';
import SongsRowHeader from '../../components/SongsRowHeader';
import SongRow from '../../components/SongRow';
import SubpageHeader from '../../components/SubpageHeader';
import axios from 'axios';
import URL from 'shared/functions/getURL';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { mediaGetMyPlaylists } from 'shared/services/API';

import { musicSubPageStyles } from '../index.styles';
import MusicContext from 'shared/contexts/MusicContext';

export default function LikedPage() {
  const classes = musicSubPageStyles();
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userSelector = useSelector((state: RootState) => state.user);

  const [playlists, setPlaylists] = useState<any[]>([]);

  const { setMultiAddr } = useIPFS();

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);
  useEffect(() => {
    if (userSelector?.id?.length > 0 && !isLoading) {
      getSongList();
      getMyPlayLists();
    }
  }, [userSelector]);

  const getMyPlayLists = async () => {
    const resp = await mediaGetMyPlaylists();
    if (resp.success) {
      setPlaylists(resp.data.playlists);
    }
  };

  const getSongList = async () => {
    setIsLoading(true);
    axios
      .get(`${URL()}/musicDao/getPlayerLikedSongs`, {
        params: { userId: userSelector.id }
      })
      .then(async (response) => {
        if (response.data.success) {
          let a = response.data.data;
          if (a.songs && a.songs.length > 0) {
            let d = 0;
            let duration = '';
            for (let i = 0; i < a.songs?.length; i++) {
              const s = a.songs[i];
              if (s?.AnimationUrl?.length > 0)
                a.songs[
                  i
                ].url = `https://proxy.myx.audio/getFile?url=${s.AnimationUrl}`;
              else if (s?.newFileCID && s?.metadata?.properties?.name)
                a.songs[i].url = `${getURLfromCID(s.newFileCID)}/${
                  s.metadata.properties.name
                }`;
              else a.songs[i].url = '';

              if (s?.Duration || s?.duration) {
                s.mediaDuration = s?.Duration ?? Number(s?.duration);
                a.songs[i].mediaDuration = s?.Duration ?? Number(s?.duration);
              } else if (s?.metadata?.properties?.duration) {
                s.mediaDuration = s?.metadata?.properties?.duration;
                a.songs[i].mediaDuration = s?.metadata?.properties?.duration;
              } else {
                s.mediaDuration = 0;
                a.songs[i].mediaDuration = 0;
              }

              a.songs[i].ImageUrl = a.songs[i].Image;
              if (s.mediaDuration) {
                d = d + s.mediaDuration;
              }
            }
            if (d > 0) {
              let hrs = Math.floor(d / 3600);
              let min = Math.floor((d % 3600) / 60);
              let seg = Math.floor(d % 60);
              duration = `${hrs && hrs > 0 ? `${hrs} hrs ` : ''}${
                min ?? 0
              } min ${seg ? seg.toFixed(0) : 0} seg`;
            } else {
              duration = `0 hrs 0 min 0 seg`;
            }
          }
          setLikedSongs(a.songs);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  if (likedSongs)
    return (
      <div className={classes.page}>
        <SubpageHeader
          item={{
            likedSongs,
            Imageurl: '',
            songs: likedSongs
          }}
          setItem={() => {}}
        />
        <div className={classes.content}>
          <Table className={classes.table}>
            <SongsRowHeader page="liked" />
            {likedSongs &&
              likedSongs.length > 0 &&
              likedSongs.map((song, i) => (
                <SongRow
                  row={song}
                  simplified={false}
                  page="liked"
                  key={`liked-song-${i}`}
                  myPlaylists={playlists}
                  refreshPlaylist={() => {
                    getSongList();
                  }}
                  refreshSongsList={() => {
                    setLikedSongs(likedSongs);
                  }}
                />
              ))}
          </Table>
        </div>
      </div>
    );
  else return null;
}
