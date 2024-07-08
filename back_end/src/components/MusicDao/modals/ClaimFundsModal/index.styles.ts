import { makeStyles } from '@material-ui/core/styles';

export const ClaimFundsModalStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center'
  },
  header1: {
    fontSize: 22,
    fontWeight: 800
  },
  header2: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '150%'
  },
  header3: {
    fontSzie: 16,
    fontWeight: 800,
    lineHeight: '130%'
  },
  header4: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: '104.5%'
  },
  header5: {
    fontSize: 28,
    fontWeight: 800,
    '& > span': {
      opacity: 0.7
    }
  },
  header6: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '150%',

    [theme.breakpoints.down('xs')]: {
      fontSize: 13
    }
  },
  greenBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: theme.spacing(1.5),
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D'
  }
}));
