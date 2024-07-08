import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { useDebounce } from 'use-debounce/lib';

import Autocomplete from '@material-ui/lab/Autocomplete';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';

import { RootState } from 'store/reducers/Reducer';
import TransactionProgressModal from '../TransactionProgressModal';

import { Avatar, Color, Modal, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { BlockchainNets } from 'shared/constants/constants';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { switchNetwork } from 'shared/functions/metamask';
import { toDecimals, toNDecimals } from 'shared/functions/web3';
import {
  getMatchingUsers,
  IAutocompleteUsers,
  musicDaoSendInvitation
} from 'shared/services/API';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';
import { processImage } from 'shared/helpers';

import { addCreatorModalStyles, useAutocompleteStyles } from './index.styles';

const AddCreatorModal = ({ open, pod, handleClose, handleRefresh }) => {
  const classes = addCreatorModalStyles();
  const user = useSelector((state: RootState) => state.user);

  const autocompleteStyle = useAutocompleteStyles();
  const [autocompleteUsers, setAutocompleteUsers] = useState<
    IAutocompleteUsers[]
  >([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const { account, library, chainId } = useWeb3React();

  const { showAlertMessage } = useAlertMessage();

  const [step, setStep] = useState<number>(0);
  const [artist, setArtist] = useState<any>();
  const [roleName, setRoleName] = useState<string>('');
  const [mediaFractions, setMediaFractions] = useState<number>(0);

  const [isApproved, setApproved] = useState<boolean>(false);

  const [hash, setHash] = useState<string>('');
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [openTranactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  const [podInfo, setPodInfo] = useState<any>();
  const [availableFractions, setAvailableFractions] = useState<number>(0);

  const [debouncedValue] = useDebounce(searchValue, 500);

  const { maxPrioFee } = useMaxPrioFee();

  // refresh autocomplete user list when searchValue changed
  useEffect(() => {
    if (debouncedValue) {
      getMatchingUsers(searchValue, ['urlSlug', 'firstName', 'address']).then(
        async (resp) => {
          if (resp?.success) {
            const filteredUsers = resp.data.filter(
              (u) =>
                u.address &&
                u.address.toLowerCase() != user.address.toLowerCase()
            );
            setAutocompleteUsers(filteredUsers);
          }
        }
      );
    } else {
      setAutocompleteUsers([]);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (!open) return;

    (async () => {
      const targetChain = BlockchainNets.find(
        (net) => net.value === 'Polygon blockchain'
      );
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0x89);
        if (!isHere) {
          showAlertMessage(
            'Got failed while switching over to target network',
            { variant: 'error' }
          );
          return;
        }
      }
      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);

      const info = await web3APIHandler?.PodManager.getPodInfo(web3, {
        podAddress: pod.PodAddress,
        fundingToken: pod.FundingToken
      });
      setPodInfo(info);

      const decimals = await web3APIHandler.Erc20['COPYRIGHT'].decimals(
        web3,
        info.copyrightToken
      );
      const balance = await web3APIHandler.Erc20['COPYRIGHT'].balanceOf(
        web3,
        info.copyrightToken,
        {
          account
        }
      );
      setAvailableFractions(+toDecimals(balance, decimals));
    })();
  }, [open]);

  const validate = () => {
    if (!artist || !Web3.utils.isAddress(artist.address)) {
      showAlertMessage(`Address is not valid`, { variant: 'error' });
      return false;
    } else if (mediaFractions < 0 || mediaFractions > availableFractions) {
      showAlertMessage(`Please enter valid fractions amount.`, {
        variant: 'error'
      });
      return false;
    }
    return true;
  };

  const handleApprove = async () => {
    if (!validate()) return;

    setOpenTransactionModal(true);

    const targetChain = BlockchainNets.find(
      (net) => net.value === 'Polygon blockchain'
    );
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0x89);
      if (!isHere) {
        showAlertMessage('Got failed while switching over to target network', {
          variant: 'error'
        });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    const decimals = await web3APIHandler.Erc20['COPYRIGHT'].decimals(
      web3,
      podInfo.copyrightToken
    );
    const response = await web3APIHandler.Erc20['COPYRIGHT'].approve(
      web3,
      account,
      podInfo.copyrightToken,
      artist.address,
      toNDecimals(mediaFractions, decimals),
      maxPrioFee
    );

    if (response) {
      setTransactionSuccess(true);
      setApproved(true);
    } else {
      showAlertMessage('Failed to approve the transaction.', {
        variant: 'error'
      });
      setTransactionSuccess(false);
    }
  };

  const handleSendOffer = async () => {
    if (!validate()) return;

    setOpenTransactionModal(true);

    const targetChain = BlockchainNets.find(
      (net) => net.value === 'Polygon blockchain'
    );
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0x89);
      if (!isHere) {
        showAlertMessage('Got failed while switching over to target network', {
          variant: 'error'
        });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    const decimals = await web3APIHandler.Erc20['COPYRIGHT'].decimals(
      web3,
      podInfo.copyrightToken
    );
    const response = await web3APIHandler.Erc20['COPYRIGHT'].transfer(
      web3,
      account,
      podInfo.copyrightToken,
      artist.address,
      toNDecimals(mediaFractions, decimals),
      setHash
    );

    if (response) {
      setTransactionSuccess(true);
      await musicDaoSendInvitation({
        podId: pod.Id,
        sender: user.id,
        artist,
        role: roleName
      });
      handleRefresh();
    } else {
      showAlertMessage('Failed to approve the transaction.', {
        variant: 'error'
      });
      setTransactionSuccess(false);
    }
  };

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={handleClose}
      showCloseIcon
      className={classes.root}
    >
      <Box className={classes.contentBox}>
        <Box className={classes.flexBox} justifyContent="center">
          {step === 0 ? (
            <img src={require('assets/emojiIcons/salute.webp')} />
          ) : (
            <Box className={classes.header3}>Add Creators</Box>
          )}
        </Box>
        {step === 0 ? (
          <>
            <Box className={classes.header1} mt={4}>
              Invite creators, labels and more
            </Box>
            <Box className={classes.header2} mt={2} mb={4}>
              Invite those who you want to be involved in the creation and
              approval of a Capsule proposal. This may be fellow artists,
              labels, etc.
            </Box>
            <Box
              className={classes.flexBox}
              width={1}
              mt={3}
              justifyContent="center"
            >
              <PrimaryButton
                size="medium"
                onClick={() => setStep(1)}
                isRounded
                style={{
                  height: 45,
                  paddingLeft: 44,
                  paddingRight: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  background: Color.MusicDAOGreen
                }}
              >
                Next
              </PrimaryButton>
            </Box>
          </>
        ) : (
          <Box>
            <Box className={classes.greenBox} my={2}>
              <Box>media fractions held</Box>
              <Box className={classes.number} mt={1.5}>
                {availableFractions && availableFractions.toFixed(4)}
              </Box>
            </Box>
            <Box mt={4} width={1}>
              <Box
                style={{
                  color: '#707582',
                  display: 'flex',
                  fontSize: 14
                }}
              >
                Name or account address
              </Box>
              <Autocomplete
                freeSolo
                classes={autocompleteStyle}
                onChange={(event: any, user: any | null) => {
                  if (user && typeof user !== 'string') {
                    setArtist(user);
                  }
                }}
                options={autocompleteUsers}
                renderOption={(option) => (
                  <Box className={classes.renderItemBox}>
                    <Box display="flex" alignItems="center" maxWidth={'70%'}>
                      <Avatar
                        noBorder
                        url={
                          processImage(option.imageUrl) ?? getDefaultAvatar()
                        }
                        size="small"
                      />
                      <Box
                        className={classes.urlSlug}
                      >{`@${option.urlSlug}`}</Box>
                    </Box>
                  </Box>
                )}
                getOptionLabel={(option) => `@${option.urlSlug}`}
                filterOptions={(options, _) =>
                  options.filter(
                    (option) =>
                      !pod.Collabs.find(
                        (collab) =>
                          collab.address.toLowerCase() ===
                          option.address.toLowerCase()
                      )
                  )
                }
                renderInput={(params) => (
                  <InputBase
                    value={searchValue}
                    onChange={(event) => {
                      setSearchValue(event.target.value);
                    }}
                    ref={params.InputProps.ref}
                    inputProps={params.inputProps}
                    endAdornment={
                      <InputAdornment position="end">
                        <svg
                          width="29"
                          height="29"
                          viewBox="0 0 29 29"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M23.1612 24.3928C23.621 24.8526 24.3666 24.8526 24.8264 24.3928C25.2862 23.933 25.2862 23.1874 24.8264 22.7276L23.1612 24.3928ZM20.4613 12.3741C20.4613 16.6011 17.0347 20.0277 12.8077 20.0277V22.3827C18.3353 22.3827 22.8163 17.9017 22.8163 12.3741H20.4613ZM12.8077 20.0277C8.5807 20.0277 5.15405 16.6011 5.15405 12.3741H2.79908C2.79908 17.9017 7.28009 22.3827 12.8077 22.3827V20.0277ZM5.15405 12.3741C5.15405 8.1471 8.5807 4.72045 12.8077 4.72045V2.36549C7.28009 2.36549 2.79908 6.84649 2.79908 12.3741H5.15405ZM12.8077 4.72045C17.0347 4.72045 20.4613 8.1471 20.4613 12.3741H22.8163C22.8163 6.84649 18.3353 2.36549 12.8077 2.36549V4.72045ZM24.8264 22.7276L19.8956 17.7968L18.2304 19.462L23.1612 24.3928L24.8264 22.7276Z"
                            fill="#2D3047"
                          />
                        </svg>
                      </InputAdornment>
                    }
                    autoFocus
                    placeholder="Address here.."
                  />
                )}
              />
            </Box>
            <Box mt={2} className={classes.roleContainer}>
              <Box className={classes.roleName}>
                <InputWithLabelAndTooltip
                  type="text"
                  labelName="Role name "
                  placeHolder="Track writer, label etc."
                  inputValue={roleName}
                  disabled={isApproved}
                  onInputValueChange={(e) => setRoleName(e.target.value)}
                  overriedClasses={classes.inputBox}
                />
              </Box>
              <Box className={classes.fractions}>
                <InputWithLabelAndTooltip
                  type="text"
                  labelName="Media Fractions "
                  placeHolder="00.00"
                  inputValue={mediaFractions}
                  disabled={isApproved}
                  onInputValueChange={(e) =>
                    setMediaFractions(Number(e.target.value))
                  }
                  overriedClasses={classes.inputBox}
                  style={{ flex: 1 }}
                />
              </Box>
            </Box>
            <Box className={classes.header2} mt={3}>
              Keep in mind that you will share part of your personal royalties
              with all invited users.
            </Box>
            <Box className={classes.buttonFlexBox} width={1} mt={5}>
              <PrimaryButton
                size="medium"
                onClick={handleApprove}
                isRounded
                style={{
                  height: 45,
                  paddingLeft: 44,
                  paddingRight: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  background: Color.MusicDAOGreen
                }}
                disabled={isApproved}
              >
                Approve
              </PrimaryButton>
              <PrimaryButton
                size="medium"
                onClick={handleSendOffer}
                isRounded
                disabled={!isApproved}
                style={{
                  height: 45,
                  paddingLeft: 44,
                  paddingRight: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  background: Color.MusicDAOGreen
                }}
              >
                Send Ownership
              </PrimaryButton>
            </Box>
          </Box>
        )}
      </Box>
      {openTranactionModal && (
        <TransactionProgressModal
          open={openTranactionModal}
          onClose={() => {
            setHash('');
            setTransactionSuccess(null);
            setOpenTransactionModal(false);
          }}
          txSuccess={transactionSuccess}
          hash={hash}
        />
      )}
    </Modal>
  );
};

export default AddCreatorModal;
