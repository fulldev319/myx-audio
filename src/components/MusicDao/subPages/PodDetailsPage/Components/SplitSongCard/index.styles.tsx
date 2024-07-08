import { makeStyles } from '@material-ui/core/styles';

export const useSplitSongCardStyles = makeStyles((theme) => ({
  card: {
    position: 'relative',
    background: '#fff',
    padding: 24,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 24,

    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '150%'
  },
  oneCard: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    padding: '24px 30px',
    boxShadow: '0px 14px 14px -12px rgba(36, 67, 59, 0.09)',
    borderRadius: 16,
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '150%',
    justifyContent: 'space-between',
    position: 'relative',
    maxHeight: 153,
    [theme.breakpoints.down('xs')]: {
      maxHeight: 320,
      flexDirection: 'column'
    }
  },
  twoCard: {
    display: 'flex',
    background: '#fff',
    padding: '24px 30px',
    boxShadow: '0px 14px 14px -12px rgba(36, 67, 59, 0.09)',
    borderRadius: 16,

    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '150%',
    position: 'relative'
  },
  percent: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 19,
    lineHeight: '104.5%',
    textAlign: 'center',
    color: '#0D59EE'
  },
  moreBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F2F4FB',
    borderRadius: 16
  },
  deleteBox: {
    position: 'absolute',
    top: 16,
    right: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#EFDDDD',
    borderRadius: 8,
    padding: 12,
    '& > img': {
      width: 20
    }
  },
  socialIcons: {
    cursor: 'pointer',
    display: 'flex',
    '& img': {
      width: 30,
      height: 30
    }
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    borderRadius: '50%'
  }
}));
