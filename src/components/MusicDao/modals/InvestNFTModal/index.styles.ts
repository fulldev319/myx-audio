import { makeStyles } from '@material-ui/core/styles';

export const investNFTModalStyles = makeStyles((theme) => ({
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
  nftName: {
    fontWeight: 700,
    fontSize: '18px',
    lineHeight: '18.81px',
    color: '#2D3047',
    marginBottom: '18px'
  },
  nftLabel: {
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '19.2px',
    color: '#707582'
  },
  nftValue: {
    marginTop: theme.spacing(1),

    fontWeight: 800,
    fontSize: '18px',
    lineHeight: '21.6px',
    color: '#2D3047'
  },
  priceLabel: {
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '14.63px',
    color: '#2D3047'
  },
  price: {
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '18.81px',
    color: '#2D3047'
  },
  priceUSD: {
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '16.8px',
    color: '#ABB3C4'
  },
  bottomBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(238, 242, 246, 0.5)',
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(2)
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
  }
}));
