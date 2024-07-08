import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import CustomSwitch from 'shared/ui-kit/CustomSwitch';
import { getUser } from 'store/selectors';

import { useDraftSettingModalStyles } from './index.styles';

const DraftSettingModal = ({ open, onClose, onCreate, editing }) => {
  const classes = useDraftSettingModalStyles();

  const [isPublic, setIsPublic] = useState<boolean>(true);

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={() => {
        onClose();
      }}
      showCloseIcon={false}
      className={classes.content}
    >
      <div className={classes.modalContent}>
        <Box className={classes.title}>Draft Settings</Box>
        <div className={classes.revenueStreamingSection}>
          <Box display="flex" flexDirection="column" flex={1}>
            <label>{'Make Public'}</label>
            <Box className={classes.revenueText} mt={0.5}>
              {isPublic
                ? 'Eeveryone will be able to see and listen to your song ,  and receive feedback '
                : 'Thiis will make your song visible only to You on your profile only'}
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            <Box mr={1}>{isPublic ? 'Yes' : 'No'}</Box>
            <CustomSwitch
              checked={isPublic}
              theme="music dao"
              onChange={() => {
                setIsPublic((prev) => !prev);
              }}
            />
          </Box>
        </div>
        <Box display={'flex'} justifyContent={'space-between'} mt={9} width={1}>
          <SecondaryButton
            size="medium"
            className={classes.button}
            onClick={() => {
              onClose();
            }}
          >
            Back
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            className={classes.confirmButton}
            onClick={() => {
              onCreate(isPublic);
            }}
          >
            {editing ? 'Modify Draft' : 'Create Draft'}
          </PrimaryButton>
        </Box>
      </div>
    </Modal>
  );
};

export default DraftSettingModal;
