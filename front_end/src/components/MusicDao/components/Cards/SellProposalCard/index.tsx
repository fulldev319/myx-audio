import React, { useState, useEffect, useMemo } from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import SellProposalVoteModal from 'components/MusicDao/modals/SellProposalVoteModal';
import SellProposalDetailsModal from 'components/MusicDao/modals/SellProposalDetailsModal';
import TransactionProgressModal from 'components/MusicDao/modals/TransactionProgressModal';

import Box from 'shared/ui-kit/Box';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import { Color, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import Avatar from 'shared/ui-kit/Avatar';
import { BlockchainNets } from 'shared/constants/constants';
import getPhotoIPFS from 'shared/functions/getPhotoIPFS';
import { switchNetwork } from 'shared/functions/metamask';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { toNDecimals } from 'shared/functions/web3';
import {
  musicDaoListingOnOpensea,
  musicDaoExecuteSellProposal,
  musicDaoClaimSellProposal,
  musicDaoClaimFundOnOpensea
} from 'shared/services/API';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';
import { processImage } from 'shared/helpers';

import { useStyles } from './index.styles';

const REQUIRED = 0.51;

const MARKET_TYPE = {
  MYX: 0,
  OPENSEA: 1
};

export default function SellProposalCard({
  proposal,
  pod,
  podInfo,
  totalStaked,
  handleRefresh
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const classes = useStyles();

  const [openSellProposalVoteModal, setOpenSellProposalVoteModal] =
    useState<boolean>(false);
  const [openSellProposalDetailsModal, setOpenSellProposalDetailsModal] =
    useState<boolean>(false);

  const [endingTime, setEndingTime] = useState<any>();

  const { downloadWithNonDecryption } = useIPFS();
  const [ipfsImage, setIpfsImage] = useState<string>();

  const { showAlertMessage } = useAlertMessage();

  const { account, library, chainId } = useWeb3React();
  const [hash, setHash] = useState<string>('');
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [openTransactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  const { maxPrioFee } = useMaxPrioFee();

  const handleOpenScan = () => {
    const selectedChain = BlockchainNets.find(
      (net) => net.value === pod.blockchainNetwork
    );
    window.open(`${selectedChain.scan.url}/tx/${proposal.hash}`, '_blank');
  };

  useEffect(() => {
    if (!proposal || !proposal.media) return;

    (async () => {
      const image = await getPhotoIPFS(
        proposal.media.metadataPhoto.newFileCID,
        proposal.media.metadataPhoto.metadata.properties.name,
        downloadWithNonDecryption
      );
      setIpfsImage(image);
    })();
  }, [proposal]);

  useEffect(() => {
    if (!proposal || !proposal.expireAt) return;
    const timerId = setInterval(() => {
      let delta = Math.floor(proposal.expireAt - Date.now() / 1000);

      if (delta < 0) {
        setEndingTime({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        clearInterval(timerId);
      } else {
        let days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        let hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        let seconds = delta % 60;

        setEndingTime({
          days,
          hours,
          minutes,
          seconds
        });
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [proposal]);

  const handleExecuteProposal = async () => {
    setOpenTransactionModal(true);

    const targetChain = BlockchainNets.find(
      (net) => net.value === 'Polygon blockchain'
    );
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0x89);
      if (!isHere) {
        showAlertMessage('Got failed while switching over to target network', {
          variant: 'error'
        });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3Config = targetChain.config;
    const web3 = new Web3(library.provider);

    let calldata;
    let stableDecimals;
    if (proposal.marketType === MARKET_TYPE.MYX) {
      stableDecimals = await web3APIHandler.Erc20['USDT'].decimals(web3);
      calldata = web3.eth.abi.encodeFunctionCall(
        {
          name: 'approveSale',
          type: 'function',
          inputs: [
            {
              type: 'uint256',
              name: 'tokenId'
            },
            {
              type: 'uint256',
              name: 'price'
            },
            {
              type: 'address',
              name: 'paymentToken'
            }
          ]
        },
        [
          proposal.mediaId,
          toNDecimals(proposal.amount, stableDecimals),
          web3Config.TOKEN_ADDRESSES.USDT
        ]
      );
    } else if (proposal.marketType === MARKET_TYPE.OPENSEA) {
      stableDecimals = await web3APIHandler.Erc20['WETH'].decimals(web3);
      calldata = web3.eth.abi.encodeFunctionCall(
        {
          name: 'sellWithPrivateNetwork',
          type: 'function',
          inputs: [
            {
              type: 'uint256',
              name: 'tokenId'
            },
            {
              type: 'uint256',
              name: 'price'
            },
            {
              type: 'address',
              name: 'paymentToken'
            },
            {
              type: 'address',
              name: 'secretWallet'
            }
          ]
        },
        [
          proposal.mediaId,
          toNDecimals(proposal.amount, stableDecimals),
          web3Config.TOKEN_ADDRESSES.WETH,
          proposal.walletAddress
        ]
      );
    }

    const response = await web3APIHandler.StakingGovernance.execute(
      web3,
      account!,
      {
        contractAddress: podInfo.stakingGovernance,
        targets: [podInfo.distributionManagerAddress],
        values: [0],
        calldatas: [calldata],
        description: await web3.utils.keccak256(
          'Proposal #1: Make this token sellable'
        )
      },
      setHash,
      maxPrioFee
    );

    if (response.success) {
      setTransactionSuccess(true);

      await musicDaoExecuteSellProposal({
        podId: pod.Id,
        proposalId: proposal.proposalId,
        listingInfo: {
          Beneficiary: response.data.fromSeller,
          Collection: response.data.collection,
          PaymentToken: response.data.paymentToken,
          Price: response.data.price
        }
      });
      handleRefresh();

      if (proposal.marketType === MARKET_TYPE.OPENSEA) {
        await musicDaoListingOnOpensea({
          data: {
            env: 'testnet',
            collection_address: podInfo.nftContract.toLowerCase(),
            token_id: proposal.mediaId,
            price: +toNDecimals(proposal.amount, stableDecimals),
            wallet_address: proposal.walletAddress,
            decimals_of_token: +stableDecimals,
            lock_time: 30000
          }
        });
      }
    } else {
      setTransactionSuccess(false);
      showAlertMessage('Failed to execute proposal', { variant: 'error' });
    }
  };

  const handleClaimFund = async () => {
    if (
      !(
        proposal.marketType === MARKET_TYPE.OPENSEA &&
        proposal.executed &&
        !proposal.claimed
      )
    )
      return;

    await musicDaoClaimSellProposal({
      podId: pod.Id,
      proposalId: proposal.proposalId
    });

    handleRefresh();

    await musicDaoClaimFundOnOpensea({
      data: {
        wallet_address: proposal.walletAddress
      }
    });
  };

  const handleSell = async () => {};

  const creatorName = (artists) => {
    if (artists) {
      let result = artists.main[0] ? artists.main[0].name : '';
      if (artists.featured?.length) {
        result = result ? result + ' ft ' : '';
        artists.featured.map((v, i) => {
          if (i < artists.featured.length - 1) result += v.name + ', ';
          else {
            result += v.name;
          }
        });
      }

      return result;
    }

    return '';
  };

  const yesPercentage = useMemo(() => {
    if (
      !proposal ||
      !proposal.voteStates ||
      !proposal.voteStates.forVotes ||
      !proposal.totalSupply
    )
      return 0;
    return (
      Math.min(
        +proposal.voteStates.forVotes / proposal.totalSupply / REQUIRED,
        1
      ) * 100
    );
  }, [proposal]);

  const noPercentage = useMemo(() => {
    if (
      !proposal ||
      !proposal.voteStates ||
      !proposal.voteStates.againstVotes ||
      !proposal.totalSupply
    )
      return 0;
    return (
      Math.min(
        +proposal.voteStates.againstVotes / proposal.totalSupply / REQUIRED,
        1
      ) * 100
    );
  }, [proposal]);

  return (
    <Box className={classes.root}>
      <Box
        className={classes.flexBox}
        style={{ borderBottom: '1px dashed #18181822' }}
        pb={2}
      >
        {isMobile && (
          <Box display="flex" alignItems="center" mb={2}>
            <Box mr={1}>
              {proposal.status === 'success' ? (
                <Box
                  display="flex"
                  alignItems="center"
                  style={{
                    color: Color.MusicDAOGreen,
                    fontSize: 14,
                    lineHeight: '15px'
                  }}
                >
                  Accepted&nbsp;
                  <img src={require('assets/musicDAOImages/accepted.webp')} />
                </Box>
              ) : proposal.status === 'failed' ? (
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ color: Color.Red, fontSize: 14, lineHeight: '15px' }}
                >
                  Declined&nbsp;
                  <img src={require('assets/musicDAOImages/declined.webp')} />
                </Box>
              ) : (
                endingTime && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="end"
                    mt={isMobile ? 2 : undefined}
                  >
                    <Box style={{ color: Color.MusicDAOLightBlue }}>
                      Proposal Expires in
                    </Box>
                    <Box style={{ color: Color.MusicDAODark }}>
                      <strong>
                        {endingTime.days > 0 && (
                          <span>
                            {String(endingTime.days).padStart(2, '0')}days
                          </span>
                        )}
                        &nbsp;
                        {endingTime.hours > 0 && (
                          <span>
                            {String(endingTime.hours).padStart(2, '0')}h
                          </span>
                        )}
                        &nbsp;
                        {endingTime.minutes > 0 && (
                          <span>
                            {String(endingTime.minutes).padStart(2, '0')}m
                          </span>
                        )}
                        &nbsp;
                        <span>
                          {String(endingTime.seconds).padStart(2, '0')}s
                        </span>
                      </strong>
                    </Box>
                  </Box>
                )
              )}
            </Box>
          </Box>
        )}
        <Box className={classes.buttons}>
          <PrimaryButton
            size="small"
            style={{
              background:
                proposal.status === 'success'
                  ? Color.MusicDAOGreen
                  : proposal.status === 'failed'
                  ? Color.Red
                  : Color.MusicDAOLightBlue
            }}
          >
            Selling Proposal <b>ID #{proposal.proposalId.substr(0, 6)}</b>
          </PrimaryButton>
          <PrimaryButton
            size="small"
            style={{ background: '#EFF2F8' }}
            onClick={handleOpenScan}
          >
            <Box display="flex" alignItems="center">
              <img src={require('assets/icons/polygon_gray.svg')} />
            </Box>
          </PrimaryButton>
        </Box>
        {!isMobile && (
          <Box display="flex" alignItems="center">
            <Box
              mr={1}
              style={{ height: '42px' }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              {proposal.status === 'success' ? (
                <Box
                  display="flex"
                  alignItems="center"
                  style={{
                    color: Color.MusicDAOGreen,
                    fontSize: 14,
                    lineHeight: '15px'
                  }}
                >
                  Accepted&nbsp;
                  <img src={require('assets/musicDAOImages/accepted.webp')} />
                </Box>
              ) : proposal.status === 'failed' ? (
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ color: Color.Red, fontSize: 14, lineHeight: '15px' }}
                >
                  Declined&nbsp;
                  <img src={require('assets/musicDAOImages/declined.webp')} />
                </Box>
              ) : (
                endingTime && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="end"
                    mt={isMobile ? 2 : undefined}
                  >
                    <Box style={{ color: Color.MusicDAOLightBlue }}>
                      Proposal Expires in
                    </Box>
                    <Box style={{ color: Color.MusicDAODark }}>
                      <strong>
                        {endingTime.days > 0 && (
                          <span>
                            {String(endingTime.days).padStart(2, '0')}days
                          </span>
                        )}
                        &nbsp;
                        {endingTime.hours > 0 && (
                          <span>
                            {String(endingTime.hours).padStart(2, '0')}h
                          </span>
                        )}
                        &nbsp;
                        {endingTime.minutes > 0 && (
                          <span>
                            {String(endingTime.minutes).padStart(2, '0')}m
                          </span>
                        )}
                        &nbsp;
                        <span>
                          {String(endingTime.seconds).padStart(2, '0')}s
                        </span>
                      </strong>
                    </Box>
                  </Box>
                )
              )}
            </Box>
          </Box>
        )}
      </Box>
      <Box
        className={classes.flexBox}
        style={{ borderBottom: '1px dashed #18181822' }}
        py={2}
      >
        <Box display="flex">
          <Avatar
            size={34}
            rounded
            bordered
            image={
              processImage(proposal.proposerInfo?.imageUrl) ??
              require('assets/anonAvatars/ToyFaces_Colored_BG_001.webp')
            }
          />
          <Box ml={1}>
            {proposal.proposerInfo && (
              <>
                <Box className={classes.header2}>
                  {proposal.proposerInfo.name || ''}
                </Box>
                <Box className={classes.header3}>
                  {proposal.proposerInfo.address.substr(0, 6) +
                    '...' +
                    proposal.proposerInfo.address.substr(-4)}
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
      <Box
        className={classes.flexBox}
        style={{ borderBottom: '1px dashed #18181822' }}
        py={2}
      >
        <Box display="flex" alignItems="center">
          <img
            src={ipfsImage || require('assets/musicDAOImages/no_image.webp')}
            style={{ borderRadius: 12, width: 66, height: 64 }}
          />
          <Box
            ml={2}
            style={{ height: '71px' }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            {proposal.media && (
              <>
                <Box className={classes.header2}>
                  {proposal.media.Title || ''}
                </Box>
                <Box>
                  {creatorName(proposal.media.Artists)} |{' '}
                  {proposal.media.AlbumName}
                </Box>
                {proposal.media.IsStreaming && (
                  <Box
                    className={classes.streamingBadge}
                    display="flex"
                    alignItems="center"
                  >
                    <img
                      src={require('assets/icons/streaming.svg')}
                      width={16}
                    />
                    &nbsp;&nbsp;STREAMING
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
      <Box style={{ borderBottom: '1px dashed #18181822' }} py={2}>
        <Box mb={2} style={{ color: '#7E7D95' }}>
          <strong>Quorum Reached</strong>
        </Box>
        <Box display="flex" width="100%">
          <Box flex={1}>
            <Box
              height="35px"
              width="90%"
              bgcolor="#DAE6E5"
              borderRadius={32}
              fontSize={14}
              fontWeight={600}
              position="relative"
            >
              <Box
                height="35px"
                width={`${yesPercentage}%`}
                color="#fff"
                bgcolor={yesPercentage !== 0 ? '#65CB63' : 'transparent'}
                borderRadius={32}
                pt={'8px'}
                pl={3}
              >
                Yes
              </Box>
              <Box position="absolute" right={8} top={8}>
                {Math.floor(proposal?.voteStates?.forVotes || 0)}{' '}
                {pod.TokenSymbol}
              </Box>
            </Box>
          </Box>
          <Box flex={1}>
            <Box
              height="35px"
              width="90%"
              bgcolor="#DAE6E5"
              borderRadius={32}
              fontSize={14}
              fontWeight={600}
              position="relative"
            >
              <Box
                height="35px"
                width={`${noPercentage}%`}
                color="#fff"
                bgcolor={noPercentage !== 0 ? '#F74484' : 'transparent'}
                borderRadius={32}
                pt={'8px'}
                pl={3}
              >
                No
              </Box>
              <Box position="absolute" right={8} top={8}>
                {Math.floor(proposal?.voteStates?.againstVotes || 0)}{' '}
                {pod.TokenSymbol}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        style={{ borderBottom: '1px dashed #18181822' }}
        py={2}
      >
        <PrimaryButton
          style={{
            background: 'transparent',
            border: '1px solid rgba(84, 101, 143, 0.3)'
          }}
          onClick={handleSell}
          size="medium"
        >
          <Box display="flex" alignItems="center">
            <img src={require('assets/logos/music.webp')} width={32} />
            <span style={{ color: '#7E7D95', marginLeft: '4px' }}>
              Sell on&nbsp;
            </span>
            <span style={{ color: Color.MusicDAODark }}>
              <strong>Myx Marketplace</strong>
            </span>
          </Box>
        </PrimaryButton>
        <Box display="flex" flexDirection="column" alignItems="center">
          <div style={{ color: Color.MusicDAOGreen }}>Selling Price</div>
          <div className={classes.text2}>{proposal.amount} USDT</div>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mt={2}>
        {proposal.status === 'success' && !proposal.executed ? (
          <SecondaryButton
            size="medium"
            isRounded
            style={{
              backgroundColor: Color.MusicDAOGreen,
              border: 'transparent',
              color: 'white'
            }}
            onClick={handleExecuteProposal}
          >
            Execute
          </SecondaryButton>
        ) : (
          // ) : proposal.status === "success" && proposal.executed && !proposal.claimed ? (
          //   <SecondaryButton
          //     size="medium"
          //     isRounded
          //     style={{ backgroundColor: Color.MusicDAOGreen, border: "transparent", color: "white" }}
          //     onClick={handleClaimFund}
          //   >
          //     Claim
          //   </SecondaryButton>
          <div></div>
        )}
        <SecondaryButton
          size="medium"
          isRounded
          className={classes.detailsVotingButton}
          onClick={() => {
            setOpenSellProposalDetailsModal(true);
          }}
        >
          DETAILS & VOTING
        </SecondaryButton>
      </Box>
      <SellProposalVoteModal
        proposal={proposal}
        pod={pod}
        podInfo={podInfo}
        votes={proposal?.voteStates || {}}
        totalSupply={proposal.totalSupply}
        totalStaked={totalStaked}
        open={openSellProposalVoteModal}
        handleClose={() => setOpenSellProposalVoteModal(false)}
        handleRefresh={() => handleRefresh()}
      />
      <SellProposalDetailsModal
        proposal={proposal}
        pod={pod}
        open={openSellProposalDetailsModal}
        openVote={() => setOpenSellProposalVoteModal(true)}
        handleClose={() => setOpenSellProposalDetailsModal(false)}
      />
      {openTransactionModal && (
        <TransactionProgressModal
          open={openTransactionModal}
          onClose={() => {
            setHash('');
            setTransactionSuccess(null);
            setOpenTransactionModal(false);
          }}
          txSuccess={transactionSuccess}
          hash={hash}
        />
      )}
    </Box>
  );
}
