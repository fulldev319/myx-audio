import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const polygonCardStyles = makeStyles((theme) => ({
  container: {
    position: 'relative'
  },
  content: {
    width: '100%',
    position: 'absolute',
    left: '50%',
    top: '20%',
    transform: 'translate(-50%, 0%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center'
  },
  header1: {
    color: Color.MusicDAODark,
    fontSize: 17,
    fontWeight: 600
  },
  header2: {
    fontSize: 14,
    fontWeight: 500,
    color: '#707582',
    [theme.breakpoints.down('xs')]: {
      fontSize: 11
    }
  },
  circleBox: {
    borderRadius: theme.spacing(4),
    width: theme.spacing(4),
    height: theme.spacing(4),
    overflow: 'hidden'
  }
}));
