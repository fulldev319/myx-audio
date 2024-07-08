import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const createPodModalStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '',
    padding: 0
  },
  titleBar: {
    height: 94,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 30px',

    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 18,
    lineHeight: '130%',
    color: '#2D3047',
    borderBottom: '1px solid #DAE6E5'
  },
  proposalTypeItem: {
    width: 120,
    height: 120,
    background: '#FFFFFF',
    boxShadow:
      'inset 0px 0px 2px rgba(0, 0, 0, 0.12), inset 0px 24px 11px rgba(0, 0, 0, 0.03), inset 0px 3px 8px rgba(0, 0, 0, 0.06)',
    borderRadius: 35
  },
  headerTitle: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '22px',
    lineHeight: '130%',
    color: '#2D3047',
    textAlign: 'center'
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '32px',
    lineHeight: '130%',
    color: '#2D3047'
  },
  collabGradient: {
    background: `linear-gradient(266.07deg, #511FDF 25.41%, #3FB7FF 86.68%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subTitle: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '104.5%',
    color: '#2D3047',
    opacity: '0.9'
  },
  introTypo1: {
    fontSize: 19,
    fontWeight: 800,
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    '-webkit-text-fill-color': 'transparent',
    '-webkit-background-clip': 'text',
    lineHeight: '130%',

    width: 'fit-content',
    textTransform: 'uppercase',
    [theme.breakpoints.down('xs')]: {
      fontSize: 16
    }
  },
  introTypo2: {
    fontSize: 16,
    fontWeight: 500,

    color: '#54658F'
  },
  typo1: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '160%',
    color: '#2D3047'
  },
  typo2: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '20px',
    textAlign: 'center',
    lineHeight: '104.5%',
    color: '#2D3047',
    opacity: '0.9'
  },
  gradientTypo: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    lineHeight: '130%',
    // textTransform: "uppercase",
    background: `linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  alertTypo: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '150%',
    // textAlign: "center",
    background: `linear-gradient(80.77deg, #FFB800 -52.72%, #FF9F00 10.9%, #FF8A00 63.78%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    '& + span': {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '150%',
      color: '#FF8A00',
      textDecoration: 'underline'
    }
  },
  warningScreenInvest: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 39px 50px',
    background:
      'linear-gradient(180deg, rgba(218, 230, 229, 0.2) 16.84%, rgba(255, 255, 255, 0) 49.69%), linear-gradient(0deg, #FFFFFF, #FFFFFF), #DAE6E5',
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '80%'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      padding: '20px 12px 20px'
    },
    '& h3': {
      marginTop: 24,
      marginBottom: 40,
      textAlign: 'center'
    },
    '& h4': {
      marginTop: 0,
      marginBottom: 8
    },
    '& p': {
      marginTop: 0,
      marginBottom: 0
    },
    '& span': {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '10px',
      lineHeight: '160%',
      textAlign: 'center',
      color: '#7E7D95'
    },
    '& button': {
      minHeight: 50,
      height: 50,
      width: '60%',
      marginBottom: 50,
      borderRadius: '100vh',
      border: 'none',
      color: '#ffffff',
      background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',

      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: '16px',
      lineHeight: '18px',
      textAlign: 'center',
      [theme.breakpoints.down('xs')]: {
        marginBottom: 0
      }
    },
    '& b': {
      fontWeight: 800
    }
  },
  warningScreenCollab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 39px 50px',
    width: '50%',
    background:
      'linear-gradient(180deg, rgba(218, 230, 229, 0.2) 16.84%, rgba(255, 255, 255, 0) 49.69%), linear-gradient(0deg, #FFFFFF, #FFFFFF), #DAE6E5',
    [theme.breakpoints.down('sm')]: {
      width: '80%'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      padding: '20px 12px 20px'
    },
    '& h3': {
      marginTop: 0,
      marginBottom: 0
    },
    '& h4': {
      marginTop: 0,
      marginBottom: 8,

      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '18px',
      lineHeight: '130%',
      color: '#2D3047'
    },
    '& p': {
      marginTop: 0,
      marginBottom: 0
    },
    '& span': {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '10px',
      lineHeight: '160%',
      textAlign: 'center',
      color: '#7E7D95'
    },
    '& button': {
      minHeight: 50,
      height: 50,
      width: '60%',
      marginBottom: 50,
      borderRadius: '100vh',
      border: 'none',
      color: '#ffffff',
      background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',

      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: '16px',
      lineHeight: '18px',
      textAlign: 'center',
      [theme.breakpoints.down('xs')]: {
        marginBottom: 0
      }
    },
    '& b': {
      fontWeight: 800
    }
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: '64px 42px 57px',
    background:
      'linear-gradient(180deg, rgba(218, 230, 229, 0.2) 16.84%, rgba(255, 255, 255, 0) 49.69%), linear-gradient(0deg, #FFFFFF, #FFFFFF), #DAE6E5',
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '80%'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      padding: '24px 22px 42px'
    }
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // marginTop: "32px",
    '& button': {
      width: '300px',
      height: '59px',
      borderRadius: '48px',

      fontWeight: 800,
      lineHeight: '20px',
      border: 'none',
      maxWidth: 'auto',
      '&:first-child': {
        background: '#FFFFFF',
        color: '#2D3047',
        border: '1px solid #2D3047',
        marginRight: 16,
        [theme.breakpoints.down('xs')]: {
          marginRight: 4
        }
      },
      '&:last-child': {
        marginLeft: 16,
        [theme.breakpoints.down('xs')]: {
          marginLeft: 4
        }
      }
    }
  },
  stepsBorder: {
    borderBottom: '1.5px solid #707582',
    width: 'calc(100% - 25%)',
    marginLeft: '12.5%',
    marginTop: '22px',
    marginBottom: '-18px'
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '8px',
    [theme.breakpoints.down('sm')]: {},
    '& > div': {
      position: 'relative',
      width: '25%',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      '& span': {
        position: 'absolute',
        top: 36,
        textAlign: 'center',

        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '160%',
        color: '#7E7D95',
        opacity: 0.8
      }
    },
    '& button': {
      background: '#ffffff',
      border: '1.5px solid #9897B8',
      color: '#54658F',
      width: 35,
      height: 35,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      borderRadius: '50%',

      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: 14,
      lineHeight: '120%',
      '& div': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }
  },
  selected: {
    color: '#181818',
    '& button': {
      border: '0.858716px solid #9897B8',
      '& div': {
        color: 'white',
        background: Color.MusicDAOBlue,
        width: 29,
        height: 29,
        borderRadius: '50%',
        alignItems: 'center !important',
        justifyContent: 'center',
        fontWeight: 800
      }
    }
  },
  divider: {
    width: 'calc(100% + 84px)',
    marginLeft: -42,
    height: 1,
    background: '#DAE6E5',
    marginBottom: 38,
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% + 44px)',
      marginLeft: -22
    }
  },
  radio: {
    display: 'flex',
    justifyContent: 'center',
    '& .MuiRadio-colorSecondary': {
      color: `${Color.MusicDAOBlue} !important`
    },
    '& .MuiFormControlLabel-label': {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '104.5%',
      textAlign: 'center',
      color: '#65CB63'
    }
  },
  complete: {
    position: 'absolute',
    top: -20
  },
  tipSection: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 40,
    '& div': {
      marginLeft: 12
    }
  },
  stepText: {
    '& h3': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 22,
      lineHeight: '104.5%',
      color: '#2D3047',
      marginTop: 0,
      marginBottom: 32
    },
    '& h5': {
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: '104.5%',
      textTransform: 'uppercase',
      color: Color.MusicDAOBlue,
      marginTop: 0,
      marginBottom: 8
    },
    opacity: 0.9
  },
  workSpace: {
    background:
      'linear-gradient(180deg, rgba(218, 230, 229, 0.2) 16.84%, rgba(255, 255, 255, 0) 49.69%), linear-gradient(0deg, #FFFFFF, #FFFFFF), #DAE6E5',
    display: 'flex',
    justifyContent: 'center',
    height: 'calc(100vh - 216px)',
    overflowY: 'auto'
  },
  footerBar: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    height: 122,
    border: '1px solid #DAE6E5',
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      padding: '0 16px'
    }
  },
  resultSection: {
    height: 'calc(100vh - 94px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loader: {
    WebkitAnimation: '$rotating 0.5s linear infinite',
    animation: '$rotating 0.5s linear infinite',
    MozAnimation: '$rotating 0.5s linear infinite'
  },
  ethImg: {
    position: 'absolute',
    left: 'calc(50% - 34px)',
    top: 'calc(50% - 35px)',
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
  imgSuccess: {
    width: 200,
    height: 200,
    borderRadius: 12,
    objectFit: 'contain'
  },
  resultDescription: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#54658F',
    textAlign: 'center',
    wordBreak: 'break-word',
    whiteSpace: 'pre-line',
    '& span': {
      color: '#65CB63'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  checkButton: {
    fontSize: '14px !important',
    background: Color.MusicDAOBlue,
    paddingLeft: '32px !important',
    paddingRight: '32px !important',
    color: 'white !important',
    borderRadius: '48px !important'
  }
}));
