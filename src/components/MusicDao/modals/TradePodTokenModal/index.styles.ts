import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    width: '755px !important',
    padding: '40px 40px 50px !important',
    '& .MuiInput-root': {
      background: 'rgba(218, 230, 229, 0.4)',

      marginBottom: '0',
      borderRadius: '8px'
    },
    '& .MuiFormControl-root': {
      borderRadius: '8px',
      height: '46px',
      marginTop: 8,

      '& > div > div': {
        borderRadius: '8px',
        padding: '11.5px 18px'
      }
    }
  },
  title: {
    fontWeight: 800,
    fontSize: '22px',
    lineHeight: '130%',
    color: '#2D3047',
    marginBottom: '18px'
  },
  swapBtnSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '26px',
    marginBottom: '26px'
  },
  swapButton: {
    width: '100%',
    fontSize: 16,
    margin: '16px 0px',
    height: 50,
    '& img': {
      width: 14,
      height: 14,
      marginLeft: 4
    }
  },
  squareContainer: {
    padding: '20px 0',
    display: 'flex',
    alignItems: 'flex-start'
  },
  squareContainerLabel: {
    color: '#2D3047',

    fontWeight: 600,
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  squareContainerInput: {
    marginTop: '8px',
    background: '#F0F5F5',
    borderRadius: '8px',
    padding: '11.5px 18px',
    height: '46px',

    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    lineHeight: '104.5%',
    color: '#181818',

    '& img': {
      width: '25px',
      height: '25px',
      marginRight: '7px'
    }
  },
  imageInput: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '104.5%',
    color: '#181818 !important',
    background: 'transparent !important'
  },
  balance: {
    fontWeight: 500,

    marginTop: 8,
    fontSize: 14,
    color: '#2D3047'
  },
  error: {
    color: 'red'
  },
  submit: {
    display: 'flex',
    marginTop: 28,
    '& button': {
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '16px',
      lineHeight: '20px',
      textAlign: 'center',
      letterSpacing: '-0.04em',
      textTransform: 'uppercase',
      color: '#FFFFFF',
      width: '100%',
      padding: '20.5px 45px',
      height: 59,
      borderRadius: '48px'
    }
  },
  valueBox: {
    padding: '28px 0px',
    borderTop: '1px solid #55669133',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    '&:first-child': {
      borderTop: 'none'
    }
  },
  buttonSwap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '50%',
    background: '#2D3047',
    boxSizing: 'border-box',
    marginRight: '14px',
    height: '40px',
    minWidth: '40px',
    width: '40px',
    padding: '11px 15px',

    '& img': {
      height: '10px',
      '&:first-child': {
        transform: 'rotate(90deg)'
      },
      '&:last-child': {
        transform: 'rotate(-90deg)'
      }
    }
  },
  colorBox: {
    background: 'rgba(238, 242, 246, 0.5)',
    borderRadius: '12px',
    margin: '15px 0px',
    padding: '0px 24px',
    paddingBottom: '-12px'
  },
  titleLabel: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '104.5%',
    color: '#181818'
  },
  contentValue: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '104.5%',
    textAlign: 'right',
    color: '#181818'
  },
  contentSmall: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '120%',
    textAlign: 'right',
    color: '#ABB3C4',
    marginTop: 4
  },
  noticeBox: {
    borderRadius: 12,
    border: '1px solid rgba(255, 142, 60, 0.6)',
    background: 'rgba(255, 142, 60, 0.1)',
    padding: '18px 28px',
    marginTop: 16
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: 700,

    color: '#ff8e3c',
    lineHeight: '160%',
    textTransform: 'uppercase'
  },
  noticeContent: {
    fontSize: 14,
    fontWeight: 500,

    color: '#2D3047',
    lineHeight: '150%',
    marginTop: 4
    // borderBottom: "1px solid #FF8E3C",
  },
  noticeLabel: {
    fontSize: 15,
    fontWeight: 500,
    color: '#65CB63',
    lineHeight: '104.5%'
  },
  noticeEmialBox: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
      alignItems: 'flex-start'
    }
  },
  emailInput: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.6)',
    padding: theme.spacing(1),
    border: '1px solid #FF8E3C',
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginTop: theme.spacing(2)
    }
  }
}));
