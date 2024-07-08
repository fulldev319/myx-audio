import { makeStyles } from '@material-ui/core/styles';

export const removeCollabModalStyles = makeStyles((theme) => ({
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    lineHeight: '28.6px'
  },
  description: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '24px',
    opacity: 0.9
  },
  buttonFont: {
    fontSize: 14,
    fontWeight: 600
  },
  deleteIcon: {
    background: '#EFDDDD',
    padding: theme.spacing(1.5),
    borderRadius: '50%',
    width: 62,
    height: 62
  }
}));
