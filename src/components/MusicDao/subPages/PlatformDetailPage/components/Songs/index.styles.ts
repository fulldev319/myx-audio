import { makeStyles } from '@material-ui/core/styles';

export const usePageStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  filterTag: {
    background: 'rgba(255, 255, 255)',
    borderRadius: '20px',
    color: '#2D3047',
    padding: '11px 16px',
    '& + &': {
      marginLeft: 16,
      [theme.breakpoints.down('xs')]: {
        marginLeft: 0
      }
    }
  },
  optionSection: {
    display: 'flex',
    alignItems: 'center'
  },
  filterButtonBox: {
    background: 'rgba(240, 245, 248, 0.7)',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px`,
    cursor: 'pointer',
    borderRadius: '100vh',
    border: '1px solid #ccc',
    color: '#2D3047',
    [theme.breakpoints.down('xs')]: {
      padding: '8px'
    }
  },
  controlBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(242, 249, 248, 0.3)',
    borderRadius: theme.spacing(4)
  },
  showButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none !important',
    backgroundColor: 'transparent !important'
  },
  showButtonSelected: {
    backgroundColor: '#fff !important'
  },
  mainContainer: {
    // marginTop: 40,
    // [theme.breakpoints.down('md')]: {
    //   marginTop: 32,
    // },
    // [theme.breakpoints.down('xs')]: {
    //   marginTop: 18,
    // }
  },
  typo1: {
    fontSize: 32,
    fontWeight: 800,
    lineHeight: '104.5%',

    color: '#2D3047'
  }
}));
