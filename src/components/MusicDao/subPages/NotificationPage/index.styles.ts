import makeStyles from '@material-ui/core/styles/makeStyles';

export const notificationPageStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  topBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  background: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 37.95%, #F0F5F8 81.78%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    flex: 1,
    width: '100%',
    padding: '40px 160px',
    [theme.breakpoints.down('md')]: {
      padding: '40px 60px'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '40px 46px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '40px 26px'
    }
  },
  title: {
    fontSize: 30,
    fontWeight: 800,
    lineHeight: '39px',
    color: 'white',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      textAlign: 'center',
      marginTop: theme.spacing(2)
    }
  },
  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: 'white',
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginTop: theme.spacing(2)
    }
  }
}));
