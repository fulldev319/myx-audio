import React from 'react';
import axios from 'axios';
import { Color, Modal } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { TokenSelect } from 'shared/ui-kit/Select/TokenSelect';
import URL from 'shared/functions/getURL';
import { ConfirmIcon } from 'components/MusicDao/subPages/PotionSongDetailPage';
import { addStackBopModalStyles } from './index.styles';

export const AddStackBopModal = (props: any) => {
  const classes = addStackBopModalStyles();
  const [isUnstacked, setIsUnstacked] = React.useState<boolean>(false);

  const [tokens, setTokens] = React.useState<any[]>([]);
  const [token, setToken] = React.useState<string>();

  React.useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then((res) => {
      const resp = res.data;
      if (resp.success) {
        setTokens(
          resp.data.map((obj) => ({ token: obj.token, name: obj.token }))
        ); // update token list
        setToken(resp.data[0].token);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      size="small"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      {isUnstacked ? (
        <>
          <img src={require('assets/musicDAOImages/bop.webp')} />
          <Box className={classes.title} mt={-2}>
            You have added stake
          </Box>
          <Box className={classes.header1} mt={1}>
            You are at 100 Beats to reach new level.
          </Box>
          <Box display="flex" justifyContent="center">
            <Box className={classes.grayBorderBox} my={2}>
              <Box pr={3} style={{ borderRight: '1px solid #CCD1DE' }}>
                <Box className={classes.header1}>Satake Added </Box>
                <Box className={classes.header2} mt={1}>
                  2244 USDT
                </Box>
              </Box>
              <Box pl={3}>
                <Box className={classes.header1}>Your Total Stake</Box>
                <Box className={classes.header2} mt={1}>
                  2244 USDT
                </Box>
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
      ) : (
        <>
          <Box className={classes.title} mt={2}>
            Add Stake
          </Box>
          <Box className={classes.header1} mt={1}>
            Bubble Dispersion by Mila Kunis
          </Box>
          <Box className={classes.greenBox} mt={2} py={2} width={1}>
            <Box pl={4}>
              <Box className={classes.header2}>Your current stake</Box>
              <Box className={classes.title}>2424 USDT</Box>
            </Box>
          </Box>
          <Box className={classes.greenBox} mt={2} width={1}>
            <Box pr={4} style={{ borderRight: '1px solid #DAE6E5' }} py={2}>
              <Box className={classes.header2}>
                Global Staking in this track
              </Box>
              <Box className={classes.title}>2424 USDT</Box>
            </Box>
            <Box pl={4} py={2}>
              <Box className={classes.header2}>Total Bops in this track</Box>
              <Box className={classes.title}>2424 USDT</Box>
            </Box>
          </Box>
          <Box p={4} textAlign="start">
            <Box display="flex">
              <Box
                className={classes.header1}
                mr={1}
                style={{ color: Color.MusicDAODark }}
              >
                Increase intensity of card by stakig stablecoin
              </Box>
              <InfoIcon />
            </Box>
            <Box className={classes.header1} mt={1}>
              Input your amount of stablecoin to stake. The more you stake on
              your position, the more return you can generate.
            </Box>
            <Box
              className={classes.header1}
              mt={3}
              mb={1}
              textAlign="start"
              style={{ color: Color.MusicDAODark }}
            >
              Set amount to unstake
            </Box>
            <Box display="flex" alignItems="center">
              <TokenSelect
                tokens={tokens}
                value={token}
                className={classes.tokenSelect}
                onChange={(e) => {
                  setToken(e.target.value);
                }}
              />
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                className={classes.tokenValue}
                ml={1.5}
              >
                <input />
                <span>Use Max</span>
              </Box>
            </Box>
            <Box className={classes.header4} mt={1} textAlign="start">
              Balance: 4544 USDT
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Box
                  className={classes.header1}
                  mt={3}
                  mb={1}
                  textAlign="start"
                  style={{ color: Color.MusicDAODark }}
                >
                  Revenue Calculator
                </Box>
                <Box className={classes.header1} mt={1}>
                  Input your amount of stablecoin to stake. The more you stake
                  on your position, the more return you can generate.
                </Box>
              </Box>
              <DropIcon />
            </Box>
          </Box>
          <Box
            className={classes.customButtonBox}
            mt={3}
            onClick={() => setIsUnstacked(true)}
          >
            <ConfirmIcon color={Color.MusicDAODark} />
            <Box
              className={classes.header2}
              style={{ color: 'white' }}
              mx={5}
              zIndex={1}
            >
              CONFIRM
            </Box>
          </Box>
        </>
      )}
    </Modal>
  );
};

const InfoIcon = () => (
  <svg
    width="17"
    height="18"
    viewBox="0 0 17 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      y="0.700195"
      width="16.6003"
      height="16.6003"
      rx="8.30014"
      fill="#54658F"
      fillOpacity="0.3"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.1027 4.72916C9.1027 5.34353 8.61632 5.83845 7.99341 5.83845C7.37903 5.83845 6.88411 5.34353 6.88411 4.72916C6.88411 4.10624 7.37903 3.61133 7.99341 3.61133C8.61632 3.61133 9.1027 4.10624 9.1027 4.72916ZM10.6719 12.9721C10.6719 13.3219 10.3988 13.5694 10.049 13.5694H6.57604C6.22618 13.5694 5.95312 13.3219 5.95312 12.9721C5.95312 12.6393 6.22618 12.3748 6.57604 12.3748H7.63413V8.45811H6.7211C6.37124 8.45811 6.09819 8.21065 6.09819 7.86079C6.09819 7.52801 6.37124 7.26348 6.7211 7.26348H8.32531C8.76049 7.26348 8.99089 7.57067 8.99089 8.03145V12.3748H10.049C10.3988 12.3748 10.6719 12.6393 10.6719 12.9721Z"
      fill="#2D3047"
    />
  </svg>
);

const DropIcon = () => (
  <svg
    width="30"
    height="31"
    viewBox="0 0 30 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      y="0.556641"
      width="30"
      height="30"
      rx="15"
      fill="#4218B5"
      fillOpacity="0.05"
    />
    <path
      d="M10 14.1133L15 19.1133L20 14.1133"
      stroke="#4218B5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
