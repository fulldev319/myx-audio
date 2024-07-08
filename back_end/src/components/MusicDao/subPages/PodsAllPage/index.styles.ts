import { makeStyles } from '@material-ui/core/styles';

export const voteSubPageStyles = makeStyles((theme) => ({
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '60px 168px 50px 168px',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    [theme.breakpoints.down('lg')]: {
      padding: '60px 140px 50px'
    },
    [theme.breakpoints.down('md')]: {
      padding: '60px 80px 50px'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '60px 40px 50px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '60px 24px 50px'
    }
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
    marginBottom: 48,
    zIndex: 1,
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
    fontSize: 52,
    color: '#ffffff',
    lineHeight: '120%',
    [theme.breakpoints.down('sm')]: {
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
  optionSection: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      justifyContent: 'center'
    }
  },
  filterPopMenu: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    marginLeft: 32,
    marginRight: 16,
    [theme.breakpoints.down('xs')]: {
      marginTop: 12,
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      marginRight: 56
    }
  },
  header2: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'white'
  },
  sortSection: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 24
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
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      padding: '8px 14px'
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
