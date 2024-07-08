import makeStyles from '@material-ui/core/styles/makeStyles';
import { Color, Gradient } from 'shared/ui-kit';

export const useCreateSongStyles = makeStyles((theme) => ({
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
  stepText: {
    opacity: 0.9,
    position: 'relative',
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
      color: '#65CB63',
      marginTop: 0,
      marginBottom: 8
    }
  },
  content: {
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
    },
    '& label': {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: 16,

      display: 'flex',
      alignItems: 'center',
      color: '#2D3047',
      '& img': {
        marginLeft: '8px'
      }
    },
    '& .MuiOutlinedInput-root': {
      width: '100%',
      height: 40
    },
    '& .MuiOutlinedInput-input': {
      padding: '14px'
    },
    '& .MuiFormControl-root': {
      marginTop: '8px',
      width: '100%',
      marginBottom: '20px'
    }
  },
  stepsBorder: {
    borderBottom: '1.5px solid #707582',
    width: 'calc(100% - 70px)',
    marginLeft: '30px',
    marginTop: '18px',
    marginBottom: '-18px'
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    // marginBottom: '22px',
    '& div': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#707582',
      fontWeight: 'normal',
      fontSize: '14px',
      width: 50
    },
    '& button': {
      background: '#ffffff',
      border: '1.5px solid #707582',
      boxSizing: 'border-box',
      color: '#707582',
      marginBlockEnd: '6px',
      width: '34px',
      height: '34px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      borderRadius: '50%',
      fontSize: '14px',
      fontWeight: 'normal'
    },
    [theme.breakpoints.down('xs')]: {
      alignItems: 'start',
      '& div': {
        fontSize: 12,
        '& span': {
          textAlign: 'center'
        }
      },
      '& div:nth-child(1)': {
        '& span': {
          paddingBottom: 16
        }
      },
      '& div:nth-child(2)': {
        // marginLeft: 45,
      },
      '& div:nth-child(3)': {
        // marginLeft: 18,
      }
    }
  },
  selected: {
    fontSize: '14px',
    lineHeight: '120%',
    color: '#181818',

    '& button': {
      border: '0.858716px solid #9897B8',
      '& div': {
        color: 'white',
        background: Color.MusicDAOGreen,
        width: 28,
        height: 28,
        borderRadius: '50%',
        alignItems: 'center !important',
        justifyContent: 'center'
      }
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
        marginRight: 32,
        [theme.breakpoints.down('xs')]: {
          marginRight: 4
        }
      },
      '&:last-child': {
        marginLeft: 32,
        [theme.breakpoints.down('xs')]: {
          marginLeft: 4
        }
      }
    }
  },
  select: {
    '& > div': {
      paddingBottom: '11px',
      minWidth: '364px'
    }
  },
  hashtags: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '-5px',
    '& div': {
      cursor: 'pointer',
      marginRight: '8px',
      background: 'white',
      border: '1px solid #707582',
      color: '#707582',
      fontSize: '14.5px',
      padding: '7px 12px 6px',
      borderRadius: '36px',
      '&.selected': {
        color: 'white',
        borderColor: 'black',
        background: 'black'
      }
    },
    '& img': {
      marginLeft: '7px',
      width: '18px',
      height: '18px',
      cursor: 'pointer'
    }
  },
  inputsRow: {
    display: 'flex',
    alignItems: 'center',
    '& div': {
      display: 'flex',
      flexDirection: 'column'
    },
    '& > :nth-child(2)': {
      width: '30%'
    },
    '& > :first-child': {
      marginRight: '18px',
      width: '70% !important'
    },
    '& input': {
      width: '100%'
    }
  },
  inputSelectorRow: {
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: '45px',
    '& > .MuiPaper-rootdiv': {
      display: 'flex',
      flexDirection: 'column'
    },
    '& > :nth-child(2)': {
      width: '20%'
    },
    '& > :first-child': {
      marginRight: '18px',
      width: '80% !important'
    },
    '& input': {
      width: '100%'
    },
    '& .MuiFormControl-root': {
      marginBottom: '16px',
      '& > div': {
        height: '44px',
        '& > div': {
          padding: '10px'
        }
      }
    }
  },
  add: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '& img': {
      marginLeft: '10px',
      marginRight: '10px',
      width: '10px',
      height: '10px'
    },
    '& span': {
      background: Gradient.Green,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontSize: '14px'
    }
  },
  radioGroup: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    marginBottom: '45px',
    alignItems: 'center',
    fontSize: 14,
    '& .Mui-checked': {
      color: '#181818',
      '& ~ .MuiFormControlLabel-label': {
        color: '#181818'
      }
    }
  },
  infoMessage: {
    margin: '-20px 0px 25px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '16px 23px 17px 17px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    color: '#707582',
    borderRadius: '6px',
    border: '1px solid #E0E4F3',
    '& img': {
      marginRight: '16px',
      width: '18px',
      height: '18px'
    },
    '& p': {
      margin: 0
    }
  },
  dragImageHereImgTitleDesc: {
    borderRadius: 7,
    cursor: 'pointer',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    border: '1px dashed #b6b6b6',
    boxSizing: 'border-box',
    padding: '40px 20px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundColor: '#F7F9FE'
  },
  dragImageHereLabelImgTitleDesc: {
    fontWeight: 400,
    color: '#99a1b3',
    fontSize: '18px',
    marginLeft: 18
  },
  divider: {
    marginBottom: '20px',
    opacity: 0.2,
    backgroundColor: '#707582',
    width: '100%',
    height: 1
  },
  back: {
    position: 'absolute',
    top: 24,
    left: 24,
    cursor: 'pointer'
  },
  comingSoon: {
    [theme.breakpoints.down('xs')]: {
      top: 0,
      right: -10
    },
    width: 'fit-content',
    position: 'absolute',
    top: 16,
    left: 200,

    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 12,
    lineHeight: '145.5%',
    color: '#FFFFFF',
    padding: '4px 9px',
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    borderRadius: 8
  },
  tickSuccess: {
    position: 'absolute',
    top: -20,
    left: 0
  },
  tickFail: {
    position: 'absolute',
    top: -13,
    left: 0
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
  title: {
    fontWeight: 'bold',
    fontSize: '22px',
    lineHeight: '28.6px',
    color: '#2D3047',
    textAlign: 'center'
  },
  description: {
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
    background: '#65CB63',
    paddingLeft: '32px !important',
    paddingRight: '32px !important',
    color: 'white !important',
    borderRadius: '48px !important'
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
  imgSuccess: {
    width: 200,
    height: 200,
    borderRadius: 12,
    objectFit: 'contain'
  },

  closeRoot: {
    width: '665px !important',
    '& > svg': {}
  },
  closeContent: {
    display: 'flex',
    flexDirection: 'column',
    '& h5': {
      margin: '0px 0px 16px',

      fontWeight: 800,
      fontSize: '22px',
      color: '#2D3047',
      lineHeight: '130%',
      textAlign: 'center'
    },
    '& h3': {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '150%',
      textAlign: 'center',
      color: '#54658F',
      opacity: 0.9,
      marginTop: 24
    }
  },
  closeButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: '32px',
    '& button': {
      fontSize: '16px',
      width: 150,
      [theme.breakpoints.down('xs')]: {
        fontSize: 14
      },
      '& img': {
        width: '12px'
      }
    }
  }
}));
