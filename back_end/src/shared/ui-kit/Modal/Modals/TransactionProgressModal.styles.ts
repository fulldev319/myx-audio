import { makeStyles } from '@material-ui/core/styles';

export const useTransactionProgressModalStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '602px !important',
    fontSize: '18px',
    lineHeight: '23px',
    textAlign: 'center',
    color: '#181818',
    padding: '138px 65.5px 80px !important'
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '27px',
    lineHeight: '140%',
    textAlign: 'center',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: '#181818',
    flex: 'none',
    order: 0,
    flexGrow: 0,
    margin: '20px 0px'
  },

  iconContainer: {
    width: '166.5px',
    height: '166.5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #2811360d',
    boxSizing: 'border-box',
    borderRadius: '50%'
  },

  buttonCheck: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '21px',
    textAlign: 'center',
    letterSpacing: '-0.04em',
    color: '#4218B5',
    flex: 'none',
    order: 0,
    flexGrow: 0,
    margin: '0px 4px',
    mixBlendMode: 'normal',
    border: '1px solid #4218B5',
    boxSizing: 'border-box',
    borderRadius: '10px',
    background: 'white',
    marginTop: '38px'
  },

  button: {
    marginTop: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px 26px',
    width: '289px',
    minWidth: 'fit-content',
    maxWidth: '80%',
    background: '#4218B5',
    borderRadius: '10px',
    color: 'white',

    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '21px'
  },

  hash: {
    cursor: 'pointer'
  }
}));
