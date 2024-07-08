import React, { useEffect, useState, useContext } from 'react';

import Table from '@material-ui/core/Table';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';
import Box from 'shared/ui-kit/Box';
import SongsRowHeader from '../../components/SongsRowHeader';
import SongRow from '../../components/SongRow';
import ActionsRow from '../../components/ActionsRow';
import SubpageHeader from '../../components/SubpageHeader';
import getAverageColor from 'get-average-color';
import axios from 'axios';
import URL from 'shared/functions/getURL';
import {
  mediaGetMyPlaylists,
  mediaGetPlaylistDetail
} from 'shared/services/API';
import { useTypedSelector } from 'store/reducers/Reducer';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import CreatePlaylistModal from '../../modals/CreatePlaylistModal';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';

import { musicSubPageStyles } from '../index.styles';
import { useHistory, useParams } from 'react-router-dom';
import MusicContext from 'shared/contexts/MusicContext';

export default function PlaylistDetailPage() {
  const classes = musicSubPageStyles();
  const user = useTypedSelector((state) => state.user);
  const [playlist, setPlaylist] = useState<any>({ ImageUrl: null });
  const [playlists, setPlaylists] = useState<any[]>([]);

  const { songsList, setSongsList } = useContext(MusicContext);

  const [color, setColor] = useState<string>('#cccccc');
  const [loading, setLoading] = useState<boolean>(false);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const params: any = useParams();
  const history = useHistory();

  const [openEditPlaylistModal, setOpenEditPlaylistModal] =
    useState<boolean>(false);

  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  useEffect(() => {
    getPlayLists();
  }, []);
  useEffect(() => {
    refreshPlaylist();
  }, [params?.id]);

  const getPlayLists = async () => {
    const resp = await mediaGetMyPlaylists();
    if (resp.success) {
      setPlaylists(resp.data.playlists);
    }
  };

  const refreshPlaylist = async () => {
    if (loading || !params?.id) return;

    setLoading(true);
    const response = await mediaGetPlaylistDetail(params.id);
    if (response.success) {
      const a = response.data;
      await updatePlaylist(a);
    }
    setLoading(false);
  };

  const updatePlaylist = async (a) => {
    if (a) {
      const RANDOM_MOCK_PLAYLISTS_LENGTH = 19;
      if (!a.ImageUrl) {
        a.ImageUrl = require(`assets/mediaIcons/mockup/playlist_mock_up_${
          Math.floor(Math.random() * RANDOM_MOCK_PLAYLISTS_LENGTH) + 1
        }.webp`);
      }
    }
    getAverageColor(a.ImageUrl).then((rgb) => {
      if (rgb) {
        setColor(`rgba(${rgb.r},${rgb.g},${rgb.b},1)`);
      }
    });
    if (a.Color) {
      setColor(a.Color);
    }

    a.songs = [];
    if (a.listSongs && a.listSongs.length > 0) {
      let duration = 0;
      for (let i = 0; i < a.listSongs?.length; i++) {
        const s = a.listSongs[i];
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
        duration += s.mediaDuration;

        a.songs.push({
          ...s,
          ImageUrl: s.Image ?? getDefaultBGImage()
        });
      }

      setPlaylist({ ...a, duration });
    } else {
      setPlaylist(a);
    }
  };

  const handleEdit = () => {
    setOpenEditPlaylistModal(true);
  };
  const handleDelete = async () => {
    const resp = await axios.post(`${URL()}/media/deletePlaylist`, {
      id: playlist.id,
      creatorId: user.id
    });
    if (resp.data.success) {
      showAlertMessage(`Playlist Removed!`, { variant: 'success' });
      history.push('/player/playlist');
    }
  };

  if (loading) {
    return (
      <div className={classes.loaderDiv}>
        <CircularProgress style={{ color: '#A0D800' }} />
      </div>
    );
  } else if (!playlist?.ImageUrl) {
    return (
      <div className={classes.page}>
        <SubpageHeader
          item={{
            empty: true,
            Color: color
          }}
          setItem={() => {}}
        />
        <div className={classes.content} style={{ marginTop: '104px' }}>
          <div className={classes.empty}>Playlist not found</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={classes.page}>
        <SubpageHeader
          item={{
            ...playlist,
            Color: color,
            count: playlist.listSongs?.length || 0
          }}
          setItem={setPlaylist}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
        <Box mt={8} className={classes.content}>
          {/* <ActionsRow
            item={playlist}
            setItem={setPlaylist}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          /> */}
          {playlist.songs && playlist.songs.length > 0 && (
            <Table className={classes.table}>
              <SongsRowHeader page="playlist" />
              {playlist.songs.map((song, index) => (
                <SongRow
                  index={index + 1}
                  row={song}
                  simplified={false}
                  page="playlist"
                  myPlaylists={playlists}
                  playlist={playlist}
                  refreshPlaylist={() => refreshPlaylist()}
                  key={`song-${index}`}
                  refreshSongsList={() => {
                    setSongsList(playlist.songs);
                  }}
                />
              ))}
            </Table>
          )}
        </Box>
        {openEditPlaylistModal && (
          <CreatePlaylistModal
            open={openEditPlaylistModal}
            handleClose={() => {
              setOpenEditPlaylistModal(false);
            }}
            handleRefresh={(newPlaylist) => {
              updatePlaylist(newPlaylist);
            }}
            item={playlist}
          />
        )}
      </div>
    );
  }
}
