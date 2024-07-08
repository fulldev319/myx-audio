import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/constants/const';

export const tradeTraxPageStyles = makeStyles((theme) => ({
  body: {
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #F0F5F8 96.61%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    height: '670px'
  },
  container: {
    height: '95%',
    padding: '66px 45px 30px',
    maxWidth: '1200px',
    margin: 'auto'
  },
  topBox: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 40,
    background: '#FFFFFF',
    boxShadow: '0px 46px 35px -31px rgba(29, 103, 84, 0.05)',
    borderRadius: 34,
    padding: '44px 75px',

    '& h1': {
      fontWeight: 800,
      fontSize: 30,
      color: Color.MusicDAODark,
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      paddingBottom: 15
    }
  },
  tradeDescription: {
    color: Color.MusicDAOLightBlue,
    margin: 0,
    fontSize: 14,
    fontWeight: 600
  },
  chartContainer: {
    '& > div': {
      overflow: 'hidden',
      background: Color.White,
      boxShadow: '0px 25px 36px -11px rgba(0, 0, 0, 0.02)',
      borderRadius: 20
    }
  },
  periodButtons: {
    '& button': {
      minWidth: 50
    }
  },
  chartInfo: {
    background: '#FFFFFF',
    boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    width: 200,
    padding: '12px 14px',
    position: 'absolute',
    left: 20,
    top: 20
  },
  tradeButton: {
    width: 300,
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    borderRadius: 30,
    height: 54,
    marginTop: 40,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 600,
    color: '#ffffff'
  },
  chartWrapper: {
    position: 'relative',
    height: 290,
    paddingTop: 10,
    backgroundColor: '#F5FCF8'
  },
  tradeInfoBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    '& h2': {
      fontWeight: 800,
      fontSize: 22,
      color: Color.MusicDAOLightBlue,
      marginBottom: 10
    },
    '& span': {
      fontSize: 14,
      fontWeight: 500,
      color: Color.MusicDAOLightBlue,
      cursor: 'pointer'
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  balanceWithSelect: {
    marginBottom: 10
  },
  exchangeButton: {
    width: 56,
    minWidth: 56,
    height: 56,
    borderRadius: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#2D3047',
    cursor: 'pointer',
    marginLeft: 30,
    marginRight: 30,
    marginTop: theme.spacing(3.5),
    '& .ex-arrwo-right': {
      transform: 'rotate(180deg)'
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1.5),
      transform: 'rotate(90deg)'
    }
  },
  title: {
    fontSize: 18,
    color: Color.MusicDAOLightBlue,
    fontWeight: 400
  },
  compareRed: {
    fontSize: 18,
    color: Color.Red,
    fontWeight: 400
  },
  compareGreen: {
    fontSize: 18,
    color: Color.Green,
    fontWeight: 400
  },
  priceInfo: {
    marginTop: 50,
    marginBottom: 50,
    '& h1': {
      fontWeight: 800,
      fontSize: 22,
      color: Color.MusicDAODark,
      borderBottom: '1px dashed rgba(152, 146, 217, 0.64);',
      paddingBottom: 18
    },
    '& h2': {
      fontWeight: 400,
      fontSize: 32,
      color: Color.MusicDAODark,
      margin: 0
    }
  },
  priceWrapper: {
    borderBottom: '1px solid rgba(152, 146, 217, 0.64);',
    padding: '22px 0'
  },
  currencyUnit: {
    width: 180,
    height: 57,
    background: Color.MusicDAOLightGreen,
    borderRadius: '60px !important',
    marginLeft: 6,
    '& .MuiInputBase-root': {
      border: 'unset',
      backgroundColor: 'unset'
    },
    '& img': {
      width: '37px !important',
      height: '37px !important'
    }
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    columnGap: 8,
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: '105%',
    color: '#181818',
    '& > img': {
      width: 36,
      minWidth: 36,
      height: 36,
      borderRadius: '100%'
    }
  },
  dropdownContent: {
    transition: 'all 1s ease-in-out',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '12px 10px',
    borderRadius: 12,
    background: '#FFFFFF',
    zIndex: 1,
    '& > div': {
      marginBottom: 5
    },
    '& > div:last-child': {
      marginBottom: 0
    }
  },
  table: {
    background: Color.White,
    borderRadius: 12,
    marginBottom: 190,
    '& .MuiTableContainer-root': {
      borderRadius: 12
    },
    '& .MuiTableCell-root': {
      fontSize: 14,
      color: Color.MusicDAODark
    },
    '& .MuiTableBody-root .MuiTableCell-root:nth-child(even)': {
      background: 'rgb(238 242 246 / 30%)'
    },
    '& .MuiTableCell-root.MuiTableCell-body': {
      '& > div': {
        color: '#54658F'
      },
      color: '#54658F'
    },
    '& .MuiTableCell-root.MuiTableCell-head': {
      borderBottom: `1px solid ${Color.MusicDAOGreen}`,
      textTransform: 'initial'
    },
    '& .MuiTableCell-head': {
      fontWeight: 'bold',
      background: '#FFF'
    }
  },
  tableHightlight: {
    fontWeight: 600,
    color: `${Color.MusicDAOGreen} !important`
  },
  showAll: {
    width: '170px !important',
    border: `1px solid ${Color.MusicDAOGreen} !important`,
    backgroundColor: 'transparent !important',
    fontSize: '14px !important',
    color: `${Color.MusicDAODark} !important`,
    position: 'relative'
  },
  exchangeSection: {
    display: 'flex',
    flexDirection: 'column',
    '& .MuiFormControl-root': {
      border: '1px solid rgba(61, 35, 174, 0.35) !important',
      borderColor: 'rgba(61, 35, 174, 0.35)',
      backgroundColor: 'rgba(61, 35, 174, 0.1) !important'
    }
  },
  exchangeValue: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(61, 35, 174, 0.1)',
    border: '1px solid rgba(61, 35, 174, 0.35)',
    borderRadius: '55px',
    padding: '0 13px',
    height: 57
  },
  '@media (min-width: 1480px)': {
    balanceWithSelect: {
      // "& .input-with-button": {
      //   minWidth: 300,
      // }
    },
    exchangeSection: {
      '& .input-with-button': {
        minWidth: 350
      }
    }
  }
}));
