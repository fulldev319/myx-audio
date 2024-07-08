import { makeStyles } from '@material-ui/core/styles';

export const revenueCardStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    borderRadius: theme.spacing(4),
    padding: theme.spacing(4),
    width: '100%',
    height: theme.spacing(40),
    textTransform: 'uppercase'
  },
  header1: {
    color: 'white',
    fontSize: 30,
    fontWeight: 600
  },
  header2: {
    fontSize: 19,
    fontWeight: 700,
    color: 'white',
    width: theme.spacing(15),
    wordBreak: 'break-word'
  },
  header3: {
    fontSize: 18,
    fontWeight: 600,
    color: 'white',
    borderBottom: '2px solid #8EFE5A'
  },
  circleBox: {
    borderRadius: theme.spacing(4),
    width: theme.spacing(4),
    height: theme.spacing(4),
    overflow: 'hidden'
  }
}));
