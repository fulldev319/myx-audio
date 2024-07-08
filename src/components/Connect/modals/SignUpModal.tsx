import React, { FC, useState } from 'react';

import { Modal, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { modalStyles } from './modalStyles';

interface IProps {
  open: boolean;
  onClose: () => void;
  onSignUp: (userName: string) => void;
}

const SignUpModal: FC<IProps> = (props) => {
  const classes = modalStyles();

  const { open, onClose, onSignUp } = props;
  const [name, setName] = useState<string>('');
  const [errors, setErrors] = useState<string>('');

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      showCloseIcon
      size="small"
      className={classes.container}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box className={classes.title} mb={2}>
          Sign Up
        </Box>
        <InputWithLabelAndTooltip
          type="text"
          inputValue={name}
          onInputValueChange={(e) => setName(e.target.value)}
          style={{ textAlign: 'center' }}
          placeHolder="Name"
          required
        />
        {errors ? <div className={classes.errors}>{errors}</div> : null}
        <PrimaryButton
          size="small"
          onClick={() => {
            if (name) {
              onSignUp(name);
            } else {
              setErrors('Please enter an valid name');
            }
          }}
        >
          Sign Up
        </PrimaryButton>
      </Box>
    </Modal>
  );
};

export default SignUpModal;
