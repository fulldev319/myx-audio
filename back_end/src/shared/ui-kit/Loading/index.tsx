import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  circular: {
    width: 40,
    height: 40,
    color: 'rgb(39, 232, 217)'
  }
}));

const Loading = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <CircularProgress className={classes.circular} />
    </div>
  );
};

export default Loading;
