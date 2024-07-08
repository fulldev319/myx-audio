import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const stakingPageStyles = makeStyles((theme) => ({
  body: {
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #F0F5F8 96.61%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    height: 833
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative'
  },
  content: {
    width: '100%',
    maxWidth: 1440,
    padding: '20px 50px',
    zIndex: 1,
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      padding: '20px 30px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: 20
    }
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: 1200,
    left: 0,
    top: 0
  },
  image1: {
    position: 'absolute',
    left: '28%',
    top: 50,
    width: 66,
    [theme.breakpoints.down('sm')]: {
      left: '24%'
    },
    [theme.breakpoints.down('xs')]: {
      left: '15%'
    }
  },
  image2: {
    position: 'absolute',
    left: '20%',
    top: 250,
    width: 94,
    [theme.breakpoints.down('sm')]: {
      left: '15%'
    },
    [theme.breakpoints.down('xs')]: {
      left: '10%',
      top: 200
    }
  },
  image3: {
    position: 'absolute',
    right: '28%',
    top: 80,
    width: 91,
    [theme.breakpoints.down('sm')]: {
      right: '20%'
    },
    [theme.breakpoints.down('xs')]: {
      right: '10%'
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  buttonsBox: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
    '& button': {
      width: 243,
      height: 52,
      margin: theme.spacing(1),
      fontSize: 18,
      fontWeight: 700
    }
  },
  headerTitle: {
    fontSize: 58,
    fontWeight: 800,
    color: 'white',

    lineHeight: '75px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 52
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 40
    }
  },
  headerSubTitle: {
    maxWidth: 566,
    fontSize: 26,
    fontWeight: 600,

    marginTop: 30,
    marginBottom: 26,
    color: '#ffffff',
    letterSpacing: '0.02em',
    lineHeight: '150%',
    textAlign: 'center',
    '& span': {
      fontWeight: 400
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 26
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#ffffff',

    marginBottom: 34
  },
  subTitle1: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2D3047',

    marginBottom: 33
  },
  stakingPoolSection: {
    marginTop: 86
  },
  stakingStatsSection: {
    marginTop: 56
  },
  header1: {
    fontSize: 30,
    fontWeight: 700,
    [theme.breakpoints.down('xs')]: {
      fontSize: 24
    }
  },
  header2: {
    fontSize: 26,
    fontWeight: 600,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: 26
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  header3: {
    fontSize: 17,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    opacity: 0.8,
    [theme.breakpoints.down('sm')]: {
      fontSize: 15,
      textAlign: 'center'
    }
  },
  header4: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2D3047'
  },
  header5: {
    fontSize: 13,
    fontWeight: 600,
    color: '#54658F'
  },
  whiteBox: {
    borderRadius: 34,
    background: '#ffffff',
    boxShadow: '0px 33px 35px -18px rgba(29, 103, 84, 0.13)',
    padding: '25px 34px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  percentValueBox: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`
    }
  },
  showAll: {
    width: '170px !important',
    border: `1px solid #65CB63 !important`,
    backgroundColor: 'transparent !important',
    fontSize: '14px !important',
    color: `${Color.MusicDAODark} !important`,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      width: '120px !important'
    }
  },
  secondButtonBox: {
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    border: '1px solid #65CB63',
    display: 'flex',
    alignItems: 'center'
  },
  graphSection: {
    background: '#ffffff',
    borderRadius: 20,
    padding: theme.spacing(5),
    marginTop: 49
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
    cursor: 'pointer',
    fontSize: 14,
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  selectedButtonBox: {
    background: '#2D3047',
    color: 'white'
  },
  statsGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 21,
    rowGap: 15,
    [theme.breakpoints.down('xs')]: {
      columnGap: 12
    },
    '& > div': {
      flex: 1,
      height: 225
    }
  },
  horizontalScrollBox: {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    overflow: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  transactionSection: {
    marginTop: 64
  }
}));
