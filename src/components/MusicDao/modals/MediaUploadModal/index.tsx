import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import CopyToClipboard from 'react-copy-to-clipboard';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';

import { Color, Modal, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { InfoIcon } from 'shared/ui-kit/Icons';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import { InfoTooltip } from 'shared/ui-kit/InfoTooltip';
import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
import {
  getURLfromCID,
  getWaveDataURL,
  uploadNFTMetaData,
  getFileDuration
} from 'shared/functions/ipfs/upload2IPFS';
import {
  BlockchainNets,
  Mood,
  MoodEmoji,
  MusicGenres
} from 'shared/constants/constants';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { musicDaoSignProofOfAuthenticity } from 'shared/services/API';
import { useStreamingIPFS } from 'shared/functions/ipfs/upload2IPFS';
import { onGetNonDecrypt } from 'shared/ipfs/get';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import {
  onUploadNonEncrypt,
  onUploadStreamingMedia
} from '../../../../shared/ipfs/upload';
import URL from '../../../../shared/functions/getURL';
import { mediaUploadModalStyles } from './index.styles';
import { switchNetwork } from 'shared/functions/metamask';

import { ReactComponent as CopyIcon } from 'assets/icons/copy-icon.svg';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';

const multiAddr = getIPFSURL();

const MediaUploadModal = ({
  open,
  handleClose,
  pod,
  podInfo,
  media,
  handleRefresh
}) => {
  const classes = mediaUploadModalStyles();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [hash, setHash] = useState<string>('');
  const user = useTypedSelector(getUser);
  const { showAlertMessage } = useAlertMessage();

  const { account, library, chainId } = useWeb3React();

  const [songImage, setSongImage] = useState<any>(media?.InfoImage);
  const [song, setSong] = useState<any>();

  const [metadataPhoto, setMetadataPhoto] = useState<any>(media?.InfoImage);
  const [metadataMedia, setMetadataMedia] = useState<any>();
  const [fingerprint, setFingerprint] = useState<any>();
  const [chunksCID, setChunksCID] = useState<any>([]);

  const [mediaCover, setMediaCover] = useState<any>({});

  const { addStreamingMedia2IPFS } = useStreamingIPFS();

  const [fileIPFS, setFileIPFS] = useState<any>(null);

  const [songData, setSongData] = useState<any>({
    Artist: pod?.Collabs?.map((item) => item.name).join(', ') || '',
    Title: media?.Title || '',
    Genre: media?.Genre || '',
    Mood: ''
  });

  const { maxPrioFee } = useMaxPrioFee();

  const {
    setMultiAddr,
    uploadWithNonEncryption,
    downloadWithNonDecryption,
    setShowUploadingModal
  } = useIPFS();

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

    try {
      let waveDataURL;
      getWaveDataURL(value).then((resp) => {
        waveDataURL = resp;
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
      metadataMedia.metadata.properties.wave_data_url = waveDataURL;
      metadataMedia.metadata.animation_url = animation_url;
      const response = await musicDaoSignProofOfAuthenticity(value);
      if (response.success) { //&& response.fingerprint) {
        setFingerprint(response.fingerprint);
        setMetadataMedia(metadataMedia);
        setChunksCID(chunks);
        setSong(value);
      }
      setShowUploadingModal(false);
    } catch (err) {
      console.error('uploadSong', err);
      setShowUploadingModal(false);
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

    setSongData({
      ...songData,
      proofOfAuthenticity: signature
    });
  };

  const validate = () => {
    if (!songData.Title) {
      showAlertMessage(`Track Name is required`, { variant: 'error' });
      return false;
    } else if (!songData.Genre) {
      showAlertMessage(`Genre is required`, { variant: 'error' });
      return false;
    } else if (!songData.Mood) {
      showAlertMessage(`Mood is required`, { variant: 'error' });
      return false;
    } else if (!songData.Label) {
      showAlertMessage(`Label is required`, { variant: 'error' });
      return false;
    } else if (!songData.proofOfAuthenticity) {
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
    if (!validate()) return;

    setIsSaving(true);

    const metaData = {
      name: songData.Title,
      symbol: pod.TokenSymbol,
      description: media?.Description || '',
      animation_url: metadataMedia?.metadata?.animation_url,
      external_url: `${window.location.href}`,
      image: `${getURLfromCID(metadataPhoto.newFileCID)}/${
        metadataPhoto.metadata.properties.name
      }`,
      attributes: [
        {
          trait_type: 'Artists',
          value: songData.Artist
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
          trait_type: 'Label',
          value: songData.Label
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
          display_type: 'boost_percentage',
          trait_type: 'Royalty Share',
          value: +songData.Royalty
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
          value: songData.proofOfAuthenticity
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
          value: songData.Artist
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
      podAddress: pod.PodAddress,
      mediaId: media.id,
      uri: uri
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
        await axios.post(`${URL()}/mediaPod/media/saveMetadataIPFS`, {
          podId: pod.Id,
          mediaId: media.id,
          uri: albumUri,
          data: {
            ...songData,
            AlbumName: pod.Name,
            albumId: podInfo.nftContract,
            metadataPhoto,
            metadataMedia,
            fingerprint,
            uri,
            draft: false,
            nftAddress: podInfo.nftContract.toLowerCase(),
            ownerAddress: podInfo.distributionManagerAddress.toLowerCase(),
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

  const EditScreen = () => (
    <>
      <Box className={classes.title} mt={2}>
        <Box>Upload tracks to the Capsule</Box>
        <Box ml={2}>
          <InfoTooltip tooltip="When streamed, media fraction owners of this Capsule will earn revenue. All tracks that are uploaded are encrypted and stored decentrally using ipfs." />
        </Box>
      </Box>
      <Box mt={2}>
        <InputWithLabelAndTooltip
          theme="music dao"
          type="text"
          inputValue={songData.Title || ''}
          onInputValueChange={(e) => {
            setSongData({
              ...songData,
              Title: e.target.value
            });
          }}
          labelName="Track Name"
          placeHolder="Track Name"
        />
      </Box>
      <Box mt={2}>
        <Box className={classes.flexBox} justifyContent="space-between" mb={1}>
          <Box className={classes.header1}>Genre</Box>
        </Box>
        <Select
          className={classes.input}
          value={songData.Genre}
          onChange={(e) =>
            setSongData({
              ...songData,
              Genre: e.target.value
            })
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
        <Box className={classes.flexBox} justifyContent="space-between" mb={1}>
          <Box className={classes.header1}>Mood</Box>
        </Box>
        <Select
          className={classes.input}
          value={songData.Mood}
          onChange={(e) =>
            setSongData({
              ...songData,
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
          inputValue={songData.Label || ''}
          onInputValueChange={(e) => {
            setSongData({
              ...songData,
              Label: e.target.value
            });
          }}
          labelName="Label"
          placeHolder="Label name..."
          tooltip={`Please add a label if relevant. If there is no label please indicate`}
        />
      </Box>
      <Box mt={2}>
        <Box className={classes.flexBox} justifyContent="space-between">
          <Box className={classes.header1}>Track Image</Box>
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            title={
              'Note: this is not going to be the image of your NFT, that is when you upload your track'
            }
          >
            <InfoIcon style={{ color: '#2D3047', width: '14px' }} />
          </Tooltip>
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
        <Box className={classes.flexBox} justifyContent="space-between" mb={1}>
          <Box className={classes.header1}>Upload Track</Box>
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
        display="flex"
        alignItems="start"
        textAlign="start"
        style={{ fontSize: 14, color: '#54658F' }}
        mt={1}
      >
        <img src={require('assets/musicDAOImages/danger.webp')} />
        You can upload mp3, mp4 or .wav format. There is no file size limit,
        however if you upload long-form audio of any kind, depending on your
        network you can expect longer encryption and upload times, so please be
        patient
      </Box>
    </>
  );

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

  return (
    <>
      <Modal
        size="medium"
        isOpen={open}
        onClose={handleClose}
        showCloseIcon
        style={{ maxWidth: 755, textAlign: 'center' }}
      >
        {!isSaving && !isSaved
          ? EditScreen()
          : isSaving
          ? ProgressScreen()
          : SavedScreen()}
        {!isSaving && !isSaved && (
          <Box className={classes.footer} mt={3}>
            <Box className={classes.footerLeft}>
              <SecondaryButton size="medium" onClick={handleClose} isRounded>
                Cancel
              </SecondaryButton>
            </Box>
            <Box>
              <Box>
                <PrimaryButton
                  size="medium"
                  isRounded
                  onClick={handleSignProofOfAuthenticity}
                  disabled={!fingerprint || songData.proofOfAuthenticity}
                  style={{
                    background: Color.MusicDAOGreen,
                    // width: isMobile ? "auto" : "30%",
                    marginTop: '16px'
                  }}
                  title="A proof of authenticity verifies this action being taken on the blockchain with your address at this time. This information is attached to the asset. Helping to provide transparency and records of creation and ownership to music assets."
                >
                  Sign Proof of Authenticity
                </PrimaryButton>
                <PrimaryButton
                  size="medium"
                  isRounded
                  onClick={handleUpload}
                  disabled={!songData.proofOfAuthenticity}
                  style={{
                    background: Color.MusicDAOGreen,
                    // width: isMobile ? "auto" : "30%",
                    marginTop: '16px'
                  }}
                >
                  Upload
                </PrimaryButton>
              </Box>
            </Box>
          </Box>
        )}
      </Modal>
    </>
  );
};

export default MediaUploadModal;

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
