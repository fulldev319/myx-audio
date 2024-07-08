import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';
import { fLoader, pLoader } from 'shared/functions/ipfs/hls';
import OrbitDBClass from 'shared/functions/orbitdb/OrbitDBClass';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';

let db;
const getDB = async () => {
  db = await OrbitDBClass.setOrbitDB();
};
getDB();

const IPFSPlayer = ({ url }) => {
  const { showAlertMessage } = useAlertMessage();
  const playerOnProgress = async ({
    played,
    playedSeconds,
    loaded,
    loadedSeconds
  }) => {
    const mediaId = url.split('/').at(-2);
    const playedSecondsLog = `Player Consumption - playedSeconds : ${playedSeconds.toFixed(
      0
    )}s`;
    const loadedSecondsLog = `Player Consumption - loadedSeconds : ${loadedSeconds.toFixed(
      0
    )}s`;
    console.log('Player Consumption - ', {
      playedSeconds: `${playedSeconds.toFixed(0)}s`,
      loadedSeconds: `${loadedSeconds.toFixed(0)}s`
    });
    db.add({
      playedSeconds: playedSeconds.toFixed(0),
      mediaId,
      timeStamp: Math.floor(Date.now() / 1000)
    });
    db.add({
      loadedSeconds: loadedSeconds.toFixed(0),
      mediaId,
      timeStamp: Math.floor(Date.now() / 1000)
    });
  };

  return (
    <ReactPlayer
      height={200}
      width={300}
      controls={true}
      config={{
        file: {
          forceAudio: true,
          forceHLS: true,
          hlsOptions: { fLoader, pLoader },
          attributes: { controlsList: 'nodownload' }
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
      url={url}
      onProgress={playerOnProgress}
      className="react-player"
      onError={() => {
        console.log(`Couldn’t decrypt the content`, { variant: 'error' });
      }}
    />
  );
};

export default IPFSPlayer;
