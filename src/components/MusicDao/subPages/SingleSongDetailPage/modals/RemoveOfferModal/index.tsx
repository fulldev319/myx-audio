import React, { useEffect } from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import { modalStyles } from './index.styles';
import TransactionProgressModal from 'components/MusicDao/modals/TransactionProgressModal';
import { useWeb3React } from '@web3-react/core';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { BlockchainNets } from 'shared/constants/constants';
import { switchNetwork } from 'shared/functions/metamask';
import Web3 from 'web3';
import {
  deleteBuySongOffer,
  updateOwnerSongOffer
} from 'shared/services/API/PodAPI';

const RemoveOfferModal = (props) => {
  const classes = modalStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const [tokens, setTokens] = React.useState<any[]>([]);
  const { account, library, chainId } = useWeb3React();
  const [openTranactionModal, setOpenTransactionModal] =
    React.useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = React.useState<
    boolean | null
  >(null);
  const [hash, setHash] = React.useState<string>('');
  const { showAlertMessage } = useAlertMessage();
  console.log(props.index);

  const handleConfirm = async () => {
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
    const tokenId = props.songDetailData.tokenId
      ? props.songDetailData.tokenId
      : 1;

    const response =
      await web3APIHandler.openSalesManager.cancelPurchaseProposal(
        web3,
        account!,
        props.songDetailData.type !== 'ERC1155',
        {
          collection: props.songDetailData.podAddress,
          tokenId,
          paymentToken:
            props.songDetailData?.buyingOffers[props.index].PaymentToken,
          price: props.songDetailData?.buyingOffers[props.index].Price,
          beneficiary:
            props.songDetailData?.buyingOffers[props.index]?.Beneficiary
        },
        setHash
      );

    if (response.success) {
      setTransactionSuccess(true);

      // await deleteBuySongOffer({
      //   songId: props.songDetailData?.Id,
      //   offerId: props.songDetailData?.buyingOffers[props.index]?.offerId
      // });
      props.onClose();
      props.refresh();
      //   handleRefresh();
    } else {
      setTransactionSuccess(false);
      showAlertMessage('Failed to edit a selling offer', { variant: 'error' });
    }
  };

  return (
    <Modal
      size="daoMedium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
    >
      <div className={classes.content}>
        <div className={classes.typo1}>Removing Offer</div>
        <div className={classes.typo2}>
          Are you sure you want to remove your buy offer?
        </div>
        <Box width={1} display="flex" justifyContent="center" marginTop="31px">
          <PrimaryButton
            size="medium"
            isRounded
            style={{
              width: 250,
              height: 53,
              background: '#54658F',
              marginTop: 52
            }}
            onClick={() => {
              props.onClose();
            }}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton
            size="medium"
            isRounded
            style={{
              width: 250,
              height: 53,
              background: '#F43E5F',
              marginTop: 52
            }}
            onClick={handleConfirm}
          >
            Yes, remove
          </PrimaryButton>
        </Box>
      </div>
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
    </Modal>
  );
};

export default RemoveOfferModal;
