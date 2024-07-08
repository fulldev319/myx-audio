import React from 'react';
import { Color, Modal, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { ConfirmIcon } from 'components/MusicDao/subPages/PotionSongDetailPage';
import { unravelBopStyles } from './index.styles';

export const UnravelBopModal = (props: any) => {
  const classes = unravelBopStyles();
  const [isUnstacked, setIsUnstacked] = React.useState<boolean>(false);

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
            Unravel Bop
          </Box>
          <Box className={classes.header1} mt={1}>
            Unstaking your position will permanently delete the NFT assigned to
            your position and all Potions (TPR) and Rewards accumulated, and
            return the funds staked on that position.
          </Box>
          <Box
            className={classes.greenBox}
            mt={2}
            style={{ textTransform: 'uppercase' }}
            width={1}
          >
            <Box
              display="flex"
              style={{ borderBottom: '1px solid #DAE6E5' }}
              width={1}
              justifyContent="center"
              pb={2}
            >
              <Box pr={4} borderRight="1px solid #DAE6E5">
                <Box className={classes.header2}>fee on stableCoin</Box>
                <Box className={classes.title}>
                  23 USD <span>(5%)</span>
                </Box>
              </Box>
              <Box pl={4}>
                <Box className={classes.header2}>taxation on TRAX</Box>
                <Box className={classes.title}>
                  23 USD <span>(5%)</span>
                </Box>
              </Box>
            </Box>
            <Box mt={2} width={1}>
              <Box className={classes.header2}>FUNDS to be paid out </Box>
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
