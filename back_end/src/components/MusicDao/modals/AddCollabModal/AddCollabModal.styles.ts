import { makeStyles } from '@material-ui/core/styles';

export const addCollabModalStyles = makeStyles((theme) => ({
  modalContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  headerCreatePod: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '22px',
    lineHeight: '130%',
    color: '#2D3047',
    marginBottom: '35px',
    textAlign: 'center',
    '& span': {
      color: '#7F6FFF',
      marginLeft: '10px'
    }
  },
  buttons: {
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '32px',
    '& button': {
      height: '59px',
      borderRadius: '48px',

      fontWeight: 800,
      lineHeight: '20px',
      border: 'none',
      maxWidth: 'auto',
      flex: 1,
      '&:first-child': {
        background: '#FFFFFF',
        color: '#2D3047',
        border: '1px solid #2D3047'
      }
    }
  }
}));
