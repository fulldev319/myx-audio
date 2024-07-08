import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';

import { setSelectedUser } from 'store/actions/SelectedUser';
import ContentPreviewModal from 'components/MusicDao/modals/ContentPreviewModal';
import DraftDeletingModal from 'components/MusicDao/modals/DraftDeletingModal';
import MediaTermsModal from 'components/MusicDao/modals/MediaTermsModal';
import { useTypedSelector } from 'store/reducers/Reducer';
import CreateSongModalNew from 'components/MusicDao/modals/CreateSongModalNew';

import URL from '../../../../../shared/functions/getURL';
import Box from 'shared/ui-kit/Box';
// import { musicDaoFruitPod } from "shared/services/API";
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import {
  getDefaultAvatar,
  getDefaultBGImage
} from 'shared/services/user/getUserAvatar';
import { musicDaoSongFeed } from 'shared/services/API';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { BlockchainNets } from 'shared/constants/constants';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { onGetNonDecrypt } from 'shared/ipfs/get';
import { nFormatter, processImage } from 'shared/helpers';
import { getAllTokenInfos } from 'shared/services/API/TokenAPI';

import { artistSongCardStyles } from './index.styles';
import ButtonMusicPlayer from '../../MusicPlayer/ButtonMusicPlayer';

const premiumPatterns = [
  {
    name: 'Bronze',
    bg:
      'radial-gradient(115.91% 115.91% at 49.22% -6.69%, #FFECDA 0%, #A65F1E 100%)'
  },
  {
    name: 'Silver',
    bg: 'radial-gradient(212% 212% at 43.35% -37.41%, #FFFFFF 0%, #636B76 100%)'
  },
  {
    name: 'Gold',
    bg:
      'radial-gradient(108.79% 108.79% at 47.08% -2.63%, #FFFFFF 0%, #F2D1AB 100%)'
  },
  {
    name: 'Platinum',
    bg:
      'radial-gradient(112.99% 112.99% at 48.51% 1.44%, #7A7A7A 0%, #39393A 100%)'
  }
];

const footerTypes = [
  {
    name: 'Normal',
    label: '',
    gradient: '#fff',
    topBorderColor: '#fff',
    color: '#fff'
  },
  {
    name: 'Gold',
    label: 'Gold',
    gradient:
      'radial-gradient(102.08% 748.61% at 39.39% -197.22%, rgba(255, 255, 255, 0) 0%, #E3CA87 100%)',
    topBorderColor: 'rbg(243, 232, 202)',
    color: '#807354'
  },
  {
    name: 'Platinum',
    label: 'Platinum',
    gradient:
      'radial-gradient(76.52% 561.11% at 49.43% -241.67%, rgba(196, 201, 209, 0) 0%, #636B76 100%), repeating-linear-gradient(-45deg, rgb(198, 198, 198), rgb(198, 198, 198) 1px, rgba(0, 0, 0, 0) 2px, rgba(0, 0, 0, 0) 8px)',
    topBorderColor: 'rbg(161, 164, 167)',
    color: '#3E3F46'
  },
  {
    name: 'Bronze',
    label: 'Bronze',
    gradient:
      'radial-gradient(102.08% 748.61% at 39.39% -197.22%, rgba(255, 211, 170, 0) 0%, #A65F1E 100%)',
    topBorderColor: 'rbg(229, 200, 162)',
    color: '#805C54'
  },
  {
    name: 'Silver',
    label: 'Silver',
    gradient:
      'radial-gradient(85.8% 629.17% at 39.39% -197.22%, rgba(255, 255, 255, 0) 0%, #B6B6B6 100%)',
    topBorderColor: 'rbg(230, 230, 230)',
    color: '#6B6B6B'
  },
  {
    name: 'Streaming',
    label: 'Streaming',
    gradient: 'linear-gradient(0deg, #F2FBF6, #F2FBF6)',
    topBorderColor: 'rgb(200, 237, 202)',
    color: '#0D59EE'
  },
  {
    name: 'Investing',
    label: 'Investing',
    gradient: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    topBorderColor: '#36CD7C',
    color: '#fff'
  }
];

type ArtistSongCardProps = {
  song: any;
  isLoading?: boolean;
  isShowEditionControl?: boolean;
  refresh?: any;
  onRemove?: any;
  openCreateContent?: any;
  isEditions?: boolean;
  fromPlayList?: boolean;
  platform?: boolean;
  handleClick?: (id: string) => void;
  selected?: boolean;
};

export default function ArtistSongCard({
  song,
  isLoading = false,
  isShowEditionControl = false,
  refresh,
  onRemove,
  openCreateContent,
  isEditions = false,
  fromPlayList = false,
  platform = false,
  handleClick,
  selected = false
}: ArtistSongCardProps) {
  const user = useTypedSelector((state) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = artistSongCardStyles();
  const { showAlertMessage } = useAlertMessage();
  const [songData, setSongData] = useState<any>({});
  const parentNode = React.useRef<any>();
  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();
  const [isFromPreview, setIsFromPreview] = useState<boolean>(false);
  const [openEditSongDraftModal, setOpenEditSongDraftModal] = useState<boolean>(
    false
  );
  const [
    openDeletingSongDraftModal,
    setOpenDeletingSongDraftModal
  ] = useState<boolean>(false);

  const [
    openDraftContentPreviewModal,
    setOpenDraftContentPreviewModal
  ] = useState<boolean>(false);
  const { account } = useWeb3React();
  const [openMediaTermsModal, setOpenMediaTermsModal] = React.useState<boolean>(
    false
  );
  const [tokens, setTokens] = useState<any[]>([]);
  const [isOwner, setIsOwner] = React.useState<boolean>(false);
  const [mintNewNFT, setMintNewNFT] = useState<boolean>(false);
  const card = useRef<any>();
  const [cardWidth, setCardWidth] = useState<number>(0);
  const [storedToRecently, setStoredToRecently] = useState<boolean>(false);

  useEffect(() => {
    setCardWidth(card?.current?.offsetWidth ?? 0);
  }, [card.current]);
  useEffect(() => {
    if (song.imageUrl) {
      setImageIPFS(song.imageUrl);
    } else {
      if (ipfs && Object.keys(ipfs).length !== 0) {
        if (song && song.metadataPhoto && song.metadataPhoto.newFileCID) {
          getImageIPFS(
            song.metadataPhoto.newFileCID,
            song.metadataPhoto.metadata.properties.name
          );
        } else if (song && song.InfoImage && song.InfoImage.newFileCID) {
          getImageIPFS(
            song.InfoImage.newFileCID,
            song.InfoImage.metadata.properties.name
          );
        }
      }
    }
  }, [song, ipfs]);

  useEffect(() => {
    setSongData({
      ...song,
      networkImg: BlockchainNets.find(
        (blockChainNet) => blockChainNet['name'] === 'POLYGON'
      )?.image
    });
  }, [song]);
  useEffect(() => {
    if (!songData || !user) return;

    if (songData.isPod && songData.podInfo) {
      const collabs = songData.podInfo?.Collabs ?? [];
      setIsOwner(collabs.find((v) => v.userId === user.id) ? true : false);
    } else
      setIsOwner(
        user?.id?.toLowerCase() === songData?.creatorId?.toLowerCase()
      );
  }, [songData, user]);

  useEffect(() => {
    if (ipfs && Object.keys(ipfs).length !== 0) {
      if (
        songData &&
        songData.metadataPhoto &&
        songData.metadataPhoto.newFileCID
      ) {
        getImageIPFS(
          songData.metadataPhoto.newFileCID,
          songData.metadataPhoto.metadata.properties.name
        );
      }
    }
  }, [songData.metadataPhoto, ipfs]);

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  const getImageIPFS = async (cid: string, fileName: string) => {
    let files = await onGetNonDecrypt(
      cid,
      fileName,
      (fileCID, fileName, download) =>
        downloadWithNonDecryption(fileCID, fileName, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.buffer);
      if (fileName?.slice(-4) === '.gif') {
        setImageIPFS('data:image/gif;base64,' + base64String);
      } else {
        setImageIPFS('data:image/png;base64,' + base64String);
      }
    } else {
      setImageIPFS(getDefaultBGImage());
    }
  };

  const handleRemoveDraft = async (callback: any) => {
    const response = await axios.post(`${URL()}/musicDao/song/draft/delete`, {
      id: songData.Id,
      ownerAddress: account
    });
    if (response.data.success) {
      showAlertMessage('Draft removed successfully', { variant: 'success' });
      callback(true);
      // onRemove();
    } else {
      showAlertMessage('Failed to remove draft', { variant: 'error' });
      callback(false);
    }
  };

  const onEditDraft = async (isFromPreviewModal = false) => {
    setIsFromPreview(isFromPreviewModal);
    // setOpenEditSongDraftModal(true);
    openCreateContent();
  };

  const avatarURL = useMemo(() => {
    if (songData?.creatorId) {
      if (songData?.creatorImageUrl) {
        return songData?.creatorImageUrl;
      } else {
        if (songData?.podInfo?.creatorImageUrl) {
          return songData?.podInfo?.creatorImageUrl;
        } else {
          return getDefaultAvatar();
        }
      }
    }
  }, [songData]);

  const labelAvatarURL = useMemo(() => {
    if (songData?.labelArtistImageUrl) {
      return songData?.labelArtistImageUrl;
    } else {
      return getDefaultAvatar();
    }
  }, [songData]);

  useEffect(() => {
    getAllTokenInfos().then((resp) => {
      if (resp.success) {
        const tokenList = resp.tokens.filter(
          (item) => item.Symbol === 'USDT' && item.Network === 'Polygon'
        );
        setTokens(tokenList); // update token list
      }
    });
  }, []);

  const getTokenName = (allTokens, addr) => {
    if (allTokens.length == 0) return '';
    const token = allTokens.find(
      (token) =>
        token.Address?.toLowerCase() === addr?.toLowerCase() ||
        token.Symbol?.toLowerCase() === addr?.toLowerCase()
    );
    return token ? token.Symbol : '';
  };

  const getTokenPrice = (allTokens, price, addr) => {
    if (allTokens.length == 0) return 0;
    const token = allTokens.find(
      (token) =>
        token.Address?.toLowerCase() === addr?.toLowerCase() ||
        token.Symbol?.toLowerCase() === addr?.toLowerCase()
    );
    return token ? price / 10 ** token.Decimals : 0;
  };

  const price = useMemo(() => {
    if (tokens.length === 0) return 0;
    return (
      songData.sellingOffer &&
      songData.sellingOffer.Price &&
      `${nFormatter(
        getTokenPrice(
          tokens,
          songData.sellingOffer.Price,
          songData.sellingOffer.PaymentToken
        ),
        1
      )} ${getTokenName(tokens, songData.sellingOffer.PaymentToken)}`
    );
  }, [songData, tokens]);

  const creatorName = useMemo(() => {
    if (
      songData?.isPod === true &&
      songData?.podInfo &&
      songData.podInfo?.collabUserData?.length > 1
    ) {
      const collabs = songData.podInfo?.collabUserData;
      return collabs.map(
        (v, i) =>
          `${v.firstName ?? ''} ${v.lastName ?? ''}${
            i === 0 && collabs.length > 1
              ? ' ft '
              : i === collabs.length - 1
              ? ''
              : ', '
          }`
      );
    } else {
      const name = `${songData.creatorFirstName ?? ''} ${
        songData.creatorLastName ?? ''
      }`;
      return name.length > 17
        ? name.substr(0, 13) + '...' + name.substr(name.length - 3, 3)
        : name;
    }
  }, [songData]);

  const creatorUrlSlug = useMemo(() => {
    if (
      songData?.isPod === true &&
      songData?.podInfo &&
      songData.podInfo?.collabUserData
    ) {
      const collabs = songData.podInfo?.collabUserData;
      return collabs.map((v, i) => songData.creatorId == v.userId && v.urlSlug);
    }
  }, [songData]);

  // const footerStyle = footerTypes[6];
  const footerStyle = useMemo(() => {
    if (songData?.editionIndex !== undefined && songData?.editionIndex >= 0) {
      switch (songData?.editionIndex) {
        case 0:
          return footerTypes[3]; // bronze
        case 1:
          return footerTypes[4]; // silver
        case 2:
          return footerTypes[1]; // gold
        case 2:
          return footerTypes[2]; // platinum
        default:
          footerTypes[0];
      }
    } else if (songData?.isMakeStreaming === true) return footerTypes[5];
    return footerTypes[0];

    // if (songData.incrementalId > 0) {
    //   return (
    //     footerTypes.find(
    //       (v) => v.name.toLowerCase() === songData?.category?.toLowerCase()
    //     ) ?? footerTypes[0]
    //   );
    // } else if (songData.editionType && songData.editionType.length > 0) {
    //   return (
    //     footerTypes.find((v) => v.name.toLowerCase() === 'streaming') ??
    //     footerTypes[0]
    //   );
    // } else {
    //   return footerTypes[0];
    // }
  }, [songData]);

  // const handleFruit = type => {
  //   if (songData.fruits?.filter(f => f.fruitId === type)?.find(f => f.userId === user.id)) {
  //     showAlertMessage("You had already given this fruit.", { variant: "info" });
  //     return;
  //   }
  //   musicDaoFruitPod(user.id, songData.Id, type).then(res => {
  //     if (res.success) {
  //       const itemCopy = { ...songData };
  //       itemCopy.fruits = [
  //         ...(itemCopy.fruits || []),
  //         { userId: user.id, fruitId: type, date: new Date().getTime() },
  //       ];
  //       setSongData(itemCopy);
  //     }
  //   });
  // };

  const handleGotoScan = () => {
    const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(
      `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/token/${
        songData.nftAddress
      }`,
      '_blank'
    );
  };

  const handleFeed = () => {
    const songId = songData.Id ?? songData.songId ?? songData.draftId;

    musicDaoSongFeed(songId);
    if (!storedToRecently) {
      axios
        .post(`${URL()}/musicDao/song/updateRecentlySongAndListeningCount`, {
          data: {
            songId: songId,
            userId: user.id,
            isPublic: song.isPublic ?? false
          }
        })
        .then((res) => {
          if (res.data.success) {
            setStoredToRecently(true);
          }
        });
    }
  };

  return (
    <>
      <div
        ref={card}
        className={styles.podCard}
        style={
          selected
            ? { border: '2px solid #0D59EE' }
            : isEditions
            ? { border: '1px solid rgba(84, 101, 143, 0.3)' }
            : {}
        }
        onClick={() => {
          if (isLoading) return;
          if (!songData.Id && !songData.songId && !songData.draftId) return;

          if (handleClick) {
            handleClick(songData.Id);
          } else {
            if (songData?.draft) {
              setOpenDraftContentPreviewModal(true);
            } else {
              history.push(
                `/music/${platform ? 'myx-track' : 'track'}/${songData.Id}`
              );
            }
          }
        }}
      >
        <Box className={styles.podImageContent}>
          <div className={styles.podImage} ref={parentNode}>
            <SkeletonBox
              loading={isLoading}
              image={imageIPFS}
              width={1}
              height={1}
              style={{
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden'
              }}
            />
          </div>
          {!isLoading && (
            <>
              {
                // songData.draft /* && isOwner*/ ? (
                //   <Box
                //     className={styles.name}
                //     style={{ background: Color.MusicDAOGreen }}
                //   >
                //     Draft
                //   </Box>
                // ) : (
                songData.isPod &&
                  songData.podInfo &&
                  songData.podInfo.quantityPerEdition && (
                    /* : (
            <Box className={styles.name}>
              {songData.podInfo?.name ||
                `${songData.creatorFirstName ?? ""} ${songData.creatorLastName ?? ""}`}
            </Box>
              )*/
                    <>
                      {songData.podInfo.quantityPerEdition.length === 1 ? (
                        <Box className={styles.name}>
                          {Number(songData.podInfo.quantityPerEdition[0]) > 1
                            ? `${songData.podInfo.quantityPerEdition[0]} Copies`
                            : `1/1`}
                        </Box>
                      ) : (
                        <Box
                          display="flex"
                          alignItems="center"
                          style={{
                            position: 'absolute',
                            top: 8,
                            left: 8
                          }}
                        >
                          {songData.podInfo.quantityPerEdition.map((v, i) => {
                            if (Number(v) > 0) {
                              return (
                                <div
                                  className={styles.editionBall}
                                  key={`edition-${i}`}
                                  style={{ background: premiumPatterns[i].bg }}
                                  // onClick={() => setCurEditionIndex(i)}
                                />
                              );
                            }
                          })}
                        </Box>
                      )}
                    </>
                  )
                // )
              }
              <Box className={styles.tag}>{songData.Genre}</Box>
            </>
          )}
        </Box>
        <Box className={styles.podInfo}>
          {isLoading ? (
            <>
              <Box mb={1.5}>
                <SkeletonBox loading width="50%" height="30px" />
              </Box>
              <Box mb={1.5}>
                <SkeletonBox loading width="50%" height="30px" />
              </Box>
              <Box mb={1.5}>
                <SkeletonBox loading width="100%" height="30px" />
              </Box>
            </>
          ) : (
            <>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center">
                  <Box position="relative" height="32px" width="42px">
                    <SkeletonBox
                      className={styles.avatar}
                      loading={false}
                      image={processImage(avatarURL)}
                      style={{
                        position: 'absolute',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        if (songData.creatorUrlSlug)
                          history.push(`/profile/${songData.creatorUrlSlug}`);
                        e.stopPropagation();
                      }}
                    />
                    {songData.labelArtistId && (
                      <SkeletonBox
                        className={styles.avatar}
                        loading={false}
                        image={processImage(labelAvatarURL)}
                        style={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          width: 22,
                          height: 22,
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          cursor: 'pointer',
                          border: '2px solid #ffffff'
                        }}
                        onClick={(e) => {
                          if (songData.labelArtistUrlSlug)
                            history.push(
                              `/profile/${songData.labelArtistUrlSlug}`
                            );
                          e.stopPropagation();
                        }}
                      />
                    )}
                  </Box>
                  <Box className={styles.socialButtonBox}>
                    {songData.creatorTwitter && (
                      <Box
                        className={styles.socialButton}
                        onClick={(event) => {
                          event.stopPropagation();
                          window.open(
                            `https://twitter.com/${songData.creatorTwitter}`,
                            '_blank'
                          );
                        }}
                      >
                        <img
                          src={require('assets/icons/social_twitter.webp')}
                          alt="twitter"
                        />
                      </Box>
                    )}
                    {songData?.creatorInstagram && (
                      <Box
                        className={styles.socialButton}
                        onClick={(event) => {
                          event.stopPropagation();
                          window.open(
                            `https://www.instagram.com/${songData?.creatorInstagram}`,
                            '_blank'
                          );
                        }}
                      >
                        <img
                          src={require('assets/icons/social_instagram.webp')}
                          alt="instagram"
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
                {!!price && (
                  <Box className={styles.price}>
                    Price&nbsp;<span>{price}</span>
                  </Box>
                )}
              </Box>
              <Box className={styles.divider} />
              <Box
                display="flex"
                alignItems={'center'}
                justifyContent="space-between"
              >
                <Box overflow={'hidden'} mr={1}>
                  <Box className={styles.podInfoName}>
                    {platform ? songData.Name : songData.Title}
                    {songData.incrementalId
                      ? ` #${songData.incrementalId}`
                      : ''}
                  </Box>
                  <Box
                    className={styles.podInfoAlbum}
                    mt={1}
                    onClick={(e) => {
                      if (creatorUrlSlug) {
                        history.push(`/profile/${creatorUrlSlug}`);
                        dispatch(setSelectedUser(songData.creatorId));
                      }
                      e.stopPropagation();
                    }}
                  >
                    {creatorName}
                  </Box>
                </Box>
                <Box>
                  <ButtonMusicPlayer
                    media={song?.metadataMedia}
                    songId={
                      songData?.Id ??
                      songData.songId ??
                      songData.draftId ??
                      songData.id
                    }
                    feed={handleFeed}
                  />
                </Box>
              </Box>
              {/* {!songData.draft && songData?.networkImg && (
                <img
                  src={require(`assets/${songData.networkImg}`)}
                  style={{
                    width: '22px',
                    height: '22px',
                    position: 'absolute',
                    bottom: footerStyle.name !== 'Normal' ? '36px' : '15px',
                    right: '15px',
                    cursor: 'pointer',
                    marginBottom: '10px',
                    zIndex: 1
                  }}
                  onClick={(e) => {
                    handleGotoScan();
                    e.stopPropagation();
                  }}
                />
              )} */}

              {isShowEditionControl &&
                (songData.draft && isOwner ? (
                  <>
                    <Box className={styles.divider} />
                    {songData.isPod && songData.podInfo ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        marginLeft="auto"
                      >
                        {!(songData.draftId || songData.Id) && (
                          <Box display="flex" alignItems="center">
                            <Box ml={1}></Box>
                          </Box>
                        )}
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          className={styles.removeIcon}
                          onClick={(e) => {
                            // setOpenMediaTermsModal(true);
                            openCreateContent();
                            e.stopPropagation();
                          }}
                        >
                          <img
                            src={require('assets/icons/settings.webp')}
                            width={20}
                            height={20}
                          />
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        marginLeft="auto"
                      >
                        <Box display="flex">
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            className={styles.removeIcon}
                            onClick={(e) => {
                              setOpenDeletingSongDraftModal(true);
                              e.stopPropagation();
                            }}
                            mr={1}
                          >
                            <RemoveIcon />
                          </Box>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            className={styles.removeIcon}
                            onClick={(e) => {
                              onEditDraft(false);
                              e.stopPropagation();
                            }}
                          >
                            <img
                              src={require('assets/icons/settings.webp')}
                              width={20}
                              height={20}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box></Box>
                ))}
              <div style={{ height: 36 }}>
                {/* {songData?.isMakeStreaming === true &&
                songData?.category &&
                songData?.category !== 'Streaming' &&
                songData?.category !== 'Normal' ? (
                  <Box
                    display="flex"
                    alignItems="end"
                    justifyContent="center"
                    height={36}
                  >
                    <Box
                      className={styles.commonFooterEdition}
                      style={{
                        background: '#FF8E3C'
                      }}
                    >
                      {songData?.category}
                    </Box>
                    <div style={{ width: 10 }} />
                    <Box
                      className={styles.commonFooterEdition}
                      style={{
                        background:
                          'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)'
                      }}
                    >
                      {cardWidth > 260 && <StreamingIconWhite />}
                      <Box ml={cardWidth < 260 ? 0 : '12px'}>streaming</Box>
                    </Box>
                  </Box>
                ) : ( */}
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    margin: '8px -16px',
                    borderRadius: '0 0 20px 20px',
                    borderTop: `1px solid ${footerStyle.topBorderColor}`,
                    background: footerStyle.gradient,
                    color: footerStyle.color,
                    position: 'relative',
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 12,
                    lineHeight: '14px',
                    textAlign: 'center',
                    letterSpacing:
                      cardWidth < 205
                        ? '0.3em'
                        : cardWidth < 260
                        ? '0.4em'
                        : '0.83em',
                    textTransform: 'uppercase'
                  }}
                >
                  {footerStyle.label}
                  {footerStyle.name === 'Streaming' && (
                    <div style={{ position: 'absolute', top: 8, left: 20 }}>
                      <StreamingIcon />
                    </div>
                  )}
                  {footerStyle.name === 'Investing' && (
                    <div style={{ position: 'absolute', top: 8, left: 20 }}>
                      <DiamondIcon />
                    </div>
                  )}
                </Box>
                {/* )} */}
              </div>
            </>
          )}
        </Box>
      </div>
      {openEditSongDraftModal && (
        <CreateSongModalNew
          draft={songData}
          editMode={true}
          mintMode={mintNewNFT}
          open={openEditSongDraftModal}
          onClose={() => {
            setOpenEditSongDraftModal(false);
            if (!mintNewNFT) {
              setOpenDraftContentPreviewModal(isFromPreview);
            }
            setIsFromPreview(false);
          }}
          handleRefresh={() => refresh && refresh()}
          updateSongData={(data) => setSongData(data)}
        />
      )}
      {openDraftContentPreviewModal && (
        <ContentPreviewModal
          song={songData}
          open={openDraftContentPreviewModal}
          onClose={() => {
            setOpenDraftContentPreviewModal(false);
            setMintNewNFT(false);
          }}
          id={songData.Id ?? songData.songId ?? songData.draftId}
          onEdit={() => {
            setOpenDraftContentPreviewModal(false);
            onEditDraft(true);
          }}
          onMint={() => {
            setMintNewNFT(true);
            setOpenDraftContentPreviewModal(false);
            onEditDraft(true);
          }}
        />
      )}
      {openDeletingSongDraftModal && (
        <DraftDeletingModal
          open={openDeletingSongDraftModal}
          onClose={() => setOpenDeletingSongDraftModal(false)}
          onDelete={handleRemoveDraft}
          onOk={() => {
            setOpenDeletingSongDraftModal(false);
            onRemove();
          }}
        />
      )}
      {openMediaTermsModal && (
        <MediaTermsModal
          open={openMediaTermsModal}
          handleClose={() => setOpenMediaTermsModal(false)}
          pod={songData.podInfo}
          media={songData}
          handleRefresh={refresh}
        />
      )}
    </>
  );
}

const RemoveIcon = () => (
  <svg
    width="13"
    height="12"
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.35352 0.517943C4.35352 0.262094 4.56092 0.0546875 4.81677 0.0546875H8.18325C8.4391 0.0546875 8.64651 0.262094 8.64651 0.517943C8.64651 0.773792 8.4391 0.981199 8.18325 0.981199H4.81677C4.56092 0.981199 4.35352 0.773792 4.35352 0.517943Z"
      fill="#2D3047"
    />
    <path
      d="M0.878906 2.77026H2.11425L2.88635 11.4177C2.90263 11.6614 3.10531 11.8508 3.3496 11.8502H9.64942C9.89371 11.8508 10.0964 11.6614 10.1127 11.4177L10.8848 2.77026H12.1201V1.84375H0.878906V2.77026Z"
      fill="#2D3047"
    />
  </svg>
);

const StreamingIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.125 11.625C0.71025 11.625 0.375 11.289 0.375 10.875V7.125C0.375 6.711 0.71025 6.375 1.125 6.375C1.53975 6.375 1.875 6.711 1.875 7.125V10.875C1.875 11.289 1.53975 11.625 1.125 11.625Z"
      fill="#0D59EE"
    />
    <path
      d="M3.375 14.625C2.96025 14.625 2.625 14.289 2.625 13.875V4.125C2.625 3.711 2.96025 3.375 3.375 3.375C3.78975 3.375 4.125 3.711 4.125 4.125V13.875C4.125 14.289 3.78975 14.625 3.375 14.625Z"
      fill="#0D59EE"
    />
    <path
      d="M5.625 17.625C5.21025 17.625 4.875 17.289 4.875 16.875V1.125C4.875 0.711 5.21025 0.375 5.625 0.375C6.03975 0.375 6.375 0.711 6.375 1.125V16.875C6.375 17.289 6.03975 17.625 5.625 17.625Z"
      fill="#0D59EE"
    />
    <path
      d="M7.875 16.875C7.46025 16.875 7.125 16.539 7.125 16.125V1.875C7.125 1.461 7.46025 1.125 7.875 1.125C8.28975 1.125 8.625 1.461 8.625 1.875V16.125C8.625 16.539 8.28975 16.875 7.875 16.875Z"
      fill="#0D59EE"
    />
    <path
      d="M10.125 13.875C9.71025 13.875 9.375 13.539 9.375 13.125V4.875C9.375 4.461 9.71025 4.125 10.125 4.125C10.5397 4.125 10.875 4.461 10.875 4.875V13.125C10.875 13.539 10.5397 13.875 10.125 13.875Z"
      fill="#0D59EE"
    />
    <path
      d="M12.375 16.875C11.9603 16.875 11.625 16.539 11.625 16.125V1.875C11.625 1.461 11.9603 1.125 12.375 1.125C12.7897 1.125 13.125 1.461 13.125 1.875V16.125C13.125 16.539 12.7897 16.875 12.375 16.875Z"
      fill="#0D59EE"
    />
    <path
      d="M14.625 13.875C14.2103 13.875 13.875 13.539 13.875 13.125V4.875C13.875 4.461 14.2103 4.125 14.625 4.125C15.0397 4.125 15.375 4.461 15.375 4.875V13.125C15.375 13.539 15.0397 13.875 14.625 13.875Z"
      fill="#0D59EE"
    />
    <path
      d="M16.875 11.625C16.4603 11.625 16.125 11.289 16.125 10.875V7.125C16.125 6.711 16.4603 6.375 16.875 6.375C17.2897 6.375 17.625 6.711 17.625 7.125V10.875C17.625 11.289 17.2897 11.625 16.875 11.625Z"
      fill="#0D59EE"
    />
  </svg>
);

const StreamingIconWhite = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.75 7.75C0.4735 7.75 0.25 7.526 0.25 7.25V4.75C0.25 4.474 0.4735 4.25 0.75 4.25C1.0265 4.25 1.25 4.474 1.25 4.75V7.25C1.25 7.526 1.0265 7.75 0.75 7.75Z"
      fill="white"
    />
    <path
      d="M2.25 9.75C1.9735 9.75 1.75 9.526 1.75 9.25V2.75C1.75 2.474 1.9735 2.25 2.25 2.25C2.5265 2.25 2.75 2.474 2.75 2.75V9.25C2.75 9.526 2.5265 9.75 2.25 9.75Z"
      fill="white"
    />
    <path
      d="M3.75 11.75C3.4735 11.75 3.25 11.526 3.25 11.25V0.75C3.25 0.474 3.4735 0.25 3.75 0.25C4.0265 0.25 4.25 0.474 4.25 0.75V11.25C4.25 11.526 4.0265 11.75 3.75 11.75Z"
      fill="white"
    />
    <path
      d="M5.25 11.25C4.9735 11.25 4.75 11.026 4.75 10.75V1.25C4.75 0.974 4.9735 0.75 5.25 0.75C5.5265 0.75 5.75 0.974 5.75 1.25V10.75C5.75 11.026 5.5265 11.25 5.25 11.25Z"
      fill="white"
    />
    <path
      d="M6.75 9.25C6.4735 9.25 6.25 9.026 6.25 8.75V3.25C6.25 2.974 6.4735 2.75 6.75 2.75C7.0265 2.75 7.25 2.974 7.25 3.25V8.75C7.25 9.026 7.0265 9.25 6.75 9.25Z"
      fill="white"
    />
    <path
      d="M8.25 11.25C7.9735 11.25 7.75 11.026 7.75 10.75V1.25C7.75 0.974 7.9735 0.75 8.25 0.75C8.5265 0.75 8.75 0.974 8.75 1.25V10.75C8.75 11.026 8.5265 11.25 8.25 11.25Z"
      fill="white"
    />
    <path
      d="M9.75 9.25C9.4735 9.25 9.25 9.026 9.25 8.75V3.25C9.25 2.974 9.4735 2.75 9.75 2.75C10.0265 2.75 10.25 2.974 10.25 3.25V8.75C10.25 9.026 10.0265 9.25 9.75 9.25Z"
      fill="white"
    />
    <path
      d="M11.25 7.75C10.9735 7.75 10.75 7.526 10.75 7.25V4.75C10.75 4.474 10.9735 4.25 11.25 4.25C11.5265 4.25 11.75 4.474 11.75 4.75V7.25C11.75 7.526 11.5265 7.75 11.25 7.75Z"
      fill="white"
    />
  </svg>
);

const DiamondIcon = () => (
  <svg
    width="20"
    height="16"
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.35629 5.03965L9.04469 15.7932L0.979492 5.03965H6.35629ZM10.8267 0.639648L12.5867 4.15965H7.41229L9.17229 0.639648H10.8267ZM12.7363 5.03965L9.99949 15.9846L7.26269 5.03965H12.7363ZM13.6427 5.03965H19.0195L10.9543 15.7932L13.6427 5.03965ZM18.8369 4.15965H13.5723L11.8123 0.639648H15.3169L18.8369 4.15965ZM4.68209 0.639648H8.18669L6.42669 4.15965H1.16209L4.68209 0.639648Z"
      fill="white"
    />
  </svg>
);
