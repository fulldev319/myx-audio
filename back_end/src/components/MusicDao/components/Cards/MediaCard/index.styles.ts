import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const mediaCardStyles = makeStyles((theme) => ({
  container: {
    background: 'white',
    borderRadius: theme.spacing(2),
    position: 'relative',
    overflowX: 'hidden'
  },
  podImageContent: {
    height: '200px',
    borderRadius: theme.spacing(2),
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0
  },
  podImage: {
    width: '100%',
    height: '100%',
    borderRadius: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  fractionBox: {
    color: 'white',
    borderRadius: theme.spacing(2),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    fontSize: '12px',
    background: '#7F6FFF',
    top: theme.spacing(4),
    left: theme.spacing(4),
    position: 'absolute'
  },
  genreBox: {
    color: Color.MusicDAODark,
    borderRadius: theme.spacing(0.5),
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    fontSize: '12px',
    fontWeight: 600,
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(23.8551px)',
    top: theme.spacing(4),
    right: theme.spacing(4),
    position: 'absolute'
  },
  avatarBox: {
    top: theme.spacing(23),
    left: theme.spacing(4),
    position: 'absolute'
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    textOverflow: 'ellipsis',
    overflowX: 'hidden'
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  header1: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '140%',
    color: '#707582'
  },
  header2: {
    fontSize: 16,
    fontWeight: 500,
    color: '#707582'
  },
  header3: {
    fontSize: 14,
    fontWeight: 700,
    color: '#181818'
  },
  moreBox: {
    marginLeft: -theme.spacing(2),
    background: 'white',
    borderRadius: theme.spacing(2),
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    fontSize: '10px'
  },
  typeBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: theme.spacing(2),
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,

    '& img': {
      width: '20px'
    }
  },
  radialLabelBox: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: theme.spacing(1)
  },
  menuBox: {
    position: 'absolute',
    top: theme.spacing(4),
    right: theme.spacing(4),
    cursor: 'pointer'
  }
}));
