import React, { useEffect, useState } from 'react';

import Box from 'shared/ui-kit/Box';
import { Color, Modal, PrimaryButton } from 'shared/ui-kit';
import { useTransactionProgressModalStyles } from './index.styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { useWeb3React } from '@web3-react/core';
import { BlockchainNets } from 'shared/constants/constants';
import { capitalize } from 'shared/helpers';

require('dotenv').config();
const isProd = process.env.REACT_APP_ENV === 'prod';

export default function TransactionProgressModal({
  open,
  onClose,
  txSuccess,
  hash,
  network
}: {
  open: boolean;
  onClose: () => void;
  txSuccess: boolean | null;
  hash: string;
  network?: string;
}) {
  const classes = useTransactionProgressModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const isEth = (network || '').toLowerCase().includes('ethereum');
  const isPolygon = (network || '').toLowerCase().includes('polygon');

  const handleOpenTx = () => {
    if (network) {
      if (isPolygon) {
        window.open(
          `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/tx/${hash}`,
          '_blank'
        );
      } else if (isEth) {
        window.open(
          `https://${!isProd ? 'rinkeby.' : ''}etherscan.io/tx/${hash}`,
          '_blank'
        );
      }
    } else {
      window.open(
        `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/tx/${hash}`,
        '_blank'
      );
    }
  };

  const { chainId } = useWeb3React();

  return (
    <Modal
      showCloseIcon
      isOpen={open}
      onClose={onClose}
      className={classes.root}
      size="small"
    >
      {txSuccess === true ? (
        <img src={require('assets/musicDAOImages/result_success.webp')} />
      ) : txSuccess === false ? (
        <img src={require('assets/musicDAOImages/result_fail.webp')} />
      ) : (
        <div style={{ position: 'relative' }}>
          <img
            className={classes.loader}
            src={require('assets/musicDAOImages/loading.webp')}
          />
          <div className={classes.ethImg}>
            <img
              src={require(`assets/musicDAOImages/${
                isEth ? 'ethereum' : 'polygon'
              }.webp`)}
              width={50}
              height={50}
            />
          </div>
        </div>
      )}
      <Box className={classes.title} mt={4}>
        {txSuccess === true
          ? 'Transaction successful'
          : txSuccess === false
          ? 'Transaction failed'
          : 'Transaction in progress'}
      </Box>
      <Box className={classes.header1} mt={1} mb={2}>
        {txSuccess === true
          ? 'Everything went well. You can check your transaction link below.'
          : txSuccess === false
          ? 'Unfortunately the transaction failed to go through on the blockchain, please try again later. You can check your transaction link for more details.'
          : ` Transaction is proceeding on ${
              network && isEth ? 'Ethereum' : 'Polygon'
            } blockchain. \n This can take a moment, please be patient...`}
      </Box>
      {hash && (
        <>
          <CopyToClipboard
            text={hash}
            onCopy={() => {
              showAlertMessage('Copied to clipboard', { variant: 'success' });
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              style={{ cursor: 'pointer' }}
            >
              <Box className={classes.header1} mr={2}>
                Hash:
              </Box>
              <Box className={classes.header2} ml={1} mr={1}>
                {hash.substr(0, 18) + '...' + hash.substr(hash.length - 3, 3)}
              </Box>
              <CopyIcon />
            </Box>
          </CopyToClipboard>
          <PrimaryButton
            size="medium"
            style={{ background: Color.MusicDAODeepBlue, marginTop: '24px' }}
            isRounded
            onClick={handleOpenTx}
          >
            Check on {network && isEth ? 'Ethereum' : 'Polygon'} Scan
          </PrimaryButton>
        </>
      )}
    </Modal>
  );
}

const CopyIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.0794 10.0833H14.3294C15.2499 10.0833 15.9961 9.37445 15.9961 8.5V2.95833C15.9961 2.08388 15.2499 1.375 14.3294 1.375H8.49609C7.57562 1.375 6.82943 2.08388 6.82943 2.95833V4.14583M2.66276 15.625H8.49609C9.41657 15.625 10.1628 14.9161 10.1628 14.0417V8.5C10.1628 7.62555 9.41657 6.91667 8.49609 6.91667H2.66276C1.74229 6.91667 0.996094 7.62555 0.996094 8.5V14.0417C0.996094 14.9161 1.74229 15.625 2.66276 15.625Z" stroke="#0D59EE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);
