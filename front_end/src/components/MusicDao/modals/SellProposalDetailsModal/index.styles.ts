import makeStyles from '@material-ui/core/styles/makeStyles';

export const modalStyles = makeStyles((theme) => ({
  content: {
    padding: '16px 0px',
    display: 'flex',
    flexDirection: 'column'
  },
  artistImage: {
    objectFit: 'cover',
    height: 250,
    width: 300,
    borderRadius: 20,
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  typo1: {
    color: '#2D3047',
    fontSize: 22,
    fontWeight: 800,

    textAlign: 'center'
  },
  typo2: {
    color: '#2D3047',
    fontSize: 18,
    fontWeight: 600
  },
  typo3: {
    color: '#2D3047',
    fontSize: 14,
    fontWeight: 500
  },
  typo4: {
    color: '#2D3047',
    fontSize: 16,
    fontWeight: 600
  },
  typo5: {
    color: '#2D3047',
    fontSize: 20,
    fontWeight: 600
  },
  typo6: {
    color: '#65CB63',
    fontSize: 20,
    fontWeight: 700
  }
}));
