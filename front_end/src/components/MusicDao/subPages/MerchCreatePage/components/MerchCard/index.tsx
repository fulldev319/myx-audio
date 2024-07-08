import React, { useEffect, useState, useRef } from 'react';
import {
  useTheme,
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment
} from '@material-ui/core';

import {
  getDefaultAvatar,
  getDefaultBGImage
} from 'shared/services/user/getUserAvatar';
import { InfoTooltip } from 'shared/ui-kit/InfoTooltip';
import { styles } from './index.styles';

export default function MerchCard() {
  const classes = styles();

  return (
    <Box display="flex" style={{ marginBottom: 19 }}>
      <Box className={classes.leftCard}>
        <img className={classes.image} src={`${getDefaultBGImage()}`}></img>
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography className={classes.merchName}>Merch Name </Typography>
            <Box>
              <Button
                startIcon={<DeleteIcon />}
                className={classes.removeButton}
                style={{ background: '#EFDDDD' }}
              >
                Delete
              </Button>
              <Button
                startIcon={<EditIcon />}
                className={classes.editButton}
                style={{ background: '#DDE6EF', marginLeft: 16 }}
              >
                Edit
              </Button>
            </Box>
          </Box>
          <Typography className={classes.desc}>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt.
          </Typography>
          <Box display="flex" mt={3}>
            <Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box className={classes.typo3} mb={1}>
                  Amount of Pieces
                </Box>
                <InfoTooltip tooltip={'Amount of Pieces'} />
              </Box>
              <Box className={classes.inputBigBox}>
                <Typography className={classes.typo4}>24</Typography>
              </Box>
            </Box>
            <Box ml={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box className={classes.typo3} mb={1}>
                  Price per piece
                </Box>
                <InfoTooltip tooltip={'Amount of Pieces'} />
              </Box>
              <Box className={classes.inputBigBox}>
                <Typography className={classes.typo5}>24245</Typography>
                <Typography className={classes.typo6}>USDT</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.rightCard}>
        <Typography className={classes.typo1}>Maximum Revenue</Typography>
        <Typography className={classes.typo2}>23 405 USDT</Typography>
      </Box>
    </Box>
  );
}

const DeleteIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.82031 0.689692C4.82031 0.397204 5.05742 0.160095 5.34991 0.160095H9.19849C9.49097 0.160095 9.72808 0.397204 9.72808 0.689692C9.72808 0.98218 9.49097 1.21929 9.19849 1.21929H5.34991C5.05742 1.21929 4.82031 0.98218 4.82031 0.689692Z"
      fill="#F43E5F"
    />
    <path
      d="M0.84375 3.26812H2.25601L3.13867 13.1539C3.15729 13.4325 3.38899 13.649 3.66826 13.6483H10.8702C11.1495 13.649 11.3812 13.4325 11.3998 13.1539L12.2825 3.26812H13.6948V2.20892H0.84375V3.26812Z"
      fill="#F43E5F"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.0234 0.5C11.3654 0.5 10.7079 0.750787 10.2063 1.25184C7.3324 4.12572 4.45852 6.9996 1.5845 9.87362L5.22099 13.5101C8.09488 10.6362 10.9688 7.76235 13.8428 4.88833C14.8454 3.8857 14.8427 2.25397 13.8406 1.25184C13.3396 0.750801 12.6815 0.5 12.0235 0.5H12.0234ZM1.13865 10.6404L0.875534 13.756C0.853562 14.0207 1.07434 14.2415 1.33853 14.219L4.45249 13.9548L1.13865 10.6404Z"
      fill="#54658F"
    />
  </svg>
);
