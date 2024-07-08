import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { setSelectedUser } from 'store/actions/SelectedUser';

import Box from 'shared/ui-kit/Box';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import {
  getDefaultAvatar,
  getDefaultBGImage
} from 'shared/services/user/getUserAvatar';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import { BlockchainNets } from 'shared/constants/constants';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { onGetNonDecrypt } from 'shared/ipfs/get';
import { Color, PrimaryButton } from 'shared/ui-kit';
import { processImage } from 'shared/helpers';

import { nftCardStyles } from './index.styles';

type NFTCardProps = {
  song: any;
  isLoading?: boolean;
};

export default function NFTCard({ song, isLoading = false }: NFTCardProps) {
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = nftCardStyles();
  const [songData, setSongData] = useState<any>({});

  const parentNode = React.useRef<any>();

  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const [podImageIPFS, setPodImageIPFS] = useState<any>(null);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
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
      } else {
        getImageIPFS('', '');
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
    setMultiAddr('https://elb.ipfs.myx.audio:5001/api/v0');
  }, []);

  const getImageIPFS = async (cid: string, fileName: string) => {
    if (cid && fileName) {
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
    } else {
      setImageIPFS(getDefaultBGImage());
    }
  };

  const avatarURL = useMemo(() => {
    if (songData?.Artists) {
      let result = songData?.Artists.main[0]
        ? songData?.Artists.main[0].imageUrl
        : '';
      if (!result) {
        for (const f of songData?.Artists.featured) {
          result = f.imageUrl;
          if (result) break;
        }
      }

      if (result) {
        if (result.startsWith('/assests')) {
          const lastIndex = result.lastIndexOf('/');
          return require(`assets/anonAvatars/${result.substr(lastIndex + 1)}`);
        }
        return result;
      }
    }
    return songData.isPod === true || songData.podInfo
      ? podImageIPFS ?? getDefaultAvatar()
      : songData.ownerImageUrl ??
          songData.creatorImageUrl ??
          getDefaultAvatar();
  }, [podImageIPFS, songData]);

  const handleGotoScan = () => {
    const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(
      `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/token/${
        songData.nftAddress
      }`,
      '_blank'
    );
  };

  return (
    <Box className={styles.podCard}>
      <Box className={styles.podImageContent}>
        <div className={styles.podImage} ref={parentNode} onClick={() => {}}>
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
          <div className={styles.stampWrap}>
            <Box display="flex" alignItems="center">
              <Box
                className={styles.name}
                style={{
                  background:
                    songData.status === 'sold' ? Color.MusicDAOGreen : '#2D3047'
                }}
              >
                {songData.status}
              </Box>
              <img
                src={songData.statusImg}
                alt="status_image"
                style={{ width: 24, height: 24 }}
              />
            </Box>

            <Box className={styles.tag}>{songData.genre}</Box>
          </div>
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
            {
              <>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center">
                    <SkeletonBox
                      className={styles.avatar}
                      loading={false}
                      image={processImage(avatarURL)}
                      style={{
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        cursor: 'pointer',
                        marginRight: '8px',
                        border:
                          songData.isPod || songData.podInfo
                            ? '2px solid #65CB63'
                            : '2px solid #ffffff'
                      }}
                      onClick={() => {
                        history.push(`/profile/${songData.creatorUrlSlug}`);
                        dispatch(setSelectedUser(songData.creatorId));
                      }}
                    />
                  </Box>
                  <Box className={styles.price}>
                    Price&nbsp;&nbsp;<span>{songData.price}</span>&nbsp;&nbsp;
                    <span>{songData.priceUnity}</span>
                  </Box>
                </Box>
                <Box className={styles.divider} />
              </>
            }
            <Box className={styles.podInfoName}>
              {`${songData.Title ?? 'Unknown'}`}
              {songData.incrementalId ? ` #${songData.incrementalId}` : ''}
            </Box>
            <Box
              className={styles.podInfoAlbum}
              mt={1}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {songData.collectionName}
              {songData?.networkImg && (
                <img
                  src={require(`assets/${songData.networkImg}`)}
                  style={{
                    width: '22px',
                    height: '22px',
                    position: 'absolute',
                    bottom: '40px',
                    right: '15px',
                    cursor: 'pointer',
                    marginBottom: '10px',
                    zIndex: 1
                  }}
                  onClick={() => handleGotoScan()}
                />
              )}
            </Box>
            <Box display="flex" justifyContent="center" my={2}>
              <PrimaryButton
                size="medium"
                onClick={() => {}}
                isRounded
                style={{
                  textTransform: 'uppercase',
                  background: songData.opt === 'pay funds' ? '#2D3047' : '#fff',
                  color: songData.opt === 'pay funds' ? '#fff' : '#2D3047',
                  border:
                    songData.opt === 'pay funds' ? 'none' : '1px solid #2D3047'
                }}
              >
                {songData.opt}
              </PrimaryButton>
            </Box>
          </>
        )}
      </Box>
    </Box>
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
      fill="#65CB63"
    />
    <path
      d="M3.375 14.625C2.96025 14.625 2.625 14.289 2.625 13.875V4.125C2.625 3.711 2.96025 3.375 3.375 3.375C3.78975 3.375 4.125 3.711 4.125 4.125V13.875C4.125 14.289 3.78975 14.625 3.375 14.625Z"
      fill="#65CB63"
    />
    <path
      d="M5.625 17.625C5.21025 17.625 4.875 17.289 4.875 16.875V1.125C4.875 0.711 5.21025 0.375 5.625 0.375C6.03975 0.375 6.375 0.711 6.375 1.125V16.875C6.375 17.289 6.03975 17.625 5.625 17.625Z"
      fill="#65CB63"
    />
    <path
      d="M7.875 16.875C7.46025 16.875 7.125 16.539 7.125 16.125V1.875C7.125 1.461 7.46025 1.125 7.875 1.125C8.28975 1.125 8.625 1.461 8.625 1.875V16.125C8.625 16.539 8.28975 16.875 7.875 16.875Z"
      fill="#65CB63"
    />
    <path
      d="M10.125 13.875C9.71025 13.875 9.375 13.539 9.375 13.125V4.875C9.375 4.461 9.71025 4.125 10.125 4.125C10.5397 4.125 10.875 4.461 10.875 4.875V13.125C10.875 13.539 10.5397 13.875 10.125 13.875Z"
      fill="#65CB63"
    />
    <path
      d="M12.375 16.875C11.9603 16.875 11.625 16.539 11.625 16.125V1.875C11.625 1.461 11.9603 1.125 12.375 1.125C12.7897 1.125 13.125 1.461 13.125 1.875V16.125C13.125 16.539 12.7897 16.875 12.375 16.875Z"
      fill="#65CB63"
    />
    <path
      d="M14.625 13.875C14.2103 13.875 13.875 13.539 13.875 13.125V4.875C13.875 4.461 14.2103 4.125 14.625 4.125C15.0397 4.125 15.375 4.461 15.375 4.875V13.125C15.375 13.539 15.0397 13.875 14.625 13.875Z"
      fill="#65CB63"
    />
    <path
      d="M16.875 11.625C16.4603 11.625 16.125 11.289 16.125 10.875V7.125C16.125 6.711 16.4603 6.375 16.875 6.375C17.2897 6.375 17.625 6.711 17.625 7.125V10.875C17.625 11.289 17.2897 11.625 16.875 11.625Z"
      fill="#65CB63"
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
