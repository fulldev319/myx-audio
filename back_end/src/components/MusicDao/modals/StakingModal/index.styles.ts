import { makeStyles } from '@material-ui/core/styles';

export const stakingModalStyles = makeStyles((theme) => ({
  root: {
    width: '755px !important'
  },
  contentBox: {
    padding: '19px 24px 8px',
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.spacing(1)}px 0px`
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  header1: {
    fontSize: 22,
    fontWeight: 800,
    color: '#2D3047',

    lineHeight: '130%'
  },
  header2: {
    fontSize: 16,
    color: '#54658F',
    fontWeight: 600,

    lineHeight: '150%',
    letterSpacing: '0.02em'
  },
  header2_1: {
    fontSize: 18,
    color: '#707582',
    fontWeight: 400
  },
  header3: {
    fontSize: 18,
    color: '#54658F',
    fontWeight: 700
  },
  header4: {
    fontSize: 28,
    color: '#1ABB00',
    fontWeight: 800
  },
  header5: {
    fontSize: 14,
    color: '#707582',
    fontWeight: 500,

    marginTop: 17,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  controlBox: {
    textAlign: 'center',
    background: '#F2FBF6',
    borderRadius: theme.spacing(1.5),
    paddingTop: 26,
    paddingBottom: 39,
    marginTop: 32
  },
  borderBox: {
    height: 56,
    borderRadius: 55,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: '#2D3047',
    cursor: 'pointer',
    border: '1px solid #7BCBB7',
    background: 'rgba(218, 230, 229, 0.4)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chainBorderBox: {
    borderRadius: 45,
    padding: '3px 16px',
    border: '1px solid #DEE7DA',
    boxShadow: '0px 8px 8px -4px rgba(86, 123, 103, 0.15)',
    background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), #17172D',
    height: 56
  },
  noBorderBox: {
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    border: '1px solid #7BCBB7'
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70
  }
}));
