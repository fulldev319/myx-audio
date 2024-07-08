import { makeStyles } from '@material-ui/core/styles';

export const usePageStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    overflow: 'auto',
    background: 'white',
    fontFamily: 'Pangram',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    position: 'relative'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 11.89%, #EEF2F6 37%), conic-gradient(from 71.57deg at 34.63% 60.9%, #2B99FF -34.07deg, #B234FF 21.26deg, #4434FF 224.01deg, #250EB3 256.07deg, #2B99FF 325.93deg, #B234FF 381.26deg), linear-gradient(97.63deg, #99CE00 26.36%, #0DCC9E 45%)',
    [theme.breakpoints.down('md')]: {
      padding: `20px 64px 150px`
    },
    [theme.breakpoints.down('xs')]: {
      padding: '20px'
    }
  },
  mainContainer: {
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#2D3047',
    padding: `50px 80px 150px`,
    zIndex: 1,
    width: '100%'
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      marginTop: 33,
      gridGap: 20
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      marginTop: 33,
      gridGap: 20
    }
  },
  image: {
    width: '260px',
    height: '260px',
    borderRadius: 18,
    boxShadow: '0px 29.7213px 28.8721px -16.1344px rgba(18, 17, 30, 0.58)',
    filter: 'drop-shadow(0px 3.39672px 35.6656px rgba(4, 5, 6, 0.27))'
  },
  rightFix: {
    flex: 1,
    [theme.breakpoints.down('md')]: {
      maxWidth: 'none'
    }
  },
  collectionId: {
    display: 'flex',
    gridGap: 8,
    alignItems: 'center'
  },
  link: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  },
  description: {
    height: 80,
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      padding: '18px 20px',
      height: 97
    }
  },
  statisticsContainer: {
    display: 'flex',
    gridGap: 40,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  stats: {
    display: 'flex',
    flexDirection: 'column',
    background: '#FFFFFF',
    borderRadius: 20,
    width: 305,
    height: 300,
    justifyContent: 'space-evenly',
    padding: '0px 40px',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'row',
      padding: '18px 20px',
      width: '100%',
      height: 77
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'row',
      border: '1px solid #00000019',
      background: 'transparent',
      width: '100%',
      height: 70
    }
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#00000019',
    [theme.breakpoints.down('md')]: {
      width: 0,
      height: 0
    },
    [theme.breakpoints.down('xs')]: {
      width: 1,
      height: '100%'
    }
  },
  transfers: {
    background:
      'linear-gradient(179.38deg, #1E303A 27.99%, rgba(45, 89, 87, 0.64) 107.76%);',
    borderRadius: 20,
    height: 300,
    padding: '0px 0px 20px',
    fontSize: '18px',
    color: '#fff',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column'
  },
  transferHistoryHeader: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 600,
    margin: '0px 36px',
    padding: '8px 0px',
    color: '#ffffff60',
    borderBottom: '1px solid #0C785740'
  },
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingRight: 10,
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: 5
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#ffffff19'
    }
  },
  tr_stats: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: 8
  },
  tr: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    gridGap: 20,
    justifyContent: 'space-between'
  },
  transferType: {
    width: 'fit-content',
    borderRadius: '34px',
    display: 'flex',
    padding: '9px 17px',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 600,
    color: '#fff'
  },
  td_name: {
    display: 'flex',
    alignItems: 'center',
    flex: 3
  },
  td_type: {
    flex: 2
  },
  td_price: {
    flex: 2
  },
  tabContainer: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #00000022',
    marginTop: 50,
    [theme.breakpoints.down('md')]: {
      fontSize: 40
    }
  },
  tabItem: {
    color: '#00000055',
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
    color: '#0D59EE',
    borderBottom: '5px solid #0D59EE'
  },
  avatar: {
    marginRight: 18,
    '& img': {
      width: 34,
      height: 34,
      borderRadius: 23
    }
  },
  typo1: {
    fontFamily: 'Pangram',
    fontWeight: 700,
    fontSize: 54,
    lineHeight: '122%',
    color: '#fff',
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    [theme.breakpoints.down('xs')]: {
      fontSize: 36
    }
  },
  typo2: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    [theme.breakpoints.down('md')]: {
      fontSize: 10
    }
  },
  typo3: {
    fontFamily: "'Montserrat'",
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 13,
    color: '#fff'
  },
  typo4: {
    fontFamily: "'Montserrat'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 13,
    color: '#fff'
  },
  typo4_1: {
    fontFamily: "'Montserrat'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
    color: '#fff',
    opacity: '0.7'
  },
  typo5: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    [theme.breakpoints.down('md')]: {
      fontSize: 18
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20
    }
  },
  typo6: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 28,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: '#000000',
    [theme.breakpoints.down('md')]: {
      fontSize: 28
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    }
  },
  typo7: {
    fontFamily: 'Pangram',
    fontWeight: 800,
    fontSize: 14,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: '#7E7D95',
    [theme.breakpoints.down('md')]: {
      fontSize: 14
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 10
    }
  },
  typo8: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 14,
    color: '#FFFFFF',
    [theme.breakpoints.down('md')]: {
      fontSize: 14
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 10
    }
  },
  typo9: {
    fontWeight: 600,
    fontSize: 22,
    letterSpacing: '0.02em',
    textTransform: 'uppercase'
  },
  typo10: {
    fontWeight: 800,
    fontSize: 25,
    textTransform: 'uppercase',
    color: '#fff'
  },
  noHistory: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '17px',
    lineHeight: '140%',
    color: '#FFFFFF',
    opacity: '0.9'
  },
  externalURL: {
    maxWidth: 300,
    background: '#FFFFFF',
    borderRadius: '48px',
    height: '38px',
    padding: '8px 20px',
    display: 'flex',
    alignItems: 'center',
    gridGap: 13,
    overflow: 'hidden',
    '& .link': {
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontFamily: "'Montserrat'",
      fontWeight: 600,
      fontSize: 16,
      letterSpacing: '-0.02em',
      color: '#2D3047'
    },
    '& .button': {
      cursor: 'pointer'
    }
  }
}));
