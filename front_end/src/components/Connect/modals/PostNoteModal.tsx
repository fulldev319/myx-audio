import React, { FC, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import { Modal } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { modalStyles } from './modalStyles';

declare let window: any;
const isDev = process.env.REACT_APP_ENV === 'dev';
const networkId = isDev ? 80001 : 137;
interface IProps {
  open: boolean;
  onClose: () => void;
  onNext?: () => void;
}

const PostNoteModal: FC<IProps> = (props) => {
  const classes = modalStyles();
  const { chainId } = useWeb3React();

  const { open, onClose, onNext } = props;
  const [isSubmitted, setSubmitted] = useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();
  useEffect(() => {
    if (open) {
      setSubmitted(false);
    }
  }, [open]);

  const handleClose = () => {
    onClose && onClose();
  };

  useEffect(() => {
    if (chainId === networkId && isSubmitted) {
      onNext && onNext();
    }
  }, [chainId]);

  const onSuccess = async () => {
    if (chainId !== networkId) {
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${networkId.toString(16)}` }]
          });
          showAlertMessage(
            `Switch to ${isDev ? 'Mumbai' : 'Polygon'} network successful!`,
            {
              variant: 'success'
            }
          );
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: `0x${networkId.toString(16)}`,
                    chainName: 'Polygon Network',
                    rpcUrls: isDev
                      ? ['https://rpc-mumbai.maticvigil.com/']
                      : ['https://rpc-mainnet.maticvigil.com/'],
                    nativeCurrency: {
                      name: 'MATIC',
                      symbol: 'MATIC',
                      decimals: 18
                    }
                  }
                ]
              });
              showAlertMessage(
                `S${isDev ? 'Mumbai' : 'Polygon'} network added successfully!`,
                {
                  variant: 'success'
                }
              );
            } catch (addError) {
              showAlertMessage(
                `Failed to add ${isDev ? 'Mumbai' : 'Polygon'} network!`,
                {
                  variant: 'error'
                }
              );
              return;
            }
          }
          showAlertMessage(
            `Failed to switch to ${isDev ? 'Mumbai' : 'Polygon'} network!`,
            {
              variant: 'error'
            }
          );
        }

        setSubmitted(true);
      }
    } else {
      onNext && onNext();
    }
  };

  const onAddNetwork = async () => {
    try {
      if (window.ethereum) {
        await (window as any).ethereum
          .request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${networkId.toString(16)}`,
                chainName: 'Polygon Network',
                rpcUrls: isDev
                  ? ['https://rpc-mumbai.maticvigil.com/']
                  : ['https://rpc-mainnet.maticvigil.com/'],
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                }
              }
            ]
          })
          .then(() => {
            showAlertMessage(
              `Successfully add the ${isDev ? 'Mumbai' : 'Polygon'} network!`,
              {
                variant: 'success'
              }
            );
          })
          .catch((error) => {
            showAlertMessage(
              `Failed to add the ${isDev ? 'Mumbai' : 'Polygon'} network!`,
              {
                variant: 'error'
              }
            );
          });
      }
    } catch (addError) {
      // handle "add" error
      console.log(addError);
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      size="small"
      className={`${classes.container} ${classes.gradientContainer}`}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box className={classes.warning} mb={4}>
          ⚠️
        </Box>
        <Box className={classes.title} mb={4}>
          IMPORTANT
        </Box>
        {!isDev ? (
          <Box className={classes.description} mb={4}>
            The platform is running on the <b>Polygon</b> blockchain network. A
            side-chain of Ethereum, the Polygon network can be added to your
            Metamask wallet, and you will need MATIC tokens for network fees. To
            add Polygon to your Metamask,{' '}
            <a
              href="https://medium.com/stakingbits/setting-up-metamask-for-polygon-matic-network-838058f6d844"
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              read this
            </a>{' '}
            or{' '}
            <a
              style={{
                textDecoration: 'none',
                color: '#551A8B',
                cursor: 'pointer'
              }}
              onClick={onAddNetwork}
            >
              click here
            </a>{' '}
            to add in one click.
          </Box>
        ) : (
          <Box className={classes.description} mb={4}>
            The platform is being tested on <b>Mumbai Testnet</b>, a test
            network on the Polygon blockchain. To interact with the platform you
            will need to add the network to your Metamask. For more details,
            please{' '}
            <a
              href="https://medium.com/stakingbits/setting-up-metamask-for-polygon-matic-network-838058f6d844"
              target="_blank"
            >
              click here
            </a>
            {'.'}
          </Box>
        )}
        <button onClick={onSuccess}>
          {chainId !== networkId
            ? `I understood it. Connect me to ${isDev ? 'Mumbai' : 'Polygon'}`
            : 'I understood it'}
        </button>
      </Box>
    </Modal>
  );
};

export default PostNoteModal;
