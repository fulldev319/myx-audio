import React from 'react';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';

import Box from 'shared/ui-kit/Box';
import addedSongStyles from './index.styles';

const Investment = ({ pod }) => {
  const classes = addedSongStyles();

  return (
    <Box className={classes.container}>
      <Box display="flex" justifyContent="center" mb={2}>
        <Box className={classes.title}>Investment details</Box>
      </Box>
      <Box display="flex">
        <Box className={classes.borderBox} flex={1}>
          <Box display="flex">
            <img src={getDefaultBGImage()} width="100px" height="100px" />
            <Box ml={3}>
              <Box className={classes.title}>
                <span>25%</span> For investors
              </Box>
              <Box>
                <Box className={classes.urlLabel}>Number of NFT</Box>
                <Box className={classes.value}>12</Box>
              </Box>
              <Box>
                <Box className={classes.urlLabel}>Price per NFT</Box>
                <Box className={classes.value}>232 USDT</Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className={classes.totalRaiseBox} ml={2}>
          <Box className={classes.urlLabel}>Total raise </Box>
          <Box className={classes.value}>2245 MF</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Investment;
