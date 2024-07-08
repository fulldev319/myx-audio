import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { PrimaryButton, SecondaryButton } from 'shared/ui-kit';

import { BlockchainNets } from 'shared/constants/constants';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { switchNetwork } from 'shared/functions/metamask';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import {
  musicDaoClaimReward,
  musicDaoUnstakeMediaFractions
} from 'shared/services/API';
import TransactionProgressModal from '../TransactionProgressModal';
import { toDecimals } from 'shared/functions/web3';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';

const TYPE = {
  UNSTAKE: 'unstake',
  REDEEM: 'redeem'
};

const useStyles = makeStyles(() => ({
  root: {
    width: '755px !important',
    padding: '40px 40px 50px !important'
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '22px',
    lineHeight: '130%',
    textAlign: 'center',
    color: '#2D3047'
  },
  desc: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '150%',
    textAlign: 'center',
    color: '#54658F'
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
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #7BCBB7',
    borderRadius: '55px',
    padding: '9px 25px 9px 34px',
    height: 56,

    '& img': {
      height: 38,
      width: 38,
      marginLeft: '-20px'
    }
  },
  greenBox: {
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    borderRadius: '12px',
    padding: '32px 48px'
  },
  greenText: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '18px',
    lineHeight: '104.5%',
    textTransform: 'uppercase',
    color: '#65CB63'
  },
  amount: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '28px',
    lineHeight: '104.5%',
    color: '#2D3047',
    '& span': {
      color: '#707582'
    }
  }
}));

export default function UnstakeRedeemModal({
  open,
  onClose,
  type,
  staking,
  pod,
  podInfo,
  handleRefresh
}: {
  open: boolean;
  type: 'unstake' | 'redeem' | boolean;
  onClose: any;
  staking: any;
  pod: any;
  podInfo: any;
  handleRefresh: any;
}) {
  const classes = useStyles();
  const { showAlertMessage } = useAlertMessage();

  const [amount, setAmount] = React.useState<number>(0);

  const { account, library, chainId } = useWeb3React();

  const [hash, setHash] = useState<string>('');
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [openTranactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  const { maxPrioFee } = useMaxPrioFee();

  useEffect(() => {
    if (open && type === 'redeem') {
      (async () => {
        const targetChain = BlockchainNets.find(
          (net) => net.value === 'Polygon blockchain'
        );
        const web3APIHandler = targetChain.apiHandler;
        const web3 = new Web3(library.provider);

        const response =
          await web3APIHandler.DistributionManager.getCopyrightRewards(web3, {
            contractAddress: podInfo.distributionManagerAddress,
            id: staking.id
          });

        if (response) {
          const decimals = await web3APIHandler.Erc20[
            pod.FundingToken
          ].decimals(web3, podInfo.fundingToken);
          setAmount(Number(toDecimals(response, decimals)));
        } else {
          setAmount(0);
        }
      })();
    } else if (type === 'unstake' && staking.type === 'NFT') {
      setAmount(staking.amount);
    } else {
      setAmount(0);
    }
  }, [open, staking, type]);

  const handleSubmit = async () => {
    setOpenTransactionModal(true);

    const targetChain = BlockchainNets.find(
      (net) => net.value === 'Polygon blockchain'
    );
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0x89);
      if (!isHere) {
        showAlertMessage('Got failed while switching over to target netowrk', {
          variant: 'error'
        });
        return;
      }
    }
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    if (type === TYPE.REDEEM) {
      const response =
        await web3APIHandler.DistributionManager.claimCopyrightFractionRewards(
          web3,
          account!,
          {
            contractAddress: podInfo.distributionManagerAddress,
            id: staking.id
          },
          setHash,
          maxPrioFee
        );
      if (response.success) {
        setTransactionSuccess(true);
        const resp = await musicDaoClaimReward({
          podId: pod.Id,
          tokenId: staking.id,
          amount: response.data.reward
        });
        afterSuccess(resp);
      } else {
        setTransactionSuccess(false);
        showAlertMessage('Failed to claim reward.', { variant: 'error' });
      }
    } else {
      if (staking.type === 'TOKEN') {
        const response =
          await web3APIHandler.DistributionManager.unstakeCopyrightFractions(
            web3,
            account!,
            {
              amount,
              contractAddress: podInfo.distributionManagerAddress,
              token: podInfo.copyrightToken,
              id: staking.id
            },
            setHash,
            maxPrioFee
          );
        if (response.success) {
          setTransactionSuccess(true);
          const resp = await musicDaoUnstakeMediaFractions({
            podId: pod.Id,
            stakingId: staking.id,
            amount: response.data.amount
          });
          afterSuccess(resp);
        } else {
          setTransactionSuccess(false);
          showAlertMessage('Failed to unstake tokens', { variant: 'error' });
        }
      } else if (staking.type === 'NFT') {
        const response =
          await web3APIHandler.DistributionManager.unstakeCopyrightNFT(
            web3,
            account!,
            {
              contractAddress: podInfo.distributionManagerAddress,
              id: staking.id
            },
            setHash,
            maxPrioFee
          );
        if (response.success) {
          setTransactionSuccess(true);
          const resp = await musicDaoUnstakeMediaFractions({
            podId: pod.Id,
            stakingId: staking.id,
            type: 'NFT'
          });
          afterSuccess(resp);
        } else {
          setTransactionSuccess(false);
          showAlertMessage('Failed to unstake tokens', { variant: 'error' });
        }
      }
    }
  };

  const afterSuccess = (response) => {
    if (response.success) {
      onClose();
      handleRefresh();
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
          <Box className={classes.title} mb={2}>
            {type === TYPE.UNSTAKE ? 'Unstake' : 'Redeem'}
          </Box>
          {/* <Box className={classes.desc} mb={6}>
            {type === TYPE.UNSTAKE
              ? "In order to unstake your funds input the amount you would like to unstake in the input below. "
              : "In order to redeem your funds input the amount you would like to redeem in the input below. "}
          </Box> */}

          {type === TYPE.UNSTAKE && staking.type === 'TOKEN' && (
            <>
              <Box className={classes.label}>Amount</Box>
              <InputWithLabelAndTooltip
                inputValue={amount.toString()}
                endAdornment={
                  <Box style={{ opacity: 0.5, whiteSpace: 'nowrap' }}>
                    {pod.TokenSymbol}
                  </Box>
                }
                onInputValueChange={setAmount}
                type="euro-number"
                overriedClasses={classes.inputContainer}
              />
            </>
          )}

          <Box className={classes.greenBox} mt={'20px'} mb={7}>
            <Box mb={1} className={classes.greenText}>
              Amount to be paid out{' '}
            </Box>
            <Box className={classes.amount}>
              {amount}{' '}
              <span>{type === TYPE.REDEEM ? 'USD' : pod.TokenSymbol}</span>
            </Box>
          </Box>

          <Box display="flex" alignItems="center">
            <SecondaryButton
              onClick={onClose}
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
                width: '100%',
                color: '#2D3047',
                border: '1px solid #2D3047'
              }}
              isRounded
            >
              Cancel
            </SecondaryButton>
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
                width: '100%',
                marginLeft: '18px',
                background: '#2D3047'
              }}
              isRounded
            >
              {type === TYPE.UNSTAKE ? 'Unstake' : 'Redeem'}
            </PrimaryButton>
          </Box>
        </Modal>
      )}
    </>
  );
}
