import React, { useContext, useEffect, useState } from 'react';

import Table from '@material-ui/core/Table';

import { musicSubPageStyles } from '../index.styles';
import MusicContext from 'shared/contexts/MusicContext';
import SongRow from '../../components/SongRow';
import SubpageHeader from '../../components/SubpageHeader';
import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';

export default function QueuePage() {
  const classes = musicSubPageStyles();
  const [queue, setQueue] = useState<any>({});

  const { selectedSong } = useContext(MediaPlayerKeyContext);
  const { songsList } = useContext(MusicContext);

  useEffect(() => {
    //TODO: get real queue
    setQueue(songsList);
  }, [songsList]);

  if (queue)
    return (
      <div className={classes.page}>
        <SubpageHeader item={queue} setItem={setQueue} />
        <div className={classes.content}>
          <Table className={classes.table}>
            {selectedSong && <h5>You're listening to</h5>}
            {selectedSong && (
              <SongRow row={selectedSong} simplified={false} page="queue" />
            )}
            <h5>Coming up next</h5>
            {queue &&
              queue.length > 0 &&
              queue
                .filter(
                  (song) =>
                    !selectedSong || song.song_name !== selectedSong.song_name
                )
                .map((song) => (
                  <SongRow row={song} simplified={false} page="queue" />
                ))}
          </Table>
        </div>
      </div>
    );
  else return null;
}
