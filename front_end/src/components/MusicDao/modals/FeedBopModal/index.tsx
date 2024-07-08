import React, { useState } from 'react';

import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import { Modal } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { feedBopModalStyles, DoneIcon } from './index.styles';

const FeedBopModal = (props: any) => {
  const classes = feedBopModalStyles();

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
        <img src={require('assets/musicDAOImages/bop.webp')} alt="bop" />
        <div className={classes.title}>You have fed your Bop</div>
        <div className={classes.subTitle}>
          You are at 100 Beats to reach new level.
        </div>
        <div className={classes.shareSection}>
          <div>
            <Box fontSize={14} fontWeight={500} color="#2D3047">
              Beats used
            </Box>
            <Box fontSize={18} fontWeight={600} color="#65CB63" mt={1}>
              55 Beats
            </Box>
          </div>
          <Box width="1px" height={'57px'} bgcolor="#DAE6E5"></Box>
          <div>
            <Box fontSize={14} fontWeight={500} color="#2D3047">
              For next level
            </Box>
            <Box fontSize={18} fontWeight={600} color="#65CB63" mt={1}>
              55 Beats
            </Box>
          </div>
        </div>
        <div
          className={classes.confirmBtn}
          onClick={() => {
            props.onConfirm();
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

export default FeedBopModal;
