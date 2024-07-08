import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import CustomSwitch from 'shared/ui-kit/CustomSwitch';
import { getUser } from 'store/selectors';

import { useDraftDeletingModalStyles } from './index.styles';

const DraftDeletingModal = ({ open, onClose, onOk, onDelete }) => {
  const classes = useDraftDeletingModalStyles();
  const history = useHistory();

  const userSelector = useSelector(getUser);

  const [isFinish, setIsFinish] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(true);

  useEffect(() => {
    setIsDeleting(true);
    onDelete((result) => {
      setIsDeleting(false);
      if (result) setIsFinish(true);
      else onClose();
    });
  }, []);

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={onClose}
      showCloseIcon={false}
      className={classes.content}
    >
      <div className={classes.modalContent}>
        {isDeleting ? (
          <>
            <Box style={{ position: 'relative' }} mb={5}>
              <img
                className={classes.loader}
                src={require('assets/musicDAOImages/loading.webp')}
              />
              <div className={classes.ethImg}>
                {/* <img src={require("assets/musicDAOImages/eth.webp")} /> */}
              </div>
            </Box>
            <Box className={classes.title} mb={1.5}>
              Draft is deleting
            </Box>
          </>
        ) : isFinish ? (
          <>
            <Box className={classes.check} mb={5}>
              <CheckIcon />
            </Box>
            <Box className={classes.title} mb={1.5}>
              Draft Deleted
            </Box>
            <PrimaryButton
              size="medium"
              className={classes.checkButton}
              onClick={onOk}
            >
              Close
            </PrimaryButton>
          </>
        ) : null}
      </div>
    </Modal>
  );
};

export default DraftDeletingModal;

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
