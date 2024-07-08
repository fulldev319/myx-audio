import React, { useState } from 'react';

import { Color, Modal, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { BlockchainNets } from 'shared/constants/constants';
import { BlockchainTokenSelect } from 'shared/ui-kit/Select/BlockchainTokenSelect';
import { IMediaStaking } from 'shared/types/Stake';
import { unstakingModalStyles } from './index.styles';

interface IUnstakingModalProps {
  stake?: IMediaStaking;
  open: boolean;
  handleClose: any;
  unStake: any;
  isStaking?: boolean;
}

const UnstakingModal: React.FC<IUnstakingModalProps> = (
  props: IUnstakingModalProps
) => {
  const classes = unstakingModalStyles();
  const [blockChain, setBlockChain] = useState<any>(BlockchainNets[0].name);

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      <Box className={classes.contentBox}>
        <Box className={classes.flexBox} justifyContent="center">
          <Box className={classes.header1}>Unstake</Box>
        </Box>
        <Box className={classes.header2} mt={2}>
          {props.isStaking
            ? 'In order to unstake your funds input the amount you wuld like to unstake in the input below. '
            : `In order to unstake your funds of  ${props.stake?.Debt}TRAX You will need to pay back the loan of 225 TRAX or wait till loan gets paid automatically to receive your funds.`}
        </Box>
        <Box
          className={classes.header2}
          color="#2D3047  !important"
          mt={'44px'}
          mb={2}
        >
          Select Chain
        </Box>
        <Box className={classes.chainBorderBox}>
          <BlockchainTokenSelect
            network={blockChain}
            setNetwork={setBlockChain}
            BlockchainNets={BlockchainNets}
            isReverse
          />
        </Box>
        <Box
          className={classes.header2}
          color="#2D3047 !important"
          mt={'36px'}
          mb={2}
        >
          Amount
        </Box>
        <Box className={classes.borderBox}>
          <img src={require('assets/tokenImages/USDT.webp')} width="40px" />
          <Box className={classes.header2_1}>{props.stake?.Debt || 0} USDT</Box>
        </Box>
        <Box className={classes.controlBox} mt={7}>
          {!props.isStaking && (
            <>
              <Box className={classes.header3}>AMOUNT LEFT TO REPAY</Box>
              <Box
                className={classes.header4}
                borderBottom="1px solid #00000022"
                pb={1}
              >
                ${props.stake?.Debt}{' '}
                <span style={{ color: '#2D304770', marginLeft: '8px' }}>
                  TRAX
                </span>
              </Box>
            </>
          )}
          <Box
            className={classes.header3}
            mt={2}
            style={{ color: Color.MusicDAOGreen }}
          >
            AMOUNT TO BE PAID OUT
          </Box>
          <Box className={classes.header4}>
            {props.stake?.Debt || 0}{' '}
            <span style={{ color: '#2D304770', marginLeft: '8px' }}>USDT</span>
          </Box>
        </Box>
        <Box
          mt={'47px'}
          className={classes.buttonGroup}
          justifyContent="space-around"
        >
          <SecondaryButton
            size="medium"
            onClick={props.handleClose}
            isRounded
            style={{
              borderRadius: 48,
              paddingLeft: '48px',
              paddingRight: '48px',
              height: 59
            }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            onClick={() => {
              props.handleClose();
              props.unStake();
            }}
            isRounded
            style={{
              borderRadius: 48,
              paddingLeft: '48px',
              paddingRight: '48px',
              height: 59,
              backgroundColor: '#2D3047'
            }}
          >
            Unstake
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default UnstakingModal;
