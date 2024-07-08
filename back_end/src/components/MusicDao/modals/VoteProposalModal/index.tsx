import React from 'react';

import Grid from '@material-ui/core/Grid';

import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { useVoteProposalModalStyles } from './index.styles';

const VoteProposalModal = (props) => {
  const classes = useVoteProposalModalStyles();

  const { open, onClose } = props;

  return (
    <Modal
      size="daoMedium"
      isOpen={open}
      onClose={onClose}
      className={classes.root}
      showCloseIcon
    >
      <Box className={classes.title} textAlign="center" mb={7}>
        Proposal Details
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <img
            className={classes.image}
            src={getDefaultBGImage()}
            alt="bgimage"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className={classes.text1}>Track name here we go</Box>
          <Box className={classes.text2}>Collection Name</Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={1}
            py={2}
            borderBottom="1px solid #35385633"
          >
            <Box className={classes.text2}>Copyright tokens</Box>
            <Box className={classes.text3}>2235</Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={1}
            py={2}
            borderBottom="1px solid #35385633"
          >
            <Box className={classes.text2}>Share</Box>
            <Box className={classes.text3}>24%</Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={1}
          >
            <Box className={classes.text2}>NFT Address</Box>
            <Box display="flex" alignItems="center">
              <Box className={classes.text3} mr={2}>
                0xeec9...82f8
              </Box>
              <svg
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#vote_proposal_6752_144080)">
                  <path
                    d="M28.6999 14.325C28.6999 22.2199 22.299 28.6208 14.4041 28.6208C6.50925 28.6208 0.108398 22.2199 0.108398 14.325C0.108398 6.43015 6.50925 0.0292969 14.4041 0.0292969C22.3007 0.0292969 28.6999 6.43015 28.6999 14.325Z"
                    fill="#2081E2"
                  />
                  <path
                    d="M7.16178 14.8056L7.22346 14.7087L10.9423 8.89092C10.9967 8.80574 11.1245 8.81455 11.1656 8.90707C11.7869 10.2994 12.323 12.0311 12.0718 13.1092C11.9646 13.5528 11.6709 14.1535 11.3404 14.7087C11.2978 14.7895 11.2508 14.8688 11.2008 14.9451C11.1773 14.9804 11.1377 15.0009 11.0951 15.0009H7.27046C7.16765 15.0009 7.10743 14.8893 7.16178 14.8056Z"
                    fill="white"
                  />
                  <path
                    d="M23.7381 15.8864V16.8073C23.7381 16.8601 23.7058 16.9071 23.6588 16.9277C23.3709 17.0511 22.3854 17.5035 21.9756 18.0733C20.9298 19.5289 20.1308 21.6101 18.3448 21.6101H10.8938C8.25302 21.6101 6.11304 19.4628 6.11304 16.8131V16.728C6.11304 16.6575 6.17031 16.6002 6.24081 16.6002H10.3945C10.4767 16.6002 10.5369 16.6766 10.5296 16.7573C10.5002 17.0276 10.5501 17.3037 10.6779 17.5549C10.9247 18.0557 11.4358 18.3686 11.988 18.3686H14.0443V16.7632H12.0115C11.9073 16.7632 11.8456 16.6428 11.9058 16.5576C11.9278 16.5238 11.9528 16.4886 11.9792 16.4489C12.1717 16.1757 12.4463 15.7513 12.7195 15.268C12.906 14.942 13.0867 14.5939 13.2321 14.2443C13.2615 14.1812 13.2849 14.1165 13.3084 14.0533C13.3481 13.9417 13.3892 13.8375 13.4186 13.7332C13.448 13.645 13.4715 13.5525 13.495 13.4659C13.564 13.1692 13.5934 12.8549 13.5934 12.5288C13.5934 12.401 13.5875 12.2674 13.5758 12.1396C13.5699 12.0001 13.5523 11.8605 13.5346 11.721C13.5229 11.5976 13.5009 11.4757 13.4774 11.3479C13.448 11.1614 13.4069 10.9763 13.3599 10.7898L13.3437 10.7193C13.3084 10.5915 13.2791 10.4696 13.238 10.3418C13.1219 9.94084 12.9883 9.55016 12.8473 9.18445C12.7959 9.03904 12.7371 8.89951 12.6784 8.75998C12.5917 8.54995 12.5036 8.35902 12.4228 8.17835C12.3817 8.09609 12.3464 8.02118 12.3112 7.94481C12.2715 7.85815 12.2304 7.77149 12.1893 7.68926C12.1599 7.6261 12.1261 7.56735 12.1026 7.50859L11.8515 7.04447C11.8162 6.98131 11.875 6.9064 11.944 6.9255L13.5156 7.35142H13.52C13.5229 7.35142 13.5244 7.35291 13.5258 7.35291L13.7329 7.41018L13.9606 7.47483L14.0443 7.4983V6.56419C14.0443 6.11327 14.4056 5.74756 14.8521 5.74756C15.0754 5.74756 15.2781 5.83862 15.4235 5.98695C15.5689 6.13532 15.6599 6.338 15.6599 6.56419V7.9507L15.8274 7.99768C15.8406 8.00211 15.8538 8.00797 15.8656 8.01678C15.9067 8.04763 15.9654 8.09314 16.0403 8.14898C16.0991 8.19596 16.1622 8.25326 16.2386 8.31201C16.3899 8.4339 16.5706 8.59106 16.7688 8.77173C16.8217 8.81725 16.8731 8.86426 16.9201 8.91126C17.1757 9.1492 17.4621 9.42825 17.7353 9.7367C17.8117 9.82336 17.8866 9.91148 17.9629 10.004C18.0393 10.098 18.1201 10.1905 18.1906 10.2831C18.2831 10.4065 18.383 10.5342 18.4697 10.6679C18.5108 10.731 18.5578 10.7957 18.5974 10.8588C18.7091 11.0277 18.8075 11.2025 18.9015 11.3773C18.9411 11.4581 18.9823 11.5462 19.0175 11.6329C19.1218 11.8664 19.204 12.1043 19.2569 12.3423C19.2731 12.3937 19.2848 12.4495 19.2907 12.4994V12.5112C19.3083 12.5817 19.3142 12.6566 19.3201 12.7329C19.3436 12.9768 19.3318 13.2206 19.2789 13.4659C19.2569 13.5702 19.2275 13.6685 19.1923 13.7728C19.157 13.8727 19.1218 13.977 19.0763 14.0754C18.9881 14.2795 18.8838 14.4837 18.7605 14.6746C18.7208 14.7451 18.6738 14.8201 18.6268 14.8906C18.5754 14.9654 18.5225 15.036 18.4755 15.105C18.4109 15.1931 18.3419 15.2856 18.2714 15.3679C18.2082 15.4546 18.1436 15.5412 18.0731 15.6176C17.9747 15.7336 17.8807 15.8438 17.7823 15.9495C17.7235 16.0186 17.6604 16.0891 17.5957 16.1522C17.5326 16.2227 17.468 16.2859 17.4092 16.3446C17.3108 16.443 17.2286 16.5194 17.1595 16.5825L16.998 16.7309C16.9745 16.7515 16.9436 16.7632 16.9113 16.7632H15.6599V18.3686H17.2344C17.5869 18.3686 17.9218 18.2437 18.1921 18.0146C18.2846 17.9338 18.6885 17.5842 19.1658 17.057C19.182 17.0393 19.2026 17.0261 19.2261 17.0203L23.575 15.763C23.6558 15.7395 23.7381 15.8012 23.7381 15.8864Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="vote_proposal_6752_144080">
                    <rect
                      width="28.5915"
                      height="28.5915"
                      fill="white"
                      transform="translate(0.108398 0.0292969)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        my={7}
        pt={3}
        borderTop="1px solid #35385633"
      >
        <Box className={classes.text4}>Selling price proposed</Box>
        <Box className={classes.text4} style={{ color: '#65CB63' }}>
          24555 USDT
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <PrimaryButton
          className={classes.button}
          size="medium"
          style={{ backgroundColor: '#2D3047' }}
        >
          Place counter Proposal
        </PrimaryButton>
        <PrimaryButton
          className={classes.button}
          size="medium"
          style={{ backgroundColor: '#65CB63' }}
        >
          Vote{' '}
        </PrimaryButton>
      </Box>
    </Modal>
  );
};

export default VoteProposalModal;
