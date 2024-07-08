import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import { SongTokenSelect } from 'shared/ui-kit/Select/SongTokenSelect';
import { BlockchainNets } from 'shared/constants/constants';
import { toNDecimals } from 'shared/functions/web3';
import { switchNetwork } from 'shared/functions/metamask';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import PolygonAPI from 'shared/services/API/polygon';
import { getAllTokenInfos } from 'shared/services/API/TokenAPI';
import { musicDaoCheckSaleOfferExist } from 'shared/services/API/MusicDaoAPI';
import TransactionProgressModal from '../../../../modals/TransactionProgressModal';
import { modalStyles } from './index.styles';
import { sleep } from 'shared/helpers';

const EditPriceModal = (props) => {
  const classes = modalStyles();
  const [token, setToken] = useState<any>();
  const [tokens, setTokens] = useState<any[]>([]);
  const [inputBalance, setInputBalance] = useState<string>('');
  const [openTranactionModal, setOpenTransactionModal] = useState<boolean>(
    false
  );
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [hash, setHash] = useState<string>('');
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    getAllTokenInfos().then((resp) => {
      if (resp.success) {
        const tokenList = resp.tokens.filter(
          (item) => item.Symbol == 'USDT' && item.Network == 'Polygon'
        );
        setTokens(tokenList); // update token list
        setToken(tokenList[0]);
      }
    });
  }, []);

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
      let approved: any;
      approved = await PolygonAPI.Erc721.approve(web3, account || '', {
        to: web3Config.CONTRACT_ADDRESSES.OPEN_SALES_MANAGER,
        tokenId: props.songDetailData.tokenId,
        nftAddress: props.songDetailData.podAddress
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

    const response = await web3APIHandler.openSalesManager.approveSale(
      web3,
      account!,
      false,
      props.songDetailData.type !== 'ERC1155',
      {
        collection: props.songDetailData.podAddress,
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
        const res = await musicDaoCheckSaleOfferExist(props.songDetailData.Id);
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
      showAlertMessage('Failed to make a selling offer', { variant: 'error' });
    }
  };

  return (
    <Modal
      size="daoMedium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      className={classes.root}
    >
      <div className={classes.content}>
        <div className={classes.typo1}>Set NFT Sale Price</div>
        <div className={classes.typo2}>Set new price</div>
        <Box display="flex" alignItems="center" my={1}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            className={classes.tokenValue}
            mr={1.5}
            flex={1}
          >
            <input
              type="number"
              onChange={(e) => {
                setInputBalance(e.target.value);
              }}
              value={inputBalance}
              disabled={isApproved}
            />
          </Box>
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
            onClick={() => {
              handleConfirm();
            }}
            disabled={!isApproved || !inputBalance}
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
      />
    </Modal>
  );
};

export default EditPriceModal;
