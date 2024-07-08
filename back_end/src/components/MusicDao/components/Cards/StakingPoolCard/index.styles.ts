import { makeStyles } from '@material-ui/core/styles';

export const stakingPoolCardStyles = makeStyles((theme) => ({
  card: {
    background: '#ffffff',
    borderRadius: 20,
    padding: '36px 30px 20px',
    minWidth: theme.spacing(30)
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  tokenImg: {
    width: 38,
    height: 38
  },
  header1: {
    fontSize: 18,
    fontWeight: 700,
    color: '#404658'
  },
  header2: {
    fontSize: 14,
    fontWeight: 600
  },
  header3: {
    fontSize: 14,
    fontWeight: 500
  }
}));
