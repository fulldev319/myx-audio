import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const potionRevenuePageStyle = makeStyles((theme) => ({
  container: {
    position: 'relative',
    background: '#E2EAF1',
    color: Color.MusicDAODark
  },
  body: {
    width: '100%',
    position: 'relative',
    margin: 'auto',
    marginTop: 100,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 2
  },
  tabBarBox: {
    borderRadius: theme.spacing(2),
    border: '1px solid #DAE6E5',
    background: 'white',
    padding: theme.spacing(0.5),
    display: 'flex',
    justifyContent: 'center'
  },
  tabBarItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    padding: `${theme.spacing(1)}px ${theme.spacing(5)}px`,
    cursor: 'pointer',
    borderRadius: theme.spacing(2),
    minWidth: theme.spacing(35),
    fontSize: 15,
    fontWeight: 700
  },
  tabBarItemActive: {
    opacity: 1,
    background: 'linear-gradient(0deg, #E4F8E8, #E4F8E8), #F0F5F8'
  },
  stakingBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  stackListItemBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(2)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4)
  },
  graphBox: {
    overflow: 'hidden',
    boxShadow: '0px 25px 36px -11px rgba(0, 0, 0, 0.02)',
    borderRadius: 20,
    padding: `${theme.spacing(3.5)}px ${theme.spacing(5)}px`,
    background: '#2B3161'
  },
  controlParentBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start'
    },
    width: '100%'
  },
  liquidityBox: {
    display: 'flex',
    alignItems: 'center',
    background: '#181F3D',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(5),
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(1)
    },
    '& button': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  controlBox: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-end'
    }
  },
  groupButton: {
    background: 'transparent',
    border: 'none',
    borderRadius: 60,
    fontSize: 14,
    color: 'white',
    padding: '8px 16px',
    '& + &': {
      marginLeft: 4
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  selectedGroupButton: {
    background: '#65CB63'
  },
  dateButton: {
    fontSize: 14,
    fontWeight: 400,
    color: '#ffffff90',
    padding: theme.spacing(1),
    cursor: 'pointer',
    borderRadius: theme.spacing(0.5)
  },
  dateButtonSelected: {
    color: '#2D3047',
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8'
  },
  header1: {
    fontSize: 26,
    fontWeight: 800
  },
  headerTitle: {
    fontSize: 27,
    color: Color.MusicDAODark,
    textAlign: 'center',
    marginBlock: 0,
    fontWeight: 800,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
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
  }
}));
