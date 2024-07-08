import { makeStyles } from '@material-ui/core/styles';
import { Gradient } from 'shared/ui-kit';

export const useNftDetailStyles = makeStyles((theme) => ({
  mainCard: {
    background: '#fff',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 16,

    position: 'relative'
  },
  subCard: {
    height: 60,
    background: '#fff',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 16,

    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    color: '#7E7D95',
    [theme.breakpoints.down('xs')]: {
      padding: '0 8px'
    }
  },
  priceBox: {
    padding: '40px 24px',
    background: 'linear-gradient(0deg, #F2F4FB, #F2F4FB), #17172D',
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  divider: {
    width: '100%',
    height: 0,
    opacity: 0.4,
    border: '1px solid rgba(84, 101, 143, 0.3)'
  },
  comingTag: {
    background: '#0D59EE',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    padding: '5px 9px',
    borderRadius: 8
  },
  myTooltip: {
    '& .MuiTooltip-tooltip': {
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      fontSize: 12,
      lineHeight: '130%'
    },
    '& .MuiTooltip-arrow': {
      color: 'rgba(0, 0, 0, 0.8)'
    }
  },
  soldAmount: {
    ontFamily: 'Agrandir',
    fontWeight: 800,
    fontSize: 32,
    color: '#0D59EE',
    textAlign: 'center',
    textTransform: 'uppercase',
    '& > span': {
      color: '#54658F',
      '&:first-child': {
        fontWeight: 400
      }
    },
    '& > div': {
      color: '#54658F',
      fontSize: 17
    }
  },
  playerButton: {
    cursor: 'pointer',
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    background: 'rgb(13, 89, 238)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%'
  }
}));
