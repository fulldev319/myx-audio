import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { setSelectedUser } from 'store/actions/SelectedUser';
import RemovePodModal from '../../../modals/RemovePodModal';
import { DustBinIcon } from '../../Icons/SvgIcons';

import Box from 'shared/ui-kit/Box';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import { Color, Gradient, PrimaryButton } from 'shared/ui-kit';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { onGetNonDecrypt } from 'shared/ipfs/get';

import { PodProposalCardStyles } from './index.styles';

export default function PodProposalCard({
  pod,
  handleRefresh,
  isLoading = false
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const history = useHistory();
  const dispatch = useDispatch();
  const styles = PodProposalCardStyles();

  const [isExpired, setExpired] = useState<boolean>(false);

  const { ipfs, downloadWithNonDecryption } = useIPFS();
  const [imageIPFS, setImageIPFS] = useState<any>(null);

  const [openRemoveModal, setOpenRemoveModal] = useState<boolean>(false);
  const [podData, setPodData] = useState<any>(pod);
  const [proposalEndTime, setProposalEndTime] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (pod && ipfs && Object.keys(ipfs).length !== 0) {
      setExpired(false);
      if (
        pod?.InfoImage?.newFileCID &&
        pod?.InfoImage?.metadata?.properties?.name
      ) {
        getImageIPFS(
          pod.InfoImage.newFileCID,
          pod.InfoImage.metadata.properties.name
        );
      }
      setPodData(pod);

      let delta;
      const now = new Date();
      if (podData?.ProposalDeadline) {
        delta = Math.floor(
          podData.ProposalDeadline._seconds - now.getTime() / 1000
        );
      } else {
        const created = new Date(podData.Created * 1000);
        created.setDate(created.getDate() + 1);
        delta = Math.floor((created.getTime() - now.getTime()) / 1000);
      }
      if (delta < 0) {
        setExpired(true);
      }
    }
  }, [pod, ipfs]);

  useEffect(() => {
    if (!podData.distributionProposalAccepted) {
      const timerId = setInterval(() => {
        let delta;
        const now = new Date();
        if (podData?.ProposalDeadline) {
          delta = Math.floor(
            podData.ProposalDeadline._seconds - now.getTime() / 1000
          );
        } else {
          const created = new Date(podData.Created * 1000);
          created.setDate(created.getDate() + 1);
          delta = Math.floor((created.getTime() - now.getTime()) / 1000);
        }
        if (delta < 0) {
          setProposalEndTime({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          });
          setExpired(true);
          clearInterval(timerId);
        } else {
          let days = Math.floor(delta / 86400);
          delta -= days * 86400;

          // calculate (and subtract) whole hours
          let hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;

          // calculate (and subtract) whole minutes
          let minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;

          // what's left is seconds
          let seconds = delta % 60;
          setProposalEndTime({
            days,
            hours,
            minutes,
            seconds
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [podData?.ProposalDeadline]);

  const getImageIPFS = async (cid: string, fileName: string) => {
    let files = await onGetNonDecrypt(
      cid,
      fileName,
      (fileCID, fileName, download) =>
        downloadWithNonDecryption(fileCID, fileName, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.buffer);
      if (fileName?.slice(-4) === '.gif') {
        setImageIPFS('data:image/gif;base64,' + base64String);
      } else {
        setImageIPFS('data:image/png;base64,' + base64String);
      }
    }
  };

  return (
    <Box className={styles.podCard}>
      <Box className={styles.podImageContent}>
        <SkeletonBox
          image={imageIPFS}
          loading={!imageIPFS}
          width={1}
          height={1}
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
            width: isMobile ? '138px' : '100%',
            height: isMobile ? '138px' : '100%'
          }}
        />
        {isMobile && !isLoading && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              paddingTop: '10px'
            }}
          >
            <PrimaryButton
              size="medium"
              style={{
                background: Gradient.Green1,
                width: '100%',
                height: 36,
                fontSize: isMobile ? '14px' : '16px'
              }}
              isRounded
              onClick={() => history.push(`/capsules/${podData.Id}`)}
            >
              OPEN CAPSULE
            </PrimaryButton>
          </div>
        )}
      </Box>
      <Box flex={1} ml={isMobile ? 1 : 2} overflow="hidden">
        <Box display="flex">
          <Box
            style={{
              background: Gradient.Green1,
              borderRadius: 8,
              padding: '4px 24px'
            }}
          >
            <Box className={styles.header1} color="white">
              Capsule Proposal
            </Box>
          </Box>
        </Box>
        {isLoading ? (
          <Box p={2}>
            <Box mb={1.5}>
              <SkeletonBox loading width="70%" height="30px" />
            </Box>
            <Box mb={1.5}>
              <SkeletonBox loading width="50%" height="30px" />
            </Box>
            <Box mb={1.5}>
              <SkeletonBox loading width="100%" height="30px" />
            </Box>
            <SkeletonBox loading width="100%" height="30px" />
          </Box>
        ) : (
          <>
            <Box className={styles.header2} mt={2}>
              {podData.Name}
            </Box>
            {podData.Creator && (
              <Box display="flex" alignItems="center" mt={2} pb={2}>
                <SkeletonBox
                  className={styles.avatar}
                  loading={false}
                  image={podData.creatorImageUrl ?? getDefaultAvatar()}
                  style={{
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    if (podData.CreatorId || podData.creatorUrlSlug) {
                      history.push(
                        `/profile/${
                          podData.creatorUrlSlug || podData.CreatorId
                        }`
                      );
                      dispatch(setSelectedUser(podData.CreatorId));
                    }
                  }}
                />
                {!isMobile && (
                  <Box
                    ml={isMobile ? 1 : 2}
                    className={`${styles.header1}`}
                    style={{ color: '#707582' }}
                  >
                    Sent by
                  </Box>
                )}
                <Box
                  ml={isMobile ? 1 : 2}
                  className={`${styles.header1}  ${styles.username}`}
                  style={{ color: Color.Green }}
                >
                  {podData.creatorName}
                </Box>
              </Box>
            )}
            <Box
              className={styles.botWrap}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box
                display="flex"
                alignItems="center"
                className={styles.header3}
                borderTop="1px solid #00000022"
                flexGrow={1}
                pt={2}
                mr={isMobile ? 1 : 5}
                flexDirection={isMobile ? 'column' : 'row'}
              >
                <Box className={styles.header3} color="#707582">
                  Proposal Deadline
                </Box>
                <Box className={styles.flexBox} ml={1}>
                  <Box
                    fontSize={14}
                    fontWeight={500}
                    color="#65CB63"
                    mr={'6px'}
                  >
                    {proposalEndTime.days} Days
                  </Box>
                  <Box
                    fontSize={14}
                    fontWeight={500}
                    color="#2D3047"
                    mr={'6px'}
                  >
                    {proposalEndTime.hours}h
                  </Box>
                  <Box
                    fontSize={14}
                    fontWeight={500}
                    color="#2D3047"
                    mr={'6px'}
                  >
                    {proposalEndTime.minutes}min
                  </Box>
                  <Box fontSize={14} fontWeight={500} color="#2D3047">
                    {proposalEndTime.seconds}s
                  </Box>
                </Box>
              </Box>
              {!isMobile && (
                <div
                  style={{
                    width: isTablet ? '100%' : '',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >
                  {isExpired && (
                    <PrimaryButton
                      size="medium"
                      style={{
                        background: '#F43E5F',
                        paddingLeft: 48,
                        paddingRight: 48,
                        fontSize: 14,
                        fontWeight: 600
                      }}
                      isRounded
                      onClick={() => setOpenRemoveModal(true)}
                    >
                      <Box display="flex" alignItems="center">
                        <DustBinIcon />
                        REMOVE POD
                      </Box>
                    </PrimaryButton>
                  )}
                  <PrimaryButton
                    size="medium"
                    style={{
                      background: Gradient.Green1,
                      paddingLeft: 48,
                      paddingRight: 48,
                      fontSize: 14,
                      fontWeight: 600
                    }}
                    isRounded
                    onClick={() => history.push(`/capsules/${podData.Id}`)}
                  >
                    OPEN CAPSULE
                  </PrimaryButton>
                </div>
              )}
            </Box>
          </>
        )}
      </Box>
      {openRemoveModal && (
        <RemovePodModal
          open={openRemoveModal}
          onClose={() => setOpenRemoveModal(false)}
          podId={podData.Id}
          handleRefresh={handleRefresh}
        />
      )}
    </Box>
  );
}
