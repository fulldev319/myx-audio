import { makeStyles } from '@material-ui/core/styles';

export const cardStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    border: '1px solid #4D08BC',
    height: 594,
    cursor: 'pointer',
    borderRadius: 40,
    '&:hover': {
      boxShadow:
        '4px 4px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.02)'
    }
  },
  album: {
    width: '100%',
    height: 410,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  title: {
    fontWeight: 400,
    fontSize: 22,
    color: '#fff',
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
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
  },
  playIconBox: {
    position: 'absolute',
    right: 32,
    top: 320,
    background: '#FF00C6',
    borderRadius: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    width: 70,
    height: 70
  }
}));
