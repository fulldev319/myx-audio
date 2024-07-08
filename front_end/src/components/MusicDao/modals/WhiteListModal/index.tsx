import React, { useEffect, useState, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';

import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';

import { Modal, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { useInterval } from 'shared/hooks/useInterval';
import URL from 'shared/functions/getURL';

import { whiteListModalStyles, TwitterLogoIcon } from './index.styles';
import { TwitterShareButton } from 'react-share';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import { useAuth } from 'shared/contexts/AuthContext';

const WhiteListModal = (props: any) => {
  const classes = whiteListModalStyles();
  const user = useTypedSelector(getUser);
  const { account } = useWeb3React();
  const { accountStatus, updateAccountStatus } = useAuth();
  const [email, setEmail] = useState<string>(user.email ?? '');
  const [tweetWaitListLoading, setTweetWaitlistLoading] =
    React.useState<boolean>(false);
  const [tweetEmailWaitListLoading, setTweetEmailWaitlistLoading] =
    React.useState<boolean>(false);
  const twitterButtonRef = useRef<any>();
  const [seed, setSeed] = useState<string>('');
  const [isTweeted, setIsTweeted] = useState<boolean>(false);

  useEffect(() => {
    if (seed) {
      twitterButtonRef.current?.click();
      setIsTweeted(true);
      setTweetWaitlistLoading(true);
    }
  }, [seed]);

  useInterval(() => {
    if (accountStatus !== 'authorized' && accountStatus !== 'waitlisted') {
      axios
        .post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account,
          appName: 'Myx'
        })
        .then((res) => {
          if (res.data.success === true) {
            const data = res.data.data;
            updateAccountStatus(data.status);
            if (
              accountStatus !== 'waitlisted' &&
              data.status === 'waitlisted'
            ) {
              setTweetWaitlistLoading(false);
              setTweetEmailWaitlistLoading(false);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, 10000);

  const onTwitter = () => {
    axios
      .get(`${URL()}/user/getUserSeed`)
      .then((res) => {
        if (res.data.success) {
          setSeed(res.data.seed);
        }
      })
      .catch((e) => {});
  };

  const whitelistEmail = () => {
    setTweetEmailWaitlistLoading(true);
    axios
      .post(`${URL()}/user/whitelistEmail`, {
        email,
        appName: 'Myx'
      })
      .then((res) => {
        if (res.data.success) {
          updateAccountStatus('waitlisted');
          setIsTweeted(true);
        }
      })
      .catch((e) => setTweetEmailWaitlistLoading(false));
  };

  return (
    <Modal
      size="small"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
      style={{
        background:
          accountStatus === 'waitlisted'
            ? 'linear-gradient(180deg, rgba(243, 254, 247, 0) 19.46%, #FFFFFF 73.29%), linear-gradient(105.02deg, #FCEE01 33.06%, #5AE64D 44.97%, #2CC2FF 62.41%, #536FFF 82.46%)'
            : 'white'
      }}
    >
      <Box className={classes.contentBox}>
        {accountStatus !== 'waitlisted' && !tweetWaitListLoading && (
          <>
            <Box className={classes.flexBox} justifyContent="center">
              <img src={require('assets/emojiIcons/salute.webp')} />
            </Box>
            <Box className={classes.header1} mt={4}>
              Hello, there!
              <br />
              Looking to mint NFTs, Upload Music or Create a Capsule?
            </Box>
            <Box className={classes.header2} mt={2} mb={4}>
              You will need to be authorized to mint NFTs, upload music and
              create Capsules. Please verify through twitter or email, and you will
              be notified in Myx or by email when you are authorized.
            </Box>
          </>
        )}
        {accountStatus === 'waitlisted' && (
          <Box position="relative" pt={10} textAlign="center">
            <img
              src={require('assets/musicDAOImages/orange.webp')}
              className={classes.musicBox3}
            />
            <img
              src={require('assets/musicDAOImages/watermelon.webp')}
              className={classes.musicBox4}
            />
            {isTweeted ? <CheckCircleIcon /> : <WaitIcon />}
          </Box>
        )}
        {tweetWaitListLoading && (
          <Box
            position="relative"
            pt={10}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <img
              className={classes.loader}
              src={require('assets/musicDAOImages/tweetLoading.webp')}
            />
            <div className={classes.twitterIcon}>
              <img src={require('assets/musicDAOImages/twitter.webp')} />
            </div>
          </Box>
        )}
        {accountStatus !== 'waitlisted' ? (
          !tweetWaitListLoading ? (
            <Box mt={6}>
              <TwitterShareButton
                title={`Changing the music industry, one song and Capsule at a time. :man_dancing: I just joined the waitlist for @myx_it. Collab, earn & create with me on the Web3 music space built for artists & fans :notes: https://bit.ly/withmyx #myxit`}
                url={seed}
                style={{ width: '100%' }}
                ref={twitterButtonRef}
              >
                <Box
                  className={classes.toConnectButton}
                  bgcolor={'#1DA1F2'}
                  mb="9px"
                  onClick={(e) => {
                    onTwitter();
                    e.stopPropagation();
                  }}
                >
                  <TwitterLogoIcon />
                  <Box fontSize={16} fontWeight={600} color="#ffffff">
                    Twitter
                  </Box>
                  <Box />
                </Box>
              </TwitterShareButton>
              <Box my={5} display="flex" alignItems="center">
                <Box className={classes.divider} />
                <Box className={classes.header3} mx={2}>
                  or
                </Box>
                <Box className={classes.divider} />
              </Box>
              <InputWithLabelAndTooltip
                labelName="Whitelist with email"
                tooltip="We will notify you when you have access to these features"
                theme="music dao"
                type="text"
                placeHolder="youremail@here.com"
                inputValue={email}
                onInputValueChange={(e) => setEmail(e.target.value)}
              />
              <Box display="flex" justifyContent="center" width={1} mt={3}>
                <LoadingWrapper loading={tweetEmailWaitListLoading}>
                  <PrimaryButton
                    size="medium"
                    onClick={whitelistEmail}
                    isRounded
                    style={{
                      background: '#2D3047',
                      paddingLeft: '58px',
                      paddingRight: '58px',
                      height: 52,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    Send
                  </PrimaryButton>
                </LoadingWrapper>
              </Box>
            </Box>
          ) : (
            <Box mt={6} mb={8}>
              <Box className={classes.header5}>Validating access...</Box>
              <Box className={classes.header4}>
                This will take a moment, <br />
                please do not close this window.
              </Box>
            </Box>
          )
        ) : (
          <Box mb={5}>
            <Box className={classes.header5}>
              {isTweeted ? 'Congrats!' : 'Uh-oh…'}
            </Box>
            <Box className={classes.header4} mb={2}>
              {isTweeted
                ? 'You’re successfully whitelisted.'
                : 'But don’t fear.. you are already whitelisted!'}
            </Box>
            <Box className={classes.header21} mb={4}>
              In the meantime, we thank you for your patience and enjoy Myx!
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default WhiteListModal;

const CheckCircleIcon = () => (
  <svg
    width="155"
    height="155"
    viewBox="0 0 155 155"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M91.2532 140.095C99.9986 138.289 108.303 134.778 115.691 129.762C123.079 124.747 129.408 118.326 134.315 110.865C139.221 103.404 142.61 95.0491 144.289 86.2783C145.967 77.5075 145.901 68.4921 144.095 59.7468C142.289 51.0014 138.778 42.6975 133.762 35.309C128.747 27.9205 122.326 21.5922 114.865 16.6855C107.404 11.7787 99.0491 8.3895 90.2783 6.71142C81.5075 5.03335 72.4921 5.09924 63.7468 6.90534C55.0014 8.71144 46.6975 12.2224 39.309 17.2377C31.9205 22.253 25.5922 28.6745 20.6855 36.1355C15.7787 43.5965 12.3895 51.9509 10.7114 60.7217C9.03335 69.4925 9.09924 78.5079 10.9053 87.2532C12.7114 95.9986 16.2224 104.303 21.2377 111.691C26.253 119.079 32.6745 125.408 40.1355 130.315C47.5965 135.221 55.9509 138.611 64.7217 140.289C73.4925 141.967 82.5079 141.901 91.2532 140.095L91.2532 140.095Z"
      stroke="white"
    />
    <g filter="url(#filter0_d_10159_231033)">
      <circle cx="77.5" cy="73.5" r="51.5" fill="white" />
    </g>
    <path
      d="M63.707 73.4668L72.9238 82.6836L91.2949 64.3125"
      stroke="url(#paint0_linear_10159_231033)"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M63.707 73.4668L72.9238 82.6836L91.2949 64.3125"
      stroke="url(#paint1_linear_10159_231033)"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <filter
        id="filter0_d_10159_231033"
        x="0"
        y="0"
        width="155"
        height="155"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="13" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_10159_231033"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_10159_231033"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_10159_231033"
        x1="65.7953"
        y1="72.7387"
        x2="89.7378"
        y2="77.5549"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.179206" stopColor="#A0D800" />
        <stop offset="0.852705" stopColor="#0DCC9E" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_10159_231033"
        x1="44"
        y1="100"
        x2="105.5"
        y2="80"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.0590544" stopColor="#FCEE01" />
        <stop offset="0.25514" stopColor="#5AE64D" />
        <stop offset="0.542333" stopColor="#2CC2FF" />
        <stop offset="0.872428" stopColor="#536FFF" />
      </linearGradient>
    </defs>
  </svg>
);

const WaitIcon = () => (
  <svg
    width="163"
    height="163"
    viewBox="0 0 163 163"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.4"
      d="M95.2532 135.095C103.999 133.289 112.303 129.778 119.691 124.762C127.079 119.747 133.408 113.326 138.315 105.865C143.221 98.4035 146.61 90.0491 148.289 81.2783C149.967 72.5075 149.901 63.4921 148.095 54.7468C146.289 46.0014 142.778 37.6975 137.762 30.309C132.747 22.9205 126.326 16.5922 118.865 11.6855C111.404 6.77868 103.049 3.3895 94.2783 1.71142C85.5075 0.0333474 76.4921 0.099241 67.7468 1.90534C59.0014 3.71144 50.6975 7.22238 43.309 12.2377C35.9205 17.253 29.5922 23.6745 24.6855 31.1355C19.7787 38.5965 16.3895 46.9509 14.7114 55.7217C13.0333 64.4925 13.0992 73.5079 14.9053 82.2532C16.7114 90.9986 20.2224 99.3025 25.2377 106.691C30.253 114.079 36.6745 120.408 44.1355 125.315C51.5965 130.221 59.9509 133.611 68.7217 135.289C77.4925 136.967 86.5079 136.901 95.2532 135.095L95.2532 135.095Z"
      stroke="white"
    />
    <g filter="url(#filter0_d_10159_231048)">
      <circle cx="81.5" cy="68.5" r="51.5" fill="white" />
    </g>
    <path
      d="M89.8554 56.5C90.2604 56.5 90.4999 56.958 90.2679 57.29C90.0909 57.5435 89.8834 57.778 89.6469 57.9865L81.6614 65.032C81.2834 65.3655 80.7164 65.3655 80.3384 65.032L72.3534 57.9865C72.1169 57.778 71.9094 57.5435 71.7319 57.29C71.4999 56.958 71.7394 56.5 72.1444 56.5H89.8554Z"
      fill="black"
    />
    <path
      d="M89.8554 56.5C90.2604 56.5 90.4999 56.958 90.2679 57.29C90.0909 57.5435 89.8834 57.778 89.6469 57.9865L81.6614 65.032C81.2834 65.3655 80.7164 65.3655 80.3384 65.032L72.3534 57.9865C72.1169 57.778 71.9094 57.5435 71.7319 57.29C71.4999 56.958 71.7394 56.5 72.1444 56.5H89.8554Z"
      fill="url(#paint0_linear_10159_231048)"
    />
    <path
      d="M81.357 76.1395L90.3645 79.664C90.748 79.814 91 80.1835 91 80.595V81.5C91 82.0525 90.5525 82.5 90 82.5H72C71.4475 82.5 71 82.0525 71 81.5V80.443C71 80.026 71.2585 79.653 71.649 79.5065L80.6415 76.1345C80.8725 76.048 81.127 76.0495 81.357 76.1395Z"
      fill="black"
    />
    <path
      d="M81.357 76.1395L90.3645 79.664C90.748 79.814 91 80.1835 91 80.595V81.5C91 82.0525 90.5525 82.5 90 82.5H72C71.4475 82.5 71 82.0525 71 81.5V80.443C71 80.026 71.2585 79.653 71.649 79.5065L80.6415 76.1345C80.8725 76.048 81.127 76.0495 81.357 76.1395Z"
      fill="url(#paint1_linear_10159_231048)"
    />
    <path
      d="M97 54.9875V48.5C97 46.843 95.657 45.5 94 45.5H68C66.343 45.5 65 46.843 65 48.5V54.9875C65 57.8565 66.2325 60.5875 68.384 62.486L72.65 66.25C73.101 66.648 73.101 67.3515 72.65 67.7495L68.3835 71.514C66.2325 73.4125 65 76.1435 65 79.0125V85.5C65 87.157 66.343 88.5 68 88.5H94C95.657 88.5 97 87.157 97 85.5V79.0125C97 76.1435 95.7675 73.4125 93.616 71.514L89.35 67.75C88.899 67.352 88.899 66.6485 89.35 66.2505L93.6165 62.486C95.7675 60.5875 97 57.8565 97 54.9875ZM93 54.9875C93 56.7085 92.2605 58.3485 90.9695 59.4865L84.154 65.5005C83.2515 66.2965 83.2515 67.7035 84.154 68.5L90.97 74.514C92.2605 75.6525 93 77.291 93 79.0125V83.5C93 84.0525 92.5525 84.5 92 84.5H70C69.4475 84.5 69 84.0525 69 83.5V79.013C69 77.2915 69.7395 75.653 71.0305 74.514L77.8465 68.5C78.749 67.704 78.749 66.297 77.8465 65.5005L71.0305 59.4865C69.7395 58.348 69 56.7085 69 54.9875V50.5C69 49.9475 69.4475 49.5 70 49.5H92C92.5525 49.5 93 49.9475 93 50.5V54.9875Z"
      fill="black"
    />
    <path
      d="M97 54.9875V48.5C97 46.843 95.657 45.5 94 45.5H68C66.343 45.5 65 46.843 65 48.5V54.9875C65 57.8565 66.2325 60.5875 68.384 62.486L72.65 66.25C73.101 66.648 73.101 67.3515 72.65 67.7495L68.3835 71.514C66.2325 73.4125 65 76.1435 65 79.0125V85.5C65 87.157 66.343 88.5 68 88.5H94C95.657 88.5 97 87.157 97 85.5V79.0125C97 76.1435 95.7675 73.4125 93.616 71.514L89.35 67.75C88.899 67.352 88.899 66.6485 89.35 66.2505L93.6165 62.486C95.7675 60.5875 97 57.8565 97 54.9875ZM93 54.9875C93 56.7085 92.2605 58.3485 90.9695 59.4865L84.154 65.5005C83.2515 66.2965 83.2515 67.7035 84.154 68.5L90.97 74.514C92.2605 75.6525 93 77.291 93 79.0125V83.5C93 84.0525 92.5525 84.5 92 84.5H70C69.4475 84.5 69 84.0525 69 83.5V79.013C69 77.2915 69.7395 75.653 71.0305 74.514L77.8465 68.5C78.749 67.704 78.749 66.297 77.8465 65.5005L71.0305 59.4865C69.7395 58.348 69 56.7085 69 54.9875V50.5C69 49.9475 69.4475 49.5 70 49.5H92C92.5525 49.5 93 49.9475 93 50.5V54.9875Z"
      fill="url(#paint2_linear_10159_231048)"
    />
    <defs>
      <filter
        id="filter0_d_10159_231048"
        x="0"
        y="0"
        width="163"
        height="163"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="4"
          operator="dilate"
          in="SourceAlpha"
          result="effect1_dropShadow_10159_231048"
        />
        <feOffset dy="13" />
        <feGaussianBlur stdDeviation="13" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.152222 0 0 0 0 0.168967 0 0 0 0 0.570833 0 0 0 0.08 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_10159_231048"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_10159_231048"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_10159_231048"
        x1="65.5"
        y1="63.5"
        x2="106.079"
        y2="62.9027"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.00074307" stopColor="#FCEE01" />
        <stop offset="0.25514" stopColor="#5AE64D" />
        <stop offset="0.542333" stopColor="#2CC2FF" />
        <stop offset="0.872428" stopColor="#536FFF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_10159_231048"
        x1="65.5"
        y1="63.5"
        x2="106.079"
        y2="62.9027"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.00074307" stopColor="#FCEE01" />
        <stop offset="0.25514" stopColor="#5AE64D" />
        <stop offset="0.542333" stopColor="#2CC2FF" />
        <stop offset="0.872428" stopColor="#536FFF" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_10159_231048"
        x1="65.5"
        y1="63.5"
        x2="106.079"
        y2="62.9027"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.00074307" stopColor="#FCEE01" />
        <stop offset="0.25514" stopColor="#5AE64D" />
        <stop offset="0.542333" stopColor="#2CC2FF" />
        <stop offset="0.872428" stopColor="#536FFF" />
      </linearGradient>
    </defs>
  </svg>
);
