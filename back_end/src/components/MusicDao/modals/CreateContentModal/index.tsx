import React from 'react';
import { useHistory } from 'react-router-dom';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useTypedSelector } from 'store/reducers/Reducer';

import {
  Color,
  ContentType,
  Modal,
  PrimaryButton,
  SecondaryButton
} from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';

import { createContentModalStyles } from './index.styles';

const CreateContentModal = (props: any) => {
  const classes = createContentModalStyles();
  const user = useTypedSelector((state) => state.user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const history = useHistory();

  const isValidAvatar = React.useMemo(() => !!user?.urlIpfsImage, [user]);

  const [step, setStep] = React.useState(0);

  return !isValidAvatar ? (
    <Modal
      size="small"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      <Box className={`${classes.title} ${classes.avatarTitle}`} mb={3}>
        Information
      </Box>
      <Box className={classes.avatarContentBox}>
        <UserAvatar />
        <Box className={classes.profileDescription} my={3}>
          Please upload your profile photo before creating content
        </Box>
        <PrimaryButton
          size="medium"
          isRounded
          onClick={() => {
            props.handleClose();
            history.push(`/profile/${user.urlSlug}`);
          }}
          style={{ background: Color.MusicDAODeepGreen }}
        >
          Go to profile
        </PrimaryButton>
      </Box>
    </Modal>
  ) : (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      fullScreen
      showCloseIcon
      className={classes.root}
      style={{
        padding: 0,
        maxWidth: '100vw',
        maxHeight: '100vh',
        width: '100vw',
        height: '100vh',
        borderRadius: 0
      }}
    >
      <Box className={classes.contentBox}>
        <Box className={classes.title}>Create content on MYX</Box>
        <Box className={classes.subTitle}>
          In the following flows you will customize financial and NFT settings
          of your audio assets. All NFTs are minted on Polygon and available on
          OpenSea, and have the option to earn revenues when streamed on Myx.
        </Box>
        <Box className={classes.questionBox}>
          {step === 0 ? (
            <>
              <Box className={classes.typo1}>
                Do you already have the audio file(s)?
              </Box>
              <Box
                display={'flex'}
                flexDirection={isMobile ? 'column' : 'row'}
                mt={3}
              >
                <Box
                  className={classes.questionItemBox}
                  onClick={() => setStep(1)}
                >
                  <span>Yes, I do</span>
                </Box>
                <Box
                  className={classes.questionItemBox}
                  ml={isMobile ? 0 : 3}
                  mt={isMobile ? 3 : 0}
                  onClick={() => {
                    // props.onClickeContentCreation(ContentType.PodInvestment);
                  }}
                >
                  <span>No, I don't</span>
                  <div className={classes.comingSoon}>Coming Soon</div>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box className={classes.typo1}>
                For these works, are you a solo artist?
              </Box>
              <Box
                display={'flex'}
                flexDirection={isMobile ? 'column' : 'row'}
                mt={3}
              >
                <Box
                  className={classes.questionItemBox}
                  onClick={() => {
                    props.onClickeContentCreation(ContentType.SongMultiEdition);
                  }}
                >
                  <span>
                    Yes, I am the <br /> single owner
                  </span>
                </Box>
                <Box
                  className={classes.questionItemBox}
                  ml={isMobile ? 0 : 3}
                  mt={isMobile ? 3 : 0}
                  onClick={() => {
                    props.onClickeContentCreation(ContentType.PodCollaborative);
                  }}
                >
                  <span>
                    No, I'm a part of <br /> a collaboration
                  </span>
                  {/* <div className={classes.comingSoon}>Coming Soon</div> */}
                </Box>
              </Box>
            </>
          )}
        </Box>
        <Box
          borderTop="1px solid white"
          position="absolute"
          bottom={0}
          width={1}
          px={3}
          pt={2}
          pb={4}
          display="flex"
          justifyContent="center"
        >
          <Box display="flex" alignItems="center" maxWidth={850} width={1}>
            <SecondaryButton
              size="medium"
              isRounded
              style={{
                background: 'none',
                border: `1px solid ${Color.MusicDAODark}`
              }}
              onClick={() => {
                if (step === 1) {
                  setStep(0);
                } else {
                  props.handleClose && props.handleClose();
                }
              }}
            >
              Back
            </SecondaryButton>
            {/* <PrimaryButton size="medium" isRounded onClick={() => setStep(1)}>
              Next
            </PrimaryButton> */}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateContentModal;

const UserAvatar = () => (
  <svg
    width="92"
    height="92"
    viewBox="0 0 92 92"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M46 91.5312C71.1462 91.5312 91.5312 71.1462 91.5312 46C91.5312 20.8538 71.1462 0.46875 46 0.46875C20.8538 0.46875 0.46875 20.8538 0.46875 46C0.46875 71.1462 20.8538 91.5312 46 91.5312Z"
      fill="#E6ECFF"
    />
    <path
      d="M82.538 73.1349C78.2916 67.4497 72.7777 62.8334 66.4345 59.6527C60.0912 56.472 53.0935 54.8147 45.9975 54.8125C38.9015 54.8103 31.9028 56.4632 25.5576 59.6399C19.2124 62.8166 13.6955 67.4295 9.44556 73.112C13.6739 78.8233 19.1817 83.4644 25.5274 86.6631C31.873 89.8618 38.8798 91.5291 45.986 91.5313C53.0923 91.5335 60.1001 89.8706 66.4477 86.6759C72.7954 83.4812 78.3061 78.8435 82.538 73.1349Z"
      fill="#4294FF"
    />
    <path
      d="M46 48.9375C55.734 48.9375 63.625 41.0465 63.625 31.3125C63.625 21.5785 55.734 13.6875 46 13.6875C36.266 13.6875 28.375 21.5785 28.375 31.3125C28.375 41.0465 36.266 48.9375 46 48.9375Z"
      fill="#4294FF"
    />
  </svg>
);
