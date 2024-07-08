import React, { useEffect } from 'react';
import Axios from 'axios';
import { RootState } from 'store/reducers/Reducer';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import Box from 'shared/ui-kit/Box';
import { modalStyles } from './index.styles';
import URL from 'shared/functions/getURL';

const RemovePostModal = (props) => {
  const classes = modalStyles();

  const handleConfirm = async () => {
    const body = {
      userId: props.userId,
      creatorId: props.creatorId,
      postId: props.postId
    };
    Axios.post(`${URL()}/user/wall/deletePost`, body)
      .then(async (response) => {
        const resp = response.data;
        if (resp.success) {
          setTimeout(() => {
            props.refresh();
            props.onClose();
          }, 1000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal
      size="small"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
    >
      <div className={classes.content}>
        <div className={classes.typo1}>Removing Post </div>
        <div className={classes.typo2}>
          Are you sure you want to remove your post?
        </div>
        <Box width={1} display="flex" justifyContent="center" marginTop="31px">
          <PrimaryButton
            size="medium"
            isRounded
            style={{
              width: 250,
              height: 53,
              background: '#54658F',
              marginTop: 22
            }}
            onClick={() => {
              props.onClose();
            }}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton
            size="medium"
            isRounded
            style={{
              width: 250,
              height: 53,
              background: '#65CB63',
              marginTop: 22
            }}
            onClick={handleConfirm}
          >
            Yes, remove
          </PrimaryButton>
        </Box>
      </div>
    </Modal>
  );
};

export default RemovePostModal;
