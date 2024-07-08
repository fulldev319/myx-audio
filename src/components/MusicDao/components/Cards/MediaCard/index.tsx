import React, { useRef, useState } from 'react';

import { useTypedSelector } from 'store/reducers/Reducer';
import MediaTermsModal from 'components/MusicDao/modals/MediaTermsModal';

import { Avatar, Color, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import URL from 'shared/functions/getURL';
import { mediaCardStyles } from './index.styles';
import { IUploadMedia, musicDaoUploadMedia } from 'shared/services/API';
import { buildJsxFromObject } from 'shared/functions/commonFunctions';
import { SignatureRequestModal } from 'shared/ui-kit/Modal/Modals';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { formatDateDefault, processImage } from 'shared/helpers';

const videoPhoto = require('assets/backgrounds/video.webp');
const videoLivePhoto = require('assets/backgrounds/live_video.webp');
const audioPhoto = require('assets/backgrounds/audio.webp');
const audioLivePhoto = require('assets/backgrounds/live_audio_1.webp');
const blogPhoto = require('assets/backgrounds/blog.webp');
const blogSnapPhoto = require('assets/backgrounds/blog_snap.webp');
const digitalArtPhoto = require('assets/backgrounds/digital_art_2.webp');

export const MediaCard = ({ media, pod, handleRefresh }) => {
  const classes = mediaCardStyles();
  const { showAlertMessage } = useAlertMessage();
  const user = useTypedSelector((state) => state.user);
  const [openMediaTermsModal, setOpenMediaTermsModal] =
    React.useState<boolean>(false);

  const payloadRef = useRef<any>({});
  const [openSignRequestModal, setOpenSignRequestModal] =
    useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] =
    useState<any>(null);

  const getDefaultImage = (type) => {
    switch (type) {
      case 'VIDEO_TYPE':
        return videoPhoto;
      case 'LIVE_VIDEO_TYPE':
        return videoLivePhoto;
      case 'AUDIO_TYPE':
        return audioPhoto;
      case 'LIVE_AUDIO_TYPE':
        return audioLivePhoto;
      case 'BLOG_TYPE':
        return blogPhoto;
      case 'BLOG_SNAP_TYPE':
        return blogSnapPhoto;
      case 'DIGITAL_ART_TYPE':
        return digitalArtPhoto;
      default:
        return 'none';
    }
  };

  const handleOpenSignatureModal = () => {
    let payload: IUploadMedia = {
      MediaSymbol: media.MediaSymbol,
      PodAddress: pod.PodAddress
    };
    payloadRef.current = payload;
    setSignRequestModalDetail(buildJsxFromObject(payload));
    setOpenSignRequestModal(true);
  };

  const handleConfirm = () => {
    const payload = payloadRef.current;
    if (payload && Object.keys(payload)) {
      musicDaoUploadMedia(payload, {}).then((resp) => {
        if (resp?.success) {
          showAlertMessage('Media uploaded', { variant: 'success' });
          handleRefresh();
        } else showAlertMessage('Media upload failed', { variant: 'error' });
      });
    }
  };

  return (
    <Box className={classes.container}>
      <SignatureRequestModal
        open={openSignRequestModal}
        address={user.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleConfirm}
        handleClose={() => setOpenSignRequestModal(false)}
      />
      <Box className={classes.podImageContent}>
        <Box
          className={classes.podImage}
          style={{
            backgroundImage: media.HasPhoto
              ? `url(${URL()}/media/getMediaMainPhoto/${media.MediaSymbol.replace(
                  /\s/g,
                  ''
                )})`
              : `url(${getDefaultImage(media.Type)})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
          }}
        />
      </Box>
      <Box className={`${classes.flexBox} ${classes.avatarBox}`}>
        {pod.CreatorsData.map((item, index) => (
          <Box
            ml={item > 1 ? '-16px' : 0}
            key={index}
            className={classes.flexBox}
          >
            <Avatar
              size="small"
              url={
                processImage(item?.imageUrl) ??
                require('assets/anonAvatars/ToyFaces_Colored_BG_035.webp')
              }
              alt=""
            />
          </Box>
        ))}
        {pod.CreatorsData.length > 3 && (
          <Box className={classes.moreBox}>{pod.CreatorsData.length - 3}</Box>
        )}
      </Box>
      <Box
        className={classes.fractionBox}
        style={media.IsRegistered ? { background: Color.MusicDAOGreen } : {}}
      >
        <Box className={classes.flexBox}>
          <Box>
            {media.IsRegistered ? 'Released' : 'Release Date: '}
            {!media.IsRegistered && (
              <span>{formatDateDefault(media.ReleaseDate)}</span>
            )}
          </Box>
        </Box>
      </Box>
      <Box className={classes.genreBox}>Pop</Box>
      <Box mt={30} mx={4} zIndex={1}>
        <Box className={classes.title} mt={2}>
          {media.MediaName || 'Untitled Media'}
        </Box>
        <Box mt={2} className={classes.header1}>
          {media.Description || 'No Description'}
        </Box>
      </Box>
      {media?.IsRegistered && (
        <Box mx={4}>
          <Box
            py={3}
            className={classes.flexBox}
            width={1}
            style={{ borderBottom: '1px dashed #18181820' }}
            justifyContent="space-between"
          >
            <Box className={classes.header2}>Revenue</Box>
            <Box className={classes.header3}>$ 2.11098</Box>
          </Box>
          <Box
            py={3}
            className={classes.flexBox}
            width={1}
            style={{ borderBottom: '1px dashed #18181820' }}
            justifyContent="space-between"
          >
            <Box className={classes.header2}>Number of reproductions</Box>
            <Box className={classes.header3}>245</Box>
          </Box>
          <Box
            pt={3}
            className={classes.flexBox}
            width={1}
            justifyContent="space-between"
          >
            <Box className={classes.header2}>NFT Address</Box>
            <Box className={classes.header3}>
              {pod.PodAddress.substring(0, 6) +
                '...' +
                pod.PodAddress.substring(
                  pod.PodAddress.length - 4,
                  pod.PodAddress.length
                )}
            </Box>
          </Box>
        </Box>
      )}
      <Box
        mt={2}
        className={classes.flexBox}
        justifyContent="flex-end"
        mx={4}
        mb={4}
      >
        {!media?.IsRegistered && (
          <PrimaryButton
            size="medium"
            onClick={() => setOpenMediaTermsModal(true)}
            isRounded
            style={{ minWidth: '35%' }}
          >
            Edit Terms
          </PrimaryButton>
        )}
        {!media?.IsUploaded && pod.RaisedFunds >= pod.FundingTarget && (
          <PrimaryButton size="medium" onClick={handleOpenSignatureModal}>
            Upload Media
          </PrimaryButton>
        )}
      </Box>
      {openMediaTermsModal && (
        <MediaTermsModal
          open={openMediaTermsModal}
          handleClose={() => setOpenMediaTermsModal(false)}
          pod={pod}
          media={media}
          handleRefresh={handleRefresh}
        />
      )}
    </Box>
  );
};
