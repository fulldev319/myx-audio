import { makeStyles } from '@material-ui/core/styles';
import { Gradient } from 'shared/ui-kit';

export const musicStackPageStyles = makeStyles((theme) => ({
  content: {
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8',
    width: '100%',
    height: '92%',
    display: 'flex',
    flexDirection: 'column',
    padding: '66px 168px 150px 168px',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      padding: '74px 18px 150px 18px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '45px 18px 78px 18px'
    }
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    left: 0,
    top: 0
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  stackBox: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 42,
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      flexDirection: 'column',
      marginTop: 28
    }
  },
  arrowBox: {
    marginTop: theme.spacing(7),
    marginRight: theme.spacing(3),
    maxWidth: '120px',
    maxHeight: '100px',
    [theme.breakpoints.down('sm')]: {
      marginRight: 8
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(2)
    }
  },
  headerTitle: {
    fontSize: '30px',
    fontWeight: 800,
    color: '#2D3047',
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
      textAlign: 'center'
    }
  },
  header1: {
    fontSize: 20,
    fontWeight: 600,
    color: '#54658F',
    marginTop: 8,
    paddingBottom: 28,
    borderBottom: '1px solid #00000022',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
      paddingBottom: 26
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      textAlign: 'center',
      paddingBottom: 24
    }
  },
  header1_1: {
    fontSize: 30,
    fontWeight: 800,
    color: '#2D3047',
    [theme.breakpoints.down('sm')]: {
      fontSize: 26
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20
    }
  },
  header1_2: {
    fontSize: 34,
    fontWeight: 800,
    color: '#2D3047',
    [theme.breakpoints.down('sm')]: {
      fontSize: 26
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20
    }
  },
  header2: {
    fontSize: 20,
    fontWeight: 500,
    color: '#54658F',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16
    }
  },
  header3: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#54658F',
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    }
  },
  header4: {
    fontSize: 14,
    fontWeight: 500,
    color: '#54658F',
    opacity: 0.8,
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
      fontWeight: 600
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 10,
      fontWeight: 600
    }
  },
  header4_1: {
    fontSize: 14,
    fontWeight: 500,
    color: '#54658F',
    opacity: 0.8,
    [theme.breakpoints.down('sm')]: {
      fontSize: 11
    }
  },
  header4_2: {
    fontSize: 14,
    fontWeight: 500,
    color: '#54658F',
    [theme.breakpoints.down('sm')]: {
      fontSize: 12
    }
  },
  header4_3: {
    fontSize: 14,
    fontWeight: 600
  },
  whiteBox: {
    marginTop: 48,
    zIndex: 1,
    borderRadius: 34,
    background: 'white',
    boxShadow: '0px 33px 35px -18px rgba(29, 103, 84, 0.13)',
    padding: '44px 70px 35px 70px',
    [theme.breakpoints.down('sm')]: {
      padding: '44px 35px'
    },
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '38px 12px 23px 12px'
    }
  },
  stakeButtonBox: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 64,
    justifyContent: 'center',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      marginTop: 51
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 29
    }
  },
  borderBox: {
    borderRadius: 63,
    padding: '4px 18px 6px 26px',
    color: '#2D3047',
    cursor: 'pointer',
    background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), #17172D',
    border: '1px solid #DEE7DA',
    height: 57,
    [theme.breakpoints.down('xs')]: {
      height: 53
    }
  },
  balanceBorderBox: {
    borderRadius: 55,
    padding: '6px 18px',
    cursor: 'pointer',
    border: '1px solid #7BCBB7',
    background: 'rgba(218, 230, 229, 0.4)',
    height: 57,
    [theme.breakpoints.down('sm')]: {
      padding: '5px 11px',
      height: 53
    }
  },
  tokenBorderBox: {
    borderRadius: 60,
    padding: '6px 11px',
    cursor: 'pointer',
    background: '#DAE6E5',
    height: 57,
    [theme.breakpoints.down('sm')]: {
      padding: '5px 11px',
      height: 53
    }
  },
  noBorderBox: {
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    color: '#2D3047',
    background: 'rgba(218, 230, 229, 0.4)',
    [theme.breakpoints.down('xs')]: {
      padding: '27px 29px',
      marginTop: 16
    }
  },
  colorText: {
    fontSize: '20px',
    fontWeight: 700,
    background: Gradient.Green1,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16
    }
  },
  stakingValue: {
    fontSize: '26px !important',
    '& span': {
      opacity: 0.4
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px !important'
    }
  },
  stakingHistoryTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#404658',
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    }
  },
  stakingRepaidTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: '#2D3047',
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
      fontWeight: 700
    }
  },
  stakingTitle: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 600,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14
    }
  },
  secondButtonBox: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(3)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    border: '1px solid #65CB63',
    display: 'flex',
    alignItems: 'center',
    height: 40
  }
}));
