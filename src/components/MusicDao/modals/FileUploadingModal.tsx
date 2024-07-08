import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Modal } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { BorderLinearProgress } from 'components/MusicDao/components/LinearProgress';

const fileUploadingModalStyles = makeStyles((theme) => ({
  root: {
    width: '600px !important'
  },
  modalContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#2D3047'
  },
  uploadImg: {
    objectFit: 'none'
  },
  progressValue: {
    fontSize: 30
  },
  uploading: {
    fontSize: 32,
    fontWeight: 800
  },
  description: {
    fontWeight: 600,
    fontSize: 18,
    lineHeight: '150%',
    textAlign: 'center',
    //color: "#707582",
    margin: '0 70px',
    [theme.breakpoints.down('xs')]: {
      margin: '0 40px'
    }
  },
  '@keyframes pointmove1': {
    '0%': { top: '50%', left: '50%', width: 0, height: 0 },
    '19%': { width: 0, height: 0 },
    '20%': { width: 9, height: 9 },
    '46%': { width: 9, height: 9 },
    '48%': { width: 0, height: 0 },
    '100%': { top: '28%', left: '70%', width: 0, height: 0 }
  },
  '@keyframes pointmove2': {
    '0%': { top: '50%', left: '50%', width: 0, height: 0 },
    '19%': { width: 0, height: 0 },
    '20%': { width: 9, height: 9 },
    '46%': { width: 9, height: 9 },
    '48%': { width: 0, height: 0 },
    '100%': { top: '67%', left: '70%', width: 0, height: 0 }
  },
  '@keyframes pointmove3': {
    '0%': { top: '55%', left: '49%', width: 0, height: 0 },
    '19%': { width: 0, height: 0 },
    '20%': { width: 9, height: 9 },
    '46%': { width: 9, height: 9 },
    '48%': { width: 0, height: 0 },
    '100%': { top: '78%', left: '49%', width: 0, height: 0 }
  },
  '@keyframes pointmove4': {
    '0%': { top: '51%', left: '49%', width: 0, height: 0 },
    '19%': { width: 0, height: 0 },
    '20%': { width: 9, height: 9 },
    '46%': { width: 9, height: 9 },
    '48%': { width: 0, height: 0 },
    '100%': { top: '65%', left: '29%', width: 0, height: 0 }
  },
  '@keyframes pointmove5': {
    '0%': { top: '48%', left: '48%', width: 0, height: 0 },
    '19%': { width: 0, height: 0 },
    '20%': { width: 9, height: 9 },
    '46%': { width: 9, height: 9 },
    '48%': { width: 0, height: 0 },
    '100%': { top: '31%', left: '29%', width: 0, height: 0 }
  },
  '@keyframes pointmove6': {
    '0%': { top: '50%', left: '49%', width: 0, height: 0 },
    '19%': { width: 0, height: 0 },
    '20%': { width: 9, height: 9 },
    '46%': { width: 9, height: 9 },
    '48%': { width: 0, height: 0 },
    '100%': { top: '10%', left: '49%', width: 0, height: 0 }
  },

  point: {
    // width: 10, height: 10,
    // top: "50%", left: "50%",
    background: '#9EACF2',
    borderRadius: '100vh',
    position: 'absolute'
  },
  move1: {
    WebkitAnimation: '$pointmove1 3s ease infinite',
    animation: '$pointmove1 3s ease infinite',
    MozAnimation: '$pointmove1 s ease infinite'
  },
  move2: {
    WebkitAnimation: '$pointmove2 3s ease infinite',
    animation: '$pointmove2 3s ease infinite',
    MozAnimation: '$pointmove2 s ease infinite'
  },
  move3: {
    WebkitAnimation: '$pointmove3 3s ease infinite',
    animation: '$pointmove3 3s ease infinite',
    MozAnimation: '$pointmove3 s ease infinite'
  },
  move4: {
    WebkitAnimation: '$pointmove4 3s ease infinite',
    animation: '$pointmove4 3s ease infinite',
    MozAnimation: '$pointmove4 s ease infinite'
  },
  move5: {
    WebkitAnimation: '$pointmove5 3s ease infinite',
    animation: '$pointmove5 3s ease infinite',
    MozAnimation: '$pointmove5 s ease infinite'
  },
  move6: {
    WebkitAnimation: '$pointmove6 3s ease infinite',
    animation: '$pointmove6 3s ease infinite',
    MozAnimation: '$pointmove6 s ease infinite'
  }
}));

const FileUploadingModal = (props: any) => {
  const classes = fileUploadingModalStyles();
  const { isUpload } = props;
  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      className={classes.root}
    >
      <Box className={classes.modalContent}>
        <Box
          // className={classes.uploadImg}
          style={{
            // backgroundImage: `url(${require(`assets/musicDAOImages/file_upload.webp`)})`,
            // backgroundRepeat: "no-repeat",
            // backgroundSize: "cover",
            // backgroundPosition: "center",
            // width: "100%",
            // height: "350px",
            position: 'relative'
          }}
        >
          <img
            src={require('assets/musicDAOImages/file_upload.webp')}
            alt="file uploading"
            className={classes.uploadImg}
          />
          <Box className={`${classes.point} ${classes.move1}`} />
          <Box className={`${classes.point} ${classes.move2}`} />
          <Box className={`${classes.point} ${classes.move3}`} />
          <Box className={`${classes.point} ${classes.move4}`} />
          <Box className={`${classes.point} ${classes.move5}`} />
          <Box className={`${classes.point} ${classes.move6}`} />
        </Box>
        {isUpload !== 2 && isUpload !== 3 && (
          <>
            <BorderLinearProgress
              variant="determinate"
              value={Math.floor(props.progress)}
              style={{ width: '80%', backgroundColor: '#9EACF2', height: 6 }}
            />
            <Box className={classes.progressValue} pt={2}>
              {props.progress}%
            </Box>
          </>
        )}
        <Box className={classes.uploading}>
          {isUpload === 2
            ? 'Encrypting...'
            : isUpload
            ? 'Uploading...'
            : 'Downloading...'}
        </Box>
        <Box className={classes.description} py={2}>
          {isUpload === 2
            ? 'DO NOT REFRESH THE PAGE OR CLOSE THE WINDOW. PLEASE WAIT...'
            : isUpload
            ? 'Your file is being uploaded to an encrypted decentralized storage system. Please wait.'
            : 'DO NOT REFRESH THE PAGE OR CLOSE THE WINDOW. PLEASE WAIT...'}
        </Box>
      </Box>
    </Modal>
  );
};

export default FileUploadingModal;
