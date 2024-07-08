import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';

import GenreCard from '../../components/Cards/GenreCard';
import Box from 'shared/ui-kit/Box';
import URL from 'shared/functions/getURL';
import { musicDaoGetPlayerGenreSongs } from 'shared/services/API';

import { musicSubPageStyles } from '../index.styles';

import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import MusicContext from 'shared/contexts/MusicContext';
import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';

export default function GenreListPage() {
  const classes = musicSubPageStyles();

  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { setSongsList } = useContext(MusicContext);
  const { selectedSong, setSelectedSong, playerState, setPlayerState } =
    useContext(MediaPlayerKeyContext);

  useEffect(() => {
    getGenres();
  }, []);

  const getGenres = async () => {
    if (loading) return;
    setLoading(true);
    axios.get(`${URL()}/musicDao/getPlayerGenres`).then(async (res) => {
      const resp = res.data;
      let genreList: any = [];
      if (resp.success) {
        for (let i = 0; i < resp.data.length; i++) {
          const genre = resp.data[i];
          genreList.push({
            // img: genre.imgUrl,
            // genres: genre.name,
            ...genre,
            // id: genre.id,
            Type: 'GENRE',
            playingStatus: 0
          });
        }
        setGenres(genreList);
        setLoading(false);
      } else {
        setLoading(false);
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

  const handlePlayGenre = async (id: string) => {
    if (genres?.length > 0 && genres.findIndex((v) => v.id === id) >= 0) {
      const curIndex = genres.findIndex((v) => v.id === id);
      // if (topGenres[curIndex].songCount <= 0) return;
      const gs = genres;
      // load songs and refresh current clicked playlist
      if (!gs[curIndex].songs) {
        try {
          const response = await musicDaoGetPlayerGenreSongs(id, {
            lastId: undefined
          });
          if (response.success) {
            let genreSongs = response.songs;
            genreSongs = makeAutoPlaySongsList(genreSongs);
            gs[curIndex].songs = genreSongs;
          }
        } catch (error) {
          console.log(error);
          return;
        }
      }

      // set status
      for (let i = 0; i < gs.length; i++) {
        if (i === curIndex) {
          if (gs[i].playingStatus === 0) {
            // if stop, then change to playing
            gs[i].playingStatus = 1; // set button UI

            setPlayerState((state) => ({
              ...state,
              playing: true,
              loading: true,
              played: 0,
              playedSeconds: 0,
              duration:
                gs[i].songs[0].mediaDuration ??
                gs[i].songs[0].Duration ??
                gs[i].songs[0].duration ??
                0
            }));

            if (gs[i].songs[0].mediaDuration) {
              setSelectedSong({
                ...gs[i].songs[0],
                duration: gs[i].songs[0].mediaDuration ?? 0
              });
            } else {
              setSelectedSong({
                ...gs[i].songs[0],
                duration:
                  gs[i].songs[0].Duration ?? gs[i].songs[0].duration ?? 0
              });
            }

            // set song list
            if (gs[i].songs && gs[i].songs.length > 0) {
              setSongsList(gs[i].songs);
            }
          } else if (gs[i].playingStatus === 1) {
            // if playing, change to pause
            gs[i].playingStatus = 2; // set button UI
            setPlayerState((state) => ({
              ...state,
              playing: false
            }));
          } else if (gs[i].playingStatus === 2) {
            // if pause, change to playing
            gs[i].playingStatus = 1; // set button UI
            setPlayerState((state) => ({
              ...state,
              playing: true
            }));
          }
        } else {
          // set other playlist to stop
          gs[i].playingStatus = 0;
        }
      }
      setGenres(gs);
    }
  };

  return (
    <div className={classes.page}>
      <div className={classes.content}>
        <Box mb={6}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box className={classes.sectionTitle}>All Genres</Box>
          </Box>
          <Box mt={3}>
            <Grid container spacing={2}>
              {genres.map((genre, index) => (
                <Grid key={`genre-card-${index}`} item sm={3} xs={12}>
                  <GenreCard
                    item={genre}
                    size="large"
                    handlePlayGenre={handlePlayGenre}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </div>
    </div>
  );
}
