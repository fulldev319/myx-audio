import React, { useState } from 'react';

import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import { Modal } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { Dropdown } from 'shared/ui-kit/Select/Select';
import { BlockchainNets } from 'shared/constants/constants';
import { exchangeModalStyles, UpArrowIcon } from './index.styles';

const TradeTraxModal = (props: any) => {
  const classes = exchangeModalStyles();

  const [status, setStatus] = useState<any>('');
  const [selectedNet, setSelectedNet] = useState<string>('Music Chain');

  const connectWallet = () => {};

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      <Box className={classes.contentBox}>
        <div className={classes.title}>Trade USDT for TRAXp</div>
        <Box
          fontSize={16}
          fontWeight={600}
          color="#54658F"
          mt={3}
          textAlign="center"
          px={'100px'}
        >
          Users will listen from 0 to 4hours of music on Music Platform within
          next 24hours
        </Box>
        <div className={classes.shareSection}>
          <Box fontSize={18} fontWeight={700} color="#54658F">
            {`SHARES AT`}
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            mt={'10px'}
          >
            <Box fontSize={26} fontWeight={800} color="#1ABB00">
              {`17.456 pUSD`}
            </Box>
            <div className={classes.sharePercentageSection}>
              <UpArrowIcon />
              <span>{`-3%`}</span>
            </div>
          </Box>
        </div>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          width={1}
        >
          <Box fontSize={16} fontWeight={600} color="#2D3047">
            Amount of TRAXp
          </Box>
          <Box fontSize={16} fontWeight={600} color="#65CB63">
            Total cost
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width={1}
          mb={'13px'}
        >
          <div className={classes.traxpAmountSection}>2</div>
          <div className={classes.totalCostSection}>34,912</div>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={'36px'}
          width={1}
        >
          <Box display="flex">
            <Box fontSize={14} fontWeight={400} color="#707582" mr={'6px'}>
              Available balance:
            </Box>
            <Box fontSize={14} fontWeight={700} color="#707582">
              MusicUSD
            </Box>
          </Box>
          <Box display="flex">
            <Box fontSize={14} fontWeight={400} color="#707582" mr={'6px'}>
              Fees:
            </Box>
            <Box fontSize={14} fontWeight={700} color="#707582">
              0.000521 USDp
            </Box>
          </Box>
        </Box>
        <Box fontSize={16} fontWeight={600} color="#2D3047" mb={2} width={1}>
          Choose Blockchain Network
        </Box>
        <Dropdown
          value={selectedNet}
          menuList={BlockchainNets}
          onChange={(e) => {
            setSelectedNet(e.target.value);
          }}
          className={classes.blockchainNetSection}
          hasImage
        />
        {/* <div className={classes.connectWalletBtn} onClick={() => {}}>
          Connect Wallet
        </div> */}
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

export default TradeTraxModal;
