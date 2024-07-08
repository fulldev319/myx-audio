import { makeStyles } from '@material-ui/core';
import { Color } from 'shared/ui-kit';

export const landPageStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    background: '#F2F4FB',
    textAlign: 'center',
    paddingBottom: theme.spacing(8)
  },
  actionBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down(750)]: {
      flexDirection: 'column',
      padding: `0px ${theme.spacing(4)}px`
    }
  },
  title: {
    fontSize: 48,
    fontWeight: 800,
    lineHeight: '57.6px',
    color: Color.MusicDAODark,
    [theme.breakpoints.down(750)]: {
      fontSize: 25,
      lineHeight: '35px'
    }
  },
  description: {
    fontSize: 18,
    fontWeight: 400,
    lineHeight: '27.9px',
    color: Color.MusicDAODark,
    opacity: 0.7
  },
  routerBox: {
    padding: `${theme.spacing(20)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(25),
    width: theme.spacing(45),
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'scale(1.02)'
    },
    [theme.breakpoints.down(750)]: {
      borderRadius: theme.spacing(5),
      width: '100%',
      padding: `${theme.spacing(5)}px ${theme.spacing(2)}px`,
      marginBottom: theme.spacing(3)
    }
  },
  title1: {
    fontSize: 25,
    fontWeight: 800,
    lineHeight: '37.5px',
    color: Color.MusicDAODark,
    [theme.breakpoints.down('sm')]: {
      fontSize: 16
    }
  },
  enterBtn: {
    padding: '0px 32px',
    width: '160px',
    height: '48px'
  }
}));
