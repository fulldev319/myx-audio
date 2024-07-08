import React, { useState, useEffect } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import { Color, Modal } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { PrimaryButton } from 'shared/ui-kit';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { BlockchainNets } from 'shared/constants/constants';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { switchNetwork } from 'shared/functions/metamask';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { toDecimals } from 'shared/functions/web3';
import TransactionProgressModal from '../TransactionProgressModal';
import cls from 'classnames';
import {
  musicDaoGetCopyrightNFTsByPod,
  musicDaoStakeMediaFractions
} from 'shared/services/API';
import {
  StyledMenuItem,
  StyledSelect
} from 'shared/ui-kit/Styled-components/StyledComponents';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '755px !important',
    // padding: "40px 40px 50px !important",

    '& label': {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '104.5%',
      color: '#2D3047',
      opacity: 0.9,
      marginBottom: '16px',
      display: 'flex'
    }
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '22px',
    lineHeight: '130%',
    textAlign: 'center',
    color: '#2D3047',
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    }
  },
  desc: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '150%',
    textAlign: 'center',
    color: '#54658F',
    padding: '0 48px',
    [theme.breakpoints.down('xs')]: {
      padding: '0 24px',
      fontSize: 14
    }
  },
  label: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '104.5%',
    color: '#2D3047',
    opacity: 0.9,
    marginBottom: '16px'
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    lineHeight: '120%',
    color: '#181818',
    padding: '9px 20px',
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #7BCBB7',
    borderRadius: '55px',
    height: 50,
    '& input': {
      padding: 0
    }
  },
  selectorContainter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    lineHeight: '120%',
    color: '#181818',
    padding: '9px 20px',
    background: 'rgba(218, 230, 229, 0.4)',
    borderRadius: '8px',
    height: 50
  },
  greenBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    borderRadius: '12px',
    padding: '32px 48px',
    textAlign: 'center',
    textTransform: 'uppercase',
    [theme.breakpoints.down('xs')]: {
      padding: '32px 32px'
    }
  },
  greenText: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '28px',
    lineHeight: '104.5%',
    textTransform: 'uppercase',
    color: Color.MusicDAOLightBlue,
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    }
  },
  amount: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '22px',
    lineHeight: '104.5%',
    color: Color.Green,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  inputContainerWhite: {
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '28px',
    lineHeight: '120%',
    color: Color.MusicDAODark,
    padding: '9px 20px',
    border: '1px solid #F0F5F8',
    textAlign: 'end',
    borderRadius: '55px',
    height: 50
  },
  fees: {
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '120%',
    color: '#707582'
  },
  divider: {
    width: 1,
    height: 50,
    background: '#DAE6E5'
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  cardsOptions: {
    height: '48px',
    padding: '16.5px 14px',
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 40,
    background: '#F0F5F8',
    borderRadius: '68px',
    [theme.breakpoints.down('xs')]: {
      marginTop: 24,
      marginBottom: 32
    }
  },
  tabHeader: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,

    cursor: 'pointer',
    marginRight: '25px',
    color: '#181818',
    padding: '10px 17px',
    '&:last-child': {
      marginRight: 0
    },
    [theme.breakpoints.down('xs')]: {
      padding: 9,
      marginRight: 5
    }
  },
  tabHeaderSelected: {
    color: '#FFFFFF',
    background: '#2D3047',
    borderRadius: '77px'
  }
}));

export default function PodStakingModal({
  open,
  onClose,
  handleRefresh,
  podInfo,
  pod,
  stakings
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const classes = useStyles();

  const { showAlertMessage } = useAlertMessage();

  const [amount, setAmount] = useState<number>();
  const [availableFractions, setAvailableFractions] = useState<number>(0);

  const { account, library, chainId } = useWeb3React();
  const [hash, setHash] = useState<string>('');
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [openTranactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  const [mediaNFTs, setMediaNFTs] = useState<any[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<any>();

  const [tab, setTab] = useState<number>(0);

  const { maxPrioFee } = useMaxPrioFee();

  useEffect(() => {
    if (!open) return;

    (async () => {
      const targetChain = BlockchainNets.find(
        (net) => net.value === 'Polygon blockchain'
      );
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0x89);
        if (!isHere) {
          showAlertMessage(
            'Got failed while switching over to target netowrk',
            { variant: 'error' }
          );
          return;
        }
      }
      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);
      const decimals = await web3APIHandler.Erc20['COPYRIGHT'].decimals(
        web3,
        podInfo.copyrightToken
      );
      const balance = await web3APIHandler.Erc20['COPYRIGHT'].balanceOf(
        web3,
        podInfo.copyrightToken,
        {
          account
        }
      );
      setAvailableFractions(+toDecimals(balance, decimals));
    })();
    loadData();
  }, [open]);

  const handleSubmit = async () => {
    if (!amount) {
      showAlertMessage('Please fill the amount field', { variant: 'error' });
      return;
    }

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

    if (tab === 0) {
      let response;
      response =
        await web3APIHandler.DistributionManager.stakeCopyrightFractions(
          web3,
          account!,
          {
            contractAddress: podInfo.distributionManagerAddress,
            amount,
            token: podInfo.copyrightToken
          },
          setHash,
          maxPrioFee
        );

      if (response.success) {
        setTransactionSuccess(true);
        await musicDaoStakeMediaFractions({
          podId: pod.Id,
          stakingId: response.data.tokenId,
          amount: response.data.amount,
          type: 'TOKEN'
        });
        onClose();
        handleRefresh();
      } else {
        setTransactionSuccess(false);
        showAlertMessage('Failed to stake tokens', { variant: 'error' });
      }
    } else {
      let response;

      const currentNFT = mediaNFTs.find((nft) => nft.tokenId === selectedNFT);
      const approve = await web3APIHandler.CopyrightNFT.setApprovalForToken(
        web3,
        account,
        currentNFT.tokenAddress,
        {
          to: podInfo.distributionManagerAddress,
          tokenId: selectedNFT
        },
        maxPrioFee
      );

      if (!approve.success) {
        showAlertMessage('Failed to approve the NFT', { variant: 'error' });
        setTransactionSuccess(false);
        return;
      }

      const nft = mediaNFTs.find((n) => n.tokenId === selectedNFT);

      response = await web3APIHandler.DistributionManager.stakeCopyrightNFT(
        web3,
        account!,
        {
          contractAddress: podInfo.distributionManagerAddress,
          tokenId: selectedNFT
        },
        setHash,
        maxPrioFee
      );

      if (response.success) {
        setTransactionSuccess(true);
        await musicDaoStakeMediaFractions({
          podId: pod.Id,
          stakingId: response.data.tokenId,
          tokenId: nft.tokenId,
          amount: nft.amount,
          type: 'NFT'
        });
        onClose();
        handleRefresh();
      } else {
        setTransactionSuccess(false);
        showAlertMessage('Failed to stake tokens', { variant: 'error' });
      }
    }
  };

  const loadData = async () => {
    const resp = await musicDaoGetCopyrightNFTsByPod(pod.Id);
    if (resp.success) {
      const nfts: any[] = [];
      resp.data?.forEach((item) => {
        const found = stakings.find(
          (staking) => staking.tokenId === item.tokenId
        );
        if (!found) {
          nfts.push(item);
        }
      });
      setMediaNFTs(nfts);
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
        <Modal
          size="medium"
          isOpen={open}
          onClose={onClose}
          className={classes.root}
          showCloseIcon
        >
          <Box className={classes.title} mt={2} mb={1}>
            POD Staking
          </Box>
          <Box className={classes.desc} mb={4}>
            Select either your NFT or Media Fractions to stake to start
            receiving the rewards
          </Box>
          <Box className={classes.modalContent} mt={3}>
            <div className={classes.cardsOptions}>
              <div
                onClick={() => setTab(0)}
                className={cls(
                  { [classes.tabHeaderSelected]: tab === 0 },
                  classes.tabHeader
                )}
              >
                Media Fractions
              </div>
              <div
                className={cls(
                  { [classes.tabHeaderSelected]: tab === 1 },
                  classes.tabHeader
                )}
                onClick={() => setTab(1)}
              >
                NFT Staking
              </div>
            </div>
            <div style={{ display: tab === 0 ? 'block' : 'none' }}>
              <InputWithLabelAndTooltip
                labelName="Amount to stake"
                inputValue={amount}
                endAdornment={
                  <Box
                    style={{
                      opacity: 0.5,
                      whiteSpace: 'nowrap',
                      fontSize: isMobile ? '14px' : '18px'
                    }}
                  >
                    Media Fractions
                  </Box>
                }
                onInputValueChange={setAmount}
                type="euro-number"
                overriedClasses={classes.inputContainer}
                placeHolder="0"
              />
              <Box style={{ fontSize: 14 }} mt={1}>
                Balance: {availableFractions} Media Fractions
              </Box>
            </div>
            <div style={{ display: tab === 1 ? 'block' : 'none' }}>
              <Box mt={1} mb={2}>
                Your NFT
              </Box>
              <StyledSelect
                value={selectedNFT}
                onChange={(event) => {
                  setSelectedNFT(event.target.value);
                }}
                fullWidth
                style={{ background: '#F0F5F5', borderRadius: 8 }}
              >
                {mediaNFTs.map((item, index) => (
                  <StyledMenuItem key={index} value={item.tokenId}>
                    <Grid container style={{ padding: 8 }}>
                      <Grid item xs={6}>
                        {pod.Name} #{item.tokenId}
                      </Grid>
                      <Grid item xs={3}>
                        {item.amount} Fractions
                      </Grid>
                      <Grid item xs={3}>
                        {item.share}%
                      </Grid>
                    </Grid>
                  </StyledMenuItem>
                ))}
              </StyledSelect>
            </div>
          </Box>

          <Box display="flex" justifyContent="center" mt={11}>
            <PrimaryButton
              onClick={handleSubmit}
              size="small"
              style={{
                mixBlendMode: 'normal',
                borderRadius: '48px',
                height: '59px',
                padding: '19.5px',

                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: '16px',
                lineHeight: '20px',
                letterSpacing: '-0.04em',
                textAlign: 'center',
                background: '#2D3047',
                width: '352px'
              }}
              isRounded
              disabled={
                (tab === 0 && (!amount || amount <= 0)) ||
                (tab === 1 && !selectedNFT)
              }
            >
              Confirm
            </PrimaryButton>
          </Box>
        </Modal>
      )}
    </>
  );
}
