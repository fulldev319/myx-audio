import { makeStyles } from '@material-ui/core/styles';

export const proposalSubPageStyles = makeStyles((theme) => ({
  headerImage: {
    [theme.breakpoints.down('sm')]: {
      height: 700
    }
  },
  content: {
    background: 'linear-gradient(180.15deg, #FFFFFF 2.8%, #EEF2F6 89.51%)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '67px 168px 50px 168px',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      padding: '65px 12px 50px 12px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '35px 16px 50px 16px'
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
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignItem: 'center',
    marginBottom: 51,
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 57
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: 30
    }
  },
  headerBack: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer'
  },
  headerMainTitle: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 44,
    color: '#ffffff',
    lineHeight: '52.8px',
    [theme.breakpoints.down('md')]: {
      fontSize: 28,
      lineHeight: '33.6px'
    },
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      fontSize: 24,
      marginTop: 18
    }
  },
  headerButtonSection: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      width: '100%',
      justifyContent: 'flex-end',
      marginTop: 18
    }
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
    marginTop: 24,
    marginBottom: 41,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 38
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginTop: 0,
      marginBottom: 28
    }
  },
  filterPopMenu: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    marginLeft: 32,
    marginRight: 16,
    [theme.breakpoints.down('xs')]: {
      marginTop: 12
    }
  },
  header2: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'white'
  },
  selectedButtonBox: {
    background: '#2D3047',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer'
  },
  buttonBox: {
    background: 'rgba(85, 84, 125, 0.42)',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer'
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
