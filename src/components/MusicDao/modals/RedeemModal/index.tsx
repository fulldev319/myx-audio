import React from 'react';
import { Color, Modal, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { redeemModalStyles } from './index.styles';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ConfirmIcon } from 'components/MusicDao/subPages/PotionSongDetailPage';

export const RedeemModal = (props: any) => {
  const classes = redeemModalStyles();
  const [result, setResult] = React.useState<boolean>(false); // true : success, false : fail
  const [step, setStep] = React.useState<number>(0);

  const { showAlertMessage } = useAlertMessage();

  const firstScreen = () => (
    <>
      <Box className={classes.title} mt={2}>
        Redeem USDC
      </Box>
      <Box className={classes.header1} mt={1}>
        Redeem your accumulated revenue and enjoy your profits.
      </Box>
      <Box
        className={classes.greenBox}
        mt={2}
        style={{ textTransform: 'uppercase' }}
        width={1}
      >
        <Box mt={2} width={1}>
          <Box className={classes.header2}>Amount to be paid out </Box>
          <Box className={classes.header3} px={4}>
            2425 <span>USD</span>
          </Box>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" mt={3}>
        <SecondaryButton
          size="medium"
          isRounded
          style={{ width: '40%' }}
          onClick={props.handleClose}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          size="medium"
          isRounded
          style={{ width: '40%' }}
          onClick={() => setStep(1)}
        >
          Unstake
        </PrimaryButton>
      </Box>
    </>
  );

  const secondScreen = () => (
    <>
      <div style={{ position: 'relative' }}>
        <img src={require('assets/musicDAOImages/loading.webp')} />
        <div className={classes.ethImg}>
          <img src={require('assets/musicDAOImages/eth.webp')} />
        </div>
      </div>
      <Box className={classes.title} mt={4}>
        Transaction in progress
      </Box>
      <Box className={classes.header1} mt={1} mb={2}>
        Transaction is proceeding on Polygon blockchain. <br />
        This can take a moment, please be patient...
      </Box>
      <CopyToClipboard
        text={'0xf273a38fec99acf1e....eba'}
        onCopy={() => {
          showAlertMessage('Copied to clipboard', { variant: 'success' });
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ cursor: 'pointer' }}
        >
          <CopyIcon />
          <Box className={classes.header2} ml={1} mr={1}>
            0xf273a38fec99acf1e....eba
          </Box>
          <Box className={classes.header1} mr={2}>
            Hash:
          </Box>
        </Box>
      </CopyToClipboard>
      <PrimaryButton
        size="medium"
        style={{ background: Color.MusicDAOGreen, marginTop: '24px' }}
        isRounded
        onClick={() => setStep(2)}
      >
        Check on Polygon Scan
      </PrimaryButton>
    </>
  );

  const thirdScreen = () => (
    <>
      <img src={require('assets/musicDAOImages/bop.webp')} />
      <Box className={classes.title} mt={-2}>
        Successfully Redeemed USDC
      </Box>
      <Box className={classes.header1} mt={1}>
        You are at 100 Beats to reach new level.
      </Box>
      <Box display="flex" justifyContent="center">
        <Box className={classes.grayBorderBox} my={2}>
          <Box className={classes.header1}>Amount redeemed</Box>
          <Box className={classes.header2} mt={2}>
            2244 USDC
          </Box>
        </Box>
      </Box>
      <Box className={classes.customButtonBox} mt={3}>
        <ConfirmIcon color={Color.MusicDAODark} />
        <Box
          className={classes.header2}
          style={{ color: 'white' }}
          mx={5}
          zIndex={1}
        >
          DONE
        </Box>
      </Box>
    </>
  );

  const resultScreen = () => (
    <>
      <img
        src={
          result
            ? require('assets/musicDAOImages/result_success.webp')
            : require('assets/musicDAOImages/result_fail.webp')
        }
      />
      <Box className={classes.title} mt={4}>
        {result ? 'Transaction successful' : 'Transaction failed'}
      </Box>
      {result ? (
        <Box className={classes.header1} mt={1} mb={2}>
          Everything wen’t well. You can chack your <br />
          transaction link below.
        </Box>
      ) : (
        <Box className={classes.header1} mt={1} mb={2}>
          Unfortunately the transaction failed to go through on the blockchain,
          please try again later. You can check your transaction link for more
          details.
        </Box>
      )}
      <CopyToClipboard
        text={'0xf273a38fec99acf1e....eba'}
        onCopy={() => {
          showAlertMessage('Copied to clipboard', { variant: 'success' });
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ cursor: 'pointer' }}
        >
          <Box className={classes.header1} mr={2}>
            Hash:
          </Box>
          <Box className={classes.header2} mr={1}>
            0xf273a38fec99acf1e....eba
          </Box>
          <CopyIcon />
        </Box>
      </CopyToClipboard>
      <PrimaryButton
        size="medium"
        style={{ background: Color.MusicDAOGreen, marginTop: '24px' }}
        isRounded
        onClick={() => setStep(2)}
      >
        Check on Polygon Scan
      </PrimaryButton>
    </>
  );

  return (
    <Modal
      size="small"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      {step === 0
        ? firstScreen()
        : step === 1
        ? secondScreen()
        : step === 2
        ? thirdScreen()
        : resultScreen()}
    </Modal>
  );
};

const CopyIcon = () => (
  <svg
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.5833 10.0833H14.8333C15.7538 10.0833 16.5 9.37445 16.5 8.5V2.95833C16.5 2.08388 15.7538 1.375 14.8333 1.375H9C8.07953 1.375 7.33333 2.08388 7.33333 2.95833V4.14583M3.16667 15.625H9C9.92047 15.625 10.6667 14.9161 10.6667 14.0417V8.5C10.6667 7.62555 9.92047 6.91667 9 6.91667H3.16667C2.24619 6.91667 1.5 7.62555 1.5 8.5V14.0417C1.5 14.9161 2.24619 15.625 3.16667 15.625Z"
      stroke="#65CB63"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
