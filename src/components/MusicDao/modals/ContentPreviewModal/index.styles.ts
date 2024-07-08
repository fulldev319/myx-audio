import { makeStyles } from '@material-ui/core/styles';

export const contentPreviewModalStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    background: '#2D3047 !important',
    color: '#2D3047 !important',
    borderRadius: '20px !important',
    width: '100vw !important',
    maxWidth: '1440px !important',
    padding: '0px !important',
    height: '100vh !important'
  },
  nftContent: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1,
    marginTop: 20
  },
  viewLabel: {
    background: '#65CB63',
    padding: '8px 10px',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: '104.5%',

    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    width: 'fit-content',
    borderRadius: 6
  },
  mainContent: {
    minHeight: '100%',
    background: 'white',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  nftInfoSection: {
    padding: '50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: '491px',
    maxWidth: 491,
    [theme.breakpoints.down('md')]: {
      minWidth: 'initial',
      maxWidth: 'initial',
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 72
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: 82,
      paddingLeft: 16,
      paddingRight: 16
    }
  },
  nftPreviewSection: {
    background: '#2D3047 !important',
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: '48px 16px'
    }
  },
  songImage: {
    maxWidth: '100%',
    height: 400,
    borderRadius: 32,
    marginTop: 32,
    objectFit: 'contain',
    [theme.breakpoints.down('xs')]: {
      height: 300,
      borderRadius: 0
    }
  },
  speaker: {
    marginTop: 40,
    background: 'rgba(255, 255, 255, 0.1)',
    border: '0.726449px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 21,
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  createNftBtn: {
    background:
      'linear-gradient(90.07deg, #49E9FF 1.26%, #FFFFFF 98.76%), #FFFFFF',
    borderRadius: 48,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '20px',
    color: '#1C0A4C',
    cursor: 'pointer',
    padding: '15px 30px',
    width: 234
  },
  creatorinfoSection: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  typo1: {
    fontSize: 14,
    fontWeight: 500,

    lineHeight: '120%',
    color: '#54658F',
    [theme.breakpoints.down('xs')]: {
      fontSize: 11
    }
  },
  typo2: {
    fontSize: 27,
    fontWeight: 800,

    lineHeight: '130%',
    textTransform: 'uppercase'
  },
  typo3: {
    fontSize: 16,

    lineHeight: '150%',
    overflowWrap: 'break-word',
    color: '#54658F'
  },
  typo4: {
    fontsize: '14px',
    lineheight: '120%'
  },
  typo5: {
    fontWeight: 'bold',
    fontSize: '20px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: '#54658F'
  },
  shareButton: {
    width: 38,
    height: 38,
    border: '2px solid #65CB63',
    borderRadius: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      cursor: 'pointer',
      stroke: '#65CB63',
      color: '#65CB63',
      marginLeft: -4
    }
  },
  freejectShape: {
    position: 'absolute',
    width: '161.81px',
    bottom: 63,
    left: -112.44,
    zIndex: 0
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#2D3047 !important',
    borderRadius: '48px !important',
    color: 'white !important',
    fontSize: '16px !important',
    height: '48px !important',
    fontWeight: 'bold',
    minWidth: 250,
    '& + &': {
      marginLeft: '0 !important',
      marginTop: '40px !important'
    }
  },
  createButton: {
    background:
      'linear-gradient(301.58deg, #ED7B7B 32.37%, #EDFF1C 100.47%) !important'
  },
  editButton: {
    background: 'transparent !important',
    color: '#2D3047 !important',
    border: '1px solid #2D3047 !important'
  },
  close: {
    background: '#54658F',
    borderRadius: '100%',
    position: 'absolute',
    cursor: 'pointer',
    right: 40,
    top: 23,
    width: 65,
    height: 65,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    '& svg': {
      width: 20,
      height: 20
    },
    [theme.breakpoints.down('md')]: {
      width: 42,
      height: 42,
      right: 16,
      '& svg': {
        width: 14,
        height: 14
      }
    },
    [theme.breakpoints.down('xs')]: {
      right: 16,
      width: 32,
      height: 32,
      '& svg': {
        width: 12,
        height: 12
      }
    }
  },
  tag: {
    background: '#C6C6C6',
    backdropFilter: 'blur(25.91px)',
    borderRadius: 6,
    color: 'white',
    fontSize: 13,
    fontWeight: 600,

    textTransform: 'uppercase',
    padding: '5px 12px'
  },
  paper: {
    borderRadius: 10,
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
    position: 'inherit'
  },
  playTime: {
    fontSize: 20,
    fontWeight: 500,

    color: '#ffffff',
    lineHeight: '24px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 16
    }
  },
  playButton: {
    marginRight: 18,
    marginTop: 5,
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      marginRight: 8
    }
  },
  playTimeForProgressLine: {
    fontSize: 14,
    fontWeight: 800,

    color: '#2D3047',
    lineHeight: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%'
  },
  slider: {
    width: '90%',
    '& > div:first-child': {
      '& span': {
        fontSize: 14,
        fontWeight: 800,

        color: '#2D3047'
      }
    }
  },
  containerPlayer: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.6)',
    boxShadow: '0px 15px 35px -12px rgba(17, 32, 53, 0.02)',
    borderRadius: 60,
    padding: '11px 13px',
    marginTop: 80,
    position: 'relative'
  },
  playButtonForProgressLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#2D3047',
    borderRadius: '100%',
    width: 64,
    height: 64,
    cursor: 'pointer'
  },
  comingSoon: {
    position: 'absolute',
    top: -12,
    right: -20,

    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 12,
    lineHeight: '145.5%',
    color: '#FFFFFF',
    padding: '4px 9px',
    background: '#FF8E3C',
    borderRadius: 8
  },
  commentTitle: {
    fontSize: 19,
    fontWeight: 800,
    color: '#2D3047'
  },
  viewAllComment: {
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(101, 203, 99, 1)',
    cursor: 'pointer'
  },
  response: {
    fontSize: 14,
    fontWeight: 500,
    color: '#2D3047'
  },
  commentBox: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(7.5),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(0)
    }
  },
  inputBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white',
    [theme.breakpoints.down('sm')]: {
      position: 'unset'
    }
  },
  inputResponseWallPost: {
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #DADADB',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.spacing(1)
  },
  input: {
    border: 'none',
    flex: 1,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    background: 'none',
    outline: 'none',
    fontSize: 14
  },
  emojiImg: {
    width: '22px',
    height: '22px',
    cursor: 'pointer',
    border: '1px solid',
    borderRadius: '50%',
    display: 'flex'
  },
  sendImg: {
    width: '22px',
    height: '22px',
    cursor: 'pointer',
    display: 'flex'
  },
  divider: {
    height: 1,
    background: '#DAE6E5',
    marginLeft: -50,
    marginRight: -50,
    [theme.breakpoints.down('md')]: {
      marginLeft: -24,
      marginRight: -24
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: -16,
      marginRight: -16
    }
  },
  meta: {
    padding: '8px 0px',
    '& > span': {
      fontSize: 14,
      fontWeight: 600,
      color: '#54658F',
      marginLeft: 8,
      marginTop: 2
    }
  },
  verticalDivider: {
    width: 1,
    height: 55,
    border: '1px solid rgba(84, 101, 143, 0.3)',
    margin: '0px 14px'
  },
  viewMeta: {
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #F0F5F8 96.61%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: 16,
    fontWeight: 600
  },
  playMeta: {
    fontSize: 16,
    color: '#2D3047',
    fontWeight: 600
  }
}));
