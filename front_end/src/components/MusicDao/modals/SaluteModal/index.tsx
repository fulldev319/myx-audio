import React, { useState } from 'react';

import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import {
  saluteModalStyles,
  FacebookLogoIcon,
  TwitterLogoIcon,
  LinkedLogoIcon,
  InstagramLogoIcon,
  CheckIcon
} from './index.styles';

const SaluteModal = (props: any) => {
  const classes = saluteModalStyles();

  const [status, setStatus] = useState<any>('');
  const [profile1, setProfile1] = useState<string>('');
  const [profile2, setProfile2] = useState<string>('');

  const [connectedToFacebook, setConnectedToFacebook] =
    useState<boolean>(false);
  const [connectedToTwitter, setConnectedToTwitter] = useState<boolean>(false);
  const [connectedToLinkedin, setConnectedToLinkedin] =
    useState<boolean>(false);
  const [connectedToInstagram, setConnectedToInstagram] =
    useState<boolean>(false);

  const [submited, setSubmited] = useState<boolean>(false);

  return (
    <Modal
      size="small"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
    >
      <Box className={classes.contentBox}>
        <Box className={classes.flexBox} justifyContent="center">
          <img
            src={require(submited
              ? 'assets/icons/community.webp'
              : 'assets/emojiIcons/salute.webp')}
          />
        </Box>
        <Box className={classes.header1} mt={4}>
          {submited
            ? 'Our staff at Music willl be reviewing your profile.'
            : 'Cool! It seems like you’re behind this amazing track.'}
        </Box>
        <Box className={classes.header2} mt={2} mb={submited ? '32px' : 0}>
          {submited
            ? 'We’ll let you know once the validation process has ended.'
            : 'In order to validate your identity you need to provide us with two social media profiles of your ownership.'}
        </Box>
        {!submited && (
          <Box mt="49px" mb="66px">
            <Box
              className={classes.toConnectButton}
              bgcolor={connectedToFacebook ? '#65CB63' : '#3B5998'}
              mb="9px"
              onClick={() => {
                setConnectedToFacebook(true);
                setConnectedToTwitter(false);
                setConnectedToLinkedin(false);
                setConnectedToInstagram(false);
              }}
            >
              <FacebookLogoIcon />
              <Box fontSize={16} fontWeight={600} color="#ffffff">
                {connectedToFacebook
                  ? 'Facebook Connected'
                  : 'Connect Facebook'}
              </Box>
              {connectedToFacebook ? <CheckIcon /> : <div />}
            </Box>
            <Box
              className={classes.toConnectButton}
              bgcolor={connectedToTwitter ? '#65CB63' : '#1DA1F2'}
              mb="9px"
              onClick={() => {
                setConnectedToFacebook(false);
                setConnectedToTwitter(true);
                setConnectedToLinkedin(false);
                setConnectedToInstagram(false);
              }}
            >
              <TwitterLogoIcon />
              <Box fontSize={16} fontWeight={600} color="#ffffff">
                {connectedToTwitter ? 'Twitter Connected' : 'Connect Twitter'}
              </Box>
              {connectedToTwitter ? <CheckIcon /> : <div />}
            </Box>
            <Box
              className={classes.toConnectButton}
              bgcolor={connectedToLinkedin ? '#65CB63' : '#0077B5'}
              mb="9px"
              onClick={() => {
                setConnectedToFacebook(false);
                setConnectedToTwitter(false);
                setConnectedToLinkedin(true);
                setConnectedToInstagram(false);
              }}
            >
              <LinkedLogoIcon />
              <Box fontSize={16} fontWeight={600} color="#ffffff">
                {connectedToLinkedin
                  ? 'Linkedin Connected'
                  : 'Connect Linkedin'}
              </Box>
              {connectedToLinkedin ? <CheckIcon /> : <div />}
            </Box>
            <Box
              className={classes.toConnectButton}
              bgcolor={connectedToInstagram ? '#65CB63' : '#CA4173'}
              onClick={() => {
                setConnectedToFacebook(false);
                setConnectedToTwitter(false);
                setConnectedToLinkedin(false);
                setConnectedToInstagram(true);
              }}
            >
              <InstagramLogoIcon />
              <Box fontSize={16} fontWeight={600} color="#ffffff">
                {connectedToInstagram
                  ? 'Instagram Connected'
                  : 'Connect Instagram'}
              </Box>
              {connectedToInstagram ? <CheckIcon /> : <div />}
            </Box>
          </Box>
        )}
        {!submited && (
          <Box
            className={classes.flexBox}
            width={1}
            mt={3}
            justifyContent="center"
          >
            <PrimaryButton
              size="medium"
              onClick={() => setSubmited(true)}
              isRounded
              style={{
                height: 45,
                paddingLeft: 44,
                paddingRight: 44,
                fontSize: 14,
                fontWeight: 600,
                background:
                  connectedToFacebook ||
                  connectedToTwitter ||
                  connectedToLinkedin ||
                  connectedToInstagram
                    ? '#65CB63'
                    : '#2D304722'
              }}
            >
              Submit Claim Request
            </PrimaryButton>
          </Box>
        )}
      </Box>
      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus(undefined)}
        />
      )}
    </Modal>
  );
};

export default SaluteModal;
