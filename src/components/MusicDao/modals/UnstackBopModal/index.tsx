import React from 'react';
import axios from 'axios';

import { Color, Modal, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { TokenSelect } from 'shared/ui-kit/Select/TokenSelect';
import URL from 'shared/functions/getURL';
import { unstackBopModalStyles } from './index.styles';
import { ConfirmIcon } from 'components/MusicDao/subPages/PotionSongDetailPage';

export const UnstackBopModal = (props: any) => {
  const classes = unstackBopModalStyles();

  const [tokens, setTokens] = React.useState<any[]>([]);
  const [token, setToken] = React.useState<string>();

  const [isUnstacked, setIsUnstacked] = React.useState<boolean>(false);

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
            Successfuly Unstaked
          </Box>
          <Box className={classes.header1} mt={1}>
            You have successfully unstaked your TRAX/Stablecoin position. Your
            NFT was destroyed.
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
            Unstake USDT
          </Box>
          <Box className={classes.header1} mt={1}>
            Unstaking your position will reduce the intensity of you Bop and
            reduce the share of revenue for that position.
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
            className={classes.greenBox}
            mt={2}
            style={{ textTransform: 'uppercase' }}
            width={1}
          >
            <Box style={{ borderBottom: '1px solid #DAE6E5' }} width={1} pb={2}>
              <Box className={classes.header2}>unstaking stablecoin fee</Box>
              <Box className={classes.title}>
                23 USD <span>(5%)</span>
              </Box>
            </Box>
            <Box mt={2} width={1}>
              <Box className={classes.header2}>FUNDS to be paid out</Box>
              <Box display="flex" width={1} justifyContent="center" mt={1}>
                <Box className={classes.header3} px={4}>
                  2425 <span>USDT</span>
                </Box>
                <Box className={classes.header3} px={4}>
                  244 <span>TRAX</span>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={3}
          >
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
              onClick={() => setIsUnstacked(true)}
            >
              Unstake
            </PrimaryButton>
          </Box>
        </>
      )}
    </Modal>
  );
};
