import React from 'react';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';

import { Avatar } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import addedSongStyles from './index.styles';

const Distribution = ({ pod }) => {
  const classes = addedSongStyles();

  return (
    <Box className={classes.container}>
      <Box display="flex" justifyContent="center" mb={2}>
        <Box className={classes.title}>Media Fractions Distribution</Box>
      </Box>
      <Box className={classes.borderBox}>
        <Box
          className={classes.investorBox}
          style={{
            background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D'
          }}
          mb={1}
        >
          <Box className={classes.title}>Investores</Box>
          <Box style={{ color: '#65CB63' }}>25%</Box>
        </Box>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <Box
            className={classes.investorBox}
            style={{
              background: index % 2 === 0 ? 'rgba(236, 240, 244, 0.4)' : 'none'
            }}
            key={`investor_${index}`}
          >
            <Box display="flex">
              <Avatar noBorder url={getDefaultAvatar()} size="medium" />
              <Box ml={1}>
                <Box display="flex" alignItems="center">
                  <Box className={classes.title}>Investores</Box>
                  {index === 0 && (
                    <Box ml={1} className={classes.proposerBox}>
                      Proposer
                    </Box>
                  )}
                </Box>
                <Box className={classes.urlLabel} mt={1}>
                  @piptycent
                </Box>
              </Box>
            </Box>
            <Box display="flex">
              <Box display="flex" alignItems="center">
                {index % 2 === 0 ? 'Accepted' : 'Declined'}
                <span style={{ marginLeft: 8 }}>
                  {index % 2 === 0 ? <AcceptedIcon /> : <DeclinedIcon />}
                </span>
              </Box>
              <Box ml={2}>25%</Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Distribution;

const AcceptedIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_14669_10021)">
      <g clip-path="url(#clip0_14669_10021)">
        <rect
          x="1.38464"
          y="1.3457"
          width="16.5242"
          height="16.3089"
          rx="8.15444"
          fill="url(#paint0_linear_14669_10021)"
        />
        <ellipse
          cx="9.63094"
          cy="9.45343"
          rx="4.96737"
          ry="4.90265"
          fill="white"
        />
        <path
          d="M7.7467 9.41734L9.02679 10.6817L11.5158 8.2251"
          stroke="#65CB63"
          stroke-width="0.978533"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_14669_10021"
        x="0.406111"
        y="0.693348"
        width="18.4812"
        height="18.2661"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="0.326178" />
        <feGaussianBlur stdDeviation="0.489266" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_14669_10021"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_14669_10021"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_14669_10021"
        x1="2.63543"
        y1="8.82607"
        x2="17.2865"
        y2="10.8145"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.179206" stop-color="#A0D800" />
        <stop offset="0.852705" stop-color="#0DCC9E" />
      </linearGradient>
      <clipPath id="clip0_14669_10021">
        <path
          d="M1.38464 9.50014C1.38464 4.99657 5.03551 1.3457 9.53909 1.3457H9.75437C14.2579 1.3457 17.9088 4.99657 17.9088 9.50014C17.9088 14.0037 14.2579 17.6546 9.75437 17.6546H9.53909C5.03551 17.6546 1.38464 14.0037 1.38464 9.50014Z"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
);

const DeclinedIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_14669_10043)">
      <g clip-path="url(#clip0_14669_10043)">
        <rect
          x="1.38464"
          y="1.3457"
          width="16.5242"
          height="16.3089"
          rx="8.15444"
          fill="#F43E5F"
        />
        <ellipse
          cx="9.63119"
          cy="9.45294"
          rx="4.96737"
          ry="4.90265"
          fill="white"
        />
        <path
          d="M7.75244 11.3556L11.5102 7.64697"
          stroke="#F43E5F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M7.75218 7.64697L11.5098 11.3557"
          stroke="#F43E5F"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_14669_10043"
        x="0.406111"
        y="0.693348"
        width="18.4812"
        height="18.2661"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="0.326178" />
        <feGaussianBlur stdDeviation="0.489266" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_14669_10043"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_14669_10043"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_14669_10043">
        <path
          d="M1.38464 9.50014C1.38464 4.99657 5.03551 1.3457 9.53909 1.3457H9.75437C14.2579 1.3457 17.9088 4.99657 17.9088 9.50014C17.9088 14.0037 14.2579 17.6546 9.75437 17.6546H9.53909C5.03551 17.6546 1.38464 14.0037 1.38464 9.50014Z"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
);
