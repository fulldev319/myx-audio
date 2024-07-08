import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import cls from 'classnames';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { RootState } from 'store/reducers/Reducer';
import { updateTask } from 'shared/functions/updateTask';
import { musicDAOInitiatePod } from 'shared/services/API';
import { BlockchainNets } from 'shared/constants/constants';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import {
  Modal,
  PrimaryButton,
  SecondaryButton,
  CircularLoadingIndicator
} from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import CollabsTab from './components/CollabsTab/CollabsTab';
import GeneralNFTMediaTab from './components/GeneralNFTMediaTab/GeneralNFTMediaTab';
import { createPodModalStyles } from './CreatePodModal.styles';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { onUploadNonEncrypt } from '../../../../shared/ipfs/upload';
import { switchNetwork } from 'shared/functions/metamask';

const CreatePodModal = (props: any) => {
  const { showAlertMessage } = useAlertMessage();
  const userSelector = useSelector((state: RootState) => state.user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [tabCreateNFTMedia, setTabCreateNFTMedia] = useState<number>(0);
  const [pod, setPod] = useState<any>({
    Collabs: [],
    Name: '',
    Description: '',
    Hashtags: []
  });
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [acceptWarning, setAcceptWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const classes = createPodModalStyles({ acceptWarning });

  const { chainId } = useWeb3React();

  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  // default add creator as collaborator
  useEffect(() => {
    if (
      userSelector.address &&
      !pod.Collabs.find((u) => u.address == userSelector.address)
    )
      pod.Collabs.push({
        id: userSelector.id,
        address: userSelector.address,
        name: userSelector.firstName,
        imageUrl: userSelector.url,
        urlSlug: userSelector.urlSlug
      });
  }, [userSelector.address]);

  useEffect(() => {
    if (pod && pod.id && pod.HasPhoto) {
      setPhotoImg(`${pod.Url}?${Date.now()}`);
    }
  }, [pod.id, pod.HasPhoto]);

  const afterCreatePod = async (podRes) => {
    if (podRes.success) {
      const podId = podRes.podId;

      await updateTask(userSelector.id, 'Create a Capsule');
      props.handleRefresh();
      props.onClose();
      showAlertMessage(`Capsule created!`, { variant: 'success' });
    } else
      showAlertMessage(`Error when making the request`, { variant: 'error' });
  };

  const createPod = async () => {
    try {
      setIsLoading(true);
      const targetChain = BlockchainNets.find(
        (net) => net.value === BlockchainNets[1].value
      );
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0x89);
        if (!isHere) {
          showAlertMessage(
            'Got failed while switching over to target network',
            { variant: 'error' }
          );
          return;
        }
      }
      if (validateNFTMediaInfoCreate()) {
        const payload: any = {};
        payload.name = pod.Name;
        payload.description = pod.Description;
        payload.imageUrl = '';
        payload.hashtags = pod.Hashtags;
        payload.hasPhoto = !!(photo || photoImg);
        payload.collabs = (pod.Collabs ?? []).map((user) => ({
          userId: user.id,
          address: user.address
        }));
        payload.creatorAddress = userSelector.address;
        payload.creatorId = userSelector.id;
        payload.network = BlockchainNets[1].value;
        payload.podType = 'TRAX';

        let infoImage = await onUploadNonEncrypt(photo, (file) =>
          uploadWithNonEncryption(file)
        );

        payload.infoImage = infoImage;
        const initiatePodRes = await musicDAOInitiatePod(payload);
        await afterCreatePod(initiatePodRes);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      showAlertMessage(e.message, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const validateNFTMediaInfoCreate = () => {
    if (pod.Name.length < 5) {
      showAlertMessage(`Name field invalid. Minimum 5 characters required`, {
        variant: 'error'
      });
      return false;
    } else if (pod.Description.length <= 0) {
      showAlertMessage(`Description field invalid.`, { variant: 'error' });
      return false;
    } else return true;
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      style={{
        maxWidth: acceptWarning ? '755px' : '653px',
        padding: acceptWarning
          ? isMobile
            ? '32px 12px 50px'
            : '32px 39px 50px'
          : isMobile
          ? '20px 22px 63px'
          : '20px 48px 63px'
      }}
    >
      <div>
        {!acceptWarning ? (
          <div className={classes.warningScreen}>
            <img
              src={require('assets/musicDAOImages/pod-modal-logo.webp')}
              width="120px"
              alt={'music pod'}
            />
            <h3>Create a Capsule</h3>
            <p>
              Hello and welcome to Capsules 👋 !
              <br />A copyright, fundraising and revenue distribution tool on
              Web 3! In the first step, you are going to invite collaborators
              and set the basic details of your Capsule. You are free to create as
              many as you’d like!
            </p>
            {/* <div className={classes.warningContainer}>
              <WarningIcon />
            </div> */}
            <PrimaryButton size="medium" onClick={() => setAcceptWarning(true)}>
              Let's Begin
            </PrimaryButton>
            <p style={{ color: '#FF8E3C' }}>
              You will need MATIC (Polygon) to cover fees at later stages of the
              Capsule
            </p>
          </div>
        ) : (
          <div className={classes.modalContent}>
            <div className={classes.cardsOptions}>
              <div
                onClick={() => setTabCreateNFTMedia(0)}
                className={cls(
                  {
                    [classes.tabHeaderPodMediaSelected]: tabCreateNFTMedia === 0
                  },
                  classes.tabHeaderPodMedia
                )}
              >
                General
              </div>
              <div
                className={cls(
                  {
                    [classes.tabHeaderPodMediaSelected]: tabCreateNFTMedia === 1
                  },
                  classes.tabHeaderPodMedia
                )}
                onClick={() => setTabCreateNFTMedia(1)}
              >
                Collabs
              </div>
            </div>
            {pod && (
              <>
                <div
                  style={{
                    display: tabCreateNFTMedia === 0 ? 'block' : 'none'
                  }}
                >
                  <div className={classes.headerCreatePod}>
                    Create A Music Capsule
                  </div>
                  <GeneralNFTMediaTab
                    pod={pod}
                    setPod={(nv) => setPod(nv)}
                    setPhoto={(nv) => setPhoto(nv)}
                    photo={photo}
                    setPhotoImg={(nv) => setPhotoImg(nv)}
                    photoImg={photoImg}
                    creation={true}
                    isCreator={pod.Creator === userSelector.id}
                    next={() => setTabCreateNFTMedia(1)}
                  />
                </div>
                <div
                  style={{
                    display: tabCreateNFTMedia === 1 ? 'block' : 'none'
                  }}
                >
                  <div className={classes.headerCreatePod}>
                    Select artists to collab with
                  </div>
                  <CollabsTab pod={pod} setPod={(nv) => setPod(nv)} />
                </div>
                <Box
                  display="flex"
                  alignItems="center"
                  className={classes.buttons}
                >
                  <SecondaryButton
                    onClick={() => {
                      if (tabCreateNFTMedia !== 0) {
                        setTabCreateNFTMedia(tabCreateNFTMedia - 1);
                      } else {
                        props.onClose();
                      }
                    }}
                    size="medium"
                  >
                    {tabCreateNFTMedia !== 0 ? 'Back' : 'Cancel'}
                  </SecondaryButton>

                  {isLoading ? (
                    <CircularLoadingIndicator />
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <PrimaryButton
                        onClick={() => {
                          if (tabCreateNFTMedia !== 1) {
                            setTabCreateNFTMedia(tabCreateNFTMedia + 1);
                          } else {
                            createPod();
                          }
                        }}
                        size="medium"
                        style={{
                          // width: "40%",
                          color: '#FFFFFF',
                          background: '#2D3047',
                          width:
                            tabCreateNFTMedia === 0 || isMobile ? '40%' : 295
                        }}
                      >
                        {tabCreateNFTMedia === 1 ? 'Create' : 'Next'}
                      </PrimaryButton>
                    </div>
                  )}
                </Box>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CreatePodModal;

const WarningIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.4556 16.7688L11.2243 1.69656C11.1043 1.48093 10.9365 1.28875 10.72 1.16875C10.5043 1.04875 10.2643 0.976562 10.0243 0.976562C9.78434 0.976562 9.54434 1.04875 9.32873 1.16875C9.11311 1.28875 8.94434 1.48094 8.82434 1.69656L0.592103 16.7688C0.352103 17.2244 0.352103 17.681 0.616477 18.1132C0.736477 18.3288 0.904285 18.641 1.12086 18.761C1.33649 18.881 1.55305 19.0966 1.79305 19.0966H18.2575C18.4975 19.0966 18.7375 18.881 18.9297 18.761C19.1453 18.641 19.3141 18.401 19.4341 18.1854C19.6957 17.7532 19.6957 17.2254 19.4557 16.7688L19.4556 16.7688ZM8.5601 7.79328C8.5601 7.04889 9.13572 6.44889 9.8801 6.44889C10.6245 6.44889 11.2001 7.04889 11.2001 7.79328V11.8255C11.2001 12.5699 10.6245 13.1699 9.8801 13.1699C9.13572 13.169 8.5601 12.569 8.5601 11.8255V7.79328ZM10.0479 16.5768C9.30353 16.5768 8.70353 15.9768 8.70353 15.2324C8.70353 14.488 9.30353 13.888 10.0479 13.888C10.7923 13.888 11.3923 14.488 11.3923 15.2324C11.3923 15.9768 10.7923 16.5768 10.0479 16.5768Z"
      fill="#FF8E3C"
    />
  </svg>
);
