import React, { useEffect, useState, useMemo } from 'react';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { Color, Modal, PrimaryButton } from 'shared/ui-kit';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { mediaTermsModalStyles } from './index.styles';
import Box from 'shared/ui-kit/Box';

import axios from 'axios';
import URL from '../../../../shared/functions/getURL';
import {
  BlockchainNets,
  MusicGenres,
  Mood,
  MoodEmoji
} from 'shared/constants/constants';
import { onGetNonDecrypt } from 'shared/ipfs/get';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import { onUploadNonEncrypt, onUploadStreamingMedia } from 'shared/ipfs/upload';
import { musicDaoSignProofOfAuthenticity } from 'shared/services/API';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import DraftProgressingModal from '../DraftProgressingModal';

import { useWeb3React } from '@web3-react/core';
import {
  getURLfromCID,
  uploadNFTMetaData,
  useStreamingIPFS,
  getWaveDataURL,
  getFileDuration
} from 'shared/functions/ipfs/upload2IPFS';
import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';

import CopyToClipboard from 'react-copy-to-clipboard';
import { CopyIcon } from 'shared/ui-kit/Modal/Modals/TransactionProgressModal';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import Web3 from 'web3';
import { switchNetwork } from 'shared/functions/metamask';
import { InfoTooltip } from 'shared/ui-kit/InfoTooltip';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';

const multiAddr = getIPFSURL();

const mediaCopyTermsModal = ({
  open,
  handleClose,
  pod,
  media,
  handleRefresh
}) => {
  const classes = mediaTermsModalStyles();
  const user = useTypedSelector(getUser);
  const { showAlertMessage } = useAlertMessage();

  const [mediaCopy, setMediaCopy] = useState<any>(media);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [hash, setHash] = useState<string>('');

  const [songImage, setSongImage] = useState<any>(media?.InfoImage);
  const [song, setSong] = useState<any>();

  const [metadataPhoto, setMetadataPhoto] = useState<any>(media?.InfoImage);
  const [metadataMedia, setMetadataMedia] = useState<any>(media?.metadataMedia);
  const [fingerprint, setFingerprint] = useState<any>(media?.fingerprint);
  const [chunksCID, setChunksCID] = useState<any>([]);

  const [mediaCover, setMediaCover] = useState<any>({});

  const { addStreamingMedia2IPFS } = useStreamingIPFS();

  const [fileIPFS, setFileIPFS] = useState<any>(null);

  const {
    setMultiAddr,
    uploadWithNonEncryption,
    downloadWithNonDecryption,
    setShowUploadingModal
  } = useIPFS();

  const [openCreateDraftModal, setOpenCreateDraftModal] =
    useState<boolean>(false);
  const [uploadingSong, setUploadingSong] = useState<boolean>(false);

  const artist = useMemo(
    () => `${user?.firstName ?? ''} ${user?.lastName ?? ''}`,
    [user]
  );

  const { account, library, chainId } = useWeb3React();

  const [podInfo, setPodInfo] = useState<any>();

  const [isMint, setIsMint] = useState<boolean>(false);

  const { maxPrioFee } = useMaxPrioFee();

  useEffect(() => {
    if (media.metadataMedia) {
      setSong({ name: media.metadataMedia?.metadata?.properties.name });
    }
  }, [media]);

  useEffect(() => {
    if (!pod || !library) return;

    const targetChain = BlockchainNets[1];

    const web3APIHandler = targetChain.apiHandler;

    const web3 = new Web3(library.provider);
    web3APIHandler?.PodManager.getPodInfo(web3, {
      podAddress: pod.PodAddress,
      fundingToken: pod.FundingToken
    }).then((info) => {
      setPodInfo(info);
    });
  }, [pod, library]);

  useEffect(() => {
    setMultiAddr(multiAddr);
  }, []);

  useEffect(() => {
    if (fileIPFS) {
      setMediaCover({ ...mediaCover, uploadImg: fileIPFS });
    }
  }, [fileIPFS]);

  useEffect(() => {
    if (
      media?.InfoImage &&
      media?.InfoImage?.newFileCID &&
      media?.InfoImage?.metadata?.properties?.name
    ) {
      getImageFileIpfs(
        media?.InfoImage.newFileCID,
        media?.InfoImage.metadata.properties.name
      );
    }
  }, [media]);

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

  const songMetaData = useMemo(
    () =>
      metadataPhoto &&
      metadataMedia && {
        name: mediaCopy.Title,
        symbol: mediaCopy.Title,
        description: '',
        animation_url: metadataMedia?.metadata?.animation_url,
        external_url: `${window.location.href}`,
        image: `${getURLfromCID(metadataPhoto.newFileCID)}/${
          metadataPhoto.metadata.properties.name
        }`,
        attributes: [
          {
            trait_type: 'Artists',
            value: artist
          },
          {
            trait_type: 'Genre',
            value: mediaCopy.Genre
          },
          {
            trait_type: 'Mood',
            value: mediaCopy.Genre
          },
          {
            trait_type: 'Label',
            value: mediaCopy.Description
          },
          {
            trait_type: 'isAlbum',
            value: false
          },
          {
            display_type: 'date',
            trait_type: 'Release Date',
            value: Math.floor(Date.now() / 1000)
          },
          {
            trait_type: 'fingerprint',
            value: fingerprint
          },
          {
            trait_type: 'CID of Playlist',
            value: metadataMedia.newFileCID
          },
          {
            trait_type: 'CID of Chunks',
            value: chunksCID
          }
        ]
      },
    [mediaCopy, metadataMedia, metadataPhoto, artist, fingerprint, chunksCID]
  );

  const uploadSongImage = async (value) => {
    setSongImage(value);
    let metadataPhoto = await onUploadNonEncrypt(value, (file) =>
      uploadWithNonEncryption(file)
    );
    setMetadataPhoto(metadataPhoto);
  };

  const uploadSong = async (value) => {
    if (!value) {
      setSong(value);
      return;
    }

    setUploadingSong(true);
    try {
      let waveDataURL;
      getWaveDataURL(value).then((resp) => {
        waveDataURL = resp;
      });
      let {
        metadata: mediaMetadata,
        chunksCID: chunks,
        animationURL: animation_url
      } = await onUploadStreamingMedia(value, (file) =>
        addStreamingMedia2IPFS(file)
      );
      mediaMetadata.metadata.properties.name = 'master.m3u8';
      mediaMetadata.metadata.properties.wave_data_url = waveDataURL;
      mediaMetadata.metadata.animation_url = animation_url;

      const response = await musicDaoSignProofOfAuthenticity(value);
      setUploadingSong(false);
      if (response.success && response.fingerprint) {
        setFingerprint(response.fingerprint);
        setMetadataMedia(mediaMetadata);
        setChunksCID(chunks);
        setSong(value);
      }
      setShowUploadingModal(false);
    } catch (err) {
      console.error('uploadSong', err);
      setUploadingSong(false);
      setShowUploadingModal(false);
    }
  };

  const onSaveDraft = async (isPublic: boolean = true, callback: any) => {
    if (!validate(false)) {
      callback(false);
      return;
    }

    const songUri = (await uploadNFTMetaData(songMetaData)).uri;

    // check media type
    // if(!mediaCopy.draftId && !mediaCopy.Id) { // not uploaded track file, need create draft, from song card of pod detail page
    // } else if(mediaCopy.draftId) {  // from song card of pod detail page, need update
    // } else if(mediaCopy.Id) { // from song card of normal page (music, profile ...), need update
    // }
    const response = await axios.post(
      `${URL()}/musicDao/pod/media/${
        mediaCopy.draftId || mediaCopy.Id ? 'update' : 'create'
      }`,
      {
        podId: pod.Id,
        mediaId: mediaCopy.Id
          ? pod.Medias.find((v) => v.Title === media.Title).id ?? undefined
          : media.id,
        media: {
          Title: mediaCopy.Title,
          Genre: mediaCopy.Genre,
          Mood: mediaCopy.Mood,
          Label: mediaCopy.Label,
          Description: mediaCopy.Description,
          metadataPhoto,
          metadataMedia,
          InfoImage: metadataPhoto,
          fingerprint,

          uri: songUri,
          genreId: (MusicGenres.indexOf(mediaCopy.Genre) + 1)
            .toString()
            .padStart(2, '0'),
          isAlbum: false,
          draft: true,
          isPublic: isPublic,
          category: 'Investing'
        },
        extra: {
          ownerAddress: account?.toLowerCase(),
          isPod: true,
          podInfo: pod,
          collabs: pod?.Collabs ?? []
        }
      }
    );

    const resp = response.data;
    if (resp.success) {
      handleClose();
      callback(true);
      handleRefresh();
    } else {
      callback(false);
    }
  };

  const validate = (isUploading) => {
    if (!mediaCopy.Title) {
      showAlertMessage(`Track Name is required`, { variant: 'error' });
      return false;
    } else if (!mediaCopy.Genre) {
      showAlertMessage(`Genre is required`, { variant: 'error' });
      return false;
    } else if (!mediaCopy.Mood) {
      showAlertMessage(`Mood is required`, { variant: 'error' });
      return false;
    } else if (isUploading && !mediaCopy.proofOfAuthenticity) {
      showAlertMessage(`You need to sign proof of Authenticity first.`, {
        variant: 'error'
      });
      return false;
    } else if (!metadataMedia) {
      showAlertMessage(`You need to upload a track file.`, {
        variant: 'error'
      });
      return false;
    } else if (!metadataPhoto) {
      showAlertMessage(`You need to upload Track Image.`, { variant: 'error' });
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!validate(true) || !podInfo) return;

    setIsSaving(true);

    const metaData = {
      name: mediaCopy.Title,
      symbol: pod.TokenSymbol,
      description: mediaCopy.Description || '',
      external_url: `${window.location.href}`,
      image: `${getURLfromCID(metadataPhoto.newFileCID)}/${
        metadataPhoto.metadata.properties.name
      }`,
      attributes: [
        {
          trait_type: 'Artists',
          value: mediaCopy.Artist
        },
        {
          trait_type: 'Genre',
          value: mediaCopy.Genre
        },
        {
          trait_type: 'Mood',
          value: mediaCopy.Mood
        },
        {
          trait_type: 'Label',
          value: mediaCopy.Label
        },
        {
          trait_type: 'AlbumName',
          value: pod.Name
        },
        {
          trait_type: 'albumDescription',
          value: pod.Description
        },
        {
          trait_type: 'albumImage',
          value: pod.InfoImage
            ? `${getURLfromCID(pod.InfoImage.newFileCID)}/${
                pod.InfoImage.metadata.properties.name
              }`
            : null
        },
        {
          display_type: 'date',
          trait_type: 'Release Date',
          value: Math.floor(Date.now() / 1000)
        },
        {
          trait_type: 'fingerprint',
          value: fingerprint
        },
        {
          trait_type: 'Proof of Ownership',
          value: mediaCopy.proofOfAuthenticity
        },
        {
          trait_type: 'CID of Playlist',
          value: metadataMedia.newFileCID
        },
        {
          trait_type: 'CID of Chunks',
          value: chunksCID
        }
      ]
    };

    const albumMetaData = {
      name: pod.Name,
      symbol: pod.TokenSymbol,
      description: pod.Description,
      external_url: `${window.location.href}`,
      image: pod.InfoImage
        ? `${getURLfromCID(pod.InfoImage.newFileCID)}/${
            pod.InfoImage.metadata.properties.name
          }`
        : null,
      attributes: [
        {
          trait_type: 'Artists',
          value: mediaCopy.Artist
        },
        {
          display_type: 'date',
          trait_type: 'Release Date',
          value: Math.floor(Date.now() / 1000)
        }
      ]
    };

    const uri = (await uploadNFTMetaData(metaData)).uri;
    const albumUri = (await uploadNFTMetaData(albumMetaData)).uri;
    const targetChain = BlockchainNets.find(
      (net) => net.value === 'Polygon blockchain'
    );
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);
    const payload = {
      nftAddress: podInfo?.nftContract.toLowerCase(),
      podAddress: pod.PodAddress,
      mediaId: media.id,
      uri: uri,
      isStreaming: media.IsStreaming ? true : false
    };
    try {
      const response = await web3APIHandler.PodManager.uploadMedia(
        web3,
        account!,
        payload,
        setHash,
        maxPrioFee
      );

      if (response.success) {
        await axios.post(`${URL()}/musicDao/pod/media/upload`, {
          podId: pod.Id,
          mediaId: media.id,
          uri: albumUri,
          data: {
            ...mediaCopy,
            AlbumName: pod.Name,
            albumId: podInfo?.nftContract,
            metadataPhoto,
            metadataMedia,
            fingerprint,
            uri,
            draft: false,
            nftAddress: podInfo?.nftContract.toLowerCase(),
            ownerAddress: podInfo?.distributionManagerAddress.toLowerCase(),
            tokenId: response.data.tokenId,
            hash: response.data.hash || ''
          }
        });
        handleRefresh();
        setIsSaving(false);
        setIsSaved(true);
      } else {
        showAlertMessage('Failed to upload media', { variant: 'error' });
        setIsSaving(false);
        setIsSaved(true);
      }
    } catch (err) {
      console.log(err);
      showAlertMessage('Failed to upload media', { variant: 'error' });
    }
  };

  const handleSignProofOfAuthenticity = async () => {
    if (!metadataMedia || !fingerprint) {
      showAlertMessage(`You need to upload a track file.`, {
        variant: 'error'
      });
      return;
    }

    const targetChain = BlockchainNets.find(
      (net) => net.value === 'Polygon blockchain'
    );
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0x89);
      if (!isHere) {
        showAlertMessage('Got failed while switching over to target network', {
          variant: 'error'
        });
        return;
      }
    }

    const web3 = new Web3(library.provider);
    const signature = await web3.eth.personal.sign(
      fingerprint,
      account || '',
      ''
    );

    if (!signature) {
      showAlertMessage('Failed to sign the fingerprint.', { variant: 'error' });
      setIsSaving(false);
      return;
    }

    setMediaCopy({
      ...mediaCopy,
      proofOfAuthenticity: signature
    });
  };

  const ProgressScreen = () => (
    <>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Box className={classes.loadingContainer} mt={3} p={1}>
          <LoadingIcon />
        </Box>
      </Box>
      <Box className={classes.title} textAlign="center" mt={2}>
        Adding Track In Progress
      </Box>
      <Box className={classes.header1} textAlign="center" mt={2}>
        Transaction is proceeding on the {BlockchainNets[1].value}.
        <br /> This can take a moment, please be patient...
      </Box>
      {hash && (
        <>
          <CopyToClipboard text={hash}>
            <Box
              mt="20px"
              display="flex"
              alignItems="center"
              className={classes.header1}
              justifyContent="center"
            >
              Hash:
              <Box color={Color.Green} mr={1} ml={1}>
                {hash.substr(0, 18) + '...' + hash.substr(hash.length - 3, 3)}
              </Box>
              <CopyIcon />
            </Box>
          </CopyToClipboard>
          <PrimaryButton
            size="medium"
            style={{ background: Color.Green, marginTop: 24 }}
            isRounded
          >
            Check on Polygon Scan
          </PrimaryButton>
        </>
      )}
    </>
  );

  const SavedScreen = () => (
    <>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Box className={classes.succededContainer} mt={3} p={1}>
          <SuccededIcon />
        </Box>
      </Box>
      <Box className={classes.title} textAlign="center" mt={2}>
        Track NFT Created
      </Box>
      <Box className={classes.header1} textAlign="center" mt={2}>
        Transaction is proceeding on Polygon blockchain.
        <br /> This can take a moment, please be patient...
      </Box>
      <CopyToClipboard text={user.address}>
        <Box
          mt="20px"
          display="flex"
          alignItems="center"
          className={classes.header1}
          justifyContent="center"
        >
          Hash:
          <Box color={Color.Green} mr={1} ml={1}>
            {user.address.substr(0, 18) +
              '...' +
              user.address.substr(user.address.length - 3, 3)}
          </Box>
          <CopyIcon />
        </Box>
      </CopyToClipboard>
      <PrimaryButton
        size="medium"
        style={{ background: Color.MusicDAODark, marginTop: 24 }}
        isRounded
        onClick={handleClose}
      >
        Done
      </PrimaryButton>
    </>
  );

  const isFunded = useMemo(() => {
    if (pod && pod.FundingDate && pod.distributionProposalAccepted) {
      if (pod.RaisedFunds && pod.FundingTarget) {
        if (
          pod.FundingDate - new Date().getTime() / 1000 <= 0 &&
          pod.RaisedFunds >= pod.FundingTarget
        ) {
          return true;
        }
      }
    }
    return false;
  }, [pod]);

  return (
    <>
      {!openCreateDraftModal ? (
        <Modal
          className={classes.content}
          size="medium"
          isOpen={open}
          onClose={handleClose}
          showCloseIcon
        >
          {isMint ? (
            isSaving ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                {ProgressScreen()}
              </Box>
            ) : isSaved ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                {SavedScreen()}
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box className={classes.back} onClick={() => setIsMint(false)}>
                  <BackIcon />
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  marginBottom="34px"
                  justifyContent="center"
                >
                  <h3 style={{ margin: 0 }}>{`Create Track NFT`}</h3>
                </Box>
                <Box textAlign={'center'}>
                  <label style={{ color: '#54658F' }}>
                    You can directly mint your track NFT or create editable
                    Draft to share with friends & community, get feedback and
                    later mint it as NFT after it’s polished.
                  </label>
                </Box>
                <Box display="flex" mt={7}>
                  <PrimaryButton
                    size="medium"
                    isRounded
                    style={{
                      background: Color.MusicDAOGreen,
                      marginTop: '16px'
                    }}
                    disabled={!fingerprint || mediaCopy.proofOfAuthenticity}
                    onClick={handleSignProofOfAuthenticity}
                  >
                    Sign Proof of Authenticity
                  </PrimaryButton>
                  <PrimaryButton
                    size="medium"
                    isRounded
                    style={{
                      background: Color.MusicDAOGreen,
                      marginTop: '16px'
                    }}
                    disabled={!mediaCopy.proofOfAuthenticity}
                    onClick={handleUpload}
                  >
                    Create Track
                  </PrimaryButton>
                </Box>
              </Box>
            )
          ) : (
            <>
              <Box className={classes.title} textAlign="center" mt={2}>
                Edit Draft
              </Box>
              <Box mt={2}>
                <InputWithLabelAndTooltip
                  labelName="Track Name"
                  labelSuffix="*"
                  placeHolder="Track name here"
                  type="text"
                  disabled={true}
                  inputValue={mediaCopy.Title}
                  onInputValueChange={(e) =>
                    setMediaCopy({ ...mediaCopy, Title: e.target.value })
                  }
                  style={{ background: '#F0F5F5' }}
                />
              </Box>
              {mediaCopy.Artists?.featured?.length > 0 && (
                <Box mt={2}>
                  <Box className={classes.header1}>Artist</Box>
                  <Box
                    mt={1}
                    style={{
                      background:
                        'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {`${mediaCopy.Artists?.main[0]?.name ?? 'Main Artists'} ft 
                ${mediaCopy.Artists?.featured?.map(
                  (v, i) =>
                    v.name +
                    (i === mediaCopy.Artists.featured.length - 1 ? '' : ', ')
                )}`}
                  </Box>
                </Box>
              )}
              <Box mt={2}>
                {/* <Box className={classes.flexBox} justifyContent="space-between">
                  <Box className={classes.header1}>Description</Box>
                  <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                    <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                  </Tooltip>
                </Box> */}
                <InputWithLabelAndTooltip
                  labelName="Description"
                  labelSuffix="- Optional"
                  placeHolder="Write a description..."
                  type="textarea"
                  inputValue={mediaCopy.Description}
                  onInputValueChange={(e) =>
                    setMediaCopy({ ...mediaCopy, Description: e.target.value })
                  }
                  style={{ background: '#F0F5F5' }}
                />
              </Box>
              <Box mt={1}>
                <Box className={classes.label} mb={1}>
                  <div style={{ position: 'relative' }}>
                    Genre
                    <div style={{ position: 'absolute', top: 0, right: -10 }}>
                      *
                    </div>
                  </div>
                </Box>
                <Select
                  className={classes.input}
                  value={mediaCopy.Genre}
                  onChange={(e) =>
                    setMediaCopy({ ...mediaCopy, Genre: e.target.value })
                  }
                  displayEmpty={true}
                  renderValue={(value: any) =>
                    value ? value.toUpperCase() : 'Genre...'
                  }
                >
                  {MusicGenres.map((item, index) => (
                    <MenuItem value={item} key={`track-genre-${index}`}>
                      {item.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box mt={2}>
                <Box className={classes.label} mb={1}>
                  <div style={{ position: 'relative' }}>
                    Mood
                    <div style={{ position: 'absolute', top: 0, right: -10 }}>
                      *
                    </div>
                  </div>
                </Box>
                <Select
                  className={classes.input}
                  value={mediaCopy.Mood}
                  onChange={(e) =>
                    setMediaCopy({
                      ...mediaCopy,
                      Mood: e.target.value
                    })
                  }
                  displayEmpty={true}
                  renderValue={(value: any) =>
                    value ? (
                      <>
                        {MoodEmoji[Mood.findIndex((mood) => mood === value)]}
                        &nbsp;&nbsp;&nbsp;{value}
                      </>
                    ) : (
                      'Select track mood...'
                    )
                  }
                >
                  {Mood.map((item, index) => (
                    <MenuItem value={item} key={`track-mood-${index}`}>
                      {MoodEmoji[index]}&nbsp;&nbsp;&nbsp;{item}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box mt={2}>
                <InputWithLabelAndTooltip
                  theme="music dao"
                  type="text"
                  inputValue={mediaCopy.Label || ''}
                  onInputValueChange={(e) => {
                    setMediaCopy({
                      ...mediaCopy,
                      Label: e.target.value
                    });
                  }}
                  labelName="Label"
                  labelSuffix="- Optional"
                  placeHolder="Label name..."
                  tooltip={
                    'You can add your label here, if there is none, please indicate.'
                  }
                />
              </Box>
              <Box mt={2}>
                <Box className={classes.flexBox} justifyContent="space-between">
                  <label style={{ position: 'relative' }}>
                    Track Image
                    <div style={{ position: 'absolute', top: 0, right: -10 }}>
                      *
                    </div>
                  </label>
                  <InfoTooltip tooltip="Note: this is not going to be the image of your NFT, that is when you upload your track" />
                </Box>
                <Box
                  width={1}
                  className={mediaCover.uploadImg ? classes.uploadBox : ''}
                  mt={1}
                >
                  <FileUpload
                    theme="music dao"
                    photo={songImage}
                    photoImg={mediaCover.uploadImg}
                    setterPhoto={uploadSongImage}
                    setterPhotoImg={(value) => {
                      setMediaCover({ ...mediaCover, uploadImg: value });
                    }}
                    mainSetter={undefined}
                    mainElement={undefined}
                    type="image"
                    canEdit
                    isEditable
                    extra
                  />
                </Box>
              </Box>
              <Box mt={2}>
                <Box
                  className={classes.flexBox}
                  justifyContent="space-between"
                  mb={1}
                >
                  <label style={{ position: 'relative' }}>
                    Upload Track
                    <div style={{ position: 'absolute', top: 0, right: -10 }}>
                      *
                    </div>
                  </label>
                  <InfoTooltip tooltip="Your track will be encrypted into chunks and securely stored on IPFS, a distributed file storage system for Web 3, making it nearly impossible for someone to download your track and play it on another audio player. Your track will then be available to stream on Myx, where it will earn the owner(s) of this track" />
                </Box>
                <FileUpload
                  theme="music dao"
                  photo={song}
                  photoImg={mediaCover.uploadImg1}
                  setterPhoto={uploadSong}
                  setterPhotoImg={(value) => {
                    setMediaCover({ ...mediaCover, uploadImg1: value });
                  }}
                  mainSetter={undefined}
                  mainElement={undefined}
                  type="audio"
                  canEdit
                  isBitrate
                />
              </Box>
              <Box
                className={classes.footer}
                mt={3}
                style={{ justifyContent: 'end' }}
              >
                <Box className={classes.footerLeft}>
                  <Box className={classes.footerRight}>
                    <PrimaryButton
                      size="medium"
                      onClick={() => {
                        if (validate(false)) setOpenCreateDraftModal(true);
                      }}
                      isRounded
                      disabled={uploadingSong}
                    >
                      Save
                    </PrimaryButton>
                    {mediaCopy?.draftId && isFunded && (
                      <PrimaryButton
                        size="medium"
                        onClick={() => setIsMint(true)}
                        isRounded
                        disabled={uploadingSong || !song}
                      >
                        Upload
                      </PrimaryButton>
                    )}
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Modal>
      ) : (
        <DraftProgressingModal
          open={openCreateDraftModal}
          onClose={(isClose) => {
            setOpenCreateDraftModal(false);
            if (handleRefresh) {
              handleRefresh(
                mediaCopy,
                metadataPhoto,
                metadataMedia,
                fingerprint
              );
            }
            if (isClose) handleClose();
          }}
          onCreate={onSaveDraft}
          editing={media.metadataMedia ? true : false}
          isPublic={
            mediaCopy.isPublic === true || mediaCopy.isPublic === false
              ? mediaCopy.isPublic
              : true
          }
          setIsPublic={(value) =>
            setMediaCopy({
              ...mediaCopy,
              isPublic: value
            })
          }
        />
      )}
    </>
  );
};

const LoadingIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 112 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M66.8652 105.745C67.4512 108.558 65.6408 111.336 62.7858 111.652C55.3161 112.481 47.7364 111.826 40.4945 109.706C31.5837 107.097 23.4595 102.351 16.8415 95.8864C10.2236 89.4222 5.31629 81.4401 2.5542 72.6472C-0.207895 63.8543 -0.739476 54.5219 1.00654 45.4767C2.75256 36.4315 6.72228 27.9527 12.5641 20.7913C18.4059 13.63 25.9394 8.00711 34.4974 4.42078C43.0554 0.834452 52.3736 -0.604625 61.6268 0.23102C69.1311 0.908725 76.4046 3.06558 83.0269 6.55585C85.5824 7.90271 86.2438 11.1733 84.6467 13.5803C83.0679 15.9597 79.8765 16.5915 77.3252 15.3088C72.1429 12.7033 66.4951 11.0867 60.6771 10.5613C53.138 9.88043 45.5458 11.0529 38.573 13.975C31.6002 16.897 25.4622 21.4783 20.7025 27.3132C15.9428 33.148 12.7084 40.0562 11.2858 47.426C9.86318 54.7957 10.2963 62.3994 12.5468 69.5636C14.7972 76.7278 18.7956 83.2313 24.1876 88.4981C29.5797 93.7649 36.199 97.6323 43.4593 99.7579C49.0615 101.398 54.912 101.962 60.6982 101.437C63.5448 101.178 66.2822 102.947 66.8652 105.745Z"
      fill="url(#paint_loading_angular)"
    />
    <defs>
      <radialGradient
        id="paint_loading_angular"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(62.4503 65.2474) rotate(-64.8708) scale(84.9933 85.4796)"
      >
        <stop offset="0.0665921" stop-color="#B3FFD1" />
        <stop offset="0.392889" stop-color="#91E5D2" stop-opacity="0" />
        <stop offset="0.817708" stop-color="#A8DC1A" />
        <stop offset="0.984387" stop-color="#18CFA3" />
      </radialGradient>
    </defs>
  </svg>
);

const SuccededIcon = () => (
  <svg
    width="103"
    height="103"
    viewBox="0 0 103 103"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="51.5" cy="51.5" r="51.5" fill="#F2FBF6" />
    <path
      d="M37.7061 51.4688L46.9229 60.6856L65.294 42.3145"
      stroke="url(#paint_succeded_linear)"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint_succeded_linear"
        x1="39.7943"
        y1="50.7407"
        x2="63.7368"
        y2="55.5569"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.179206" stopColor="#A0D800" />
        <stop offset="0.852705" stopColor="#0DCC9E" />
      </linearGradient>
    </defs>
  </svg>
);

export default mediaCopyTermsModal;

const BackIcon = () => (
  <svg
    width="70"
    height="18"
    viewBox="0 0 70 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.99064 0.804494L8.81227 0.632272L8.64049 0.811075L1.02282 8.74038L0.858203 8.91173L1.02282 9.08308L8.64049 17.0124L8.80918 17.188L8.98738 17.0221L9.99153 16.0872L10.175 15.9164L10.0018 15.7352L4.37673 9.85157H68.9144H69.1617V9.60425V8.21921V7.97189H68.9144H4.37895L10.0013 2.12335L10.1723 1.94544L9.99479 1.77402L8.99064 0.804494Z"
      fill="#2D3047"
      stroke="#2D3047"
      strokeWidth="0.494654"
    />
  </svg>
);
