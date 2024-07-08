import { makeStyles } from '@material-ui/core/styles';

export const useClaimUnstakeModalStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',

    color: '#2D3047'
  },
  iconImage: {
    width: 84
  },
  greenBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: theme.spacing(1.5),
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D'
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& button': {
      width: '40%',
      height: 50
    }
  },
  ethImg: {
    position: 'absolute',
    left: 'calc(50% - 34px)',
    top: 'calc(50% - 40px)',
    borderRadius: '50%',
    padding: '10px',
    boxShadow: '0px 0px 12px #dce7e1',
    width: '70px',
    height: '70px'
  },
  '@keyframes rotating': {
    from: {
      WebkitTransform: 'rotate(0deg)'
    },
    to: {
      WebkitTransform: 'rotate(360deg)'
    }
  },
  '@-webkit-keyframes rotating': {
    from: {
      WebkitTransform: 'rotate(0deg)'
    },
    to: {
      WebkitTransform: 'rotate(360deg)'
    }
  },
  '@-moz-keyframes rotating': {
    from: {
      WebkitTransform: 'rotate(0deg)'
    },
    to: {
      WebkitTransform: 'rotate(360deg)'
    }
  },
  loader: {
    WebkitAnimation: '$rotating 0.5s linear infinite',
    animation: '$rotating 0.5s linear infinite',
    MozAnimation: '$rotating 0.5s linear infinite'
  },
  amountBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #7BCBB7',
    boxSizing: 'border-box',
    borderRadius: '100vh',
    padding: '4px 12px'
  },

  h1: {
    fontWeight: 800,
    fontSize: 28,
    lineHeight: '104.5%'
  },
  h2: {
    fontWeight: 800,
    fontSize: 22,
    lineHeight: '130%'
  },
  h3: {
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: '104.5%'
  },
  h4: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: '20px'
  },
  h5: {
    fontWeight: 500,
    fontSize: 16,
    lineHeight: '160%'
  }
}));
