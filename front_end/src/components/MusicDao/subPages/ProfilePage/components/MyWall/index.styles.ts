import { makeStyles } from '@material-ui/core/styles';

export const wallStyles = makeStyles((theme) => ({
  wallPostOption: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(2)
    },
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'space-between',
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginTop: theme.spacing(2)
    }
  },
  flexRowInputsImgTitleDesc: {
    display: 'flex'
  },
  infoHeaderImgTitleDesc: {
    fontSize: 14,
    fontWeight: 400,
    color: '#707582'
  },
  textFieldImgTitleDesc: {
    height: 46,
    backgroundColor: '#F7F9FE',
    borderRadius: 6,
    border: '1px solid hsla(212, 25%, 60%, 0.3)',
    marginTop: 8,
    color: '#707582',
    fontSize: 14,
    fontWeight: 400,
    paddingLeft: 20,
    marginBottom: 8,
    width: '100%',
    position: 'relative',
    cursor: 'pointer',
    '&:focus': {
      outline: 'none'
    },
    '&::placeholder': {
      outline: 'none',
      color: '#707582',
      fontSize: 14,
      fontWeight: 400
    }
  },
  dragImageHereIconImgTitleDesc: {
    marginBottom: 16,
    position: 'absolute',
    left: 10,
    top: 10,
    width: 16,
    height: 17
  },
  manageButton: {
    padding: '0 26px !important',
    borderRadius: '50px !important',
    background: '#2D3047 !important'
  },
  commentBox: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start'
    }
  }
}));
