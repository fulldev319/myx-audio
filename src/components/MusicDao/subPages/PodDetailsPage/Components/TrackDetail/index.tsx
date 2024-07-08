import React, { useEffect, useState } from 'react';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';

import Box from 'shared/ui-kit/Box';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';

import { useTrackDetailStyles } from './index.styles';

const PremiumType = ['Bronze', 'Silver', 'Gold', 'Platinum'];

export const TrackDetail = ({ pod, song, refreshPod }) => {
  const classes = useTrackDetailStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGotoScan = () => {
    const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(
      `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/token/${
        pod.collectionWithRoyalty
      }`,
      '_blank'
    );
  };

  return (
    <Box>
      <Box className={classes.sectionTitle}>Track Details</Box>
      <Box className={classes.mainCard}>
        <Box mb={2} className={classes.h1}>
          Song Name
        </Box>
        <Box className={classes.h4}>Artist Name</Box>
        <Box my={2} display="flex" alignItems="center">
          <Box display="flex" alignItems="center">
            <Box>Genre</Box>
            <Box className={classes.tag}>HIP HOP/RAP</Box>
          </Box>
          <Box ml={4} display="flex" alignItems="center">
            <Box>Mood</Box>
            <Box className={classes.tag}>UPBEAT 😎</Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <span className={classes.h3}>Artist Name</span>
          <Box
            mx={2}
            className={classes.h3}
            style={{ fontWeight: 800, color: '#65CB63' }}
          >
            FT
          </Box>
          <Box
            display="flex"
            alignItems="center"
            className={classes.h3}
            style={{ fontWeight: 'normal' }}
          >
            <span className={classes.artist}>Artist 1</span>
            <span className={classes.artist}>Artist 2</span>
            <span className={classes.artist}>Artist 3</span>
            <span className={classes.artist}>Artist 4</span>
          </Box>
        </Box>
        <Box className={classes.container} mb={2}>
          <Box display="flex" flexDirection={isTablet ? 'column' : 'row'}>
            <img className={classes.img} src={song.songImage} />
            <Box flex={1} ml={isTablet ? 0 : 5}>
              {song.type === 'BATCH_ERC721' ? (
                song.editionType === 'Premium' ? (
                  <>
                    <Box mt={4}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <Box
                          ml={1}
                          style={{ width: '25%' }}
                          className={classes.editionLabel}
                        >
                          Edition
                        </Box>
                        <Box
                          style={{ width: '10%' }}
                          className={classes.editionLabel}
                        >
                          Copies
                        </Box>
                        <Box
                          style={{ width: '25%' }}
                          className={classes.editionLabel}
                        >
                          Streaming Royalty
                        </Box>
                        <Box
                          style={{ width: '20%' }}
                          className={classes.editionLabel}
                        >
                          % per Copy
                        </Box>
                        <Box
                          style={{ width: '20%' }}
                          className={classes.editionLabel}
                        >
                          Price per copy
                        </Box>
                        <Box
                          style={{ width: '20%' }}
                          className={classes.editionLabel}
                        >
                          Sales Cap
                        </Box>
                      </Box>
                      {PremiumType.map((title, i) => (
                        <Box
                          className={classes.editionSection}
                          key={`premiumType_${i}`}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <Box ml={1} style={{ width: '10%' }}>
                              <img
                                src={require(`assets/icons/edition_${title.toLowerCase()}.webp`)}
                                alt="edition"
                                style={{
                                  width: 40,
                                  height: 40,
                                  marginRight: 16
                                }}
                              />
                            </Box>
                            <Box
                              ml={1}
                              style={{ width: '15%' }}
                              className={classes.genreLabel}
                            >
                              {title}
                            </Box>
                            <Box
                              ml={1}
                              style={{ width: '10%' }}
                              className={classes.genreLabel}
                            >
                              {song.editionAmounts[i]}
                            </Box>
                            <Box
                              ml={1}
                              style={{ width: '25%' }}
                              className={classes.genreLabel}
                            >
                              {song.streamingRevenueShares[i]}%
                            </Box>
                            <Box
                              ml={1}
                              style={{ width: '20%' }}
                              className={classes.genreLabel}
                            >
                              {(
                                song.streamingRevenueShares[i] /
                                song.editionAmounts[i]
                              ).toFixed(2)}
                              %
                            </Box>
                            <Box
                              ml={1}
                              style={{ width: '20%' }}
                              className={classes.genreLabel}
                            >
                              {song.editionAmounts[i] * song.editionPrices[i]}{' '}
                              USDT
                            </Box>
                            <Box
                              ml={1}
                              style={{ width: '20%' }}
                              className={classes.genreLabel}
                            >
                              {song.editionAmounts[i] * song.editionPrices[i]}{' '}
                              USDT
                            </Box>
                          </div>
                        </Box>
                      ))}
                    </Box>
                    <Box
                      mt={3}
                      style={{ borderTop: '2px solid #65CB63' }}
                      display="flex"
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      <Box>Maximum Revenue</Box>
                      <Box ml={2} className={classes.revenueValue}>
                        {song.editionAmounts.reduce(
                          (result, current, index) =>
                            result + current * song.editionPrices[index],
                          0
                        )}{' '}
                        USDT
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Box
                    py={4}
                    mt={2}
                    style={{
                      borderTop: '2px solid rgba(84, 101, 143, 0.3)',
                      borderBottom: '2px solid rgba(84, 101, 143, 0.3)'
                    }}
                    px={1}
                  >
                    <Box className={classes.genreLabel}>Amount of editions</Box>
                    <Box className={classes.regularAmount}>
                      {song.editionAmounts ? song.editionAmounts[0] : ''}{' '}
                      {song.editionAmounts && song.editionAmounts[0] > 1
                        ? 'COPIES'
                        : 'COPY'}
                    </Box>
                  </Box>
                )
              ) : (
                <>
                  <Box
                    mt={4}
                    style={{ borderTop: '1px solid rgba(84, 101, 143, 0.3)' }}
                  >
                    <Box className={classes.priceBox} mt={4}>
                      <Box className={classes.priceLabel}>Price</Box>
                      <Box className={classes.priceValue}>
                        {song.price || 0} USDT
                      </Box>
                    </Box>
                    <Box className={classes.priceBox} mt={2}>
                      <Box className={classes.priceLabel}>Royalty Share</Box>
                      <Box className={classes.priceValue}>
                        {song.royaltyShare || 0}%
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={1}>
            {song.isMakeStreaming && !isMobile ? (
              <Box width="30%" minWidth={isTablet ? 380 : 460}>
                <Box
                  style={{
                    borderRadius: 4,
                    position: 'relative',

                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 12,
                    lineHeight: '14px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    background: '#fff',
                    width: '100%',
                    padding: 10,
                    letterSpacing: '0.3em',
                    color: '#65CB63'
                  }}
                >
                  Streaming
                  <div style={{ position: 'absolute', top: 8, left: 20 }}>
                    <StreamingIcon />
                  </div>
                </Box>
              </Box>
            ) : (
              <div />
            )}
          </Box>
        </Box>
      </Box>
      <Box mt={2}>
        <Grid container spacing={isMobile ? 1 : 4}>
          <Grid item xs={12} sm={6}>
            <Box
              className={classes.subCard}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <StreamingIcon />
              <Box mt="4px" display="flex" alignItems="center">
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: 11,
                    letterSpacing: '0.33em',
                    textTransform: 'uppercase',
                    color: '#65CB63',
                    marginTop: 4
                  }}
                >
                  100%&nbsp;
                </span>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  title={
                    'This is the share of total streaming percentage that this NFT edition receives'
                  }
                  classes={{ popper: classes.myTooltip }}
                >
                  <div>
                    <InfoIcon />
                  </div>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className={classes.subCard}>
              <Box>
                <Box mb={0.5}>Preview on Polygoscan</Box>
                <Box color="#65CB63">
                  {pod.PodAddress
                    ? `${pod.PodAddress.slice(0, 10)}...${pod.PodAddress.slice(
                        pod.PodAddress.length - 7,
                        pod.PodAddress.length - 1
                      )}`
                    : ''}
                </Box>
              </Box>
              <Box
                onClick={() => handleGotoScan()}
                style={{ cursor: 'pointer' }}
              >
                <ShareIcon />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const StreamingIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.125 11.625C0.71025 11.625 0.375 11.289 0.375 10.875V7.125C0.375 6.711 0.71025 6.375 1.125 6.375C1.53975 6.375 1.875 6.711 1.875 7.125V10.875C1.875 11.289 1.53975 11.625 1.125 11.625Z"
      fill="#65CB63"
    />
    <path
      d="M3.375 14.625C2.96025 14.625 2.625 14.289 2.625 13.875V4.125C2.625 3.711 2.96025 3.375 3.375 3.375C3.78975 3.375 4.125 3.711 4.125 4.125V13.875C4.125 14.289 3.78975 14.625 3.375 14.625Z"
      fill="#65CB63"
    />
    <path
      d="M5.625 17.625C5.21025 17.625 4.875 17.289 4.875 16.875V1.125C4.875 0.711 5.21025 0.375 5.625 0.375C6.03975 0.375 6.375 0.711 6.375 1.125V16.875C6.375 17.289 6.03975 17.625 5.625 17.625Z"
      fill="#65CB63"
    />
    <path
      d="M7.875 16.875C7.46025 16.875 7.125 16.539 7.125 16.125V1.875C7.125 1.461 7.46025 1.125 7.875 1.125C8.28975 1.125 8.625 1.461 8.625 1.875V16.125C8.625 16.539 8.28975 16.875 7.875 16.875Z"
      fill="#65CB63"
    />
    <path
      d="M10.125 13.875C9.71025 13.875 9.375 13.539 9.375 13.125V4.875C9.375 4.461 9.71025 4.125 10.125 4.125C10.5397 4.125 10.875 4.461 10.875 4.875V13.125C10.875 13.539 10.5397 13.875 10.125 13.875Z"
      fill="#65CB63"
    />
    <path
      d="M12.375 16.875C11.9603 16.875 11.625 16.539 11.625 16.125V1.875C11.625 1.461 11.9603 1.125 12.375 1.125C12.7897 1.125 13.125 1.461 13.125 1.875V16.125C13.125 16.539 12.7897 16.875 12.375 16.875Z"
      fill="#65CB63"
    />
    <path
      d="M14.625 13.875C14.2103 13.875 13.875 13.539 13.875 13.125V4.875C13.875 4.461 14.2103 4.125 14.625 4.125C15.0397 4.125 15.375 4.461 15.375 4.875V13.125C15.375 13.539 15.0397 13.875 14.625 13.875Z"
      fill="#65CB63"
    />
    <path
      d="M16.875 11.625C16.4603 11.625 16.125 11.289 16.125 10.875V7.125C16.125 6.711 16.4603 6.375 16.875 6.375C17.2897 6.375 17.625 6.711 17.625 7.125V10.875C17.625 11.289 17.2897 11.625 16.875 11.625Z"
      fill="#65CB63"
    />
  </svg>
);
const InfoIcon = () => (
  <svg
    width="14"
    height="13"
    viewBox="0 0 14 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.648 4.772C7.04 4.772 7.304 4.516 7.304 4.132C7.304 3.756 7.04 3.5 6.648 3.5C6.264 3.5 6 3.756 6 4.132C6 4.516 6.264 4.772 6.648 4.772ZM6.12 9.484H7.168V5.404H6.12V9.484Z"
      fill="#65CB63"
    />
    <circle cx="7" cy="6.5" r="6" stroke="#65CB63" />
  </svg>
);

const ShareIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 16H2V2H9V0H2C0.89 0 0 0.9 0 2V16C0 17.1 0.89 18 2 18H16C17.1 18 18 17.1 18 16V9H16V16ZM11 0V2H14.59L4.76 11.83L6.17 13.24L16 3.41V7H18V0H11Z"
      fill="#707582"
    />
  </svg>
);
