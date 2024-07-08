import { makeStyles } from '@material-ui/core/styles';

export const useVerifyProfileModalStyles = makeStyles((theme) => ({
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
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: '22px',
    lineHeight: '28.6px',
    color: '#2D3047',
    marginBottom: '5px'
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
  saluteIcon: {
    width: '90px',
    height: '90px',
    marginBottom: '46px'
  },
  button: {
    position: 'relative',
    width: '381px !important',
    height: '54px !important',
    background: '#1DA1F2 !important',
    borderRadius: '10px !important',
    color: 'white',

    fontSize: '16px',
    lineHeight: '20px',
    marginTop: '38px',
    [theme.breakpoints.down('xs')]: {
      width: '256px !important'
    }
  },
  twitterIcon: {
    position: 'absolute',
    left: '16px',
    top: '17px'
  },
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    width: '400px',
    marginBottom: '94px',
    [theme.breakpoints.down('xs')]: {
      width: 260
    }
  },
  line: {
    height: '1px',
    background: '#9897B8',
    flex: 1
  },
  stepCircleOuter: {
    border: '1px solid #9897B8',
    borderRadius: '50%',
    width: '46px',
    height: '46px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2.5px',
    position: 'relative',
    '& span': {
      color: '#9897B8',

      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '120%'
    },
    '& label': {
      position: 'absolute',
      top: '50px',
      whiteSpace: 'nowrap',
      color: '#2D3047',
      fontSize: 14,
      fontWeight: 600
    }
  },
  stepCircleInner: {
    background: '#65CB63',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white !important'
  },
  urlInputBox: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '13px'
  },
  urlInputLabel: {
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '16px',
    color: '#2D3047',
    marginBottom: '10px'
  },
  urlInput: {
    background: 'rgba(218, 230, 229, 0.06)',
    border: '1px solid rgba(218, 218, 219, 0.59)',
    width: '647px',
    height: '47px',
    paddingLeft: '19px',
    color: '#2D3047B2',
    '&:focus': {
      outline: 'none'
    },
    [theme.breakpoints.down('xs')]: {
      width: 340
    }
  },
  confirmButton: {
    background: '#2D3047',
    width: '249px !important',
    height: '48px !important',
    color: 'white !important',
    marginTop: '43px',
    borderRadius: '48px !important'
  }
}));
