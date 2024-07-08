import React, { FC } from 'react';

import SvgIcon from '@material-ui/core/SvgIcon';

import { Modal } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { ReactComponent as MetamaskSvg } from 'assets/walletImages/metamask1.svg';
import { modalStyles } from './modalStyles';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const NoMetamaskModal: FC<IProps> = ({ open, onClose }) => {
  const classes = modalStyles();

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      showCloseIcon
      size="small"
      className={classes.container}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <SvgIcon className={classes.logoImage}>
          <MetamaskSvg />
        </SvgIcon>
        <Box className={classes.subTitle} mt={4} mb={4}>
          Don’t have Metamask?
        </Box>
        <Box className={classes.description} mb={4}>
          Download the metamask browser extension to get connected
        </Box>
        <button onClick={() => window.open('https://metamask.io/', '_blank')}>
          Go to Metamask Website
        </button>
      </Box>
    </Modal>
  );
};

export default NoMetamaskModal;
