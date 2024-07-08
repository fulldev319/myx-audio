import React, { useState, useEffect, useRef } from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import NftTab from './components/NftTab';
import StreamingTab from './components/StreamingTab';
import RoyaltiesTab from './components/RoyaltiesTab';
import UploadMediaTab from './components/UploadMediaTab';
import CreateProposalModal from '../CreateProposalModal';

import Box from 'shared/ui-kit/Box';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import {
  Color,
  ContentType,
  Modal,
  PrimaryButton,
  SecondaryButton
} from 'shared/ui-kit';
import { BlockchainNets } from 'shared/constants/constants';
import {
  useStreamingIPFS,
  getWaveDataURL,
  getFileDuration
} from 'shared/functions/ipfs/upload2IPFS';
import { onUploadNonEncrypt, onUploadStreamingMedia } from 'shared/ipfs/upload';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { musicDaoSignProofOfAuthenticity } from 'shared/services/API';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import { onGetNonDecrypt } from 'shared/ipfs/get';

import { createMusicStyles } from './index.styles';

const TabsMultiEdition = [
  {
    step: 'step 1',
    title: 'Select Main Artist',
    marker: 'Music'
  },
  {
    step: 'step 2',
    title: 'Which NFT type do you want?',
    marker: 'Editions'
  },
  {
    step: 'step 3',
    title: 'Streaming',
    marker: 'Streaming'
  },
  {
    step: 'step 4',
    title: 'Royalties ',
    marker: 'Royalties'
  }
];

const DEFAULT_DATA_MULTIPLE = {
  Title: '',
  Description: '',
  Genre: '',
  Mood: '',
  Network: BlockchainNets[1].name, //"POLYGON",
  metadataMedia: null,
  metadataPhoto: null,
  editionType: 'Regular',
  genreId: '',
  isMakeStreaming: true,
  streamingRevenueShares: [0, 0, 0, 0],
  editionAmounts: [0, 0, 0, 0],
  editionPrices: [0, 0, 0, 0],
  metadataEditions: [{}, {}, {}, {}],
  isRoyaltyShare: false,
  royaltyShare: 0,
  moodId: '',
  type: 'BATCH_ERC721',
  artist: {
    main: [],
    feature: []
  }
};

type Props = {
  open: boolean;
  onClose: () => void;
  handleRefresh: any;
  editMode?: boolean;
  draft?: any;
  updateSongData?: (data: any) => void;
  type?: ContentType;
  pod: any;
  setPod: any;
};

export default function CreateProposal({
  open,
  onClose,
  editMode,
  draft,
  type = ContentType.PodCollaborative,
  pod,
  setPod,
  handleRefresh
}: Props) {
  const classes = createMusicStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const { showAlertMessage } = useAlertMessage();
  const [page, setPage] = useState(0);
  const [pageValidations, setPageValidations] = useState<boolean[]>([]);

  const [songData, setSongData] = useState<any>(DEFAULT_DATA_MULTIPLE);

  const [songImage, setSongImage] = useState<any>();
  const [song, setSong] = useState<any>();
  const [fileIPFS, setFileIPFS] = useState<any>(null);

  const [mediaCover, setMediaCover] = useState<any>({});

  const { addStreamingMedia2IPFS } = useStreamingIPFS();
  const {
    uploadWithNonEncryption,
    downloadWithNonDecryption,
    setShowUploadingModal
  } = useIPFS();

  const Tabs = React.useMemo(() => {
    return TabsMultiEdition;
  }, [type]);

  const [metadataPremiumPhoto, setMetadataPremiumPhoto] = useState<any>();

  const [step, setStep] = useState<number>(-1);
  const multiEditionsRef = useRef<any>();

  useEffect(() => {
    validatePage();
  }, [songData, metadataPremiumPhoto]);

  // If Edit mode, then set draft as songData
  useEffect(() => {
    if (open === true && draft && editMode === true) {
      const { Id, ...rest } = draft;
      setSongData(rest);

      setSongImage(draft.metadataPhoto);
      setSong({ name: draft.metadataMedia?.metadata?.properties.name });
      setMetadataPremiumPhoto(draft.metadataPremiumPhoto);
    }
    if (open === false) {
      setSongData(DEFAULT_DATA_MULTIPLE);

      setSongImage(null);
      setSong(null);
      setMetadataPremiumPhoto(null);
    }
  }, [open, draft, editMode]);

  useEffect(() => {
    if (fileIPFS) {
      setMediaCover({ ...mediaCover, uploadImg: fileIPFS });
    }
  }, [fileIPFS]);

  useEffect(() => {
    if (
      draft?.metadataPhoto &&
      draft?.metadataPhoto.newFileCID &&
      draft?.metadataPhoto?.metadata?.properties?.name
    ) {
      getImageFileIpfs(
        draft?.metadataPhoto.newFileCID,
        draft?.metadataPhoto.metadata.properties.name
      );
    }
  }, [draft]);

  const getImageFileIpfs = async (cid: any, fileName: string) => {
    let fileUrl: string = '';
    let files = await onGetNonDecrypt(
      cid,
      fileName,
      (fileCID, fileName, download) =>
        downloadWithNonDecryption(fileCID, fileName, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.buffer);
      if (fileName?.slice(-4) === '.gif') {
        fileUrl = 'data:image/gif;base64,' + base64String;
      } else {
        fileUrl = 'data:image/png;base64,' + base64String;
      }
    }
    setFileIPFS(fileUrl);
  };

  const uploadSongImage = async (value) => {
    setSongImage(value);
    let metadataPhoto = await onUploadNonEncrypt(value, (file) =>
      uploadWithNonEncryption(file)
    );
    setSongData((prev) => ({ ...prev, metadataPhoto }));
  };

  const uploadSong = async (value) => {
    if (!value) {
      setSong(value);
      return;
    }

    try {
      let waveDataURL;
      getWaveDataURL(value).then((resp) => {
        waveDataURL = resp;
        // console.log({ waveDataURL });
      });
      let {
        metadata: metadataMedia,
        chunksCID: chunks,
        animationURL: animation_url
      } = await onUploadStreamingMedia(value, (file) =>
        addStreamingMedia2IPFS(file)
      );
      const durationM = (await getFileDuration(value)) as number;
      const duration = Math.floor(durationM);
      metadataMedia.metadata.properties.name = 'master.m3u8';
      metadataMedia.metadata.properties.duration = duration;
      metadataMedia.metadata.properties.wave_data_url = waveDataURL;
      metadataMedia.metadata.animation_url = animation_url;
      const response = await musicDaoSignProofOfAuthenticity(value);
      if (response.success) { // && response.fingerprint) {
        setSongData((prev) => ({ ...prev, metadataMedia }));
        setSong(value);
      }
      setShowUploadingModal(false);
    } catch (err) {
      console.error('uploadSong', err);
      setShowUploadingModal(false);
    }
  };

  const validatePage = () => {
    let validationStatus =
      type === ContentType.SongSingleEdition
        ? [true, true, true, true]
        : [true, true, true, true, true];
    if (!songData.artist.main.length) {
      if (type === ContentType.SongSingleEdition) validationStatus[2] = false;
      else validationStatus[0] = false;
      // showAlertMessage(`Track Name is required`, { variant: "error" });
      // return false;
    }
    if (!songData.Title) {
      if (type === ContentType.SongSingleEdition) validationStatus[2] = false;
      else validationStatus[0] = false;
      // showAlertMessage(`Track Name is required`, { variant: "error" });
      // return false;
    } else if (!songData.Genre) {
      if (type === ContentType.SongSingleEdition) validationStatus[2] = false;
      else validationStatus[0] = false;
      // showAlertMessage(`Genre is required`, { variant: "error" });
      // return false;
    } else if (!songData.Mood) {
      if (type === ContentType.SongSingleEdition) validationStatus[2] = false;
      else validationStatus[0] = false;
      // showAlertMessage(`Mood is required`, { variant: "error" });
      // return false;
    }
    if (!songData.metadataMedia) {
      if (type === ContentType.SongSingleEdition) validationStatus[2] = false;
      else validationStatus[0] = false;
      // showAlertMessage(`You need to upload a track file.`, { variant: "error" });
      // return false;
    } else if (!songData.metadataPhoto) {
      if (type === ContentType.SongSingleEdition) validationStatus[2] = false;
      else validationStatus[0] = false;
      // showAlertMessage(`You need to upload Track Image.`, { variant: "error" });
      // return false;
    }
    // if (
    //   songData.type === 'BATCH_ERC721' &&
    //   (songData.amount === 0 || !songData.amount)
    // ) {
    //   validationStatus[1] = false;
    // }
    if (
      songData.editionType === 'Regular' &&
      (Number(songData.editionAmounts[0]) <= 0 ||
        Number(songData.editionPrices[0]) <= 0)
    ) {
      validationStatus[1] = false;
    }
    if (songData.editionType === 'Premium') {
      if (songData.editionAmounts.every((edition) => Number(edition) <= 0)) {
        validationStatus[1] = false;
      } else {
        const res = songData.editionAmounts.map(
          (amount: string, index: number) => {
            if (Number(amount) <= 0) return true;
            if (Number(songData.editionPrices[index]) <= 0) return false;
            return true;
          }
        );
        if (res.filter((val) => !val).length > 0) validationStatus[1] = false;
      }
    }
    if (songData.isMakeStreaming) {
      if (
        songData.editionType != 'Regular' &&
        songData.streamingRevenueShares?.reduce((result, current) => {
          return result + Number(current || 0);
        }, 0) !== 100
      ) {
        validationStatus[2] = false;
      } else if (songData.editionType == 'Regular') {
        validationStatus[2] = true;
      }
    }
    if (
      songData.isRoyaltyShare &&
      (!songData.royaltyShare ||
        !(
          Number(songData.royaltyShare) >= 0 &&
          Number(songData.royaltyShare <= 100)
        ))
    ) {
      if (type === ContentType.SongSingleEdition) validationStatus[1] = false;
      else validationStatus[3] = false;
      // showAlertMessage(`Royalty Share is not correct`, { variant: "error" });
      // return false;
      // } else if (songData.isRoyaltyShare /* && !songData.royaltyRecipientAddress */) {
      //   if (type === ContentType.SongSingleEdition) validationStatus[1] = false;
      //   else validationStatus[2] = false;
      //   // showAlertMessage(`Royalty Recipient Address is required`, { variant: "error" });
      //   // return false;
      // } else if (
      //   songData.isRoyaltyShare /* && !isValidAddress(songData.royaltyRecipientAddress) */
      // ) {
      //   if (type === ContentType.SongSingleEdition) validationStatus[1] = false;
      //   else validationStatus[2] = false;
      //   // showAlertMessage(`Royalty Recipient Address is invalid`, { variant: "error" });
      //   // return false;
    }
    setPageValidations(validationStatus);
  };

  const validate = () => {
    console.log(songData);
    if (songData.editionType === 'Regular' && !songData.editionAmounts[0]) {
      showAlertMessage(`You need to set amount of editions.`, {
        variant: 'error'
      });
      return false;
    } else if (!songData.artist.main.length) {
      showAlertMessage(`Track Artist is required`, { variant: 'error' });
      return false;
    } else if (!songData.Title) {
      showAlertMessage(`Track Name is required`, { variant: 'error' });
      return false;
    } else if (!songData.Genre) {
      showAlertMessage(`Genre is required`, { variant: 'error' });
      return false;
    } else if (!songData.Mood) {
      showAlertMessage(`Mood is required`, { variant: 'error' });
      return false;
    } else if (
      songData.isRoyaltyShare &&
      (!songData.royaltyShare ||
        !(
          Number(songData.royaltyShare) >= 0 &&
          Number(songData.royaltyShare <= 100)
        ))
    ) {
      showAlertMessage(`Royalty Share is not correct`, { variant: 'error' });
      return false;
      // } else if (songData.isRoyaltyShare && !songData.royaltyRecipientAddress) {
      //   showAlertMessage(`Royalty Recipient Address is required`, {
      //     variant: 'error'
      //   });
      //   return false;
      // } else if (
      //   songData.isRoyaltyShare &&
      //   !isValidAddress(songData.royaltyRecipientAddress)
      // ) {
      //   showAlertMessage(`Royalty Recipient Address is invalid`, {
      //     variant: 'error'
      //   });
      //   return false;
    } else if (!songData.metadataMedia) {
      showAlertMessage(`You need to upload a track file.`, {
        variant: 'error'
      });
      return false;
    } else if (!songData.metadataPhoto) {
      showAlertMessage(`You need to upload Track Image.`, { variant: 'error' });
      return false;
    }

    return true;
  };

  // const isValidAddress = (address) => {
  //   const web3 = new Web3(library.provider);
  //   return web3.utils.isAddress(address);
  // };

  const uploadEditionImg = async (value, index) => {
    let metadataPhoto = await onUploadNonEncrypt(value, (file) =>
      uploadWithNonEncryption(file)
    );
    setSongData((prev) => {
      const newEditionImages = [...prev.metadataEditions];
      newEditionImages[index] = metadataPhoto;
      return { ...prev, metadataEditions: newEditionImages };
    });
  };

  const onAddSong = () => {
    setStep(0);
    setPage(0);
    setSongData(DEFAULT_DATA_MULTIPLE);
  };

  const onEditSong = () => {
    setStep(0);
    setPage(0);
  };

  return (
    <>
      <CreateProposalModal
        onAddSong={onAddSong}
        open={step === -1 || step === 1}
        ref={multiEditionsRef}
        onClose={onClose}
        handleRefresh={handleRefresh}
        type={type}
        pod={pod}
        setPod={setPod}
        onEditSong={onEditSong}
      />
      {step === 0 && (
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
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Box className={classes.titleBar}>
              <div
                style={
                  isMobile
                    ? {}
                    : {
                        width:
                          type === ContentType.SongSingleEdition ? 200 : 300
                      }
                }
              >
                Adding Song
              </div>
              {!isMobile && (
                <Box width={'470px'}>
                  <div className={classes.stepsBorder} />
                  <div className={classes.steps}>
                    {Tabs.map((tab, index) => (
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
              <div
                style={
                  isMobile
                    ? { width: 80 }
                    : {
                        width:
                          type === ContentType.SongSingleEdition ? 200 : 300
                      }
                }
              />
            </Box>
            <div className={classes.workSpace}>
              <div className={classes.content}>
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
                <Box className={classes.stepText}>
                  <h5>{Tabs[page].step}</h5>
                  <h3>{Tabs[page].title}</h3>
                  {Tabs[page].marker === 'Streaming' && (
                    <div className={classes.comingSoon}>Coming Soon</div>
                  )}
                </Box>
                {Tabs[page].marker === 'Editions' ? (
                  <NftTab
                    songData={songData}
                    setSongData={setSongData}
                    uploadEditionImg={uploadEditionImg}
                  />
                ) : Tabs[page].marker === 'Streaming' ? (
                  <StreamingTab songData={songData} setSongData={setSongData} />
                ) : Tabs[page].marker === 'Royalties' ? (
                  <div>
                    <RoyaltiesTab
                      songData={songData}
                      setSongData={setSongData}
                    />
                  </div>
                ) : Tabs[page].marker === 'Music' ? (
                  <UploadMediaTab
                    song={song}
                    songData={songData}
                    setSongData={setSongData}
                    songImage={songImage}
                    mediaCover={mediaCover}
                    setMediaCover={setMediaCover}
                    uploadSongImage={uploadSongImage}
                    uploadSong={uploadSong}
                    podCollabs={pod.Collabs}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <Box className={classes.footerBar}>
              <div className={classes.buttons}>
                <SecondaryButton
                  size="medium"
                  isRounded
                  onClick={() => {
                    if (page === 0) onClose();
                    else setPage(page - 1);
                  }}
                  style={{
                    color: Color.MusicDAODark,
                    border: `1px solid ${Color.MusicDAODark}`,
                    width:
                      isMobile && Tabs[page].marker === 'Royalties'
                        ? 'auto'
                        : isMobile
                        ? '40%'
                        : '200px'
                  }}
                >
                  {page === 0 ? 'Cancel' : 'Back'}
                </SecondaryButton>
                <PrimaryButton
                  size="medium"
                  isRounded
                  onClick={() => {
                    if (Tabs[page].marker === 'Royalties') {
                      if (validate()) {
                        multiEditionsRef.current?.updateSongs({
                          ...songData,
                          songImage: mediaCover.uploadImg
                        });
                        setStep(1);
                      }
                    } else {
                      setPage(page + 1);
                    }
                  }}
                  style={{
                    background: Color.MusicDAODark,
                    width: isMobile ? '40%' : '200px'
                  }}
                >
                  Next
                </PrimaryButton>
              </div>
            </Box>
          </div>
        </Modal>
      )}
    </>
  );
}
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
