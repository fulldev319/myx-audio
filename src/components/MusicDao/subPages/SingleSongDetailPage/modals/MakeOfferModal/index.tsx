import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import TransactionProgressModal from '../../../../modals/TransactionProgressModal';
import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { BlockchainNets } from 'shared/constants/constants';
import { switchNetwork } from 'shared/functions/metamask';
import { toDecimals, toNDecimals } from 'shared/functions/web3';
import { createBuySongOffer, getMarketFee } from 'shared/services/API/PodAPI';
import { SongTokenSelect } from 'shared/ui-kit/Select/SongTokenSelect';
import { getAllTokenInfos } from 'shared/services/API/TokenAPI';
import { musicDaoCheckBuyOfferExist } from 'shared/services/API/MusicDaoAPI';
import { sleep } from 'shared/helpers';
import { modalStyles } from './index.styles';

const PRECISSION = 1.01;

const MakeOfferModal = ({ open, onClose, songDetailData, refresh }) => {
  const classes = modalStyles();

  const [token, setToken] = useState<any>();
  const [tokens, setTokens] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState<string>('0');
  const [price, setPrice] = useState<string | number>(0);
  const [marketFee, setMarketFee] = useState<number>(0);
  const { showAlertMessage } = useAlertMessage();

  const { account, library, chainId } = useWeb3React();
  const [hash, setHash] = useState<string>('');
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(
    false
  );
  const [isApproved, setIsApproved] = useState<boolean>(false);

  useEffect(() => {
    getAllTokenInfos().then((res) => {
      if (res.success) {
        const tokenList = res.tokens.filter(
          (item) => item.Symbol == 'USDT' && item.Network == 'Polygon'
        );
        setTokens(tokenList); // update token list
        setToken(tokenList[0]);
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

  useEffect(() => {
    setBalance();
  }, [token]);

  const setBalance = async () => {
    if (token) {
      const targetChain = BlockchainNets.find(
        (net) => net.value === 'Polygon blockchain'
      );

      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);
      const decimals = await web3APIHandler.Erc20[
        token?.Symbol || 'ETH'
      ].decimals(web3, token.Address);
      const balance = await web3APIHandler.Erc20[
        token?.Symbol || 'ETH'
      ].balanceOf(web3, {
        account
      });
      console.log(decimals, balance);
      setTotalBalance(toDecimals(balance, decimals));
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
      if (balance < (price || 0)) {
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
        web3Config.CONTRACT_ADDRESSES.OPEN_SALES_MANAGER,
        toNDecimals(
          Number(price) * (1 + marketFee) * PRECISSION,
          token.Decimals
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
          Number(price) *
          (1 + marketFee) *
          PRECISSION
        ).toFixed(2)} ${token.Symbol}!`,
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
    const tokenId = songDetailData.tokenId ? songDetailData.tokenId : 1;
    const collection = songDetailData.podAddress;

    const response = await web3APIHandler.openSalesManager.approvePurchase(
      web3,
      account!,
      false,
      songDetailData.type !== 'ERC1155',
      {
        collection,
        tokenId,
        paymentToken: token.Address,
        price: toNDecimals(price, token.Decimals),
        beneficiary: account,
        sellerToMatch: '0x0000000000000000000000000000000000000000'
      },
      setHash
    );

    if (response.success) {
      const offerId = await web3.utils.keccak256(
        web3.eth.abi.encodeParameters(
          ['address', 'uint256', 'address', 'uint256', 'address'],
          [
            collection,
            tokenId,
            token.Address,
            toNDecimals(price, token.Decimals),
            account
          ]
        )
      );
      while (1) {
        const res = await musicDaoCheckBuyOfferExist(
          songDetailData.Id,
          offerId
        );
        if (res?.success) {
          setTransactionSuccess(true);
          onClose();
          refresh();
          return;
        }
        await sleep(5000);
      }
    } else {
      setTransactionSuccess(false);
      showAlertMessage('Failed to make an offer', { variant: 'error' });
    }
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
        <Modal size="daoMedium" isOpen={open} onClose={onClose} showCloseIcon>
          <div className={classes.content}>
            <div className={classes.typo1}>Make new Offer</div>
            <div className={classes.typo2}>Set new price</div>
            <Box display="flex" alignItems="center" my={1}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                className={classes.tokenValue}
                mr={1.5}
                style={{ flex: '2' }}
              >
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isApproved}
                  style={{ width: '100%' }}
                />
                <span
                  className={classes.maxButton}
                  onClick={() => setPrice(totalBalance)}
                >
                  Use Max
                </span>
              </Box>
              <SongTokenSelect
                tokens={tokens}
                value={token?.Address || ''}
                className={classes.tokenSelect}
                onChange={(e) => {
                  setToken(
                    tokens.find(
                      (v) =>
                        v.Address?.toLowerCase() ===
                        e.target.value?.toLowerCase()
                    )
                  );
                }}
                style={{ flex: '1' }}
              />
            </Box>
            <div className={classes.typo3}>Balance: {`${totalBalance}`}</div>
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
                disabled={isApproved || !price}
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
                disabled={!isApproved || !price}
              >
                Confirm
              </PrimaryButton>
            </Box>
          </div>
        </Modal>
      )}
    </>
  );
};

export default MakeOfferModal;
