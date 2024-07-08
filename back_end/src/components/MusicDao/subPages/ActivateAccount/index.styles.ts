import makeStyles from '@material-ui/core/styles/makeStyles';

export const activateAccountStyles = makeStyles((theme) => ({
  contentBox: {
    padding: `60px ${theme.spacing(10)}px ${theme.spacing(5)}px`,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 600,
    color: 'white',
    '& label': {
      color: 'white !important'
    },
    [theme.breakpoints.down('sm')]: {
      padding: `60px ${theme.spacing(3)}px ${theme.spacing(5)}px`
    }
  },
  title: {
    fontSize: 40,
    fontWeight: 700,
    lineHeight: '57.4px',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
      lineHeight: '46px'
    }
  },
  label: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: '18.81px'
  }
}));
