import makeStyles from '@material-ui/core/styles/makeStyles';

export const modalStyles = makeStyles((theme) => ({
  container: {
    background: 'white',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.25)',
    borderRadius: 32,
    width: '554px !important',
    maxWidth: 'none !important',
    color: '#2D3047 !important',
    padding: '64px 40px !important',
    '& button': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#2D3047',
      color: 'white',
      fontSize: 14,
      fontWeight: 800,
      lineHeight: '18px',
      borderRadius: 34,
      minWidth: 256,
      height: 49,
      paddingLeft: 32,
      paddingRight: 32
    }
  },
  gradientContainer: {
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    color: 'white !important',
    '& button': {
      background: 'white',
      color: '#2D3047'
    }
  },
  green: {
    color: '#65CB63'
  },
  title: {
    fontSize: 30,
    lineHeight: '40px',
    fontWeight: 800,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  errors: {
    marginLeft: '10px',
    color: 'red',
    fontSize: 14
  },
  subTitle: {
    fontSize: 22,
    lineHeight: '28px',
    fontWeight: 800,
    textAlign: 'center'
  },
  description: {
    fontSize: 18,
    fontWeight: 400,
    lineHeight: '27px',
    textAlign: 'center'
  },
  cryIcon: {
    width: 96,
    height: 96,
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    borderRadius: '100%',
    fontSize: 64,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  warning: {
    fontSize: 65
  },
  buttonImage: {
    width: 20,
    height: 20
  },
  logoImage: {
    width: 64,
    height: 64
  },
  progress: {
    border: '1px solid rgba(64, 70, 88, 0.19)',
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%'
  }
}));
