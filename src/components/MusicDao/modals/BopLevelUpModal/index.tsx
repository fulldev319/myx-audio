import React, { useState } from 'react';

import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import { Modal } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { bopLevelUpModalStyles, DoneIcon } from './index.styles';

const BopLevelUpModal = (props: any) => {
  const classes = bopLevelUpModalStyles();

  const [status, setStatus] = useState<any>('');

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      className={classes.root}
    >
      <Box className={classes.contentBox}>
        <img
          src={require('assets/musicDAOImages/level_up.webp')}
          alt="level"
          className={classes.logoImg}
        />
        <div className={classes.title}>Congrats, your Bop level is up!</div>
        <div className={classes.subTitle}>
          You have successfully created your TRAX position.
        </div>
        <div className={classes.subTitle}>
          You can find your evolving NFT in <span>Management page.</span>
        </div>
        <div className={classes.shareSection}>
          <Box fontSize={14} fontWeight={500} color="#2D3047">
            Beats to next level
          </Box>
          <Box fontSize={22} fontWeight={800} color="#65CB63" mt={1}>
            2255 Beats
          </Box>
        </div>
        <div
          className={classes.confirmBtn}
          onClick={() => {
            props.onClose();
          }}
        >
          <DoneIcon />
        </div>
      </Box>
      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus(undefined)}
        />
      )}
    </Modal>
  );
};

export default BopLevelUpModal;
