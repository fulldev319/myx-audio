import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const playerStyles = makeStyles((theme) => ({
  player: {
    height: 100,
    width: '100%',
    background: '#13162B',
    maxHeight: 100,
    borderTopRightRadius: 24,
    [theme.breakpoints.down(750)]: {
      borderTop: '1px solid #eee',
      maxHeight: 250,
      height: 196
    }
  },
  songInfo: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      marginLeft: 12,
      cursor: 'pointer',
      width: 40
    }
  },
  albumImage: {
    width: 72,
    height: 72,
    minWidth: 72,
    marginRight: 8,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    [theme.breakpoints.down('xs')]: {
      width: 64,
      height: 64,
      minWidth: 64
    }
  },
  title: {
    maxWidth: 200,
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 14,
    lineHeight: '104.5%',
    display: 'flex',
    alignItems: 'center',
    color: '#ffffff'
  },
  artist: {
    maxWidth: 200,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: '120%',
    display: 'flex',
    alignItems: 'center',
    color: '#5F616A',
    marginTop: 4
  },
  controls: {
    height: '100%',
    display: 'flex',
    marginLeft: 10,
    marginRight: 24,
    alignItems: 'center',
    flex: 1,
    '& button': {
      backgroundColor: 'transparent',
      padding: 0,
      height: 'auto',
      borderRadius: 0,
      margin: '0px 10px',
      width: 'fit-content',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& svg': {
        width: 14.5
      }
    },
    '& button img': {
      height: 12
    },
    '& button:nth-child(2)': {
      padding: theme.spacing(1),
      width: 34,
      height: 34,
      borderRadius: 32,
      background: '#205580'
    }
  },
  spent: {
    padding: '12px 16px 8px',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: '104.5%',
    background: '#ffffff',
    borderRadius: 6,
    marginLeft: 40,
    textAlign: 'center',
    color: '#181818'
  },
  controlBox: {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    width: '70%',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  tracking: {
    width: '100%',
    '& div': {
      margin: '0px 5px'
    }
  },
  track: {
    width: '100%',
    flexGrow: 1,
    marginBottom: 6
  },
  trackMobile: {
    width: '93%',
    flexGrow: 1,
    position: 'absolute',
    bottom: 1
  },
  controlsRight: {
    display: 'flex',
    alignItems: 'center',
    width: 280,
    '& > img': {
      cursor: 'pointer',
      marginRight: 10
    },
    [theme.breakpoints.down('sm')]: {
      width: 180,
      flexDirection: 'column'
    },
    [theme.breakpoints.down('xs')]: {
      margin: '8px 0px 8px 8px',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  },
  free: {
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    borderRadius: 54,
    padding: '8px 16px',
    marginLeft: 16
  },
  pointer: {
    cursor: 'pointer'
  },
  fruitIcon: {
    background: 'transparent',
    color: 'black',
    height: 'unset',
    padding: 0
  },
  paper: {
    background: Color.White,
    boxShadow: '0px 47px 65px -11px rgba(36, 46, 60, 0.21)',
    borderRadius: 12,
    '& .MuiListItem-root.MuiMenuItem-root > svg': {
      marginRight: 12
    }
  },
  homeButton: {
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    borderRadius: '24px !important',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& svg': {
      marginRight: 12
    }
  },
  musicDetail: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: 12,
    background: 'rgba(255, 255, 255, 0.13)',
    borderRadius: theme.spacing(3),
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    color: '#fff',
    [theme.breakpoints.down('sm')]: {
      marginTop: 16
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 0
    }
  },
  musicDetailBox: {
    background: '#232323',
    boxShadow: '0px -1px 4px 1px rgba(140, 140, 140, 0.28)',
    borderRadius: 8,
    color: '#fff',
    padding: 16
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  artistName: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '24px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  genreLabel: {
    fontSize: 10,
    fontWeight: 400,
    background: '#815EF5',
    borderRadius: 32,
    padding: '8px 16px'
  },
  platformBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid white',
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  popBtnBox: {
    width: 32,
    height: 32,
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%'
  },
  mobileFooter: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    padding: 24
  },
  mobilePlayer: {
    display: 'flex',
    flexDirection: 'column',
    background: '#000',
    padding: '10px 20px 12px 10px',
    borderRadius: 5,
    position: 'relative',
    '& img': {
      width: 45,
      height: 44,
      borderRadius: 5,
      cursor: 'pointer',
      marginRight: 14
    }
  },
  mobileMenu: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  mobileHomeMenuItem: {
    background: '#5046BB',
    borderRadius: '38px',
    padding: '11px 20px',
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 400,
    color: '#fff'
  },
  likedIcon: {
    marginLeft: 20,
    marginTop: 6,
    cursor: 'pointer'
  }
}));
