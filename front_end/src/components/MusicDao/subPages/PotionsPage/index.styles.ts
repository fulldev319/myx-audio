import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const potionsPageStyle = makeStyles((theme) => ({
  container: {
    position: 'relative',
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8'
  },
  backgroundBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '1050px',
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #EEF2F6 96.61%), linear-gradient(97.63deg, #99CE00 26.36%, #0DCC9E 80%)'
  },
  body: {
    width: '100%',
    position: 'relative',
    margin: 'auto',
    marginTop: 100,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 40,
    zIndex: 2,

    '& .left-logo': {
      position: 'absolute',
      top: -150,
      left: 30,
      [theme.breakpoints.down('sm')]: {
        left: -10
      },
      [theme.breakpoints.down('xs')]: {
        left: -50
      }
    },
    '& .right-logo': {
      position: 'absolute',
      top: 100,
      right: 50,
      [theme.breakpoints.down('xs')]: {
        top: 50,
        right: 0
      }
    }
  },
  contentBox: {
    paddingLeft: 250,
    paddingRight: 250,
    [theme.breakpoints.down('lg')]: {
      paddingLeft: theme.spacing(10),
      paddingRight: theme.spacing(10)
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: 28,
      paddingRight: 28
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 16,
      paddingRight: 16
    }
  },
  tabBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabBarItem: {
    display: 'flex',
    alignItems: 'center',
    opacity: 0.4,
    padding: `0 ${theme.spacing(2)}px`,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 800
  },
  tabBarItemActive: {
    opacity: 1.0,
    borderBottom: '1px solid #000000'
  },
  topBox: {
    overflowY: 'auto',
    background: 'rgba(255, 255, 255, 0.75)',
    padding: `0 ${theme.spacing(8)}px`,
    position: 'absolute',
    width: '100%',
    zIndex: 3,
    backdropFilter: 'blur(40px)',
    '&::-webkit-scrollbar-thumb': {
      width: 0,
      background: 'transparent'
    },
    [theme.breakpoints.down('md')]: {
      padding: `0 ${theme.spacing(3)}px`
    }
  },
  whiteBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '840px'
  },
  header: {
    fontSize: '48px',
    fontWeight: 800,
    color: 'white',
    lineHeight: '62px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '30px',
      lineHeight: '40px'
    }
  },
  header1: {
    fontSize: '18px',
    fontWeight: 800,
    color: Color.MusicDAODark,
    lineHeight: '23.4px'
  },
  header2: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#404658'
  },
  header3: {
    fontSize: '12px',
    fontWeight: 600
  },
  header4: {
    fontSize: 28,
    fontWeight: 800
  },
  tableHeader1: {
    fontSize: 21,
    fontWeight: 600
  },
  tableHeader2: {
    fontSize: 14,
    fontWeight: 600
  },
  tableHeader3: {
    fontSize: 9,
    fontWeight: 600
  },
  tableHeader4: {
    fontSize: 14,
    fontWeight: 500
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 500,
    color: Color.White,
    width: '70%',
    textAlign: 'center',
    marginBlock: 0,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  buttons: {
    flexDirection: 'row',
    columnGap: 24,
    rowGap: 10,
    '& button': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 48,
      width: 200,
      color: Color.White,
      backgroundColor: '#008061',
      border: 'none',
      fontSize: 18,
      height: 52,
      '& svg': {
        marginRight: 16
      }
    },
    '& button:last-child': {
      backgroundColor: Color.MusicDAODark,
      marginLeft: 0
    }
  },
  searchInput: {
    padding: '13px 19px 10px',
    fontSize: '14px',
    background: 'transparent',
    width: '100%',
    border: `1px solid ${Color.MusicDAOGreen}`,
    color: Color.MusicDAOLightBlue,
    boxSizing: 'border-box',
    borderRadius: 48,
    '&:focus-visible': {
      outline: 'none'
    }
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
    marginBottom: 30,
    [theme.breakpoints.down('xs')]: {
      marginTop: 20,
      marginBottom: 20,
      flexDirection: 'column',
      rowGap: 35,
      alignItems: 'flex-end'
    }
  },
  optionSection: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      justifyContent: 'flex-end'
    }
  },
  selectedButtonBox: {
    background: Color.MusicDAODark,
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    color: 'white'
  },
  buttonBox: {
    background: 'rgba(240, 245, 248, 0.7)',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      padding: '8px 14px'
    },
    color: Color.MusicDAODark
  },

  searchInputBox: {
    position: 'relative',
    width: 400,
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  select: {
    '& .MuiSelect-root': {
      paddingRight: 12
    },
    '& svg path': {
      stroke: '#2D3047'
    }
  },
  rankBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: theme.spacing(4),
    transform: 'translate(0, -50%)'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      marginTop: theme.spacing(2)
    },
    '& > nav > ul > li > button': {
      color: '#2D3047',
      fontSize: 14,
      fontWeight: 600,
      '&.MuiPaginationItem-page.Mui-selected': {
        opacity: 0.38
      }
    },
    '& > nav > ul > li > div': {
      color: '#2D3047 !important',
      fontSize: 14,
      fontWeight: 600
    }
  },
  bopImageBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  bopBackImage: {
    width: theme.spacing(15),
    height: theme.spacing(8),
    borderRadius: theme.spacing(1),
    overflow: 'hidden'
  },
  bopAvatarBox: {
    position: 'absolute',
    bottom: -theme.spacing(0.5),
    left: '85%',
    display: 'flex',
    alignItems: 'center'
  },
  bopAvatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: '100%',
    border: '2px solid #ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bopAvatar1: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: '100%',
    border: '2px solid #ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sellBop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#005C3B !important',
    mixBlendMode: 'normal',
    borderRadius: '48px !important',
    paddingLeft: '48px !important',
    paddingRight: '48px !important',
    '& svg': {
      marginRight: 10
    }
  },
  optionButton: {
    padding: '12px 12px'
  }
}));
