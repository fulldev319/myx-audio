import { makeStyles } from '@material-ui/core/styles';
import { Gradient } from 'shared/ui-kit';

export const creatingPlayListModalStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '602px !important',
    fontSize: '18px',
    lineHeight: '23px',
    textAlign: 'center',
    color: 'white',
    background: '#13172C',
    padding: '100px 65.5px 80px !important',
    overflow: 'visible'
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '32px',
    lineHeight: '57.6px',
    textAlign: 'center',
    flex: 'none',
    order: 0,
    flexGrow: 0,
    margin: '20px 0px'
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1.5),
    border: '1px solid #fff',
    boxSizing: 'border-box',
    borderRadius: '50%'
  },
  button: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px 12px',
    width: '289px',
    minWidth: 'fit-content',
    maxWidth: '80%',
    background: Gradient.Blue,
    borderRadius: '32px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '21px'
  },

  hash: {
    cursor: 'pointer'
  }
}));
