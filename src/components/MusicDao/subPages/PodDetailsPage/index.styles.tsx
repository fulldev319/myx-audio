import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';
import { isFirefox } from 'react-device-detect';

export const usePodDetailStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    paddingBottom: '40px',
    display: 'flex'
  },
  subContainer: {
    width: '100%',
    scrollbarWidth: 'none',
    height: 'calc(100vh - 80px)',
    paddingBottom: '80px'
  },
  fractionBox: {
    color: 'white',
    borderRadius: 8,
    padding: '4px 11px',
    fontSize: '14px',
    background: '#65CB63',
    fontWeight: 600
  },
  title: {
    fontSize: 44,
    fontWeight: 800,
    lineHeight: '104.5%',

    color: '#081831',
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    marginTop: 16,
    [theme.breakpoints.down('xs')]: {
      fontSize: 20
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  header1: {
    fontSize: 14,
    fontWeight: 500,

    color: '#707582',
    lineHeight: '140%',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  header2: {
    fontSize: '20px',
    fontWeight: 400,
    color: '#2D3047',
    [theme.breakpoints.down('xs')]: {
      fontSize: 16
    }
  },
  header3: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#2D3047'
  },
  header4: {
    fontSize: 22,
    fontWeight: 800,
    color: Color.MusicDAODark
  },
  header5: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '104.5%',
    color: '#FF8E3C'
  },
  headerBox: {
    backgroundSize: 'cover',
    backgroundRepeat: 'none'
  },
  backgroundBox: {
    backgroundSize: 'cover',
    backgroundColor: isFirefox
      ? 'rgba(255, 255, 255, 0.9)'
      : 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(60px)',
    paddingLeft: theme.spacing(8),
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 0
    }
  },
  headerInfo: {
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `60px ${theme.spacing(10)}px 60px`,
    [theme.breakpoints.down('md')]: {
      padding: `60px ${theme.spacing(2)}px 60px`
    }
  },
  divider: {
    border: '1px dashed #181818 !important'
  },
  paper: {
    marginTop: 16,
    borderRadius: 10,
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
    position: 'inherit',
    [theme.breakpoints.down(1280)]: {
      marginLeft: -40
    },
    [theme.breakpoints.down(960)]: {
      marginLeft: -16
    }
  },
  svgBox: {
    width: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '& svg': {
      width: '100%',
      height: '100%'
    },
    '& path': {
      stroke: 'white'
    }
  },
  followButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
    '& svg': {
      width: 10,
      height: 10
    },
    '& path': {
      stroke: 'black'
    }
  },
  tagBox: {
    background: 'rgba(175, 172, 215, 0.3)',
    padding: '5px 10px',
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '12px',
    color: 'white',
    marginRight: 4,
    marginTop: 4
  },
  tabBox: {
    padding: '10px 24px',
    borderRadius: '100vh',
    // color: "#181818",
    // fontWeight: 500,
    // fontSize: 14,
    cursor: 'pointer',
    '& + &': {
      marginLeft: 36
    },
    [theme.breakpoints.down('sm')]: {
      padding: '8px',
      '& + &': {
        marginLeft: 18
      }
    },
    [theme.breakpoints.down('xs')]: {
      padding: '6px 5px',
      '& + &': {
        marginLeft: 8
      }
    }
  },
  selectedTabBox: {
    background: '#2D3047',
    color: '#ffffff'
  },
  timeBox: {
    background: 'linear-gradient(87.82deg, #A0D800 20.18%, #0DCC9E 78.08%)',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 700,
    color: '#ffffff',
    padding: '7px 11px',
    '& + &': {
      marginLeft: 4
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 12
    }
  },
  claimButton: {
    background: '#57CB55',
    borderRadius: '35px',
    padding: '17px',
    height: '50px',
    width: '250px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textTransform: 'uppercase'
  },
  title2: {
    fontSize: 22,
    color: 'white',
    fontWeight: 800,
    lineHeight: '130%',
    [theme.breakpoints.down('xs')]: {
      fontSize: 16
    }
  },
  title3: {
    fontSize: 14,
    color: 'white',
    fontWeight: 500,
    lineHeight: '104.5%',
    cursor: 'pointer',
    '& span': {
      marginRight: 8
    }
  },
  podSubPageHeader: {
    borderBottom: '1px solid #00000022',
    borderTop: '1px solid #00000022'
  },
  artistsBox: {
    display: 'flex',
    alignItems: 'center'
  },
  artistsMainContent: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 32,
    overflowX: 'auto',
    scrollbarWidth: 'none',

    [theme.breakpoints.down('md')]: {
      padding: '0px 60px'
    },
    [theme.breakpoints.down('md')]: {
      padding: '0px 16px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: 0
    }
  },
  whiteBox: {
    background: '#fff',

    '& > div': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: 1600,
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: `32px ${theme.spacing(10)}px`,
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column'
      },
      [theme.breakpoints.down('md')]: {
        padding: `16px ${theme.spacing(2)}px`
      }
    }
  },
  podSubPageContent: {
    padding: '32px 0 80px',
    [theme.breakpoints.down('xs')]: {
      padding: '24px 0 40px'
    }
  },
  valueBox: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    background: 'white',
    opacity: 0.8,
    justifyContent: 'space-between',
    padding: `${theme.spacing() * 3}px ${theme.spacing() * 20}px`,
    '& > div': {
      padding: 8
    },
    [theme.breakpoints.down(1200)]: {
      padding: `${theme.spacing() * 3}px ${theme.spacing() * 1}px`
    }
  },
  contentBody: {
    padding: `${theme.spacing() * 4}px ${theme.spacing() * 21}px`,
    [theme.breakpoints.down(1200)]: {
      padding: `${theme.spacing() * 4}px ${theme.spacing() * 2}px`
    }
  },
  artistBox: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > div': {
      margin: 8
    }
  },
  accordion: {
    background: 'transparent',
    boxShadow: 'none',
    marginTop: '0 !important',
    '&:before': {
      display: 'none'
    },
    '& .MuiAccordionSummary-root': {
      padding: 0,
      '& .MuiAccordionSummary-content': {
        margin: 0
      }
    },
    '& .MuiAccordionDetails-root': {
      padding: 0
    }
  },
  contentBox: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(1),
    background: 'white',
    height: theme.spacing(70),
    textAlign: 'center',
    padding: theme.spacing(2)
  },
  commonBtn: {
    fontSize: '14px !important',
    borderRadius: '46px !important'
  },
  showAllBtn: {
    width: '150px !important',
    border: `1px solid #65CB63 !important`,
    backgroundColor: 'transparent !important',
    color: `${Color.MusicDAODark} !important`,
    position: 'relative'
  },
  createWallBtn: {
    width: '150px !important',
    backgroundColor: '#65CB63 !important'
  },
  discussionBtn: {
    backgroundColor: '#2D3047 !important'
  },
  createPollBtn: {
    backgroundColor: '#7F6FFF !important'
  },
  pollBtn: {
    border: 'none !important',
    padding: '10px 17px !important',
    fontSize: '12px !important',
    color: '#181818 !important',
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8',
    borderRadius: '26px !important',
    minWidth: 'unset !important',
    height: 'auto !important',
    lineHeight: 'unset !important',
    '& + &': {
      marginLeft: 8
    }
  },
  selectedPollBtn: {
    color: 'white !important',
    background: '#54658F !important'
  },
  pollBox: {
    flex: 1,
    overflow: 'scroll',
    '& > div + div': {
      marginTop: 11
    },
    paddingBottom: '20px'
  },
  arrowBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: theme.spacing(2),
    background: 'white',
    cursor: 'pointer'
  },
  discussionContent: {
    borderRadius: 12,
    background: '#ffffff',
    height: 610,
    textAlign: 'center',
    padding: theme.spacing(2),
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '-10px',
      marginRight: '-10px',
      padding: 0
    }
  },
  xscroll: {
    overflowX: 'scroll',
    scrollbarWidth: 'none',
    display: 'flex',
    alignItems: 'center',
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `8px ${theme.spacing(10)}px`,
    [theme.breakpoints.down('md')]: {
      padding: `8px ${theme.spacing(2)}px`
    }
  },
  mainContainer: {
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `0 ${theme.spacing(10)}px`,
    [theme.breakpoints.down('md')]: {
      padding: `0 ${theme.spacing(2)}px`
    }
  },
  chatBox: {
    height: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  chatListBox: {
    width: '30%',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      width: '100%'
    }
  },
  chatContentBox: {
    flexGrow: 1,
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      height: 'calc(100% - 80px)'
    }
  },
  addCreatorButton: {
    background: 'black',
    color: 'white',
    paddingLeft: '38px',
    paddingRight: '38px',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 16,
      paddingRight: 16,
      fontSize: 12
    }
  },
  addCollabContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-end'
    }
  },
  twoArtist: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
    '& > div + div': {
      marginLeft: 12,
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        marginTop: 12
      }
    }
  },
  image: {
    position: 'relative'
  },
  editable: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 20,
    height: 20,
    borderRadius: '100%',
    background: '#65CB63',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stakeRow: {
    background:
      'linear-gradient(91.08deg, #ECF100 -1.04%, #00C5A1 29.81%, #2CC2FF 55%, #536FFF 79.68%, #6B53FF 101.34%), linear-gradient(97.02deg, #A0D800 9.01%, #0DCC9E 62.74%);',
    color: '#fff',

    padding: 8
  },
  stakeTitle: {
    fontWeight: 'bold',
    fontSize: 21,
    lineHeight: '140%',
    [theme.breakpoints.down('sm')]: {
      fontSize: 18
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16
    }
  },
  stakeText: {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '140%',
    [theme.breakpoints.down('sm')]: {
      fontSize: 11
    }
  },
  addressBox: {
    display: 'flex',
    border: '1px solid rgba(45, 48, 71, 0.2)',
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: 600,

    lineHeight: '20.37px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '200px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  },
  headerLeftBar: {
    position: 'absolute',
    width: 56,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(2, 0, 19, 0.3)',
    zIndex: 10,
    [theme.breakpoints.down('sm')]: {
      top: 'unset',
      height: 'unset',
      bottom: 0,
      minWidth: 428,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: 378
    }
  },
  headerMenuIcon: {
    cursor: 'pointer',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    fontSize: 12,
    fontWeight: 600,

    color: '#fff'
  },
  carouSelBox: {
    flex: 1
  },
  carouselWrap: {
    '& .rec-slider-container': {
      margin: 0
    }
  },
  h4: {
    fontWeight: 800,
    fontSize: 20,
    lineHeight: '26px'
  },
  h6: {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '27px'
  },
  title4: {
    fontSize: 44,
    color: '#081831',
    fontWeight: 800,

    lineHeight: '104.5%',
    [theme.breakpoints.down('xs')]: {
      fontSize: 36
    }
  },
  title5: {
    fontSize: 18,
    color: 'rgba(8, 24, 49, 0.7)',
    fontWeight: 600,

    lineHeight: '140.5%',
    [theme.breakpoints.down('xs')]: {
      fontSize: 16
    }
  }
}));
