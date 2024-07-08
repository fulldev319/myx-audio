import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const useStyles = makeStyles((theme) => ({
  root: {
    background: 'white',
    borderRadius: theme.spacing(2),
    boxShadow: '0px 18px 10px -10px rgba(19, 45, 38, 0.07)',
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      width: 'auto'
    }
  },
  header1: {
    fontSize: 14,
    fontWeight: 500,
    color: Color.MusicDAOLightBlue,
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  header2: {
    fontSize: 16,
    fontWeight: 600,
    color: Color.Black,
    '& > span': {
      opacity: 0.7
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  header3: {
    fontSize: 14,
    fontWeight: 600,
    color: Color.MusicDAOGreen,
    maxWidth: 150,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  header4: {
    fontSize: 16,
    fontWeight: 500,
    color: '#707582',
    maxWidth: 180,
    textAlign: 'end',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      textAlign: 'start'
    }
  },
  text2: {
    fontSize: 18,
    color: Color.MusicDAODark,
    fontWeight: 800
  },
  flexBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    '& button': {
      [theme.breakpoints.down('xs')]: {
        fontSize: 12,
        padding: '0 12px',
        height: 24,
        lineHeight: '24px'
      }
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      '& button + button': {
        marginTop: 8,
        marginLeft: '0 !important'
      }
    }
  },
  streamingBadge: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    borderRadius: '8px',
    color: Color.MusicDAOGreen,
    fontSize: '11px',
    lineHeight: '14px',
    letterSpacing: '0.3em',
    padding: '4px 8px',
    width: 158,
    marginTop: '4px'
  },
  detailsVotingButton: {
    backgroundColor: Color.MusicDAODark,
    border: 'transparent',
    color: 'white',

    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '21px',
    letterSpacing: '-0.02em',
    textAlign: 'center'
  }
}));
