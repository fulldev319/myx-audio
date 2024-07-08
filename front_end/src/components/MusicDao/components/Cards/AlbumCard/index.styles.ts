import { makeStyles } from '@material-ui/core/styles';

export const albumCardStyles = makeStyles((theme) => ({
  card: {
    position: 'relative',
    maxWidth: 370,
    minWidth: 276,
    width: '100%',
    background: '#ffffff',
    borderRadius: 16,
    height: 340,
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  },
  collection: {
    width: '100%',
    height: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 16
  },
  infoSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    color: 'white',
    padding: `${theme.spacing(10)}px ${theme.spacing(1)}px ${theme.spacing(
      1
    )}px ${theme.spacing(1)}px`,
    background:
      'linear-gradient(181.17deg, rgba(6, 6, 6, 0) 27.26%, rgba(0, 0, 0, 0.5) 99%)',
    borderRadius: 16
  },
  title: {
    fontWeight: 600,
    fontSize: 15,
    lineHeight: '18px',
    padding: '0px 12px'
  },
  description: {
    fontStyle: 'normal',
    fontWeight: 500,
    padding: '0px 12px',
    fontSize: 12,
    lineHeight: '14px'
  }
}));
