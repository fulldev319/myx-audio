import { makeStyles } from '@material-ui/core/styles';

export const cardStyles = makeStyles((theme) => ({
  podCard: {
    background: '#ffffff',
    boxShadow: '0px 10px 20px rgba(19, 45, 38, 0.07)',
    borderRadius: 20,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      boxShadow:
        '0px 16px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.02)'
    }
  },

  podImageContent: {
    height: '280px',
    margin: 8,
    position: 'relative',
    zIndex: 1
  },

  podImage: {
    position: 'relative',
    width: '100%',
    height: 0,
    paddingBottom: '100%',
    borderRadius: 14,
    cursor: 'pointer',
    overflow: 'hidden'
  },

  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: '100%',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    backgroundColor: 'white'
  },

  podInfo: {
    padding: '62px 16px 8px',
    flexGrow: 1,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    position: 'relative'
  },

  podInfoClaimed: {
    padding: '62px 16px 8px',
    flexGrow: 1,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    position: 'relative',
    background: '#0D59EE'
  },

  podInfoName: {
    fontWeight: 700,
    fontSize: '16px',
    color: '#2D3047',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },

  podInfoAlbum: {
    fontFamily: "'Pangram'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '19.5534px',
    lineHeight: '23px',
    color: '#2D3047',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: 0
  },

  podInfoAlbumClaimed: {
    fontFamily: "'Pangram'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '19.5534px',
    lineHeight: '23px',
    color: 'white',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: 0
  },

  price: {
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8',
    borderRadius: 36,
    padding: '4px 8px',
    fontSize: 12,
    color: '#2D3047',
    '& span': {
      fontWeight: 800
    }
  },

  divider: {
    marginTop: 8,
    marginBottom: 8,
    height: 1,
    backgroundColor: 'rgba(84, 101, 143, 0.3)',
    opacity: 0.4
  },

  name: {
    position: 'absolute',
    top: 8,
    left: 8,
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))',
    backdropFilter: 'blur(25.91px)',
    borderRadius: 6,
    padding: '5px 13px',
    color: 'white',
    fontSize: 13,
    fontWeight: 600,
    maxWidth: '45%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  tag: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 6,
    padding: '5px 13px',
    color: 'white',
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    maxWidth: '45%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  removeIcon: {
    width: 32,
    height: 32,
    borderRadius: 32,
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8;'
  },
  commonFooterEdition: {
    width: '40%',
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 11,
    lineHeight: '13px',
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#FFFFFF'
  },
  editionBall: {
    width: 24,
    height: 24,
    borderRadius: '100vh',
    border: '2px solid #FFFFFF',
    filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))',
    marginRight: 8
  },
  socialButtonBox: {
    display: 'flex'
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    marginRight: '2px',
    '& img': {
      cursor: 'pointer',
      width: '28px',
      height: '28px'
    }
  },
  artistName: {
    fontFamily: "'Pangram'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '13.0711px',
    lineHeight: '16px',
    color: '#2D3047',
    opacity: '0.6',
    marginLeft: 5
  },
  artistNameClaimed: {
    fontFamily: "'Pangram'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '13.0711px',
    lineHeight: '16px',
    color: '#FFFFFF',
    opacity: '0.6',
    marginLeft: 5
  },
  buyButton: {
    fontFamily: "'Pangram'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '15.2082px',
    lineHeight: '18px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: 'white',
    padding: '8px 18px',
    borderRadius: 20
  },
  openButton: {
    fontFamily: "'Pangram'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '15.2082px',
    lineHeight: '18px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: '#181818',
    padding: '8px 18px',
    borderRadius: 20
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#004ADB',
    padding: '18px 22px 30px',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  claimLabel: {
    fontFamily: "'Pangram'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '18.673px',
    lineHeight: '22px',
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent'
  },
  claimValue: {
    fontFamily: "'Pangram'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '19.6066px',
    lineHeight: '24px',
    color: '#FFFFFF',
    opacity: '0.9'
  },
  artistInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: '#EEF2FD',
    borderRadius: 13,
    padding: '8px 13px'
  },
  artistInfoClaim: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  typo1: {
    fontFamily: "'Pangram'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '18.673px',
    lineHeight: '22px',
    color: '#0D59EE'
  },
  typo2: {
    fontFamily: "'Pangram'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '19.6066px',
    lineHeight: '24px',
    color: '#2D3047',
    opacity: '0.9'
  },
  tileImage: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    borderRadius: 7,
    border: '2.96054px solid #000000',
    width: 50,
    height: 50
  },
  tileInfo: {
    position: 'absolute',
    bottom: 24,
    left: 90,
    borderRadius: 7,
    background: '#0D59EE',
    border: '2.96054px solid #000000',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    padding: 4,
    "& svg": {
      width: 13,
      height: 13
    }
  }
}));
