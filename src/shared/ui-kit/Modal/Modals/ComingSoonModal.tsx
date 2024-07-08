import React from 'react';
import Modal from '@material-ui/core/Modal';
import './ComingSoonModal.css';

// const instagramHexagon = require('assets/snsIcons/instagram.webp');
// const twitterHexagon = require('assets/snsIcons/twitter.webp');
// const telegramIcon = require('assets/snsIcons/telegram.webp');
// const linkedinIcon = require('assets/snsIcons/linkedin.webp');
// const webpageIcon = require('assets/snsIcons/webpage.webp');
const musicLogo = require('assets/logos/MUSICLOGO.webp');

const ComingSoon = (props) => {
  return (
    <Modal
      className="modalCampaign coming-soon-modal"
      open={props.open}
      onClose={props.handleClose}
      style={{
        height: props.height ? props.height : '91%',
        marginLeft: props.marginLeft ? props.marginLeft : 80,
        marginTop: props.marginTop ? props.marginTop : 80,
        overflowY: 'hidden',
        maxHeight: props.maxHeight ? props.maxHeight : 'auto',
        width: props.width ? props.width : 'auto'
      }}
    >
      <div className="smokescreen-content">
        <img src={musicLogo} width={400} height={400} alt={'music'} />
        <p>COMING SOON</p>
        {/* <div style={{display: "inline-flex"}}>
            <a
              className="rrssProfileLink"
              href={'https://twitter.com/musicprotocol?lang=en'}
              target="_blank"
            >
              <img src={twitterHexagon} width={40} height={40} style={{margin: 15, cursor: "pointer"}} />
            </a>
            <a
              className="rrssProfileLink"
              href={'https://www.instagram.com/musicprotocol/'}
              target="_blank"
            >
             <img src={instagramHexagon} width={40} height={40} style={{margin: 15, cursor: "pointer"}} />
            </a>
            <a
              className="rrssProfileLink"
              href={'https://t.me/protocolmusic'}
              target="_blank"
            >
              <img src={telegramIcon} width={40} height={40} style={{margin: 15, cursor: "pointer"}} />
            </a>
            <a
              className="rrssProfileLink"
              href={'https://www.linkedin.com/company/music-protocol/'}
              target="_blank"
            >
              <img src={linkedinIcon} width={40} height={40} style={{margin: 15, cursor: "pointer"}} />
            </a>
            <a
              className="rrssProfileLink"
              href={'https://www.music.store/'}
              target="_blank"
            >
              <img src={webpageIcon} width={40} height={40} style={{margin: 15, cursor: "pointer"}} />
            </a>

            </div> */}
      </div>
    </Modal>
  );
};

export default ComingSoon;
