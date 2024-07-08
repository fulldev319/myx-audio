import { makeStyles } from '@material-ui/core/styles';

export const headerStyles = makeStyles((theme) => ({
  headerBox: {
    width: '100%',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  header1: {
    fontSize: '12px'
  },
  dotBox: {
    minWidth: theme.spacing(4),
    width: theme.spacing(4),
    height: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'black',
    color: 'white'
  },
  select: {
    '& > div': {
      paddingBottom: '11px',
      minWidth: '120px'
    }
  },
  logo: {
    position: 'absolute',
    top: 40,
    left: 44,
    width: 100,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  card: {
    maxWidth: 856,
    width: '100%'
  },
  backButton: {
    fontSize: '16px',
    color: '#707582',
    fontWeight: 700
  },
  backBox: {
    top: 85,
    left: 44,
    width: 135,
    position: 'absolute',
    display: 'flex',
    cursor: 'pointer',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      top: 40
    }
  }
}));
