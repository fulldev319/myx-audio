import makeStyles from '@material-ui/core/styles/makeStyles';
import { Color, Gradient } from 'shared/ui-kit';

export const useCreateTokenStyles = makeStyles((theme) => ({
  root: {
    width: '665px !important',
    '& > svg': {}
  },
  firstPage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 0 32px'
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    lineHeight: '130%',
    color: Color.MusicDAODark
  },
  label: {
    fontWeight: 500,
    fontSize: '18px',
    marginBottom: '18px',
    color: '#54658F',
    lineHeight: '150%',
    marginTop: '0px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    '& h5': {
      margin: '0px 0px 16px',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '18px',
      color: '#181818'
    },
    '& label': {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      color: '#181818',
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
    width: 'calc(100% - 45px)',
    marginLeft: '10px',
    marginTop: '18px',
    marginBottom: '-18px'
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '22px',
    '& div': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 'calc(100% / 4)',
      color: '#707582',
      fontWeight: 'normal',
      fontSize: '14px'
    },

    '& button': {
      background: '#ffffff',
      border: '1.5px solid #707582',
      boxSizing: 'border-box',
      color: '#707582',
      marginBlockEnd: '12px',
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

    '& div:first-child': {
      alignItems: 'flex-start',

      '& button': {
        marginLeft: '10px'
      }
    },

    '& div:last-child': {
      alignItems: 'flex-end',
      '& button': {
        marginRight: '10px'
      }
    }
  },
  selected: {
    fontSize: '14px',
    lineHeight: '120%',
    color: '#181818',

    '& button': {
      background: Gradient.Green1,
      color: 'white',
      border: 'none'
    }
  },
  buttons: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '32px',
    '& button': {
      fontSize: '16px',
      '& img': {
        width: '12px'
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
  dividerText: {
    zIndex: 2,
    textAlign: 'center',
    width: '145px',
    background: 'white',
    marginTop: '20px',
    color: '#707582',
    fontSize: '14px',
    marginBottom: '20px'
  },
  comingSoon: {
    position: 'absolute',
    top: 0,
    right: 34,

    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 12,
    lineHeight: '145.5%',
    color: '#FFFFFF',
    padding: '4px 9px',
    background: '#FF8E3C',
    borderRadius: 8
  }
}));
