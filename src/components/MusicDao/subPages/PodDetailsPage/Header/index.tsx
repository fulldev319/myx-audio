import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import axios from 'axios';
import { CASHBACK_URL } from 'shared/functions/getURL';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import withStyles from '@material-ui/core/styles/withStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import MenuItem from '@material-ui/core/MenuItem';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';

import { PrimaryButton } from 'shared/ui-kit';
import { claimAmount } from 'shared/constants/constants';
import { podCardStyles } from '../../../components/Cards/PodCard/index.styles';
import {
  ArrowIcon,
  EditIcon
} from 'components/MusicDao/components/Icons/SvgIcons';
import PodStakingModal from 'components/MusicDao/modals/PodStakingModal';
import { ClaimFeesModal } from 'components/MusicDao/modals/ClaimFeesModal';
import { useShareMedia } from 'shared/contexts/ShareMediaContext';
import {
  musicDaoFollowPod,
  musicDaoUnfollowPod,
  musicDAOChangePodImage
} from 'shared/services/API';
import { useTypedSelector } from 'store/reducers/Reducer';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import Box from 'shared/ui-kit/Box';
import { useAuth } from 'shared/contexts/AuthContext';

import { onUploadNonEncrypt } from 'shared/ipfs/upload';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { BlockchainNets } from 'shared/constants/constants';

import { usePodDetailStyles } from '../index.styles';

const CustomMenuItem = withStyles({
  root: {
    fontSize: '14px'
  }
})(MenuItem);

const randomImageNumber = Math.floor(Math.random() * 15 + 1);

export default function PodHeader({
  pod,
  podInfo,
  stakings,
  followed,
  setFollowed,
  fundingEnded,
  fundingEndTime,
  imageIPFS,
  isFunded,
  isCreatorOrCollab,
  onChangePhoto,
  refresh
}: {
  pod: any;
  podInfo: any;
  stakings: any;
  followed: boolean;
  setFollowed: any;
  fundingEnded: boolean;
  fundingEndTime: any;
  imageIPFS: any;
  isFunded: boolean;
  isCreatorOrCollab: boolean;
  onChangePhoto: (cid: string, fileName: string) => void;
  refresh: () => void;
}) {
  const user = useTypedSelector((state) => state.user);
  const classes = usePodDetailStyles();
  const styles = podCardStyles();
  const { isSignedin } = useAuth();

  const history = useHistory();
  const { setMultiAddr, uploadWithNonEncryption } = useIPFS();

  const theme = useTheme();
  const isLgTablet = useMediaQuery(theme.breakpoints.down(1080));
  // const isTablet = useMediaQuery(theme.breakpoints.down(840));
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [network, setNetwork] = useState<string>(BlockchainNets[1].value);

  const [podData, setPodData] = useState<any>(pod);
  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();
  const { showAlertMessage } = useAlertMessage();

  const [isOwner, setIsOwner] = React.useState<boolean>(false);
  const [claimableAmount, setClaimableAmount] = React.useState<number>(0);

  const [openShareMenu, setOpenShareMenu] = React.useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [randomImage, setRandomImage] = useState<string>('');

  const [openStakingModal, setOpenStakingModal] = useState<boolean>(false);
  const [openClaimFeesModal, setOpenClaimFeesModal] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<any>(undefined);
  const [txHash, setTxHash] = useState<any>(null);

  const [proposalEnded, setProposalEnded] = useState<boolean>(false);
  const [proposalEndTime, setProposalEndTime] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isProcessFollowing, setIsProcessFollowing] = useState<boolean>(false);

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  useEffect(() => {
    setPodData(pod);
    const amount = claimAmount + 0.05 * pod?.Medias.length;
    setClaimableAmount(amount);
    console.log(pod, user, amount);
  }, [pod]);

  useEffect(() => {
    if (!pod || !user) return;

    if (pod.collabs) {
      const collabs = pod.Collabs ?? [];
      setIsOwner(
        collabs.find((v) => v.address === user.address) ? true : false
      );
    }
  }, [pod, user]);

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
          setProposalEnded(true);
          setProposalEndTime({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          });
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
          setProposalEnded(false);
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

  useEffect(() => {
    setRandomImage(
      podData?.url ?? require(`assets/podImages/${randomImageNumber}.webp`)
    );
  }, [podData]);

  const handleFollow = async () => {
    setIsProcessFollowing(true);
    if (!followed) {
      musicDaoFollowPod(user.id, podData.id)
        .then((resp) => {
          if (resp.success) {
            showAlertMessage(`Followed`, { variant: 'success' });
            setFollowed(true);
          } else {
            showAlertMessage(`Follow failed`, { variant: 'error' });
          }
        })
        .finally(() => setIsProcessFollowing(false));
    } else {
      musicDaoUnfollowPod(user.id, podData.id)
        .then((resp) => {
          if (resp.success) {
            showAlertMessage(`Unfollowed`, { variant: 'success' });
            setFollowed(false);
          } else {
            showAlertMessage(`Unfollow failed`, { variant: 'error' });
          }
        })
        .finally(() => setIsProcessFollowing(false));
    }
  };

  const showShareMenu = () => {
    setOpenShareMenu(true);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorShareMenuRef.current &&
      anchorShareMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpenShareMenu(false);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleOpenQRCodeModal = () => {
    const link = `capsules/${podData.id}`;
    shareMediaWithQrCode(podData.id, link);
  };

  const handleOpenShareModal = () => {
    const link = `capsules/${podData.id}`;
    shareMediaToSocial(podData.id, 'Capsule', 'NEW-MUSIC-PODS', link);
  };

  const handlePodImage = () => {
    if (isCreatorOrCollab && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleClaimFees = () => {
    setOpenClaimFeesModal(true);
    try {
      axios
        .post(CASHBACK_URL(), {
          address: podData.id
        })
        .then((res) => {
          console.log(res.data.success);
          if (res.data.success) {
            setTransactionSuccess(true);
            setTxHash(res.data.txhash);
            refresh();
          } else {
            setTransactionSuccess(false);
          }
        });
    } catch (error) {
      console.log(error);
      setTransactionSuccess(false);
    }
  };

  const fileInput = async (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      try {
        let infoImage = await onUploadNonEncrypt(files[0], (file) =>
          uploadWithNonEncryption(file)
        );
        if (infoImage) {
          const resp = await musicDAOChangePodImage(pod.Id, { infoImage });
          if (
            resp.success &&
            infoImage?.newFileCID &&
            infoImage?.metadata?.properties?.name
          ) {
            onChangePhoto(
              infoImage.newFileCID,
              infoImage.metadata.properties.name
            );
            showAlertMessage('Success upload pod image', {
              variant: 'success'
            });
          } else {
            throw new Error('Updating pod image is failed');
          }
        } else {
          throw new Error('Failed to upload image to ipfs');
        }
      } catch (error) {
        console.log('Error', error);
        showAlertMessage('Failed to upload pod image', { variant: 'error' });
      }
    }
  };

  const handleGotoScan = () => {
    const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(
      `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/token/${
        pod.collectionWithRoyalty
      }`,
      '_blank'
    );
  };

  return (
    <>
      <Box width={1}>
        <Box className={classes.headerBox}>
          <Box py={4} className={classes.headerInfo}>
            <Hidden smUp>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  history.push({
                    pathname: '/capsules',
                    search: `?query=${
                      pod.distributionProposalAccepted ? 'all' : 'proposal'
                    }`
                  });
                }}
                mb={isMobile ? 2 : 4}
              >
                <Box>
                  <ArrowIcon color={'#54658F'} />
                </Box>
                <Box
                  color="#54658F"
                  fontSize={14}
                  fontWeight={700}
                  ml="5px"
                  mb="4px"
                >
                  BACK
                </Box>
              </Box>
            </Hidden>
            <Grid container>
              <Hidden smUp>
                <Grid item xs={12} className={classes.image}>
                  <img
                    src={imageIPFS ? imageIPFS : getDefaultBGImage()}
                    style={{
                      objectFit: 'cover',
                      borderRadius: '10px'
                    }}
                    height={400}
                    width="100%"
                  />
                  {isCreatorOrCollab && (
                    <Box
                      className={classes.editable}
                      style={{
                        cursor: isCreatorOrCollab ? 'pointer' : undefined
                      }}
                      onClick={handlePodImage}
                    >
                      <EditIcon />
                    </Box>
                  )}
                </Grid>
              </Hidden>
              <Grid
                item
                md={8}
                sm={6}
                xs={12}
                style={{ paddingRight: isLgTablet ? 0 : '64px' }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent={'space-between'}
                >
                  <Box
                    className={
                      podData.status === 'Funding'
                        ? styles.orangeBox
                        : podData.status === 'Funding Failed'
                        ? styles.redBox
                        : podData.WithFunding === false
                        ? styles.cyanBox
                        : podData.status === 'Funded' ||
                          podData.status === 'Sold out'
                        ? styles.blueBox
                        : styles.proposalBox
                    }
                    style={{ fontWeight: 'bold' }}
                    p={'4px 8px 5px'}
                  >
                    {podData.distributionProposalAccepted === false
                      ? 'Proposal'
                      : podData.status === 'Funding'
                      ? 'Funding'
                      : podData.status === 'Funding Failed'
                      ? 'Funding Failed'
                      : podData.WithFunding === false
                      ? 'Song NFT' //'Collaborative'
                      : podData.status === 'Funded'
                      ? 'Funded'
                      : podData.status === 'Sold out'
                      ? 'Sold out'
                      : ''}
                  </Box>
                  {podData &&
                    podData.distributionProposalAccepted !== false &&
                    podData.status !== '' && (
                      <Box className={classes.flexBox}>
                        <div
                          ref={anchorShareMenuRef}
                          className={classes.svgBox}
                          onClick={showShareMenu}
                          style={{ height: 'fit-content' }}
                        >
                          <ShareIcon />
                        </div>
                        {openShareMenu && (
                          <Popper
                            open={openShareMenu}
                            anchorEl={anchorShareMenuRef.current}
                            transition
                            disablePortal={false}
                            style={{ position: 'inherit' }}
                          >
                            {({ TransitionProps, placement }) => (
                              <Grow
                                {...TransitionProps}
                                style={{
                                  transformOrigin:
                                    placement === 'bottom'
                                      ? 'center top'
                                      : 'center bottom',
                                  position: 'inherit'
                                }}
                              >
                                <Paper className={classes.paper}>
                                  <ClickAwayListener
                                    onClickAway={handleCloseShareMenu}
                                  >
                                    <MenuList
                                      autoFocusItem={openShareMenu}
                                      id="menu-list-grow"
                                      onKeyDown={handleListKeyDownShareMenu}
                                    >
                                      <CustomMenuItem
                                        onClick={handleOpenShareModal}
                                      >
                                        <img
                                          src={require('assets/icons/butterfly.webp')}
                                          alt={'spaceship'}
                                          style={{
                                            width: 20,
                                            height: 20,
                                            marginRight: 5
                                          }}
                                        />
                                        Share on social media
                                      </CustomMenuItem>
                                      <CustomMenuItem
                                        onClick={handleOpenQRCodeModal}
                                      >
                                        <img
                                          src={require('assets/icons/qrcode_small.webp')}
                                          alt={'spaceship'}
                                          style={{
                                            width: 20,
                                            height: 20,
                                            marginRight: 5
                                          }}
                                        />
                                        Share With QR Code
                                      </CustomMenuItem>
                                    </MenuList>
                                  </ClickAwayListener>
                                </Paper>
                              </Grow>
                            )}
                          </Popper>
                        )}
                        {isSignedin && (
                          <>
                            <Box
                              ml={3}
                              className={classes.flexBox}
                              style={{
                                cursor: 'pointer',
                                padding: '11px 17px',
                                background: '#fff',
                                borderRadius: 27
                              }}
                              onClick={handleFollow}
                            >
                              {isProcessFollowing ? (
                                <CircularProgress
                                  size={24}
                                  style={{ color: '#7EDA5E' }}
                                />
                              ) : (
                                <>
                                  {!followed ? <PlusIcon /> : <MinusIcon />}
                                  <Box
                                    mt={'4px'}
                                    ml={1}
                                    fontSize="14px"
                                    color="#081831"
                                    fontWeight={700}
                                  >
                                    {followed ? 'Unfollow' : 'Follow'}
                                  </Box>
                                </>
                              )}
                            </Box>
                          </>
                        )}
                      </Box>
                    )}
                </Box>
                <div className={classes.title} style={{ color: 'white' }}>
                  {podData.Name || podData.name || 'Untitled Capsule'}
                </div>
                <Box
                  mt={2}
                  className={classes.header1}
                  color="white !important"
                  style={{ wordBreak: 'break-word' }}
                >
                  {podData.Description || podData.description}
                </Box>
                <Box
                  className={classes.flexBox}
                  mt={8}
                  style={{
                    flexWrap: 'wrap',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box
                    className={classes.flexBox}
                    style={{
                      flexWrap: 'wrap'
                    }}
                  >
                    {podData.podType && (
                      <div
                        className={classes.tagBox}
                        style={{
                          background: '#0D59EE',
                          fontWeight: 800,
                          fontSize: 10,
                          lineHeight: '13px',
                          textTransform: 'uppercase',
                          color: 'white'
                        }}
                      >
                        {podData.podType ? `${podData.podType}` : ''}
                      </div>
                    )}
                    {pod.hashtags?.map((tag, i) => (
                      <div key={`hash-tag-${i}`} className={classes.tagBox}>
                        {tag}
                      </div>
                    ))}
                    {pod?.collectionWithRoyalty && (
                      <Box
                        display={'flex'}
                        alignItems="center"
                        className={classes.tagBox}
                        style={{ cursor: 'pointer' }}
                        onClick={handleGotoScan}
                      >
                        <PolygonIcon />
                        <Box ml={0.5}>{`${pod?.collectionWithRoyalty?.slice(
                          0,
                          6
                        )}...${pod?.collectionWithRoyalty?.slice(
                          pod.collectionWithRoyalty.length - 7,
                          pod.collectionWithRoyalty.length - 1
                        )}`}</Box>
                      </Box>
                    )}
                  </Box>
                  {isOwner && (
                    <Box>
                      <PrimaryButton
                        size="medium"
                        style={{
                          background: pod?.isClaimed ? '#F43E5F' : '#57CB55'
                        }}
                        className={classes.claimButton}
                        onClick={() => !pod?.isClaimed && handleClaimFees()}
                      >
                        {pod?.isClaimed ? 'fees claimed 😎' : 'claim fees'}
                      </PrimaryButton>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Hidden xsDown>
                <Grid item md={4} sm={6}>
                  <Box
                    className={classes.image}
                    height={350}
                    pl={2}
                    position="relative"
                  >
                    <img
                      src={imageIPFS ? imageIPFS : getDefaultBGImage()}
                      style={{
                        objectFit: 'cover',
                        borderRadius: '10px'
                      }}
                      height={400}
                      width="100%"
                    />
                    {isCreatorOrCollab && (
                      <Box
                        className={classes.editable}
                        style={{
                          cursor: isCreatorOrCollab ? 'pointer' : undefined
                        }}
                        onClick={handlePodImage}
                      >
                        <EditIcon />
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Hidden>
            </Grid>
          </Box>
        </Box>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={inputRef}
          onChange={fileInput}
        />
      </Box>
      {openStakingModal && (
        <PodStakingModal
          open={openStakingModal}
          onClose={() => setOpenStakingModal(false)}
          handleRefresh={refresh}
          pod={pod}
          podInfo={podInfo}
          stakings={stakings}
        />
      )}
      {openClaimFeesModal && (
        <ClaimFeesModal
          open={openClaimFeesModal}
          network={network}
          transactionSuccess={transactionSuccess}
          txHash={txHash}
          handleClose={() => setOpenClaimFeesModal(false)}
          amount={claimableAmount}
        />
      )}
    </>
  );
}

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M5.97949 1.10547V11.1055M0.979492 6.10547L10.9795 6.10547"
      stroke="#081831"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 11.5 1.5"
    fill="none"
  >
    <path
      stroke="#081831"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M1,6.11H11"
      transform="translate(-0.23 -5.36)"
    />
    <path
      stroke="#081831"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M-10.52,1.93"
      transform="translate(-0.23 -5.36)"
    />
  </svg>
);
const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
  >
    <path
      d="M12.839 14.0074L6.46241 10.8192M6.45335 8.22965L12.8359 5.03836M18.3128 15.2999C18.3128 16.8954 17.0194 18.1888 15.4239 18.1888C13.8284 18.1888 12.535 16.8954 12.535 15.2999C12.535 13.7044 13.8284 12.411 15.4239 12.411C17.0194 12.411 18.3128 13.7044 18.3128 15.2999ZM18.3128 3.74436C18.3128 5.33985 17.0194 6.63325 15.4239 6.63325C13.8284 6.63325 12.535 5.33985 12.535 3.74436C12.535 2.14887 13.8284 0.855469 15.4239 0.855469C17.0194 0.855469 18.3128 2.14887 18.3128 3.74436ZM6.75727 9.52214C6.75727 11.1176 5.46387 12.411 3.86838 12.411C2.27289 12.411 0.979492 11.1176 0.979492 9.52214C0.979492 7.92665 2.27289 6.63325 3.86838 6.63325C5.46387 6.63325 6.75727 7.92665 6.75727 9.52214Z"
      stroke="white"
      strokeWidth="1.5"
    />
  </svg>
);
const PolygonIcon = () => (
  <svg
    width="15"
    height="13"
    viewBox="0 0 15 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m14.5 5.9q0.2 0.1 0.4 0.3q0.1 0.2 0.1 0.5v3.5q0 0.3-0.1 0.5q-0.2 0.2-0.4 0.3l-3.1 1.8q-0.2 0.1-0.5 0.1q-0.2 0-0.5-0.1l-3.1-1.8q-0.2-0.1-0.4-0.3q-0.1-0.2-0.1-0.5v-1.2l1.5-0.8v1.2q0 0.2 0.1 0.5q0.1 0.2 0.3 0.3l1.7 0.9q0.2 0.1 0.5 0.1q0.2 0 0.4-0.1l1.7-0.9q0.2-0.2 0.4-0.4q0.1-0.2 0.1-0.4v-1.9q0-0.3-0.2-0.5q-0.1-0.2-0.3-0.3l-1.7-1q-0.2-0.1-0.4-0.1q-0.3 0-0.5 0.1l-2.1 1.3l-1.5 0.8l-2.1 1.2q-0.2 0.1-0.5 0.1q-0.2 0-0.5-0.1l-3.1-1.8q-0.2-0.1-0.4-0.3q-0.1-0.2-0.1-0.5v-3.5q0-0.3 0.1-0.5q0.2-0.2 0.4-0.3l3.1-1.8q0.3-0.1 0.5-0.1q0.3 0 0.5 0.1l3.1 1.8q0.2 0.1 0.3 0.3q0.1 0.2 0.1 0.5v1.2l-1.4 0.8v-1.2q0-0.2-0.1-0.4q-0.2-0.3-0.4-0.4l-1.7-0.9q-0.2-0.1-0.4-0.1q-0.3 0-0.5 0.1l-1.7 0.9q-0.2 0.1-0.3 0.3q-0.1 0.3-0.1 0.5v1.9q0 0.3 0.1 0.5q0.1 0.2 0.3 0.3l1.7 1q0.3 0.1 0.5 0.1q0.3 0 0.5-0.1l2.1-1.3l1.5-0.8l2.1-1.2q0.2-0.1 0.5-0.1q0.2 0 0.4 0.1z"
      fill="white"
    />
  </svg>
);
