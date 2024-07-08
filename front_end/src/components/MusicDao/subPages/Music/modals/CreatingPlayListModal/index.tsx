import React from 'react';
import styled from 'styled-components';

import CircularProgress from '@material-ui/core/CircularProgress';

import Box from 'shared/ui-kit/Box';
import { Modal } from 'shared/ui-kit';

import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { creatingPlayListModalStyles } from './index.styles';
import { useHistory } from 'react-router-dom';

require('dotenv').config();

export default function CreatingPlayListModal({
  open,
  onClose,
  transactionInProgress,
  transactionSuccess,
  newPlaylistId
}: {
  open: boolean;
  onClose: () => void;
  transactionInProgress: boolean;
  transactionSuccess: boolean | null;
  newPlaylistId: any;
}) {
  const classes = creatingPlayListModalStyles();
  const history = useHistory();

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      className={classes.root}
      size="medium"
    >
      <BorderCloseButton onClick={onClose} />
      <div className={classes.iconContainer}>
        {transactionInProgress ? (
          <CircularProgress
            style={{ color: '#5046BB', width: '110px', height: '110px' }}
          />
        ) : transactionSuccess === false ? (
          <FailIcon />
        ) : transactionSuccess === true ? (
          <SuccessIcon />
        ) : null}
      </div>

      <div className={classes.title}>
        {transactionInProgress ? (
          'Creating Playlist...'
        ) : transactionSuccess === false ? (
          'Failed'
        ) : transactionSuccess === true ? (
          <>
            Playlist Created
            <br />
            Succesfully
          </>
        ) : null}
      </div>

      <Box
        style={{
          opacity: 0.9,
          fontSize: 16,
          fontWeight: 500
        }}
      >
        {transactionInProgress ? (
          <>
            This will take a moment,
            <br />
            <span style={{ color: 'red' }}>
              please do not close this window.
            </span>
          </>
        ) : transactionSuccess === false ? (
          <>
            Playlist created unfortunatelly,
            <br />
            please try again later
          </>
        ) : transactionSuccess === true ? (
          ``
        ) : null}
      </Box>
      {transactionSuccess && (
        <button
          className={classes.button}
          onClick={() => {
            history.push(`/player/playlist/${newPlaylistId}`);
            onClose && onClose();
          }}
        >
          Check the Playlist
        </button>
      )}
    </Modal>
  );
}

const BorderCloseButton = styled(CloseIcon)`
  z-index: 1;
  position: absolute;
  cursor: pointer;
  right: 16px;
  top: 16px;
  width: 48px;
  height: 48px;
  padding: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.17);
  color: white;
`;

export const FailIcon = () => (
  <svg
    width="104"
    height="103"
    viewBox="0 0 104 103"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="52.4453" cy="51.5" r="51.5" fill="#FE2C2B" />
    <path
      d="M39.9453 66L68.9438 37M39.9458 37.0007L68.9453 65.9997"
      stroke="url(#paint0_linear_16635_258871)"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_16635_258871"
        x1="9.75715"
        y1="-10.4"
        x2="48.0206"
        y2="-16.6175"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" />
      </linearGradient>
    </defs>
  </svg>
);

export const SuccessIcon = () => (
  <svg
    width="104"
    height="103"
    viewBox="0 0 104 103"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="52.4453" cy="51.5" r="51.5" fill="#4FDE65" />
    <path
      d="M38.6562 51.4668L47.873 60.6836L66.2442 42.3125"
      stroke="url(#paint0_linear_16635_258419)"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_16635_258419"
        x1="40.7445"
        y1="50.7387"
        x2="64.687"
        y2="55.5549"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.852705" stopColor="#FFFFFF" />
      </linearGradient>
    </defs>
  </svg>
);
