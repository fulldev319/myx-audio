import { Box, useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react';
import { PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import { landPageStyles } from './index.styles';

const LandPage = () => {
  const classes = landPageStyles();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down(750));

  return (
    <Box className={classes.container}>
      <img
        src={require('assets/musicDAOImages/music_sticks.svg')}
        width="100%"
        height="100px"
        style={{
          objectFit: 'cover'
        }}
      />
      <Box className={classes.title}>
        Where would{' '}
        <span>
          <img src={require('assets/logos/MYX_logo_3.svg')} width={80} />
        </span>
        <br />
        you like to go?
      </Box>
      <Box display="flex" justifyContent="center" width={1}>
        <Box className={classes.description} mt={2} maxWidth={654} px={2}>
          Please select the Myx product you want to enter, in order to make
          transactions and listen to music you will need to connect your wallet
        </Box>
      </Box>
      <Box mt={10} className={classes.actionBox}>
        <Box
          style={{
            background:
              'linear-gradient(rgba(255, 255, 255, 0) 1%, rgb(255, 255, 255) 50.71%), conic-gradient(from 71.57deg at 43.63% 99.9%, rgb(43, 153, 255) -34.07deg, rgb(178, 52, 255) 21.26deg, rgb(68, 52, 255) 224.01deg, rgb(37, 14, 179) 256.07deg, rgb(43, 153, 255) 325.93deg, rgb(178, 52, 255) 381.26deg), linear-gradient(97.63deg, rgb(153, 206, 0) 26.36%, rgb(13, 204, 158) 20%)'
          }}
          className={classes.routerBox}
        >
          {!isMobile && (
            <>
              {/* <img
                src={require('assets/musicDAOImages/soundwave.png')}
                style={{ position: 'absolute', left: '10%', top: '15%' }}
                width="134px"
                height="134px"
              /> */}
              <img
                src={require('assets/musicDAOImages/play_1.png')}
                style={{ position: 'absolute', right: '20%', top: '7%' }}
                width="127px"
                height="127px"
              />
            </>
          )}
          <img
            src={require('assets/logos/Myx_music.png')}
            width={isTablet ? 120 : 190}
            style={{ marginTop: isMobile ? 0 : 100 }}
          />
          <Box className={classes.title1} mt={4} mb={isMobile ? 0 : 4}>
            Trade, collaborate and create NFTs
          </Box>
          {!isMobile && (
            <PrimaryButton className={classes.enterBtn} size="medium" isRounded>
              ENTER
            </PrimaryButton>
          )}
        </Box>
        <Box
          style={{
            background: `radial-gradient(79.43% 49.07% at 15.88% -0.13%, #7BE485 0%, #E4877B 0.01%, rgba(186, 159, 148, 0) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000100 100%), linear-gradient(186.95deg, #C070DE 5.44%, #805191 63.61%)`,
            filter: 'drop-shadow(0px 100px 76px rgba(0, 0, 0, 0.05))'
          }}
          className={classes.routerBox}
          mx={isTablet ? 2 : 4}
        >
          {!isMobile && (
            <>
              <img
                src={require('assets/musicDAOImages/group_1.svg')}
                style={{ position: 'absolute', left: '0%', top: '10%' }}
              />
              <img
                src={require('assets/musicDAOImages/group_2.svg')}
                style={{ position: 'absolute', right: '-5%', top: '5%' }}
              />
            </>
          )}
          <img
            src={require('assets/logos/Myx_Munks.png')}
            width={isTablet ? 120 : 190}
            style={{ marginTop: isMobile ? 0 : 100 }}
          />
          <Box
            className={classes.title1}
            mt={4}
            mb={isMobile ? 0 : 4}
            style={{ color: 'white' }}
          >
            Collect tunes like never before
          </Box>
          {!isMobile && (
            <SecondaryButton className={classes.enterBtn} size="medium" isRounded>
              ENTER
            </SecondaryButton>
          )}
        </Box>
        <Box
          style={{
            background: `linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.0) 15%, rgb(255, 254, 255) 65%), linear-gradient(rgba(243, 254, 247, 0.1) 49.94%, rgb(255, 255, 255, 0.8) 94.61%), linear-gradient(97.63deg, rgb(0, 194, 206, 0.4) 26.36%, rgb(13, 89, 204, 0.4) 80%),url(${require('assets/musicDAOImages/genre_group.png')})`
          }}
          className={classes.routerBox}
        >
          <img
            src={require('assets/logos/Myx_Player.png')}
            width={isTablet ? 120 : 190}
            style={{ marginTop: isMobile ? 0 : 100 }}
          />
          <Box className={classes.title1} mt={4} mb={isMobile ? 0 : 4}>
            Listen and explore new music
          </Box>
          {!isMobile && (
            <PrimaryButton className={classes.enterBtn} size="medium" isRounded>
              ENTER
            </PrimaryButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LandPage;
