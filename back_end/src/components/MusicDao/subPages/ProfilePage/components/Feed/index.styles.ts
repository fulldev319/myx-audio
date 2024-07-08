import makeStyles from '@material-ui/core/styles/makeStyles';

export const feedStyles = makeStyles((theme) => ({
  feedMainContent: {
    marginTop: 48,
    paddingBottom: 40
  },
  filterMainContent: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 24,
    marginBottom: 16
  },
  slider: {
    width: '100%'
  },
  leftFriendContainer: {
    minWidth: 260,
    width: 260,
    marginRight: 40,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  filterContainer: {
    width: '50%',
    marginLeft: 20,
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  topFriendContainer: {
    width: '100%',
    display: 'none',
    marginBottom: 40,
    [theme.breakpoints.down('md')]: {
      display: 'block'
    }
  },
  friends: {
    padding: '24px 24px 32px',
    background: 'white',
    width: '100%',
    borderRadius: 16,
    justifyContent: 'space-between'
  },
  inputSearch: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: 10,
    '& input': {
      outline: 'none',
      border: 'none',
      padding: 0,
      margin: 0,
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 18,
      lineHeight: '104.5%',
      color: '#abb3c4',
      background: 'transparent',
      width: '100%'
    },
    '& img': {
      width: 17,
      height: 17
    }
  },
  contentContainer: {
    background: '#EFF2FD',
    boxShadow: '0px 4px 8px #9EACF2',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    boxSizing: 'content-box',
    [theme.breakpoints.down('xs')]: {
      padding: 0,
      boxShadow: 'none',
      background: 'transparent',
      borderRadius: 0
    }
  },
  headerTitle: {
    [theme.breakpoints.down('md')]: {
      fontSize: '60px !important'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '40px !important'
    }
  },
  header1: {
    fontSize: 26,
    fontWeight: 800
  },
  header2: {
    fontSize: 20,
    fontWeight: 400
  },
  createPostContainer: {
    marginRight: 20,
    width: '50%',
    height: 58,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #E0E4F3',
    borderRadius: 10,
    paddingLeft: 16,
    overflow: 'hidden',
    background: 'white',
    '& img': {
      marginRight: 16
    },
    '& input': {
      background: 'transparent',
      border: 'none',
      outline: 'none',
      flex: 1
    }
  },
  send: {
    background: '#65CB63',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    cursor: 'pointer',
    '& img': {
      marginRight: 0
    },
    height: '100%'
  }
}));
