import React from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import { convertImgUrl, processImage } from 'shared/helpers';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';

import { nftOwnerCardStyles } from './index.style';

const NFTOwnerCard = ({ totalOwnerCount, data, index, isLoading = false }) => {
  const classes = nftOwnerCardStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const imagePath = React.useMemo(() => {
    return processImage(data?.image);
  }, [data]);

  const shortId = (id) => {
    if (!id || id.length < 12) {
      return id;
    }
    return id.substring(0, 6) + '...' + id.substring(id.length - 4);
  };

  return (
    <Box className={classes.container}>
      <img
        src={require('assets/backgrounds/nft_owner_card_no_bg.svg')}
        style={{
          top: 2,
          left: 2,
          position: 'absolute',
          width: '50%',
          height: '50%'
        }}
      ></img>
      <img
        src={require('assets/backgrounds/nft_owner_card_bg.svg')}
        style={{
          top: 0,
          left: 0,
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
      ></img>
      {!isLoading && <Box className={classes.sideNo}>{index}</Box>}
      <Box className={classes.mainContainer}>
        <Box
          className={classes.image}
          style={{
            backgroundImage: isLoading
              ? 'none'
              : `url(${convertImgUrl(imagePath) ?? getDefaultAvatar()})`
          }}
        >
          {isLoading && <SkeletonBox loading width="100%" height="100%" />}
        </Box>
        <Box className={classes.address}>
          {isLoading ? (
            <SkeletonBox loading width={isMobile ? 95 : 122} height={14} />
          ) : (
            shortId(data?.address)
          )}
        </Box>
        <Box className={classes.divider}></Box>
        <Box className={classes.infoContainer}>
          {isLoading ? (
            <SkeletonBox loading width="100%" height={36} />
          ) : (
            <>
              <Box className={classes.infoSub}>
                <Box className={classes.infoLable}>QUANTITY</Box>
                <Box className={classes.infoValue}>{data?.amount}</Box>
              </Box>
              <Box className={classes.infoSub}>
                <Box className={classes.infoLable}>PERCENTAGE</Box>
                <Box className={classes.infoValue}>
                  {!totalOwnerCount
                    ? 0
                    : ((data.amount / totalOwnerCount) * 100).toFixed(4)}
                  %
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default NFTOwnerCard;
