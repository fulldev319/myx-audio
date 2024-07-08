import React from 'react';
import { PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { songCardStyles } from './index.style';

const SongCard = ({ data, type = 0 }) => {
  const classes = songCardStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.topBox}>
        <Box display="flex" alignItems="center">
          <img
            src={require('assets/backgrounds/video.webp')}
            className={classes.imgBox}
          />
          <Box className={classes.header1} ml={2}>
            {data.name}
          </Box>
        </Box>
        <ArrowIcon />
      </Box>
      <Box className={classes.dataBox} mt={2}>
        <Box className={classes.header2}>Stake</Box>
        <Box display="flex" alignItems="center">
          <Box className={classes.header3} mr={1}>
            {data.stake} USDT
          </Box>
          <img
            src={require('assets/tokenImages/USDT.webp')}
            width="32px"
            height="32px"
          />
        </Box>
      </Box>
      <Box className={classes.dataBox} mt={2}>
        <Box className={classes.header2}>Rewards Accumulated</Box>
        <Box display="flex" alignItems="center">
          <Box className={classes.header3} mr={1}>
            {data.rewards} PT
          </Box>
          <Box
            style={{
              borderRadius: '32px',
              background: '#65CB63',
              width: '32px',
              height: '32px'
            }}
          >
            <img
              src={require('assets/musicDAOImages/potions_3.webp')}
              width="32px"
              height="32px"
            />
          </Box>
        </Box>
      </Box>
      <Box className={classes.dataBox} mt={2}>
        <Box className={classes.header2}>
          {type === 0 ? 'Redeption rate' : 'Monetisation rate'}
        </Box>
        <Box display="flex" alignItems="center">
          <Box className={classes.header3} mr={1}>
            {data.rate} {type === 0 ? 'Potions/h' : 'USD/h'}
          </Box>
        </Box>
      </Box>
      {type === 1 && (
        <Box className={classes.dataBox} mt={2}>
          <Box className={classes.header2}>Revenue generated</Box>
          <Box display="flex" alignItems="center">
            <Box className={classes.header3} mr={1}>
              {data.revenue} USD
            </Box>
          </Box>
        </Box>
      )}
      <Box className={classes.buttonBox} mt={2}>
        {type === 0 && (
          <SecondaryButton size="medium" isRounded onClick={() => {}}>
            Unstake
          </SecondaryButton>
        )}
        {type === 0 && (
          <PrimaryButton size="medium" isRounded onClick={() => {}}>
            Increase
          </PrimaryButton>
        )}
        {type === 1 && (
          <PrimaryButton
            size="medium"
            isRounded
            onClick={() => {}}
            style={{ width: '80%' }}
          >
            Withdraw
          </PrimaryButton>
        )}
      </Box>
    </Box>
  );
};

export default SongCard;

const ArrowIcon = () => {
  return (
    <svg
      width="6"
      height="11"
      viewBox="0 0 6 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 9.99902L5 5.49902L1 0.999024"
        stroke="#77788E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
