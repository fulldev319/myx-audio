import React from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import { processImage } from 'shared/helpers';

import editionCardStyles from './index.styles';

const PremiumType = ['Bronze', 'Silver', 'Gold', 'Platinum'];

const EditionCard = ({ song }) => {
  const classes = editionCardStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box className={classes.container} mb={2}>
      <Box display="flex" flexDirection={isTablet ? 'column' : 'row'}>
        <img
          className={classes.img}
          src={processImage(
            song.songImage ??
              (song.imageUrlPerEdition?.length > 0
                ? song.imageUrlPerEdition[0]
                : getDefaultBGImage())
          )}
        />
        <Box flex={1} ml={isTablet ? 0 : 5}>
          <Box className={classes.title} mt={3}>
            {song.title || 'Song Name'}
          </Box>
          <Box className={classes.artistName} mt={1.5}>
            {song.artist || ''}
          </Box>
          <Box display="flex" alignItems="center" mt={4}>
            <Box className={classes.genreLabel}>Genre</Box>
            <Box className={classes.genreValue} ml={2}>
              {song.genre}
            </Box>
            <Box className={classes.genreLabel} ml={5}>
              Mood
            </Box>
            <Box className={classes.genreValue} ml={2}>
              {song.mood}
            </Box>
          </Box>
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
                      Per Copy
                    </Box>
                    <Box
                      style={{ width: '20%' }}
                      className={classes.editionLabel}
                    >
                      USDT
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
                            style={{ width: 40, height: 40, marginRight: 16 }}
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
                          {Number(song.editionAmounts[i]) > 0
                            ? (
                                song.streamingRevenueShares[i] /
                                Number(song.editionAmounts[i])
                              ).toFixed(2)
                            : 0}
                          %
                        </Box>
                        <Box
                          ml={1}
                          style={{ width: '20%' }}
                          className={classes.genreLabel}
                        >
                          {song.editionAmounts[i] * song.editionPrices[i]}
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

export default EditionCard;
