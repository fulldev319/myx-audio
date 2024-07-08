const IPFSBackend = () => {
  //return 'https://music-trax-player-2-d2mkv.ondigitalocean.app';
  return (
    process.env.REACT_APP_PLAYER_BACKEND_URL ??
    `https://e91bfd-player.myx.audio`
  );
};

export default IPFSBackend;
