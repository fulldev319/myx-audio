import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const createContentModalStyles = makeStyles((theme) => ({
  root: {
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #EEF2F6 96.61%), conic-gradient(from 71.57deg at 43.63% 99.9%, #2B99FF -34.07deg, #B234FF 21.26deg, #4434FF 224.01deg, #250EB3 256.07deg, #2B99FF 325.93deg, #B234FF 381.26deg), linear-gradient(97.63deg, #99CE00 26.36%, #0DCC9E 80%)',
    padding: `${theme.spacing(3)}px ${theme.spacing(5)}px`,
    textAlign: 'center',
    color: 'white'
  },
  contentBox: {
    padding: theme.spacing(8),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      padding: '64px 24px'
    },
    [theme.breakpoints.down('xs')]: {
      height: 'auto',
      padding: `${theme.spacing(8)}px ${theme.spacing(2)}px`
    }
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    lineHeight: '41.6px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 28,
      marginTop: 24
    }
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '25.6px',
    opacity: 0.7,
    maxWidth: 850
  },
  questionBox: {
    marginTop: 70,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  questionItemBox: {
    width: 410,
    height: 170,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fff',
    borderRadius: 20,
    cursor: 'pointer',
    fontSize: 22,
    fontWeight: 800,
    color: Color.MusicDAODark,
    position: 'relative',
    '&:hover': {
      border: '1px solid rgba(84, 101, 143, 0.3)',
      background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
      boxShadow: '0px 37px 63px rgba(54, 119, 60, 0.13)',
      '& span': {
        background:
          'linear-gradient(88.38deg, #4434FF 7.67%, #2B99FF 102.5%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
        '-webkit-text-fill-color': 'transparent',
        '-webkit-background-clip': 'text'
      }
    },
    [theme.breakpoints.down('sm')]: {
      width: 320
    }
  },
  typo1: {
    fontSize: 19,
    fontWeight: 800
  },
  comingSoon: {
    width: 'fit-content',
    position: 'absolute',
    top: -14,
    left: 270,
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 12,
    lineHeight: '145.5%',
    padding: '4px 9px',
    color: 'white',
    background:
      'linear-gradient(88.38deg, #4434FF 7.67%, #2B99FF 102.5%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    borderRadius: 8,
    [theme.breakpoints.down('sm')]: {
      left: 185
    },
    [theme.breakpoints.down('xs')]: {
      left: 220
    }
  },
  avatarTitle: {
    position: 'absolute',
    left: theme.spacing(4),
    top: theme.spacing(4)
  },
  avatarContentBox: {
    padding: `${theme.spacing(8)}px ${theme.spacing(5)}px ${theme.spacing(
      0
    )}px ${theme.spacing(5)}px`,
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.spacing(8)}px ${theme.spacing(0)}px ${theme.spacing(
        0
      )}px ${theme.spacing(0)}px`
    }
  },
  profileDescription: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '25.2px'
  }
}));
