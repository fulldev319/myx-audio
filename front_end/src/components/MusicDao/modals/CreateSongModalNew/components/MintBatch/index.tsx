import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MintEditionStepType } from '../..';
import { BlockchainNets } from 'shared/constants/constants';
import { PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';

import { mintBatchStyles } from './index.styles';

type Props = {
  isStreaming?: boolean;
  onMintMaster?: () => void;
  onMintEditions?: (id: number) => void;
  mintedMaster?: boolean;
  masterHash?: any;
  mintedEditionSteps?: MintEditionStepType[];
};

export default function MintBatch({
  isStreaming,
  onMintMaster,
  onMintEditions,
  mintedMaster,
  masterHash,
  mintedEditionSteps
}: Props) {
  const classes = mintBatchStyles();

  const [hashMaster, setHashMaster] = useState<string>(masterHash);

  useEffect(() => {
    setHashMaster(masterHash);
  }, [masterHash]);

  const nftType = useMemo(
    () => (isStreaming ? 'Streaming' : 'Master'),
    [isStreaming]
  );

  const handleOpenScan = useCallback((batch) => {
    if (!batch.hash) return;

    const selectedChain = BlockchainNets.find(
      (net) => net.value === 'Polygon blockchain'
    );
    window.open(`${selectedChain.scan.url}/tx/${batch.hash}`, '_blank');
  }, []);

  const handleOpenScanMaster = useCallback((hash) => {
    if (!hash || hash.length === 0) return;

    const selectedChain = BlockchainNets.find(
      (net) => net.value === 'Polygon blockchain'
    );
    window.open(`${selectedChain.scan.url}/tx/${hash}`, '_blank');
  }, []);

  return (
    <Box mt={3}>
      <Box mb={1} className={classes.stepTitle}>
        <label>Step 1:</label>
        <div>Mint your {nftType} NFT First</div>
      </Box>
      <div
        className={`${classes.stepSection1} ${
          mintedMaster ? classes.mintedBG : ''
        }`}
        style={{ border: mintedMaster ? 'none' : '1px solid #65CB63' }}
      >
        <span>{nftType} NFT</span>
        {mintedMaster ? (
          <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }}>
            <span>Minted</span>
            <div style={{ display: 'flex', margin: '0 10px' }}>
              <CheckIcon />
            </div>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => handleOpenScanMaster(hashMaster)}
            >
              <ChainIcon />
            </span>
          </div>
        ) : (
          <PrimaryButton
            size="medium"
            isRounded
            style={{
              background: '#2D3047',
              height: 36,
              fontSize: 14
            }}
            onClick={onMintMaster}
          >
            Mint
          </PrimaryButton>
        )}
      </div>

      <Box mb={1} className={classes.stepTitle}>
        <label>Step 2:</label>
        <div>Mint batches of your multiple editions</div>
      </Box>
      <Box style={{ height: 300, overflowY: 'scroll' }}>
        {mintedEditionSteps &&
          mintedEditionSteps.map((batch, index) => (
            <div
              key={`song-batch-${batch.id}`}
              className={`${classes.stepSection2} ${
                batch.status === 2
                  ? classes.mintedBG
                  : batch.status === 3
                  ? classes.failedBG
                  : ''
              }`}
              style={{
                opacity: batch.status === 0 ? 0.4 : 1,
                border:
                  batch.status === 2 || batch.status === 3
                    ? 'none'
                    : '1px solid #65CB63'
              }}
            >
              <span>{batch.name}</span>
              {batch.status === 2 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#fff'
                  }}
                >
                  <span>Minted</span>
                  <div style={{ display: 'flex', margin: '0 10px' }}>
                    <CheckIcon />
                  </div>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenScan(batch)}
                  >
                    <ChainIcon />
                  </span>
                </div>
              ) : batch.status === 3 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#F43E5F'
                  }}
                >
                  <span>Failed</span>
                  <div style={{ display: 'flex', margin: '0 10px' }}>
                    <FailedIcon />
                  </div>
                  <PrimaryButton
                    size="medium"
                    isRounded
                    style={{
                      background: '#2D3047',
                      // color: #fff,
                      height: 34,
                      fontSize: 14
                    }}
                  >
                    Mint Again
                  </PrimaryButton>
                </div>
              ) : (
                <PrimaryButton
                  size="medium"
                  disabled={batch.status === 0}
                  isRounded
                  style={{
                    background: '#65CB63',
                    height: 34
                  }}
                  onClick={() => {
                    onMintEditions && onMintEditions(index);
                  }}
                >
                  Mint
                </PrimaryButton>
              )}
            </div>
          ))}
      </Box>
    </Box>
  );
}

const CheckIcon = () => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="34" height="34" rx="17" fill="white" />
    <path
      d="M22.002 13.5L15.002 20.5L12.002 17.5"
      stroke="#65CB63"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ChainIcon = () => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.0985 14.3059C20.9448 14.2194 20.7718 14.1739 20.5958 14.1739C20.4198 14.1739 20.2467 14.2194 20.0931 14.3059L17.7865 15.6549L16.2193 16.5347L13.9128 17.8837C13.7591 17.9702 13.5861 18.0156 13.4101 18.0156C13.2341 18.0156 13.0611 17.9702 12.9074 17.8837L11.0739 16.828C10.9248 16.7417 10.8002 16.6181 10.7122 16.4692C10.6242 16.3202 10.5758 16.1509 10.5716 15.9775V13.8954C10.5695 13.7207 10.6153 13.5489 10.704 13.3988C10.7926 13.2487 10.9207 13.1263 11.0739 13.0449L12.8778 12.0185C13.0315 11.932 13.2045 11.8866 13.3805 11.8866C13.5565 11.8866 13.7295 11.932 13.8832 12.0185L15.687 13.0449C15.8362 13.1312 15.9608 13.2547 16.0488 13.4037C16.1368 13.5527 16.1852 13.722 16.1894 13.8954V15.2444L17.7566 14.3353V12.9863C17.7587 12.8116 17.7129 12.6398 17.6242 12.4897C17.5356 12.3396 17.4075 12.2172 17.2543 12.1358L13.9128 10.2004C13.7591 10.1139 13.5861 10.0685 13.4101 10.0685C13.2341 10.0685 13.0611 10.1139 12.9074 10.2004L9.50633 12.1359C9.35306 12.2173 9.22505 12.3397 9.1364 12.4898C9.04776 12.6398 9.00193 12.8116 9.00397 12.9863V16.8866C9.00191 17.0613 9.04772 17.2331 9.13637 17.3832C9.22501 17.5333 9.35304 17.6557 9.50633 17.7371L12.907 19.6726C13.0607 19.7591 13.2337 19.8045 13.4097 19.8045C13.5857 19.8045 13.7587 19.7591 13.9124 19.6726L16.2189 18.3529L17.7861 17.4438L20.0927 16.1242C20.2463 16.0376 20.4194 15.9921 20.5954 15.9921C20.7714 15.9921 20.9444 16.0376 21.0981 16.1242L22.9019 17.1506C23.0511 17.2368 23.1757 17.3604 23.2637 17.5094C23.3517 17.6584 23.4001 17.8277 23.4043 18.001V20.0832C23.4064 20.2578 23.3605 20.4297 23.2719 20.5798C23.1833 20.7298 23.0552 20.8523 22.9019 20.9336L21.0981 21.9894C20.9444 22.0759 20.7714 22.1213 20.5954 22.1213C20.4194 22.1213 20.2464 22.0759 20.0927 21.9894L18.2888 20.963C18.1397 20.8767 18.0151 20.7531 17.9271 20.6042C17.8391 20.4552 17.7907 20.2859 17.7865 20.1125V18.7634L16.2193 19.6725V21.0215C16.2172 21.1962 16.263 21.368 16.3517 21.5181C16.4403 21.6681 16.5683 21.7906 16.7216 21.872L20.1223 23.8075C20.276 23.894 20.449 23.9394 20.625 23.9394C20.801 23.9394 20.974 23.894 21.1277 23.8075L24.5284 21.872C24.6775 21.7857 24.8021 21.6621 24.8901 21.5131C24.9781 21.3642 25.0266 21.1948 25.0307 21.0215V17.1212C25.0328 16.9466 24.987 16.7747 24.8983 16.6247C24.8097 16.4746 24.6817 16.3521 24.5284 16.2708L21.0985 14.3059Z"
      fill="white"
    />
    <rect
      x="0.75"
      y="0.75"
      width="32.5"
      height="32.5"
      rx="16.25"
      stroke="white"
      strokeWidth="1.5"
    />
  </svg>
);

const FailedIcon = () => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="34" height="34" rx="17" fill="white" />
    <path
      d="M12.0039 21.998L21.9995 12.002M12.0041 12.0022L22 21.9979"
      stroke="#F43E5F"
      strokeWidth="1.66602"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
