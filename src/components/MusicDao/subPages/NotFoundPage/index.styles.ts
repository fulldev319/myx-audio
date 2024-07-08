import makeStyles from '@material-ui/core/styles/makeStyles';

export const notFoundPageStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    color: 'white'
  },
  background: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    textAlign: 'center',
    paddingTop: 160,
    paddingBottom: 160
  },
  title: {
    fontSize: 32,
    fontWeight: 400,
    lineHeight: '34px',
    '& > span': {
      fontWeight: 800
    },
    textTransform: 'uppercase'
  },
  description: {
    fontSize: 18,
    fontWeight: 400,
    lineHeight: '30px'
  }
}));
