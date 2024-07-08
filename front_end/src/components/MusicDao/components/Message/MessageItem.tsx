import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import ReactPlayer from 'react-player';
import { saveAs } from 'file-saver';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import SvgIcon from '@material-ui/core/SvgIcon';

import { Modal } from 'shared/ui-kit';
import Waveform from 'shared/ui-kit/Page-components/Discord/DiscordAudioWavesurfer/Waveform';
import DiscordPhotoFullScreen from 'shared/ui-kit/Page-components/Discord/DiscordPhotoFullScreen/DiscordPhotoFullScreen';
import DiscordVideoFullScreen from 'shared/ui-kit/Page-components/Discord/DiscordVideoFullScreen/DiscordVideoFullScreen';
import { ReactComponent as PlaySolid } from 'assets/icons/play-solid.svg';
import { ReactComponent as DownloadSolid } from 'assets/icons/download-solid.svg';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { onGetNonDecrypt } from '../../../../shared/ipfs/get';
import { _arrayBufferToBase64 } from '../../../../shared/functions/commonFunctions';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';

const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    '& .MuiDialog-paperFullWidth': {
      borderRadius: theme.spacing(2.5)
    }
  },
  discordPhotoFullModal: {},
  photoContainer: {
    cursor: 'pointer',
    width: 180,
    height: 180,
    borderRadius: 14
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
    borderRadius: 14,
    transform: 'none',
    '& > video': {
      width: '180px !important',
      borderRadius: 14,
      objectFit: 'cover'
    }
  },
  itemMeta: {
    display: 'flex',
    paddingTop: '12px',
    fontFamily: 'Pangram Regular',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '100%',
    color: 'rgba(84, 101, 143, 0.6)',
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

const MessageItemFC = ({ user, message, messageContentRef }) => {
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

  const { downloadWithNonDecryption } = useIPFS();

  const [fileIPFS, setFileIPFS] = useState<any>(null);
  const [fileBlobIPFS, setFileBlobIPFS] = useState<any>(null);

  useEffect(() => {
    if (
      message?.type !== 'text' &&
      message?.message?.newFileCID &&
      message?.message?.metadata?.properties?.name
    ) {
      getUserFileIpfs(
        message.message.newFileCID,
        message?.message?.metadata?.properties?.name,
        message.type
      );
    }
  }, [message]);

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
    if (messageContentRef?.current)
      messageContentRef.current.style.overflowY = 'hidden';
    setOpenModalPhotoFullScreen(true);
  };
  const handleCloseModalPhotoFullScreen = () => {
    setOpenModalPhotoFullScreen(false);
    if (messageContentRef?.current)
      messageContentRef.current.style.overflowY = 'auto';
  };
  const handleOpenModalVideoFullScreen = () => {
    if (messageContentRef?.current)
      messageContentRef.current.style.overflowY = 'hidden';
    setOpenModalVideoFullScreen(true);
  };

  const handleCloseModalVideoFullScreen = () => {
    setOpenModalVideoFullScreen(false);
    if (messageContentRef?.current)
      messageContentRef.current.style.overflowY = 'auto';
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

  if (!isLeftItem && !isRightItem) return null;
  return (
    <>
      <div className={isLeftItem ? 'left-item' : 'right-item'} id={message.id}>
        {isLeftItem && (
          <div className="avatar-wrapper" style={{ background: 'transparent' }}>
            <img
              src={user?.userFoto ?? getDefaultAvatar()}
              alt="Avatar"
              className="message-item-avatar"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover'
                // marginTop: "8px",
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
            <div style={{ marginLeft: 16 }}>
              <Moment
                fromNow
                className={classes.itemMeta}
                style={
                  isLeftItem
                    ? {}
                    : { display: 'flex', justifyContent: 'flex-end' }
                }
              >
                {message.created}
              </Moment>
            </div>
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
            <div style={{ marginLeft: 16 }}>
              <Moment
                fromNow
                className={classes.itemMeta}
                style={
                  isLeftItem
                    ? {}
                    : { display: 'flex', justifyContent: 'flex-end' }
                }
              >
                {message.created}
              </Moment>
            </div>
          </div>
        ) : message.type && message.type === 'audio' ? (
          <div className={classes.container}>
            <div className={classes.itemMeta}>
              {message?.fromType?.toUpperCase()}
            </div>
            <div className={classes.audioContainer}>
              {fileIPFS ? (
                <Waveform
                  url={fileIPFS}
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
            <div style={{ marginLeft: 16 }}>
              <Moment
                fromNow
                className={classes.itemMeta}
                style={
                  isLeftItem
                    ? {}
                    : { display: 'flex', justifyContent: 'flex-end' }
                }
              >
                {message.created}
              </Moment>
            </div>
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
                  downloadFile();
                }}
                className="item-file-icon"
              >
                <SvgIcon>
                  <DownloadSolid />
                </SvgIcon>
              </div>
            </div>
            <div style={{ marginLeft: 16 }}>
              <Moment
                fromNow
                className={classes.itemMeta}
                style={
                  isLeftItem
                    ? {}
                    : { display: 'flex', justifyContent: 'flex-end' }
                }
              >
                {message.created}
              </Moment>
            </div>
          </div>
        ) : (
          <>
            {typeof message.message === 'string' && (
              <div
                className="item-content" /*style={type === "trax" ? { border: "1px solid #E0E4F3" } : {}}*/
              >
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
          size="medium"
          className={classes.discordPhotoFullModal}
          isOpen={openModalPhotoFullScreen}
          onClose={handleCloseModalPhotoFullScreen}
          theme="transparent"
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

export const MessageItem = React.memo(MessageItemFC);
