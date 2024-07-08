import makeStyles from '@material-ui/core/styles/makeStyles';

export const profileNotFoundPageStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  background: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 37.95%, #F0F5F8 81.78%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    flex: 1,
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
