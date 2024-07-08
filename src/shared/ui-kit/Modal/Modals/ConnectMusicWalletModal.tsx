import React from 'react';

import { Modal, PrimaryButton } from 'shared/ui-kit';
import { connectMusicWalletModalStyles } from './ConnectMusicWalletModal.styles';

const connectIcon = require('assets/walletImages/connect.svg');

interface IConnectMusicWalletModalProps {
  open: boolean;
  handleClose: () => void;
  handleConnect?: () => void;
}

export const ConnectMusicWalletModal: React.FC<
  IConnectMusicWalletModalProps
> = ({ open, handleClose, handleConnect }) => {
  const classes = connectMusicWalletModalStyles();

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={handleClose}
      showCloseIcon
      className={classes.root}
    >
      <div className={classes.content}>
        <div className={classes.iconBar}>
          <div className={classes.musicIcon}>
            <img
              src={require('assets/logos/MUSICLOGO.webp')}
              style={{ width: 70, marginTop: 13, marginRight: 9 }}
              alt="musicWallet"
            />
            <h5>Music</h5>
            <h6>www.music.io</h6>
          </div>
          <div className={classes.connectorIcon}>
            <img src={connectIcon} alt="connect" />
          </div>
          <div className={classes.musicIcon}>
            <img
              src={require('assets/tokenImages/MUSIC.webp')}
              style={{ width: 70 }}
              alt="musicWallet"
            />
            <h5>Music Wallet</h5>
          </div>
        </div>
        <h3 className={classes.title}>
          Music would like to <br></br> connect to your account
        </h3>
        <p className={classes.description}>
          This site is requesting access to view your current account address.
          Always make sure you trust the sites you interact with
        </p>
        <p className={classes.mainNetwork}>Main Network: hyper ledger fabrik</p>
        <PrimaryButton size="medium" onClick={handleConnect}>
          Connect
        </PrimaryButton>
      </div>
    </Modal>
  );
};
