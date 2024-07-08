import { makeStyles } from '@material-ui/core/styles';

export const useCardStyles = makeStyles((theme) => ({
  collectionCardRoot: {
    background: '#FFFFFF',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 8px 12px',
    position: 'relative',
    textAlign: 'center',
    height: 400,
    cursor: 'pointer',
    '&:hover': {
      boxShadow:
        '0px 16px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.02)'
    },
    [theme.breakpoints.down('xs')]: {
      height: 300
    }
  },
  image: {
    borderRadius: 20,
    width: '100%',
    height: 250,
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      height: 160
    },
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  },
  typo1: {
    fontSize: 18,
    fontWeight: 600,

    color: '#2D3047',
    marginTop: 24,
    padding: '0px 24px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      marginTop: 12,
      padding: 12
    }
  },
  typo2: {
    fontSize: 13,
    fontWeight: 500,

    color: '#2D304770',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
    padding: '0px 32px',
    marginTop: 12,
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      fontSize: 9,
      padding: '0px 4px',
      marginTop: 4
    }
  }
}));
