import React, { Suspense } from 'react';
import { useHistory } from 'react-router-dom';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import Loading from 'shared/ui-kit/Loading';
import {
  PrimaryButton
} from 'shared/ui-kit';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import {
  getDefaultAvatar,
  getDefaultBGImage
} from 'shared/services/user/getUserAvatar';
import { usePageStyles } from './index.styles';
import { Button } from '@material-ui/core';
const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  400: 2,
  700: 2,
  1200: 3,
  1440: 3
};

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 2,
  700: 2,
  1200: 3,
  1440: 4
};

export default function MerchPage() {
  const classes = usePageStyles();
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Suspense fallback={<Loading />}>
      <Box className={classes.root} id={'scrollContainer'}>
        <Box className={classes.content}>
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
          >
            <Box className={classes.title}>Explore Merch</Box>
            <Box className={classes.description}>
              The Web3 Marketplace to trade, collaborate and create Music NFTs
            </Box>
            <Box className={classes.topBtnRow}>
              <PrimaryButton
                size="medium"
                onClick={() => { }}
                isRounded
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: isMobile ? 1 : "none",
                  width: isMobile ? "auto" : 180,
                  height: isMobile ? 36 : 52,
                  fontSize: isMobile ? 14 : 18,
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 48,
                  fontFamily: "'Pangram'",
                  fontStyle: "normal",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: "#FFFFFF",
                }}
              >
                How It Works
              </PrimaryButton>
              <PrimaryButton
                size="medium"
                onClick={() => { }}
                isRounded
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: isMobile ? 1 : "none",
                  width: isMobile ? "auto" : 180,
                  height: isMobile ? 36 : 52,
                  fontSize: isMobile ? 14 : 18,
                  background: "#2D3047",
                  borderRadius: "48px",
                  fontFamily: "'Pangram'",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "22px",
                  letterSpacing: "-0.04em",
                  color: "#FFFFFF",
                }}
              >
                Create
              </PrimaryButton>
            </Box>
          </Box>
          <Box className={classes.section}>
            <Box
              display={'flex'}
              alignItems="center"
              justifyContent={'space-between'}
              mb={isMobile ? 1 : 3}
            >
              <Box className={classes.title1}>Newly Added Merch</Box>
              <PrimaryButton
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: isMobile ? 32 : 46,
                  paddingLeft: isMobile ? 20 : 45,
                  paddingRight: isMobile ? 20 : 45,
                  fontSize: isMobile ? 12 : 14,
                  background: "#FFFFFF",
                  border: "1px solid rgba(84, 101, 143, 0.3)",
                  boxSizing: "border-box",
                  borderRadius: "37.3272px",
                  fontFamily: "'Pangram'",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "104.5%",
                  textTransform: "uppercase",
                  color: "#2D3047",
                }}
                size="medium"
                onClick={() => { }}
                isRounded
              >
                Show All
              </PrimaryButton>
            </Box>
            <Box>
              <MasonryGrid
                gutter={isMobile ? '8px' : '16px'}
                data={Array(16).fill(0)}
                renderItem={(item, idx) => (
                  <Box className={classes.merchCard} key={idx}>
                    <Box className='imageContainer'>
                      <Box className='image' style={{
                        background: `url(${getDefaultBGImage()})`,
                      }}>
                      </Box>
                    </Box>
                    <Box className='name'>Merch Name</Box>
                    <Box className="info">
                      <Box className='artist-info'>
                        <Box flex={1} display="flex" alignItems="center" gridGap={4}>
                          <Box className='avatar' style={{
                            background: `url(${getDefaultAvatar()})`,
                            backgroundSize: 'cover',
                          }}></Box>
                          <Box className='artist'>Artist Name</Box>
                        </Box>
                        <Button className='btn-buy'>BUY</Button>
                      </Box>
                      <Box className="divider"></Box>
                      <Box className='price-info'>
                        <Box className='price'>145 USDT</Box>
                        <Box className='date'>20<span className='gray'>/20</span></Box>
                      </Box>
                    </Box>
                  </Box>
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            </Box>
          </Box>
          <Box className={classes.section}>
            <Box
              display={'flex'}
              alignItems="center"
              justifyContent={'space-between'}
              mb={isMobile ? 1 : 3}
            >
              <Box className={classes.title2}>Merch Capsules</Box>
              <PrimaryButton
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: isMobile ? 32 : 46,
                  paddingLeft: isMobile ? 20 : 45,
                  paddingRight: isMobile ? 20 : 45,
                  fontSize: isMobile ? 12 : 14,
                  background: "transparent",
                  boxSizing: "border-box",
                  borderRadius: "37.3272px",
                  fontFamily: "'Pangram'",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "104.5%",
                  textTransform: "uppercase",
                  color: "#2D3047",
                }}
                size="medium"
                onClick={() => { }}
                isRounded
              >
                Explore all
              </PrimaryButton>
            </Box>
            <Box>
              <MasonryGrid
                gutter={isMobile ? '8px' : '16px'}
                data={Array(12).fill(0)}
                renderItem={(item, idx) => (
                  <Box className={classes.merchCapsuleCard} key={idx}>
                    <Box className='imageContainer'>
                      <Box className='image' style={{
                        background: `url(${getDefaultBGImage()})`,
                      }}>
                      </Box>
                    </Box>
                    <Box className='avatar' style={{
                      background: `url(${getDefaultAvatar()})`,
                      backgroundSize: 'cover',
                    }}>
                    </Box>
                    <Box className='collection'>Collection Name</Box>
                    <Box className='author'>Author Name</Box>
                    <Box className='description'>
                      TECHNOFISH is a collection of 5x NFT artworks from producer Calvin Harris and director Emil Nava. The body of work is the latest
                      TECHNOFISH is a collection of 5x NFT artworks from producer Calvin Harris and director Emil Nava. The body of work is the latest
                    </Box>
                  </Box>
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Suspense>
  );
}