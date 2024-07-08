import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';

import Grid from '@material-ui/core/Grid';

import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import URL from 'shared/functions/getURL';
import URLTraxSongRecognizer from 'shared/functions/getURLMusicSongRecognizer';
import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import { useTypedSelector } from 'store/reducers/Reducer';
import { Dropdown } from 'shared/ui-kit/Select/Select';
import { BlockchainNets } from 'shared/constants/constants';
import { Modal, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import {
  buildJsxFromObject,
  handleSetStatus
} from 'shared/functions/commonFunctions';
import { SignatureRequestModal } from 'shared/ui-kit/Modal/Modals';
import {
  ICreateClaimableSongPod,
  createClaimableMedia
} from 'shared/services/API';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import Box from 'shared/ui-kit/Box';
import PolygonAPI from 'shared/services/API/polygon';
import { createClaimablePodModalStyles } from './CreateClaimablePodModal.styles';

const deleteIcon = require('assets/icons/delete_red.svg');
const checkIcon = require('assets/icons/check_green_round.svg');
const failIcon = require('assets/icons/fail_red.svg');
const warningIcon = require('assets/icons/warning.svg');
const pUSDIcon = require('assets/tokenImages/pUSD.svg');
const mm = require('music-metadata');

const minBitrate = 150;

export default function CreateClaimablePodModal(props) {
  const classes = createClaimablePodModalStyles();
  const user = useTypedSelector((state) => state.user);

  const [upload2, setUpload2] = useState<any>(null);
  const [uploadImg2, setUploadImg2] = useState<any>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [blockchain, setBlockchain] = useState<string>(BlockchainNets[0].value);
  const [price, setPrice] = useState('0.1');
  const [priceToken, setPriceToken] = useState('pUSD');
  const [creatorSharePercent, setCreatorSharePercent] = useState('');
  const [sharingSharePercent, setSharingSharePercent] = useState('');
  const [songInfos, setSongInfos] = useState<any[]>([]);
  const [isReviewMode, setReviewMode] = useState(false);
  const [metadata, setMetaData] = useState<any>({});

  // signature and payload
  const payloadsRef = useRef<ICreateClaimableSongPod[]>([]); // list of payloads
  const [openSignRequestModal, setOpenSignRequestModal] =
    useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] =
    useState<any>(null);

  // status
  const [status, setStatus] = React.useState<any>('');
  const [loaderSong, setLoaderSong] = useState<boolean>(false);

  const { account, library } = useWeb3React();

  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then((res) => {
      const resp = res.data;
      if (resp.success) {
        const tokenList = resp.data.map((obj) => ({
          token: obj.token,
          name: obj.token
        }));
        setTokens(tokenList);
        setPriceToken(tokenList[0].token);
      }
    });
  }, []);

  // define payload for API call and opens the signature confirmation modal
  // should be called when all data are prepared (all tracks uploaded & recognized)
  const handleOpenSignatureModal = () => {
    const payloads: ICreateClaimableSongPod[] = [];
    songInfos.forEach((songInfo) => {
      const title = songInfo.song_name;
      const artists = songInfo.artists;
      const duration = songInfo.duration;
      const artistsObj = {};

      if (artists && artists.length > 0) {
        artists.forEach((artist) => {
          artistsObj[artist.name] = '';
        });
      }

      const payload: ICreateClaimableSongPod = {
        MediaSymbol: title,
        MediaName: title,
        CreatorAddress: user.address,
        Artists: artistsObj,
        Duration: Math.floor(duration)
      };
      payloads.push(payload);
    });
    payloadsRef.current = payloads;
    setSignRequestModalDetail(buildJsxFromObject(payloads));
    setOpenSignRequestModal(true);
  };

  // call the backend API track by track
  const handleCreateClaimableSongPod = async () => {
    const payloads: any[] = payloadsRef.current;

    if (payloads.length && payloads.length == songInfos.length) {
      const web3 = new Web3(library.provider);

      const promises = songInfos.map((songInfo, index) => {
        return new Promise<any>(async () => {
          const payload = payloads[index];
          // register songs in blockchain
          let resp: any;

          if (songInfo.blockchain === BlockchainNets[1].value) {
            resp = await PolygonAPI.SongsManager.registerSong(
              web3,
              account!,
              songInfo
            );
            if (resp.success) {
              const { songAddress, songId, artistsPool, stakePool } = resp.data;
              // console.log(songId, songAddress);
              // resp = await PolygonAPI.Song.initialize(web3, account!, {
              //   songAddress,
              //   songId: parseInt(songId),
              //   genre: songInfo.genres,
              // });
              // console.log(resp);
              // if (resp.success) {
              resp = await axios.post(
                `${URL()}/claimableSongs/createClaimableMedia_P`,
                {
                  data: payload,
                  song: {
                    artistsPool,
                    stakePool,
                    songId,
                    songAddress,
                    ...songInfo
                  }
                }
              );
              // }
            }
          } else {
            resp = await createClaimableMedia(payload, songInfo, user.mnemonic);
          }

          if (resp?.success) {
            handleSetStatus(
              `Track #${index + 1} registered successfully`,
              'success',
              setStatus
            );
          } else {
            handleSetStatus(
              `Track #${index + 1} registration failed`,
              'error',
              setStatus
            );
          }
        });
      });

      Promise.all(promises).then(() => {
        props.handleClose();
        setReviewMode(false);
      });
    }
  };

  const onAddNewSong = async () => {
    try {
      if (
        !upload2 ||
        !blockchain ||
        !priceToken ||
        !price ||
        parseFloat(creatorSharePercent) > 1 ||
        parseFloat(creatorSharePercent) < 0 ||
        parseFloat(sharingSharePercent) < 0
      ) {
        return;
      }

      setSongInfos([
        ...songInfos,
        {
          name: upload2.name,
          blockchain,
          price,
          priceToken,
          // creatorSharePercent,
          // sharingSharePercent,
          hasMetaData: !!metadata,
          createdAt: Date.now(),
          ...metadata
        }
      ]);
      setBlockchain('');
      // setPrice("");
      setPriceToken('');
      setCreatorSharePercent('');
      setSharingSharePercent('');
      setUpload2(null);
    } catch (err) {}
  };

  const isDisabledForAdd = () => {
    if (
      !upload2 ||
      !blockchain ||
      !priceToken ||
      !price ||
      parseFloat(creatorSharePercent) > 1 ||
      parseFloat(creatorSharePercent) < 0 ||
      parseFloat(sharingSharePercent) < 0
    ) {
      return true;
    }
    return false;
  };

  const isDisabledForReview = () => {
    return songInfos.length ? false : true;
  };

  const isDisabledForPublish = () => {
    return !songInfos.every((item) => item.hasMetaData);
  };

  const onReview = () => {
    onAddNewSong();
    setReviewMode(true);
  };

  const arrayBufferToBufferCycle = (ab) => {
    var buffer = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }
    return buffer;
  };

  const acoustRecognize = async (file) => {
    let now = Date.now();
    const formData = new FormData();

    formData.append('audio', file, '' + now);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    const { data: fpcalcResponse } = await axios.post(
      `${URLTraxSongRecognizer()}/songs/getFingerprint`,
      formData,
      config
    );
    const { data: acoustResponse } = await axios.post(
      `${URL()}/media/acoustidRecognize`,
      {
        fingerprint: fpcalcResponse.fingerprint,
        duration: fpcalcResponse.duration
      }
    );
    if (!acoustResponse.success) {
      return {
        status: false
      };
    }
    const audio = acoustResponse.audio;
    if (!audio) {
      return {
        status: false
      };
    }
    return { ...audio, duration: fpcalcResponse.duration, status: true };
  };

  const shazamRecognize = async (file) =>
    new Promise((resolve, reject) => {
      var reader = new FileReader();

      reader.addEventListener(
        'load',
        async function () {
          try {
            let now = Date.now();
            const formData = new FormData();

            formData.append('audio', file, '' + now);
            const config = {
              headers: {
                'content-type': 'multipart/form-data'
              }
            };
            const { data: shzamResponse } = await axios.post(
              `${URL()}/media/shazamRecognize`,
              formData,
              config
            );
            const metadataResp = shzamResponse.data;

            const filePath = shzamResponse.file?.path;
            resolve({
              ...metadataResp,
              filePath,
              name: file.name,
              url: shzamResponse.url
            });
          } catch (err) {
            reject(err);
          }
        },
        false
      );

      if (file) {
        reader.readAsArrayBuffer(file);
      }
    });

  const musicMetaData = async (file) =>
    new Promise((resolve, reject) => {
      var reader = new FileReader();

      reader.addEventListener(
        'load',
        async function () {
          try {
            const audioInfo = await mm.parseBuffer(
              arrayBufferToBufferCycle(reader.result),
              'audio/mpeg'
            );
            const bitrate = audioInfo?.format?.bitrate;
            const genres = audioInfo?.common?.genre?.[0];
            resolve({
              bitrate,
              genres
            });
          } catch (err) {
            reject(err);
          }
        },
        false
      );

      if (file) {
        reader.readAsArrayBuffer(file);
      }
    });

  const uploadSong = async (file) => {
    setLoaderSong(true);
    try {
      let metadataResult: any = {};
      const { status, ...audio } = await acoustRecognize(file);
      metadataResult = { ...audio };
      if (!status) {
        const shazamMeta: any = await shazamRecognize(file);
        metadataResult = { ...metadataResult, ...shazamMeta };
      }
      const musicMetadata: any = await musicMetaData(file);
      metadataResult = { ...metadataResult, ...musicMetadata };
      setUpload2(file);
      setMetaData({ ...metadataResult, name: file.name });
    } catch (err) {
      console.log(err);
    }
    setLoaderSong(false);
  };

  const handleRemoveFailedSong = (e, index) => {
    const filteredInfoes = songInfos.filter((songInfo, idx) => idx !== index);
    setSongInfos([...filteredInfoes]);
  };

  const handleSignatureModalClose = () => {
    setOpenSignRequestModal(false);
    props.handleClose();
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      className={classes.root}
      showCloseIcon
    >
      <div className={classes.modalContent}>
        <SignatureRequestModal
          open={openSignRequestModal}
          address={user.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleCreateClaimableSongPod}
          handleClose={handleSignatureModalClose}
        />

        <h2 className={classes.mainTitle}>
          Upload a track and earn if the artist claims it!
        </h2>
        {!isReviewMode ? (
          <>
            <Grid container spacing={3}>
              {!loaderSong ? (
                <Grid item xs={12}>
                  <h5 className={classes.label}>Upload track</h5>
                  {!upload2 && (
                    <Box width={1}>
                      <FileUpload
                        photo={upload2}
                        photoImg={uploadImg2}
                        setterPhoto={uploadSong}
                        setterPhotoImg={setUploadImg2}
                        mainSetter={() => {}}
                        mainElement={null}
                        type="audio"
                        canEdit={true}
                        styleWrapper={{ padding: '18px 28px' }}
                      />
                      {!metadata.name && (
                        <Box className={classes.warning}>
                          <img src={warningIcon} alt="warning" />
                          You can upload mp3, mp4 or .wav format. There is no
                          file size limit, however if you upload long-form audio
                          of any kind, depending on your network you can expect
                          longer encryption and upload times, so please be
                          patient
                        </Box>
                      )}
                    </Box>
                  )}
                  {metadata && metadata.name && (
                    <Box className={classes.songList}>
                      <Box className={classes.songInfo}>
                        <h6>{metadata.name}</h6>
                        <span>{`Bitrate: ${Math.floor(
                          metadata.bitrate / 1024
                        )} Kbps`}</span>
                        {metadata.bitrate / 1024 < minBitrate && (
                          <Box
                            className={classes.failRow}
                            style={{ marginTop: 20 }}
                          >
                            <img
                              src={failIcon}
                              alt={'fail'}
                              onClick={() => setMetaData({})}
                              style={{ cursor: 'pointer' }}
                            />
                            {metadata.bitrate / 1024 < minBitrate
                              ? `Track is below the ${minBitrate} Kbps bitrate requirement. Try uploading a different file.`
                              : 'This track already exists in another Claimable Track Capsule. Try uploading a different file.'}
                          </Box>
                        )}
                      </Box>
                      {metadata?.bitrate / 1024 >= minBitrate && (
                        <span
                          onClick={(e: any) => {
                            setUpload2(null);
                          }}
                        >
                          <img src={deleteIcon} alt={'remove'} />
                        </span>
                      )}
                    </Box>
                  )}
                </Grid>
              ) : (
                <div className={classes.loaderSpinner}>
                  <LoadingWrapper loading />
                </div>
              )}
              <Grid item xs={6}>
                <h5 className={classes.label}>Choose Blockchain Network</h5>
                <Dropdown
                  value={blockchain}
                  menuList={BlockchainNets}
                  onChange={(e) => setBlockchain(e.target.value)}
                  className={classes.blockchainDropdown}
                  hasImage
                />
              </Grid>
              <Grid item xs={6}>
                <h5 className={classes.label}>Price per Second</h5>
                <div className={classes.priceContainer}>
                  <img src={pUSDIcon} width={24} alt="pUSD" />
                  <h1>pUSD</h1>
                  <div className={classes.verticalDivide}></div>
                </div>
              </Grid>
            </Grid>
            <Box className={classes.actionButtons}>
              <SecondaryButton
                size="small"
                onClick={() => props.handleClose()}
                style={{ background: '#EAE8FA' }}
              >
                Back
              </SecondaryButton>
              <Box style={{ textAlign: 'right', display: 'flex' }}>
                <SecondaryButton
                  size="small"
                  onClick={onAddNewSong}
                  disabled={isDisabledForAdd()}
                >
                  Add Another Track
                </SecondaryButton>
                <PrimaryButton
                  size="small"
                  onClick={onReview}
                  disabled={isDisabledForAdd() && isDisabledForReview()}
                >
                  Review & Publish
                </PrimaryButton>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <h5 className={classes.label}>Review</h5>
            {songInfos.map((song, index) => (
              <Box
                className={classes.songInfoSection}
                key={song.name + '-' + index}
              >
                {song.hasMetaData ? (
                  <Box className={classes.successRow}>
                    <img src={checkIcon} alt={'success'} />
                    Track successfully verified
                  </Box>
                ) : (
                  <Box className={classes.failRow}>
                    <img
                      src={failIcon}
                      alt={'fail'}
                      onClick={(e) => handleRemoveFailedSong(e, index)}
                      style={{ cursor: 'pointer' }}
                    />
                    We couldn’t retrieve any data for this track
                  </Box>
                )}
                <h3 className={classes.songName}>{song.name}</h3>
                <hr className={classes.dashLine} />
                <Grid container className={classes.detailInfo}>
                  <Grid item xs={3}>
                    <b>Artist</b>
                    <br />
                    {song.artist_name}
                  </Grid>
                  <Grid item xs={3}>
                    <b>Track:</b>
                    <br />
                    {song.song_name}
                  </Grid>
                  <Grid item xs={3}>
                    <b>Genre:</b>
                    <br />
                    {song.genres}
                  </Grid>
                  <Grid item xs={3}>
                    <b>Bitrate</b>
                    <br />
                    {`${Math.floor(song.bitrate / 1024)} Kbps`}
                  </Grid>
                </Grid>
                <hr className={classes.dashLine} />
                <Grid container className={classes.detailInfo}>
                  <Grid item xs={3}>
                    <b>Chain</b>
                    <br />
                    {song.blockchain}
                  </Grid>
                  <Grid item xs={3}>
                    <b>Creator Share</b>
                    <br />
                    {song.creatorSharePercent}
                  </Grid>
                  <Grid item xs={6}>
                    <b>Price per Second:</b>
                    <br />
                    {`${song.priceToken} ${song.price}`}
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Box className={classes.actionButtons}>
              <SecondaryButton
                size="small"
                onClick={() => setReviewMode(false)}
              >
                Back
              </SecondaryButton>
              <PrimaryButton
                size="small"
                onClick={handleOpenSignatureModal}
                disabled={isDisabledForPublish()}
              >
                Publish
              </PrimaryButton>
            </Box>
          </>
        )}
        {status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : (
          ''
        )}
      </div>
    </Modal>
  );
}
