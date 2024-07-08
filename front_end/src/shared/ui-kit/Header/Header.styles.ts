import { makeStyles } from '@material-ui/core/styles';

export const headerStyles = makeStyles((theme) => ({
  header: {
    zIndex: 2,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px #99a1b3 solid',
    '& .header-left': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flexGrow: 1
    },
    '& .header-left .header-logo': {
      display: 'none',
      width: 64,
      height: 64
    },
    '& .header-right': {
      display: 'flex',
      alignItems: 'center'
    },
    '& .header-right button': {
      minWidth: 'fit-content'
    },
    '& .header-input': {
      background: '#f7f8fa',
      border: '1px solid #99a1b3',
      borderRadius: 10,
      height: 56,
      padding: '0px 19px 0px 19px',
      display: 'flex',
      alignItems: 'center',
      width: 'auto',
      maxWidth: 400,
      flexGrow: 1
    },
    '& .header-icons': {
      flexGrow: 1,
      // alignSelf: "stretch",
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '0 12px',
      [theme.breakpoints.down('sm')]: {
        padding: 0,
        paddingLeft: 12
      }
    },
    '& .header-buttons': {
      display: 'flex',
      alignItems: 'center'
    },
    '& .header-title': {
      fontWeight: 'normal',
      fontSize: 20,
      lineHeight: 26,
      padding: 0,
      marginRight: 30
    },
    '& .header-searchbar': {
      background: '#f7f8fa',
      border: '1px solid #99a1b3',
      borderRadius: 10,
      height: 56,
      width: 400,
      padding: '0px 19px',
      display: 'flex',
      alignItems: 'center'
    },
    '& .header-button': {
      marginRight: 10
    },
    '& .header-right .avatar-container': {
      marginLeft: 10,
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0
      }
    },
    '& .header-right .avatar-container .avatar': {
      width: 48,
      height: 48,
      borderRadius: '100%',
      position: 'relative',
      border: '4px solid rgba(0, 0, 0, 0.24)',
      boxSizing: 'content-box',
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)'
    },
    '& .header-right .avatar-container .avatar img': {
      width: '100%',
      height: '100%',
      borderRadius: '50%'
    },
    '& .header-right .avatar-container .avatar .online': {
      background: 'linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)',
      borderRadius: '50%',
      width: 12,
      height: 12,
      position: 'absolute',
      right: 0,
      bottom: -1,
      border: '2px solid white'
    },
    '& .header-right .avatar-container .avatar .offline': {
      color: 'gray',
      fontSize: 60,
      position: 'absolute',
      right: 0,
      bottom: -14,
      '-webkit-text-strokeWidth': 2,
      '-webkit-text-stroke-color': '#ffffff'
    },
    '& .header-left .header-title': {
      display: 'none'
    },
    '& .header-input-art': {
      background: '#f9f9f9',
      border: '1px solid #eaeaea',
      borderRadius: 6,
      height: 40,
      padding: '0px 19px',
      display: 'flex',
      alignItems: 'center',
      width: 'auto',
      maxWidth: 400,
      flexGrow: 1
    },
    // myx-app-header
    '& .myx-app-header': {
      borderBottom: 'none',
      display: 'flex',
      width: '100%',
      paddingLeft: 24,
      paddingRight: 24,
      [theme.breakpoints.down('sm')]: {
        paddingRight: 12,
        paddingLeft: 12
      }
    },
    '& .myx-app-header.data': {
      backgroundColor: '#191837',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 24,
        paddingRight: 12
      }
    },
    '& .myx-app-header.daos': {
      backgroundColor: 'transparent'
    },
    '& .myx-app-header.pix': {
      backgroundColor: 'transparent',
      paddingLeft: 0,
      [theme.breakpoints.down(769)]: {
        backgroundColor: '#9EACF2'
      }
    },
    '& .myx-app-header.pix .header-input': {
      paddingLeft: 24,
      marginLeft: 32
    },
    '& .myx-app-header.myx': {
      [theme.breakpoints.down(769)]: {
        height: 72,
        minHeight: 72,
        maxHeight: 72
      },
      [theme.breakpoints.down(751)]: {
        height: 56,
        minHeight: 56,
        maxHeight: 56
      }
    },
    '& .myx-app-header.flix': {
      [theme.breakpoints.down(769)]: {
        height: 72,
        minHeight: 72,
        maxHeight: 72
      },
      [theme.breakpoints.down(751)]: {
        height: 56,
        minHeight: 56,
        maxHeight: 56
      }
    },
    '& .myx-app-header .header-input': {
      paddingLeft: 24
    },
    // transparent
    '& .transparent': {
      height: 104,
      minHeight: 104,
      maxHeight: 104,
      paddingLeft: 75,
      backgroundColor: 'transparent',
      display: 'flex',
      width: '100%'
    },
    '& .transparent *': {
      zIndex: 2
    },
    '& .transparent .header-input': {
      background: 'rgba(255, 255, 255, 0.3)',
      border: '1px solid #ffffff',
      boxSizing: 'border-box',
      color: '#ffffff'
    },
    '& .transparent .header-input ::placeholder': {
      color: '#ffffff'
    },
    '& .transparent .header-buttons button:first-child': {
      color: '#ffffff',
      border: '1.5px solid #ffffff',
      boxSizing: 'border-box',
      backdropFilter: 'blur(10px)',
      borderRadius: 6,
      backgroundColor: 'transparent'
    },
    '& .transparent .header-buttons button:last-child': {
      background: '#ffffff',
      color: '#181818'
    }
  },
  empty: {},
  header_secondary_button: {
    marginRight: 20
  },
  appPopover: {
    padding: 24,
    background: '#ffffff',
    borderRadius: 20,
    boxShadow: '0px 24px 59px rgba(44, 50, 112, 0.19)',
    marginTop: 20,
    '& .itemBox': {
      display: 'flex',
      alignItems: 'center',
      padding: 20,
      borderRadius: 12,
      margin: 8,
      cursor: 'pointer'
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
  musicApp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: '#65CB63 !important',
    color: '#FFFFF !important',
    '& img': {
      marginLeft: 8
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 24,
      marginRight: 24,
      marginTop: 8
    }
  },
  mobilePopup: {
    '& *': {},
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
  navButton: {
    border: '1px solid #77788E',
    borderRadius: 32,
    padding: '0 16px',
    fontSize: 14,
    background: 'transparent',
    color: '#77788E'
  },
  navContainer: {
    '& button': {
      marginLeft: 8,
      marginRight: 8
    }
  },
  primaryBtn: {
    height: 40,
    padding: '0 26px !important',
    background: '#181818 !important',
    color: '#FFFFFF !important',
    fontSize: 16,
    letterSpacing: '-0.04em',
    fontWeight: 800
  },
  secondaryBtn: {
    height: 40,
    padding: '0 26px !important',
    color: '#151414 !important',
    border: '1.5px solid #707582 !important',
    fontSize: 16,
    letterSpacing: '-0.04em',
    fontWeight: 800
  },
  pixApp: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '11px 16px !important',
    background: 'transparent !important',
    color: '#431AB7 !important',
    fontSize: '16px !important',
    lineHeight: '21px !important',
    border: '1px solid #431AB7 !important',
    width: '100% !important',
    '& img': {
      width: '16.09px',
      height: '18.7px'
    }
  },
  createPix: {
    display: 'flex',
    alignItems: 'center',
    padding: '11px 16px !important',
    background: '#9EACF2 !important',
    color: '#DDFF57 !important',
    fontSize: '14px !important',
    lineHeight: '18px !important',
    border: 'none',
    margin: '0px !important',
    width: '100% !important',
    '& svg': {
      marginRight: '7px'
    }
  },
  accountInfo: {
    background: 'rgba(13, 13, 16, 0.5)',
    backdropFilter: 'blur(10px)',
    borderRadius: '25px',
    display: 'flex',
    border: 'none',
    height: '48px !important',
    cursor: 'pointer',
    color: '#FFFFFF',
    alignItems: 'center',
    '& > span': {
      marginRight: 10,
      marginTop: 2
    }
  },
  searchContainer: {
    border: '1px solid #1A1B1C20',
    borderRadius: 48,
    padding: '10px 18px',
    color: '#6b6b6b',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 360
  },
  searchMenuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    margin: 0,
    width: '100%'
  },
  userImage: {
    width: 32,
    height: 32,
    minWidth: 32,
    borderRadius: 15,
    backgroundColor: '#656e7e',
    marginRight: 10,
    filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.12))',
    cursor: 'pointer'
  },
  divider: {
    width: 1,
    height: 27,
    background: '#70758220',
    marginTop: 10,
    marginRight: 6,
    marginLeft: 6
  },
  searchMenuItemName: {
    fontWeight: 500,
    fontSize: '14px',
    color: '#404658'
  }
}));

export const useAutoCompleteStyles = makeStyles({
  root: {
    width: 360,
    background: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid #DADADB',
    borderRadius: 48,
    '& .MuiInputBase-root': {
      padding: '0 24px',
      width: '100%'
    }
  },
  paper: {
    borderRadius: 24,
    boxShadow:
      '0px 9px 9px -4px rgba(86, 101, 123, 0.15), 0px 28px 41px -1.17748px rgba(42, 52, 65, 0.12)'
  },
  listbox: {
    borderRadius: 24,
    background: 'rgba(255, 255, 255, 0.4)',
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
    height: 42,
    boxSizing: 'border-box',
    fontSize: 16,
    fontWeight: 600,

    color: '#6b6b6b'
  }
});
