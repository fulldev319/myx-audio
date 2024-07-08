import { makeStyles } from '@material-ui/core/styles';

export const albumCardStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0px 0px 16px',
    background: '#ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    height: 276,
    cursor: 'pointer',
    borderRadius: 12,
    '&:hover': {
      boxShadow:
        '0px 0px 24px rgba(255, 255, 255, 0.65), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.02)'
    }
  },
  album: {
    width: '100%',
    height: 175.46,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: 16
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 14,
    lineHeight: '35px',
    padding: '0px 20px',
    // display: 'flex',
    // alignItems: 'center',
    textAlign: 'center',
    color: '#181818',
    height: '35px',
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    // textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  description: {
    fontStyle: 'normal',
    fontWeight: 400,
    padding: '0px 20px',
    fontSize: 14,
    lineHeight: '120%',
    textAlign: 'center',
    color: '#707582',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
    height: 20
  }
}));
