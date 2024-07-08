import makeStyles from '@material-ui/core/styles/makeStyles';

const addedSongStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(10),
    color: '#2D3047',
    maxWidth: 1440,
    [theme.breakpoints.down(1100)]: {
      padding: theme.spacing(3)
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(5)
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2)
    }
  },
  borderBox: {
    border: '1px solid rgba(84, 101, 143, 0.3)',
    background: 'rgba(255, 255, 255, 0.4)',
    borderRadius: theme.spacing(4),
    boxShadow: '0px 15px 20px -6px rgba(29, 103, 84, 0.11)',
    padding: theme.spacing(3)
  },
  investorBox: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 18,
    fontWeight: 600
  },
  urlLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#65CB63'
  },
  proposerBox: {
    background: '#54658F',
    borderRadius: 32,
    color: 'white',
    padding: '8px 12px'
  }
}));

export default addedSongStyles;
