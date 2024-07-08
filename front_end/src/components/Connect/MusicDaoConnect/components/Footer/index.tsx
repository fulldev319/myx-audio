import React from 'react';

import { ReactComponent as YoutubeIcon } from 'assets/snsIcons/youtube.svg';
import { ReactComponent as TwitterIcon } from 'assets/snsIcons/twitter.svg';
import { ReactComponent as InstagramIcon } from 'assets/snsIcons/instagram.svg';
import { ReactComponent as LinkedInIcon } from 'assets/snsIcons/linkedin.svg';
import { ReactComponent as TiktokIcon } from 'assets/snsIcons/tiktok.svg';
import { ReactComponent as MediaIcon } from 'assets/snsIcons/media.svg';
import { ReactComponent as DiscordIcon } from 'assets/snsIcons/discord.svg';
import { ReactComponent as TelegramIcon } from 'assets/snsIcons/telegram.svg';
import Box from 'shared/ui-kit/Box';
import { bottomStyles } from './index.styles';

import {
  handleDiscordLink,
  handleTelegramLink,
  handleYoutubeLink,
  handleTwitterLink,
  handleInstagramLink,
  handleLinkedinLink,
  handleTiktokLink,
  handleMediumLink,
  handleAboutLink,
  handleNewsletterLink,
  handleWyrtNFTLink,
  handleClaimIDOTokenLink,
  handleTermsAndConditionsLink
} from 'shared/constants/constants';
import { useHistory } from 'react-router-dom';

const Bottom = () => {
  const classes = bottomStyles();
  const history = useHistory();

  return (
    <Box className={classes.bottomBox}>
      <Box className={classes.contentBox}>
        <Box flex={1}>
          <Box className={classes.title2} color="#181818">
            Find us on
          </Box>
          <Box className={classes.flexBox}>
            {/* <Box className={classes.snsBox} onClick={handleDiscordLink}>
              <DiscordIcon />
            </Box> */}
            <Box className={classes.snsBox} onClick={handleTwitterLink}>
              <TwitterIcon />
            </Box>
            <Box className={classes.snsBox} onClick={handleInstagramLink}>
              <InstagramIcon />
            </Box>
            {/* <Box className={classes.snsBox} onClick={handleTelegramLink}>
              <TelegramIcon />
            </Box> */}
          </Box>
          <Box className={classes.flexBox} mt={1}>
            {/* <Box className={classes.snsBox} onClick={handleLinkedinLink}>
              <LinkedInIcon />
            </Box> */}
            {/* <Box className={classes.snsBox} onClick={handleTiktokLink}>
              <TiktokIcon />
            </Box> */}
            <Box className={classes.snsBox} onClick={handleMediumLink}>
              <MediaIcon />
            </Box>
            {/* <Box className={classes.snsBox} onClick={handleYoutubeLink}>
              <YoutubeIcon width="26px" />
            </Box> */}
          </Box>
        </Box>
        <Box className={classes.navs} flex={2}>
          <div>
            <Box className={classes.title} mb={4}>
              Explore
            </Box>
            <Box className={classes.header1} onClick={() => history.push('/')}>
              Home
            </Box>
            <Box
              className={classes.header1}
              mt={1}
              onClick={() => history.push('/artists')}
            >
              Artists
            </Box>
            {/* <Box
              className={classes.header1}
              mt={1}
              onClick={() => history.push('/music')}
            >
              Music
            </Box> */}
            <Box
              className={classes.header1}
              mt={1}
              onClick={() => history.push('pods/')}
            >
              Capsules
            </Box>
          </div>
          <div>
            <Box className={classes.title} mb={4}>
              Learn
            </Box>
            <Box className={classes.header1}>Lightpaper</Box>
            <Box className={classes.header1} mt={1}>
              Knowledge Hub
            </Box>
            <Box className={classes.header1} mt={1}>
              Terms & Conditions
            </Box>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default Bottom;
