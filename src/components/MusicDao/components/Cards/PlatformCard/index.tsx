import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { convertImgUrl, processImage } from 'shared/helpers';
import Box from 'shared/ui-kit/Box';
import { Color } from 'shared/ui-kit';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import { BlockchainNets } from 'shared/constants/constants';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { onGetNonDecrypt } from 'shared/ipfs/get';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';

const useStyles = makeStyles((theme) => ({
  container: {
    background: Color.White,
    boxShadow: '0px 25px 36px -11px rgba(0, 0, 0, 0.02)',
    borderRadius: 14,
    height: '476px',
    display: 'flex',
    alignItems: 'center',
    color: '#181818',
    fontSize: 14,
    fontWeight: 800,

    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      fontSize: 11,
      borderRadius: 8
    },

    '&:hover': {
      boxShadow:
        '0px 8px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.01)'
    }
  },
  title: {
    width: '100%',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textTransform: 'uppercase',
    fontSize: '18px',
    fontWeight: 600
  },
  description: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '17px',
    color: '#2D3047',
    opacity: 0.7,
    display: ' -webkit-box',
    ' -webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: '12px'
  },
  platform: {
    width: '100%',
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    overflowWrap: 'anywhere'
  },
  name: {
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))',
    borderRadius: 6,
    padding: '2px 6px',
    color: 'white',
    fontSize: 10,
    marginTop: 4,
    width: 'fit-content',
    [theme.breakpoints.down('xs')]: {
      fontSize: 8
    }
  }
}));

const PlatformCard: React.FC<{
  data: any;
  collection?: any;
  isLoading?: boolean;
  openCreateContent?: any;
  index?: number;
  handleClick?: () => void;
  selected?: boolean;
}> = ({
  data,
  collection,
  isLoading,
  openCreateContent,
  index,
  handleClick,
  selected
}) => {
  const history = useHistory();
  const classes = useStyles();

  const imagePath = React.useMemo(() => {
    return processImage(data?.image);
  }, [data]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const [item, setItem] = useState<any>(data);
  const [isFromPreview, setIsFromPreview] = useState<boolean>(false);
  const [
    openDraftContentPreviewModal,
    setOpenDraftContentPreviewModal
  ] = useState<boolean>(false);
  const [openEdititemDraftModal, setOpenEdititemDraftModal] = useState<boolean>(
    false
  );

  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  return (
    <>
      <Box
        className={classes.container}
        px={isMobile ? 0.7 : 1.5}
        py={isMobile ? 0.7 : 1.5}
        mb={1}
        onClick={() => {
          handleClick
            ? handleClick()
            : data?.name && history.push(`/platforms/${data.id}`);
        }}
        style={
          selected
            ? {
                border: '2px solid #0D59EE'
              }
            : index === 0
            ? { background: '#EEEDED' }
            : index === 1
            ? { background: '#E2FFCB' }
            : index === 2
            ? { background: '#DDFFF5' }
            : {}
        }
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          height="100%"
          flex="1"
        >
          <Box
            fontWeight="normal"
            width={isMobile ? 72 : 'auto'}
            className={classes.platform}
          >
            {isLoading ? (
              <SkeletonBox loading width="100%" height="222px" ml={2} />
            ) : (
              <img
                src={convertImgUrl(imagePath) ?? getDefaultBGImage()}
                style={{
                  width: '100%',
                  height: '290px',
                  borderRadius: '20px'
                }}
              />
            )}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            style={{ padding: '30px' }}
          >
            <Box style={{ width: isMobile ? 50 : isTablet ? 90 : 150 }} mx={1}>
              <Box className={classes.title} color="#2D3047" textAlign="center">
                {isLoading ? (
                  <SkeletonBox loading width="80%" height="30px" />
                ) : (
                  item.name
                )}
              </Box>
            </Box>
            <Box textAlign="center" className={classes.description}>
              {isLoading ? (
                <Box display="flex" justifyContent={'center'}>
                  <SkeletonBox loading width="100%" height="30px" />
                </Box>
              ) : (
                item.description
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PlatformCard;
