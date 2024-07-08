import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Color, Modal, Paragraph, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';

import { useClaimFeesModalStyles } from './index.styles';

require('dotenv').config();
const isProd = process.env.REACT_APP_ENV === 'prod';

export const ClaimFeesModal = (props: any) => {
  const { open, handleClose, network, amount, transactionSuccess, txHash } = props;
  const classes = useClaimFeesModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const [step, setStep] = useState<number>(0);

  const isEth = (network || '').toLowerCase().includes('ethereum');
  const isPolygon = (network || '').toLowerCase().includes('polygon');
  const handleOpenTx = () => {
    if (network) {
      if (isPolygon) {
        window.open(
          `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/tx/${txHash}`,
          '_blank'
        );
      } else if (isEth) {
        window.open(
          `https://${!isProd ? 'rinkeby.' : ''}etherscan.io/tx/${txHash}`,
          '_blank'
        );
      }
    } else {
      window.open(
        `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/tx/${txHash}`,
        '_blank'
      );
    }
  };

  return (
    <Modal
      size="small"
      isOpen={open}
      onClose={handleClose}
      showCloseIcon
      className={classes.root}
    >
      <Box py={1}>
        {transactionSuccess === true ? (
          <img src={require('assets/musicDAOImages/result_success.webp')} />
        ) : transactionSuccess === false ? (
          <img src={require('assets/musicDAOImages/result_fail.webp')} />
        ) : (
          <div style={{ position: 'relative' }}>
            <img
              className={classes.loader}
              src={require('assets/musicDAOImages/loading.webp')}
            />
            <div className={classes.ethImg}>
              <img src={require('assets/musicDAOImages/eth.webp')} />
            </div>
          </div>
        )}
        <Box className={classes.h2} mt={4}>
          {transactionSuccess === true
            ? 'You have successfully claimed back the capsule fees. Check out your wallet.'
            : transactionSuccess === false
            ? 'Transaction failed'
            : `Getting back ${amount} MATIC fees from capsule creation`}
        </Box> 
        <Box className={classes.h5} mt={1} mb={2} color="#54658F">
          {transactionSuccess === false && txHash && "Unfortunatelly transaction didn't went through, please try again later. You can check your transaction link below"}
        </Box>
        {txHash && (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              style={{ cursor: 'pointer' }}
            >
              <Box className={classes.h5} mr={2} color="#54658F">
                Hash:
              </Box>
              <Box
                className={classes.h5}
                ml={1}
                mr={1}
                color="#65CB63"
                onClick={handleOpenTx}
              >
                {txHash.substr(0, 18) + '...' + txHash.substr(txHash.length - 3, 3)}
              </Box>
              <CopyToClipboard
                text={txHash}
                onCopy={() => {
                  showAlertMessage('Copied to clipboard', { variant: 'success' });
                }}
              >
                <CopyIcon />
              </CopyToClipboard>
            </Box>
          </>
        )}
        {transactionSuccess !== undefined && txHash && (
          <Box display="flex" justifyContent="center">
            <PrimaryButton
              className={classes.h4}
              size="medium"
              isRounded
              style={{
                marginTop: '24px',
                height: 45,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 24px',
                background: '#57CB55'
              }}
              onClick={handleOpenTx}
            >
              Check on {isEth ? 'Ethereum' : 'Polygon'} Scan
            </PrimaryButton>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

const CopyIcon = () => (
  <svg
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.5833 10.0833H14.8333C15.7538 10.0833 16.5 9.37445 16.5 8.5V2.95833C16.5 2.08388 15.7538 1.375 14.8333 1.375H9C8.07953 1.375 7.33333 2.08388 7.33333 2.95833V4.14583M3.16667 15.625H9C9.92047 15.625 10.6667 14.9161 10.6667 14.0417V8.5C10.6667 7.62555 9.92047 6.91667 9 6.91667H3.16667C2.24619 6.91667 1.5 7.62555 1.5 8.5V14.0417C1.5 14.9161 2.24619 15.625 3.16667 15.625Z"
      stroke="#65CB63"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
