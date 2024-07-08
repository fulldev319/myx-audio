import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import UnstakeRedeemModal from 'components/MusicDao/modals/UnstakeRedeemModal';

import Box from 'shared/ui-kit/Box';
import { PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import { formatDateDefault } from 'shared/helpers';

const useStyles = makeStyles((theme) => ({
  card: {
    background: '#FFFFFF',
    boxShadow: '0px 15px 16px -11px rgba(0, 0, 0, 0.02)',
    borderRadius: '20px',
    padding: '40px 24px 30px',

    color: '#2D3047'
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '24px'
  },
  flexSpaceBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  header1: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '17px',
    opacity: 0.7
  },
  header2: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '17px',
    textAlign: 'right'
  },
  divider: {
    margin: '19px 0px 14px',
    width: 'calc(100% + 24px * 2)',
    marginLeft: '-24px',
    height: '1px',
    opacity: 0.1,
    background: '#000000'
  }
}));

export default function StakingPodCard({
  staking,
  pod,
  podInfo,
  handleRefresh
}: {
  staking: any;
  pod: any;
  podInfo: any;
  handleRefresh: any;
}) {
  const classes = useStyles();

  const [openUnstakeRedeemModal, setOpenUnstakeRedeemModal] = useState<
    'unstake' | 'redeem' | boolean
  >(false);

  return (
    <div
      className={classes.card}
      // style={{ background: expired ? "linear-gradient(0deg, #F4F8FC, #F4F8FC)" : "white" }}
    >
      <Box className={classes.title} mb={5}>
        {staking.position}
      </Box>
      <Box className={classes.flexSpaceBox}>
        <Box className={classes.header1}>Amount of Fractions</Box>
        <Box className={classes.header2}>{staking.amount.toLocaleString()}</Box>
      </Box>
      <div className={classes.divider} />
      <Box className={classes.flexSpaceBox}>
        <Box className={classes.header1}>Date</Box>
        <Box className={classes.header2}>
          {formatDateDefault(staking.timestamp)}
        </Box>
      </Box>
      <div className={classes.divider} />
      <Box className={classes.flexSpaceBox}>
        <Box className={classes.header1}>Rewards Accumulated</Box>
        <Box className={classes.header2}>
          {staking.rewardsAccumulated ?? 0}&nbsp;USDT
        </Box>
      </Box>

      <Box mt={8} display="flex" justifyContent="space-between">
        <SecondaryButton
          size="small"
          onClick={() => setOpenUnstakeRedeemModal('unstake')}
          style={{
            background: 'transparent',
            borderRadius: '46px',
            padding: '11px',

            fontWeight: 600,
            fontSize: '14px',
            flex: 1,
            lineHeight: '18px',
            color: '#2D3047',
            border: '1px solid rgba(84, 101, 143, 0.3)',
            height: 'auto'
          }}
          isRounded
        >
          Unstake
        </SecondaryButton>
        <PrimaryButton
          size="small"
          onClick={() => setOpenUnstakeRedeemModal('redeem')}
          style={{
            background: '#2D3047',
            borderRadius: '46px',
            padding: '11px',

            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '18px',
            flex: 1,
            marginLeft: '15px',
            color: 'white',
            border: 'none',
            height: 'auto'
          }}
          isRounded
        >
          Redeem
        </PrimaryButton>
      </Box>

      <UnstakeRedeemModal
        open={openUnstakeRedeemModal !== false}
        type={openUnstakeRedeemModal}
        staking={staking}
        pod={pod}
        podInfo={podInfo}
        onClose={() => setOpenUnstakeRedeemModal(false)}
        handleRefresh={handleRefresh}
      />
    </div>
  );
}
