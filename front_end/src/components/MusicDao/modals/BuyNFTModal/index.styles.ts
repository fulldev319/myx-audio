import makeStyles from '@material-ui/core/styles/makeStyles';

const useModalStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '892px !important',
    boxShadow: '0px 38px 42px 17px rgba(35, 55, 50, 0.21) !important',
    borderRadius: '30px !important',
    '& button': {
      background: '#65CB63',
      width: 200,
      height: 59,

      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '20px',
      textAlign: 'center',
      letterSpacing: '-0.04em',
      color: '#FFFFFF',
      borderRadius: '100px'
    }
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '22px',
    lineHeight: '130%',
    color: '#2D3047',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24
  },
  description: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '150%',
    textAlign: 'center',
    color: '#54658F'
  },
  box: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    borderRadius: 12,
    width: '80%'
  },
  boxItem: {
    width: '100%',
    paddingBottom: 32,
    paddingTop: 32,
    textAlign: 'center'
  },
  typo1: {
    fontSize: 18,
    fontWeight: 700,

    lineHeight: '104.5%',
    color: '#0D59EE'
  },
  typo2: {
    fontSize: 28,
    fontWeight: 800,

    lineHeight: '104.5%',
    color: '#2D3047',
    '& span': {
      color: '#2D304760'
    }
  },
  typo3: {
    fontSize: 16,
    fontWeight: 400,

    lineHeight: '104.5%',
    color: '#2D304760'
  },
  typo4: {
    fontSize: 16,
    fontWeight: 400,

    lineHeight: '150%',
    color: '#54658F90'
  },
  typo5: {
    fontSize: 20,
    fontWeight: 500,

    lineHeight: '150%',
    color: '#0D59EE'
  },
  buttonsBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& > button:nth-child(2)': {
      marginLeft: theme.spacing(3)
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      '& > button:nth-child(2)': {
        marginLeft: theme.spacing(0),
        marginTop: theme.spacing(2)
      }
    }
  },
  ApproveBtn: {
    background: '#0D59EE !important',
    '&:disabled': {
      background: '#2D3047 !important',
    }
  },
  ConfirmBtn: {
    background: 'linear-gradient(88.38deg, #4434FF 7.67%, #2B99FF 102.5%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%) !important',
    '&:disabled': {
      background: '#2D3047 !important',
    }
  }
}));

export default useModalStyles;
