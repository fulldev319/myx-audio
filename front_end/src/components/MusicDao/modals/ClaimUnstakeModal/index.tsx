import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Color, Modal, Paragraph, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';

import { useClaimUnstakeModalStyles } from './index.styles';

require('dotenv').config();
const isProd = process.env.REACT_APP_ENV === 'prod';

export const ClaimUnstakeModal = (props: any) => {
  const { open, handleClose, handleRefresh, network } = props;
  const classes = useClaimUnstakeModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const [step, setStep] = useState<number>(0);

  const [hash, setHash] = useState<string>(
    '0xf273a38fec99acf1eadfasdf8asdf9a8udaq9fd89adfeba'
  );
  const [result, setResult] = useState<boolean | undefined>(undefined);

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

  const mainScreen = () => (
    <Box py={3}>
      <Box className={classes.h2}>Unstake</Box>
      <Paragraph
        className={classes.h5}
        style={{ color: '#54658F', paddingBottom: 24 }}
      >
        In order to unstake your funds input the amount you wuld like to unstake
        in the input below.
      </Paragraph>
      <Box mb={3}>
        <Box mb={1} textAlign="start">
          Amount
        </Box>
        <Box className={classes.amountBox}>
          <img
            src={require('assets/tokenImages/MUSIC1.webp')}
            style={{ width: 38, marginRight: 8 }}
          />
          <input
            type="text"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              height: 32,
              color: '#2D3047',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          />
          <Box ml={1}>Media Fractions</Box>
        </Box>
      </Box>
      <Box p={4} className={classes.greenBox}>
        <Box mb={1} className={classes.h3} color="#65CB63">
          Amount to unstake
        </Box>
        <Box
          className={classes.h1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <span>2425&nbsp;</span>
          <span style={{ opacity: 0.5 }}>Media Fractions</span>
        </Box>
      </Box>
      <Box mt={4} className={classes.buttons}>
        <PrimaryButton
          className={classes.h4}
          size="medium"
          isRounded
          onClick={() => {
            handleClose();
          }}
          style={{
            background: 'none',
            color: '#2D3047',
            border: '1px solid #2D3047'
          }}
        >
          Cancel
        </PrimaryButton>
        <Box width={24} />
        <PrimaryButton
          className={classes.h4}
          size="medium"
          isRounded
          onClick={() => {
            setStep(1);
          }}
          style={{
            background: '#2D3047',
            color: '#fff'
          }}
        >
          Unstake
        </PrimaryButton>
      </Box>
    </Box>
  );

  const resultScreen = () => (
    <Box py={1}>
      {result === true ? (
        <img src={require('assets/musicDAOImages/result_success.webp')} />
      ) : result === false ? (
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
        {result === true
          ? 'Succesfully Claimed Your Revenue '
          : result === false
          ? 'Claiming Your Revenue Failed'
          : 'Transaction in progress'}
      </Box>
      <Box className={classes.h5} mt={1} mb={2} color="#54658F">
        {result === true
          ? 'Everything went well. You can check your transaction link below.'
          : result === false
          ? 'Unfortunately the transaction failed to go through on the blockchain, please try again later. You can check your transaction link for more details.'
          : ` Transaction is proceeding on ${
              network && isEth ? 'Ethereum' : 'Polygon'
            } blockchain. \n This can take a moment, please be patient...`}
      </Box>
      {hash && (
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
              {hash.substr(0, 18) + '...' + hash.substr(hash.length - 3, 3)}
            </Box>
            <CopyToClipboard
              text={hash}
              onCopy={() => {
                showAlertMessage('Copied to clipboard', { variant: 'success' });
              }}
            >
              <CopyIcon />
            </CopyToClipboard>
          </Box>
        </>
      )}
      {result !== undefined && (
        <Box display="flex" justifyContent="center">
          <PrimaryButton
            className={classes.h4}
            size="medium"
            isRounded
            style={{
              marginTop: '24px',
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 24px'
            }}
          >
            {result === true ? (
              <>
                <Box>Add POD Token to Metamask&nbsp;&nbsp;&nbsp;+&nbsp;</Box>
                <img
                  src={require('assets/walletImages/metamask.svg')}
                  width={16}
                  height={16}
                />
              </>
            ) : (
              <>Close</>
            )}
          </PrimaryButton>
        </Box>
      )}
    </Box>
  );

  return (
    <Modal
      size="small"
      isOpen={open}
      onClose={handleClose}
      showCloseIcon
      className={classes.root}
    >
      {step === 0 ? mainScreen() : resultScreen()}
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
