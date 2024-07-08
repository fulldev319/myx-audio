import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const MusicPageStyles = makeStyles((theme) => ({
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `60px ${theme.spacing(10)}px 150px`,
    [theme.breakpoints.down('md')]: {
      padding: `60px ${theme.spacing(2)}px 150px`
    },
    [theme.breakpoints.down('xs')]: {
      padding: `60px 16px 150px`
    }
  },
  background: {
    overflow: 'auto',
    height: '100%'
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0
  },
  green1: {
    position: 'absolute',
    width: '279px',
    right: '48px',
    top: '-60px'
  },
  green2: {
    position: 'absolute',
    width: '132px',
    left: '168px',
    top: '110px',
    [theme.breakpoints.down(1230)]: {
      top: 190
    },
    [theme.breakpoints.down(900)]: {
      top: 190,
      left: 10
    },
    [theme.breakpoints.down(600)]: {
      top: 190,
      left: -50
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 47,
    color: '#ffffff',

    lineHeight: '47px',
    fontWeight: 800,
    [theme.breakpoints.down('sm')]: {
      fontSize: 36
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 21
    }
  },
  header1: {
    fontSize: 22,
    fontWeight: 800,
    color: 'white',
    lineHeight: '130%'
  },
  header2: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 400,

    letterSpacing: '0.02em',
    lineHeight: '150%',
    marginBottom: 26,
    '& span': {
      fontWeight: 600
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '24px'
    },
    [theme.breakpoints.down(750)]: {
      fontSize: '20px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px'
    }
  },
  header4: {
    fontSize: 14,
    fontWeight: 600
  },
  header5: {
    fontSize: 16,
    fontWeight: 800,
    lineHeight: '130%'
  },
  topBtnRow: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  tabItem: {
    color: Color.MusicDAODark,
    opacity: 0.5,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(
      2
    )}px`,
    cursor: 'pointer'
  },
  tabItemActive: {
    borderBottom: '1px solid #000000',
    opacity: 1
  },
  whiteBox: {
    borderRadius: theme.spacing(4),
    background: 'white',
    boxShadow: '0px 33px 35px -18px rgba(29, 103, 84, 0.13)',
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  percentValueBox: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  secondButtonBox: {
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    border: '1px solid #2D3047',
    display: 'flex',
    alignItems: 'center'
  },
  graphBox: {
    background: 'white',
    borderRadius: theme.spacing(4),
    padding: theme.spacing(4)
  },
  controlBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(242, 249, 248, 0.3)',
    borderRadius: theme.spacing(4)
  },
  buttonBox: {
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: '#2D3047',
    cursor: 'pointer'
  },
  selectedButtonBox: {
    background: '#2D3047',
    color: 'white'
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    zIndex: 1,
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      // flexDirection: "column",
      rowGap: 35,
      alignItems: 'flex-end'
    }
  },
  optionSection: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      justifyContent: 'space-between'
    }
  },
  mobileFilter: {
    display: 'flex',
    alignItems: 'flex-end',
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%'
    }
  },
  selectedFilterButtonBox: {
    background: Color.MusicDAODark,
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px`,
    borderRadius: '100vh',
    border: '1px solid #ccc',
    cursor: 'pointer',
    color: 'white'
  },
  filterButtonBox: {
    background: 'rgba(240, 245, 248, 0.7)',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px`,
    cursor: 'pointer',
    borderRadius: '100vh',
    border: '1px solid #ccc',
    color: Color.MusicDAODark,
    [theme.breakpoints.down('xs')]: {
      padding: '8px'
    }
  },
  filterTag: {
    background: 'rgba(255, 255, 255)',
    borderRadius: '20px',
    color: '#2D3047',

    fontWeight: 600,
    fontSize: 12,
    lineHeight: '18px',
    padding: '8px 14px',
    cursor: 'pointer',
    '& + &': {
      marginLeft: 16,
      [theme.breakpoints.down('xs')]: {
        marginLeft: 0
      }
    }
  },
  filterActive: {
    background: '#fff'
  },
  listViewRow: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',

    [theme.breakpoints.down('sm')]: {
      fontSize: '11px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '8px'
    }
  },
  arrowBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(4),
    boxShadow: '0px 10px 21px -9px rgba(105, 105, 105, 0.15)'
  },
  carousel: {
    '& .rec.rec-slider-container': {
      margin: 0,
      width: 'calc(100% + 16px)',
      marginLeft: -8,
      marginRight: -8,
      '& .rec.rec-item-wrapper': {
        overflow: 'unset',
        transform: 'scale(0.98)'
      }
    }
  }
}));
