import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  root: {
    position: 'relative',
    background: '#fff',
    borderRadius: 20,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    height: '100%',
    cursor: 'pointer',
    '& img': {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      objectFit: 'cover !important'
    }
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 24px 27px',
    minHeight: '171px'
  },
  typo1: {
    fontSize: 20,
    fontWeight: 600,

    color: '#2D3047'
  },
  typo2: {
    fontSize: 12,
    fontWeight: 500
  },
  socialButtonBox: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    right: 0
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    marginRight: '2px',
    '& img': {
      cursor: 'pointer',
      width: '28px',
      height: '28px'
    }
  }
});
