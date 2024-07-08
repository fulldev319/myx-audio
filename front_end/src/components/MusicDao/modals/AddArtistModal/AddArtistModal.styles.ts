import { makeStyles } from '@material-ui/core/styles';

export const modalStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '800px !important',
    padding: '48px',
    [theme.breakpoints.down('xs')]: {
      padding: 24
    }
  },
  content: {
    width: '100%',
    height: '100%',
    minHeight: 676,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  editButton: {
    display: 'flex',
    marginLeft: 'auto',
    marginTop: '16px',
    '& button.disabled': {
      opacity: 0.6
    },
    '& button.btnBody': {
      paddingLeft: 85,
      paddingRight: 85,
      borderRadius: '100vh'
    }
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: '26px',
    color: '#181818',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    [theme.breakpoints.down('xs')]: {
      marginBottom: 0,
      marginTop: '24px'
    }
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#2D3047',
    opacity: 0.9,

    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '8px'
  }
}));
