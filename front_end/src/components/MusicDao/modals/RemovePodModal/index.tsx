import React from 'react';
import { useHistory } from 'react-router-dom';

import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton, CircularLoadingIndicator } from 'shared/ui-kit';
import { musicDaoRemovePod } from 'shared/services/API';
import { modalStyles } from './index.styles';

const RemovePodModal = (props) => {
  const classes = modalStyles();
  const history = useHistory();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleRemovePod = () => {
    setIsLoading(true);
    musicDaoRemovePod(props.podId).then((res) => {
      if (res.success) {
        setIsLoading(false);
        props.onClose();
        props.handleRefresh();
      }
    });
  };

  return (
    <Modal
      size="daoMedium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
    >
      <div className={classes.content}>
        <div className={classes.typo1}>Removing Capsule Proposal</div>
        <div className={classes.typo2}>
          Are you sure you want to remove your Capsule Proposal?
        </div>
        <Box display="flex" alignItems="center" mt={6}>
          {isLoading ? (
            <CircularLoadingIndicator />
          ) : (
            <>
              <PrimaryButton
                size="medium"
                isRounded
                style={{ height: 46, minWidth: 195, background: '#54658F' }}
                onClick={props.onClose}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton
                size="medium"
                isRounded
                style={{ height: 46, minWidth: 195, background: '#65CB63' }}
                onClick={handleRemovePod}
              >
                Yes, remove
              </PrimaryButton>
            </>
          )}
        </Box>
      </div>
    </Modal>
  );
};

export default RemovePodModal;
