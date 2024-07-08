import React, { useState } from 'react';

import { Color, Modal, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { BlockchainNets } from 'shared/constants/constants';
import { IMediaStaking } from 'shared/types/Stake';
import { stakingModalStyles } from './index.styles';

interface IStakingModalProps {
  stake?: IMediaStaking;
  open: boolean;
  handleClose: any;
  handleStaking: any;
  isStaking?: boolean;
}

const StakingModal: React.FC<IStakingModalProps> = (
  props: IStakingModalProps
) => {
  const classes = stakingModalStyles();
  const [blockChain, setBlockChain] = useState<any>(BlockchainNets[0].name);

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      <div className={classes.contentBox}>
        <Box className={classes.flexBox} justifyContent="center">
          <Box className={classes.header1}>Stake USDT</Box>
        </Box>
        <Box
          className={classes.header2}
          mt={'10px'}
          textAlign="center"
          px={'100px'}
        >
          To stake your USDT input the amount you want to stake in field below
          and enjoy the APR
        </Box>
        <div className={classes.controlBox}>
          <Box className={classes.header3}>AVAILABLE USDT</Box>
          <Box mt={'10px'} className={classes.header4}>
            {props.stake?.Debt || 0} USDT
          </Box>
        </div>
        <Box
          className={classes.header2}
          color="#2D3047 !important"
          mt={'43px'}
          mb={2}
        >
          Amount
        </Box>
        <div className={classes.borderBox}>
          <img src={require('assets/tokenImages/USDT.webp')} width="40px" />
          <div className={classes.header2_1}>{props.stake?.Debt || 0} USDT</div>
        </div>
        <div className={classes.header5}>Fee: 0.000521 USDp</div>
        <div className={classes.buttonGroup}>
          <PrimaryButton
            size="medium"
            onClick={() => {
              props.handleClose();
              props.handleStaking();
            }}
            isRounded
            style={{
              borderRadius: 48,
              paddingLeft: '104px',
              paddingRight: '104px',
              height: 59,
              backgroundColor: '#2D3047'
            }}
          >
            Confirm Purchase
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default StakingModal;
