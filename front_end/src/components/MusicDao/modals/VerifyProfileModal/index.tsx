import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { TwitterShareButton } from 'react-share';
import axios from 'axios';
import URL from 'shared/functions/getURL';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';

import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import { useVerifyProfileModalStyles } from './index.styles';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from 'store/reducers/Reducer';
import { setUser } from 'store/actions/User';

const VerifyProfileModal = ({ open, onClose }) => {
  const classes = useVerifyProfileModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const { account } = useWeb3React();

  const dispatch = useDispatch();
  const userSelector = useTypedSelector((state) => state.user);

  const [step, setStep] = useState(0);
  const [tweetUrl, setTweetUrl] = useState('');
  const [nonce, setNonce] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const steps = ['Create Post', 'Paste URL'];

  useEffect(() => {
    setStep(0);
    setIsVerifying(false);
  }, [open]);

  useEffect(() => {
    if (!account) {
      return;
    }
    (async () => {
      const res = await axios.post(
        `${URL()}/user/requestSignInUsingRandomNonce/`,
        {
          address: account
        }
      );
      const nonce = res.data.nonce;
      setNonce(nonce);
    })();
  }, [account]);

  const onConfirm = async () => {
    try {
      setIsVerifying(true);
      const response = await axios.post(`${URL()}/user/tweetVerify`, {
        nonce,
        tweetUrl: tweetUrl.slice(
          0,
          tweetUrl.indexOf('?') > 0 ? tweetUrl.indexOf('?') : tweetUrl.length
        )
      });
      if (response?.data?.success) {
        let setterUser: any = {
          ...userSelector,
          twitterVerified: true,
          twitter: response.data.tweetUsername
        };
        dispatch(setUser(setterUser));
        showAlertMessage('successfully verified', { variant: 'success' });
        onClose();
      } else {
        showAlertMessage('verification is failed', { variant: 'error' });
      }
    } catch (err) {
      showAlertMessage('something went wrong, please try again', {
        variant: 'error'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={onClose}
      showCloseIcon
      className={classes.content}
    >
      <div className={classes.modalContent}>
        {step === 0 ? (
          <>
            <img
              src={require('assets/icons/salute.webp')}
              alt="salute"
              className={classes.saluteIcon}
            />
            <span className={classes.title}>Verify your profile</span>
            <p className={classes.description}>
              Show your community your profile is authentic.
            </p>
            <PrimaryButton
              size="medium"
              onClick={() => setStep(1)}
              className={classes.button}
              disabled={!nonce}
            >
              <img
                src={require('assets/snsIcons/twitter_white.svg')}
                alt="twitter"
                className={classes.twitterIcon}
              />
              Verify via Twitter
            </PrimaryButton>
          </>
        ) : (
          <>
            <div className={classes.progressBar}>
              {steps.map((stepDesc, index) => (
                <>
                  <div className={classes.stepCircleOuter}>
                    <span
                      className={`${
                        step - 1 >= index && classes.stepCircleInner
                      }`}
                    >
                      {index + 1}
                    </span>
                    <label>{stepDesc}</label>
                  </div>
                  {index !== steps.length - 1 && (
                    <div className={classes.line} />
                  )}
                </>
              ))}
            </div>
            <span className={classes.title}>
              {step === 1 ? 'Step #1' : 'Step #2'}
            </span>
            <p className={classes.description}>
              {step === 1 ? (
                <>
                  Post a public tweet that contains your unique identifier 👇
                  <br />
                  <span>{nonce}</span>
                </>
              ) : (
                'Paste the URL of the tweet you just posted'
              )}
            </p>
            {step === 2 && (
              <div className={classes.urlInputBox}>
                <label className={classes.urlInputLabel}>Tweet URL</label>
                <input
                  className={`${classes.urlInput}`}
                  placeholder="Tweet URL"
                  value={tweetUrl}
                  onChange={(e) => {
                    setTweetUrl(e.target.value);
                  }}
                />
              </div>
            )}
            {step === 1 ? (
              <TwitterShareButton
                title={`I just joined @get_myx. Web 3 streaming with a bag of delicious artists tools helping them make a better life. Come join us as we remix the industry - ${nonce}`}
                url={'https://app.myx.audio/'}
                style={{ height: '100%' }}
                onShareWindowClose={() => setStep(2)}
              >
                <PrimaryButton size="medium" className={classes.button}>
                  <img
                    src={require('assets/snsIcons/twitter_white.svg')}
                    alt="twitter"
                    className={classes.twitterIcon}
                  />
                  Post on Twitter
                </PrimaryButton>{' '}
              </TwitterShareButton>
            ) : (
              <LoadingWrapper loading={isVerifying}>
                <PrimaryButton
                  size="medium"
                  onClick={onConfirm}
                  className={classes.confirmButton}
                >
                  Confirm
                </PrimaryButton>
              </LoadingWrapper>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default VerifyProfileModal;
