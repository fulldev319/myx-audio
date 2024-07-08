import React, { useState } from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import { Modal, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { removeCollabModalStyles } from './index.styles';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { deleteCollabFromPod } from 'shared/services/API';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';

const RemoveCollabModal = (props: any) => {
  const classes = removeCollabModalStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [isLoading, setIsLoading] = useState(false);
  const { showAlertMessage } = useAlertMessage();

  const onRmoveCollab = async () => {
    setIsLoading(true);

    try {
      const res = await deleteCollabFromPod({
        podId: props.podId,
        collabId: props.collabId
      });
      if (res.success) {
        showAlertMessage(`Deleted collab from this Capsule`, {
          variant: 'success'
        });
        props.handleRefresh();
      } else {
        showAlertMessage(`Failed to delete collab from this Capsule`, {
          variant: 'error'
        });
      }
    } catch (err) {
      showAlertMessage(`Failed to delete collab from this Capsule`, {
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      style={{
        maxWidth: '653px',
        padding: isMobile ? '60px 22px 20px' : '60px 48px 20px'
      }}
    >
      <div className={classes.modalContent}>
        <LoadingWrapper loading={isLoading}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box className={classes.deleteIcon}>
              <img
                src={require('assets/icons/delete_red.svg')}
                alt={'Delete Collab'}
              />
            </Box>
          </Box>
          <Box className={classes.title} mt={3}>
            Removing Collaborator
          </Box>
          <Box className={classes.description} mt={2}>
            Are you sure you want to remove {} from Capsule Collaborators?
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={4}
            mb={2}
          >
            <PrimaryButton
              size="medium"
              className={classes.buttonFont}
              isRounded
              onClick={() => {
                props.handleClose();
              }}
              style={{
                background: '#54658F',
                marginRight: 16
              }}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              size="medium"
              className={classes.buttonFont}
              isRounded
              onClick={() => {
                onRmoveCollab();
              }}
              style={{
                background: '#65CB63'
              }}
            >
              Yes, remove
            </PrimaryButton>
          </Box>
        </LoadingWrapper>
      </div>
    </Modal>
  );
};

export default RemoveCollabModal;
