import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { useSelector } from 'react-redux';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { RootState } from 'store/reducers/Reducer';
import PodProposalDetailsModal from 'components/MusicDao/modals/PodProposalDetailsModal';
import TransactionProgressModal from '../../../modals/TransactionProgressModal';

import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { BlockchainNets } from 'shared/constants/constants';
import { Color, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Avatar from 'shared/ui-kit/Avatar';
import Box from 'shared/ui-kit/Box';
import { musicDaoCheckPodCreation } from 'shared/services/API';
import { switchNetwork } from 'shared/functions/metamask';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';
import { processImage, sleep } from 'shared/helpers';

import { ProposalPodCardStyles } from './index.styles';

export const ProposalPodCard = (props) => {
  const { proposal, pod, handleNewProposalModal } = props;
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const { showAlertMessage } = useAlertMessage();

  const userSelector = useSelector((state: RootState) => state.user);

  const classes = ProposalPodCardStyles();
  const [openDetailModal, setOpenDetailModal] = React.useState<boolean>(false);

  const { account, library, chainId } = useWeb3React();

  const creator = pod.CreatorsData.find((c) => c.id === proposal.proposer);
  const [hash, setHash] = useState<string>('');
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [openTranactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  const [voteStatus, setVoteStatus] = useState<boolean | null>(null);

  const { maxPrioFee } = useMaxPrioFee();

  useEffect(() => {
    setVoteStatus(
      proposal && proposal.Votes && proposal.Votes[userSelector.id]
    );
  }, [proposal]);

  const handleVote = async (support) => {
    console.log('userSelector---', userSelector, proposal);
    let ownerIndex;
    proposal.owners.forEach((item, key) => {
      if (item == userSelector.ArtistId) {
        ownerIndex = key;
      }
    });
    const votedCount = proposal.votes?.keys?.length ?? 0;
    const ownersCount = proposal.owners?.length ?? 0;
    if (!library) {
      showAlertMessage('Connect your metamask.', { variant: 'error' });
      return;
    }

    setOpenTransactionModal(true);
    const targetChain = BlockchainNets[1];
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0x89);
      if (!isHere) {
        showAlertMessage('Got failed while switching over to target netowrk', {
          variant: 'error'
        });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    const voteContractResponse =
      await web3APIHandler.PodManagerV2.votePodProposal(
        web3,
        account!,
        {
          proposalId: parseInt(proposal.Id),
          ownerIndex: ownerIndex,
          support: support
        },
        setHash,
        maxPrioFee
      );

    if (!voteContractResponse || !voteContractResponse.success) {
      showAlertMessage('Failed to accept the proposal', { variant: 'error' });
      setTransactionSuccess(false);
      setOpenDetailModal(false);
      return;
    } else {
      /// This means last vote
      if (votedCount === ownersCount - 2) {
        while (1) {
          const res = await musicDaoCheckPodCreation(pod.Id);
          if (res?.success) {
            setVoteStatus(true);
            showAlertMessage('Voted successfully', { variant: 'success' });
            setTransactionSuccess(true);
            setOpenDetailModal(false);
            history.push('/capsules/' + res.podId);
            return;
          }
          await sleep(5000);
        }
      } else {
        setVoteStatus(true);
        showAlertMessage('Voted successfully', { variant: 'success' });
        setTransactionSuccess(true);
        setOpenDetailModal(false);
        return;
      }
    }
  };

  const handleOpenScan = () => {
    const selectedChain = BlockchainNets.find(
      (net) => net.value === pod.blockchainNetwork
    );
    window.open(`${selectedChain.scan.url}/tx/${proposal.hash}`, '_blank');
  };

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
              {proposal.accepted === true ? (
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
              ) : proposal.accepted === false ? (
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ color: Color.Red, fontSize: 14, lineHeight: '15px' }}
                >
                  Declined&nbsp;
                  <img src={require('assets/musicDAOImages/declined.webp')} />
                </Box>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  className={classes.header1}
                >
                  Pending&nbsp;
                  <img src={require('assets/musicDAOImages/pending.webp')} />
                </Box>
              )}
            </Box>
          </Box>
        )}
        <Box className={classes.buttons}>
          <PrimaryButton
            size="small"
            style={{
              background: Color.MusicDAOGreen,
              pointerEvents: 'none',
              cursor: 'inherit',
              whiteSpace: 'nowrap'
            }}
          >
            Media Fractions Distribution <b>ID #{proposal.Id}</b>
          </PrimaryButton>
          {proposal?.hash && (
            <PrimaryButton
              size="small"
              style={{
                background: '#65CB6326',
                color: '#65CB63',
                minWidth: isMobile ? 96 : 117
              }}
              onClick={handleOpenScan}
            >
              <Box display="flex" alignItems="center">
                Check on&nbsp;
                <img
                  src={require('assets/icons/polygon_green.webp')}
                  style={{ marginLeft: 2, marginBottom: 2 }}
                />
              </Box>
            </PrimaryButton>
          )}
        </Box>
        {!isMobile && (
          <Box display="flex" alignItems="center">
            <Box mr={1}>
              {proposal.accepted === true ? (
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
              ) : proposal.accepted === false ? (
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ color: Color.Red, fontSize: 14, lineHeight: '15px' }}
                >
                  Declined&nbsp;
                  <img src={require('assets/musicDAOImages/declined.webp')} />
                </Box>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  className={classes.header1}
                  textAlign="right"
                >
                  Pending collab confirmation&nbsp;
                  <img
                    src={require('assets/musicDAOImages/pending.webp')}
                    style={{ marginLeft: 4 }}
                  />
                </Box>
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
            image={processImage(creator?.imageUrl) ?? getDefaultAvatar()}
          />
          <Box ml={1}>
            {creator && (
              <>
                <Box className={classes.header2}>{creator.name || ''}</Box>
                <Box className={classes.header3}>{`@${creator.urlSlug}`}</Box>
              </>
            )}
          </Box>
        </Box>
        <Box display="flex" mt={isMobile ? 2 : undefined}>
          <Box className={classes.header4}>
            Go to details to view distribution proposal
          </Box>
          <Box display="flex">
            {pod.CreatorsData.map((item, index) => {
              return (
                <Box ml={index > 0 ? -2 : 2} key={`creator-${index}`}>
                  <Avatar
                    size={34}
                    rounded
                    bordered
                    image={
                      processImage(item.imageUrl) ??
                      require(`assets/anonAvatars/ToyFaces_Colored_BG_111.webp`)
                    }
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <SecondaryButton
          size="medium"
          isRounded
          style={{
            borderStyle: 'solid'
          }}
          onClick={() => {
            setOpenDetailModal(true);
          }}
        >
          Details
        </SecondaryButton>
      </Box>
      {openTranactionModal && (
        <TransactionProgressModal
          open={openTranactionModal}
          onClose={() => {
            setHash('');
            setTransactionSuccess(null);
            setOpenTransactionModal(false);
          }}
          txSuccess={transactionSuccess}
          hash={hash}
        />
      )}
      {openDetailModal && (
        <PodProposalDetailsModal
          {...props}
          open={openDetailModal}
          onClose={() => setOpenDetailModal(false)}
          handleAccept={() => handleVote(true)}
          handleDecline={() => handleVote(false)}
          voteStatus={voteStatus}
          handleNewDistributionProposalModal={() => {
            setOpenDetailModal(false);
            handleNewProposalModal();
          }}
        />
      )}
    </Box>
  );
};
