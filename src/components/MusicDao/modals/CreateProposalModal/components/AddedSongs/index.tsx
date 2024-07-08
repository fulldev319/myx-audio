import React from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import { PrimaryButton, Gradient } from 'shared/ui-kit';
import EditionCard from '../EditionCard';
import addedSongStyles from './index.styles';

const AddedSongs = ({ onAddSong, songs, onRemove, onEdit }) => {
  const classes = addedSongStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box className={classes.container}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box className={classes.title}>Add Tracks</Box>
        {songs?.length > 0 && (
          <PrimaryButton
            size="medium"
            isRounded
            style={{
              background: Gradient.Blue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: isMobile ? 160 : 270,
              padding: 8
            }}
            onClick={() => {
              onAddSong && onAddSong();
            }}
          >
            <PlusIcon />
            <span style={{ marginLeft: 8 }}>ADD TRACK</span>
          </PrimaryButton>
        )}
      </Box>
      {songs?.length === 0 ? (
        <Box className={classes.borderBox}>
          <img
            src={require('assets/musicDAOImages/music-green3.webp')}
            alt="music-icon"
          />
          <Box className={classes.title}>Add First Track</Box>
          <Box className={classes.description} mt={2} mb={3} textAlign="center">
            Here you can add one or more songs and setup <br />
            streaming, revenue and all details related to your creation.
          </Box>
          <PrimaryButton
            size="medium"
            isRounded
            style={{
              background: Gradient.Blue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 270,
              padding: 8
            }}
            onClick={() => {
              onAddSong && onAddSong();
            }}
          >
            <PlusIcon />
            <span style={{ marginLeft: 8 }}>ADD TRACK</span>
          </PrimaryButton>
        </Box>
      ) : (
        <Box>
          {songs.map((song, index) => (
            <EditionCard
              song={song}
              onRemove={onRemove}
              onEdit={onEdit}
              index={index}
              key={`card_${index}`}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AddedSongs;

const PlusIcon = () => (
  <svg
    width="28"
    height="29"
    viewBox="0 0 28 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="14" cy="14.5" r="14" fill="white" />
    <path
      d="M14 9.5V19.5"
      stroke="#65CB63"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M19 14.5L9 14.5"
      stroke="#65CB63"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
