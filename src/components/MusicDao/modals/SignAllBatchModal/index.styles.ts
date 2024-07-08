import makeStyles from '@material-ui/core/styles/makeStyles';

export const useSignAllBatchModalStyles = makeStyles((theme) => ({
  root: {
    width: '665px !important',
    '& > svg': {}
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    '& h5': {
      margin: '0px 0px 16px',
      fontWeight: 800,
      fontSize: '22px',
      color: '#2D3047',
      lineHeight: '130%',
      textAlign: 'center'
    },
    '& h3': {
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '150%',
      textAlign: 'center',
      color: '#54658F',
      opacity: 0.9,
      marginTop: 24
    }
  },
  stepTitle: {
    marginTop: 32,
    display: 'flex',
    alignItems: 'center',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 16,

    '& label': {
      color: '#65CB63',
      marginRight: 10
    },
    '& div': {
      color: 'rgb(101, 116, 154)'
    }
  },
  stepSection1: {
    background: '#E0F3E9',
    borderRadius: 12,
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  stepSection2: {
    background: '#E0F3E9',
    borderRadius: 12,
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
    // "& span": {
    //   color: "#2D3047",
    // },
  },
  mintedBG: {
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)'
  },
  failedBG: {
    background: '#FA9EAF'
  },

  buttons: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: '32px',
    '& button': {
      fontSize: '16px',
      width: 150,
      [theme.breakpoints.down('xs')]: {
        fontSize: 14
      },
      '& img': {
        width: '12px'
      }
    }
  }
}));
