import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from 'shared/ui-kit/Box';
import ShareNFTBox from 'components/MusicDao/components/ShareNFTBox/indext';
import { Modal, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import CustomSwitch from 'shared/ui-kit/CustomSwitch';
import { getUser } from 'store/selectors';

import { useDraftSettingModalStyles } from './index.styles';

const DraftSettingModal = ({ open, onClose, onCreate, editing }) => {
  const classes = useDraftSettingModalStyles();
  const history = useHistory();

  const userSelector = useSelector(getUser);

  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isFinish, setIsFinish] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [songId, setSongId] = useState<string>('');

  const onCheckProfile = () => {
    if (!editing) {
      history.push(`/profile/${userSelector.urlSlug}`);
    }
    onClose(true);
  };

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={() => {
        onClose(true);
      }}
      showCloseIcon={isFinish}
      className={classes.content}
    >
      <div className={classes.modalContent}>
        {isCreating ? (
          <>
            <Box style={{ position: 'relative' }} mb={5}>
              <img
                className={classes.loader}
                src={require('assets/musicDAOImages/loading.webp')}
              />
              <div className={classes.ethImg}>
                {/* {!editing && (
                  <img src={require("assets/musicDAOImages/eth.webp")} />
                )} */}
              </div>
            </Box>
            <Box className={classes.title} mb={1.5}>
              {editing ? 'Draft is being modified' : 'Draft is being created'}
            </Box>
          </>
        ) : isFinish ? (
          <>
            <Box className={classes.check} mb={5}>
              <CheckIcon />
            </Box>
            <Box className={classes.title} mb={1.5}>
              {editing ? 'Update Complete' : 'Success!'}
            </Box>
            <Box className={classes.description} mb={4}>
              {editing ? 'Draft Modified' : 'Your draft has been created'}
            </Box>
            <PrimaryButton
              size="medium"
              className={classes.checkButton}
              onClick={onCheckProfile}
            >
              {editing ? 'Close' : 'Go To Profile'}
            </PrimaryButton>
            {songId && (
              <ShareNFTBox
                shareLink={`${window.location.origin}/#/music/track/${songId}`}
              />
            )}
          </>
        ) : (
          <>
            <Box className={classes.title}>Draft Settings</Box>
            <div className={classes.revenueStreamingSection}>
              <Box display="flex" flexDirection="column" flex={1}>
                <label>{'Make Public'}</label>
                <Box className={classes.revenueText} mt={0.5}>
                  {isPublic
                    ? 'The entire network will be able to listen and engage with this track'
                    : 'This track will be private, accessible to you only on your profile, you can make the track public at a later date'}
                </Box>
              </Box>
              <CustomSwitch
                checked={isPublic}
                theme="music dao"
                onChange={() => {
                  setIsPublic((prev) => !prev);
                }}
              />
            </div>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              mt={9}
              width={1}
            >
              <SecondaryButton
                size="medium"
                className={classes.button}
                onClick={() => {
                  onClose(false);
                }}
              >
                Back
              </SecondaryButton>
              <PrimaryButton
                size="medium"
                className={classes.confirmButton}
                onClick={() => {
                  setIsCreating(true);
                  onCreate(isPublic, (result, songId) => {
                    setIsCreating(false);
                    setSongId(songId);
                    if (result) setIsFinish(true);
                  });
                }}
              >
                {editing ? 'Modify Draft' : 'Create Draft'}
              </PrimaryButton>
            </Box>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DraftSettingModal;

const CheckIcon = () => (
  <svg
    width="37"
    height="27"
    viewBox="0 0 37 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.70703 13.4282L13.9238 22.645L32.2949 4.27393"
      stroke="url(#paint0_linear_check_button)"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_check_button"
        x1="6.79528"
        y1="12.7002"
        x2="30.7378"
        y2="17.5164"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.179206" stopColor="#A0D800" />
        <stop offset="0.852705" stopColor="#0DCC9E" />
      </linearGradient>
    </defs>
  </svg>
);
