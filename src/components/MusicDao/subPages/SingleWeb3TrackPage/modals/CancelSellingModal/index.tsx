import React, { useEffect } from 'react';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import URL from 'shared/functions/getURL';
import { modalStyles } from './index.styles';
import { BlockchainNets } from 'shared/constants/constants';
import { switchNetwork } from 'shared/functions/metamask';
import TransactionProgressModal from '../../../../modals/TransactionProgressModal';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { sleep } from 'shared/helpers';
import { musicDaoCheckSaleOfferExist } from 'shared/services/API';

const CancelSellingModal = (props) => {
  const classes = modalStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const { account, library, chainId } = useWeb3React();
  const [
    openTranactionModal,
    setOpenTransactionModal
  ] = React.useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = React.useState<
    boolean | null
  >(null);
  const [hash, setHash] = React.useState<string>('');
  const { showAlertMessage } = useAlertMessage();

  const handleConfirm = async () => {
    setOpenTransactionModal(true);
    const targetChain = BlockchainNets.find((net) =>
      props.songDetailData?.Chain === 'Polygon'
        ? net.value === 'Polygon blockchain'
        : net.value === 'Ethereum blockchain'
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
    const tokenId = props.songDetailData.TokenId
      ? props.songDetailData.TokenId
      : '1';

    const response = await web3APIHandler.openSalesManager.cancelSaleProposal(
      web3,
      account!,
      props.songDetailData.type !== 'ERC1155',
      {
        collection: props.songDetailData.CollectionAddress,
        tokenId,
        paymentToken: props.songDetailData.sellingOffer.PaymentToken,
        price: Number(props.songDetailData.sellingOffer.Price),
        owner: account
      },
      setHash
    );

    if (response.success) {
      while (1) {
        const res = await musicDaoCheckSaleOfferExist(
          props.songDetailData.Id,
          true
        );
        if (res?.success === false) {
          setTransactionSuccess(true);
          props.onClose();
          props.refresh();
          return;
        }
        await sleep(5000);
      }
    } else {
      setTransactionSuccess(false);
      showAlertMessage('Failed to edit price of offer', { variant: 'error' });
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
        <div className={classes.typo1}>Cancel Sales Offer</div>
        <div className={classes.typo2}>
          This action will cancel fixed price sales offer for your track NFT.
          Users will still be able to make an offer to you but you will need to
          approve their price.
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
            Go back
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
            Yes, cancel offer
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
        network={props.songDetailData?.Chain}
      />
    </Modal>
  );
};

export default CancelSellingModal;
