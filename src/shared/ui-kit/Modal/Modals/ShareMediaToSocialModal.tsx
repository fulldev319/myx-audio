import React from 'react';
import {
  TwitterShareButton,
  FacebookShareButton,
  RedditShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookMessengerShareButton
} from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Grid from '@material-ui/core/Grid';

import { shareMediaToSocialModalStyles } from './ShareMediaToSocialModal.styles';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { Modal } from 'shared/ui-kit';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';

const butterflyIcon = require('assets/icons/butterfly.webp');
const twitterIcon = require('assets/snsIcons/new/twitter.webp');
const facebookIcon = require('assets/snsIcons/new/facebook.webp');
const redditIcon = require('assets/snsIcons/new/reddit.webp');
const whatsappIcon = require('assets/snsIcons/new/whatsapp.webp');
const telegramIcon = require('assets/snsIcons/new/telegram.webp');
const messengerIcon = require('assets/snsIcons/new/messenger.webp');
const copyIcon = require('assets/icons/copy.webp');

type SocialMediaButtonProps = {
  shareMedia: () => void;
  color: string;
  name: string;
  icon: string;
  shareProps: any;
};

const SocialMediaButton: React.FC<SocialMediaButtonProps> = ({
  shareMedia,
  color,
  name,
  icon,
  shareProps
}) => {
  const classes = shareMediaToSocialModalStyles();
  let tagName: any = 'div';
  switch (name) {
    case 'Twitter':
      tagName = TwitterShareButton;
      break;
    case 'Facebook':
      tagName = FacebookShareButton;
      break;
    case 'Reddit':
      tagName = RedditShareButton;
      break;
    case 'WhatsApp':
      tagName = WhatsappShareButton;
      break;
    case 'Discord':
      break;
    case 'WeChat':
      break;
    case 'Telegram':
      tagName = TelegramShareButton;
      break;
    case 'Messenger':
      tagName = FacebookMessengerShareButton;
      break;
  }

  const element = React.createElement(
    tagName,
    {
      className: classes.bubble,
      style: { background: color },
      ...shareProps
    },
    React.createElement('img', { src: icon, alt: name })
  );

  return (
    <div className={classes.socialMedia} onClick={shareMedia}>
      {element}
      <p>{name}</p>
    </div>
  );
};

type ShareMediaToSocialModalProps = {
  shareLink: string;
  open: boolean;
  type: string;
  handleClose: () => void;
  shareMedia: () => void;
};
export const ShareMediaToSocialModal: React.FC<
  ShareMediaToSocialModalProps
> = ({ shareLink, open, type = 'Media', handleClose, shareMedia }) => {
  const classes = shareMediaToSocialModalStyles();
  const { showAlertMessage } = useAlertMessage();

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={handleClose}
      className={classes.root}
      showCloseIcon
    >
      <div className={classes.modalContent}>
        <img src={butterflyIcon} alt={'butterfly'} />
        <h3 className={classes.shareSocialMedia}>Share on social media</h3>
        <Grid container>
          <Grid item xs={4}>
            <SocialMediaButton
              color={'#EBF6FD'}
              name={'Twitter'}
              icon={twitterIcon}
              shareProps={{
                title:
                  type === 'Profile'
                    ? `Check out this profile on Myx, A Web3 music streaming platform for artists and fans!`
                    : type === 'Pod'
                    ? `Check out this pod on Myx, A Web3 music streaming platform for artists and fans!`
                    : type === 'Track'
                    ? `Check out this track on Myx, A Web3 music streaming platform for artists and fans!`
                    : `Check out this ${type} at`,
                url: shareLink
                //hashtags: ["Myx"],
              }}
              shareMedia={shareMedia}
            />
          </Grid>
          {/* <Grid item xs={4}>
            <SocialMediaButton
              color={"#EAF1FD"}
              name={"Facebook"}
              icon={facebookIcon}
              shareProps={{
                quote: `Check out this ${type} at`,
                url: shareLink,
                //hashTag: "Myx",
              }}
              shareMedia={shareMedia}
            />
          </Grid>
          <Grid item xs={4}>
            <SocialMediaButton
              color={"#EAF1FD"}
              name={"Messenger"}
              icon={messengerIcon}
              shareProps={{ redirectUri: shareLink, appId: "" }}
              shareMedia={shareMedia}
            />
          </Grid> */}
          <Grid item xs={4}>
            <SocialMediaButton
              color={'#ECFAF1'}
              name={'WhatsApp'}
              icon={whatsappIcon}
              shareProps={{
                title:
                  type === 'Profile'
                    ? `Check out this profile on Myx, A Web3 music streaming platform for artists and fans!`
                    : type === 'Collection'
                    ? `Check out this pod on Myx, A Web3 music streaming platform for artists and fans!`
                    : type === 'Track'
                    ? `Check out this track on Myx, A Web3 music streaming platform for artists and fans!`
                    : `Check out this ${type} at`,
                url: shareLink
              }}
              shareMedia={shareMedia}
            />
          </Grid>
          <Grid item xs={4}>
            <SocialMediaButton
              color={'#E8F3F9'}
              name={'Telegram'}
              icon={telegramIcon}
              shareProps={{
                title:
                  type === 'Profile'
                    ? `Check out this profile on Myx, A Web3 music streaming platform for artists and fans!`
                    : type === 'Collection'
                    ? `Check out this pod on Myx, A Web3 music streaming platform for artists and fans!`
                    : type === 'Track'
                    ? `Check out this track on Myx, A Web3 music streaming platform for artists and fans!`
                    : `Check out this ${type}`,
                url: shareLink
              }}
              shareMedia={shareMedia}
            />
          </Grid>
          {/* <Grid item xs={4}>
            <SocialMediaButton
              color={"#FCEDE7"}
              name={"Reddit"}
              icon={redditIcon}
              shareProps={{
                url: shareLink,
                title: `Check out this ${type} at`,
              }}
              shareMedia={shareMedia}
            />
          </Grid> */}
        </Grid>
        {/* <SocialMediaButton
            mediaId={mediaId}
            color={'#F1F3FA'}
            name={'Discord'}
            icon={discordIcon}
            shareProps={{
              url: shareLink,
            }}
            shareMedia={shareMedia}
          />
          <SocialMediaButton
            mediaId={mediaId}
            color={'#F3F7EB'}
            name={'WeChat'}
            icon={wechatIcon}
            shareProps={{ url: shareLink, }}
            shareMedia={shareMedia}
          /> */}
        <h5>Page Link</h5>
        <CopyToClipboard
          text={shareLink}
          onCopy={() => {
            showAlertMessage('Copied to clipboard', { variant: 'success' });
          }}
        >
          <div className={classes.link}>
            <InputWithLabelAndTooltip
              overriedClasses={classes.pageLink}
              inputValue={shareLink}
              type="text"
            />
            <img src={copyIcon} alt={'copy'} style={{ cursor: 'pointer' }} />
          </div>
        </CopyToClipboard>
      </div>
    </Modal>
  );
};
