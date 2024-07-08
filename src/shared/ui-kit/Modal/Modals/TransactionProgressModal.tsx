import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import CircularProgress from '@material-ui/core/CircularProgress';

import Box from 'shared/ui-kit/Box';
import { Modal } from 'shared/ui-kit';
import { useTransactionProgressModalStyles } from './TransactionProgressModal.styles';

require('dotenv').config();
const isProd = process.env.REACT_APP_ENV === 'prod';

export default function TransactionProgressModal({
  open,
  onClose,
  transactionInProgress,
  transactionSuccess,
  hash,
  network
}: {
  open: boolean;
  onClose: () => void;
  transactionInProgress: boolean;
  transactionSuccess: boolean | null;
  hash?: string;
  network: string;
}) {
  const classes = useTransactionProgressModalStyles();
  const [url, setUrl] = useState<string>('');
  //   const url = `${isDev ? "https://ropsten.etherscan.io/tx/" : "https://bscscan.com/tx/"}${hash}`;

  useEffect(() => {
    if (!hash) return;
    if (network === 'bsc') {
      setUrl(
        `${
          isProd
            ? 'https://bscscan.com/tx/'
            : 'https://ropsten.etherscan.io/tx/'
        }${hash}`
      );
    } else if (network.replace(' Chain', '').toLowerCase() === 'polygon') {
      setUrl(
        `${
          isProd
            ? 'https://polygonscan.com/tx/'
            : 'https://mumbai.polygonscan.com/tx/'
        }${hash}`
      );
    } else if (network.replace(' Chain', '').toLowerCase() === 'ethereum') {
      setUrl(
        `${
          isProd
            ? 'https://etherscan.io/tx/'
            : 'https://rinkeby.etherscan.io/tx/'
        }${hash}`
      );
    }
  }, [network, hash]);

  const handleCheck = () => {
    window.open(url, '_blank');
  };

  return (
    <Modal
      showCloseIcon
      isOpen={open}
      onClose={onClose}
      className={classes.root}
      size="medium"
    >
      <div className={classes.iconContainer}>
        {transactionInProgress ? (
          <CircularProgress
            style={{ color: '#4218B5', width: '138px', height: '138px' }}
          />
        ) : transactionSuccess === false ? (
          <FailIcon />
        ) : transactionSuccess === true ? (
          <SuccessIcon />
        ) : null}
      </div>

      <div className={classes.title}>
        {transactionInProgress
          ? 'Transaction in progress'
          : transactionSuccess === false
          ? 'Transaction Failed'
          : transactionSuccess === true
          ? 'Transaction Succeed'
          : null}
      </div>

      <Box>
        {transactionInProgress
          ? `Transaction is proceeding on ${network
              .replace(' blockchain', '')
              .toUpperCase()} Mainnet.
                This can take a moment, please be patient and do not close this window`
          : transactionSuccess === false
          ? 'Unfortunately there was an error during the transaction. Please try again later.'
          : transactionSuccess === true
          ? ``
          : null}
      </Box>
      {hash && (
        <CopyToClipboard text={hash}>
          <Box
            mt="20px"
            display="flex"
            alignItems="center"
            className={classes.hash}
          >
            Hash:
            <Box color="#4218B5" mr={1} ml={1}>
              {hash.substr(0, 18) + '...' + hash.substr(hash.length - 3, 3)}
            </Box>
            <CopyIcon />
          </Box>
        </CopyToClipboard>
      )}

      {hash && (
        <button className={classes.buttonCheck} onClick={handleCheck}>
          Check on {network.toUpperCase()} Scan
        </button>
      )}

      {!transactionInProgress && (
        <button className={classes.button} onClick={onClose}>
          Done
        </button>
      )}
    </Modal>
  );
}

export const FailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="78"
    height="78"
    viewBox="0 0 78 78"
    fill="none"
  >
    <circle opacity="0.2" cx="39" cy="38.9766" r="38.5" fill="#F43E5F" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.1731 28.3697L28.8287 26.7141C29.187 26.3557 29.7686 26.3557 30.0819 26.7141L39.436 36.0243L48.7462 26.7141C49.1045 26.3557 49.6861 26.3557 50.0444 26.7141L51.7001 28.3697C52.0584 28.7281 52.0584 29.3096 51.7001 29.6229L42.346 38.977L51.7001 48.2872C52.0584 48.6455 52.0584 49.2271 51.7001 49.5854L50.0444 51.2411C49.6861 51.5994 49.1045 51.5994 48.7462 51.2411L39.436 41.887L30.0819 51.2411C29.7686 51.5994 29.187 51.5994 28.8287 51.2411L27.1731 49.5854C26.8147 49.2271 26.8147 48.6455 27.1731 48.2872L36.4832 38.977L27.1731 29.6229C26.8147 29.3096 26.8147 28.7281 27.1731 28.3697Z"
      fill="#F43E5F"
    />
  </svg>
);

export const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="78"
    height="78"
    viewBox="0 0 78 78"
    fill="none"
  >
    <circle opacity="0.2" cx="38.665" cy="39.3438" r="38.5" fill="#65CB63" />
    <path
      d="M24.8711 39.3125L34.0879 48.5293L52.459 30.1582"
      stroke="#65CB63"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="none"
  >
    <path
      d="M13.5833 9.86458H14.8333C15.7538 9.86458 16.5 9.1557 16.5 8.28125V2.73958C16.5 1.86513 15.7538 1.15625 14.8333 1.15625H9C8.07953 1.15625 7.33333 1.86513 7.33333 2.73958V3.92708M3.16667 15.4063H9C9.92047 15.4063 10.6667 14.6974 10.6667 13.8229V8.28125C10.6667 7.4068 9.92047 6.69792 9 6.69792H3.16667C2.24619 6.69792 1.5 7.4068 1.5 8.28125V13.8229C1.5 14.6974 2.24619 15.4063 3.16667 15.4063Z"
      stroke="#4218B5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
