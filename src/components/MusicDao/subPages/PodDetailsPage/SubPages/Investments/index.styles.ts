import makeStyles from '@material-ui/core/styles/makeStyles';
import { Gradient } from 'shared/ui-kit';

export const investmentStyles = makeStyles((theme) => ({
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  shadowBox: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    background: Gradient.Green1,
    boxShadow: `0px 2px 14px rgba(0, 0, 0, 0.08)`,
    margin: theme.spacing(1),
    '& *': {
      color: 'white !important'
    }
  },
  topHeaderLabel: {
    background: `linear-gradient(270.47deg, #D66DB2 -3.25%, #BB34D1 93.45%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  whiteBox: {
    borderRadius: 16,
    background: '#ffffff',
    padding: '40px 34px 25px',
    [theme.breakpoints.down(680)]: {
      padding: '40px 12px 25px'
    }
  },
  whiteBoxPriceItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRight: '1px solid #18181822'
  },
  whiteBoxFundsItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRight: '1px solid #18181822',
    [theme.breakpoints.down('xs')]: {
      borderRight: 'unset'
    }
  },
  whiteBoxPaddingItem: {
    padding: '0px 24px 0px 64px',
    [theme.breakpoints.down(780)]: {
      padding: '0px 24px'
    },
    [theme.breakpoints.down(680)]: {
      padding: '0px 12px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '0px 12px',
      marginTop: 12,
      paddingTop: 19,
      borderTop: '1px solid #18181822',
      paddingBottom: 21,
      borderBottom: '1px solid #18181822'
    }
  },
  title: {
    fontSize: '22px',
    fontWeight: 800,

    lineHeight: '130%',
    color: '#2D3047'
  },
  header1: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '18px',
    color: '#081831'
  },
  header2: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '120%',
    color: '#707582',
    textShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  header3: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '18px',
    lineHeight: '120%',
    color: '#081831',
    textShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  flexBoxHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`
  },
  greenBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    padding: '19px 8px',
    borderRadius: '12px',
    marginTop: 25
  },
  graphBox: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2.5),
    border: `1px solid #E0E4F3`,
    borderRadius: '12px',
    margin: theme.spacing(1),
    position: 'relative',
    background: 'white'
  },
  valueBox: {
    position: 'absolute',
    left: '60px',
    top: '70px',
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    boxShadow: `2px 2px 12px rgba(0, 0, 0, 0.1)`,
    background: 'white'
  },
  graphHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  select: {
    '& > div': {
      paddingBottom: '11px',
      minWidth: '120px'
    }
  },
  colorBox: {
    width: theme.spacing(0.5),
    height: theme.spacing(4.5),
    borderRadius: '2px'
  },
  circle: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#65CB63',
    marginRight: '8px'
  },
  externalLink: {
    verticalAlign: 'middle'
  },

  tableContainer: {
    '& > div': {
      borderRadius: '16px',
      boxShadow: 'none'
    },

    '& tr': {
      '& th:first-child': {
        borderTopLeftRadius: '16px'
      },

      '& th:last-child': {
        borderTopRightRadius: '16px'
      }
    },

    '& tr:last-child': {
      '& td:first-child': {
        borderBottomLeftRadius: '16px'
      },

      '& td:last-child': {
        borderBottomRightRadius: '16px'
      }
    }
  },

  barContainer: {
    background: 'rgba(84, 101, 143, 0.3)',
    height: 3,
    borderRadius: '20px',
    width: '100%',
    '& > div': {
      background:
        'linear-gradient(90deg, #A0D800 39.81%, #0DCC9E 75.56%, rgba(255, 255, 255, 0) 98.84%)',
      height: 3,
      borderRadius: '20px'
    }
  },

  divider: {
    height: 40,
    opacity: 0.1,
    background: '#181818',
    width: '1px'
  },
  timeBox: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down(560)]: {
      flexDirection: 'column'
    }
  },
  timeGreenBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    padding: '8px 8px',
    borderRadius: '12px'
  },
  timeValueBox: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down(560)]: {
      marginTop: theme.spacing(1)
    }
  },
  addressBox: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      maxWidth: theme.spacing(25)
    }
  },
  comingSoon: {
    position: 'absolute',
    top: -20,
    right: -20,

    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 12,
    lineHeight: '145.5%',
    color: '#FFFFFF',
    padding: '4px 9px',
    background: '#FF8E3C',
    borderRadius: 8
  }
}));
