import React from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import TransactionProgressModal from '../TransactionProgressModal';
import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { getMarketFee } from 'shared/services/API/PodAPI';
import { BlockchainNets, PRIMARY_SALE_FEE, TOLERANCE } from 'shared/constants/constants';
import { switchNetwork } from 'shared/functions/metamask';
import { toDecimals, toNDecimals } from 'shared/functions/web3';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';
import { sleep } from 'shared/helpers';
import { musicDaoGetPodEditionSoldCount } from 'shared/services/API';

import useModalStyles from './index.styles';

const BuyNFTModal = ({
  open,
  onClose,
  pod,
  mediaIndex,
  editionIndex,
  token,
  tokenPrice,
  tokenName,
  refreshPod
}: {
  open: boolean;
  onClose?: any;
  pod?: any;
  mediaIndex?: number;
  editionIndex?: number;
  token?: any;
  tokenPrice?: number;
  tokenName?: string;
  refreshPod: () => {};
}) => {
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const [isApproved, setIsApproved] = React.useState<boolean>(false);
  const { maxPrioFee } = useMaxPrioFee();
  const { account, library, chainId } = useWeb3React();
  const [hash, setHash] = React.useState<string>('');
  const [transactionSuccess, setTransactionSuccess] = React.useState<
    boolean | null
  >(null);
  const [
    openTranactionModal,
    setOpenTransactionModal
  ] = React.useState<boolean>(false);

  const [totalBalance, setTotalBalance] = React.useState<string>('0');
  const [marketFee, setMarketFee] = React.useState<number>(0);
  const [totalPrice, setTotalPrice] = React.useState<number>(
    Number(tokenPrice) * (1 + PRIMARY_SALE_FEE / 100) * (1 + TOLERANCE)
  );
  const [buyPrice, setBuyPrice] = React.useState<number>(
    Number(tokenPrice) * (1 + PRIMARY_SALE_FEE / 100)
  );
  React.useEffect(() => {
    getMarketFee().then((resp) => {
      if (resp.success) {
        setMarketFee(resp?.data?.Fee || 0);
      }
    });
  }, []);

  React.useEffect(() => {
    setBalance();
  }, [token]);

  const setBalance = async () => {
    if (token) {
      const targetChain = BlockchainNets.find(
        (net) => net.value === 'Polygon blockchain'
      );
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0x89);
        if (!isHere) {
          showAlertMessage(
            'Got failed while switching over to target network',
            {
              variant: 'error'
            }
          );
          return;
        }
      }

      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);
      const decimals = await web3APIHandler.Erc20[
        token?.Symbol || 'USDT'
      ].decimals(web3, token.Address);
      const balance = await web3APIHandler.Erc20[
        token?.Symbol || 'USDT'
      ].balanceOf(web3, {
        account
      });
      setTotalBalance(toDecimals(balance ?? 0, decimals));
    }
  };

  const handleApprove = async () => {
    try {
      setOpenTransactionModal(true);
      const targetChain = BlockchainNets.find(
        (net) => net.value === 'Polygon blockchain'
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
      let balance = await web3APIHandler.Erc20[token.Symbol].balanceOf(web3, {
        account
      });
      let decimals = await web3APIHandler.Erc20[token.Symbol].decimals(web3, {
        account
      });
      balance = balance / Math.pow(10, decimals);
      console.log(tokenPrice, totalPrice)
      if (balance < (totalPrice || 0)) {
        showAlertMessage(`Insufficient balance to approve`, {
          variant: 'error'
        });
        setTransactionSuccess(false);
        return;
      }
      let approved: any;
      approved = await web3APIHandler.Erc20[token.Symbol].approve(
        web3,
        account!,
        web3Config.CONTRACT_ADDRESSES.MEDIA_MANAGER_V2,
        toNDecimals(Number(totalPrice), token.Decimals)
      );
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: 'error' });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(
        `Successfully approved ${Number(totalPrice).toFixed(2)} ${
          token.Symbol
        }!`,
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
    web3APIHandler.MediaManagerV2.buyMediaEdition(
      web3,
      account!,
      {
        podId: pod.Id,
        mediaIndex: mediaIndex,
        editionIndex: editionIndex
      },
      setHash,
      maxPrioFee
    ).then(async (resp) => {
      if (resp) {
        while (1) {
          const soldCount = Number(
            pod?.Medias[mediaIndex ?? 0].quantitySoldPerEdition[
              editionIndex ?? 0
            ]
          );
          const res = await musicDaoGetPodEditionSoldCount(
            pod.collectionWithRoyalty,
            mediaIndex ?? 0,
            editionIndex ?? 0
          );
          if (res?.success && res?.count > soldCount) {
            setTransactionSuccess(true);
            showAlertMessage('Successfully purchased.', {
              variant: 'success'
            });
            refreshPod();
            return;
          }
          await sleep(5000);
        }
      } else {
        setTransactionSuccess(false);
        showAlertMessage('Failed to make an offer', { variant: 'error' });
      }
    });
  };

  return (
    <>
      {openTranactionModal ? (
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
      ) : (
        <Modal
          className={classes.root}
          size="daoMedium"
          isOpen={open}
          onClose={onClose}
          showCloseIcon
        >
          <Box className={classes.title}>Buy NFT</Box>
          {/* <Box className={classes.description} mb={2.5}>
            Accept the offer from the owner at it’s original price
          </Box> */}
          <Box className={classes.box}>
            <Box className={classes.boxItem}>
              <Box className={classes.typo1}>Amount to Pay</Box>
              <Box className={classes.typo2} mt={1.5}>
                {buyPrice} <span>{tokenName}</span>
              </Box>
            </Box>
          </Box>
          <Box
            display={'flex'}
            alignItems="center"
            justifyContent={'space-between'}
            my={3}
            width="80%"
            // px={9}
          >
            <Box className={classes.typo4}>
              Wallet balance {totalBalance} {token?.Symbol || 'ETH'}
            </Box>
            <Box className={classes.typo5}>
              incl. {PRIMARY_SALE_FEE}% fee
            </Box>
          </Box>
          <Box className={classes.buttonsBox} my={2}>
            <PrimaryButton
              size="medium"
              className={classes.ApproveBtn}
              disabled={
                isApproved ||
                (tokenPrice ?? 0) === 0 ||
                Number(totalBalance) < (totalPrice ?? 0)
              }
              onClick={handleApprove}
            >
              Approve
            </PrimaryButton>
            <PrimaryButton
              className={classes.ConfirmBtn}
              size="medium"
              disabled={!isApproved}
              onClick={handleConfirm}
            >
              Confirm Buy
            </PrimaryButton>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default BuyNFTModal;
