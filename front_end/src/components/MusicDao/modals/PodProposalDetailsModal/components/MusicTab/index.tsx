import React from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import StreamingIcon from 'components/MusicDao/components/Icons/StreamingIcon';

import Box from 'shared/ui-kit/Box';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import { processImage } from 'shared/helpers';

import { musicTabStyles } from './index.styles';

const MusicTab = ({ proposal }) => {
  const classes = musicTabStyles();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const getTotalRevenue = (media) => {
    if (!media) return 0;
    let sum = 0;
    for (let i = 0; i < media?.quantityPerEdition?.length; i++) {
      sum +=
        (Number(media?.quantityPerEdition[i]) *
          Number(media?.pricePerEdition[i])) /
        10 ** 6;
    }
    return sum;
  };

  return (
    <Box className={classes.musicTabMain}>
      <Box className={classes.typo2} mb={4}>
        Review Songs
      </Box>
      {proposal?.medias?.map((song: any, index) => (
        <Box className={classes.nftItemSection} mb={1.5}>
          <Box display={'flex'} flexDirection={'column'} mr={5}>
            <img
              src={processImage(song?.imageUrl) ?? getDefaultBGImage()}
              width={isTablet ? '100%' : 460}
              height={490}
            />
            {song.isStreaming && (
              <Box className={classes.streamingMark}>
                <StreamingIcon />
                <Box mt={0.5} ml={1}>
                  Streaming
                </Box>
              </Box>
            )}
          </Box>
          <Box display={'flex'} flexDirection={'column'} width={1}>
            <Box className={classes.typo3} mt={3}>
              {song?.name}
            </Box>
            <Box display={'flex'} alignItems={'center'} mt={1.5}>
              <Box className={classes.typo4} mr={1}>
                {song.artists?.main[0].name}
              </Box>
              {song.artists?.feature?.length > 0 && (
                <Box className={classes.typo5} mr={1}>
                  FT
                </Box>
              )}
              {`${
                song.artists?.feature?.length
                  ? `${song.artists.feature
                      .map((item) => item.name)
                      .join(', ')}`
                  : ''
              }`}
            </Box>
            <Box display={'flex'} alignItems={'center'} mt={1.5} mb={4}>
              <Box display={'flex'} alignItems={'center'}>
                <Box className={classes.typo7}>Genre</Box>
                <Box className={classes.tag} ml={2}>
                  {song.genre || 'No Genre'}
                </Box>
              </Box>
              <Box display={'flex'} alignItems={'center'} ml={7}>
                <Box className={classes.typo7}>Mood</Box>
                <Box className={classes.tag} ml={2}>
                  {song.mood || 'No Mood'}
                </Box>
              </Box>
            </Box>
            {song?.quantityPerEdition?.length === 1 && (
              <Box
                py={4}
                mt={2}
                style={{
                  borderTop: '2px solid rgba(84, 101, 143, 0.3)',
                  borderBottom: '2px solid rgba(84, 101, 143, 0.3)'
                }}
                px={1}
              >
                <Box className={classes.regularLabel}>Amount of editions</Box>
                <Box className={classes.regularAmount}>
                  {song.quantityPerEdition ? song.quantityPerEdition[0] : ''}{' '}
                  {song.quantityPerEdition &&
                  Number(song.quantityPerEdition[0]) > 1
                    ? 'COPIES'
                    : 'COPY'}
                </Box>
              </Box>
            )}
            {song?.quantityPerEdition?.length === 4 &&
              song?.quantityPerEdition.map((item, index) => (
                <>
                  <Box
                    width={1}
                    height={'1px'}
                    bgcolor={'rgba(84, 101, 143, 0.3)'}
                  />
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    my={3}
                    className={classes.editionRow}
                  >
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                      className={classes.typo1}
                      color="#454C53"
                    >
                      {index === 0 ? (
                        <BronzeMusicIcon />
                      ) : index === 1 ? (
                        <GrayMusicIcon />
                      ) : index === 2 ? (
                        <GoldMusicIcon />
                      ) : index === 3 ? (
                        <PlatinumMusicIcon />
                      ) : null}
                      <Box ml={1}>
                        {index === 0
                          ? 'Bronze Edition'
                          : index === 1
                          ? 'Silver Edition'
                          : index === 2
                          ? 'Golden Edition'
                          : index === 3
                          ? 'Platinum Edition'
                          : null}
                      </Box>
                    </Box>
                    <Box className={classes.typo1} color="#7E7D95">
                      {`${song?.quantityPerEdition[index]} Copies`}
                    </Box>
                    <Box className={classes.typo1} color="#7E7D95">
                      {`${song?.percentagePerEdition[index] / 100} Share`}
                    </Box>
                    <Box className={classes.typo1} color="#2D3047">
                      {`${
                        (Number(song?.quantityPerEdition[index]) *
                          Number(song?.pricePerEdition[index])) /
                        10 ** 6
                      } USDT`}
                    </Box>
                  </Box>
                </>
              ))}
            <Box width={1} height={'2px'} bgcolor={'#65CB6320'} />
            <Box display={'flex'} justifyContent={'end'} mt={2}>
              <Box display={'flex'} alignItems={'center'}>
                <Box className={classes.typo1} color="#2D3047">
                  Maximum Revenue
                </Box>
                <Box className={classes.typo8} ml={2}>
                  {`${getTotalRevenue(song)} USDT`}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default MusicTab;

const PlatinumMusicIcon = () => (
  <svg
    width="33"
    height="33"
    viewBox="0 0 33 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="16.084"
      cy="16.0842"
      r="15.3977"
      stroke="url(#paint0_linear_12487_7777)"
      strokeWidth="1.17818"
    />
    <circle
      cx="16.0837"
      cy="16.0844"
      r="14.2558"
      stroke="url(#paint1_linear_12487_7777)"
      strokeWidth="1.17818"
    />
    <path
      d="M29.1978 16.0843C29.1978 23.327 23.3265 29.1983 16.0839 29.1983C8.84124 29.1983 2.96995 23.327 2.96995 16.0843C2.96995 8.84173 8.84124 2.97044 16.0839 2.97044C23.3265 2.97044 29.1978 8.84173 29.1978 16.0843Z"
      stroke="url(#paint2_linear_12487_7777)"
      strokeWidth="1.17818"
    />
    <circle
      cx="16.084"
      cy="16.084"
      r="11.972"
      stroke="url(#paint3_linear_12487_7777)"
      strokeWidth="1.17818"
    />
    <circle
      cx="16.0842"
      cy="16.0844"
      r="10.8301"
      stroke="url(#paint4_linear_12487_7777)"
      strokeWidth="1.17818"
    />
    <circle
      cx="16.0839"
      cy="16.0841"
      r="9.68816"
      stroke="url(#paint5_linear_12487_7777)"
      strokeWidth="1.17818"
    />
    <circle
      cx="16.0841"
      cy="16.0846"
      r="8.54624"
      stroke="url(#paint6_linear_12487_7777)"
      strokeWidth="1.17818"
    />
    <circle
      cx="16.0837"
      cy="16.0842"
      r="7.40433"
      stroke="url(#paint7_linear_12487_7777)"
      strokeWidth="1.17818"
    />
    <circle
      cx="16.0839"
      cy="16.0847"
      r="6.26241"
      stroke="url(#paint8_linear_12487_7777)"
      strokeWidth="1.17818"
    />
    <circle cx="16.0837" cy="16.0842" r="7.99341" fill="#454C53" />
    <path
      d="M18.0029 12.0976L14.3317 13.0745C14.2028 13.1084 14.1132 13.228 14.1132 13.364V17.7042C13.8469 17.5079 13.5044 17.4109 13.1387 17.4764C12.5937 17.5733 12.1629 18.0403 12.0966 18.6043C11.9996 19.4262 12.6452 20.1211 13.4357 20.0795C14.123 20.0418 14.6459 19.4275 14.6459 18.7226V14.6001L17.8102 13.792V16.5927C17.5684 16.4228 17.2665 16.3359 16.9449 16.3712C16.3263 16.4404 15.8365 16.9792 15.8095 17.6161C15.7764 18.3915 16.3987 19.0259 17.156 18.9857C17.8433 18.9492 18.3674 18.3336 18.3674 17.6287V12.3872C18.3687 12.1908 18.1882 12.0486 18.0029 12.0976Z"
      fill="url(#paint9_linear_12487_7777)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_12487_7777"
        x1="33.2127"
        y1="16.37"
        x2="13.5147"
        y2="37.21"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8F95A6" />
        <stop offset="0.101161" stopColor="#CAD5EF" />
        <stop offset="0.532941" stopColor="#06080B" />
        <stop offset="1" stopColor="#D3DCEA" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_12487_7777"
        x1="31.9889"
        y1="16.3498"
        x2="13.6979"
        y2="35.7012"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8F95A6" />
        <stop offset="0.101161" stopColor="#CAD5EF" />
        <stop offset="0.532941" stopColor="#06080B" />
        <stop offset="1" stopColor="#D3DCEA" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_12487_7777"
        x1="30.7656"
        y1="16.3293"
        x2="13.8816"
        y2="34.1921"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8F95A6" />
        <stop offset="0.101161" stopColor="#CAD5EF" />
        <stop offset="0.532941" stopColor="#06080B" />
        <stop offset="1" stopColor="#D3DCEA" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_12487_7777"
        x1="29.5423"
        y1="16.3086"
        x2="14.0653"
        y2="32.6828"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8F95A6" />
        <stop offset="0.101161" stopColor="#CAD5EF" />
        <stop offset="0.532941" stopColor="#06080B" />
        <stop offset="1" stopColor="#D3DCEA" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_12487_7777"
        x1="28.319"
        y1="16.2886"
        x2="14.249"
        y2="31.1743"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8F95A6" />
        <stop offset="0.101161" stopColor="#CAD5EF" />
        <stop offset="0.532941" stopColor="#06080B" />
        <stop offset="1" stopColor="#D3DCEA" />
      </linearGradient>
      <linearGradient
        id="paint5_linear_12487_7777"
        x1="27.0952"
        y1="16.2678"
        x2="14.4322"
        y2="29.665"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8F95A6" />
        <stop offset="0.101161" stopColor="#CAD5EF" />
        <stop offset="0.532941" stopColor="#06080B" />
        <stop offset="1" stopColor="#D3DCEA" />
      </linearGradient>
      <linearGradient
        id="paint6_linear_12487_7777"
        x1="25.8719"
        y1="16.2478"
        x2="14.6159"
        y2="28.1564"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8F95A6" />
        <stop offset="0.101161" stopColor="#CAD5EF" />
        <stop offset="0.532941" stopColor="#06080B" />
        <stop offset="1" stopColor="#D3DCEA" />
      </linearGradient>
      <linearGradient
        id="paint7_linear_12487_7777"
        x1="24.6481"
        y1="16.2271"
        x2="14.7991"
        y2="26.6471"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8F95A6" />
        <stop offset="0.101161" stopColor="#CAD5EF" />
        <stop offset="0.532941" stopColor="#06080B" />
        <stop offset="1" stopColor="#D3DCEA" />
      </linearGradient>
      <linearGradient
        id="paint8_linear_12487_7777"
        x1="23.4248"
        y1="16.2071"
        x2="14.9828"
        y2="25.1385"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8F95A6" />
        <stop offset="0.101161" stopColor="#CAD5EF" />
        <stop offset="0.532941" stopColor="#06080B" />
        <stop offset="1" stopColor="#D3DCEA" />
      </linearGradient>
      <linearGradient
        id="paint9_linear_12487_7777"
        x1="23.7916"
        y1="11.2315"
        x2="12.1367"
        y2="19.2461"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#C7D2DC" />
        <stop offset="0.0745486" stopColor="#4B4F58" />
        <stop offset="0.532941" stopColor="#C9CDDA" />
        <stop offset="1" stopColor="white" />
      </linearGradient>
    </defs>
  </svg>
);

const GoldMusicIcon = () => (
  <svg
    width="33"
    height="33"
    viewBox="0 0 33 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="16.084"
      cy="16.4175"
      r="15.7014"
      stroke="url(#paint0_linear_12487_7795)"
      strokeWidth="0.570958"
    />
    <circle
      cx="16.0837"
      cy="16.4177"
      r="14.5594"
      stroke="url(#paint1_linear_12487_7795)"
      strokeWidth="0.570958"
    />
    <circle
      cx="16.0839"
      cy="16.4176"
      r="13.4175"
      stroke="url(#paint2_linear_12487_7795)"
      strokeWidth="0.570958"
    />
    <circle
      cx="16.084"
      cy="16.4173"
      r="12.2756"
      stroke="url(#paint3_linear_12487_7795)"
      strokeWidth="0.570958"
    />
    <circle
      cx="16.0842"
      cy="16.4177"
      r="11.1337"
      stroke="url(#paint4_linear_12487_7795)"
      strokeWidth="0.570958"
    />
    <circle
      cx="16.0839"
      cy="16.4174"
      r="9.99177"
      stroke="url(#paint5_linear_12487_7795)"
      strokeWidth="0.570958"
    />
    <circle
      cx="16.0841"
      cy="16.4178"
      r="8.84985"
      stroke="url(#paint6_linear_12487_7795)"
      strokeWidth="0.570958"
    />
    <circle
      cx="16.0837"
      cy="16.4175"
      r="7.70794"
      stroke="url(#paint7_linear_12487_7795)"
      strokeWidth="0.570958"
    />
    <circle
      cx="16.0839"
      cy="16.4179"
      r="6.56602"
      stroke="url(#paint8_linear_12487_7795)"
      strokeWidth="0.570958"
    />
    <circle cx="16.0837" cy="16.4175" r="7.99342" fill="#E1B661" />
    <path
      d="M18.0029 12.4309L14.3317 13.4077C14.2028 13.4417 14.1132 13.5613 14.1132 13.6972V18.0375C13.8469 17.8411 13.5044 17.7442 13.1387 17.8096C12.5937 17.9066 12.1629 18.3736 12.0966 18.9375C11.9996 19.7595 12.6452 20.4543 13.4357 20.4128C14.123 20.375 14.6459 19.7607 14.6459 19.0558V14.9333L17.8102 14.1252V16.926C17.5684 16.756 17.2665 16.6692 16.9449 16.7044C16.3263 16.7737 15.8365 17.3124 15.8095 17.9494C15.7764 18.7248 16.3987 19.3592 17.156 19.3189C17.8433 19.2824 18.3674 18.6669 18.3674 17.962V12.7204C18.3687 12.5241 18.1882 12.3818 18.0029 12.4309Z"
      fill="url(#paint9_linear_12487_7795)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_12487_7795"
        x1="33.2127"
        y1="16.7033"
        x2="13.5147"
        y2="37.5432"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F2CF9A" />
        <stop offset="0.101161" stopColor="#FFF3C7" />
        <stop offset="0.532941" stopColor="#A66300" />
        <stop offset="1" stopColor="#FFDFAF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_12487_7795"
        x1="31.9889"
        y1="16.683"
        x2="13.6979"
        y2="36.0344"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F2CF9A" />
        <stop offset="0.101161" stopColor="#FFF3C7" />
        <stop offset="0.532941" stopColor="#A66300" />
        <stop offset="1" stopColor="#FFDFAF" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_12487_7795"
        x1="30.7656"
        y1="16.6625"
        x2="13.8816"
        y2="34.5254"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F2CF9A" />
        <stop offset="0.101161" stopColor="#FFF3C7" />
        <stop offset="0.532941" stopColor="#A66300" />
        <stop offset="1" stopColor="#FFDFAF" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_12487_7795"
        x1="29.5423"
        y1="16.6418"
        x2="14.0653"
        y2="33.0161"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F2CF9A" />
        <stop offset="0.101161" stopColor="#FFF3C7" />
        <stop offset="0.532941" stopColor="#A66300" />
        <stop offset="1" stopColor="#FFDFAF" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_12487_7795"
        x1="28.319"
        y1="16.6218"
        x2="14.249"
        y2="31.5075"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F2CF9A" />
        <stop offset="0.101161" stopColor="#FFF3C7" />
        <stop offset="0.532941" stopColor="#A66300" />
        <stop offset="1" stopColor="#FFDFAF" />
      </linearGradient>
      <linearGradient
        id="paint5_linear_12487_7795"
        x1="27.0952"
        y1="16.6011"
        x2="14.4322"
        y2="29.9982"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F2CF9A" />
        <stop offset="0.101161" stopColor="#FFF3C7" />
        <stop offset="0.532941" stopColor="#A66300" />
        <stop offset="1" stopColor="#FFDFAF" />
      </linearGradient>
      <linearGradient
        id="paint6_linear_12487_7795"
        x1="25.8719"
        y1="16.5811"
        x2="14.6159"
        y2="28.4897"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F2CF9A" />
        <stop offset="0.101161" stopColor="#FFF3C7" />
        <stop offset="0.532941" stopColor="#A66300" />
        <stop offset="1" stopColor="#FFDFAF" />
      </linearGradient>
      <linearGradient
        id="paint7_linear_12487_7795"
        x1="24.6481"
        y1="16.5604"
        x2="14.7991"
        y2="26.9804"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F2CF9A" />
        <stop offset="0.101161" stopColor="#FFF3C7" />
        <stop offset="0.532941" stopColor="#A66300" />
        <stop offset="1" stopColor="#FFDFAF" />
      </linearGradient>
      <linearGradient
        id="paint8_linear_12487_7795"
        x1="23.4248"
        y1="16.5404"
        x2="14.9828"
        y2="25.4718"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F2CF9A" />
        <stop offset="0.101161" stopColor="#FFF3C7" />
        <stop offset="0.532941" stopColor="#A66300" />
        <stop offset="1" stopColor="#FFDFAF" />
      </linearGradient>
      <linearGradient
        id="paint9_linear_12487_7795"
        x1="23.7916"
        y1="11.5647"
        x2="12.1367"
        y2="19.5794"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFE2C0" />
        <stop offset="0.0745486" stopColor="#FFE8CC" />
        <stop offset="0.532941" stopColor="#FFF6A8" />
        <stop offset="1" stopColor="white" />
      </linearGradient>
    </defs>
  </svg>
);

const GrayMusicIcon = () => (
  <svg
    width="33"
    height="33"
    viewBox="0 0 33 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M31.4817 16.1774C31.4817 24.5413 24.5963 31.3366 16.084 31.3366C7.57168 31.3366 0.686256 24.5413 0.686256 16.1774C0.686256 7.81358 7.57168 1.01829 16.084 1.01829C24.5963 1.01829 31.4817 7.81358 31.4817 16.1774Z"
      stroke="url(#paint0_linear_12487_3373)"
      strokeWidth="1.17818"
    />
    <path
      d="M30.3395 16.1775C30.3395 23.9201 23.9653 30.2118 16.0837 30.2118C8.20203 30.2118 1.82786 23.9201 1.82786 16.1775C1.82786 8.43496 8.20203 2.14329 16.0837 2.14329C23.9653 2.14329 30.3395 8.43496 30.3395 16.1775Z"
      stroke="url(#paint1_linear_12487_3373)"
      strokeWidth="1.17818"
    />
    <path
      d="M29.1978 16.1777C29.1978 23.299 23.3349 29.0871 16.0839 29.0871C8.83286 29.0871 2.96995 23.299 2.96995 16.1777C2.96995 9.05634 8.83286 3.26829 16.0839 3.26829C23.3349 3.26829 29.1978 9.05634 29.1978 16.1777Z"
      stroke="url(#paint2_linear_12487_3373)"
      strokeWidth="1.17818"
    />
    <path
      d="M28.056 16.1771C28.056 22.6772 22.7044 27.9616 16.084 27.9616C9.4637 27.9616 4.11204 22.6772 4.11204 16.1771C4.11204 9.67698 9.4637 4.39256 16.084 4.39256C22.7044 4.39256 28.056 9.67698 28.056 16.1771Z"
      stroke="url(#paint3_linear_12487_3373)"
      strokeWidth="1.17818"
    />
    <path
      d="M26.9143 16.1777C26.9143 22.0565 22.0739 26.8373 16.0842 26.8373C10.0945 26.8373 5.25413 22.0565 5.25413 16.1777C5.25413 10.2988 10.0945 5.51804 16.0842 5.51804C22.0739 5.51804 26.9143 10.2988 26.9143 16.1777Z"
      stroke="url(#paint4_linear_12487_3373)"
      strokeWidth="1.17818"
    />
    <path
      d="M25.772 16.1773C25.772 21.4349 21.4429 25.7121 16.0839 25.7121C10.7249 25.7121 6.39573 21.4349 6.39573 16.1773C6.39573 10.9197 10.7249 6.64256 16.0839 6.64256C21.4429 6.64256 25.772 10.9197 25.772 16.1773Z"
      stroke="url(#paint5_linear_12487_3373)"
      strokeWidth="1.17818"
    />
    <path
      d="M24.6303 16.1777C24.6303 20.814 20.8124 24.5876 16.0841 24.5876C11.3557 24.5876 7.53782 20.814 7.53782 16.1777C7.53782 11.5414 11.3557 7.7678 16.0841 7.7678C20.8124 7.7678 24.6303 11.5414 24.6303 16.1777Z"
      stroke="url(#paint6_linear_12487_3373)"
      strokeWidth="1.17818"
    />
    <path
      d="M23.4881 16.1773C23.4881 20.1924 20.1814 23.4624 16.0837 23.4624C11.9861 23.4624 8.67942 20.1924 8.67942 16.1773C8.67942 12.1622 11.9861 8.89231 16.0837 8.89231C20.1814 8.89231 23.4881 12.1622 23.4881 16.1773Z"
      stroke="url(#paint7_linear_12487_3373)"
      strokeWidth="1.17818"
    />
    <path
      d="M22.3463 16.1779C22.3463 19.5718 19.5509 22.3381 16.0839 22.3381C12.6169 22.3381 9.82151 19.5718 9.82151 16.1779C9.82151 12.7841 12.6169 10.0178 16.0839 10.0178C19.5509 10.0178 22.3463 12.7841 22.3463 16.1779Z"
      stroke="url(#paint8_linear_12487_3373)"
      strokeWidth="1.17818"
    />
    <ellipse
      cx="16.0837"
      cy="16.1773"
      rx="7.99341"
      ry="7.87411"
      fill="#858585"
    />
    <path
      d="M18.0029 12.2503L14.3317 13.2126C14.2028 13.246 14.1132 13.3638 14.1132 13.4978V17.7732C13.8469 17.5798 13.5044 17.4843 13.1387 17.5488C12.5937 17.6443 12.1629 18.1043 12.0966 18.6598C11.9996 19.4695 12.6452 20.154 13.4357 20.1131C14.123 20.0759 14.6459 19.4708 14.6459 18.7764V14.7154L17.8102 13.9194V16.6783C17.5684 16.5109 17.2665 16.4254 16.9449 16.4601C16.3263 16.5283 15.8365 17.059 15.8095 17.6864C15.7764 18.4503 16.3987 19.0752 17.156 19.0355C17.8433 18.9996 18.3674 18.3932 18.3674 17.6988V12.5355C18.3687 12.3421 18.1882 12.202 18.0029 12.2503Z"
      fill="url(#paint9_linear_12487_3373)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_12487_3373"
        x1="33.2127"
        y1="16.4589"
        x2="13.8273"
        y2="37.2789"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#BEBEBE" />
        <stop offset="0.101161" stopColor="#555555" />
        <stop offset="0.532941" stopColor="#E4E4E4" />
        <stop offset="1" stopColor="#626262" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_12487_3373"
        x1="31.9889"
        y1="16.4389"
        x2="13.9882"
        y2="35.7718"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#BEBEBE" />
        <stop offset="0.101161" stopColor="#555555" />
        <stop offset="0.532941" stopColor="#E4E4E4" />
        <stop offset="1" stopColor="#626262" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_12487_3373"
        x1="30.7656"
        y1="16.419"
        x2="14.1495"
        y2="34.2647"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#BEBEBE" />
        <stop offset="0.101161" stopColor="#555555" />
        <stop offset="0.532941" stopColor="#E4E4E4" />
        <stop offset="1" stopColor="#626262" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_12487_3373"
        x1="29.5423"
        y1="16.3982"
        x2="14.3109"
        y2="32.7568"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#BEBEBE" />
        <stop offset="0.101161" stopColor="#555555" />
        <stop offset="0.532941" stopColor="#E4E4E4" />
        <stop offset="1" stopColor="#626262" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_12487_3373"
        x1="28.319"
        y1="16.3788"
        x2="14.4723"
        y2="31.2502"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#BEBEBE" />
        <stop offset="0.101161" stopColor="#555555" />
        <stop offset="0.532941" stopColor="#E4E4E4" />
        <stop offset="1" stopColor="#626262" />
      </linearGradient>
      <linearGradient
        id="paint5_linear_12487_3373"
        x1="27.0952"
        y1="16.3583"
        x2="14.6331"
        y2="29.7426"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#BEBEBE" />
        <stop offset="0.101161" stopColor="#555555" />
        <stop offset="0.532941" stopColor="#E4E4E4" />
        <stop offset="1" stopColor="#626262" />
      </linearGradient>
      <linearGradient
        id="paint6_linear_12487_3373"
        x1="25.8719"
        y1="16.3385"
        x2="14.7945"
        y2="28.2357"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#BEBEBE" />
        <stop offset="0.101161" stopColor="#555555" />
        <stop offset="0.532941" stopColor="#E4E4E4" />
        <stop offset="1" stopColor="#626262" />
      </linearGradient>
      <linearGradient
        id="paint7_linear_12487_3373"
        x1="24.6481"
        y1="16.3181"
        x2="14.9554"
        y2="26.7281"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#BEBEBE" />
        <stop offset="0.101161" stopColor="#555555" />
        <stop offset="0.532941" stopColor="#E4E4E4" />
        <stop offset="1" stopColor="#626262" />
      </linearGradient>
      <linearGradient
        id="paint8_linear_12487_3373"
        x1="23.4248"
        y1="16.2986"
        x2="15.1168"
        y2="25.2214"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#BEBEBE" />
        <stop offset="0.101161" stopColor="#555555" />
        <stop offset="0.532941" stopColor="#E4E4E4" />
        <stop offset="1" stopColor="#626262" />
      </linearGradient>
      <linearGradient
        id="paint9_linear_12487_3373"
        x1="23.7916"
        y1="11.3971"
        x2="12.2499"
        y2="19.4542"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F2F2F2" />
        <stop offset="0.0745486" stopColor="#878787" />
        <stop offset="0.532941" stopColor="#E6E6E6" />
        <stop offset="1" stopColor="white" />
      </linearGradient>
    </defs>
  </svg>
);

const BronzeMusicIcon = () => (
  <svg
    width="33"
    height="33"
    viewBox="0 0 33 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="16.084"
      cy="16.751"
      r="15.3977"
      stroke="url(#paint0_linear_12487_7813)"
      strokeWidth="1.17818"
    />
    <circle
      cx="16.0837"
      cy="16.7512"
      r="14.2558"
      stroke="url(#paint1_linear_12487_7813)"
      strokeWidth="1.17818"
    />
    <path
      d="M29.1978 16.7511C29.1978 23.9937 23.3265 29.865 16.0839 29.865C8.84124 29.865 2.96995 23.9937 2.96995 16.7511C2.96995 9.50848 8.84124 3.63718 16.0839 3.63718C23.3265 3.63718 29.1978 9.50848 29.1978 16.7511Z"
      stroke="url(#paint2_linear_12487_7813)"
      strokeWidth="1.17818"
    />
    <circle
      cx="16.084"
      cy="16.7508"
      r="11.972"
      stroke="url(#paint3_linear_12487_7813)"
      strokeWidth="1.17818"
    />
    <circle
      cx="16.0842"
      cy="16.7512"
      r="10.8301"
      stroke="url(#paint4_linear_12487_7813)"
      strokeWidth="1.17818"
    />
    <circle
      cx="16.0839"
      cy="16.7509"
      r="9.68816"
      stroke="url(#paint5_linear_12487_7813)"
      strokeWidth="1.17818"
    />
    <circle
      cx="16.0841"
      cy="16.7513"
      r="8.54624"
      stroke="url(#paint6_linear_12487_7813)"
      strokeWidth="1.17818"
    />
    <circle
      cx="16.0837"
      cy="16.751"
      r="7.40433"
      stroke="url(#paint7_linear_12487_7813)"
      strokeWidth="1.17818"
    />
    <circle
      cx="16.0839"
      cy="16.7514"
      r="6.26241"
      stroke="url(#paint8_linear_12487_7813)"
      strokeWidth="1.17818"
    />
    <circle cx="16.0837" cy="16.751" r="7.99341" fill="#8B3809" />
    <path
      d="M18.0029 12.7644L14.3317 13.7412C14.2028 13.7752 14.1132 13.8948 14.1132 14.0307V18.371C13.8469 18.1746 13.5044 18.0777 13.1387 18.1431C12.5937 18.2401 12.1629 18.7071 12.0966 19.271C11.9996 20.093 12.6452 20.7878 13.4357 20.7463C14.123 20.7085 14.6459 20.0942 14.6459 19.3893V15.2668L17.8102 14.4587V17.2595C17.5684 17.0895 17.2665 17.0027 16.9449 17.0379C16.3263 17.1072 15.8365 17.6459 15.8095 18.2829C15.7764 19.0583 16.3987 19.6927 17.156 19.6524C17.8433 19.6159 18.3674 19.0004 18.3674 18.2955V13.0539C18.3687 12.8575 18.1882 12.7153 18.0029 12.7644Z"
      fill="url(#paint9_linear_12487_7813)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_12487_7813"
        x1="33.2127"
        y1="17.0367"
        x2="13.5147"
        y2="37.8767"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC188" />
        <stop offset="0.101161" stopColor="#A65F1E" />
        <stop offset="0.532941" stopColor="#FFC188" />
        <stop offset="1" stopColor="#A65F1E" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_12487_7813"
        x1="31.9889"
        y1="17.0165"
        x2="13.6979"
        y2="36.3679"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC188" />
        <stop offset="0.101161" stopColor="#A65F1E" />
        <stop offset="0.532941" stopColor="#FFC188" />
        <stop offset="1" stopColor="#A65F1E" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_12487_7813"
        x1="30.7656"
        y1="16.996"
        x2="13.8816"
        y2="34.8589"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC188" />
        <stop offset="0.101161" stopColor="#A65F1E" />
        <stop offset="0.532941" stopColor="#FFC188" />
        <stop offset="1" stopColor="#A65F1E" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_12487_7813"
        x1="29.5423"
        y1="16.9753"
        x2="14.0653"
        y2="33.3496"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC188" />
        <stop offset="0.101161" stopColor="#A65F1E" />
        <stop offset="0.532941" stopColor="#FFC188" />
        <stop offset="1" stopColor="#A65F1E" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_12487_7813"
        x1="28.319"
        y1="16.9553"
        x2="14.249"
        y2="31.841"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC188" />
        <stop offset="0.101161" stopColor="#A65F1E" />
        <stop offset="0.532941" stopColor="#FFC188" />
        <stop offset="1" stopColor="#A65F1E" />
      </linearGradient>
      <linearGradient
        id="paint5_linear_12487_7813"
        x1="27.0952"
        y1="16.9346"
        x2="14.4322"
        y2="30.3317"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC188" />
        <stop offset="0.101161" stopColor="#A65F1E" />
        <stop offset="0.532941" stopColor="#FFC188" />
        <stop offset="1" stopColor="#A65F1E" />
      </linearGradient>
      <linearGradient
        id="paint6_linear_12487_7813"
        x1="25.8719"
        y1="16.9146"
        x2="14.6159"
        y2="28.8231"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC188" />
        <stop offset="0.101161" stopColor="#A65F1E" />
        <stop offset="0.532941" stopColor="#FFC188" />
        <stop offset="1" stopColor="#A65F1E" />
      </linearGradient>
      <linearGradient
        id="paint7_linear_12487_7813"
        x1="24.6481"
        y1="16.8939"
        x2="14.7991"
        y2="27.3139"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC188" />
        <stop offset="0.101161" stopColor="#A65F1E" />
        <stop offset="0.532941" stopColor="#FFC188" />
        <stop offset="1" stopColor="#A65F1E" />
      </linearGradient>
      <linearGradient
        id="paint8_linear_12487_7813"
        x1="23.4248"
        y1="16.8739"
        x2="14.9828"
        y2="25.8053"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC188" />
        <stop offset="0.101161" stopColor="#A65F1E" />
        <stop offset="0.532941" stopColor="#FFC188" />
        <stop offset="1" stopColor="#A65F1E" />
      </linearGradient>
      <linearGradient
        id="paint9_linear_12487_7813"
        x1="23.7916"
        y1="11.8982"
        x2="12.1367"
        y2="19.9129"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFC188" />
        <stop offset="0.0745486" stopColor="#A65F1E" />
        <stop offset="0.532941" stopColor="#FFC188" />
        <stop offset="1" stopColor="white" />
      </linearGradient>
    </defs>
  </svg>
);
