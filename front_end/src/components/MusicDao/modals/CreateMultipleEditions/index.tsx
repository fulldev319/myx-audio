import React, {
  useImperativeHandle,
  useState,
  useEffect,
  useMemo
} from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
import { setReloadPods } from 'store/actions/Pods';
import AddedSongs from './components/AddedSongs';
import CreatePod from './components/CreatePod';

import Box from 'shared/ui-kit/Box';
import {
  Modal,
  Color,
  PrimaryButton,
  SecondaryButton,
  Gradient
} from 'shared/ui-kit';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { BlockchainNets, Mood, MusicGenres } from 'shared/constants/constants';
import { onUploadNonEncrypt } from 'shared/ipfs/upload';
import { switchNetwork } from 'shared/functions/metamask';
import getIPFSURL from 'shared/functions/getIPFSURL';
import {
  getURLfromCID,
  uploadNFTMetaData
} from 'shared/functions/ipfs/upload2IPFS';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';
import config from 'shared/connectors/web3/config';
import { toNDecimals } from 'shared/functions/web3';

import { createMultipleEditionsStyle } from './index.styles';
import { musicDaoCheckPodCreation } from 'shared/services/API';
import { sleep } from 'shared/helpers';

const Tabs = [
  {
    step: 'step 1',
    title: 'NFT',
    marker: 'NFTs'
  },
  {
    step: 'step 2',
    title: 'Capsule',
    marker: 'Capsule Details'
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

const CreateMultipleEditions = React.forwardRef((props: any, ref: any) => {
  const { onAddSong, open, onClose, onEditSong } = props;
  const classes = createMultipleEditionsStyle();
  const userSelector = useTypedSelector(getUser);
  const history = useHistory();
  const { setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const { showAlertMessage } = useAlertMessage();
  const { maxPrioFee } = useMaxPrioFee();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const dispatch = useDispatch();

  const { chainId, account, library } = useWeb3React();
  const [hash, setHash] = useState<string>('');
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [txModalOpen, setTxModalOpen] = useState<boolean | null>(null);

  const [page, setPage] = useState(0);
  const [songs, setSongs] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number>(0);
  // const [podId, setPodId] = useState<string>();

  const artist = useMemo(
    () => `${userSelector?.firstName ?? ''} ${userSelector?.lastName ?? ''}`,
    [userSelector]
  );

  const [pod, setPod] = useState<any>({
    Collabs: [],
    Name: '',
    Description: '',
    Hashtags: [],
    Token: 'USDT',
    WithFunding: true,
    Symbol: '',
    ArtistType: 'Artist'
  });
  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [createResult, setCreateResult] = useState<boolean | null>(null);

  const [complete, setComplete] = useState<Array<boolean | undefined>>([
    undefined,
    undefined
  ]);

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  useImperativeHandle(ref, () => ({
    updatePage(s) {
      setPage(s);
    },
    updateSongs(newSong) {
      let addSong = newSong;
      if (addSong.editionType === 'Regular') {
        addSong.streamingRevenueShares = [100];
        addSong.editionAmounts = [addSong.editionAmounts[0]];
        addSong.editionPrices = [addSong.editionPrices[0]];
        addSong.metadataEditions = [''];
      }
      if (editIndex > -1) {
        setSongs((prev) => {
          const newSongs = [...prev];
          newSongs.splice(editIndex, 1, addSong);
          return newSongs;
        });
      } else {
        setSongs((prev) => [...prev, addSong]);
      }
    }
  }));

  React.useEffect(() => {
    if (page === 0) {
      setComplete((prev) => {
        const temp = [...prev];
        temp[0] = !!songs.length;
        return temp;
      });
    } else {
      setComplete((prev) => {
        const temp = [...prev];
        temp[0] = !!songs.length;
        temp[1] = pod.Name && pod.Description && photo && !!pod.Hashtags.length;
        return temp;
      });
    }
  }, [songs, pod, page]);

  const onRemove = (index) => {
    setSongs((prev) => {
      const newSongs = [...prev];
      newSongs.splice(index, 1);
      return newSongs;
    });
  };

  const onEdit = (index) => {
    setEditIndex(index);
    onEditSong(songs[index]);
  };

  const afterCreatePod = () => {
    dispatch(setReloadPods(true));
    onClose();
    setCreateResult(true);
  };

  const getTokenURI = async (
    songData: any,
    metadataPhoto: any,
    editionType,
    editionAmount,
    editionShare
  ) => {
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
            value: pod.ArtistType === 'Artist' ? artist : pod.Artist?.name
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
            value:
              pod.ArtistType === 'Artist' ? userSelector.id : pod.Artist?.id
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
              songData.editionType === 'Regular' &&
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
    if (pod.ArtistType === 'Label') {
      metaData.attributes = [
        ...metaData.attributes,
        {
          trait_type: 'labelId',
          value: userSelector.id
        }
      ];
    }
    return (await uploadNFTMetaData(metaData))?.uri;
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
        attributes: [
          {
            trait_type: 'ArtistType',
            value: payload.artistType
          },
          {
            trait_type: 'Artist',
            value: payload.artist
          },
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
        payload.description = pod.Description;
        payload.imageUrl = '';
        payload.hashtags = pod.Hashtags;
        payload.collabs = [
          { userId: userSelector.id, address: userSelector.address }
        ];
        payload.creatorAddress = userSelector.address;
        payload.creatorId = userSelector.id;
        payload.network = BlockchainNets[1].value;
        payload.symbol = pod.Symbol;
        payload.artistType = pod.ArtistType;
        payload.artist = pod.Artist;

        let infoImage = await onUploadNonEncrypt(photo, (file) =>
          uploadWithNonEncryption(file, false)
        );

        payload.infoImage = infoImage;
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
          (net) => net.value === 'Polygon blockchain'
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
        console.log(songs, targetChain.name);
        const metadataURI = await getPodTokenURI(payload);
        const fundingToken = config['Polygon'].TOKEN_ADDRESSES.USDT;
        const decimals = await web3APIHandler.Erc20['USDT'].decimals(web3);
        const PodDefinition = {
          podName: pod.Name,
          podSymbol: pod.Symbol,
          owners: [userSelector?.ArtistId],
          copyrightAllocations: [10000],
          royaltyPercentage: 500,
          copyrightTokenSupply: 100000,
          fundingToken: fundingToken,
          metadataURI
        };
        let MediaWithRoyalty: Media[] = await getMedias(decimals);
        web3APIHandler.PodManagerV2.registerPodProposal(
          web3,
          account,
          {
            PodDefinition,
            MediaWithRoyalty
          },
          setTxModalOpen,
          setHash,
          maxPrioFee
        ).then(async (resp) => {
          if (resp.success) {
            while (1) {
              const res = await musicDaoCheckPodCreation(resp.data.podId, true);
              if (res?.success) {
                setTransactionSuccess(true);
                showAlertMessage('Successfully created capsule.', {
                  variant: 'success'
                });
                afterCreatePod();
                history.push('/capsules/' + res.podId);
                return;
              }
              await sleep(5000);
            }
          } else {
            setTransactionSuccess(false);
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
    } catch (e) {
      showAlertMessage(e.message, { variant: 'error' });
      setCreateResult(false);
    }
  };

  const getMedias = async (decimals) => {
    const web3 = new Web3(library.provider);
    let MediaWithRoyalty: Media[] = [];
    console.log('songs', songs);
    await Promise.all(
      songs.map(async (song) => {
        // await songs.forEach(async (song) => {
        let pricePerEditions: any[] = [];
        let songImageMetadata = song.metadataPhoto.newFileCID;
        let tokenURIPerEdition: any[] = [];
        let percentagePerEdition: any[] = [];
        let prices = song.editionPrices;
        let uris = song.metadataEditions;
        let percentages = song.streamingRevenueShares;
        let songTokenURI: any = '';
        if (song.editionType === 'Premium') {
          prices.forEach((price) => {
            pricePerEditions.push(toNDecimals(price, decimals));
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
          percentagePerEdition.push(percentages[0] * 100);
        }
        let Media = {
          media: {
            isStreaming: song.isMakeStreaming,
            masterNFTTokenURI: songTokenURI,
            pricePerEdition: pricePerEditions.map((price) => Number(price)),
            quantityPerEdition: song.editionAmounts.map((amount) =>
              Number(amount)
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
        await MediaWithRoyalty.push(Media);
      })
    );
    return MediaWithRoyalty;
  };

  const validateNFTMediaInfoCreate = () => {
    if (pod.ArtistType === 'Label' && !pod.Artist) {
      showAlertMessage('Artist is required.', { variant: 'error' });
      return false;
    } else if (!pod.Name) {
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
    } else if (!photo) {
      showAlertMessage(`Capsule image is required.`, { variant: 'error' });
      return false;
    } else if (!pod.Hashtags || !pod.Hashtags.length) {
      showAlertMessage(`Hashtag is required.`, { variant: 'error' });
      return false;
    } else if (!userSelector.ArtistId) {
      showAlertMessage('You are not allowed as artist. Missing ArtistId', {
        variant: 'error'
      });
      return false;
    } else return true;
  };

  const handleResultBtn = () => {
    if (createResult === true) {
      // history.push(`/capsules/${podId}`);
      props.onClose();
    } else if (createResult === false) {
      setIsCreating(false);
      setCreateResult(null);
    }
  };

  return (
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
            <img
              src={require('assets/logos/MYX_logo_3.svg')}
              width="100"
              alt="Myx"
            />
          </div>
          {!isMobile && (
            <>
              <Box width={'470px'}>
                <div className={classes.stepsBorder} />
                <div className={classes.steps}>
                  {Tabs.map((tab, index) => (
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
                      {complete[index] !== undefined && index <= page && (
                        <div className={classes.completed}>
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
              <Box width="300px" />
            </>
          )}
        </Box>
        {isMobile && (
          <Box mx={5} mt={2}>
            <div className={classes.stepsBorder} />
            <div className={classes.steps}>
              {Tabs.map((tab, index) => (
                <div
                  className={index <= page ? classes.selected : undefined}
                  key={`tab-${index}`}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <button
                    onClick={() => {
                      setPage(index);
                    }}
                  >
                    <div>{index + 1}</div>
                  </button>
                  {complete[index] !== undefined && index <= page && (
                    <div className={classes.completed}>
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
        <Box className={classes.workSpace}>
          {page === 0 ? (
            <AddedSongs
              onAddSong={() => {
                setEditIndex(-1);
                onAddSong();
              }}
              songs={songs}
              onRemove={onRemove}
              onEdit={onEdit}
            />
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
                      shareLink={`${window.location.origin}/#/pods/${podId}`}
                    />
                  )} */}
                </>
              )}
            </Box>
          ) : (
            <CreatePod
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
        </Box>
        <Box className={classes.footerBar}>
          <div className={classes.buttons}>
            <SecondaryButton
              size="medium"
              isRounded
              onClick={() => {
                if (page > 0) setPage((prev) => prev - 1);
                else if (songs?.length === 0) onClose();
                else {
                  if (editIndex === -1) {
                    setEditIndex(songs.length - 1);
                    onEdit(songs.length - 1);
                  } else {
                    onEdit(editIndex);
                  }
                }
              }}
              style={{
                color: Color.MusicDAODark,
                border: `1px solid ${Color.MusicDAODark}`,
                width:
                  isMobile && Tabs[page].marker === 'Collection'
                    ? 'auto'
                    : isMobile
                    ? '40%'
                    : '200px'
              }}
            >
              {page === 0 && songs?.length === 0 ? 'Cancel' : 'Back'}
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              isRounded
              onClick={() => {
                if (page === 1) createPod();
                else setPage(page + 1);
              }}
              style={{
                background: page === 1 ? Gradient.Blue : Color.MusicDAODark,
                width: isMobile ? '40%' : '200px'
              }}
              disabled={!songs?.length}
            >
              {page === 1 ? 'Create Capsule' : 'Next'}
            </PrimaryButton>
          </div>
        </Box>
      </div>
    </Modal>
  );
});

export default CreateMultipleEditions;
