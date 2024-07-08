import makeStyles from '@material-ui/core/styles/makeStyles';

export const modalStyles = makeStyles(() => ({
  content: {
    padding: '16px 0px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  typo1: {
    color: '#2D3047',
    fontSize: 22,
    fontWeight: 800
  },
  typo2: {
    color: '#54658F',
    fontSize: 16,
    fontWeight: 500,

    marginTop: 16
  }
}));
