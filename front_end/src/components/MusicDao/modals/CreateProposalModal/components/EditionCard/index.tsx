import React from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import editionCardStyles from './index.styles';

const PremiumType = ['Bronze', 'Silver', 'Gold', 'Platinum'];

const EditionCard = ({ song, onRemove, onEdit, index }) => {
  const classes = editionCardStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const creatorName = React.useMemo(() => {
    if (song?.artist) {
      let result = song?.artist.main[0] ? song?.artist.main[0].name : '';
      if (song?.artist.feature?.length) {
        result = result ? result + ' ft ' : '';
        song?.artist.feature.map((v, i) => {
          if (i < song?.artist.feature.length - 1) result += v.name + ', ';
          else {
            result += v.name;
          }
        });
      }

      if (result) return result;
    }
  }, []);

  return (
    <Box className={classes.container} mb={2}>
      <Box display="flex" flexDirection={isTablet ? 'column' : 'row'}>
        <img className={classes.img} src={song.songImage} />
        <Box flex={1} ml={isTablet ? 0 : 5}>
          <Box className={classes.title} mt={3}>
            {song.Title || 'Song Name'}
          </Box>
          <Box className={classes.artistName} mt={1.5}>
            {creatorName || ''}
          </Box>
          <Box display="flex" alignItems="center" mt={4}>
            <Box className={classes.genreLabel}>Genre</Box>
            <Box className={classes.genreValue} ml={2}>
              {song.Genre}
            </Box>
            <Box className={classes.genreLabel} ml={5}>
              Mood
            </Box>
            <Box className={classes.genreValue} ml={2}>
              {song.Mood}
            </Box>
          </Box>
          {song.type === 'BATCH_ERC721' ? (
            song.editionType === 'Premium' ? (
              <>
                <Box mt={4}>
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
                          style={{ width: '30%' }}
                          className={classes.genreLabel}
                        >
                          {title} Edition
                        </Box>
                        <Box
                          ml={1}
                          style={{ width: '20%' }}
                          className={classes.genreLabel}
                        >
                          {song.editionAmounts[i]}{' '}
                          {song.editionAmounts[i] > 1 ? 'Copies' : 'Copy'}
                        </Box>
                        <Box
                          ml={1}
                          style={{ width: '20%' }}
                          className={classes.genreLabel}
                        >
                          {song.streamingRevenueShares[i]}% Share
                        </Box>
                        <Box
                          ml={1}
                          style={{ width: '20%' }}
                          className={classes.genreLabel}
                        >
                          {song.editionAmounts[i] * song.editionPrices[i]} USDT
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
              <>
                <Box
                  py={5.5}
                  mt={3.5}
                  style={{
                    borderTop: '2px solid rgba(84, 101, 143, 0.3)',
                    borderBottom: '2px solid #65CB6340'
                  }}
                  px={1}
                >
                  <Box className={classes.genreLabel1}>Amount of editions</Box>
                  <Box className={classes.regularAmount}>
                    {song.editionAmounts ? song.editionAmounts[0] : ''}{' '}
                    {song.editionAmounts && song.editionAmounts[0] > 1
                      ? 'COPIES'
                      : 'COPY'}
                  </Box>
                </Box>
                <Box
                  mt={2}
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
      <Box display="flex" justifyContent="space-between" mt={2}>
        {song.isMakeStreaming && !isMobile ? (
          <Box width="30%" maxWidth={330}>
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
                background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
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
        <Box display="flex">
          <Box
            className={classes.editableButton}
            color="#F43E5F"
            style={{ background: '#EFDDDD' }}
            onClick={() => onRemove(index)}
          >
            <RemoveRedIcon />
            <Box ml={1}>REMOVE</Box>
          </Box>
          <Box
            className={classes.editableButton}
            color="#54658F"
            style={{ background: '#DDE6EF' }}
            ml={2}
            onClick={onEdit}
          >
            <EditIcon />
            <Box ml={1}>EDIT</Box>
          </Box>
        </Box>
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

const RemoveRedIcon = () => (
  <svg
    width="10"
    height="9"
    viewBox="0 0 10 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.632812 1.01819H1.66227L2.30568 8.22439C2.31925 8.42746 2.48815 8.5853 2.69173 8.5848H7.94157C8.14515 8.5853 8.31404 8.42746 8.32762 8.22439L8.97103 1.01819H10.0005V0.246094H0.632812V1.01819Z"
      fill="#F43E5F"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.12681 0C7.64712 0 7.16783 0.18281 6.80221 0.54805C4.70731 2.64295 2.61241 4.73785 0.517413 6.83285L3.16821 9.48365C5.26311 7.38875 7.35801 5.29385 9.45301 3.19885C10.1839 2.46799 10.1819 1.27855 9.45145 0.54805C9.08622 0.18282 8.60653 0 8.12685 0H8.12681ZM0.192413 7.3918L0.000612788 9.6629C-0.0154032 9.85587 0.145533 10.0168 0.338113 10.0004L2.60801 9.80782L0.192413 7.3918Z"
      fill="#54658F"
    />
  </svg>
);

export default EditionCard;
