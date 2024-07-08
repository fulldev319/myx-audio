import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const uploadMediaTabStyles = makeStyles((theme) => ({
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#2D3047',
    opacity: 0.9,

    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '8px'
  },
  input: {
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #DADADB',
    borderRadius: 8,
    height: 45,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    outline: 'none',
    fontSize: 14,
    color: '#2D3047'
  },
  cardOptions: {
    padding: `0 ${theme.spacing(10)}px`
  },
  buttonsMediaTerms: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  buttonsMediaTermsBorder: {
    borderBottom: '1.5px solid #707582',
    width: '100%'
  },
  borderRoundBox: {
    padding: theme.spacing(0.25),
    border: '1px solid #707582',
    borderRadius: '50%',
    cursor: 'pointer'
  },
  mediaTermButton: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#707582',
    fontSize: '14px',
    borderRadius: '50%'
  },
  mediaTermButtonSelected: {
    background: '#65CB63',
    color: 'white'
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 800
  },
  uploadBox: {
    background: '#F0F5F5',
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(5)}px ${theme.spacing(5)}px`
  },
  controlBox: {
    background: '#F0F5F5',
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
  },
  datepicker: {
    width: '100%',
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: 0,
      '& .MuiInputAdornment-positionEnd': {
        marginLeft: 0
      }
    }
  },
  calendarImage: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  radioBox: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  inputBox: {
    background: '#F0F5F5',
    borderRadius: theme.spacing(1)
  },
  tokenTypeButton: {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    border: '1px solid #54658F',
    borderRadius: theme.spacing(4),
    fontSize: '14px',
    fontWeight: 500,
    color: '#54658F'
  },
  tokenTypeButtonSelected: {
    background: 'black',
    color: 'white'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'space-between',
      width: '100%',
      '& button': {
        width: '100%'
      }
    }
  },
  footerRight: {
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
      width: '100%',
      '& button': {
        width: '100%'
      }
    }
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
  loadingContainer: {
    border: '0.722591px solid #28113620',
    width: theme.spacing(15),
    height: theme.spacing(15),
    borderRadius: '50%',

    '& > svg': {
      WebkitAnimation: '$rotating 0.5s linear infinite',
      animation: '$rotating 0.5s linear infinite',
      MozAnimation: '$rotating 0.5s linear infinite'
    }
  },
  succededContainer: {
    border: '0.722591px solid #28113620',
    width: theme.spacing(15),
    height: theme.spacing(15),
    borderRadius: '50%'
  },
  subTitle: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '104.5%',
    color: '#2D3047',
    opacity: '0.9'
  },
  renderItemBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 26px',
    width: '100%',
    [theme.breakpoints.down(560)]: {
      paddingLeft: '8px',
      paddingRight: '8px'
    }
  },
  inviteBox: {
    [theme.breakpoints.down(560)]: {
      display: 'none'
    }
  },
  urlSlug: {
    fontSize: 16,
    color: '#404658',
    maxWidth: 120,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginLeft: 10,
    whiteSpace: 'nowrap',
    fontWeight: 500
  },
  addRound: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: '#65CB63',
    width: '29px',
    height: '29px',
    marginLeft: '12px',
    '& svg': {
      width: '10px',
      height: '10px'
    }
  },
  removeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    marginLeft: theme.spacing(1),
    border: '1.5px solid red',
    borderRadius: '50%',
    width: theme.spacing(3),
    height: theme.spacing(3),
    background: 'none',
    '& svg': {
      width: '10px',
      height: '10px'
    }
  },
  userTile: {
    padding: '20px 0px',
    color: '#404658',

    fontSize: '16px',
    borderBottom: '2px solid #00000021'
  },
  invitationSentBtn: {
    fontSize: 14,

    fontWeight: 500,
    lineHeight: '17px',
    color: '#FF8E3C'
  },
  stepText: {
    opacity: 0.9,
    position: 'relative',
    display: 'flex',
    '& h3': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 22,
      lineHeight: '104.5%',
      color: '#2D3047',
      marginTop: 0
      // marginBottom: 32
    },
    '& h5': {
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: '104.5%',
      textTransform: 'uppercase',
      color: Color.MusicDAOBlue,
      marginTop: -6,
      marginLeft: 8
    }
  }
}));

export const useAutocompleteStyles = makeStyles(() => ({
  root: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid rgba(78, 76, 132, 0.8)',
    borderRadius: 8,
    '& .MuiInputBase-root': {
      padding: '0 24px',
      width: '100%'
    }
  },
  paper: {
    borderRadius: 24,
    boxShadow:
      '0px 8px 8px -4px rgba(86, 101, 123, 0.15), 0px 24px 35px -1px rgba(42, 52, 65, 0.12)'
  },
  listbox: {
    borderRadius: 20,
    background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), #17172D',
    border: '1px solid #DEE7DA',
    padding: 0
  },
  option: {
    padding: 0,
    borderBottom: '1px solid #00000021',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  input: {
    height: 58,
    boxSizing: 'border-box',

    fontStyle: 'normal',
    fontWeight: 60,
    fontSize: '16px',
    lineHeight: '160%',
    color: '#7E7D95'
  }
}));
