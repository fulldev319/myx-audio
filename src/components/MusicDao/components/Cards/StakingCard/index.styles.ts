import { makeStyles } from '@material-ui/core/styles';

export const stakingCardStyles = makeStyles((theme) => ({
  container: {
    background:
      'linear-gradient(180deg, #FAFEFF 26.72%, rgba(255, 255, 255, 0) 100%)',
    borderRadius: theme.spacing(13),
    padding: theme.spacing(4),
    textAlign: 'center'
  },
  traxBox: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    borderRadius: theme.spacing(2),
    background: 'white'
  },
  header1: {
    fontSize: 14,
    fontWeight: 600
  },
  header2: {
    fontSize: 16,
    fontWeight: 600
  },
  header3: {
    fontSize: 12,
    fontWeight: 600,
    opacity: 0.7
  },
  imageBox: {
    position: 'relative',
    borderRadius: theme.spacing(2)
  },
  rankBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: theme.spacing(4),
    position: 'absolute',
    top: -theme.spacing(2),
    left: '50%',
    transform: 'translate(-50%, 0)'
  },
  img: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    borderRadius: theme.spacing(2),
    objectFit: 'cover'
  },
  avatarBox: {
    position: 'absolute',
    right: -theme.spacing(2),
    bottom: -theme.spacing(2)
  }
}));
