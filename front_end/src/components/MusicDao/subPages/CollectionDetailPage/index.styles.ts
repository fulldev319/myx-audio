import { makeStyles } from '@material-ui/core/styles';

export const usePageStyles = makeStyles((theme) => ({
  root: {
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #EEF2F6 96.61%), conic-gradient(from 71.57deg at 43.63% 99.9%, #2B99FF -34.07deg, #B234FF 21.26deg, #4434FF 224.01deg, #250EB3 256.07deg, #2B99FF 325.93deg, #B234FF 381.26deg), linear-gradient(97.63deg, #99CE00 26.36%, #0DCC9E 80%)',
    width: '100%',
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#fff',
    padding: `60px 80px 150px`,
    [theme.breakpoints.down('md')]: {
      padding: `60px 64px 150px`
    },
    [theme.breakpoints.down('xs')]: {
      padding: '60px 20px'
    }
  },
  infoContainer: {
    marginTop: 55,
    display: 'flex',
    gridGap: 39,
    alignItems: "center",
    [theme.breakpoints.down('md')]: {
      marginTop: 60,
      gridGap: 20
    },
    [theme.breakpoints.down('xs')]: {
      alignItems: "stretch",
      flexDirection: 'column',
      marginTop: 60,
      gridGap: 20
    }
  },
  image: {
    width: '310px',
    height: '310px',
    borderRadius: 20,
    objectFit: 'cover',
    [theme.breakpoints.down('md')]: {
      width: '234px',
      height: '234px'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '284px'
    }
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
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 20,
    height: 140,
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      padding: '18px 20px',
      height: 100
    },
    [theme.breakpoints.down('xs')]: {
      padding: '18px 20px',
      height: 100
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
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'row',
      padding: '18px 20px',
      width: '100%',
      height: 77
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'row',
      border: '1px solid #ffffff19',
      background: 'transparent',
      width: '100%',
      height: 70,
      color: "#ffffff"
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
      height: '100%',
      backgroundColor: '#ffffff19',
    }
  },
  transfers: {
    background:
      'linear-gradient(179.38deg, rgba(16, 0, 109, 0.6) 27.99%, rgba(9, 48, 188, 0.6) 107.76%)',
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

    padding: '8px 36px',
    color: '#ffffff60',
    borderBottom: '1px solid #0C785740'
  },
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: 5
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#00000019'
    }
  },
  tr_stats: {
    display: 'flex',
    alignItems: 'baseline',
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
  chainInfo: {
    display: 'flex',
    alignItems: 'center',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '13px',
    lineHeight: '14px'
  },
  typo1: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 32,
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    [theme.breakpoints.down('md')]: {
      fontSize: 22
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
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
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 14,
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    opacity: 0.8
  },
  typo4: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 13,
    lineHeight: '24px',
    [theme.breakpoints.down('md')]: {
      fontSize: 10,
      lineHeight: '20px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 11,
      lineHeight: '18px'
    }
  },
  typo4_1: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 15,
    lineHeight: '24px',
    opacity: 0.9
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
      fontSize: 18,
      color: "#ffffff",
    }
  },
  typo7: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 18,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: '#444840',
    [theme.breakpoints.down('md')]: {
      fontSize: 18
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 10,
      color: "#ffffff66",
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
  typo10: {},
  noHistory: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '17px',
    lineHeight: '140%',
    color: '#FFFFFF',
    opacity: '0.9'
  }
}));
