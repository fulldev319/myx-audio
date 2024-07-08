import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import {
  Modal,
  PrimaryButton,
  SecondaryButton,
  ContentType,
  Gradient
} from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import CollabsTab from './components/CollabsTab';
import GeneralNFTMediaTab from './components/GeneralNFTMediaTab';
import { createPodModalStyles } from './index.styles';
import FundingTab from './components/FundingTab';
import MultipleTab from './components/MultipleTab';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { RootState } from 'store/reducers/Reducer';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { BlockchainNets } from 'shared/constants/constants';
import { useWeb3React } from '@web3-react/core';
import { onUploadNonEncrypt } from 'shared/ipfs/upload';
import { musicDAOInitiatePod } from 'shared/services/API';
import { switchNetwork } from 'shared/functions/metamask';

const TabsInvestment = [
  {
    step: 'step 1',
    title: 'Select Collaborators',
    marker: 'Collaborators'
  },
  {
    step: 'step 2',
    title: 'Funding Details ',
    marker: 'Funding'
  },
  {
    step: 'step 3',
    title: 'Music Details ',
    marker: 'Music'
  },
  {
    step: 'step 4',
    title: 'Capsule  Details',
    marker: 'Capsule Details'
  }
];
const TabsCollab = [
  {
    step: 'step 1',
    title: 'Select Collaborators',
    marker: 'Collaborators'
  },
  {
    step: 'step 2',
    title: 'Music Details ',
    marker: 'Music'
  },
  {
    step: 'step 3',
    title: 'Capsule  Details',
    marker: 'Capsule Details'
  }
];

const CreateNewPodModal = (props: any) => {
  const classes = createPodModalStyles();
  const history = useHistory();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const { chainId } = useWeb3React();
  const { setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const userSelector = useSelector((state: RootState) => state.user);
  const { showAlertMessage } = useAlertMessage();

  const [complete, setComplete] = React.useState<Array<boolean | undefined>>([
    undefined,
    undefined,
    undefined,
    undefined
  ]);
  const [page, setPage] = React.useState<number>(0);

  const [pod, setPod] = React.useState<any>({
    Collabs: [],
    Name: '',
    Description: '',
    Hashtags: [],
    Token: 'USDT',
    WithFunding: true
  });
  const [photo, setPhoto] = React.useState<any>(null);
  const [photoImg, setPhotoImg] = React.useState<any>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [createResult, setCreateResult] = React.useState<boolean | null>(null);
  const [acceptWarning, setAcceptWarning] = React.useState(false);
  const [podType, setPodType] = React.useState<ContentType>(props.type); // investment, collaborative
  const Tabs = React.useMemo(() => {
    return podType === ContentType.PodInvestment ? TabsInvestment : TabsCollab;
  }, [podType]);

  const [podId, setPodId] = React.useState<string>();

  React.useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);
  React.useEffect(() => {
    setPod((prev) => ({
      ...prev,
      WithFunding: podType === ContentType.PodInvestment,
      IsTokenAddLater: podType === ContentType.PodCollaborative
    }));
  }, [podType]);

  // default add creator as collaborator
  React.useEffect(() => {
    if (
      userSelector.address &&
      !pod.Collabs.find((u) => u.address == userSelector.address)
    )
      pod.Collabs = [
        ...pod.Collabs,
        {
          id: userSelector.id,
          address: userSelector.address,
          name: `${userSelector.firstName ?? ''} ${
            userSelector.lastName ?? ''
          }`,
          imageUrl: userSelector.urlIpfsImage,
          urlSlug: userSelector.urlSlug
        }
      ];
  }, [pod.IsJustForMe, pod.IsCollabAddLater, userSelector.address]);

  React.useEffect(() => {
    if (pod.IsTokenAddLater) {
      setPod((prev) => ({ ...prev, RaiseValue: undefined }));
    }
  }, [pod.IsTokenAddLater]);

  React.useEffect(() => {
    if (page === 0) {
      let isComplete: boolean;
      if (
        pod.IsJustForMe ||
        (pod.Collabs.length > 1 &&
          pod.Collabs.every((collab) => !!collab.imageUrl)) ||
        pod.IsCollabAddLater
      ) {
        isComplete = true;
      } else {
        isComplete = false;
      }
      setComplete((prev) => {
        const temp = [...prev];
        temp[0] = isComplete;
        return temp;
      });
    } else if (
      page === 1 &&
      ((pod.WithFunding && pod.IsTokenAddLater !== undefined) ||
        !pod.WithFunding)
    ) {
      let isComplete: boolean;
      if (pod.RaiseValue || pod.IsTokenAddLater || !pod.WithFunding) {
        isComplete = true;
      } else {
        isComplete = false;
      }
      setComplete((prev) => {
        const temp = [...prev];
        temp[1] = isComplete;
        return temp;
      });
    } else if (page === 2) {
      setComplete((prev) => {
        const temp = [...prev];
        temp[2] = true;
        return temp;
      });
    } else if (page === 3) {
      if (
        pod.Name &&
        pod.Description &&
        photo &&
        pod.Hashtags &&
        pod.Hashtags.length &&
        pod.Symbol
      ) {
        setComplete((prev) => {
          const temp = [...prev];
          temp[3] = true;
          return temp;
        });
      }
    }
  }, [pod, page]);

  React.useEffect(() => {
    if (pod && pod.id && pod.HasPhoto) {
      setPhotoImg(`${pod.Url}?${Date.now()}`);
    }
  }, [pod.id, pod.HasPhoto]);

  const afterCreatePod = async (podRes) => {
    if (podRes.success) {
      props.handleRefresh();
      setCreateResult(true);
      setPodId(podRes.podId);
    } else setCreateResult(false);
  };

  const createPod = async () => {
    try {
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
        setIsCreating(true);

        const payload: any = {};
        payload.name = pod.Name;
        payload.symbol = pod.Symbol;
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
        payload.withFunding = pod.WithFunding;
        if (pod.RaiseValue && pod.WithFunding) {
          payload.raiseValue = Number(pod.RaiseValue);
          payload.fundingToken = pod.Token;
        }
        payload.isSingle = pod.IsSingle || false;
        payload.podType = 'TRAX';
        payload.isJustForMe = pod.IsJustForMe === true ? true : false;

        let infoImage = await onUploadNonEncrypt(photo, (file) =>
          uploadWithNonEncryption(file, false)
        );

        payload.infoImage = infoImage;

        const initiatePodRes = await musicDAOInitiatePod(payload);
        await afterCreatePod(initiatePodRes);
      }
    } catch (e) {
      showAlertMessage(e.message, { variant: 'error' });
      setCreateResult(false);
    }
  };

  const validateNFTMediaInfoCreate = () => {
    if (!complete[0]) {
      showAlertMessage('Collabs are required', { variant: 'error' });
      return;
    }

    if (!complete[1]) {
      showAlertMessage('Raise Amount is required', { variant: 'error' });
      return;
    }

    if (!complete[2]) {
      showAlertMessage('Track count is required', { variant: 'error' });
      return;
    }

    if (!pod.Name) {
      showAlertMessage(`Capsule Name is required.`, { variant: 'error' });
      return false;
    } else if (pod.Name.length < 5) {
      showAlertMessage(`Name field invalid. Minimum 5 characters required.`, {
        variant: 'error'
      });
      return false;
    } else if (!pod.Symbol) {
      showAlertMessage(`Symbol is required.`, {
        variant: 'error'
      });
      return false;
    } else if (!pod.Description) {
      showAlertMessage(`Description is required.`, { variant: 'error' });
      return false;
    } else if (pod.Description.length <= 0) {
      showAlertMessage(`Description field invalid.`, { variant: 'error' });
      return false;
    } else if (!photo) {
      showAlertMessage(`Capsule image is required.`, { variant: 'error' });
      return false;
    } else if (!pod.Hashtags || !pod.Hashtags.length) {
      showAlertMessage(`Hashtag is required.`, { variant: 'error' });
      return false;
    } else return true;
  };

  const handlePage = (index: number) => {
    const newComplete = [...complete];
    setPage((prev) => {
      if (index > prev) {
        if (index > 0) {
          if (
            pod.IsJustForMe ||
            (pod.Collabs.length > 1 &&
              pod.Collabs.every((collab) => !!collab.imageUrl)) ||
            pod.IsCollabAddLater
          ) {
            newComplete[0] = true;
            setComplete(newComplete);
          } else {
            newComplete[0] = false;
            setComplete(newComplete);
          }
        }

        if (index > 1) {
          if (pod.RaiseValue || pod.IsTokenAddLater || !pod.WithFunding) {
            newComplete[1] = true;
            setComplete(newComplete);
          } else {
            newComplete[1] = false;
            setComplete(newComplete);
          }
        }

        if (index > 2 && !newComplete[2]) {
          newComplete[2] = true;
          setComplete(newComplete);
        }
      } else if (prev === 3) {
        if (
          pod.Name &&
          pod.Description &&
          photo &&
          pod.Hashtags &&
          pod.Hashtags.length
        ) {
          newComplete[3] = true;
          setComplete(newComplete);
        } else {
          newComplete[3] = false;
          setComplete(newComplete);
        }
      }
      return index;
    });
  };

  const handleResultBtn = () => {
    if (createResult === true) {
      history.push(`/capsules/${podId}`);
      props.onClose();
    } else if (createResult === false) {
      setIsCreating(false);
      setCreateResult(null);
    }
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      fullScreen={true}
      style={{
        // maxWidth: acceptWarning ? "755px" : "653px",
        padding: 0,
        maxWidth: '100vw',
        maxHeight: '100vh',
        width: '100vw',
        height: '100vh',
        borderRadius: 0
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Box className={classes.titleBar}>
          <div style={{ width: 150 }}>Create Capsule</div>
          {!isMobile && acceptWarning && (
            <Box width="470px">
              <div className={classes.stepsBorder} />
              <div className={classes.steps}>
                {Tabs.map((tab, index) => (
                  <div
                    className={index <= page ? classes.selected : undefined}
                    key={`tab-${index}`}
                  >
                    <button onClick={() => handlePage(index)}>
                      <div>{index + 1}</div>
                    </button>
                    {complete[index] !== undefined && (
                      <div className={classes.complete}>
                        {complete[index] ? (
                          <svg
                            width="12"
                            height="9"
                            viewBox="0 0 12 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.0001 1L4.00004 8.00002L1 5"
                              stroke="#0D59EE"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15 1L1 15M1.00001 1L15 15"
                              stroke="#F43E5F"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    )}
                    <span>{tab.marker}</span>
                  </div>
                ))}
              </div>
            </Box>
          )}
          <div style={{ width: 150 }} />
        </Box>
        {!acceptWarning ? (
          <div className={classes.workSpace} style={{ height: 'auto' }}>
            {podType === ContentType.PodInvestment ? (
              <div className={classes.warningScreenInvest}>
                <Box mb={6}>
                  <h3 className={classes.title}>Create Investment Capsule</h3>
                  <Box display={'flex'} alignItems={'center'}>
                    <Box className={classes.proposalTypeItem}>
                      <img
                        src={require('assets/musicDAOImages/pod_proposal_music_icon.webp')}
                        style={{ width: 140, marginLeft: -20, marginTop: -11 }}
                        alt={'music pod'}
                      />
                    </Box>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      ml={isMobile ? 1.5 : 3}
                      flex={1}
                    >
                      <Box className={classes.introTypo1}>Music:</Box>
                      <Box className={classes.introTypo2}>
                        Add the music details
                      </Box>
                    </Box>
                  </Box>
                  <Box display={'flex'} alignItems={'center'} my={4}>
                    <Box className={classes.proposalTypeItem}>
                      <img
                        src={require('assets/musicDAOImages/pod_proposal_token_icon.webp')}
                        style={{ width: 200, marginLeft: -34, marginTop: -18 }}
                        alt={'music pod'}
                      />
                    </Box>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      ml={isMobile ? 1.5 : 3}
                      flex={1}
                    >
                      <Box className={classes.introTypo1}>Tokenomics:</Box>
                      <Box className={classes.introTypo2}>
                        Customize media fractions and fundraise details
                      </Box>
                    </Box>
                  </Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Box className={classes.proposalTypeItem}>
                      <img
                        src={require('assets/musicDAOImages/pod_proposal_distribution_icon.webp')}
                        style={{ width: 88, marginLeft: 19, marginTop: 14 }}
                        alt={'music pod'}
                      />
                    </Box>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      ml={isMobile ? 1.5 : 3}
                      flex={1}
                    >
                      <Box className={classes.introTypo1}>Distribution:</Box>
                      <Box className={classes.introTypo2}>
                        Select what % each collaborator and investors receive
                      </Box>
                    </Box>
                  </Box>{' '}
                </Box>
                <PrimaryButton
                  size="medium"
                  onClick={() => setAcceptWarning(true)}
                  style={{ background: Gradient.Blue }}
                >
                  Let's Begin
                </PrimaryButton>
              </div>
            ) : (
              <div className={classes.warningScreenCollab}>
                <Box mb={6}>
                  <img
                    src={require('assets/musicDAOImages/invest.webp')}
                    width="120px"
                    alt={'music pod'}
                  />
                  <Box mt={3} mb={6}>
                    <h3 className={classes.title}>Create</h3>
                    <h3
                      className={`${classes.title} ${classes.collabGradient}`}
                    >
                      Collaborative Capsule
                    </h3>
                  </Box>
                  <Box className={classes.tipSection}>
                    <img
                      src={require('assets/musicDAOImages/pod-modal-handshake.webp')}
                      width="120px"
                      alt={'music pod'}
                    />
                    <Box>
                      <h4>
                        <b>Perfect tool for collaboration.</b>
                      </h4>
                      <p className={classes.typo1}>
                        Not the only owner of your music? Need to share revenue
                        with collaborators? Capsules can help you with that,
                        too.
                      </p>
                    </Box>
                  </Box>
                </Box>
                <PrimaryButton
                  size="medium"
                  onClick={() => setAcceptWarning(true)}
                  style={{ background: Gradient.Blue }}
                >
                  Let's Begin
                </PrimaryButton>
              </div>
            )}
          </div>
        ) : isCreating ? (
          <Box className={classes.resultSection}>
            <Box
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center'
              }}
              mb={5}
            >
              {createResult === true ? (
                <img
                  className={photoImg ? classes.imgSuccess : ''}
                  src={
                    photoImg ??
                    require('assets/musicDAOImages/result_success.webp')
                  }
                />
              ) : createResult === false ? (
                <img src={require('assets/musicDAOImages/result_fail.webp')} />
              ) : (
                <div style={{ position: 'relative' }}>
                  <img
                    className={classes.loader}
                    src={require('assets/musicDAOImages/loading.webp')}
                  />
                </div>
              )}
            </Box>
            <Box className={classes.title} mb={1.5}>
              {createResult === true
                ? 'Creation successful'
                : createResult === false
                ? 'Creation failed'
                : 'Capsule Creation in Progress'}
            </Box>
            <Box className={classes.resultDescription} mb={4}>
              {createResult === true
                ? 'Your pod has been created!'
                : createResult === false
                ? 'Capsule creation is failed!'
                : `Capsule creation is proceeding on MYX. \n This can take a moment, please be patient...`}
            </Box>
            {createResult !== null && (
              <>
                <PrimaryButton
                  size="medium"
                  className={classes.checkButton}
                  onClick={handleResultBtn}
                >
                  {createResult === true ? 'Go To See Capsule Detail' : 'Back'}
                </PrimaryButton>
                {/* {createResult === true && podId && (
                  <ShareNFTBox
                    shareLink={`${window.location.origin}/#/capsules/${podId}`}
                  />
                )} */}
              </>
            )}
          </Box>
        ) : (
          <>
            <div className={classes.workSpace}>
              <div className={classes.modalContent}>
                {isMobile && (
                  <Box width={1} mb={5}>
                    <div className={classes.stepsBorder} />
                    <div className={classes.steps}>
                      {Tabs.map((tab, index) => (
                        <div
                          className={
                            index <= page ? classes.selected : undefined
                          }
                          key={`tab-${index}`}
                        >
                          <button onClick={() => handlePage(index)}>
                            <div>{index + 1}</div>
                          </button>
                          {complete[index] !== undefined && (
                            <div className={classes.complete}>
                              {complete[index] ? (
                                <svg
                                  width="12"
                                  height="9"
                                  viewBox="0 0 12 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.0001 1L4.00004 8.00002L1 5"
                                    stroke="#0D59EE"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M15 1L1 15M1.00001 1L15 15"
                                    stroke="#F43E5F"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                          )}
                          <span>{tab.marker}</span>
                        </div>
                      ))}
                    </div>
                  </Box>
                )}
                <Box className={classes.stepText}>
                  <h5>{Tabs[page].step}</h5>
                  <h3>{Tabs[page].title}</h3>
                </Box>
                {pod && (
                  <>
                    {Tabs[page].marker === 'Collaborators' && (
                      <CollabsTab pod={pod} setPod={setPod} podType={podType} />
                    )}
                    {Tabs[page].marker === 'Funding' && (
                      <FundingTab pod={pod} setPod={setPod} />
                    )}
                    {Tabs[page].marker === 'Music' && (
                      <MultipleTab pod={pod} setPod={setPod} />
                    )}
                    {Tabs[page].marker === 'Capsule Details' && (
                      <GeneralNFTMediaTab
                        pod={pod}
                        setPod={setPod}
                        setPhoto={(nv) => setPhoto(nv)}
                        photo={photo}
                        setPhotoImg={(nv) => setPhotoImg(nv)}
                        photoImg={photoImg}
                        creation={true}
                        isCreator={pod.Creator === userSelector.id}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
            <Box className={classes.footerBar}>
              <Box className={classes.buttons}>
                <SecondaryButton
                  size="medium"
                  onClick={() => {
                    if (page !== 0) {
                      handlePage(page - 1);
                    } else {
                      props.onClose();
                    }
                  }}
                >
                  {page !== 0 ? 'Back' : 'Cancel'}
                </SecondaryButton>

                {/* {isLoading ? (
                  <CircularLoadingIndicator />
                ) : ( */}
                <PrimaryButton
                  size="medium"
                  style={{
                    color: '#FFFFFF',
                    background:
                      page === Tabs.length - 1 ? Gradient.Blue : '#2D3047'
                  }}
                  onClick={() => {
                    if (page === 0) {
                      if (!pod.Collabs.every((collab) => !!collab.imageUrl)) {
                        showAlertMessage(
                          'Artist, who can create pods or can be added on pods must have profile photo.',
                          {
                            variant: 'error'
                          }
                        );
                        return;
                      }
                    }
                    if (page !== Tabs.length - 1) {
                      handlePage(page + 1);
                    } else {
                      createPod();
                    }
                  }}
                >
                  {page === Tabs.length - 1 ? 'Create Capsule' : 'Next'}
                </PrimaryButton>
                {/* )} */}
              </Box>
            </Box>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CreateNewPodModal;
