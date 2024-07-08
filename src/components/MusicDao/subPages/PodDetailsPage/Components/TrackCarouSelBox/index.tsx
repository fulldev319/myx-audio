import React, { useEffect, useState, useRef } from 'react';
import Carousel from 'react-elastic-carousel';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';

import { usePodDetailStyles } from '../../index.styles';
import { useTrackCarouSelBoxStyles } from './index.styles';
import { CarouselSongCard } from '../CarouselSongCard';

export const TrackCarouSelBox = ({ pod, curSongIndex, setCurSongIndex }) => {
  const classes = useTrackCarouSelBoxStyles();
  const comonClasses = usePodDetailStyles();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(1400));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const itemsToShow = isMobile ? 1 : isTablet ? 2 : isSmallScreen ? 3 : 4;

  const carouselRef = useRef<any>();

  const [isPodSoldOut, setIsPodSoldOut] = useState<boolean>(true);
  const [curSelSongIndex, setCurSelSongIndex] = useState<number>(curSongIndex);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalSoldCount, setTotalSoldCount] = useState<number>(0);
  const [editionCount, setEditionCount] = useState<number>(1);
  useEffect(() => {
    setCurSongIndex(curSelSongIndex);
    let editions = 0;
    let solds = 0;
    let amount = 0;
    if (
      pod?.Medias?.length > 0 &&
      pod?.Medias[curSelSongIndex]?.quantityPerEdition?.length
    ) {
      for (
        let i = 0;
        i < pod.Medias[curSelSongIndex].quantityPerEdition.length;
        i++
      ) {
        const quantityCount = Number(
          pod.Medias[curSelSongIndex].quantityPerEdition[i]
        );
        amount += quantityCount;
        if (quantityCount > 0) editions++;
      }
      for (
        let i = 0;
        i < pod.Medias[curSelSongIndex].quantitySoldPerEdition?.length;
        i++
      ) {
        const soldCount = Number(
          pod.Medias[curSelSongIndex].quantitySoldPerEdition[i]
        );
        solds += soldCount;
      }
      setEditionCount(editions);
      setTotalSoldCount(solds);
      setTotalCount(amount);
    }
  }, [curSelSongIndex]);

  useEffect(() => {
    for (let n = 0; n < pod?.Medias?.length; n++) {
      let editions = 0;
      let solds = 0;
      if (
        pod?.Medias?.length > 0 &&
        pod?.Medias[n]?.quantityPerEdition?.length
      ) {
        for (let i = 0; i < pod.Medias[n].quantityPerEdition.length; i++) {
          const quantityCount = Number(pod.Medias[n].quantityPerEdition[i]);
          editions += quantityCount;
        }
        for (let i = 0; i < pod.Medias[n].quantitySoldPerEdition?.length; i++) {
          const soldCount = Number(pod.Medias[n].quantitySoldPerEdition[i]);
          solds += soldCount;
        }
      }

      if (editions === 0 || solds < editions) {
        setIsPodSoldOut(false);
        break;
      }
    }
    // setIsPodSoldOut(true);
  }, [pod]);

  return (
    <Box
      p={2}
      display="flex"
      alignItems="cetner"
      style={{
        position: 'relative',
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
          {pod?.Medias?.map((item, index) => (
            <div
              key={`songcard-${index}`}
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
      <Box display="flex" flexDirection="column" mt={2} ml={isTablet ? 0 : 2}>
        <Box display="flex" alignItems="center">
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => carouselRef.current.slidePrev()}
          >
            <PrevIcon />
          </div>
          <div
            style={{ cursor: 'pointer', marginLeft: 12 }}
            onClick={() => carouselRef.current.slideNext()}
          >
            <NextIcon />
          </div>
        </Box>
        <Box mt={2.5}>
          <Box>
            <Box className={comonClasses.h6} color="#2D3047">
              Number of NFTs
            </Box>
            <Box className={comonClasses.h4} color="#65CB63">
              {totalCount}
            </Box>
          </Box>
          <Box my={1} className={classes.divider} />
          <Box>
            <Box className={comonClasses.h6} color="#2D3047">
              Total Sold
            </Box>
            <Box className={comonClasses.h4} color="#65CB63">
              {totalSoldCount}
            </Box>
          </Box>
          <Box my={1} className={classes.divider} />
          <Box>
            <Box className={comonClasses.h6} color="#2D3047">
              Number of editions
            </Box>
            <Box className={comonClasses.h4} color="#65CB63">
              {editionCount}
            </Box>
          </Box>
        </Box>
        <Box />
      </Box>
      {isPodSoldOut && (
        <img
          src={require('assets/icons/stamp_sold.webp')}
          alt="sold-stamp"
          className={classes.stampImg}
        />
      )}
    </Box>
  );
};

const PrevIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.9297 39.3145C30.7725 39.3145 39.5725 30.5145 39.5725 19.6716C39.5725 8.82874 30.7725 0.0287399 19.9297 0.0287399C9.0868 0.0287399 0.286797 8.82874 0.286797 19.6716C0.286797 30.5145 9.0868 39.3145 19.9297 39.3145ZM23.8582 10.8323L23.8582 28.5109L12.0725 19.6716L23.8582 10.8323Z"
      fill="#57CB55"
    />
  </svg>
);

const NextIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.0747 0.0292969C9.23188 0.0292969 0.431885 8.8293 0.431885 19.6722C0.431885 30.515 9.23188 39.315 20.0747 39.315C30.9176 39.315 39.7176 30.515 39.7176 19.6722C39.7176 8.8293 30.9176 0.0292969 20.0747 0.0292969ZM16.1462 28.5114V10.8329L27.9319 19.6722L16.1462 28.5114Z"
      fill="#57CB55"
    />
  </svg>
);
