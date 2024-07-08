import React, { useImperativeHandle, useState, useEffect } from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
import AddedSongs from './components/AddedSongs';
import Intro from './components/Intro';
import Box from 'shared/ui-kit/Box';
import {
  Modal,
  ContentType,
  Color,
  PrimaryButton,
  SecondaryButton,
  Gradient
} from 'shared/ui-kit';
import {
  getURLfromCID,
  uploadNFTMetaData
} from 'shared/functions/ipfs/upload2IPFS';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { BlockchainNets, Mood, MusicGenres } from 'shared/constants/constants';
import {
  getCryptosRateAsList,
  musicDaoCheckPodProposalCreation
} from 'shared/services/API';
import { switchNetwork } from 'shared/functions/metamask';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { createCollaborativeProposalModalStyle } from './index.styles';
import TokenomicsTab from './components/TokenomicsTab';
import DistributionTab from './components/DistributionTab';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';
import { toNDecimals } from 'shared/functions/web3';
import config from 'shared/connectors/web3/config';
import { sleep } from 'shared/helpers/utils';

const Tabs = [
  {
    step: 'step 1',
    title: 'Music',
    marker: 'Music'
  },
  {
    step: 'step 2',
    title: 'Tokenomics',
    marker: 'Tokenomics'
  },
  {
    step: 'step 3',
    title: 'Distribution',
    marker: 'Distribution'
  }
];

interface media {
  isStreaming: boolean;
  pricePerEdition: number[];
  quantityPerEdition: number[];
  tokenURIPerEdition: string[];
  percentagePerEdition: number[];
}
interface royalty {
  royaltyPercent: number;
  royaltyRecipient: string;
  proofOfAuthenticity: string;
}
interface Media {
  media: media;
  royalty: royalty;
}

const CreateProposalModal = React.forwardRef((props: any, ref: any) => {
  const { onAddSong, open, onClose, type, pod, setPod, onEditSong } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = createCollaborativeProposalModalStyle();
  const userSelector = useTypedSelector(getUser);
  const { setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const { showAlertMessage } = useAlertMessage();
  const history = useHistory();

  const [page, setPage] = useState(-1);
  const [songs, setSongs] = useState<any[]>([]);
  const [podId, setPodId] = React.useState<string>();

  const [tokenObjList, setTokenObjList] = useState<any[]>([]);
  const [pageValidations, setPageValidations] = useState<boolean[]>([]);

  // const [pod, setPod] = React.useState<any>({
  //   Collabs: [],
  //   Name: '',
  //   Description: '',
  //   Hashtags: [],
  //   Token: 'USDT',
  //   WithFunding: true
  // });
  const [photo, setPhoto] = React.useState<any>(null);
  const [photoImg, setPhotoImg] = React.useState<any>(null);

  const [isCreating, setIsCreating] = React.useState(false);
  const [createResult, setCreateResult] = React.useState<boolean | null>(null);

  const { account, library, chainId } = useWeb3React();
  const [hash, setHash] = useState<string>('');
  const { maxPrioFee } = useMaxPrioFee();
  const [txModalOpen, setTxModalOpen] = useState<boolean | null>(null);

  // get token list from backend
  useEffect(() => {
    if (tokenObjList.length === 0 && props.open) {
      getCryptosRateAsList().then((data) => {
        const tknObjList: any[] = [];
        data.forEach((rateObj) => {
          tknObjList.push({ token: rateObj.token, name: rateObj.name });
        });
        setTokenObjList(tknObjList.filter((item) => item.token === 'USDT'));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  useEffect(() => {
    validatePage();
  }, [songs, pod]);

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  useImperativeHandle(ref, () => ({
    updatePage(s) {
      setPage(s);
    },
    updateSongs(newSong) {
      setSongs((prev) => [...prev, newSong]);
    }
  }));

  const onRemove = (index) => {
    setSongs((prev) => {
      const newSongs = [...prev];
      newSongs.splice(index, 1);
      return newSongs;
    });
  };

  const onEdit = (index) => {
    onEditSong();
  };

  const validatePage = () => {
    let validationStatus =
      type === pod.WithFunding ? [false, false, false] : [false, false];
    songs.length > 0
      ? (validationStatus[0] = true)
      : (validationStatus[0] = false);
    if (pod) {
      let total = 0;
      let collabs = pod.Collabs;
      collabs.forEach((item: any) => {
        total += Number(item.sharingPercent) * 1;
      });
      pod.WithFunding
        ? (validationStatus[2] = total === 100 ? true : false)
        : (validationStatus[1] = total === 100 ? true : false);
    } else {
      pod.WithFunding
        ? (validationStatus[2] = false)
        : (validationStatus[1] = false);
    }
    setPageValidations(validationStatus);
  };

  const getPodTokenURI = async (payload: any) => {
    let metaData: any = {};
    if (payload?.infoImage) {
      const metadataPhoto = payload?.infoImage;
      let tradeType = '1/1';
      if (
        !songs.every(
          (item) =>
            item.editionType === 'Regular' &&
            Number(item.editionAmounts[0]) === 1
        )
      )
        tradeType = 'Multiple Edition';
      metaData = {
        name: payload.name,
        description: payload.description,
        external_url: `${window.location.href}`,
        image: `${getURLfromCID(metadataPhoto.newFileCID)}/${
          metadataPhoto.metadata.properties.name
        }`,
        podProposedId: pod.Id,
        tokenName: payload.tokenName,
        tokenSymbol: payload.tokenSymbol,
        attributes: [
          {
            trait_type: 'Collabs',
            value: payload.collabs
          },
          {
            trait_type: 'Hashtags',
            value: payload.hashtags
          },
          {
            trait_type: 'Creator',
            value: payload.creatorAddress
          },
          {
            trait_type: 'CreatorId',
            value: payload.creatorId
          },
          {
            trait_type: 'Network',
            value: payload.network
          },
          {
            trait_type: 'WithFunding',
            value: false
          },
          {
            display_type: 'date',
            trait_type: 'Release Date',
            value: Math.floor(Date.now() / 1000)
          },
          {
            trait_type: 'Capsule Type',
            value: tradeType
          }
        ]
      };
    }
    return (await uploadNFTMetaData(metaData))?.uri;
  };

  const getTokenURI = async (
    songData: any,
    metadataPhoto: any,
    editionType,
    editionAmount,
    editionShare
  ) => {
    let collabs = [pod.Collabs.find((item) => item.userId === userSelector.id)];

    pod.Collabs.forEach((item) => {
      if (item.userId !== userSelector.id) {
        collabs.push(item);
      }
    });
    let metaData: any = {};
    if (songData && songData.metadataMedia) {
      metaData = {
        name: songData.Title,
        symbol: songData.Title,
        description: songData.Description,
        external_url: `${window.location.href}`,
        animation_url: songData.metadataMedia?.metadata?.animation_url,
        image: metadataPhoto
          ? `${getURLfromCID(metadataPhoto.newFileCID)}/${
              metadataPhoto.metadata.properties.name
            }`
          : '',
        attributes: [
          {
            trait_type: 'Artists',
            value: songData.artist
          },
          {
            trait_type: 'Genre',
            value: songData.Genre
          },
          {
            trait_type: 'Mood',
            value: songData.Mood
          },
          {
            trait_type: 'creatorId',
            value: userSelector.id
          },
          {
            trait_type: 'genreId',
            value: (MusicGenres.indexOf(songData.Genre) + 1)
              .toString()
              .padStart(2, '0')
          },
          {
            trait_type: 'moodId',
            value: (Mood.indexOf(songData.Mood) + 1).toString().padStart(2, '0')
          },
          {
            trait_type: 'Label',
            value: songData.Label
          },
          {
            trait_type: 'streamingShare',
            value: songData.streamingShare
          },
          {
            display_type: 'boost_percentage',
            trait_type: 'Royalty Share',
            value: +songData.Royalty
          },
          {
            display_type: 'date',
            trait_type: 'Release Date',
            value: Date.now()
          },
          {
            trait_type: 'CID of Playlist',
            value: songData.metadataMedia.newFileCID
          },
          {
            trait_type: 'CID of Chunks',
            value: songData.chunks
          },
          {
            trait_type: 'Type',
            value: songData.type
          },
          {
            trait_type: 'metadataPhoto',
            value: songData.metadataPhoto
          },
          {
            trait_type: 'metadataMedia',
            value: songData.metadataMedia
          },
          {
            trait_type: 'Capsule Type',
            value:
              songData.editionType == 'Regular' &&
              Number(songData.editionAmounts[0]) === 1
                ? '1/1'
                : 'Multiple Edition'
          }
        ]
      };
    }

    if (editionType) {
      metaData.attributes = [
        ...metaData.attributes,
        {
          trait_type: 'Edition',
          value: editionType
        },
        {
          trait_type: 'EditionNumber',
          value: editionAmount
        },
        {
          trait_type: 'EditionShare',
          value: editionShare
        }
      ];
    }
    return (await uploadNFTMetaData(metaData))?.uri;
  };

  const getMedias = async (decimals) => {
    const web3 = new Web3(library.provider);
    let MediaWithRoyalty: Media[] = [];
    console.log('songs', songs);
    await Promise.all(
      songs.map(async (song) => {
        // await songs.forEach(async (song) => {
        let pricePerEditions: any[] = [];
        let quantityPerEditions: any[] = [];
        let songImageMetadata = song.metadataPhoto.newFileCID;
        let tokenURIPerEdition: any[] = [];
        let percentagePerEdition: any[] = [];
        let prices = song.editionPrices;
        let quantities = song.editionAmounts;
        let uris = song.metadataEditions;
        let percentages = song.streamingRevenueShares;
        let songTokenURI: any = '';
        if (song.editionType === 'Premium') {
          prices.forEach((price) => {
            pricePerEditions.push(toNDecimals(price, decimals));
          });
          quantities.forEach((quantity) => {
            quantityPerEditions.push(quantity);
          });
          await Promise.all(
            uris.map(async (uri, index) => {
              let editionType = '';
              switch (index) {
                case 0:
                  editionType = 'Bronze';
                  break;
                case 1:
                  editionType = 'Silver';
                  break;
                case 2:
                  editionType = 'Gold';
                  break;
                case 3:
                  editionType = 'Platinum';
                  break;
              }
              if (song.editionAmounts[index] === 0)
                tokenURIPerEdition[index] = '';
              else
                tokenURIPerEdition[index] = await getTokenURI(
                  song,
                  uri.newFileCID ? uri : song.metadataPhoto,
                  editionType,
                  song.editionAmounts[index],
                  song.streamingRevenueShares[index]
                );
            })
          );
          songTokenURI = await getTokenURI(song, song.metadataPhoto, '', 0, 0);
          percentages.forEach((percentage) => {
            percentagePerEdition.push(percentage * 100);
          });
        } else {
          // regular type
          pricePerEditions.push(toNDecimals(prices[0], decimals));
          quantityPerEditions.push(quantities[0]);
          tokenURIPerEdition.push(
            await getTokenURI(
              song,
              song.metadataPhoto,
              'Regular',
              song.editionAmounts[0],
              song.streamingRevenueShares[0]
            )
          );
          songTokenURI = await getTokenURI(song, song.metadataPhoto, '', 0, 0);
          percentagePerEdition.push(100 * 100);
        }
        let Media = {
          media: {
            isStreaming: song.isMakeStreaming,
            masterNFTTokenURI: songTokenURI,
            pricePerEdition: pricePerEditions.map((price) => Number(price)),
            quantityPerEdition: quantityPerEditions.map((quantity) =>
              Number(quantity)
            ),
            tokenURIPerEdition: tokenURIPerEdition,
            percentagePerEdition: percentagePerEdition
          },
          royalty: {
            royaltyPercent: song.royaltyShare * 100,
            royaltyRecipient: userSelector.address,
            proofOfAuthenticity: ''
          }
        };
        MediaWithRoyalty.push(Media);
      })
    );
    return MediaWithRoyalty;
  };

  const createPodProposal = React.useCallback(() => {
    (async () => {
      if (validateNFTMediaInfoCreate()) {
        setIsCreating(true);
        // Fix collab array
        let collabs = [
          pod.Collabs.find((item) => item.userId === userSelector.id)
        ];

        pod.Collabs.forEach((item) => {
          if (item.userId !== userSelector.id) {
            collabs.push(item);
          }
        });
        let artistIds: any[] = [];
        collabs.forEach((item: any) => {
          artistIds.push(item?.artistId);
        });
        let sharingPercentages: any[] = [];
        collabs.forEach((item: any) => {
          sharingPercentages.push(item?.sharingPercent * 100);
        });
        const payload: any = {};
        payload.name = pod.Name;
        payload.description = pod.Description;
        payload.imageUrl = '';
        payload.hashtags = pod.Hashtags;
        payload.collabs = collabs;
        payload.creatorAddress = userSelector.address;
        payload.creatorId = userSelector.id;
        payload.network = pod.blockchainNetwork;
        payload.tokenName = pod.TokenName;
        payload.tokenSymbol = pod.TokenSymbol;
        payload.infoImage = pod.InfoImage;
        payload.tracks = songs.map((song) => ({
          ...song,
          genreId: (MusicGenres.indexOf(song.Genre) + 1)
            .toString()
            .padStart(2, '0'),
          moodId: (Mood.indexOf(song.Mood) + 1).toString().padStart(2, '0'),
          draft: true,
          isPublic: true,
          ownerAddress: userSelector.address,
          hash: '',
          isPod: true
        }));
        const targetChain = BlockchainNets.find(
          (net) => net.value === pod.blockchainNetwork
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

        const web3APIHandler = targetChain.apiHandler;
        const web3 = new Web3(library.provider);

        const metadataURI = await getPodTokenURI(payload);
        const fundingToken = config['Polygon'].TOKEN_ADDRESSES.USDT;
        const decimals = await web3APIHandler.Erc20['USDT'].decimals(web3);
        const PodDefinition = {
          podName: pod.Name,
          podSymbol: pod.Name.replace(/\s/g, ''),
          owners: artistIds,
          copyrightAllocations: sharingPercentages,
          royaltyPercentage: pod.Royalty ?? 0,
          copyrightTokenSupply:
            pod.WithFunding && pod.InvestorShare
              ? (+pod.FundingTarget / Number(pod.InvestorShare)) * 100
              : 10000,
          fundingToken: fundingToken,
          metadataURI
        };
        let MediaWithRoyalty: Media[] = await getMedias(decimals);
        web3APIHandler.PodManagerV2.registerPodProposal(
          web3,
          account!,
          {
            PodDefinition,
            MediaWithRoyalty
          },
          setTxModalOpen,
          setHash,
          maxPrioFee
        ).then(async (resp) => {
          if (resp) {
            while (1) {
              const res = await musicDaoCheckPodProposalCreation(
                pod.Id,
                metadataURI
              );
              if (res?.success) {
                setIsCreating(false);
                showAlertMessage('Created proposal successfully.', {
                  variant: 'success'
                });
                props.handleRefresh();
                props.onClose();
                return;
              }
              await sleep(5000);
            }
          } else {
            setIsCreating(false);
            showAlertMessage(
              'Failed to create new distribution proposal. Please try again.',
              {
                variant: 'error'
              }
            );
          }
        });
      }
    })();
  }, [pod, chainId, library, userSelector, pageValidations]);

  const validateNFTMediaInfoCreate = () => {
    if (pageValidations.length === 0 || pageValidations.some((p) => !p)) {
      showAlertMessage(`Please check if all sub tab is validated.`, {
        variant: 'error'
      });
      return false;
    }
    if (!pod.Name) {
      showAlertMessage(`Capsule Name is required.`, { variant: 'error' });
      return false;
    } else if (pod.Name.length < 5) {
      showAlertMessage(`Name field invalid. Minimum 5 characters required.`, {
        variant: 'error'
      });
      return false;
    } else if (!pod.Description) {
      showAlertMessage(`Description is required.`, { variant: 'error' });
      return false;
    } else if (pod.Description.length <= 0) {
      showAlertMessage(`Description field invalid.`, { variant: 'error' });
      return false;
      // } else if (!photo) {
      //   showAlertMessage(`Capsule image is required.`, { variant: 'error' });
      //   return false;
    } else if (!pod.Hashtags || !pod.Hashtags.length) {
      showAlertMessage(`Hashtag is required.`, { variant: 'error' });
      return false;
    } else return true;
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
    <>
      <Modal
        size="medium"
        isOpen={open}
        onClose={onClose}
        showCloseIcon
        fullScreen
        style={{
          padding: 0,
          maxWidth: '100vw',
          maxHeight: '100vh',
          width: '100vw',
          height: '100vh',
          borderRadius: 0
        }}
        // ref={ref}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Box className={classes.titleBar}>
            <div
              style={
                isMobile
                  ? {}
                  : {
                      width: 300
                    }
              }
            >
              Create Capsule Proposal
            </div>
            {!isMobile && page >= 0 && (
              <Box width={'320px'}>
                <div className={classes.stepsBorder} />
                <div className={classes.steps}>
                  {Tabs.filter(
                    (tab) => pod.WithFunding || tab.title !== 'Tokenomics'
                  ).map((tab, index) => (
                    <div
                      className={index <= page ? classes.selected : undefined}
                      key={`tab-${index}`}
                      style={{ position: 'relative' }}
                    >
                      {index <= page &&
                        (pageValidations[index] ? (
                          <div className={classes.tickSuccess}>
                            <SuccessIcon />
                          </div>
                        ) : (
                          <div className={classes.tickFail}>
                            <FailIcon />
                          </div>
                        ))}
                      <button
                        onClick={() => {
                          setPage(index);
                        }}
                      >
                        <div>{index + 1}</div>
                      </button>
                      <span>{tab.marker}</span>
                    </div>
                  ))}
                </div>
              </Box>
            )}
            <Box width="300px" />
          </Box>
          {isMobile && page >= 0 && (
            <Box mx={5} mt={2}>
              <div className={classes.stepsBorder} />
              <div className={classes.steps}>
                {Tabs.filter(
                  (tab) => pod.WithFunding || tab.title !== 'Tokenomics'
                ).map((tab, index) => (
                  <div
                    className={index <= page ? classes.selected : undefined}
                    key={`tab-${index}`}
                    style={{ position: 'relative' }}
                  >
                    <button
                      onClick={() => {
                        setPage(index);
                      }}
                    >
                      <div>{index + 1}</div>
                    </button>
                    <span>{tab.marker}</span>
                  </div>
                ))}
              </div>
            </Box>
          )}

          {isCreating ? (
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
                  <img
                    src={require('assets/musicDAOImages/result_fail.webp')}
                  />
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
                    {createResult === true ? 'Done' : 'Back'}
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
            <Box className={classes.workSpace}>
              {page === -1 && <Intro pod={pod} />}
              {page === 0 ? (
                <AddedSongs
                  onAddSong={onAddSong}
                  songs={songs}
                  onRemove={onRemove}
                  onEdit={onEdit}
                />
              ) : page === 1 && pod.WithFunding ? (
                <>
                  {/* {type === ContentType.PodInvestment ? (
                    <Distribution
                      pod={pod}
                      setPod={setPod}
                      photo={photo}
                      photoImg={photoImg}
                      setPhoto={setPhoto}
                      setPhotoImg={setPhotoImg}
                    />
                  ) : ( */}
                  <TokenomicsTab
                    pod={pod}
                    setPod={setPod}
                    tokenObjList={tokenObjList}
                  />
                  {/* )} */}
                </>
              ) : page === 2 || (page === 1 && !pod.WithFunding) ? (
                <DistributionTab pod={pod} setPod={setPod} />
              ) : null}
            </Box>
          )}
          <Box className={classes.footerBar}>
            <div className={classes.buttons}>
              <SecondaryButton
                size="medium"
                isRounded
                disabled={isCreating}
                onClick={onClose}
                style={{
                  color: Color.MusicDAODark,
                  border: `1px solid ${Color.MusicDAODark}`,
                  width: isMobile ? '40%' : '200px'
                }}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                size="medium"
                isRounded
                disabled={isCreating}
                onClick={() => {
                  if (page === 2 || (page === 1 && !pod.WithFunding))
                    createPodProposal();
                  else setPage(page + 1);
                }}
                style={{
                  background: page === 1 ? Gradient.Blue : Color.MusicDAODark,
                  width: isMobile ? '40%' : '200px'
                }}
                // disabled={page >= 0 && !songs?.length}
              >
                Next
              </PrimaryButton>
            </div>
          </Box>
        </div>
      </Modal>
    </>
  );
});

export default CreateProposalModal;

const FailIcon = () => (
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
);

const SuccessIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.0001 9L10 16L7 13"
      stroke="#65CB63"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
