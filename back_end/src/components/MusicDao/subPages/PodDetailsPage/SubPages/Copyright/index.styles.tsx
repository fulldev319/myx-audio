import makeStyles from '@material-ui/core/styles/makeStyles';
import { Gradient } from 'shared/ui-kit';

export const useCopyRightStyles = makeStyles((theme) => ({
  container: {},
  title: {
    fontSize: 30,
    fontWeight: 800,
    lineHeight: '39px',
    color: '#2D3047',
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
      lineHeight: '130%'
    }
  },
  whiteBox: {
    background: theme.palette.common.white,
    borderRadius: 12,
    padding: '32px 36px',
    [theme.breakpoints.down('xs')]: {
      padding: '20px'
    }
  },
  h1: {
    fontSize: 20,
    fontWeight: 800,
    lineHeight: '120%'
  },
  h3: {
    fontSize: 14,
    lineHeight: '105%'
  },
  bgGradient: {
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #F0F5F8 96.61%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  fractionItem: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-end'
    }
  }
}));
