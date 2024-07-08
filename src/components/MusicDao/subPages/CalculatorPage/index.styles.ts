import { makeStyles } from '@material-ui/core/styles';
import { Gradient } from 'shared/ui-kit';

export const calculatorPagePageStyles = makeStyles((theme) => ({
  body: {
    height: 629
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '60px 168px 150px 168px',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  stackBox: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 42,
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      flexDirection: 'column'
    }
  },
  arrowBox: {
    marginLeft: 51,
    marginTop: theme.spacing(7),
    marginRight: 46,
    maxWidth: '141px',
    maxHeight: '100px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginBottom: theme.spacing(7),
      marginRight: theme.spacing(0),
      transform: 'rotate(90deg)'
    }
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 800,
    color: '#2D3047'
  },
  header1: {
    fontSize: 20,
    fontWeight: 600,
    color: '#54658F',

    lineHeight: '24px',
    marginTop: 7,
    paddingBottom: 28,
    borderBottom: '1px solid #00000022'
  },
  header2: {
    fontSize: 20,
    fontWeight: 500,
    color: '#181818',

    lineHeight: '24px'
  },
  header3: {
    fontSize: 22,
    fontWeight: 800,
    color: '#54658F',

    lineHeight: '120%',
    marginBottom: 10
  },
  header4: {
    fontSize: 14,
    fontWeight: 600,
    color: '#54658F',
    opacity: 0.8
  },
  header4_1: {
    fontSize: 14,
    fontWeight: 500,
    color: '#54658F',
    [theme.breakpoints.down('sm')]: {
      fontSize: 12
    }
  },
  header4_2: {
    fontSize: 14,
    fontWeight: 500,
    color: '#54658F',
    opacity: 0.8,
    marginLeft: 8,
    marginTop: 8,
    [theme.breakpoints.down('sm')]: {
      fontSize: 11
    }
  },
  header5: {
    fontSize: 24,
    fontWeight: 700,
    color: '#404658',

    lineHeight: '29px'
  },
  whiteBox: {
    borderRadius: 34,
    background: '#ffffff',
    boxShadow: '0px 46px 35px -31px rgba(29, 103, 84, 0.05)',
    padding: '44px 70px 34px',
    marginTop: 47,
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
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
  noBorderBox: {
    width: '100%',
    height: 132,
    borderRadius: 20,
    padding: '16px 100px 23px 25px',
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D;',
    [theme.breakpoints.down('xs')]: {
      padding: '27px 29px',
      marginTop: 16
    }
  },
  colorText: {
    fontSize: 20,
    fontWeight: 700,

    lineHeight: '24px',
    background: Gradient.Green1,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    '& span': {
      fontWeight: 500,
      WebkitTextFillColor: '#181818',
      color: '#181818',
      background: 'transparent'
    }
  },
  stakingValue: {
    fontSize: 26,
    fontWeight: 400,

    color: '#2D3047',
    '& span': {
      opacity: 0.4
    }
  },
  stakingTitle: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 600,
    color: '#65CB63',

    lineHeight: '130%'
  },
  secondButtonBox: {
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    border: '1px solid #65CB63',
    display: 'flex',
    alignItems: 'center'
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
  stakingDetailSection: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 95,
    paddingBottom: 47,
    borderBottom: '1px solid #00000022'
  },
  stakingHistorySection: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 71
  }
}));
