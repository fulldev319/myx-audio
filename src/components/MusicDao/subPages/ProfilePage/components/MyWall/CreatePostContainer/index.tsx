import React from 'react';
import Box from 'shared/ui-kit/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  createPostContainer: {
    width: '100%',
    height: 72,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 20,
    lineHeight: '104.5%',
    color: '#431AB7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(158, 172, 242, 0.16)',
    border: '1px solid #9EACF2',
    boxShadow: '0px 4px 8px #9EACF2',
    boxSizing: 'border-box',
    borderRadius: 10,
    marginTop: 80,
    marginBottom: 16,
    paddingLeft: 16,
    cursor: 'pointer',
    overflow: 'hidden',
    '& img': {
      marginRight: 16,
      width: 40,
      height: 40
    }
  },
  send: {
    background: '#431AB7',
    height: 72,
    width: 72,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& img': {
      marginRight: 0
    }
  }
}));

const CreatePostContainer = ({ handleOpenCreatePostModal }) => {
  const classes = useStyles();

  return (
    <div
      className={classes.createPostContainer}
      onClick={handleOpenCreatePostModal}
    >
      <div>Write your post...</div>
      <Box display="flex" alignItems="center">
        <img src={require('assets/icons/camera.svg')} alt="camera" />
        <img src={require('assets/icons/cam.svg')} alt="video" />
        <div className={classes.send}>
          <img src={require('assets/icons/send_white.svg')} alt="send" />
        </div>
      </Box>
    </div>
  );
};

export default CreatePostContainer;
