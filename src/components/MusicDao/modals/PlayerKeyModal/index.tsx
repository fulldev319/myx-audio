import React, { useEffect, useState } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton } from 'shared/ui-kit';

const createClasses = makeStyles((theme) => ({
  root: {
    width: '600px !important'
  },
  warningContainer: {
    // background: "rgba(231, 218, 175, 0.3)",
    borderRadius: '49px',
    height: '50px',
    width: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '11px',
    marginBottom: '11px'
  },
  title: {
    fontSize: 30,
    lineHeight: '40px',
    fontWeight: 800,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  description: {
    fontSize: 18,
    fontWeight: 400,
    lineHeight: '27px',
    textAlign: 'center',
    paddingBottom: '40px'
  }
}));

export const PlayerKeyModal = ({ open, onSign, onCancel }) => {
  const classes = createClasses();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={onCancel}
      className={classes.root}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box className={classes.warningContainer} mb={4}>
          <WarningIcon />
        </Box>
        <Box className={classes.title} mb={4}>
          IMPORTANT UPDATE
        </Box>
        <Box className={classes.description}>
        All audio files are heavily encrypted using IPFS and secret blockchain 
        network. To listen and upload music, you will need sign the media 
        encryption with your wallet.
        </Box>
        <Box>
          <PrimaryButton
            size="medium"
            isRounded
            style={{
              height: 46,
              minWidth: isMobile ? 112 : 195,
              background: '#54658F'
            }}
            onClick={onCancel}
          >
            No thanks
          </PrimaryButton>
          <PrimaryButton
            size="medium"
            isRounded
            style={{
              height: 46,
              minWidth: isMobile ? 112 : 195,
              background: '#65CB63'
            }}
            onClick={onSign}
          >
            Yes, sign and keep secure
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
};

const WarningIcon = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.4556 16.7688L11.2243 1.69656C11.1043 1.48093 10.9365 1.28875 10.72 1.16875C10.5043 1.04875 10.2643 0.976562 10.0243 0.976562C9.78434 0.976562 9.54434 1.04875 9.32873 1.16875C9.11311 1.28875 8.94434 1.48094 8.82434 1.69656L0.592103 16.7688C0.352103 17.2244 0.352103 17.681 0.616477 18.1132C0.736477 18.3288 0.904285 18.641 1.12086 18.761C1.33649 18.881 1.55305 19.0966 1.79305 19.0966H18.2575C18.4975 19.0966 18.7375 18.881 18.9297 18.761C19.1453 18.641 19.3141 18.401 19.4341 18.1854C19.6957 17.7532 19.6957 17.2254 19.4557 16.7688L19.4556 16.7688ZM8.5601 7.79328C8.5601 7.04889 9.13572 6.44889 9.8801 6.44889C10.6245 6.44889 11.2001 7.04889 11.2001 7.79328V11.8255C11.2001 12.5699 10.6245 13.1699 9.8801 13.1699C9.13572 13.169 8.5601 12.569 8.5601 11.8255V7.79328ZM10.0479 16.5768C9.30353 16.5768 8.70353 15.9768 8.70353 15.2324C8.70353 14.488 9.30353 13.888 10.0479 13.888C10.7923 13.888 11.3923 14.488 11.3923 15.2324C11.3923 15.9768 10.7923 16.5768 10.0479 16.5768Z"
      fill="#FF8E3C"
    />
  </svg>
);
