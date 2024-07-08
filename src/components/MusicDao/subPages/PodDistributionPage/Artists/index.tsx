import React, { useState } from 'react';
import UserCard from 'components/MusicDao/components/Cards/UserCard';
import Box from 'shared/ui-kit/Box';
import { usePodDetailStyles } from '../index.styles';

export default function PodArtists({ pod }) {
  const classes = usePodDetailStyles();

  const [openPanel, setOpenPanel] = useState<boolean>(true);

  return (
    <>
      <Box
        className={classes.artistsBox}
        justifyContent="space-between"
        mt={4}
        mb={3}
      >
        <Box className={classes.title2}>Artists</Box>
        <Box
          className={classes.title3}
          display="flex"
          alignItems="center"
          onClick={() => setOpenPanel(!openPanel)}
        >
          {openPanel ? (
            <>
              <span>Hide</span>
              <UpArrowIcon />
            </>
          ) : (
            <>
              <span>Show</span>
              <DownArrwoIcon />
            </>
          )}
        </Box>
      </Box>
      {openPanel && (
        <Box mb={4} className={classes.artistsBox}>
          {pod.CreatorsData.map((creator, index) => (
            <UserCard key={`artist-${index}`} user={creator} invited />
          ))}
        </Box>
      )}
    </>
  );
}

const UpArrowIcon = () => (
  <svg
    width="8"
    height="5"
    viewBox="0 0 8 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 4L4 1L1 4"
      stroke="#77788E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DownArrwoIcon = () => (
  <svg
    width="8"
    height="6"
    viewBox="0 0 8 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1.60547L4 4.60547L7 1.60547"
      stroke="#77788E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
