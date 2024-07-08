import React, { FC } from 'react';

import SvgIcon from '@material-ui/core/SvgIcon';

import { Modal } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { modalStyles } from './modalStyles';
import { ReactComponent as MetamaskSvg } from 'assets/walletImages/metamask1.svg';

declare let window: any;

interface IProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  account: string;
}

const USDT_ADDRESS = '0x2cA48b8c2d574b282FDAB69545646983A94a3286';

const USDTGetModal: FC<IProps> = (props) => {
  const classes = modalStyles();

  const { open, onClose, amount, account } = props;

  const handleClose = () => {
    onClose && onClose();
  };

  const onAddUSDT = async () => {
    if (!window.ethereum) {
      return;
    }
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: USDT_ADDRESS,
          symbol: 'USDT',
          decimals: 6,
          image:
            'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/images/contract/usdt.svg'
        }
      }
    });
    handleClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      showCloseIcon
      size="small"
      className={classes.container}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <img
          src={require('assets/tokenImages/USDT.webp')}
          alt="USDT"
          width={96}
          height={96}
        />
        <Box className={`${classes.subTitle} ${classes.green}`} mt={4} mb={4}>
          Received {amount}
          <br />
          Test USDT Tokens
        </Box>
        <Box className={classes.description} mb={4}>
          You have just received&nbsp;<b>{amount} USDT Testnet Tokens</b>
          &nbsp;to try out the Myx App features before we rollout the Mainnet
          version shortly.
          <br />
          <br />
          <strong>Include USDT Test Token</strong>&nbsp;on your token list with
          Metamask. The address is
          <br />
          <Box className={classes.green}>{USDT_ADDRESS}</Box>
        </Box>
        <button onClick={onAddUSDT}>
          Add USDT to Metamask&nbsp;&nbsp;+&nbsp;&nbsp;
          <SvgIcon className={classes.buttonImage}>
            <MetamaskSvg />
          </SvgIcon>
        </button>
      </Box>
    </Modal>
  );
};

export default USDTGetModal;
