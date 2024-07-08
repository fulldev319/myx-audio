import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const actionsRowStyles = makeStyles((theme) => ({
  actions: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 24,
    '& > div button': {
      marginRight: 24
    },
    '& b': {
      margin: '0px 4px 0px 16px'
    },
    [theme.breakpoints.down(600)]: {
      justifyContent: 'center',
      borderBottom: '1px solid #EFF2F8',
      paddingBottom: 24
    }
  },
  play: {
    background: '#FF00C6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0px 40px',
    borderRadius: 40,
    height: 60,
    fontSize: 20,
    '& img': {
      height: 18,
      marginRight: 10,
      [theme.breakpoints.down(600)]: {
        height: 20,
        marginLeft: 6
      }
    },
    [theme.breakpoints.down(600)]: {
      width: 48,
      height: 48
    }
  },
  likeIcon: {
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 100%)',
    borderRadius: '100%',
    padding: 0,
    width: 40,
    height: 40,
    color: 'black',
    '& img': {
      [theme.breakpoints.down(600)]: {
        width: 30,
        height: 30
      }
    },
    '& svg': {
      [theme.breakpoints.down(600)]: {
        width: 17,
        height: 17
      }
    }
  },
  likedIcon: {
    marginRight: 20,
    cursor: 'pointer'
  },
  shareIcon: {
    background: 'transparent',
    color: 'black'
  },
  paper: {
    background: '#181818',
    boxShadow: '0px 47px 65px -11px rgba(36, 46, 60, 0.21)',
    borderRadius: 12,
    '& .MuiListItem-root.MuiMenuItem-root': {
      color: 'white',
      '& > svg': {
        marginRight: 12
      }
    }
  },
  shareButton: {
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    '& > svg': {
      marginRight: 12
    }
  }
}));
