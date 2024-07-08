import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const musicStyles = makeStyles((theme) => ({
  contentContainer: {
    display: 'flex',
    width: '100%',
    overflowX: 'hidden'
  },
  content: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    '&::-webkit-scrollbar': {
      width: 10
    },
    '&::-webkit-scrollbar-thumb': {
      width: 20,
      background: 'rgba(238, 241, 244, 1)'
    }
  },
  mainContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    background: '#081047'
  },
  avatar: {
    width: '48px',
    border: '2px solid #ffffff',
    height: '48px',
    position: 'relative',
    boxShadow: '0px 2px 8px rgb(0 0 0 / 20%)',
    boxSizing: 'content-box',
    borderRadius: '100%'
  },
  arrows: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2,
    top: 35,
    left: 270,
    '& button': {
      background: 'transparent',
      borderRadius: 0,
      padding: 0
    },
    '& button:first-child': {
      marginLeft: 30,
      marginRight: 42
    },
    '& button img': {
      width: 8,
      height: 16
    },
    '& button:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    '& button:first-child img': {
      transform: 'rotate(180deg)'
    },
    '& button:last-child': {
      marginRight: 30
    }
  },
  accountInfo: {
    backgroundColor: 'white',
    display: 'flex',
    height: '45px !important',
    cursor: 'pointer',
    marginRight: 11,
    '& > span': {
      marginRight: 10,
      marginTop: 2
    }
  },
  backBtnBox: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#fff'
  },
  filterButtonBox: {
    background: 'rgba(240, 245, 248, 0.7)',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px`,
    cursor: 'pointer',
    borderRadius: '100vh',
    border: '1px solid #ccc',
    color: '#54658F',
    [theme.breakpoints.down('xs')]: {
      padding: '8px'
    }
  },
  mobilePopup: {
    '& .avatar-container .avatar': {
      width: 36,
      height: 36,
      marginRight: 7,
      marginLeft: -3,
      borderRadius: '100%',
      position: 'relative',
      border: '2px solid #ffffff',
      boxSizing: 'content-box',
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)'
    },
    '& .avatar-container .avatar .online': {
      background: 'linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)',
      borderRadius: '50%',
      width: 12,
      height: 12,
      position: 'absolute',
      right: 0,
      bottom: -1,
      border: '2px solid white'
    },
    '& .avatar-container .avatar .offline': {
      color: 'gray',
      fontSize: 60,
      position: 'absolute',
      right: 0,
      bottom: -14,
      '-webkit-text-strokeWidth': 2,
      '-webkit-text-stroke-color': '#ffffff'
    },
    '& .MuiList-padding': {
      padding: '8px'
    },
    '& .MuiListItem-root.MuiMenuItem-root': {
      fontSize: 14,
      fontWeight: 700,
      padding: 8,
      '& svg': {
        marginRight: 8
      }
    }
  },
  header_popup_arrow: {
    position: 'absolute',
    top: 21,
    left: 0,
    fontSize: 7,
    width: 20,
    height: 10,
    '&::before': {
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderWidth: '0 10px 10px 10px',
      borderColor: 'transparent transparent black transparent'
    }
  },
  header_popup_back: {
    borderRadius: 20,
    marginTop: 10,
    padding: '10px 20px',
    background: '#000000',
    color: '#ffffff'
  },
  header_popup_back_item: {
    cursor: 'pointer',
    padding: 20,
    borderBottom: '1px solid #ffffff',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  header_popup_back_item1: {
    cursor: 'pointer',
    padding: 20,
    paddingBottom: 0
  },
  searchBox: {
    background: 'rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    padding: `12px`,
    cursor: 'pointer',
    borderRadius: '100vh',
    // border: '1px solid #ccc',
    // color: Color.MusicDAODark,
    // maxWidth: 300,
    marginRight: 24,
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      padding: '8px'
    }
  }
}));
