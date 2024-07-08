import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import { Color } from 'shared/ui-kit';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import { BlockchainNets } from 'shared/constants/constants';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { onGetNonDecrypt } from 'shared/ipfs/get';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import ContentPreviewModal from 'components/MusicDao/modals/ContentPreviewModal';
import CreateSongModalNew from 'components/MusicDao/modals/CreateSongModalNew';

const useStyles = makeStyles((theme) => ({
  container: {
    background: Color.White,
    boxShadow: '0px 25px 36px -11px rgba(0, 0, 0, 0.02)',
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    color: '#181818',
    fontSize: 14,
    fontWeight: 800,

    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      fontSize: 11,
      borderRadius: 8
    },

    '&:hover': {
      boxShadow:
        '0px 8px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.01)'
    }
  },
  genre: {
    width: '100%',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textTransform: 'uppercase'
  },
  artist: {
    width: '100%',
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    overflowWrap: 'anywhere',
    maxWidth: 200
  },
  name: {
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))',
    borderRadius: 6,
    padding: '2px 6px',
    color: 'white',
    fontSize: 10,
    marginTop: 4,
    width: 'fit-content',
    [theme.breakpoints.down('xs')]: {
      fontSize: 8
    }
  },
  title: {
    [theme.breakpoints.down('xs')]: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  },
  edition: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    borderRadius: 8,
    position: 'relative',

    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: '12px',
    textAlign: 'center',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      height: 32
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 9,
      lineHeight: '9px',
      letterSpacing: '0.1em',
      borderRadius: 4,
      height: 20
    }
  }
}));

const editionTypes = [
  {
    name: 'Normal',
    label: '',
    gradient: '#fff',
    borderColor: '#fff',
    color: '#fff'
  },
  {
    name: 'Gold',
    label: 'Gold',
    gradient:
      'radial-gradient(102.08% 748.61% at 39.39% -197.22%, rgba(255, 255, 255, 0) 0%, #E3CA87 100%)',
    borderColor: 'rbg(243, 232, 202)',
    color: '#807354'
  },
  {
    name: 'Platinium',
    label: 'Platinium',
    gradient:
      'radial-gradient(76.52% 561.11% at 49.43% -241.67%, rgba(196, 201, 209, 0) 0%, #636B76 100%), repeating-linear-gradient(-45deg, rgb(198, 198, 198), rgb(198, 198, 198) 1px, rgba(0, 0, 0, 0) 2px, rgba(0, 0, 0, 0) 8px)',
    borderColor: 'rbg(161, 164, 167)',
    color: '#3E3F46'
  },
  {
    name: 'Silver',
    label: 'Silver',
    gradient:
      'radial-gradient(85.8% 629.17% at 39.39% -197.22%, rgba(255, 255, 255, 0) 0%, #B6B6B6 100%)',
    borderColor: 'rbg(230, 230, 230)',
    color: '#6B6B6B'
  },
  {
    name: 'Bronze',
    label: 'Bronze',
    gradient:
      'radial-gradient(102.08% 748.61% at 39.39% -197.22%, rgba(255, 211, 170, 0) 0%, #A65F1E 100%)',
    borderColor: 'rbg(229, 200, 162)',
    color: '#805C54'
  },
  {
    name: 'Streaming',
    label: 'Streaming',
    gradient: 'linear-gradient(0deg, #F2FBF6, #F2FBF6)',
    borderColor: 'rgb(200, 237, 202)',
    color: '#65CB63'
  },
  {
    name: 'Investing',
    label: 'Investing',
    gradient: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    topBorderColor: '#36CD7C',
    color: '#fff'
  }
];

const ListSongCard = ({
  data,
  collection,
  isLoading,
  openCreateContent
}: {
  data: any;
  collection?: any;
  isLoading?: boolean;
  openCreateContent?: any;
}) => {
  const history = useHistory();
  const classes = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const [song, setSong] = useState<any>(data);
  const [isFromPreview, setIsFromPreview] = useState<boolean>(false);
  const [openDraftContentPreviewModal, setOpenDraftContentPreviewModal] =
    useState<boolean>(false);
  const [openEditSongDraftModal, setOpenEditSongDraftModal] =
    useState<boolean>(false);

  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const creatorName = React.useMemo(() => {
    if (song?.Artists) {
      let result = song?.Artists.main[0] ? song?.Artists.main[0].name : '';
      if (song?.Artists.featured?.length) {
        result = result ? result + ' ft ' : '';
        song?.Artists.featured.map((v, i) => {
          if (i < song?.Artists.featured.length - 1) result += v.name + ', ';
          else {
            result += v.name;
          }
        });
      }

      if (result) return result;
    }
    if (song?.isPod === true && song?.podInfo && song.podInfo?.Collabs) {
      const collabs = song.podInfo?.Collabs?.filter((u) =>
        u.name ? true : false
      );
      return collabs.map(
        (v, i) =>
          `${v.name}${
            i === 0 && collabs.length > 1
              ? ' ft '
              : i === collabs.length - 1
              ? ''
              : ', '
          }`
      );
    } else {
      const name = `${song.creatorFirstName ?? ''} ${
        song.creatorLastName ?? ''
      }  `;
      return name;
    }
  }, [song]);

  useEffect(() => {
    if (ipfs && Object.keys(ipfs).length !== 0) {
      setSong({
        ...data,
        networkImg: BlockchainNets.find(
          (blockChainNet) => blockChainNet['name'] === 'POLYGON'
        )?.image
        // networkImg: collection
        //   ? BlockchainNets.find(blockChainNet => blockChainNet["value"] === collection?.chain)?.image
        //   : BlockchainNets.find(blockChainNet => blockChainNet["name"] === "POLYGON")?.image,
      });
      if (data && data.metadataPhoto && data.metadataPhoto.newFileCID) {
        getImageIPFS(
          data.metadataPhoto.newFileCID,
          data.metadataPhoto.metadata.properties.name
        );
      }
    }
  }, [data, ipfs, collection]);

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

  const handleGotoScan = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(
      `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/token/${
        song.nftAddress
      }`,
      '_blank'
    );
  };

  //const editionStyle = editionTypes[6];
  const editionStyle = React.useMemo(
    () =>
      editionTypes.find(
        (v) => v.name.toLowerCase() === song?.category?.toLowerCase()
      ) ?? editionTypes[0],
    [song]
  );

  return (
    <>
      <Box
        className={classes.container}
        px={isMobile ? 0.7 : 2}
        py={isMobile ? 0.7 : 1.5}
        mb={1}
        onClick={() => {
          if (!isLoading) {
            if (song.draft) {
              setOpenDraftContentPreviewModal(true);
            } else {
              history.push(`/music/track/${song.Id}`);
            }
          }
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          minWidth={isMobile ? 90 : undefined}
        >
          <Box
            width={isMobile ? 42 : 84}
            height={isMobile ? 32 : 64}
            style={{ minWidth: 42 }}
          >
            <SkeletonBox
              width="100%"
              height="100%"
              loading={!imageIPFS}
              image={imageIPFS}
              style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                borderRadius: isMobile ? '6px' : '8px'
              }}
            />
          </Box>
          <Box mx={isMobile ? 1 : 2} width={isMobile ? 60 : 150}>
            {isLoading ? (
              <SkeletonBox loading width="100%" height="30px" />
            ) : (
              <>
                <Box className={classes.title}>
                  {`${song.Title ?? 'Unknown'}`}
                  {song.incrementalId ? ` #${song.incrementalId}` : ''}
                </Box>
                {song.draft && (
                  <Box
                    className={classes.name}
                    style={{ background: Color.MusicDAOGreen }}
                  >
                    Draft
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          flex="1"
        >
          <Box
            fontWeight="normal"
            width={isMobile ? 72 : 'auto'}
            className={classes.artist}
          >
            {isLoading ? (
              <SkeletonBox loading width="100px" height="30px" ml={2} />
            ) : (
              creatorName
            )}
          </Box>
          {!isLoading && (
            <div
              className={classes.edition}
              style={{
                width: isMobile ? 70 : isTablet ? 140 : 150,
                border: `1px solid ${editionStyle.borderColor}`,
                background: editionStyle.gradient,
                color: editionStyle.color,
                paddingLeft: isMobile
                  ? 20
                  : editionStyle.name === 'Streaming' ||
                    editionStyle.name === 'Investing'
                  ? 36
                  : 20,
                paddingRight: 20
              }}
            >
              {editionStyle.label}
              {editionStyle.name === 'Streaming' && !isMobile && (
                <div style={{ position: 'absolute', top: 7, left: 8 }}>
                  <StreamingIcon
                    width={isTablet ? 14 : 18}
                    height={isTablet ? 14 : 18}
                  />
                </div>
              )}
              {editionStyle.name === 'Investing' && !isMobile && (
                <div style={{ position: 'absolute', top: 9, left: 8 }}>
                  <DiamondIcon />
                </div>
              )}
            </div>
          )}
          <Box display="flex" alignItems="center">
            <Box style={{ width: isMobile ? 50 : isTablet ? 90 : 150 }} mx={1}>
              <Box className={classes.genre} color="#2D3047" textAlign="center">
                {isLoading ? (
                  <SkeletonBox loading width="100%" height="30px" />
                ) : (
                  song.Genre
                )}
              </Box>
            </Box>
            <Box width={isMobile ? 40 : isTablet ? 80 : 150} textAlign="center">
              {isLoading ? (
                <Box display="flex" justifyContent={'center'}>
                  <SkeletonBox loading width="30px" height="30px" />
                </Box>
              ) : !song.draft && song?.networkImg ? (
                <img
                  src={require(`assets/${song.networkImg}`)}
                  style={{
                    width: isMobile ? '12px' : '22px',
                    height: isMobile ? '12px' : '22px'
                  }}
                  onClick={handleGotoScan}
                />
              ) : null}
            </Box>
            <LeftArrowIcon />
          </Box>
        </Box>
      </Box>
      {openEditSongDraftModal && (
        <CreateSongModalNew
          draft={song}
          open={openEditSongDraftModal}
          onClose={() => {
            setOpenEditSongDraftModal(false);
            setOpenDraftContentPreviewModal(isFromPreview);
            setIsFromPreview(false);
          }}
          handleRefresh={() => {}}
        />
      )}
      {openDraftContentPreviewModal && (
        <ContentPreviewModal
          song={song}
          open={openDraftContentPreviewModal}
          onClose={() => {
            setOpenDraftContentPreviewModal(false);
          }}
          id={song.Id}
          onEdit={() => {
            setOpenDraftContentPreviewModal(false);
            setIsFromPreview(true);
            // setOpenEditSongDraftModal(true);
            openCreateContent && openCreateContent();
          }}
        />
      )}
    </>
  );
};

export default ListSongCard;

const LeftArrowIcon = () => (
  <svg
    width="7"
    height="13"
    viewBox="0 0 7 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.2"
      d="M0.799316 12L5.84961 6.5L0.799316 1"
      stroke="#77788E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface IconProps {
  width?: number;
  height?: number;
}

const StreamingIcon = (props: IconProps) => (
  <svg
    width={(props.width || 18).toString()}
    height={(props.height || 18).toString()}
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
const DiamondIcon = (props: IconProps) => (
  <svg
    width={(props.width || 20).toString()}
    height={(props.height || 16).toString()}
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
