import React from 'react';

import { processImage } from 'shared/helpers';
import { Modal, Paragraph } from 'shared/ui-kit';
import Avatar from 'shared/ui-kit/Avatar';
import Box from 'shared/ui-kit/Box';

import { collabModalStyles } from './index.styles';

const CollabModal = ({ open, collab, distribution, handleClose }) => {
  const classes = collabModalStyles();

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={handleClose}
      showCloseIcon
      className={classes.root}
    >
      <Box className={classes.contentBox}>
        <Avatar
          className={classes.avatar}
          image={processImage(collab.imageUrl)}
          size={120}
          rounded={true}
        />
        <Box mt={1}>
          {collab.verified && (
            <Box display="flex" alignItems="center">
              <VerifiedIcon />
              <Box ml={1} style={{ fontSize: 12, color: '#707582' }}>
                Verified
              </Box>
            </Box>
          )}
          <Box
            style={{ color: '#181818', overflowWrap: 'break-word' }}
            className={classes.header1}
          >
            {collab.name}
          </Box>
          <Box style={{ fontSize: 12, color: '#65CB63' }}>
            @{collab.urlSlug}
          </Box>
        </Box>
        <Paragraph
          className={classes.header2}
          style={{
            color: '#181818'
          }}
        >
          {collab.bio}
        </Paragraph>
        {distribution && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Box py={1} className={classes.moreBox}>
              <div style={{ color: '#181818', marginBottom: 8 }}>
                % ownership
              </div>
              <div className={classes.percent}>{distribution}%</div>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default CollabModal;

const VerifiedIcon = () => (
  <svg
    width="16"
    height="14"
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.5626 7.66895C14.9052 7.28855 14.9052 6.71084 14.5626 6.33044L13.8409 5.52918C13.6511 5.3185 13.5597 5.03716 13.5894 4.75518L13.7024 3.68282C13.7561 3.17342 13.4161 2.70584 12.915 2.59975L11.861 2.3766C11.583 2.31775 11.3432 2.14343 11.2014 1.89718L10.6643 0.964095C10.4084 0.519632 9.85782 0.340764 9.38961 0.550015L8.40673 0.989276C8.14709 1.10531 7.85033 1.10531 7.59069 0.989276L6.60782 0.550015C6.1396 0.340764 5.58899 0.519631 5.33313 0.964095L4.79601 1.89718C4.65425 2.14343 4.41444 2.31775 4.13646 2.3766L3.0824 2.59975C2.58129 2.70584 2.24136 3.17342 2.29502 3.68282L2.40797 4.75518C2.43767 5.03716 2.34627 5.3185 2.15651 5.52918L1.43481 6.33045C1.0922 6.71084 1.0922 7.28855 1.4348 7.66894L2.15649 8.47021C2.34624 8.6809 2.43764 8.96223 2.40794 9.24421L2.29499 10.3166C2.24134 10.826 2.58126 11.2936 3.08237 11.3996L4.13643 11.6228C4.41441 11.6816 4.65422 11.856 4.79598 12.1022L5.3331 13.0353C5.58896 13.4798 6.13958 13.6586 6.60779 13.4494L7.59065 13.0101C7.8503 12.8941 8.14707 12.8941 8.40671 13.0101L9.38958 13.4494C9.85779 13.6586 10.4084 13.4798 10.6643 13.0353L11.2014 12.1022C11.3431 11.856 11.583 11.6816 11.8609 11.6228L12.915 11.3996C13.4161 11.2936 13.756 10.826 13.7024 10.3166L13.5894 9.24422C13.5597 8.96223 13.6511 8.68089 13.8409 8.47021L14.5626 7.66895Z"
      fill="url(#paint0_linear_11674_281782)"
    />
    <path
      d="M5.5 7.58936L7 9.08936L10.5 5.58936"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_11674_281782"
        x1="1.91699"
        y1="6.43609"
        x2="14.6081"
        y2="8.22302"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.179206" stopColor="#A0D800" />
        <stop offset="0.852705" stopColor="#0DCC9E" />
      </linearGradient>
    </defs>
  </svg>
);
