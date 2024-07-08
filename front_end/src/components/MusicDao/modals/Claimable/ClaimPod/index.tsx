import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
// import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
// import TwitterLogin from "react-twitter-login";
// import { LinkedIn } from "react-linkedin-login-oauth2";
// import InstagramLogin from "react-instagram-oauth";

import { Modal, PrimaryButton, CircularLoadingIndicator } from 'shared/ui-kit';
import SignInModal from 'components/Login/SignInModal';
import StyledCheckbox from 'shared/ui-kit/Checkbox';
import Box from 'shared/ui-kit/Box';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import URLTraxMicroservice from '../../../../../shared/functions/getURLMusicMicroservice';
import { claimPodModalStyles } from './index.styles';

const userIcon = require('assets/icons/user-solid.svg');

const FacebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID || '';
const TwitterConsumberKey = process.env.REACT_APP_TWITTER_CONSUMER_KEY || '';
const TwitterConsumberSecret =
  process.env.REACT_APP_TWITTER_CONSUMER_SECRET || '';
const LINKEDIN_APP_ID = process.env.REACT_APP_LINKEDIN_APP_ID || '';
const INSTAGRAM_APP_ID = process.env.REACT_APP_INATAGRAM_APP_ID || '';
const INSTAGRAM_CLIENT_ID = process.env.REACT_APP_INATAGRAM_CLIENT_ID || '';

export default function ClaimPodModal(props) {
  const classes = claimPodModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const instButRef = useRef<any>();

  const [artistSelection, setArtistSelection] = useState<any>('');
  const [artist, setArtist] = useState<any>('');
  const [artistInfo, setArtistInfo] = useState<any>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [connectedToFacebook, setConnectedToFacebook] =
    useState<boolean>(false);
  const [connectedToTwitter, setConnectedToTwitter] = useState<boolean>(false);
  const [connectedToLinkedin, setConnectedToLinkedin] =
    useState<boolean>(false);
  const [connectedToInstagram, setConnectedToInstagram] =
    useState<boolean>(false);
  const [loadingToFacebookLogin, setLoadingToFacebookLogin] =
    useState<boolean>(false);
  const [loadingToTwitterLogin, setLoadingToTwitterLogin] =
    useState<boolean>(false);

  const [loadingToLinkedIn, setLoadingToLinkedIn] = useState<boolean>(false);
  const [loadingToInstagram, setLoadingToInstagram] = useState<boolean>(false);

  const [openSignInModal, setOpenSignInModal] = useState<boolean>(false);

  const verifiedCount = React.useMemo(() => {
    let count = 0;
    if (artistInfo) {
      if (artistInfo.FacebookVerification) count += 1;
      if (artistInfo.InstagramVerification) count += 1;
      if (artistInfo.LinkedInVerification) count += 1;
      if (artistInfo.TwitterVerification) count += 1;
    }

    return count;
  }, [artistInfo]);

  const handleOpenSignInModal = () => {
    setOpenSignInModal(true);
  };
  const handleCloseSignInModal = () => {
    setOpenSignInModal(false);
  };

  const isSignedIn = () => {
    return !!Cookies.get('accessToken');
  };

  useEffect(() => {
    if (!isSignedIn()) {
      handleOpenSignInModal();
    }
  }, []);

  useEffect(() => {
    setSubmitted(false);
    setArtist('');
  }, [props.triggerClose]);

  const handleSelectArtist = () => {
    setArtist(artistSelection);
    const token: string = localStorage.getItem('token') || '';
    axios
      .get(`${URLTraxMicroservice()}/artists/details/${artistSelection.name}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.success) {
          let artist: any = response.data.data;
          setArtistInfo(artist);
          setConnectedToInstagram(artist.InstagramVerification);
          setConnectedToTwitter(artist.TwitterVerification);
          setConnectedToFacebook(artist.FacebookVerification);
          setConnectedToLinkedin(artist.LinkedInVerification);
        } else {
          console.log('error finding Artist Info');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFacebookConnect = (renderProps) => {
    if (
      artistInfo.Facebook &&
      artistInfo.Facebook !== '' &&
      !connectedToFacebook
    ) {
      renderProps.onClick();
      setLoadingToFacebookLogin(true);
    }
  };

  const responseFacebook = async (response) => {
    if (response.status !== 'unknown') {
      const userName = response.name;
      if (userName === artistInfo.Facebook) {
        const token: string = localStorage.getItem('token') || '';
        axios
          .get(
            `${URLTraxMicroservice()}/artists/rrss/Facebook/${artistInfo.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then((response) => {
            if (response.data.success) {
              setConnectedToFacebook(true);
              setLoadingToFacebookLogin(false);
            }
          })
          .catch((error) => {
            showAlertMessage(error, { variant: 'error' });
            setLoadingToFacebookLogin(false);
          });
      } else {
        showAlertMessage('Not available facebook username', {
          variant: 'error'
        });
        setLoadingToFacebookLogin(false);
      }
    }
  };

  const responseTwitter = (err, data) => {
    setLoadingToTwitterLogin(true);
    if (data) {
      const userName = data.name;
      if (userName === artistInfo.Twitter) {
        const token: string = localStorage.getItem('token') || '';
        axios
          .get(
            `${URLTraxMicroservice()}/artists/rrss/Twitter/${artistInfo.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then((response) => {
            if (response.data.success) {
              setConnectedToTwitter(true);
              setLoadingToTwitterLogin(false);
            }
          })
          .catch((error) => {
            showAlertMessage(error, { variant: 'error' });
            setLoadingToTwitterLogin(false);
          });
      } else {
        showAlertMessage('Not available twitter username', {
          variant: 'error'
        });
        setLoadingToTwitterLogin(false);
      }
    }
  };

  const linkedInAuthSuccess = (data) => {
    setLoadingToFacebookLogin(true);
    if (data.userName === artistInfo.LinkedIn) {
      const token: string = localStorage.getItem('token') || '';
      axios
        .get(
          `${URLTraxMicroservice()}/artists/rrss/LinkedIn/${artistInfo.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          if (response.data.success) {
            setConnectedToLinkedin(true);
            setLoadingToLinkedIn(false);
          }
        })
        .catch((error) => {
          showAlertMessage(error, { variant: 'error' });
          setLoadingToLinkedIn(false);
        });
    } else {
      showAlertMessage('Not available linkedin username', { variant: 'error' });
      setLoadingToLinkedIn(false);
    }
  };

  const linkedInAuthFailure = (error) => {
    showAlertMessage(error.errorMessage, { variant: 'error' });
  };

  const instagramAuthHandler = (err, data) => {
    console.log(err, data);
    if (err) {
      showAlertMessage(err.toString(), { variant: 'error' });
    } else {
      if (data.userName === artistInfo.Instagram) {
        setLoadingToInstagram(true);
        const token: string = localStorage.getItem('token') || '';
        axios
          .get(
            `${URLTraxMicroservice()}/artists/rrss/Instagram/${artistInfo.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then((response) => {
            if (response.data.success) {
              setConnectedToInstagram(true);
              setLoadingToInstagram(false);
            }
          })
          .catch((error) => {
            showAlertMessage(error, { variant: 'error' });
            setLoadingToInstagram(false);
          });
      } else {
        showAlertMessage('Not available Instagram username', {
          variant: 'error'
        });
        setLoadingToInstagram(false);
      }
    }
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      className={classes.modal}
      showCloseIcon
    >
      <div className={classes.modalContent}>
        {isSignedIn() ? (
          submitted ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <img src={require('assets/icons/community.webp')} alt="mailbox" />
              <h3>Our staff at Music willl be reviewing your profile.</h3>
              <h5>We’ll let you know once the validation process has ended.</h5>
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100%"
            >
              <img src={require('assets/icons/salute.webp')} alt="salute" />
              {!artist ? (
                <h5>Who of the following artist are you?</h5>
              ) : (
                <>
                  <h3>Cool! It seems like you’re behind this amazing track.</h3>
                  <h5>
                    In order to validate your identity you need to provide us
                    with two social media profiles of your ownership.
                  </h5>
                </>
              )}
              {!artist ? (
                <>
                  <div className={classes.artistList}>
                    {props.artists &&
                      props.artists.length > 0 &&
                      props.artists.map((a, index) => (
                        <div
                          className={classes.artistTile}
                          key={`artist-${index}`}
                        >
                          <Box display="flex" alignItems="center">
                            <div
                              className={classes.artistImage}
                              style={{
                                backgroundImage:
                                  a.avatar && a.avatar !== ''
                                    ? `url(${a.avatar})`
                                    : `url(${userIcon})`
                              }}
                            />
                            <span>{a.name}</span>
                          </Box>
                          <StyledCheckbox
                            buttonType="circle"
                            checked={a === artistSelection}
                            onClick={() => {
                              setArtistSelection(a);
                            }}
                          />
                        </div>
                      ))}
                  </div>
                  <PrimaryButton
                    disabled={artistSelection === '' || !artistSelection}
                    size="medium"
                    onClick={handleSelectArtist}
                  >
                    Continue
                  </PrimaryButton>
                </>
              ) : (
                <>
                  <Box mt={3} mb={1} width={1}>
                    {/* <FacebookLogin
                      appId={FacebookAppId}
                      callback={responseFacebook}
                      fields="name,email,picture"
                      render={renderProps => (
                        <Box
                          className={classes.toConnectButton}
                          bgcolor={connectedToFacebook ? "#65CB63" : "#3B5998"}
                          mb="9px"
                          onClick={() => handleFacebookConnect(renderProps)}
                          style={{
                            opacity: artistInfo.Facebook && artistInfo.Facebook !== "" ? 1 : 0.2,
                            cursor: artistInfo.Facebook && artistInfo.Facebook !== "" ? "pointer" : "auto",
                          }}
                        >
                          {loadingToFacebookLogin ? (
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingTop: 16,
                                paddingBottom: 16,
                              }}
                            >
                              <CircularLoadingIndicator />
                            </div>
                          ) : (
                            <>
                              <FacebookLogoIcon />
                              <Box fontSize={16} fontWeight={600} color="#ffffff">
                                {connectedToFacebook ? "Facebook Connected" : "Connect Facebook"}
                              </Box>
                              {connectedToFacebook ? <CheckIcon /> : <div />}
                            </>
                          )}
                        </Box>
                      )}
                    />
                    <TwitterLogin
                      authCallback={responseTwitter}
                      consumerKey={TwitterConsumberKey}
                      consumerSecret={TwitterConsumberSecret}
                      children={
                        <Box
                          className={classes.toConnectButton}
                          bgcolor={connectedToTwitter ? "#65CB63" : "#1DA1F2"}
                          mb="9px"
                          style={{
                            opacity: artistInfo.Twitter && artistInfo.Twitter !== "" ? 1 : 0.2,
                            cursor: artistInfo.Twitter && artistInfo.Twitter !== "" ? "pointer" : "auto",
                          }}
                        >
                          {loadingToTwitterLogin ? (
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingTop: 16,
                                paddingBottom: 16,
                              }}
                            >
                              <CircularLoadingIndicator />
                            </div>
                          ) : (
                            <>
                              <TwitterLogoIcon />
                              <Box fontSize={16} fontWeight={600} color="#ffffff">
                                {connectedToTwitter ? "Twitter Connected" : "Connect Twitter"}
                              </Box>
                              {connectedToTwitter ? <CheckIcon /> : <div />}
                            </>
                          )}
                        </Box>
                      }
                    />
                    <LinkedIn
                      style={{ width: "100%", height: "auto", background: "transparent", padding: 0 }}
                      clientId={LINKEDIN_APP_ID}
                      onFailure={linkedInAuthFailure}
                      onSuccess={linkedInAuthSuccess}
                      redirectUri={location.pathname}
                    >
                      {loadingToLinkedIn ? (
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingTop: 16,
                            paddingBottom: 16,
                          }}
                        >
                          <CircularLoadingIndicator />
                        </div>
                      ) : (
                        <Box
                          className={classes.toConnectButton}
                          bgcolor={connectedToLinkedin ? "#65CB63" : "#0077B5"}
                          mb="9px"
                          style={{
                            opacity: artistInfo.LinkedIn && artistInfo.LinkedIn !== "" ? 1 : 0.2,
                            cursor: artistInfo.LinkedIn && artistInfo.LinkedIn !== "" ? "pointer" : "auto",
                          }}
                        >
                          <LinkedLogoIcon />
                          <Box fontSize={16} fontWeight={600} color="#ffffff">
                            {connectedToLinkedin ? "Linkedin Connected" : "Connect Linkedin"}
                          </Box>
                          {connectedToLinkedin ? <CheckIcon /> : <div />}
                        </Box>
                      )}
                    </LinkedIn>
                    <InstagramLogin
                      authCallback={instagramAuthHandler}
                      appId={INSTAGRAM_APP_ID}
                      appSecret={INSTAGRAM_CLIENT_ID}
                      redirectUri={location.pathname}
                      className={classes.instagramButton}
                      ref={instButRef}
                    /> */}
                    {loadingToInstagram ? (
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingTop: 16,
                          paddingBottom: 16
                        }}
                      >
                        <CircularLoadingIndicator />
                      </div>
                    ) : (
                      <Box
                        className={classes.toConnectButton}
                        bgcolor={connectedToInstagram ? '#65CB63' : '#CA4173'}
                        onClick={() => {
                          if (
                            instButRef.current &&
                            instButRef.current.handleLoginClick &&
                            !artistInfo.InstagramVerification
                          ) {
                            instButRef.current.handleLoginClick();
                          }
                        }}
                        style={{
                          opacity:
                            artistInfo.Instagram && artistInfo.Instagram !== ''
                              ? 1
                              : 0.2,
                          cursor:
                            artistInfo.Instagram && artistInfo.Instagram !== ''
                              ? 'pointer'
                              : 'auto'
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
                    )}
                  </Box>
                  <h5>{`Connected ${verifiedCount} of 4`}</h5>
                  {!submitted && (
                    <Box
                      className={classes.flexBox}
                      width={1}
                      mt={2}
                      justifyContent="center"
                    >
                      <PrimaryButton
                        size="medium"
                        onClick={() => setSubmitted(true)}
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
                </>
              )}
            </Box>
          )
        ) : (
          <SignInModal
            open={openSignInModal}
            handleClose={handleCloseSignInModal}
          />
        )}
      </div>
    </Modal>
  );
}

export const FacebookLogoIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.5 12.0694C23.5 5.71811 18.3513 0.569391 12 0.569391C5.64872 0.569391 0.5 5.71811 0.5 12.0694C0.5 17.8094 4.70538 22.567 10.2031 23.4297V15.3936H7.2832V12.0694H10.2031V9.5358C10.2031 6.65361 11.92 5.06158 14.5468 5.06158C15.805 5.06158 17.1211 5.28619 17.1211 5.28619V8.11627H15.671C14.2424 8.11627 13.7969 9.00273 13.7969 9.91218V12.0694H16.9863L16.4765 15.3936H13.7969V23.4297C19.2946 22.567 23.5 17.8094 23.5 12.0694Z"
      fill="white"
    />
  </svg>
);

const TwitterLogoIcon = () => (
  <svg
    width="24"
    height="20"
    viewBox="0 0 24 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 2.55669C23.1177 2.94867 22.1681 3.21265 21.1722 3.33184C22.1889 2.72228 22.9697 1.75754 23.3368 0.60802C22.3865 1.17278 21.3314 1.58156 20.2107 1.80314C19.3123 0.846407 18.0316 0.248047 16.6165 0.248047C13.8975 0.248047 11.6928 2.4527 11.6928 5.17172C11.6928 5.55729 11.7368 5.93327 11.8208 6.29404C7.72829 6.08926 4.10053 4.12859 1.67189 1.14959C1.24792 1.87674 1.00553 2.72229 1.00553 3.62463C1.00553 5.33251 1.87347 6.83961 3.19579 7.72276C2.38784 7.69716 1.62949 7.47557 0.964734 7.10679V7.16839C0.964734 9.55463 2.66302 11.5441 4.91407 11.9977C4.5013 12.1097 4.06613 12.1705 3.61736 12.1705C3.29978 12.1705 2.991 12.1393 2.69022 12.0817C3.31658 14.0375 5.13566 15.4614 7.28991 15.5014C5.60523 16.8213 3.48217 17.6093 1.17512 17.6093C0.776747 17.6093 0.384774 17.5861 0 17.5397C2.17905 18.9364 4.76688 19.7523 7.5475 19.7523C16.6037 19.7523 21.5562 12.2496 21.5562 5.74368C21.5562 5.53009 21.5522 5.31731 21.5418 5.10693C22.5049 4.41097 23.34 3.54383 24 2.55669Z"
      fill="white"
    />
  </svg>
);

const LinkedLogoIcon = () => (
  <svg
    width="22"
    height="21"
    viewBox="0 0 22 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.77475 2.28389C4.77475 3.52898 3.82671 4.5366 2.34415 4.5366C0.919355 4.5366 -0.0286772 3.52898 0.000662254 2.28389C-0.0286772 0.978283 0.919332 0 2.37255 0C3.82669 0 4.74633 0.978283 4.77475 2.28389ZM0.119858 20.8191V6.31621H4.62712V20.8181H0.119858V20.8191Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.2398 10.9441C8.2398 9.13517 8.1802 7.59301 8.12061 6.31767H12.0356L12.2437 8.3045H12.3326C12.9259 7.38489 14.4084 5.99219 16.8106 5.99219C19.7757 5.99219 22 7.94968 22 12.2186V20.8205H17.4927V12.7833C17.4927 10.9139 16.8408 9.63944 15.2098 9.63944C13.9637 9.63944 13.2229 10.4995 12.9268 11.3292C12.8076 11.6263 12.7489 12.0407 12.7489 12.4569V20.8205H8.24162V10.9441H8.2398Z"
      fill="white"
    />
  </svg>
);

const InstagramLogoIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2.16215C15.2041 2.16215 15.5837 2.17439 16.849 2.23212C18.019 2.28547 18.6544 2.48096 19.0773 2.6453C19.6374 2.86299 20.0371 3.12302 20.457 3.54291C20.877 3.96286 21.137 4.3626 21.3547 4.92273C21.519 5.34557 21.7145 5.98096 21.7679 7.15095C21.8256 8.41629 21.8378 8.79584 21.8378 11.9999C21.8378 15.2041 21.8256 15.5836 21.7679 16.849C21.7145 18.019 21.519 18.6543 21.3547 19.0772C21.137 19.6373 20.877 20.0371 20.4571 20.457C20.0371 20.8769 19.6374 21.1369 19.0773 21.3546C18.6544 21.519 18.019 21.7144 16.849 21.7678C15.5839 21.8255 15.2044 21.8378 12 21.8378C8.79563 21.8378 8.41618 21.8255 7.15097 21.7678C5.98098 21.7144 5.34559 21.519 4.92274 21.3546C4.36261 21.1369 3.96287 20.8769 3.54297 20.457C3.12308 20.0371 2.863 19.6373 2.64531 19.0772C2.48097 18.6543 2.28548 18.019 2.23213 16.849C2.1744 15.5836 2.16216 15.2041 2.16216 11.9999C2.16216 8.79584 2.1744 8.41629 2.23213 7.15095C2.28548 5.98096 2.48097 5.34557 2.64531 4.92273C2.863 4.3626 3.12303 3.96286 3.54297 3.54296C3.96287 3.12302 4.36261 2.86299 4.92274 2.6453C5.34559 2.48096 5.98098 2.28547 7.15097 2.23212C8.41632 2.17439 8.79587 2.16215 12 2.16215ZM12 0C8.741 0 8.33234 0.0138138 7.05241 0.072213C5.77516 0.130469 4.90283 0.333342 4.13954 0.629958C3.35044 0.936626 2.68123 1.34694 2.01406 2.01406C1.34695 2.68122 0.936629 3.35043 0.630008 4.13953C0.333343 4.90282 0.13047 5.77514 0.0722133 7.05239C0.0138139 8.33231 0 8.74096 0 11.9999C0 15.259 0.0138139 15.6676 0.0722133 16.9475C0.13047 18.2248 0.333343 19.0971 0.630008 19.8604C0.936629 20.6495 1.34695 21.3187 2.01406 21.9859C2.68123 22.653 3.35044 23.0633 4.13954 23.3699C4.90283 23.6666 5.77516 23.8694 7.05241 23.9277C8.33234 23.9861 8.741 23.9999 12 23.9999C15.259 23.9999 15.6677 23.9861 16.9476 23.9277C18.2248 23.8694 19.0972 23.6666 19.8605 23.3699C20.6496 23.0633 21.3188 22.653 21.9859 21.9859C22.653 21.3187 23.0634 20.6495 23.37 19.8604C23.6667 19.0971 23.8695 18.2248 23.9278 16.9475C23.9862 15.6676 24 15.259 24 11.9999C24 8.74096 23.9862 8.33231 23.9278 7.05239C23.8695 5.77514 23.6667 4.90282 23.37 4.13953C23.0634 3.35043 22.653 2.68122 21.9859 2.01406C21.3188 1.34694 20.6496 0.936626 19.8605 0.629958C19.0972 0.333342 18.2248 0.130469 16.9476 0.072213C15.6677 0.0138138 15.259 0 12 0Z"
      fill="white"
    />
    <path
      d="M12.0054 5.84375C8.60213 5.84375 5.84326 8.60261 5.84326 12.0059C5.84326 15.4092 8.60213 18.168 12.0054 18.168C15.4087 18.168 18.1676 15.4092 18.1676 12.0059C18.1676 8.60261 15.4087 5.84375 12.0054 5.84375ZM12.0054 16.0059C9.79627 16.0059 8.00542 14.215 8.00542 12.0059C8.00542 9.79675 9.79627 8.0059 12.0054 8.0059C14.2146 8.0059 16.0054 9.79675 16.0054 12.0059C16.0054 14.215 14.2146 16.0059 12.0054 16.0059Z"
      fill="white"
    />
    <path
      d="M19.8507 5.59627C19.8507 6.39152 19.206 7.03625 18.4107 7.03625C17.6154 7.03625 16.9707 6.39152 16.9707 5.59627C16.9707 4.80098 17.6154 4.15625 18.4107 4.15625C19.206 4.15625 19.8507 4.80098 19.8507 5.59627Z"
      fill="white"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="16" r="16" fill="#17172D" />
    <circle cx="16" cy="16" r="16" fill="#F2FBF6" />
    <path
      d="M22 12.25L13.7501 20.5L10 16.75"
      stroke="#65CB63"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
