import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import TransactionProgressModal from '../../../../modals/TransactionProgressModal';
import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { BlockchainNets } from 'shared/constants/constants';
import { switchNetwork } from 'shared/functions/metamask';
import { getMarketFee } from 'shared/services/API/PodAPI';
import { getAllTokenInfos } from 'shared/services/API/TokenAPI';
import { modalStyles } from './index.styles';
import { sleep } from 'shared/helpers';
import { musicDaoCheckOwnerChanged } from 'shared/services/API';

const PRECISSION = 1.01;

const BuyNowModal = ({ open, onClose, songDetailData, refresh }) => {
  const classes = modalStyles();
  const [tokens, setTokens] = useState<any[]>([]);
  const { account, library, chainId } = useWeb3React();
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(
    false
  );
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [hash, setHash] = useState<string>('');
  const [marketFee, setMarketFee] = useState<number>(0);
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    getAllTokenInfos().then((resp) => {
      if (resp.success) {
        const tokenList = resp.tokens.filter(
          (item) =>
            item.Symbol == 'USDT' &&
            (songDetailData?.Chain == 'Polygon'
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
        songDetailData?.Chain == 'Polygon'
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
      let balance = await web3APIHandler.Erc20[
        getTokenName(songDetailData?.sellingOffer.PaymentToken)
      ].balanceOf(web3, { account });
      let decimals = await web3APIHandler.Erc20[
        getTokenName(songDetailData?.sellingOffer.PaymentToken)
      ].decimals(web3, { account });

      if (
        balance <
        (songDetailData?.sellingOffer.Price * (1 + marketFee) * PRECISSION || 0)
      ) {
        showAlertMessage(`Insufficient balance to approve`, {
          variant: 'error'
        });
        setTransactionSuccess(false);
        return;
      }
      let approved: any;
      approved = await web3APIHandler.Erc20[
        getTokenName(songDetailData?.sellingOffer.PaymentToken)
      ].approve(
        web3,
        account!,
        web3Config.CONTRACT_ADDRESSES.OPEN_SALES_MANAGER,
        Math.ceil(
          songDetailData?.sellingOffer.Price * (1 + marketFee) * PRECISSION
        )
      );
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: 'error' });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(
        `Successfully approved ${(
          (songDetailData?.sellingOffer.Price * (1 + marketFee) * PRECISSION) /
          10 ** decimals
        ).toFixed(2)} ${getTokenName(
          songDetailData?.sellingOffer.PaymentToken
        )}!`,
        {
          variant: 'success'
        }
      );
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
      songDetailData?.Chain == 'Polygon'
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
    const tokenId = songDetailData.TokenId ?? '1';

    console.log({
      collection: songDetailData.CollectionAddress,
      tokenId,
      paymentToken: songDetailData?.sellingOffer.PaymentToken,
      price: songDetailData?.sellingOffer.Price,
      beneficiary: account?.toLowerCase(),
      sellerToMatch: songDetailData?.sellingOffer.Beneficiary
    });
    const response = await web3APIHandler.openSalesManager.approvePurchase(
      web3,
      account!,
      true,
      songDetailData.type !== 'ERC1155',
      {
        collection: songDetailData.CollectionAddress,
        tokenId,
        paymentToken: songDetailData?.sellingOffer.PaymentToken,
        price: songDetailData?.sellingOffer.Price,
        beneficiary: account?.toLowerCase(),
        sellerToMatch: songDetailData?.sellingOffer.Beneficiary
      },
      setHash
    );

    if (response.success) {
      while (1) {
        const res = await musicDaoCheckOwnerChanged(
          songDetailData.Id,
          account?.toLowerCase() ?? '',
          true
        );
        if (res?.success === true) {
          setTransactionSuccess(true);
          onClose();
          refresh();
          return;
        }
        await sleep(5000);
      }
    } else {
      setTransactionSuccess(false);
      showAlertMessage('Failed to edit a selling offer', { variant: 'error' });
    }
  };

  return (
    <Modal size="daoMedium" isOpen={open} onClose={onClose} showCloseIcon>
      <div className={classes.content}>
        <div className={classes.typo1}>Buy Now</div>
        <div className={classes.priceContainer}>
          <div className={classes.typo4}>Amount To Pay</div>
          <Box display="flex" justifyContent="center" marginTop="13px">
            <span className={classes.typo5}>
              {getTokenPrice(
                songDetailData?.sellingOffer.Price,
                songDetailData?.sellingOffer.PaymentToken
              ) *
                (1 + marketFee)}
            </span>
            <span className={classes.typo6}>
              {getTokenName(songDetailData?.sellingOffer.PaymentToken)}
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
            onClick={handleConfirm}
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
        network={songDetailData?.Chain}
      />
    </Modal>
  );
};

export default BuyNowModal;
