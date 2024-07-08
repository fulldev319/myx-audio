import { makeStyles } from '@material-ui/core/styles';

export const changeProfileBackgroundModalStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#ffffff',
    padding: 40,
    width: '65%',
    borderRadius: 16,
    maxWidth: '85vw',
    maxHeight: '85vh',
    overflow: 'auto',
    outline: 'none',
    [theme.breakpoints.down('xs')]: {
      width: 600,
      padding: 20,
      maxWidth: '100vw'
    }
  },
  primaryBtn: {
    background: '#431AB7 !important'
  },
  avatarList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 220,
    height: 220,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 15,
    '&:hover': {
      cursor: 'pointer'
    },
    [theme.breakpoints.down('xs')]: {
      width: 138,
      height: 138
    }
  },
  avatarSelected: {
    border: '5px solid #64c89e',
    width: 220,
    height: 220,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 15,
    '&:hover': {
      cursor: 'pointer'
    },
    [theme.breakpoints.down('xs')]: {
      width: 138,
      height: 138
    }
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& h3': {
      fontSize: 32,
      fontWeight: 800,

      [theme.breakpoints.down('xs')]: {
        fontSize: 24
      }
    }
  },
  footerSection: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 16,
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      marginTop: 20
    }
  }
}));
