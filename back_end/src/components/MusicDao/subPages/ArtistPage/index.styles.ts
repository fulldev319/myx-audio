import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const artistPageStyles = makeStyles((theme) => ({
  content: {
    background: 'linear-gradient(180.15deg, #FFFFFF 2.8%, #EEF2F6 89.51%)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative'
  },
  gradient: {
    width: '100%',
    backgroundImage: `url(${require('assets/backgrounds/artist_background.webp')})`,
    backgroundSize: 'cover'
  },
  fitWidth: {
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `50px ${theme.spacing(10)}px 40px`,
    [theme.breakpoints.down('md')]: {
      padding: `42px ${theme.spacing(2)}px 32px`
    }
  },
  svgBox: {
    display: 'flex',
    cursor: 'pointer',
    '& svg': {
      width: 16,
      height: 16
    },
    '& path': {
      stroke: 'black'
    }
  },
  paper: {
    top: 20,
    borderRadius: 10,
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
    position: 'inherit'
  },
  whiteBox: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 19px',
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8',
    borderRadius: 49,
    marginLeft: 16,
    cursor: 'pointer'
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '44px',
    color: '#081831',
    fontWeight: 800,
    [theme.breakpoints.down('sm')]: {
      fontSize: '36px'
    }
  },
  headerSubTitle: {
    fontSize: '22px',
    color: '#2D3047',
    fontWeight: 800,
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px'
    }
  },
  header1: {
    fontSize: 21,
    fontWeight: 800,
    color: Color.MusicDAODark,
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px'
    }
  },
  header2: {
    fontSize: '16px',
    color: Color.MusicDAOLightBlue,
    fontWeight: 800,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px'
    }
  },
  header3: {
    fontSize: 14,
    fontWeight: 600,
    color: Color.MusicDAODark
  },
  header4: {
    fontSize: 13,
    fontWeight: 500,
    color: '#707582'
  },
  vert: {
    width: 1,
    height: 30,
    background: '#000000',
    opacity: 0.1,
    marginLeft: 48,
    marginRight: 48
  },
  tabs: {
    borderBottom: '1px solid #0000001A'
  },
  tabContainer: {
    display: 'flex',
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `24px ${theme.spacing(10)}px`,
    [theme.breakpoints.down('md')]: {
      padding: `24px ${theme.spacing(2)}px`
    }
  },
  claimTable: {
    maxWidth: 1600,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `30px ${theme.spacing(10)}px 150px`,
    [theme.breakpoints.down('md')]: {
      padding: `30px ${theme.spacing(2)}px 24px`
    }
  },
  verified: {
    display: 'flex',
    alignItems: 'center',
    '& span': {
      fontSize: 14,
      fontWeight: 600,
      color: '#2D3047',
      marginLeft: 4
    }
  },
  artistImage: {
    objectFit: 'cover',
    height: 300,
    width: 300,
    borderRadius: 16,
    position: 'absolute',
    top: 16,
    right: 80,
    [theme.breakpoints.down(1250)]: {
      right: 32
    },
    [theme.breakpoints.down('md')]: {
      right: 80
    }
  },
  socialTokenSection: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 25,
    background: '#FFFFFF',
    boxShadow: '0px 15px 16px -11px rgba(0, 0, 0, 0.02)',
    borderRadius: 20,
    padding: '30px 50px',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  typo1: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 24,
    lineHeight: '130%',
    paddingTop: 10
  },
  typo2: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '104%'
  },
  typo3: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '150%',
    wordBreak: 'break-word'
  },
  tab: {
    fontSize: 14,
    fontWeight: 500,
    color: '#2D3047',
    cursor: 'pointer',
    padding: '8px 17px',
    '& + &': {
      maringLeft: 12
    }
  },
  selectedTab: {
    borderRadius: 77,
    backgroundColor: '#2D3047',
    color: 'white'
  }
}));
