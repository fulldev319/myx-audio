import React from 'react';

import Box from 'shared/ui-kit/Box';
import EditionCard from '../EditionCard';
import addedSongStyles from './index.styles';

const AddedSongs = ({ songs }) => {
  const classes = addedSongStyles();

  return (
    <Box className={classes.container}>
      <Box display="flex" justifyContent="center" mb={2}>
        <Box className={classes.title}>Review Songs</Box>
      </Box>
      <Box>
        {songs.map((song, index) => (
          <EditionCard song={song} key={`card_${index}`} />
        ))}
      </Box>
    </Box>
  );
};

export default AddedSongs;
