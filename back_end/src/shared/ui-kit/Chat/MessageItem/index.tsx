import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import ReactPlayer from 'react-player';
import { saveAs } from 'file-saver';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import SvgIcon from '@material-ui/core/SvgIcon';

import { Modal } from 'shared/ui-kit';
import URL from 'shared/functions/getURL';
import Waveform from 'shared/ui-kit/Page-components/Discord/DiscordAudioWavesurfer/Waveform';
import DiscordPhotoFullScreen from 'shared/ui-kit/Page-components/Discord/DiscordPhotoFullScreen/DiscordPhotoFullScreen';
import DiscordVideoFullScreen from 'shared/ui-kit/Page-components/Discord/DiscordVideoFullScreen/DiscordVideoFullScreen';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { onGetNonDecrypt } from '../../../ipfs/get';
import { _arrayBufferToBase64 } from '../../../functions/commonFunctions';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';

import { ReactComponent as PlaySolid } from 'assets/icons/play-solid.svg';
import { ReactComponent as DownloadSolid } from 'assets/icons/download-solid.svg';

const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    '& .MuiDialog-paperFullWidth': {
      paddingTop: theme.spacing(2),
      borderRadius: theme.spacing(2.5)
    }
  },
  discordPhotoFullModal: {},
  photoContainer: {
    cursor: 'pointer',
    width: 180,
    height: 180,
    borderRadius: 20
  },
  videoContainer: {
    cursor: 'pointer',
    height: '180px',
    width: '180px !important',
    maxWidth: '180px',
    color: 'white',
    borderRadius: 20,
    backgroundColor: 'rgba(219, 223, 224, 0.4)',
    position: 'relative'
  },
  iconVideoWrapper: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    backgroundColor: 'rgb(128 128 128 / 40%)',
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    borderRadius: '20px'
  },
  playIconVideo: {
    width: '32px',
    height: '32px'
  },
  audioContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  noMessagesLabelChat: {
    fontSize: '14px',
    color: 'grey',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '10px',
    width: '100%'
  },
  videoPlayer: {
    cursor: 'pointer',
    width: '180px !important',
    height: '180px !important',
    borderRadius: 20,
    transform: 'none',
    '& > video': {
      width: '180px !important',
      borderRadius: 20,
      objectFit: 'cover'
    }
  },
  itemMeta: {
    fontSize: 8,
    color: 'grey',
    display: 'flex',
    paddingTop: '4px'
  },
  itemMetaSelf: {
    fontSize: 8,
    color: 'grey',
    display: 'flex',
    paddingTop: '4px',
    justifyContent: 'flex-end'
  },
  container: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

export const MessageItem = ({ user, message, mediaOnCommunity }) => {
  const playerVideo = React.useRef(null);
  const classes = useStyles();
  const [selectedPhoto, setSelectedPhoto] = React.useState<string>('');
  const [selectedVideo, setSelectedVideo] = React.useState<string>('');
  const [openModalPhotoFullScreen, setOpenModalPhotoFullScreen] =
    React.useState<boolean>(false);
  const [openModalVideoFullScreen, setOpenModalVideoFullScreen] =
    React.useState<boolean>(false);
  const isLeftItem = user?.userId === message.from;
  const isRightItem = user?.userd !== message.from;

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [fileIPFS, setFileIPFS] = useState<any>(null);
  const [fileBlobIPFS, setFileBlobIPFS] = useState<any>(null);

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  useEffect(() => {
    if (
      ipfs &&
      Object.keys(ipfs).length !== 0 &&
      message &&
      message.type &&
      message.type !== 'text' &&
      message?.message?.newFileCID &&
      message?.message?.metadata?.properties?.name
    ) {
      getUserFileIpfs(
        message.message.newFileCID,
        message.message.metadata.properties.name,
        message.type
      );
    }
  }, [message, ipfs]);

  const getUserFileIpfs = async (cid: any, fileName: string, type: string) => {
    let fileUrl: string = '';
    let files = await onGetNonDecrypt(
      cid,
      fileName,
      (fileCID, fileName, download) =>
        downloadWithNonDecryption(fileCID, fileName, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.buffer);
      if (type === 'photo') {
        if (fileName?.slice(-4) === '.gif') {
          fileUrl = 'data:image/gif;base64,' + base64String;
        } else {
          fileUrl = 'data:image/png;base64,' + base64String;
        }
      } else if (type === 'video') {
        fileUrl = 'data:video/mp4;base64,' + base64String;
      } else if (type === 'audio') {
        fileUrl = 'data:audio/mp3;base64,' + base64String;
      } else {
        fileUrl = base64String;
        setFileBlobIPFS(files.blob);
      }
    }
    setFileIPFS(fileUrl);
  };

  const handleOpenModalPhotoFullScreen = () => {
    setOpenModalPhotoFullScreen(true);
  };
  const handleCloseModalPhotoFullScreen = () => {
    setOpenModalPhotoFullScreen(false);
  };
  const handleOpenModalVideoFullScreen = () => {
    setOpenModalVideoFullScreen(true);
  };

  const handleCloseModalVideoFullScreen = () => {
    setOpenModalVideoFullScreen(false);
  };

  const downloadFile = () => {
    if (fileBlobIPFS) {
      saveAs(
        fileBlobIPFS,
        message.message &&
          message.message.metadata &&
          message.message.metadata.properties &&
          message.message.metadata.properties.name
          ? message.message.metadata.properties.name
          : 'File'
      );
    }
  };
  const downloadFileMediaOnCommunity = () => {
    saveAs(`${message.url}`, message.message);
  };

  if (!isLeftItem && !isRightItem) return null;
  return (
    <>
      <div className={isLeftItem ? 'left-item' : 'right-item'} id={message.id}>
        {isLeftItem && (
          <div className="avatar-container">
            <img
              src={user?.userFoto ?? getDefaultAvatar()}
              alt="Avatar"
              className="message-item-avatar"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginTop: '8px'
              }}
            />
          </div>
        )}

        {message.type && message.type === 'photo' ? (
          <div className={classes.container}>
            <div className={classes.itemMeta}>
              {message?.fromType?.toUpperCase()}
            </div>
            <div
              className={classes.photoContainer}
              onClick={() => {
                setSelectedPhoto(`${fileIPFS}`);
                handleOpenModalPhotoFullScreen();
              }}
              style={{
                backgroundImage: `url(${fileIPFS ? fileIPFS : ''})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
              }}
            ></div>
            <Moment fromNow className={classes.itemMeta}>
              {message.created}
            </Moment>
          </div>
        ) : message.type && message.type === 'video' ? (
          <div className={classes.container}>
            <div className={classes.itemMeta}>
              {message?.fromType?.toUpperCase()}
            </div>
            <div className={classes.videoContainer}>
              <div className={classes.iconVideoWrapper}>
                <SvgIcon className={classes.playIconVideo}>
                  <PlaySolid />
                </SvgIcon>
              </div>
              <ReactPlayer
                onClick={() => {
                  if (fileIPFS) {
                    setSelectedVideo(fileIPFS);
                    handleOpenModalVideoFullScreen();
                  }
                }}
                url={fileIPFS}
                className={classes.videoPlayer}
                ref={playerVideo}
                progressInterval={200}
              />
            </div>
            <Moment fromNow className={classes.itemMeta}>
              {message.created}
            </Moment>
          </div>
        ) : message.type && message.type === 'audio' ? (
          <div className={classes.container}>
            <div className={classes.itemMeta}>
              {message?.fromType?.toUpperCase()}
            </div>
            <div className={classes.audioContainer}>
              {fileIPFS ? (
                <Waveform
                  url={
                    mediaOnCommunity
                      ? `${URL()}/mediaOnCommunity/getMessageAudio/${
                          message.chatId
                        }/${message.from}/${message.id}`
                      : fileIPFS
                      ? fileIPFS
                      : null
                  }
                  mine={false}
                  showTime={false}
                  onPauseFunction={null}
                  onPlayFunction={null}
                  onReadyFunction={null}
                />
              ) : (
                <p className={classes.noMessagesLabelChat}>Loading audio...</p>
              )}
            </div>
            <Moment fromNow className={classes.itemMeta}>
              {message.created}
            </Moment>
          </div>
        ) : message.type && message.type === 'file' ? (
          <div className="item-content">
            <div className="item-subtitle">
              {message?.fromType?.toUpperCase()}
            </div>
            <div className="item-file">
              <div className="item-file-name">
                {message.message &&
                message.message.metadata &&
                message.message.metadata.properties &&
                message.message.metadata.properties.name
                  ? message.message.metadata.properties.name
                  : 'File'}
              </div>
              <div
                onClick={() => {
                  if (mediaOnCommunity) {
                    downloadFileMediaOnCommunity();
                  } else {
                    downloadFile();
                  }
                }}
                className="item-file-icon"
              >
                <SvgIcon>
                  <DownloadSolid />
                </SvgIcon>
              </div>
            </div>
            <Moment fromNow className={classes.itemMeta}>
              {message.created}
            </Moment>
          </div>
        ) : (
          <>
            {typeof message.message === 'string' && (
              <div className="item-content">
                <div className="item-subtitle">
                  {message?.fromType?.toUpperCase()}
                </div>
                <div className="item-message">
                  {message.message.includes('data:audio/wav;') ? (
                    <audio
                      style={{ width: '200px' }}
                      controls
                      src={JSON.parse(message.message)}
                    >
                      The “audio” tag is not supported by your browser. Click
                      [here] to download the sound file.
                    </audio>
                  ) : (
                    message.message
                  )}
                </div>
                <Moment fromNow className="item-subtitle">
                  {message.created}
                </Moment>
              </div>
            )}
          </>
        )}
      </div>

      {selectedPhoto && openModalPhotoFullScreen && (
        <Modal
          className="modal"
          size="medium"
          isOpen={openModalPhotoFullScreen}
          onClose={handleCloseModalPhotoFullScreen}
          showCloseIcon
        >
          <DiscordPhotoFullScreen
            onCloseModal={handleCloseModalPhotoFullScreen}
            url={selectedPhoto}
          />
        </Modal>
      )}
      {selectedVideo && openModalVideoFullScreen && (
        <Dialog
          className={`modal ${classes.dialogContainer}`}
          open={openModalVideoFullScreen}
          onClose={handleCloseModalVideoFullScreen}
          maxWidth={'md'}
          fullWidth
        >
          <DiscordVideoFullScreen
            onCloseModal={handleCloseModalVideoFullScreen}
            url={selectedVideo}
          />
        </Dialog>
      )}
    </>
  );
};
