import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const useStyles = makeStyles((theme) => ({
  container: {
    background: 'linear-gradient(180.15deg, #FFFFFF 2.8%, #EEF2F6 89.51%)',
    width: '100%',
    position: 'relative',
    display: 'flex'
  },
  content: {
    width: '100%',
    maxWidth: 1440,
    zIndex: 1,
    margin: 'auto',
    padding: '60px 52px',
    [theme.breakpoints.down('sm')]: {
      padding: '65px 25px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '30px 15px'
    },
    '&.pool-management': {
      maxWidth: 1200
    }
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: 1800,
    left: 0,
    top: 0,
    '&.pod-detail': {
      height: 1000
    }
  },
  table: {
    borderRadius: 12,
    background: Color.White,
    marginBottom: 40,
    '& .MuiTableCell-root': {
      fontSize: 14,
      color: Color.MusicDAODark
    },
    '& .MuiTableCell-root.MuiTableCell-head': {
      borderBottom: `1px solid ${Color.MusicDAOGreen}`
    },
    '& .MuiTableCell-head': {
      fontWeight: 'bold'
    }
  },
  headerTitle: {
    fontSize: 58,
    fontWeight: 800,
    marginBlock: 0,
    marginBottom: 8,
    color: Color.White,
    [theme.breakpoints.down('sm')]: {
      fontSize: 52,
      marginBottom: 25
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 40,
      marginBottom: 15
    }
  },
  headerSecond: {
    fontSize: 30,
    fontWeight: 800,
    color: Color.White,
    [theme.breakpoints.down('sm')]: {
      fontSize: 26
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20
    }
  },
  headerSubTitle: {
    fontSize: 26,
    fontWeight: 400,
    marginBlock: 0,
    marginBottom: 26,
    lineHeight: '39px',
    color: Color.White,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: 22
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  descriptionGroup: {
    width: '100%',
    maxWidth: 1100,
    margin: 'auto'
  },
  description: {
    fontSize: '19px !important',
    color: '#FFFFFF !important',
    fontWeight: 600,
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px !important'
    }
  },
  subDescription: {
    fontSize: '13px !important'
  },
  descriptionLogo: {
    width: 110,
    minWidth: 110,
    height: 110
  },
  header2: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 30,
    marginTop: 30,
    [theme.breakpoints.down('sm')]: {
      fontSize: 22
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20
    }
  },
  tableHightlight: {
    fontWeight: 600,
    fontSize: '16px !important',
    color: `${Color.MusicDAOGreen} !important`
  },
  transactionOption: {
    minWidth: 242,
    justifyContent: 'flex-start',
    marginTop: 40,
    [theme.breakpoints.down('sm')]: {
      marginTop: 36
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 46
    }
  },
  card: {
    padding: '20px 40px',
    [theme.breakpoints.down('sm')]: {
      padding: '20px 28px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '20px 12px'
    }
  },
  statsCard: {
    padding: '47px 36px 44px 45px',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: 30
    },
    [theme.breakpoints.down('xs')]: {
      padding: '47px 20px 30px 23px'
    }
  },
  poolOptions: {
    display: 'flex',
    alignItems: 'center',
    columnGap: 14,
    rowGap: 10,
    '& > button': {
      width: 205,
      height: 48,
      borderRadius: 48,
      border: 'none !important',
      marginLeft: '0px !important'
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      '& > button': {
        flex: 1
      }
    }
  },
  poolTitle: {
    justifyContent: 'space-between',
    alignItem: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItem: 'space-between'
    }
  },
  poolsGroup: {
    overflowX: 'auto',
    width: 'calc(100% + 100px)',
    marginLeft: -50,
    padding: '0px 50px',
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% + 50px)',
      marginLeft: -25,
      padding: '0px 25px'
    },
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% + 30px)',
      marginLeft: -15,
      padding: '0px 15px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#5cdabd'
    }
  },
  poolItem: {
    width: 320,
    minWidth: 320,
    maxWidth: 320
  },
  manageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5) !important'
  },
  divider: {
    opacity: '0.1 !important'
  },
  poolRewards: {
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  poolRewardsSelect: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      justifyContent: 'space-between'
    }
  },
  poolRewardsButtons: {
    '& > div': {
      display: 'flex',
      alignItems: ' center',
      minWidth: 180,
      height: 40,
      '& > button': {
        flex: 1,
        height: 32
      }
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      justifyContent: 'flex-end'
    }
  },
  arrowIcons: {
    width: 30,
    height: 30,
    cursor: 'pointer',
    '& > path': {
      stroke: '#77788E'
    },
    '&:last-child': {
      transform: 'rotate(180deg)'
    }
  },
  showAllButton: {
    border: '1px solid #65CB63 !important',
    width: '172px !important'
  },
  filterButton: {
    padding: '8px 17px',
    lineHeight: '15px',
    height: 31,
    borderRadius: 77
  },
  backButton: {
    marginTop: -20,
    [theme.breakpoints.down('sm')]: {
      marginTop: 10
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 15
    }
  }
}));
