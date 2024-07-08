import makeStyles from '@material-ui/core/styles/makeStyles';

const addedSongStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(10),
    color: '#2D3047',
    maxWidth: 1440,
    [theme.breakpoints.down(1100)]: {
      padding: theme.spacing(3)
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(5)
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2)
    }
  },
  borderBox: {
    border: '1px dashed #788BA2',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 800
  },
  description: {
    fontSize: 18,
    fontWeight: 500,
    [theme.breakpoints.down('xs')]: {
      fontSize: 16
    }
  }
}));

export default addedSongStyles;
