import { makeStyles } from '@material-ui/core/styles';
import { Gradient } from 'shared/ui-kit';

export const topSongCardStyles = makeStyles((theme) => ({
  container: {
    borderRadius: theme.spacing(2),
    boxShadow: '0px 15px 16px -11px rgba(0, 0, 0, 0.02)',
    padding: theme.spacing(2),
    width: '100%',
    minHeight: 240,
    position: 'relative',
    cursor: 'pointer'
  },
  avatarsBox: {
    display: 'flex',
    alignItems: 'center'
  },
  genreBox: {
    borderRadius: theme.spacing(0.5),
    background: 'rgba(0, 0, 0, 0.3)',
    color: 'white',

    fontWeight: 600,
    fontSize: 12,
    backdropFilter: 'blur(22.9932px)',
    padding: theme.spacing(0.5)
  },
  playerButton: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    width: 57,
    height: 57,
    background: Gradient.Green1
  }
}));
