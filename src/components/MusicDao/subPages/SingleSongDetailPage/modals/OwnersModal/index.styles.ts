import makeStyles from '@material-ui/core/styles/makeStyles';

export const modalStyles = makeStyles(() => ({
  root: {
    padding: '10px 0 0'
  },
  container: {
    width: '100%'
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 16,
    lineHeight: '130%',
    textTransform: 'uppercase',
    color: '#2D3047',
    textAlign: 'center',
    padding: 24
  }
}));
