import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const useClaimStyles = makeStyles((theme) => ({
  titleBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 22,

    fontWeight: 800,
    lineHeight: '130%',
    marginTop: 32,
    marginBottom: 24
  },
  sectionBox: {
    paddingTop: 16,
    paddingBottom: 24,
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  divider: {
    width: '100%',
    height: 1,
    background: 'rgba(84, 101, 143, 0.3)'
  },
  legoBox: {
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'center'
  },
  normalLegoImg: {
    // width: 200
  },
  blur: {
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    filter: 'blur(130px)',
    position: 'absolute',
    top: 500,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: 130
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    background: '#fff',
    borderRadius: 24,
    padding: 16,
    marginTop: 32,
    '& span': {
      fontWeight: 'bold',
      fontSize: 20,
      lineHeight: '24px',
      color: '#2D3047',
      marginLeft: 16
    }
  },
  priceGradient: {
    fontWeight: 800,
    fontSize: 48,
    lineHeight: '62px',
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)'
  },
  claimButton: {
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    color: '#fff',
    borderRadius: '100vh',

    fontWeight: 600,
    fontSize: 16,
    lineHeight: '20px',
    zIndex: 1
  },
  arrowRect: {
    width: 60,
    height: 60,
    background: '#fff',
    transform: 'rotate(45deg)',
    position: 'absolute',
    top: -20,
    borderRadius: 12
  },
  unstakeBox: {
    display: 'flex',
    alignItems: 'center',
    background: '#FFFFFF',
    boxShadow: '0px 30px 35px -12px rgba(29, 103, 84, 0.09)',
    borderRadius: 20,
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap'
    }
  },
  infoItem: {
    flex: 1
  },
  h1: {
    fontWeight: 800,
    fontSize: 25,
    lineHeight: '130%',
    '& span': {
      '&:first-child': {
        marginRight: 16
      },
      '&:last-child': {
        opacity: 0.5
      }
    }
  },
  h5: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '130%',
    color: '#65CB63'
  },
  buttons: {
    fontWeight: 600,
    fontSize: 18,
    lineHeight: '22px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    '& button': {
      height: 50,
      width: 150,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  firstButton: {},
  secondButton: {
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    color: '#fff'
  }
}));
