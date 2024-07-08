import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import TransactionProgressModal from '../../../../modals/TransactionProgressModal';
import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import { BlockchainNets } from 'shared/constants/constants';
import { switchNetwork } from 'shared/functions/metamask';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import {
  /*createSalesSongOffer,*/ updateSalesSongOffer,
  getMarketFee
} from 'shared/services/API/PodAPI';
import PolygonAPI from 'shared/services/API/polygon';
import { getAllTokenInfos } from 'shared/services/API/TokenAPI';
import { sleep } from 'shared/helpers';
import { musicDaoCheckOwnerChanged } from 'shared/services/API';

import { modalStyles } from './index.styles';

const AcceptOfferModal = (props) => {
  const classes = modalStyles();

  const [tokens, setTokens] = useState<any[]>([]);
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(
    false
  );
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [hash, setHash] = useState<string>('');
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [marketFee, setMarketFee] = useState<number>(0);
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    getAllTokenInfos().then((resp) => {
      if (resp.success) {
        const tokenList = resp.tokens.filter(
          (item) =>
            item.Symbol == 'USDT' &&
            (props.songDetailData?.Chain === 'Polygon'
              ? item.Network == 'Polygon'
              : item.Network == 'Ethereum')
        );
        setTokens(tokenList); // update token list
      }
    });
  }, []);

  useEffect(() => {
    getMarketFee().then((resp) => {
      if (resp.success) {
        setMarketFee(resp?.data?.Fee || 0);
      }
    });
  }, []);

  const getTokenName = (addr) => {
    if (tokens.length == 0) return '';
    const token = tokens.find(
      (token) => token.Address?.toLowerCase() === addr?.toLowerCase()
    );
    return token?.Symbol ?? '';
  };

  const getTokenPrice = (price, addr) => {
    if (tokens.length == 0) return 0;
    const token = tokens.find(
      (token) => token.Address?.toLowerCase() === addr?.toLowerCase()
    );
    return token ? price / 10 ** token.Decimals : 0;
  };

  const handleApprove = async () => {
    try {
      setOpenTransactionModal(true);
      const targetChain = BlockchainNets.find((net) =>
        props.songDetailData?.Chain === 'Polygon'
          ? net.value === 'Polygon blockchain'
          : net.value === 'Ethereum blockchain'
      );
      const web3Config = targetChain.config;
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0x89);
        if (!isHere) {
          showAlertMessage(
            'Got failed while switching over to target network',
            { variant: 'error' }
          );
          return;
        }
      }
      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);
      let approved: any;
      approved = await PolygonAPI.Erc721.approve(web3, account || '', {
        to: web3Config.CONTRACT_ADDRESSES.OPEN_SALES_MANAGER,
        tokenId: props.songDetailData.TokenId,
        nftAddress: props.songDetailData.CollectionAddress
      });
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: 'error' });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(`Successfully approved your nft!`, {
        variant: 'success'
      });
      setTransactionSuccess(null);
      setOpenTransactionModal(false);
    } catch (error) {
      console.log(error);
      showAlertMessage('Something went wrong. Please try again!', {
        variant: 'error'
      });
    } finally {
    }
  };

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
    const tokenId = props.songDetailData.TokenId ?? '1';

    const response = await web3APIHandler.openSalesManager.approveSale(
      web3,
      account!,
      true,
      props.songDetailData.type !== 'ERC1155',
      {
        collection: props.songDetailData.CollectionAddress,
        tokenId,
        paymentToken:
          props.songDetailData.buyingOffers[props.index].PaymentToken,
        price: props.songDetailData.buyingOffers[props.index].Price,
        beneficiary: account,
        buyerToMatch: props.songDetailData.buyingOffers[props.index].Beneficiary
      },
      setHash
    );

    if (response.success) {
      while (1) {
        const res = await musicDaoCheckOwnerChanged(
          props.songDetailData.Id,
          props.songDetailData.buyingOffers[
            props.index
          ].Beneficiary?.toLowerCase() ?? '',
          true
        );
        if (res?.success === true) {
          setTransactionSuccess(true);
          props.onClose();
          props.refresh();
          return;
        }
        await sleep(5000);
      }
    } else {
      setTransactionSuccess(false);
      showAlertMessage('Failed to make a selling offer', { variant: 'error' });
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
        <div className={classes.typo1}>Accept Buy Offer</div>
        <div className={classes.priceContainer}>
          <div className={classes.typo4}>Offer Price (after fees)</div>
          <Box display="flex" justifyContent="center" marginTop="13px">
            <span className={classes.typo5}>
              {getTokenPrice(
                props.songDetailData?.buyingOffers[props.index].Price,
                props.songDetailData?.buyingOffers[props.index].PaymentToken
              ) *
                (1 - marketFee)}
            </span>
            <span className={classes.typo6}>
              {getTokenName(
                props.songDetailData?.buyingOffers[props.index].PaymentToken
              )}
            </span>
          </Box>
        </div>
        <Box
          display="flex"
          justifyContent="flex-end"
          mt={1}
          className={classes.typo3}
        >
          incl. marketplace fee: {marketFee * 100}%
        </Box>
        <Box width={1} display="flex" justifyContent="center">
          <PrimaryButton
            size="medium"
            isRounded
            style={{
              width: 250,
              height: 53,
              background: '#65CB63',
              marginTop: 52
            }}
            onClick={handleApprove}
            disabled={isApproved}
          >
            {isApproved ? 'Approved' : 'Approve'}
          </PrimaryButton>
          <PrimaryButton
            size="medium"
            isRounded
            style={{
              width: 250,
              height: 53,
              background: '#65CB63',
              marginTop: 52
            }}
            onClick={() => {
              handleConfirm();
            }}
            disabled={!isApproved}
          >
            Confirm
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

export default AcceptOfferModal;
