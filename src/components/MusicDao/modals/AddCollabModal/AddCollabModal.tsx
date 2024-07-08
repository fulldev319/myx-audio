import React, { useState } from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import CollabsTab from './CollabsTab';
import { addCollabModalStyles } from './AddCollabModal.styles';

import {
  Modal,
  PrimaryButton,
  SecondaryButton,
  CircularLoadingIndicator
} from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { addCollabsToPod } from 'shared/services/API';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';

const AddCollabModal = (props: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [pod, setPod] = useState<any>(props.pod);
  const [isLoading, setIsLoading] = useState(false);
  const classes = addCollabModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const onAddNewCollabs = async () => {
    // console.log(pod.newCollabs);
    if (!pod.newCollabs.every((collab) => !!collab.imageUrl)) {
      showAlertMessage(
        'Artist, who can create pods or can be added on pods must have profile photo.',
        {
          variant: 'error'
        }
      );
      return;
    }
    setIsLoading(true);
    addCollabsToPod({
      podId: pod.Id,
      collabs: pod.newCollabs.map((c) => ({
        userId: c.userId || c.id,
        address: c.address
      }))
    })
      .then((res) => {
        if (res.success) {
          props.handleRefresh();
          props.handleClose();
        }
      })
      .finally(() => setIsLoading(false));
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
        {pod && (
          <>
            <div>
              <div className={classes.headerCreatePod}>Invite New Collabs</div>
              <CollabsTab pod={pod} setPod={(nv) => setPod(nv)} />
            </div>
            <Box display="flex" alignItems="center" className={classes.buttons}>
              <SecondaryButton
                onClick={() => {
                  props.handleClose();
                }}
                size="medium"
                style={{ maxWidth: '50%' }}
              >
                Cancel
              </SecondaryButton>
              {isLoading ? (
                <CircularLoadingIndicator />
              ) : (
                <PrimaryButton
                  onClick={onAddNewCollabs}
                  size="medium"
                  style={{
                    color: '#FFFFFF',
                    background: '#2D3047',
                    maxWidth: '50%'
                  }}
                  disabled={!pod.newCollabs?.length}
                >
                  Next
                </PrimaryButton>
              )}
            </Box>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddCollabModal;
