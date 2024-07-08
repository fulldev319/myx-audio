import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import TransactionProgressModal from '../../../../modals/TransactionProgressModal';
import PolygonAPI from 'shared/services/API/polygon';
import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import { BlockchainNets } from 'shared/constants/constants';
import { switchNetwork } from 'shared/functions/metamask';
import { toNDecimals } from 'shared/functions/web3';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import {
  createSalesSongOffer,
  deleteSalesSongOffer
} from 'shared/services/API/PodAPI';
import { SongTokenSelect } from 'shared/ui-kit/Select/SongTokenSelect';
import { getAllTokenInfos } from 'shared/services/API/TokenAPI';
import { musicDaoCheckSaleOfferExist } from 'shared/services/API';
import { sleep } from 'shared/helpers';
import { modalStyles } from './index.styles';

const EditPriceModal = (props) => {
  const classes = modalStyles();

  const [token, setToken] = useState<any>();
  const [tokens, setTokens] = useState<any[]>([]);
  const [inputBalance, setInputBalance] = useState<string>('');
  const { account, library, chainId } = useWeb3React();
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(
    false
  );
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [hash, setHash] = useState<string>('');
  const [step, setStep] = useState<number>(0);
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    getAllTokenInfos().then((resp) => {
      if (resp.success) {
        const tokenList = resp.tokens.filter(
          (item) =>
            item.Symbol == 'USDT' &&
            (props.songDetailData?.Chain == 'Polygon'
              ? item.Network == 'Polygon'
              : item.Network == 'Ethereum')
        );
        setTokens(tokenList); // update token list
        setToken(tokenList[0]);
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
      let balance = await web3APIHandler.Erc20[token.Symbol].balanceOf(web3, {
        account
      });
      let decimals = await web3APIHandler.Erc20[token.Symbol].decimals(web3, {
        account
      });
      balance = balance / Math.pow(10, decimals);
      if (balance < (inputBalance || 0)) {
        showAlertMessage(`Insufficient balance to approve`, {
          variant: 'error'
        });
        setTransactionSuccess(false);
        return;
      }
      let approved: any;
      approved = await PolygonAPI.Erc721.approve(web3, account || '', {
        to: web3Config.CONTRACT_ADDRESSES.OPEN_SALES_MANAGER,
        tokenId: props.songDetailData.TokenId ?? '1',
        nftAddress: props.songDetailData.CollectionAddress
      });
      if (!approved) {
        showAlertMessage(`Can't proceed to approve`, { variant: 'error' });
        setTransactionSuccess(false);
        return;
      }
      setIsApproved(true);
      showAlertMessage(
        `Successfully approved ${inputBalance} ${token.Symbol}!`,
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
      setTransactionSuccess(true);
      setOpenTransactionModal(false);
      setTransactionSuccess(null);
      setHash('');
      setStep(1);
    } else {
      setTransactionSuccess(false);
      showAlertMessage('Failed to edit price of offer', { variant: 'error' });
    }
  };

  const handleSetSalePrice = async () => {
    setOpenTransactionModal(true);
    const targetChain = BlockchainNets.find((net) =>
      props.songDetailData?.Chain == 'Polygon'
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
      false,
      props.songDetailData.type !== 'ERC1155',
      {
        collection: props.songDetailData.CollectionAddress,
        tokenId,
        paymentToken: token.Address,
        price: toNDecimals(inputBalance, token.Decimals),
        beneficiary: account,
        buyerToMatch: '0x0000000000000000000000000000000000000000'
      },
      setHash
    );

    if (response.success) {
      while (1) {
        const res = await musicDaoCheckSaleOfferExist(
          props.songDetailData.Id,
          true
        );
        if (res?.success) {
          setTransactionSuccess(true);
          props.onClose();
          props.refresh();
          return;
        }
        await sleep(5000);
      }
    } else {
      setTransactionSuccess(false);
      showAlertMessage('Failed to edit a selling offer', { variant: 'error' });
    }
  };

  return step == 0 ? (
    <Modal
      size="daoMedium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
    >
      <div className={classes.content}>
        <div className={classes.typo1}>
          You are editing the sales price - are you sure?
        </div>
        <div className={classes.typo2}>
          This process will require the smart contract to be modified and will
          need to be signed from your wallet.{' '}
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
            Yes, Edit Price
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
  ) : (
    <Modal
      size="daoMedium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
    >
      <div className={classes.content}>
        <div className={classes.typo1}>Set new price</div>
        <div className={classes.priceContainer}>
          <div className={classes.typo4}>CURRENT PRICE</div>
          <Box display="flex" justifyContent="center" marginTop="13px">
            <span className={classes.typo5}>
              {getTokenPrice(
                props.songDetailData?.sellingOffer.Price,
                props.songDetailData?.sellingOffer.PaymentToken
              )}
            </span>
            <span className={classes.typo6}>
              {getTokenName(props.songDetailData?.sellingOffer.PaymentToken)}
            </span>
          </Box>
        </div>
        <div className={classes.typo2}>Set new price</div>
        <Box display="flex" alignItems="center" my={1}>
          <SongTokenSelect
            tokens={tokens}
            value={token?.Address || ''}
            className={classes.tokenSelect}
            onChange={(e) => {
              setToken(
                tokens.find(
                  (v) =>
                    v.Address?.toLowerCase() === e.target.value?.toLowerCase()
                )
              );
            }}
            style={{ flex: '1' }}
          />
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            className={classes.tokenValue}
            ml={1.5}
            style={{ flex: '2' }}
          >
            <input
              type="number"
              style={{ maxWidth: 80 }}
              onChange={(e) => {
                setInputBalance(e.target.value);
              }}
              value={inputBalance}
              disabled={isApproved}
            />
          </Box>
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
            disabled={isApproved || !inputBalance}
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
            onClick={handleSetSalePrice}
            disabled={!isApproved || !inputBalance}
          >
            Confirm Change
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

export default EditPriceModal;
