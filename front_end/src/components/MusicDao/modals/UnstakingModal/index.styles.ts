import { makeStyles } from '@material-ui/core/styles';

export const unstakingModalStyles = makeStyles((theme) => ({
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
    opacity: 0.9,
    fontWeight: 600
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
    color: '#2D3047',
    fontWeight: 800
  },
  controlBox: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    borderRadius: theme.spacing(1.5),
    padding: '34px 51px'
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
    padding: '0px 40px',
    columnGap: 20,
    '& > button': {
      width: '100%',
      marginLeft: '0 !important'
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      padding: '0',
      rowGap: 10
    }
  }
}));
