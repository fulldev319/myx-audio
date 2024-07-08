import React, { useState, useMemo, useEffect } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { isAddress } from 'ethers/lib/utils';
import { zeroAddress } from 'ethereumjs-util';
import { useHistory } from 'react-router-dom';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import NftTab from './components/NftTab';
import StreamingTab from './components/StreamingTab';
import RoyaltiesTab from './components/RoyaltiesTab';
import AlbumTab from './components/AlbumTab';
import UploadMediaTab from './components/UploadMediaTab';
import DraftSettingModalV2 from '../DraftSettingModalV2';
import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';

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
  getURLfromCID,
  uploadNFTMetaData,
  useStreamingIPFS,
  getWaveDataURL,
  getFileDuration
} from 'shared/functions/ipfs/upload2IPFS';
import URL from '../../../../shared/functions/getURL';
import TransactionProgressModal from '../TransactionProgressModal';
import { onUploadNonEncrypt, onUploadStreamingMedia } from 'shared/ipfs/upload';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { musicDaoSignProofOfAuthenticity } from 'shared/services/API';
import { switchNetwork } from 'shared/functions/metamask';
import {
  generateUniqueId,
  _arrayBufferToBase64
} from 'shared/functions/commonFunctions';
import { MusicGenres, Mood } from 'shared/constants/constants';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';
import { onGetNonDecrypt } from 'shared/ipfs/get';

import { useCreateSongStyles } from './index.styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import MintBatch from './components/MintBatch';
import ShareNFTBox from 'components/MusicDao/components/ShareNFTBox/indext';

const isProd = process.env.REACT_APP_ENV === 'prod';

const TabsSingleEdition = [
  {
    step: 'step 1',
    title: 'Streaming',
    marker: 'Streaming'
  },
  {
    step: 'step 2',
    title: 'Royalties ',
    marker: 'Royalties'
  },
  {
    step: 'step 3',
    title: 'Upload & Track details',
    marker: 'Upload'
  },
  {
    step: 'step 4',
    title: 'Select Collection',
    marker: 'Collection'
  }
];
const TabsMultiEdition = [
  {
    step: 'step 1',
    title: 'Which NFT type do you want?',
    marker: 'NFT'
  },
  {
    step: 'step 2',
    title: 'Streaming',
    marker: 'Streaming'
  },
  {
    step: 'step 3',
    title: 'Royalties ',
    marker: 'Royalties'
  },
  {
    step: 'step 4',
    title: 'Upload & Track details',
    marker: 'Upload'
  },
  {
    step: 'step 5',
    title: 'Select Collection',
    marker: 'Collection'
  }
];

const BATCH_NUM = 20;

const DEFAULT_DATA_SINGLE = {
  isAlbum: true,
  albumId: '',
  AlbumName: '',
  albumDescription: '',
  albumImage: '',
  Network: BlockchainNets[1].name, //"POLYGON",
  Genre: '',
  Mood: '',
  isRoyaltyShare: false,
  royaltyShare: 0,
  type: 'ERC721',
  isMakeStreaming: true,
  amount: 0
};
const DEFAULT_DATA_MULTIPLE = {
  isAlbum: true,
  albumId: '',
  AlbumName: '',
  albumDescription: '',
  albumImage: '',
  Network: BlockchainNets[1].name, //"POLYGON",
  Genre: '',
  Mood: '',
  isRoyaltyShare: false,
  royaltyShare: 0,
  type: 'BATCH_ERC721',
  isMakeStreaming: true,
  editionType: 'Regular',
  amount: 2,
  edition: 'Bronze'
};
export type MintEditionStepType = {
  id: number;
  name: string;
  status: number; // 0-disabled, 1-can mint, 2-minted, 3-failed and mint again
  hash: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  handleRefresh: any;
  editMode?: boolean;
  mintMode?: boolean;
  draft?: any;
  updateSongData?: (data: any) => void;
  type?: ContentType;
};

export default function CreateSongModalNew({
  open,
  onClose,
  handleRefresh,
  editMode,
  draft,
  mintMode,
  updateSongData,
  type
}: Props) {
  const classes = useCreateSongStyles();
  const user = useTypedSelector(getUser);
  const history = useHistory();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const [isDraftCreating, setIsDraftCreating] = useState<boolean>(false);
  const [isDraftFinished, setIsDraftFinished] = useState<boolean>(false);

  const { showAlertMessage } = useAlertMessage();
  const [page, setPage] = useState(mintMode ? 4 : 0);
  const [pageValidations, setPageValidations] = useState<boolean[]>([]);

  const { maxPrioFee } = useMaxPrioFee();

  const [songData, setSongData] = useState<any>(
    type === ContentType.SongSingleEdition
      ? DEFAULT_DATA_SINGLE
      : DEFAULT_DATA_MULTIPLE
  );

  const [hash, setHash] = useState<string>('');
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [isTransaction, setIsTransaction] = useState<boolean>(false);

  const [editionHash, setEditionHash] = useState<string>('');
  const [editionTransactionSuccess, setEditionTransactionSuccess] = useState<
    boolean | null
  >(null);
  const [openEditionTransactionModal, setOpenEditionTransactionModal] =
    useState<boolean>(false);

  const [albumImage, setAlbumImage] = useState<any>();

  const [songImage, setSongImage] = useState<any>();
  const [song, setSong] = useState<any>();
  const [fileIPFS, setFileIPFS] = useState<any>(null);

  const [metadataAlbumPhoto, setMetadataAlbumPhoto] = useState<any>();
  const [metadataPhoto, setMetadataPhoto] = useState<any>();
  const [metadataMedia, setMetadataMedia] = useState<any>();
  const [fingerprint, setFingerprint] = useState<any>();
  const [chunksCID, setChunksCID] = useState<any>([]);
  const [isMint, setIsMint] = useState<boolean>(false);
  const [isMintBatch, setIsMintBatch] = useState<boolean>(false);

  const [mediaCover, setMediaCover] = useState<any>({});

  const [openCreateDraftModal, setOpenCreateDraftModal] =
    useState<boolean>(false);
  const [openCloseMintingModal, setOpenCloseMintingModal] =
    useState<boolean>(false);

  const { account, library, chainId } = useWeb3React();

  const { addStreamingMedia2IPFS } = useStreamingIPFS();
  const {
    uploadWithNonEncryption,
    downloadWithNonDecryption,
    setShowUploadingModal
  } = useIPFS();

  // Status for batch modal
  const [mintedMaster, setMintedMaster] = useState<boolean>(false);
  const [mintedEditionSteps, setMintedEditionSteps] = useState<
    MintEditionStepType[]
  >([]);
  const [songId, setSongId] = useState<string>();
  const [identifier, setIdentifier] = useState<string>();

  const artist = useMemo(
    () => `${user?.firstName ?? ''} ${user?.lastName ?? ''}`,
    [user]
  );

  const [songType, setSongType] = React.useState<ContentType>(
    type ?? ContentType.SongSingleEdition
  ); // investment, collaborative
  const Tabs = React.useMemo(() => {
    return songType === ContentType.SongSingleEdition
      ? TabsSingleEdition
      : TabsMultiEdition;
  }, [songType]);

  const [metadataPremiumPhoto, setMetadataPremiumPhoto] = useState<any>();

  useEffect(() => {
    validatePage();
  }, [
    songData,
    metadataAlbumPhoto,
    metadataPhoto,
    metadataMedia,
    metadataPremiumPhoto
  ]);

  // If Edit mode, then set draft as songData
  useEffect(() => {
    if (open === true && draft && editMode === true) {
      const { Id, ...rest } = draft;
      setSongData(rest);

      setSongImage(draft.metadataPhoto);
      setSong({ name: draft.metadataMedia?.metadata?.properties.name });
      setMetadataPhoto(draft.metadataPhoto);
      setMetadataMedia(draft.metadataMedia);
      setMetadataPremiumPhoto(draft.metadataPremiumPhoto);
      setFingerprint(draft.fingerprint);
    }
    if (open === false) {
      setSongData(
        type === ContentType.SongSingleEdition
          ? DEFAULT_DATA_SINGLE
          : DEFAULT_DATA_MULTIPLE
      );

      setSongImage(null);
      setSong(null);
      setMetadataPhoto(null);
      setMetadataPremiumPhoto(null);
      setMetadataMedia(null);
      setFingerprint(null);
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

  useEffect(() => {
    if (songData.amount === 0) {
      setMintedEditionSteps([]);
      return;
    }

    const result: MintEditionStepType[] = [];

    let i;
    for (i = 0; i * BATCH_NUM < songData.amount; i++) {
      result.push({
        id: i,
        name:
          i * BATCH_NUM + 1 === songData.amount
            ? `Batch ${i * BATCH_NUM + 1}`
            : (i + 1) * BATCH_NUM < songData.amount
            ? `Batch ${i * BATCH_NUM + 1}-${(i + 1) * BATCH_NUM}`
            : `Batch ${i * BATCH_NUM + 1}-${songData.amount}`,
        status: 0,
        hash: ''
      });
    }

    setMintedEditionSteps(result);
  }, [songData.amount]);

  const uploadAlbumImage = async (value) => {
    setAlbumImage(value);
    let metadataAlbumPhoto = await onUploadNonEncrypt(value, (file) =>
      uploadWithNonEncryption(file)
    );
    setMetadataAlbumPhoto(metadataAlbumPhoto);
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
      if (response.success && response.fingerprint) {
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

  const songMetaData = useMemo(() => {
    let metaData: any = {};
    if (metadataPhoto && metadataMedia) {
      metaData = {
        name: songData.Title,
        symbol: songData.Title,
        description: '',
        external_url: `${window.location.href}`,
        animation_url: metadataMedia?.metadata?.animation_url,
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
            trait_type: 'isAlbum',
            value: songData.isAlbum
          },
          {
            trait_type: 'AlbumName',
            value: songData.AlbumName
          },
          {
            trait_type: 'albumDescription',
            value: songData.albumDescription
          },
          {
            trait_type: 'albumImage',
            value: metadataAlbumPhoto
              ? `${getURLfromCID(metadataAlbumPhoto.newFileCID)}/${
                  metadataAlbumPhoto.metadata.properties.name
                }`
              : null
          },
          {
            trait_type: 'editionType',
            value: songData.editionType
          },
          {
            trait_type: 'edition',
            value: songData.edition
          },
          {
            trait_type: 'editionNFTs',
            value: songData.editionNFTs
          },
          {
            trait_type: 'streamingShare',
            value: songData.streamingShare
          },
          {
            trait_type: 'songEditions',
            value: songData.songEditions
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
      // if (songData.editionType === 'Regular') {
      //   metaData.attributes = [
      //     ...metaData.attributes,
      //     {
      //       trait_type: 'regularEditionNFTs',
      //       value: songData.regularEditionNFTs
      //     },
      //     {
      //       trait_type: 'songEditions',
      //       value: songData.regularEditionNFTs
      //     }
      //   ];
      // } else {
      //   // premium
      //   metaData.attributes = [
      //     ...metaData.attributes,
      //     {
      //       trait_type: 'bronzeEditionNFTs',
      //       value: songData.bronzeEditionNFTs
      //     },
      //     {
      //       trait_type: 'bronzeStreamingShare',
      //       value: songData.bronzeStreamingShare
      //     },
      //     {
      //       trait_type: 'silverEditionNFTs',
      //       value: songData.bronzeEditionNFTs
      //     },
      //     {
      //       trait_type: 'silverStreamingShare',
      //       value: songData.bronzeStreamingShare
      //     },
      //     {
      //       trait_type: 'goldEditionNFTs',
      //       value: songData.bronzeEditionNFTs
      //     },
      //     {
      //       trait_type: 'goldStreamingShare',
      //       value: songData.bronzeStreamingShare
      //     },
      //     {
      //       trait_type: 'platinumEditionNFTs',
      //       value: songData.bronzeEditionNFTs
      //     },
      //     {
      //       trait_type: 'platinumStreamingShare',
      //       value: songData.bronzeStreamingShare
      //     },
      //     {
      //       trait_type: 'songEditions',
      //       value:
      //         songData.bronzeEditionNFTs +
      //         songData.silverEditionNFTs +
      //         songData.goldEditionNFTs +
      //         songData.platinumEditionNFTs
      //     }
      //   ];
      // }
    }
    return metaData;
  }, [songData, metadataMedia, metadataPhoto, artist, fingerprint, chunksCID]);

  const albumMetaData = useMemo(
    () => ({
      name: songData.AlbumName,
      symbol: songData.Symbol,
      description: songData.albumDescription,
      external_url: `${window.location.href}`,
      image: metadataAlbumPhoto
        ? `${getURLfromCID(metadataAlbumPhoto.newFileCID)}/${
            metadataAlbumPhoto.metadata.properties.name
          }`
        : null,
      attributes: [
        {
          trait_type: 'Artists',
          value: artist
        },
        {
          display_type: 'date',
          trait_type: 'Release Date',
          value: Math.floor(Date.now() / 1000)
        }
      ]
    }),
    [songData, metadataAlbumPhoto, artist]
  );

  const validatePage = () => {
    let validationStatus =
      songType === ContentType.SongSingleEdition
        ? [true, true, true, true]
        : [true, true, true, true, true];
    if (
      songData.type === 'BATCH_ERC721' &&
      (songData.amount === 0 || !songData.amount)
    ) {
      validationStatus[0] = false;
      // showAlertMessage(`NFT count is required`, { variant: "error" });
      // return false;
    }
    if (songData.editionType === 'Premium' && !metadataPremiumPhoto) {
      validationStatus[0] = false;
    }
    if (
      songData.isRoyaltyShare &&
      (!songData.royaltyShare ||
        !(
          Number(songData.royaltyShare) >= 0 &&
          Number(songData.royaltyShare <= 100)
        ))
    ) {
      if (songType === ContentType.SongSingleEdition)
        validationStatus[1] = false;
      else validationStatus[2] = false;
      // showAlertMessage(`Royalty Share is not correct`, { variant: "error" });
      // return false;
    } else if (songData.isRoyaltyShare && !songData.royaltyRecipientAddress) {
      if (songType === ContentType.SongSingleEdition)
        validationStatus[1] = false;
      else validationStatus[2] = false;
      // showAlertMessage(`Royalty Recipient Address is required`, { variant: "error" });
      // return false;
    } else if (
      songData.isRoyaltyShare &&
      !isValidAddress(songData.royaltyRecipientAddress)
    ) {
      if (songType === ContentType.SongSingleEdition)
        validationStatus[1] = false;
      else validationStatus[2] = false;
      // showAlertMessage(`Royalty Recipient Address is invalid`, { variant: "error" });
      // return false;
    }
    if (!songData.Title) {
      if (songType === ContentType.SongSingleEdition)
        validationStatus[2] = false;
      else validationStatus[3] = false;
      // showAlertMessage(`Track Name is required`, { variant: "error" });
      // return false;
    } else if (!songData.Genre) {
      if (songType === ContentType.SongSingleEdition)
        validationStatus[2] = false;
      else validationStatus[3] = false;
      // showAlertMessage(`Genre is required`, { variant: "error" });
      // return false;
    } else if (!songData.Mood) {
      if (songType === ContentType.SongSingleEdition)
        validationStatus[2] = false;
      else validationStatus[3] = false;
      // showAlertMessage(`Mood is required`, { variant: "error" });
      // return false;
    }
    if (!metadataMedia) {
      if (songType === ContentType.SongSingleEdition)
        validationStatus[2] = false;
      else validationStatus[3] = false;
      // showAlertMessage(`You need to upload a track file.`, { variant: "error" });
      // return false;
    } else if (!metadataPhoto) {
      if (songType === ContentType.SongSingleEdition)
        validationStatus[2] = false;
      else validationStatus[3] = false;
      // showAlertMessage(`You need to upload Track Image.`, { variant: "error" });
      // return false;
    }
    if (!songData.AlbumName) {
      if (songType === ContentType.SongSingleEdition)
        validationStatus[3] = false;
      else validationStatus[4] = false;
      // showAlertMessage(`Collection Name is required`, { variant: "error" });
      // return false;
    } else if (!songData.albumId) {
      // now creating new collection
      if (!songData.albumDescription) {
        if (songType === ContentType.SongSingleEdition)
          validationStatus[3] = false;
        else validationStatus[4] = false;
        // showAlertMessage(`Collection Description is required`, { variant: "error" });
        // return false;
      } else if (!songData.Symbol) {
        if (songType === ContentType.SongSingleEdition)
          validationStatus[3] = false;
        else validationStatus[4] = false;
        // showAlertMessage(`Collection Symbol is required`, { variant: "error" });
        // return false;
      } else if (!metadataAlbumPhoto) {
        if (songType === ContentType.SongSingleEdition)
          validationStatus[3] = false;
        else validationStatus[4] = false;
        // showAlertMessage(`Collection Image is required`, { variant: "error" });
        // return false;
      }
    }
    setPageValidations(validationStatus);
  };

  const validate = () => {
    if (
      songData.type === 'BATCH_ERC721' &&
      (!songData.amount || songData.amount == 0)
    ) {
      showAlertMessage(`You need to set amount of tracks.`, {
        variant: 'error'
      });
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
    } else if (songData.isRoyaltyShare && !songData.royaltyRecipientAddress) {
      showAlertMessage(`Royalty Recipient Address is required`, {
        variant: 'error'
      });
      return false;
    } else if (
      songData.isRoyaltyShare &&
      !isValidAddress(songData.royaltyRecipientAddress)
    ) {
      showAlertMessage(`Royalty Recipient Address is invalid`, {
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
    } else if (songData.isAlbum && !songData.albumId && !songData.Symbol) {
      showAlertMessage(`Collection symbol is required`, { variant: 'error' });
      return false;
    } else if (songData.isAlbum && !songData.albumId && !songData.AlbumName) {
      showAlertMessage(`You need to upload Collection Name.`, {
        variant: 'error'
      });
      return false;
    } else if (
      songData.isAlbum &&
      !songData.albumId &&
      !songData.albumDescription
    ) {
      showAlertMessage(`You need to upload Collection Description.`, {
        variant: 'error'
      });
      return false;
    } else if (songData.isAlbum && !songData.albumId && !metadataAlbumPhoto) {
      showAlertMessage(`You need to upload Collection Image.`, {
        variant: 'error'
      });
      return false;
    }

    return true;
  };

  const isValidAddress = (address) => {
    const web3 = new Web3(library.provider);
    return web3.utils.isAddress(address);
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
      setTransactionSuccess(false);
      return;
    }

    setSongData({
      ...songData,
      proofOfAuthenticity: signature
    });
  };

  const handleMint = () => {
    if (!validate()) return;
    setIsMint(true);

    // setIsMintBatch(true);
    // setIsTransaction(true);
    // setTransactionSuccess(true);
  };

  const handleCreateAlbum = async (id) => {
    const albumUri = (await uploadNFTMetaData(albumMetaData)).uri;

    await axios.post(`${URL()}/musicDao/createAlbum`, {
      data: {
        id,
        name: songData.AlbumName,
        symbol: songData.Symbol,
        description: songData.albumDescription,
        image: `${getURLfromCID(metadataAlbumPhoto.newFileCID)}/${
          metadataAlbumPhoto.metadata.properties.name
        }`,
        chain: songData.Network,
        uri: albumUri
      }
    });
  };

  const handleCreateDraft = async (isPublic: boolean = true) => {
    const ownerAddress = account || user.address; // sometimes account is undefined

    if (!ownerAddress || !validate()) {
      return;
    }

    setIsDraftCreating(true);
    const songUri = (await uploadNFTMetaData(songMetaData)).uri;

    let albumId = songData.albumId;

    // If creating album
    if (songData.isAlbum && (!albumId || albumId.length < 1)) {
      albumId = generateUniqueId();

      await handleCreateAlbum(albumId);
    }

    const songNFTData = await axios.post(`${URL()}/musicDao/createSongNFT`, {
      data: {
        ...songData,
        genreId: (MusicGenres.indexOf(songData.Genre) + 1)
          .toString()
          .padStart(2, '0'),
        moodId: (Mood.indexOf(songData.Mood) + 1).toString().padStart(2, '0'),
        albumId,
        metadataAlbumPhoto,
        metadataPhoto,
        metadataMedia,
        fingerprint,
        uri: songUri,
        draft: true,
        isPublic,
        ownerAddress: ownerAddress.toLowerCase(),
        nftAddress: albumId.toLowerCase(),
        hash: '',
        isPod: false,
        metadataPremiumPhoto
      }
    });

    setIsDraftFinished(true);
    setIsDraftCreating(false);
    setSongId(songNFTData.data.data);
  };

  const handleUpdateDraft = async (isPublic: boolean = true) => {
    const ownerAddress = account || user.address; // sometimes account is undefined

    if (!ownerAddress || !validate()) {
      return;
    }

    setIsDraftCreating(true);
    const songUri = (await uploadNFTMetaData(songMetaData)).uri;

    let albumId = songData.albumId;

    // If creating album
    if (songData.isAlbum && (!albumId || albumId.length < 1)) {
      albumId = generateUniqueId();

      await handleCreateAlbum(albumId);
    }

    await axios.post(`${URL()}/musicDao/song/draft/update`, {
      data: {
        ...songData,
        genreId: (MusicGenres.indexOf(songData.Genre) + 1)
          .toString()
          .padStart(2, '0'),
        moodId: (Mood.indexOf(songData.Mood) + 1).toString().padStart(2, '0'),
        albumId,
        metadataAlbumPhoto,
        metadataPhoto,
        metadataMedia,
        fingerprint,
        uri: songUri,
        draft: true,
        isPublic,
        ownerAddress,
        nftAddress: albumId.toLowerCase(),
        hash: '',
        isPod: false
      }
    });

    updateSongData && updateSongData(songData);

    setIsDraftFinished(true);
    setIsDraftCreating(false);
  };

  const handleMintMaster = async () => {
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

    setIsTransaction(true);

    const songUri = (await uploadNFTMetaData(songMetaData)).uri;
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    try {
      let response;

      let albumId = songData.albumId;
      if (isAddress(albumId)) {
        response = await web3APIHandler.Erc721WithRoyalty.mintMasterNFT(
          web3,
          account!,
          {
            contractAddress: songData.albumId,
            to: account,
            songData: {
              isStreaming: songData.isMakeStreaming,
              quantityPerCategory: [
                songData.type === 'BATCH_ERC721' ? +songData.amount : 0,
                0,
                0,
                0,
                0
              ],
              tokenURIs: [
                songData.type === 'BATCH_ERC721' ? songUri : '',
                '',
                '',
                '',
                '',
                songUri
              ]
            },
            royaltyData: {
              royaltyPercent: +songData.royaltyShare * 100,
              royaltyRecipient: songData.isRoyaltyShare
                ? songData.royaltyRecipientAddress
                : zeroAddress(),
              proofOfAuthenticity: songData.proofOfAuthenticity
            }
          },
          setHash,
          maxPrioFee
        );
      } else {
        const symbol = await axios
          .get(`${URL()}/musicDao/getAlbumSymbolIdFromId/${songData.albumId}`)
          .then((res) => {
            if (res.data.success) {
              return res.data.symbol;
            }
            return '';
          })
          .catch((e) => {
            console.log('Error: getting Symbol');
            return '';
          });

        response = await web3APIHandler.RoyaltyFactory.mintMaster(
          web3,
          account!,
          {
            name: songData.AlbumName,
            symbol: symbol,
            songData: {
              isStreaming: songData.isMakeStreaming,
              quantityPerCategory: [
                songData.type === 'BATCH_ERC721' ? +songData.amount : 0,
                0,
                0,
                0,
                0
              ],
              tokenURIs: [
                songData.type === 'BATCH_ERC721' ? songUri : '',
                '',
                '',
                '',
                '',
                songUri
              ]
            },
            royaltyData: {
              royaltyPercent: +songData.royaltyShare * 100,
              royaltyRecipient: songData.isRoyaltyShare
                ? songData.royaltyRecipientAddress
                : zeroAddress(),
              proofOfAuthenticity: songData.proofOfAuthenticity
            }
          },
          setHash,
          maxPrioFee
        );
        if (!albumId) {
          albumId = response.data.nftAddress.toLowerCase();
          await handleCreateAlbum(albumId);
          setSongData({ ...songData, albumId });
        } else {
          albumId = response.data.nftAddress.toLowerCase();
          await axios.post(`${URL()}/musicDao/updateAlbumId`, {
            oldId: songData.albumId,
            id: albumId
          });
          songData.albumId = albumId;
        }
      }
      if (response.success) {
        setTransactionSuccess(true);

        if (songData.type === 'BATCH_ERC721') {
          // Enable the first mint edition step.
          const tSteps = [...mintedEditionSteps];

          tSteps[0].status = 1;

          setMintedEditionSteps([tSteps[0], ...tSteps.slice(1)]);
          setMintedMaster(true);
          setSongId(response.data.songId);
        }

        const {
          AlbumName,
          albumDescription,
          albumImage,
          amount,
          isMakeStreaming,
          isRoyaltyShare,
          royaltyShare,
          Title,
          ...data
        } = songData;

        await axios.post(`${URL()}/musicDao/createSongNFT`, {
          data: {
            ...data,
            genreId: (MusicGenres.indexOf(songData.Genre) + 1)
              .toString()
              .padStart(2, '0'),
            moodId: (Mood.indexOf(songData.Mood) + 1)
              .toString()
              .padStart(2, '0'),
            albumId,
            fingerprint,
            draft: false,
            category:
              songData.editionType === 'Premium'
                ? songData.edition
                : songData.isMakeStreaming
                ? 'Streaming'
                : 'Normal',
            nftAddress: (response.data.nftAddress || albumId).toLowerCase(),
            ownerAddress: account?.toLowerCase(),
            tokenId: response.data.tokenId || '1',
            isPod: false
          }
        });

        setIdentifier(
          `${(response.data.nftAddress || albumId).toLowerCase()}${
            response.data.tokenId || '1'
          }`
        );

        if (draft && draft.Id) {
          await axios.post(`${URL()}/musicDao/song/draft/delete`, {
            id: draft.Id,
            ownerAddress: account
          });
        }

        updateSongData && updateSongData(songData);
        handleRefresh();

        if (songData.type === 'BATCH_ERC721') {
          setHash('');
          setTransactionSuccess(null);
          setIsTransaction(false);
        }
      } else {
        showAlertMessage('Failed to mint batch', { variant: 'error' });
        setTransactionSuccess(false);
      }
    } catch (err) {
      console.log(err);
      showAlertMessage('Failed to mint batch', { variant: 'error' });
      setTransactionSuccess(false);
    }
  };

  const handleMintEditions = async (batchId: number) => {
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

    setOpenEditionTransactionModal(true);

    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    try {
      let response;

      response = await web3APIHandler.Erc721WithRoyalty.mintEditions(
        web3,
        account!,
        {
          contractAddress: songData.albumId,
          songId: songId
        },
        setEditionHash,
        maxPrioFee
      );
      if (response.success) {
        setEditionTransactionSuccess(true);

        // Enable next step to mint
        let tSteps: MintEditionStepType[] = [];
        mintedEditionSteps.forEach((step, index) => {
          let tStep: MintEditionStepType = { ...step };
          if (index === batchId) {
            tStep.status = 2;
            tStep.hash = response.data.hash;
          }
          if (index === batchId + 1 && step.status === 0) {
            tStep.status = 1;
          }
          tSteps.push(tStep);
        });
        setMintedEditionSteps(tSteps);

        console.log(batchId, tSteps);
        await axios.post(`${URL()}/musicDao/batchSongNFTEditions`, {
          data: {
            collectionAddress: songData.albumId,
            songId: identifier,
            tokenIds: response.data.tokenIds,
            ownerAddress: account?.toLowerCase(),
            hash: response.data.hash,
            incrementalInitialId: batchId * BATCH_NUM + 1,
            category:
              songData.editionType === 'Premium'
                ? songData.edition
                : songData.isMakeStreaming
                ? 'Streaming'
                : 'Normal',
            mintStep: tSteps[batchId],
            batchSongId: songId
          }
        });
        setEditionHash('');
        setEditionTransactionSuccess(null);
        setOpenEditionTransactionModal(false);

        handleRefresh();
      } else {
        // Update edition step to failed status
        let tSteps: MintEditionStepType[] = [];
        mintedEditionSteps.forEach((step, index) => {
          let tStep: MintEditionStepType = { ...step };
          if (index === batchId) tStep.status = 3;
          tSteps.push(tStep);
        });

        showAlertMessage('Failed to mint batch', { variant: 'error' });
        setEditionTransactionSuccess(false);
      }
    } catch (err) {
      console.log(err);
      showAlertMessage('Failed to upload media', { variant: 'error' });
      setEditionTransactionSuccess(false);
    }
  };

  const handleCreateSong = async () => {
    if (songData.type === 'BATCH_ERC721') {
      setIsMintBatch(true);
      return;
    }

    handleMintMaster();
  };

  const onCheckProfile = () => {
    if (!editMode) {
      history.push(`/profile/${user.urlSlug}`);
    }
    onClose();
  };

  const handleOpenTx = () => {
    if (songData.Network && songData.Network.length > 0) {
      if (songData.Network.toLowerCase().includes('polygon')) {
        window.open(
          `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/tx/${hash}`,
          '_blank'
        );
      } else if (songData.Network.toLowerCase().includes('ethereum')) {
        window.open(
          `https://${!isProd ? 'rinkeby.' : ''}etherscan.io/tx/${hash}`,
          '_blank'
        );
      }
    } else {
      window.open(
        `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/tx/${hash}`,
        '_blank'
      );
    }
  };

  const uploadEditionImg = async (value) => {
    let metadataPhoto = await onUploadNonEncrypt(value, (file) =>
      uploadWithNonEncryption(file)
    );
    setMetadataPremiumPhoto(metadataPhoto);
  };

  const handleClose = () => {
    if (
      mintedMaster &&
      (!mintedEditionSteps ||
        mintedEditionSteps[mintedEditionSteps?.length - 1].status !== 2)
    ) {
      setOpenCloseMintingModal(true);
    } else onClose();
  };

  // if (isMintBatch) {
  //   return (
  //     <SignAllBatchModal
  //       open={isMintBatch}
  //       onClose={() => {
  //         setIsMintBatch(false);
  //         onClose();
  //       }}
  //       isStreaming={songData.isMakeStreaming}
  //       onMintMaster={handleMintMaster}
  //       onMintEditions={handleMintEditions}
  //       mintedMaster={mintedMaster}
  //       mintedEditionSteps={mintedEditionSteps}
  //     />
  //   );
  // }

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={handleClose}
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
          <div
            style={
              isMobile
                ? {}
                : {
                    width:
                      songType === ContentType.SongSingleEdition ? 200 : 300
                  }
            }
          >
            {songType === ContentType.SongSingleEdition
              ? 'Create 1/1 Song'
              : 'Create Multiple Editions'}
          </div>
          {!isMobile && !isMintBatch && (
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
                        if (isDraftCreating || isDraftFinished) return;
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
                      songType === ContentType.SongSingleEdition ? 200 : 300
                  }
            }
          />
        </Box>

        {isDraftCreating ? (
          <Box className={classes.resultSection}>
            <Box
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center'
              }}
              mb={5}
            >
              <img
                className={classes.loader}
                src={require('assets/musicDAOImages/loading.webp')}
              />
              <div className={classes.ethImg}>
                {/* {!editing && (
                  <img src={require("assets/musicDAOImages/eth.webp")} />
                )} */}
              </div>
            </Box>
            <Box className={classes.title} mb={1.5}>
              {editMode ? 'Modifying Draft...' : 'Creating Draft...'}
            </Box>
            <Box className={classes.description} mb={4}>
              {editMode
                ? 'We are modifying your draft on Myx.\nThis can take a moment, please be patient...'
                : 'We are creating your draft on Myx.\nThis can take a moment, please be patient...'}
            </Box>
          </Box>
        ) : isDraftFinished ? (
          <Box className={classes.resultSection}>
            <Box className={classes.check} mb={5}>
              <CheckIcon />
            </Box>
            <Box className={classes.title} mb={1.5}>
              {editMode ? 'Update Complete' : 'Success!'}
            </Box>
            <Box className={classes.description} mb={4}>
              {editMode ? 'Draft Modified' : 'Your draft has been created'}
            </Box>
            <PrimaryButton
              size="medium"
              className={classes.checkButton}
              onClick={onCheckProfile}
            >
              {editMode ? 'Close' : 'Go To Profile'}
            </PrimaryButton>
            {songId && (
              <ShareNFTBox
                shareLink={`${window.location.origin}/#/music/track/${songId}`}
              />
            )}
          </Box>
        ) : isTransaction ? (
          <Box className={classes.resultSection}>
            <Box
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center'
              }}
              mb={5}
            >
              {transactionSuccess === true ? (
                <img
                  className={mediaCover.uploadImg ? classes.imgSuccess : ''}
                  src={
                    mediaCover.uploadImg ??
                    require('assets/musicDAOImages/result_success.webp')
                  }
                />
              ) : transactionSuccess === false ? (
                <img src={require('assets/musicDAOImages/result_fail.webp')} />
              ) : (
                <div style={{ position: 'relative' }}>
                  <img
                    className={classes.loader}
                    src={require('assets/musicDAOImages/loading.webp')}
                  />
                  <div className={classes.ethImg}>
                    <img src={require('assets/musicDAOImages/eth.webp')} />
                  </div>
                </div>
              )}
            </Box>
            <Box className={classes.title} mb={1.5}>
              {transactionSuccess === true
                ? 'Transaction successful'
                : transactionSuccess === false
                ? 'Transaction failed'
                : 'Adding Song in Progress'}
            </Box>
            <Box className={classes.description} mb={4}>
              {transactionSuccess === true
                ? 'Cool! Everything wen’t well and you can enjoy your purchase, \nshare it and let it out in the world!'
                : transactionSuccess === false
                ? 'Unfortunatelly transaction didn’t went through, please try again later. \nYou can check your transaction link below.'
                : ` Transaction is proceeding on ${songData.Network} Chain. \n This can take a moment, please be patient...`}
            </Box>
            {hash && (
              <>
                <CopyToClipboard
                  text={hash}
                  onCopy={() => {
                    showAlertMessage('Copied to clipboard', {
                      variant: 'success'
                    });
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    style={{ cursor: 'pointer' }}
                  >
                    <Box className={classes.description} mr={2}>
                      Hash:
                    </Box>
                    <Box
                      className={classes.description}
                      ml={1}
                      mr={1}
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#65CB63'
                      }}
                    >
                      {hash.substr(0, 18) +
                        '...' +
                        hash.substr(hash.length - 3, 3)}
                    </Box>
                    <CopyIcon />
                  </Box>
                </CopyToClipboard>
                <PrimaryButton
                  size="medium"
                  style={{ background: Color.MusicDAOGreen, marginTop: '24px' }}
                  isRounded
                  onClick={handleOpenTx}
                >
                  Check on {songData.Network} Scan
                </PrimaryButton>
              </>
            )}
          </Box>
        ) : (
          <>
            <div className={classes.workSpace}>
              <div className={classes.content}>
                {isMobile && !isMintBatch && (
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
                              if (isDraftCreating || isDraftFinished) return;
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
                  <h5>{isMintBatch ? 'minting' : Tabs[page].step}</h5>
                  <h3>
                    {isMintBatch ? 'Let’s mint your NFTs' : Tabs[page].title}
                  </h3>
                  {!isMintBatch && Tabs[page].marker === 'Streaming' && (
                    <div className={classes.comingSoon}>Coming Soon</div>
                  )}
                  {isMintBatch && (
                    <div>
                      You will need to do this step by step, so please ensure
                      that you have enough MATIC to cover the fees.
                    </div>
                  )}
                </Box>
                {isMintBatch ? (
                  <MintBatch
                    isStreaming={songData.isMakeStreaming}
                    onMintMaster={handleMintMaster}
                    onMintEditions={handleMintEditions}
                    mintedMaster={mintedMaster}
                    masterHash={hash}
                    mintedEditionSteps={mintedEditionSteps}
                  />
                ) : Tabs[page].marker === 'NFT' ? (
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
                ) : Tabs[page].marker === 'Upload' ? (
                  <UploadMediaTab
                    song={song}
                    songData={songData}
                    setSongData={setSongData}
                    songImage={songImage}
                    mediaCover={mediaCover}
                    setMediaCover={setMediaCover}
                    uploadSongImage={uploadSongImage}
                    uploadSong={uploadSong}
                  />
                ) : Tabs[page].marker === 'Collection' ? (
                  <AlbumTab
                    songData={songData}
                    setSongData={setSongData}
                    albumImage={albumImage}
                    uploadAlbumImage={uploadAlbumImage}
                    mediaCover={mediaCover}
                    setMediaCover={setMediaCover}
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
                    else if (isMintBatch) {
                      setIsMintBatch(false);
                    } else setPage(page - 1);
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
                  {page === 0 ? 'Cancel' : 'Back'}
                </SecondaryButton>
                {Tabs[page].marker !== 'Collection' ? (
                  <PrimaryButton
                    size="medium"
                    isRounded
                    onClick={() => {
                      setPage(page + 1);
                    }}
                    style={{
                      background: Color.MusicDAODark,
                      width: isMobile ? '40%' : '200px'
                    }}
                  >
                    Next
                  </PrimaryButton>
                ) : isMintBatch ? (
                  <PrimaryButton
                    size="medium"
                    isRounded
                    onClick={() => {
                      onClose();
                    }}
                    style={{
                      background: Color.MusicDAODark,
                      width: isMobile ? 'auto' : '200px'
                    }}
                    disabled={
                      !mintedEditionSteps ||
                      mintedEditionSteps[mintedEditionSteps?.length - 1]
                        .status !== 2
                    }
                  >
                    Finish Minting
                  </PrimaryButton>
                ) : (
                  <Box
                    ml={isMobile ? 2 : 4}
                    style={
                      isMobile
                        ? { width: '100%', display: 'flex' }
                        : { display: 'flex', alignItems: 'center' }
                    }
                  >
                    <PrimaryButton
                      size="medium"
                      isRounded
                      onClick={() => setOpenCreateDraftModal(true)}
                      style={{
                        color: '#fff',
                        background: '#2D3047',
                        width: isMobile ? 'calc(50% - 4px)' : '200px',
                        marginRight: isMobile ? 0 : 16
                      }}
                    >
                      {editMode ? 'Save Draft' : 'Create a draft'}
                    </PrimaryButton>
                    <div
                      style={{
                        position: 'relative',
                        marginLeft: isMobile ? 8 : 16,
                        width: isMobile ? 'calc(50% - 4px)' : 'auto'
                      }}
                    >
                      <PrimaryButton
                        size="medium"
                        isRounded
                        onClick={handleMint}
                        style={{
                          background: Color.MusicDAOGreen,
                          width: isMobile ? '100%' : '200px',
                          marginLeft: 0,
                          marginRight: 0
                        }}
                      >
                        Mint NFT
                      </PrimaryButton>
                    </div>
                  </Box>
                )}
              </div>
            </Box>
          </>
        )}

        {openCreateDraftModal && (
          <DraftSettingModalV2
            open={openCreateDraftModal}
            onClose={() => {
              setOpenCreateDraftModal(false);
            }}
            onCreate={(isPublic) => {
              setOpenCreateDraftModal(false);
              editMode
                ? handleUpdateDraft(isPublic)
                : handleCreateDraft(isPublic);
            }}
            editing={editMode}
          />
        )}
        {openEditionTransactionModal && (
          <TransactionProgressModal
            open={openEditionTransactionModal}
            onClose={() => {
              setEditionHash('');
              setEditionTransactionSuccess(null);
              setOpenEditionTransactionModal(false);
            }}
            txSuccess={editionTransactionSuccess}
            hash={editionHash}
          />
        )}
        {openCloseMintingModal && (
          <Modal
            className={classes.closeRoot}
            size="small"
            isOpen={openCloseMintingModal}
            onClose={() => setOpenCloseMintingModal(false)}
            showCloseIcon
          >
            <div className={classes.closeContent}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                marginTop="34px"
                justifyContent="center"
              >
                <h5 style={{ margin: 0 }}>Pause Minting</h5>
                <h3 style={{ margin: 0 }}>
                  You can finish this process later from your Profile
                </h3>
              </Box>
              <div className={classes.closeButtons}>
                <PrimaryButton
                  size="medium"
                  isRounded
                  style={{
                    background: '#54658F'
                  }}
                  onClick={() => setOpenCloseMintingModal(false)}
                >
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  size="medium"
                  isRounded
                  style={{
                    background: '#65CB63'
                  }}
                  onClick={() => {
                    setOpenCloseMintingModal(false);
                    onClose();
                  }}
                >
                  Yes, finish later
                </PrimaryButton>
              </div>
            </div>
          </Modal>
        )}

        {isMint && (
          <Modal
            size="medium"
            isOpen={open}
            onClose={() => setIsMint(false)}
            showCloseIcon
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              {/* <Box className={classes.back} onClick={() => setIsMint(false)}>
                <BackIcon />
              </Box> */}
              <Box
                display="flex"
                alignItems="center"
                marginBottom="34px"
                justifyContent="center"
              >
                <h3 style={{ margin: 0 }}>
                  You’re Nearly There{' '}
                  <img src={require('assets/slackIcons/tada.webp')} />
                </h3>
              </Box>
              <Box textAlign={'center'}>
                <label style={{ color: '#54658F' }}>
                  The next step you will the{' '}
                  <strong>Sign Proof of Authenticity.</strong> This is your
                  Digital Signature for the assets taken by your metamask
                  wallet. A unique identifier which represents a sort of
                  fingerprint of the assets, it can be reproduced every time you
                  need to digital sign something on the blockchain.
                </label>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mt={7}
              >
                <PrimaryButton
                  size="medium"
                  isRounded
                  style={{
                    background: Color.MusicDAOGreen,
                    marginTop: '16px',
                    marginRight: 8,
                    width: isMobile ? '45%' : 245,
                    height: isMobile ? 60 : 40,
                    lineHeight: 'unset'
                  }}
                  disabled={!fingerprint || songData.proofOfAuthenticity}
                  onClick={handleSignProofOfAuthenticity}
                >
                  Sign Proof of Authenticity
                </PrimaryButton>
                <PrimaryButton
                  size="medium"
                  isRounded
                  style={{
                    background: Color.MusicDAOGreen,
                    marginTop: '16px',
                    width: isMobile ? '45%' : 245,
                    height: isMobile ? 60 : 40,
                    lineHeight: 'unset'
                  }}
                  disabled={!songData.proofOfAuthenticity}
                  onClick={() => {
                    setIsMint(false);
                    handleCreateSong();
                  }}
                >
                  Create Track
                </PrimaryButton>
              </Box>
            </Box>
          </Modal>
        )}
      </div>
    </Modal>
  );
}

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

const CheckIcon = () => (
  <svg
    width="37"
    height="27"
    viewBox="0 0 37 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.70703 13.4282L13.9238 22.645L32.2949 4.27393"
      stroke="url(#paint0_linear_check_button)"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_check_button"
        x1="6.79528"
        y1="12.7002"
        x2="30.7378"
        y2="17.5164"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.179206" stopColor="#A0D800" />
        <stop offset="0.852705" stopColor="#0DCC9E" />
      </linearGradient>
    </defs>
  </svg>
);

const CopyIcon = () => (
  <svg
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.5833 10.0833H14.8333C15.7538 10.0833 16.5 9.37445 16.5 8.5V2.95833C16.5 2.08388 15.7538 1.375 14.8333 1.375H9C8.07953 1.375 7.33333 2.08388 7.33333 2.95833V4.14583M3.16667 15.625H9C9.92047 15.625 10.6667 14.9161 10.6667 14.0417V8.5C10.6667 7.62555 9.92047 6.91667 9 6.91667H3.16667C2.24619 6.91667 1.5 7.62555 1.5 8.5V14.0417C1.5 14.9161 2.24619 15.625 3.16667 15.625Z"
      stroke="#65CB63"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
