import React, { useState, createContext, useEffect } from 'react';
import crypto from 'crypto';
import ecies from 'ecies-parity';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { PlayerKeyModal } from 'components/MusicDao/modals/PlayerKeyModal';
import { getCompressedPublicKey } from 'shared/functions/publicKeyConverter';
import { getPlayerKey } from 'shared/functions/ipfs/hls';
import checkAddressFromSignature from 'shared/functions/ipfs/checkAddressFromSignature';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { signObjectWithMetamask } from 'shared/services/WalletSign';
import { useHistory } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const defaultPlayerState = {
  url: null,
  pip: false,
  playing: false,
  validated: true,
  controls: false,
  light: false,
  volume: 100,
  muted: false,
  played: 0,
  loaded: 0,
  duration: 0,
  playbackRate: 1.0,
  loop: false,
  volumeOpen: false,
  dropdownOpen: false,
  fullscreen: false,
  seeking: false,
  playedSeconds: 0,
  loading: false
};

type MediaPlayerKeyContextType = {
  showPlayerKeyModal: () => void;
  playerKeyIsReady: boolean;
  setPlayerKeyIsReady: (key: boolean) => void;
  freeMusicTime: any;
  setFreeMusicTime: (number: any) => void;
  selectedSong: any;
  setSelectedSong: (song: any) => void;
  playerState: any;
  setPlayerState: (song: any) => void;
};

export const MediaPlayerKeyContext = createContext<MediaPlayerKeyContextType>({
  showPlayerKeyModal: () => {},
  playerKeyIsReady: false,
  setPlayerKeyIsReady: (key: boolean) => {},
  freeMusicTime: 0,
  setFreeMusicTime: (number: any) => {},
  selectedSong: { url: '', duration: 0 },
  setSelectedSong: (song: any) => {},
  playerState: { ...defaultPlayerState },
  setPlayerState: (song: any) => {}
});

export const MediaPlayerKeyContextProvider = ({ children }) => {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playerKeyIsReady, setPlayerKeyIsReady] = useState(false);
  const { account, library } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const { isSignedin } = useAuth();
  const [freeMusicTime, setFreeMusicTime] = useState<number>(14400);
  const [selectedSong, setSelectedSong] = useState<any>({
    url: '',
    duration: 0
  });
  const [playerState, setPlayerState] = useState<any>({
    ...defaultPlayerState
  });
  const setPlayerKeyStatus = async () => {
    const key = getPlayerKey();
    if (key) {
      const publicKey = localStorage.getItem('player_public_key');
      const { signatureStr } = key;
      const address = localStorage.getItem('address');
      if (address) {
        const isPreviousOne = await checkAddressFromSignature(
          address,
          signatureStr,
          publicKey
        );
        if (isPreviousOne) {
          setPlayerKeyIsReady(true);
          return;
        }
      }
    }
    setPlayerKeyIsReady(false);
  };
  useEffect(() => {
    setPlayerKeyStatus();
  });

  const showModal = () => {
    if (isSignedin) setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    showAlertMessage(
      "You can't play the track without valid media encryption key!",
      { variant: 'error' }
    );
    history.push('/');
  };

  const createPlayerKey = async () => {
    let privateKey, publicKey, privateKeyStr, publicKeyStr;
    privateKey = crypto.randomBytes(32);
    publicKey = getCompressedPublicKey(ecies.getPublic(privateKey));

    privateKeyStr = privateKey.toString('hex');
    publicKeyStr = publicKey.toString('hex');

    if (!account) return;

    try {
      const web3 = new Web3(library.provider);
      const signature = await signObjectWithMetamask(
        account,
        web3,
        'Myx',
        'Media Encryption Public Key',
        publicKeyStr
      );
      console.log({ signature });

      localStorage.setItem('player_private_key', privateKeyStr);
      localStorage.setItem('player_public_key', publicKeyStr);
      localStorage.setItem('player_public_key_signature_v2', signature);

      setPlayerKeyIsReady(true);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      onClose();
    }
  };

  const context = {
    showPlayerKeyModal: showModal,
    playerKeyIsReady,
    setPlayerKeyIsReady,
    freeMusicTime,
    setFreeMusicTime,
    selectedSong,
    setSelectedSong,
    playerState,
    setPlayerState
  };

  return (
    <MediaPlayerKeyContext.Provider value={context}>
      {children}
      {isModalOpen && !playerKeyIsReady && (
        <PlayerKeyModal
          open={isModalOpen}
          onCancel={onClose}
          onSign={createPlayerKey}
        />
      )}
    </MediaPlayerKeyContext.Provider>
  );
};
