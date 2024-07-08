import React, { useState, useMemo } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { BlockchainNets } from 'shared/constants/constants';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { switchNetwork } from 'shared/functions/metamask';
import { toDecimals, toNDecimals } from 'shared/functions/web3';

import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import { modalStyles } from './index.styles';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import TransactionProgressModal from '../TransactionProgressModal';
import {
  musicDaoListingOnOpensea,
  musicDaoVoteSellingProposal
} from 'shared/services/API';
import { useTypedSelector } from 'store/reducers/Reducer';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';

const REQUIRED = 0.51;

const MARKET_TYPE = {
  MYX: 0,
  OPENSEA: 1
};

const SellProposalVoteModal = ({
  pod,
  podInfo,
  proposal,
  votes,
  totalSupply,
  totalStaked,
  open,
  handleClose,
  handleRefresh
}) => {
  const classes = modalStyles();
  const { showAlertMessage } = useAlertMessage();
  const user = useTypedSelector((state) => state.user);

  const options = [
    { value: 1, name: 'Yes' },
    {
      value: 0,
      name: 'No'
    },
    {
      value: 2,
      name: 'Abstain'
    }
  ];

  const [vote, setVote] = useState<number>(1);

  const { account, library, chainId } = useWeb3React();
  const [hash, setHash] = useState<string>('');
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [openTransactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  const { maxPrioFee } = useMaxPrioFee();

  const voteDisabled = useMemo(() => {
    if (!user) return true;
    return proposal.votes?.find((item) => item.voter === user.id);
  }, [user, proposal]);

  const handleVote = async () => {
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
    const web3 = new Web3(library.provider);

    const response = await web3APIHandler.StakingGovernance.castVote(
      web3,
      account!,
      {
        contractAddress: podInfo.stakingGovernance,
        proposalId: proposal.proposalId,
        support: vote
      },
      setHash,
      maxPrioFee
    );

    if (response.success) {
      const decimals = await web3APIHandler.Erc20['COPYRIGHT'].decimals(
        web3,
        podInfo.copyrightToken
      );
      const stableDecimals = await web3APIHandler.Erc20[
        proposal.paymentToken
      ].decimals(web3);

      const voteStates = await web3APIHandler.StakingGovernance.proposalVotes(
        web3,
        {
          contractAddress: podInfo.stakingGovernance,
          proposalId: proposal.proposalId
        }
      );

      await musicDaoVoteSellingProposal({
        podId: pod.Id,
        proposalId: proposal.proposalId,
        vote,
        hash: response.data.hash,
        voteStates: {
          abstainVotes: toDecimals(voteStates.abstainVotes, decimals),
          againstVotes: toDecimals(voteStates.againstVotes, decimals),
          forVotes: toDecimals(voteStates.forVotes, decimals)
        },
        additionalData: {
          Collection: podInfo.nftContract,
          Price: toNDecimals(proposal.amount, stableDecimals),
          PaymentToken: proposal.paymentToken,
          Beneficiary: podInfo.distributionManagerAddress
        }
      });

      handleRefresh();
      setTransactionSuccess(true);
    } else {
      setTransactionSuccess(false);
      showAlertMessage('Failed to stake tokens', { variant: 'error' });
    }
  };

  const yesPercentage = useMemo(() => {
    if (!votes || !votes.forVotes || !totalSupply) return 0;
    return Math.min(+votes.forVotes / totalSupply / REQUIRED, 1) * 100;
  }, [votes, totalSupply]);

  const noPercentage = useMemo(() => {
    if (!votes || !votes.againstVotes || !totalSupply) return 0;
    return Math.min(+votes.againstVotes / totalSupply / REQUIRED, 1) * 100;
  }, [votes, totalSupply]);

  return (
    <>
      {openTransactionModal ? (
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
      ) : (
        <Modal
          size="daoMedium"
          isOpen={open}
          onClose={handleClose}
          showCloseIcon
        >
          <div className={classes.content}>
            <div className={classes.typo1}>Voting with Media Fractions</div>
            <Box
              className={classes.typo2}
              pb={7}
              borderBottom="1px solid #00000010"
              mb={5}
            >
              Each media fractions give you oportunity to vote
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-around"
              px={4}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box className={classes.typo2}>Quorum Required</Box>
                <Box className={classes.typo1} mt={0.5}>
                  {(totalSupply * REQUIRED).toFixed(2)} {pod.TokenSymbol}
                </Box>
              </Box>
              <Box width={'1px'} height={'50px'} bgcolor="#18181810" />
              <Box display="flex" flexDirection="column">
                <Box className={classes.typo2}>Quorum Reached</Box>
                <Box className={classes.typo1} mt={0.5}>
                  {proposal?.voteStates?.forVotes || 0} {pod.TokenSymbol}
                </Box>
              </Box>
            </Box>
            <div className={classes.chartSection}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box
                  height="35px"
                  width="90%"
                  bgcolor="#DAE6E5"
                  borderRadius={32}
                  fontSize={14}
                  fontWeight={600}
                  color="#fff"
                >
                  <Box
                    height="35px"
                    width={`${yesPercentage}%`}
                    bgcolor={yesPercentage !== 0 ? '#65CB63' : 'transparent'}
                    borderRadius={32}
                    pt={'6px'}
                    pl={3}
                  >
                    Yes
                  </Box>
                </Box>
                <div className={classes.typo5}>
                  {proposal.voteStates?.forVotes || 0} {pod.TokenSymbol}
                </div>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt={1.5}
              >
                <Box
                  height="35px"
                  width="90%"
                  bgcolor="#DAE6E5"
                  borderRadius={32}
                  fontSize={14}
                  fontWeight={600}
                  color="#fff"
                >
                  <Box
                    position="absolute"
                    height="35px"
                    width={`${noPercentage}%`}
                    bgcolor={noPercentage !== 0 ? '#F74484' : 'transparent'}
                    borderRadius={32}
                    pt={'6px'}
                    pl={3}
                  >
                    No
                  </Box>
                </Box>
                <div className={classes.typo5}>
                  {proposal.voteStates?.againstVotes || 0} {pod.TokenSymbol}
                </div>
              </Box>
            </div>
            {!voteDisabled && (
              <>
                <div className={classes.amountSection}>
                  <div className={classes.typo2}>Available MEDIA FRACTIONS</div>
                  <Box className={classes.typo4} mt={2}>
                    {totalStaked}
                  </Box>
                </div>
                <Select
                  className={classes.selectSection}
                  value={vote}
                  onChange={(e) => setVote(Number(e.target.value))}
                >
                  {options.map((item) => (
                    <MenuItem value={item.value}>{item.name}</MenuItem>
                  ))}
                </Select>
                <Box
                  width={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mt={6}
                >
                  <SecondaryButton
                    size="medium"
                    isRounded
                    style={{ width: 170, height: 59 }}
                    onClick={handleClose}
                  >
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton
                    size="medium"
                    isRounded
                    style={{ width: 295, height: 59, background: '#65CB63' }}
                    onClick={handleVote}
                  >
                    Place a vote
                  </PrimaryButton>
                </Box>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default SellProposalVoteModal;
