import makeStyles from '@material-ui/core/styles/makeStyles';

const addedSongStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4)
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
    fontWeight: 500
  }
}));

export default addedSongStyles;
