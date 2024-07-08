import React, { useState } from 'react';

import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import { Modal } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import {
  breedBopModalStyles,
  LevelIcon,
  ConfirmIcon,
  BeatIcon
} from './index.styles';

const BreedBopModal = (props: any) => {
  const classes = breedBopModalStyles();

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
        <LevelIcon />
        <div className={classes.title}>Your Bop Level</div>
        <div className={classes.title1}>4</div>
        <div className={classes.title2}>200 Beats to next level</div>
        <div className={classes.subTitle}>Feed with Beats</div>
        <div className={classes.subTitle1}>
          Feeding enables to level up your Bops to higher level card that bring
          higher level of rewards.
        </div>
        <div className={classes.shareSection}>
          <Box fontSize={18} fontWeight={600} color="#54658F">
            AVAILABLE BEATS
          </Box>
          <Box fontSize={26} fontWeight={800} color="#1ABB00" mt={1}>
            2255 Beats
          </Box>
        </div>
        <Box display="flex" flexDirection="column" width={1} mt={4}>
          <Box fontSize={16} fontWeight={600} color="#2D3047">
            Amount
          </Box>
          <div className={classes.traxpAmountSection}>
            <span>2</span>
            <Box display="flex" alignItems="center">
              <Box fontSize={16} fontWeight={400} color="#707582" mr={2}>
                Beats
              </Box>
              <BeatIcon />
            </Box>
          </div>
          <Box display="flex" mt={'13px'} justifyContent="flex-end">
            <Box fontSize={14} fontWeight={400} color="#707582" mr={'6px'}>
              Fees:
            </Box>
            <Box fontSize={14} fontWeight={700} color="#707582">
              0.000521 USDp
            </Box>
          </Box>
        </Box>
        <div
          className={classes.confirmBtn}
          onClick={() => {
            props.onConfirm();
          }}
        >
          <ConfirmIcon />
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

export default BreedBopModal;
