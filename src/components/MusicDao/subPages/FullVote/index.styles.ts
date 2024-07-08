import { makeStyles } from '@material-ui/core/styles';

export const fullVotePageStyles = makeStyles((theme) => ({
  content: {
    background: 'linear-gradient(180.15deg, #FFFFFF 2.8%, #EEF2F6 89.51%)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '60px 168px 150px 168px',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      padding: '60px 12px 50px 12px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '60px 12px 50px 12px'
    }
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    left: 0,
    top: 0
  },
  proposalDetailBox: {
    borderRadius: 12,
    background: 'white',
    boxShadow: '0px 30px 35px -12px rgba(29, 103, 84, 0.03)'
  },
  detailHeaderBox: {
    borderRadius: 12,
    padding: '67px 80px 48px 80px',
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    [theme.breakpoints.down('sm')]: {
      padding: '57px 63px 24px 63px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '34px 27px 16px 27px'
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#404658',
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    }
  },
  header1: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#54658F'
  },
  header2: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#404658',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      fontWeight: 400
    }
  },
  header3: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#404658'
  },
  header4: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#65CB63'
  },
  dateBox: {
    fontSize: '14px',
    color: '#788BA2'
  },
  blackBox: {
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8',
    borderRadius: theme.spacing(1)
  },
  greenBox: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    borderRadius: theme.spacing(4),
    border: '1px solid #65CB63'
  },
  voteSection: {
    padding: '75px 70px 61px 70px',
    borderBottom: '1px solid #35385622',
    borderTop: '1px solid #35385622',
    [theme.breakpoints.down('xs')]: {
      padding: '51px 60px 61px 60px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '55px 15px 72px 15px'
    }
  }
}));
