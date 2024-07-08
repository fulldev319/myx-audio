import { makeStyles } from '@material-ui/core/styles';

export const useDraftDeletingModalStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: '#FFFFFF !important',
    boxShadow: '0px 38px 42px 17px rgba(33, 41, 48, 0.06)',
    color: '#2D3047 !important',
    width: '755px !important',
    borderRadius: '30px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontWeight: 'bold',
    fontSize: '22px',
    lineHeight: '28.6px',
    color: '#2D3047'
  },
  description: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#54658F',
    textAlign: 'center',
    wordBreak: 'break-word',
    '& span': {
      color: '#65CB63'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  button: {
    fontSize: '16px !important',
    background: 'white',
    paddingLeft: '39px !important',
    paddingRight: '39px !important',
    color: '#2D3047 !important',
    borderRadius: '48px !important',
    border: '1px solid #2D3047'
  },
  confirmButton: {
    fontSize: '16px !important',
    background: '#2D3047',
    paddingLeft: '45px !important',
    paddingRight: '45px !important',
    color: 'white !important',
    borderRadius: '48px !important'
  },
  checkButton: {
    fontSize: '14px !important',
    background: '#65CB63',
    paddingLeft: '32px !important',
    paddingRight: '32px !important',
    color: 'white !important',
    borderRadius: '48px !important'
  },
  revenueStreamingSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    border: '1px solid #65CB63',
    borderRadius: 12,
    padding: '30px 20px',
    marginTop: 32,
    position: 'relative'
  },
  revenueText: {
    fontSize: 13,
    lineHeight: '104%',
    color: '#2D3047',
    opacity: 0.6
  },
  check: {
    width: 135,
    position: 'relative',
    height: 135,
    border: '1px solid #281136',
    borderRadius: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&::before': {
      content: "''",
      position: 'absolute',
      top: 16,
      left: 16,
      width: 103,
      height: 103,
      background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
      borderRadius: '100%'
    },
    '& svg': {
      zIndex: 1
    }
  },
  loader: {
    WebkitAnimation: '$rotating 0.5s linear infinite',
    animation: '$rotating 0.5s linear infinite',
    MozAnimation: '$rotating 0.5s linear infinite'
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
  }
}));
