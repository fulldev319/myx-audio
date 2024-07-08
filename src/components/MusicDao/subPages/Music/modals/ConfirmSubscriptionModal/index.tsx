import React from 'react';

import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import confirmSubscriptionModalStyles from './index.styles';

const ConfirmSubscriptionModal = ({ open, handleClose }) => {
  const classes = confirmSubscriptionModalStyles();
  return (
    <Modal
      className={classes.root}
      size="daoMedium"
      isOpen={open}
      onClose={handleClose}
      showCloseIcon
    >
      <Box className={classes.title} mb={1}>
        Confirm Subscription
      </Box>
      <Box className={classes.description} mb={3}>
        Before confirmation please check the below data to make sure everything
        is allright.
      </Box>
      <Box className={classes.box}>
        <Box className={classes.boxItem}>
          <Box>Listening hours subscribed to</Box>
          <Box>
            24 <span>hours</span>
          </Box>
        </Box>
        <Box className={classes.boxItem}>
          <Box>amount to be paid</Box>
          <Box>
            244 <span>USDT</span>
          </Box>
        </Box>
        <Box className={classes.boxItem}>
          <Box>automatic monthly renewal</Box>
          <Box>Yes</Box>
        </Box>
      </Box>
      <Box display={'flex'} justifyContent={'center'} mt={4}>
        <PrimaryButton size="medium">confirm</PrimaryButton>
      </Box>
    </Modal>
  );
};

export default ConfirmSubscriptionModal;
