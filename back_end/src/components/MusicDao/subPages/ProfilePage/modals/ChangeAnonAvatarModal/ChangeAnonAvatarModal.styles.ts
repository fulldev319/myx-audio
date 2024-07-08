import { makeStyles } from '@material-ui/core/styles';

export const changeAnonAvatarModalStyles = makeStyles((theme) => ({
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
  closeButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    cursor: 'pointer'
  },
  avatarList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    width: 80,
    height: 80,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 15,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  avatarSelected: {
    border: '5px solid #64c89e',
    width: 80,
    height: 80,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 15,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerSection: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      marginTop: 20
    }
  }
}));
