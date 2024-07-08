import { makeStyles } from '@material-ui/core/styles';

export const artistCardStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px 20px 16px',
    height: 300
  },
  avatarBox: {
    background: 'linear-gradient(122.33deg, #4D08BC 13.31%, #2A9FE2 93.53%)',
    padding: theme.spacing(0.5),
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:hover': {
      boxShadow:
        '0px 0px 24px rgba(255, 255, 255, 0.65), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.02)'
    },
    marginBottom: theme.spacing(1.5)
  },
  avatar: {
    width: 170,
    height: 170,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '50%'
  },
  name: {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 14,
    lineHeight: '108.5%',
    // display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 8,
    color: '#fff'
  },
  followers: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '120%',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#707582',
    marginBottom: 8
  },
  followButton: {
    borderRadius: '100vh !important',
    fontSize: '14px !important',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '34px !important',
    color: '#5046BB',
    lineHeight: '15px'
  }
}));
