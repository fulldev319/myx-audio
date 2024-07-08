import makeStyles from '@material-ui/core/styles/makeStyles';

const confirmSubscriptionModalStyles = makeStyles((theme) => ({
  root: {
    width: '892px !important',
    boxShadow: '0px 38px 42px 17px rgba(35, 55, 50, 0.21) !important',
    borderRadius: '30px !important',
    '& button': {
      background: '#2D3047',
      width: 257,
      height: 59,
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '16px',
      lineHeight: '20px',
      textAlign: 'center',
      letterSpacing: '-0.04em',
      textTransform: 'uppercase',
      color: '#FFFFFF'
    }
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '22px',
    lineHeight: '130%',
    color: '#2D3047',
    textAlign: 'center'
  },
  description: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '150%',
    textAlign: 'center',
    color: '#54658F',
    opacity: '0.9'
  },
  box: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    borderRadius: 12,
    paddingLeft: 42,
    paddingRight: 42
  },
  boxItem: {
    width: '100%',
    paddingBottom: 32,
    paddingTop: 32,
    '& + &': {
      borderTop: '1px solid #DAE6E5'
    },
    '& > div:first-child': {
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '18px',
      lineHeight: '104.5%',
      textTransform: 'uppercase',
      color: '#65CB63',
      textAlign: 'center',
      marginBottom: 8
    },
    '& > div:last-child': {
      textAlign: 'center',
      fontStyle: 'normal',
      fontWeight: '800',
      fontSize: '19px',
      lineHeight: '25px',
      color: '#2D3047',
      '& span': {
        opacity: 0.6
      }
    }
  }
}));

export default confirmSubscriptionModalStyles;
