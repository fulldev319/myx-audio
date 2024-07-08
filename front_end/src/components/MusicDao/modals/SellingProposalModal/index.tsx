import React, { useState, useEffect } from 'react';
import { isAddress } from 'ethers/lib/utils';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';

import ListItem from '@material-ui/core/ListItem';
import Select from '@material-ui/core/Select';

import TransactionProgressModal from '../TransactionProgressModal';

import { Color, Modal, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { musicDaoCreateSellingProposal } from 'shared/services/API';
import { BlockchainNets } from 'shared/constants/constants';
import { switchNetwork } from 'shared/functions/metamask';
import { toDecimals, toNDecimals } from 'shared/functions/web3';
import getPhotoIPFS from 'shared/functions/getPhotoIPFS';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';
import { processImage } from 'shared/helpers';

import { SellingProposalModalStyles } from './index.styles';

const MARKET_TYPE = {
  MYX: 0,
  OPENSEA: 1
};

const expectedBlockTime = 2000;
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const SellingProposalModal = (props: any) => {
  const { open, handleClose, handleRefresh, pod, podInfo } = props;
  const classes = SellingProposalModalStyles();

  const { showAlertMessage } = useAlertMessage();

  const [songNFTs, setSongNfts] = React.useState<any[]>([]);

  const [step, setStep] = useState<number>(0);
  const [nft, setNFT] = useState<string>();
  const [market, setMarket] = useState<number>(MARKET_TYPE.MYX);
  const [amount, setAmount] = useState<string>('0');
  const [withdrawAddress, setWithdrawAddress] = useState<string>();

  const { account, library, chainId } = useWeb3React();
  const [hash, setHash] = useState<string>('');
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [openTransactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  const { downloadWithNonDecryption } = useIPFS();

  const { maxPrioFee } = useMaxPrioFee();

  useEffect(() => {
    if (!pod || !pod.Medias) return;
    (async () => {
      const data = pod.Medias.filter((item) =>
        item.tokenId && item.status !== 'LISTED' ? true : false
      );
      const promises = data.map(async (item) => {
        const image = await getPhotoIPFS(
          item.metadataPhoto.newFileCID,
          item.metadataPhoto.metadata.properties.name,
          downloadWithNonDecryption
        );
        return {
          ...item,
          image
        };
      });
      const nfts = await Promise.all(promises);
      setSongNfts(nfts);
    })();
  }, [pod]);

  const validate = () => {
    if (isNaN(parseFloat(amount))) {
      showAlertMessage(`Enter a valid amount.`, { variant: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

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
    const web3Config = targetChain.config;
    const web3 = new Web3(library.provider);

    const stableDecimals = await web3APIHandler.Erc20[
      market === MARKET_TYPE.MYX ? 'USDT' : 'WETH'
    ].decimals(web3);

    const selectedNft = songNFTs.find((item) => item.tokenId === nft);

    const calldata =
      market === MARKET_TYPE.MYX
        ? web3.eth.abi.encodeFunctionCall(
            {
              name: 'approveSale',
              type: 'function',
              inputs: [
                {
                  type: 'uint256',
                  name: 'tokenId'
                },
                {
                  type: 'uint256',
                  name: 'price'
                },
                {
                  type: 'address',
                  name: 'paymentToken'
                }
              ]
            },
            [
              nft,
              toNDecimals(amount, stableDecimals),
              web3Config.TOKEN_ADDRESSES.USDT
            ]
          )
        : web3.eth.abi.encodeFunctionCall(
            {
              name: 'transferNFT',
              type: 'function',
              inputs: [
                {
                  type: 'address',
                  name: 'nftAddress_'
                },
                {
                  type: 'uint256',
                  name: 'tokenId_'
                },
                {
                  type: 'address',
                  name: 'to_'
                }
              ]
            },
            [selectedNft.nftAddress, nft, withdrawAddress]
          );

    const response = await web3APIHandler.StakingGovernance.propose(
      web3,
      account!,
      {
        contractAddress: podInfo.stakingGovernance,
        targets: [podInfo.distributionManagerAddress],
        values: [0],
        calldatas: [calldata],
        description: 'Proposal #1: Make this token sellable',
        secretWalletData: []
      },
      setHash,
      maxPrioFee
    );

    if (response.success) {
      setTransactionSuccess(true);

      const decimals = await web3APIHandler.Erc20['COPYRIGHT'].decimals(
        web3,
        podInfo.copyrightToken
      );

      // Delay some seconds until the block mined successfully
      let transactionReceipt: any = null;
      while (transactionReceipt == null) {
        // Waiting expectedBlockTime until the transaction is mined
        transactionReceipt = await web3.eth.getTransactionReceipt(
          response.data.hash
        );
        await sleep(expectedBlockTime);
      }

      const supply = await web3APIHandler.StakingERC721.getPastTotalSupply(
        web3,
        {
          contractAddress: podInfo.stakingERC721,
          blockNumber: response.data.startBlock
        }
      );

      await musicDaoCreateSellingProposal({
        podId: pod.Id,
        mediaId: nft,
        amount: +amount,
        proposalId: response.data.proposalId,
        description: response.data.description,
        totalSupply: +toDecimals(supply, decimals),
        expireAt: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
        hash: response.data.hash,
        marketType: market,
        paymentToken: market === MARKET_TYPE.MYX ? 'USDT' : 'WETH'
      });
      handleRefresh();
    } else {
      setTransactionSuccess(false);
      showAlertMessage('Failed to stake tokens', { variant: 'error' });
    }

    if (market === MARKET_TYPE.MYX) {
      setStep((prev) => prev + 1);
    }
  };

  const onClose = () => {
    setStep(0);
    handleClose();
  };

  const firstScreen = () => (
    <Box py={3}>
      <img src={require('assets/emojiIcons/handshake.webp')} />
      <Box className={classes.header1} mt={2}>
        Selling Proposal
      </Box>
      <Box
        className={classes.header2}
        mt={2}
        mb={4}
        color={Color.MusicDAOLightBlue}
        style={{ opacity: 0.9 }}
      >
        Create a NFT selling proposal of the media that was uploaded to the
        Capsule for the collaborators of the Capsule to approve. You must first
        stake in order to submit a proposal.
      </Box>
      <PrimaryButton
        size="medium"
        onClick={() => setStep((prev) => prev + 1)}
        isRounded
        style={{ width: '50%', background: Color.MusicDAODark }}
      >
        Next
      </PrimaryButton>
    </Box>
  );

  const secondScreen = () => (
    <Box py={1}>
      <Box className={classes.header3}>Selling Proposal</Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        mt={3}
        mb={5}
        width={1}
      >
        <Box className={classes.header4} mb={1}>
          Select NFT
        </Box>
        <Select
          className={`${classes.item} ${classes.nft}`}
          MenuProps={{ classes: { paper: classes.popover } }}
          value={nft}
          onChange={(e: any) => setNFT(e.target.value)}
        >
          {songNFTs &&
            songNFTs.map((nft, index) => (
              <ListItem value={nft.tokenId} key={`list-nft-${index}`}>
                <Box display="flex" alignItems="center" width={1}>
                  <Box flex={2} display="flex" alignItems="center">
                    <img
                      className={classes.image}
                      src={processImage(nft.image)}
                      alt="avatar"
                    />
                    <Box ml={1} className={classes.listText}>
                      {nft.Title}
                    </Box>
                  </Box>
                  <Box flex={1}>
                    <Box className={classes.selectText}>Select</Box>
                  </Box>
                </Box>
              </ListItem>
            ))}
        </Select>
        <Box className={classes.header4} mb={1} mt={2}>
          Chain and Market to sell
        </Box>
        <Select
          className={`${classes.item} ${classes.market}`}
          value={market}
          onChange={(e: any) => setMarket(e.target.value)}
        >
          <ListItem value={MARKET_TYPE.MYX}>
            <Box display="flex" alignItems="center">
              <Box mr={1}>
                <img
                  src={require('assets/logos/music.webp')}
                  alt="myx"
                  width={26}
                />
              </Box>
              Sell on Myx Marketplace
            </Box>
          </ListItem>
          <ListItem value={MARKET_TYPE.OPENSEA}>
            <Box display="flex" alignItems="center">
              <Box mr={1}>
                <img
                  src={require('assets/icons/opensea.webp')}
                  alt="opensea"
                  width={26}
                />
              </Box>
              Withdraw and Sell on Opensea
            </Box>
          </ListItem>
        </Select>
        {market === MARKET_TYPE.OPENSEA && (
          <>
            <Box className={classes.header4} mt={2} mb={1}>
              Withdraw Address
            </Box>
            <Box className={`${classes.item} ${classes.price}`}>
              <input
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                placeholder="Address here"
              />
            </Box>
          </>
        )}
        <Box className={classes.header4} mt={2} mb={1}>
          Selling Price
        </Box>
        <Box className={`${classes.item} ${classes.price}`}>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Box className={classes.listText}>
            {market === MARKET_TYPE.MYX ? 'USDT' : 'WETH'}
          </Box>
        </Box>
      </Box>
      <PrimaryButton
        size="medium"
        onClick={handleSubmit}
        disabled={
          !nft ||
          !amount ||
          (market === MARKET_TYPE.OPENSEA &&
            (!withdrawAddress || !isAddress(withdrawAddress)))
        }
        isRounded
        style={{ width: '50%', background: Color.MusicDAOGreen }}
      >
        Confirm
      </PrimaryButton>
    </Box>
  );

  const thirdScreen = () => (
    <>
      {market === MARKET_TYPE.MYX && (
        <Box py={1}>
          <img src={require('assets/emojiIcons/sign_lock.webp')} />
          <Box className={classes.header1} mt={2}>
            Selling Request Sent
          </Box>
          <Box
            className={classes.header2}
            my={2}
            color={Color.MusicDAOLightBlue}
            style={{ opacity: 0.9 }}
          >
            We have sent a notification to the artists to review your funds
            distribution proposal.
          </Box>
          <Box
            className={classes.header2}
            mb={4}
            color={Color.MusicDAOLightBlue}
            style={{ opacity: 0.9 }}
          >
            We’ll keep you posted on the status of this transaction.
          </Box>
          <PrimaryButton
            size="medium"
            isRounded
            style={{ width: '50%', background: Color.MusicDAODark }}
            onClick={onClose}
          >
            View Proposal on Capsule
          </PrimaryButton>
        </Box>
      )}
    </>
  );

  return (
    <>
      {openTransactionModal ? (
        <TransactionProgressModal
          open={openTransactionModal}
          onClose={() => {
            setHash('');
            setTransactionSuccess(null);
            setOpenTransactionModal(false);
            if (market === MARKET_TYPE.OPENSEA) {
              onClose();
            }
          }}
          txSuccess={transactionSuccess}
          hash={hash}
        />
      ) : (
        <Modal
          size="small"
          isOpen={open}
          onClose={onClose}
          showCloseIcon
          className={classes.root}
        >
          {step === 0 ? (
            firstScreen()
          ) : step === 1 ? (
            secondScreen()
          ) : step === 2 ? (
            thirdScreen()
          ) : (
            <></>
          )}
        </Modal>
      )}
    </>
  );
};
