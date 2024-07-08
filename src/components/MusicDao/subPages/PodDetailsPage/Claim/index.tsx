import React, { useEffect, useState, useRef } from 'react';
import Carousel from 'react-elastic-carousel';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';

import Box from 'shared/ui-kit/Box';
import { PrimaryButton } from 'shared/ui-kit';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';

import { usePodDetailStyles } from '../index.styles';
import { useClaimStyles } from './index.styles';
import { CarouselSongCard } from '../Components/CarouselSongCard';
import { ClaimAccuredRvenueModal } from 'components/MusicDao/modals/ClaimAccuredRvenueModal';
import { ClaimUnstakeModal } from 'components/MusicDao/modals/ClaimUnstakeModal';

const mockSongDatas = [
  {
    image: getDefaultBGImage(),
    title: 'Song Name',
    isSold: true
  },
  {
    image: getDefaultBGImage(),
    title: 'Song Name',
    isSold: false
  },
  {
    image: getDefaultBGImage(),
    title: 'Song Name',
    isSold: true
  },
  {
    image: getDefaultBGImage(),
    title: 'Song Name',
    isSold: false
  },
  {
    image: getDefaultBGImage(),
    title: 'Song Name',
    isSold: false
  },
  {
    image: getDefaultBGImage(),
    title: 'Song Name',
    isSold: false
  },
  {
    image: getDefaultBGImage(),
    title: 'Song Name',
    isSold: false
  }
];

export const Claim = () => {
  const classes = useClaimStyles();
  const comonClasses = usePodDetailStyles();

  const theme = useTheme();
  const isNormalScreen = useMediaQuery(theme.breakpoints.down(1800));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(1400));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const itemsToShow = isMobile ? 1 : isTablet ? 2 : isSmallScreen ? 3 : 4;

  const carouselRef = useRef<any>();
  const [curSelSongIndex, setCurSelSongIndex] = useState<number>(0);
  const [legoType, setLegoType] = useState<number>(0); // 0 - none, 1 - normal lego, 2 - claim lego

  const [openClaimAccuredRevenueModal, setOpenClaimAccuredRevenueModal] =
    useState<boolean>(false);
  const [openClaimUnstakeModal, setOpenClaimUnstakeModal] =
    useState<boolean>(false);

  useEffect(() => {}, []);

  return (
    <Box
      style={{
        color: '#2D3047',
        position: 'relative',
        height: legoType === 0 ? 650 : legoType === 1 ? 700 : 1000
      }}
    >
      {legoType > 0 && (
        <Box
          className={classes.blur}
          style={{
            width: legoType === 1 ? '80%' : '30%',
            top: legoType === 1 ? 500 : 600
          }}
        />
      )}
      <Box className={classes.sectionBox}>
        <Box className={classes.titleBox}>Claim</Box>
        <Box
          p={2}
          display="flex"
          alignItems="cetner"
          style={{
            background: '#FFFFFF',
            boxShadow: '0px 30px 35px -12px rgba(29, 103, 84, 0.09)',
            borderRadius: 20
          }}
          flexDirection={isTablet ? 'column' : 'row'}
        >
          <Box className={comonClasses.carouSelBox}>
            <Carousel
              isRTL={false}
              itemsToShow={itemsToShow}
              pagination={false}
              showArrows={false}
              ref={carouselRef}
              // itemPadding={[0, 12]}
              // focusOnSelect={true}
              initialActiveIndex={curSelSongIndex}
              className={comonClasses.carouselWrap}
            >
              {mockSongDatas.map((item, index) => (
                <div
                  onClick={() => {
                    setCurSelSongIndex(index);
                  }}
                >
                  <CarouselSongCard
                    song={item}
                    active={index === curSelSongIndex}
                    key={`song-card-${index}`}
                  />
                </div>
              ))}
            </Carousel>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-around"
            mt={isTablet ? 2 : 0}
          >
            <Box
              width="56px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => carouselRef.current.slidePrev()}
              >
                <PrevIcon />
              </div>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => carouselRef.current.slideNext()}
              >
                <NextIcon />
              </div>
            </Box>
            <Box>
              <Box>
                <Box className={comonClasses.h6} color="#2D3047">
                  Total number of NFTs
                </Box>
                <Box
                  className={comonClasses.h4}
                  color="#65CB63"
                  style={{ fontWeight: 600 }}
                >
                  12
                </Box>
              </Box>
              <Box my={1} className={classes.divider} />
              <Box>
                <Box className={comonClasses.h6} color="#2D3047">
                  Remaining to be bought
                </Box>
                <Box
                  className={comonClasses.h4}
                  color="#65CB63"
                  style={{ fontWeight: 600 }}
                >
                  07
                </Box>
              </Box>
            </Box>
            <Box />
          </Box>
        </Box>
        {legoType === 0 ? (
          <Box p={4} mt={3} className={classes.unstakeBox}>
            <Box className={classes.infoItem}>
              <Box className={classes.h1}>
                <span>1255</span>
                <span>MF</span>
              </Box>
              <Box className={classes.h5}>My total stake</Box>
            </Box>
            <Box className={classes.infoItem}>
              <Box className={classes.h1}>
                <span>0.45</span>
                <span>%</span>
              </Box>
              <Box className={classes.h5}>Share </Box>
            </Box>
            <Box className={classes.infoItem}>
              <Box className={classes.h1}>
                <span>2132</span>
                <span>USDT</span>
              </Box>
              <Box className={classes.h5}>Revenue Accured</Box>
            </Box>
            <Box className={classes.buttons}>
              <PrimaryButton
                className={classes.firstButton}
                size="medium"
                isRounded
                onClick={() => {
                  setOpenClaimUnstakeModal(true);
                }}
              >
                Unstake
              </PrimaryButton>
              <PrimaryButton
                className={classes.secondButton}
                size="medium"
                isRounded
                onClick={() => {
                  setOpenClaimAccuredRevenueModal(true);
                }}
              >
                Claim
              </PrimaryButton>
            </Box>
          </Box>
        ) : legoType === 1 ? (
          <Box mt={5} className={classes.legoBox}>
            <Box>
              <img
                style={{ width: 180 }}
                className={classes.normalLegoImg}
                src={require('assets/icons/lego/m_black_1.webp')}
              />
              <img
                style={{ width: 200 }}
                className={classes.normalLegoImg}
                src={require('assets/icons/lego/y_black_1.webp')}
              />
              <img
                style={{ width: 200 }}
                className={classes.normalLegoImg}
                src={require('assets/icons/lego/x_black_1.webp')}
              />
            </Box>
          </Box>
        ) : (
          <>
            <Box mt={5} className={classes.legoBox}>
              <Box>
                <img
                  style={{ width: 130 }}
                  className={classes.normalLegoImg}
                  src={require('assets/icons/lego/m_black_1.webp')}
                />
                <img
                  style={{ width: 350 }}
                  className={classes.normalLegoImg}
                  src={require('assets/icons/lego/y_color_1.webp')}
                />
                <img
                  style={{ width: 150 }}
                  className={classes.normalLegoImg}
                  src={require('assets/icons/lego/x_black_1.webp')}
                />
              </Box>
            </Box>
            <Box className={classes.priceBox}>
              <Box display="flex" alignItems="center" zIndex={1}>
                <img
                  src={require('assets/icons/lego/y_color_1.webp')}
                  style={{ width: 48 }}
                />
                <span>Gold Edition Revenue </span>
              </Box>
              <Box mt={2} mb={1} className={classes.priceGradient} zIndex={1}>
                2234 USDT
              </Box>
              <PrimaryButton
                className={classes.claimButton}
                size="medium"
                isRounded
                onClick={() => {
                  setOpenClaimAccuredRevenueModal(true);
                }}
              >
                Claim
              </PrimaryButton>
              <div className={classes.arrowRect} />
            </Box>
          </>
        )}
      </Box>

      {openClaimAccuredRevenueModal && (
        <ClaimAccuredRvenueModal
          open={openClaimAccuredRevenueModal}
          handleClose={() => {
            setOpenClaimAccuredRevenueModal(false);
          }}
          handleRefresh={() => {}}
        />
      )}
      {openClaimUnstakeModal && (
        <ClaimUnstakeModal
          open={openClaimUnstakeModal}
          handleClose={() => {
            setOpenClaimUnstakeModal(false);
          }}
          handleRefresh={() => {}}
        />
      )}
    </Box>
  );
};

const PrevIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20ZM12 5.5L12 14.5L6 10L12 5.5Z"
      fill="#65CB63"
    />
  </svg>
);
const NextIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 14.5V5.5L14 10L8 14.5Z"
      fill="#65CB63"
    />
  </svg>
);
