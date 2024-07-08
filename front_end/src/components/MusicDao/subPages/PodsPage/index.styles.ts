import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const podsPageStyles = makeStyles((theme) => ({
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
    }
  },
  background: {
    overflow: 'auto',
    minHeight: '100vh'
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
    top: '145px',
    [theme.breakpoints.down(1440)]: {
      left: 84
    },
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
  columnBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  headerTitle: {
    fontSize: 58,
    color: '#ffffff',
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    lineHeight: '75px',
    fontWeight: 400,
    '& span': {
      fontWeight: 900
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '52px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '40px'
    }
  },
  header1: {
    fontSize: 22,
    fontWeight: 800,
    color: "#FFFFFF",
    lineHeight: '130%',
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
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
    justifyContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center'
    }
  },
  tabItem: {
    color: Color.White,
    opacity: 0.5,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(
      2
    )}px`,
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      '& div': {
        fontSize: 12
      }
    }
  },
  tabItemActive: {
    borderBottom: '1px solid #ffffff',
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
    background: '#F0F5F8',
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
      justifyContent: 'flex-end',
      marginTop: '24px'
    }
  },
  selectedFilterButtonBox: {
    background: Color.MusicDAODark,
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    color: 'white'
  },
  filterButtonBox: {
    background: 'rgba(240, 245, 248, 0.7)',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    marginLeft: 8,
    color: Color.MusicDAODark,
    [theme.breakpoints.down('xs')]: {
      padding: '8px 14px'
    }
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
  }
}));
